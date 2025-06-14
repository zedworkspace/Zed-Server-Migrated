import kafka from "../configs/kafka";
import User from "../models/userModel";
import { createMessageProducer } from "./producer";
import topicFallback from "./topicFallback";
import { ISendMessageInfo } from "zedspace-shared-types";

const consumer = kafka.consumer({ groupId: "user-service-group" });

export const sendMessageConsumer = async () => {
  const topic = "send_message";
  try {
    await topicFallback(topic);

    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ message, topic }) => {
        const messageValueStr = message.value?.toString();
        let parsedMessage: ISendMessageInfo;
        try {
          parsedMessage = JSON.parse(messageValueStr || "{}");
        } catch (error) {
          console.error("Failed to parse Kafka message:", error);
          return;
        }
        const sender = await User.findById(parsedMessage.senderId._id);
        if (!sender) return;

        await createMessageProducer(sender, parsedMessage);
      },
    });
  } catch (error) {}
};
