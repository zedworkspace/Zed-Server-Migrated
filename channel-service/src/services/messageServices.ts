import mongoose from "mongoose";
import Channel from "../models/channelModel";
import Message from "../models/messageModel";
import CustomError from "../utils/CustomError";
import axios from "axios";
import { IUser } from "zedspace-shared-types";
// Send a new message
export const sendMessage = async ({
  channelId,
  senderId,
  content,
  type,
}: {
  channelId: string;
  senderId: string;
  content: string;
  type: string;
}) => {
  const channel = await Channel.findById(channelId);
  if (!channel) {
    throw new CustomError("Channel not found", 404);
  }

  // Check if user is a member of the server
  // const isMember = await Member.findOne({ userId: senderId, projectId: channel.projectId });

  const url = `${process.env.PROJECT_SERVICE_URL}/${channel.projectId}/${senderId}?status=active`;
  const response = await axios.get(url);
  const isMember = response.data.data;

  if (!isMember) {
    throw new CustomError("User is not member of this project", 404);
  }

  const message = new Message({
    channelId,
    senderId,
    content,
    type,
  });

  return await message.save();
};

export const sendFile = async (messageData: {
  file: string;
  channelId: string;
  senderId: mongoose.Types.ObjectId;
}) => {
  const channel = await Channel.findById(messageData.channelId);
  if (!channel) {
    throw new CustomError("Channel not found", 404);
  }

  // const isMember = await Member.findOne({ userId: messageData.senderId, projectId: channel.projectId });
  const url = `${process.env.PROJECT_SERVICE_URL}/${channel.projectId}/${messageData.senderId}?status=active`;
  const response = await axios.get(url);
  const isMember = response.data.data;

  if (!isMember) {
    throw new CustomError("User is not member of this project", 404);
  }

  return messageData.file;
};

// Get messages from a channel
export const getMessagesByChannel = async (channelId: string) => {
  const userIds = (await Message.find({ channelId })).map(
    (channel) => channel.senderId
  );
  const url = process.env.USER_SERVICE_URL!;
  const { data } = await axios.post(url, userIds);
  const { data: users }: { data: IUser[] } = data;

  const messages = await Message.find({ channelId });
  const updatedMessages = messages.map((msg) => {
    const user = users.find(
      (user) => user._id.toString() === msg.senderId.toString()
    );
    return {
      ...msg.toObject(),
      senderId: user,
    };
  });
  return updatedMessages;
};

export const unReadMessages = async (userId: mongoose.Types.ObjectId) => {
  const messages = await Message.aggregate([
    { $match: { readBy: { $ne: userId } } },
    { $group: { _id: "$channelId", count: { $sum: 1 } } },
  ]);
  return messages;
};

export const readMessage = async (
  userId: mongoose.Types.ObjectId,
  channelId: string
) => {
  const message = await Message.updateMany(
    { channelId, readBy: { $ne: userId } },
    { $addToSet: { readBy: userId } }
  );
  return message;
};
