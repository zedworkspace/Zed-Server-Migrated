import { ICreateMessage } from "zedspace-shared-types";
import kafka from "../configs/kafka";
import Message from "../models/messageModel";
import { messageCreatedProducer, readMessageUpdateProducer } from "./producer";
import topicFallback from "./topicFallback";

const consumer = kafka.consumer({ groupId: "channel-service-group" });

export const startConsumer = async () => {
  try {
    await topicFallback("create_message")
    await topicFallback("read_message")
    await consumer.subscribe({ topics: ['create_message', 'read_message'], fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ topic, message }) => {

        if (topic === "create_message") {
          const { sender, msgInfo }: ICreateMessage = JSON.parse(
            message.value?.toString()!
          );
          const { content, fileUrl, type, channelId } = msgInfo;
          const newMessage = new Message({
            senderId: sender._id,
            content,
            fileUrl,
            type,
            channelId,
            readBy: [sender._id],
          });
          await newMessage.save();

          await messageCreatedProducer({ message: newMessage, sender });
        } else if (topic === "read_message") {

          const { channelId, userId }: { channelId: string, userId: string } = JSON.parse(
            message.value?.toString()!
          );

          const updatedMessages = await Message.updateMany(
            { channelId, readBy: { $ne: userId } },
            { $addToSet: { readBy: userId } }
          );

          if (updatedMessages.modifiedCount > 0) {
            await readMessageUpdateProducer({ channelId, userId })
          }

        }



      },
    });
  } catch (error) {

  }
}
export const createMessageConsumer = async () => {
  const topic = process.env.KAFKA_TOPIC_CREATE_MESSAGE || "create_message";
  try {
    await topicFallback(topic)
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ message }) => {
        const { sender, msgInfo }: ICreateMessage = JSON.parse(
          message.value?.toString()!
        );
        const { content, fileUrl, type, channelId } = msgInfo;
        const newMessage = new Message({
          senderId: sender._id,
          content,
          fileUrl,
          type,
          channelId,
          readBy: [sender._id],
        });
        await newMessage.save();

        await messageCreatedProducer({ message: newMessage, sender });
      },
    });
  } catch (error) {
    console.log("ERROR IN THE CREATE MESSAGE CONSUMER:", error);
  }
};
