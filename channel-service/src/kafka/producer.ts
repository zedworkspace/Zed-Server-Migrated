import { IMessage, IMessageCreated } from "zedspace-shared-types";
import kafka from "../configs/kafka";

const producer = kafka.producer();

export const connectProducer = async () => {
  try {
    console.log("producer connecting...");
    await producer.connect();
    console.log("producer connected...");
  } catch (error) {
    console.log("Error while connecting producer:", error);
  }
};

export const messageCreatedProducer = async ({
  sender,
  message,
}: IMessageCreated) => {
  try {
    const value = JSON.stringify({ sender, message });
    await producer.send({
      topic: "message_created",
      messages: [{ key: message._id?.toString(), value }],
    });
  } catch (error) {
    console.error("MESSAGE CREATED PRODUCER ERROR:", error);
  }
};

export const sendMessageProducer = async ({
  channelId,
  message,
}: {
  channelId: string;
  message: IMessage;
}) => {
  await producer.send({
    topic: "send_message",
    messages: [{ key: channelId, value: JSON.stringify(message) }],
  });
};

export const readMessageUpdateProducer = async (data: { channelId: string, userId: string }) => {
  try {
    await producer.send({
      topic: "read_message_update",
      messages: [{ key: data.channelId, value: JSON.stringify(data) }],
    });
    console.error("MESSAGE READ UPDATE PUBLISHED....");
  } catch (error) {
    console.error("MESSAGE READ UPDATE PRODUCER ERROR:", error);
  }
}