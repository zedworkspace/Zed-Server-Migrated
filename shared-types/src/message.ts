import mongoose from "mongoose";

export interface IMessage {
  _id?: string
  channelId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content: string;
  fileUrl: string;
  type: string;
  createdAt: Date;
  readBy: [mongoose.Types.ObjectId];
}

export interface ISendMessageInfo {
  channelId: string;
  fileUrl: string;
  senderId: { _id: string, name: string, profileImg: string };
  content: string;
  type: string;
}


