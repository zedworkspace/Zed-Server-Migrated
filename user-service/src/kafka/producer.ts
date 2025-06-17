import { ISendMessageInfo, IUser } from "zedspace-shared-types";
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

export const createMessageProducer = async (
  sender: IUser,
  msgInfo: ISendMessageInfo
) => {
  try {
    console.log("CRAETE MESSAGE PRODUCER IS RUNNING....");
    await producer.send({
      topic: process.env.KAFKA_TOPIC_CREATE_MESSAGE || "create_message",
      messages: [{ value: JSON.stringify({ sender, msgInfo }) }],
    });
    console.log("CREATE MESSAGE IS PUBLISHED...");
  } catch (error) {
    console.error("CREATE MESSAGE PRODUCER HAVE ERROR:", error);
  }
};
