import { ICreateCard, ISendMessageInfo } from "zedspace-shared-types";
import kafka from "../configs/kafka";

const producer = kafka.producer();

export const connectProducer = async () => {
  try {
    await producer.connect();
  } catch (error) {
    console.log("Error while connecting producer:", error);
  }
};

export const sendMessageProducer = async (data: ISendMessageInfo) => {
  try {

    await producer.send({
      topic: "send_message",
      messages: [{ key: data.channelId, value: JSON.stringify(data) }],
    });
  } catch (error) {
    console.error("SEND MESSAGE PRODUCER HAVE ERROR:", error);
  }
};

export const readMessageProducer = async (data: {
  channelId: string;
  userId: string;
}) => {
  try {
    await producer.send({
      topic: "read_message",
      messages: [{ value: JSON.stringify(data) }],
    });
  } catch (error) {
    console.error("READ MESSAGE PRODUCER HAVE ERROR:", error);
  }
};

export const createListProducer = async (data: {
  body: { name: string };
  boardId: string;
}) => {
  try {
    await producer.send({
      topic: "create_list",
      messages: [{ value: JSON.stringify(data) }],
    });
  } catch (error) {
    console.error("CREATE LIST PRODUCER HAVE ERROR:", error);
  }
};

export const createCardProducer = async (data: ICreateCard) => {
  try {
    await producer.send({
      topic: "create_card",
      messages: [{ value: JSON.stringify(data) }],
    });
  } catch (error) {
    console.error("CREATE CARD PRODUCER HAVE ERROR:", error);
  }
};

export const boardUpdateProducer = async (data: { boardId: string }) => {
  try {
    await producer.send({
      topic: "board_updated",
      messages: [{ value: JSON.stringify(data) }],
    });
  } catch (error) {
    console.error("BOARD UPDATE PRODUCER HAVE ERROR:", error);
  }
};
