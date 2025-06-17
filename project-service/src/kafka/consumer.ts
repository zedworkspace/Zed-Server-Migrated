import { ICardMovedEvent } from "zedspace-shared-types";
import kafka from "../configs/kafka";
import Activity from "../models/activityModel";
import topicFallback from "./topicFallback";

const consumer = kafka.consumer({ groupId: "project-service-group" });

export const consumeCardMoved = async () => {
  const topic = process.env.KAFKA_TOPIC_CARD_MOVED || "card_moved";

  try {
    await topicFallback(topic);
    console.log("Consumer connecting...");
    await consumer.connect();
    console.log("Consumer connected...");

    await consumer.subscribe({ topic, fromBeginning: true });
    await consumer.run({
      eachMessage: async ({ message }) => {
        const messageValueStr = message.value?.toString();
        let parsedMessage: ICardMovedEvent;
        try {
          parsedMessage = JSON.parse(messageValueStr || "{}");
        } catch (error) {
          console.error("Failed to parse Kafka message:", error);
          return;
        }
        console.log("Parsed Message:", parsedMessage);

        const {
          action,
          details,
          entityId,
          entityType,
          newValue,
          timestamp,
          user,
          oldValue,
        } = parsedMessage;
        await Activity.create({
          action,
          details,
          entityId,
          entityType,
          newValue,
          oldValue,
          timestamp,
          user,
        });
      },
    });
  } catch (error) {
    console.log("Error in consumeCardMoved:", error);
  }
};
