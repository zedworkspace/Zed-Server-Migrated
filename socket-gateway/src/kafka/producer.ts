import { ISendMessageInfo } from "zedspace-shared-types";
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

export const sendMessageProducer = async (data: ISendMessageInfo) => {
  try {
    console.log("SEND MESSAGE PRODUCER IS RUNNING....");
    console.log("SEND MESSAGE PRODUCER Data:", data);
    await producer.send({
      topic: "send_message",
      messages: [{ key: data.channelId, value: JSON.stringify(data) }],
    });
    console.log("SEND MESSAGE IS PUBLISHED...");
  } catch (error) {
    console.error("SEND MESSAGE PRODUCER HAVE ERROR:", error);
  }
};

export const readMessageProducer = async (data: {
  channelId: string;
  userId: string;
}) => {
  try {
    console.log("READ MESSAGE PRODUCER IS RUNNING....");
    console.log("READ MESSAGE PRODUCER Data:", data);
    await producer.send({
      topic: "read_message",
      messages: [{ value: JSON.stringify(data) }],
    });
    console.log("READ MESSAGE IS PUBLISHED...");
  } catch (error) {
    console.error("READ MESSAGE PRODUCER HAVE ERROR:", error);
  }
};
