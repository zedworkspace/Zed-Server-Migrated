import { IMessageCreated } from "zedspace-shared-types";
import kafka from "../configs/kafka";
import { getIO } from "../server";
import topicFallback from "./topicFallback";

const consumer = kafka.consumer({
  groupId: "socket-gateway-group",
  sessionTimeout: 30000,
  rebalanceTimeout: 60000,
  heartbeatInterval: 3000,
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

export const startKafkaConsumers = async () => {
  try {
    await topicFallback("message_created");
    await topicFallback("send_message");
    await topicFallback("read_message_update");
    await topicFallback("list_created");
    await topicFallback("card_created");

    await consumer.connect();

    await consumer.subscribe({
      topics: [
        "message_created",
        "send_message",
        "read_message_update",
        "list_created",
        "card_created",
      ],
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        console.log("TOPIC:", topic);
        const io = getIO();
        if (topic === "message_created") {
          const data: IMessageCreated = JSON.parse(message.value?.toString()!);

          const {
            sender,
            message: {
              channelId,
              content,
              fileUrl,
              readBy,
              type,
              _id,
              createdAt,
              senderId,
            },
          } = data;
          console.log("message:", message);
          io.to(channelId.toString()).emit("receiveMessage", {
            _id: _id,
            senderId,
            content,
            fileUrl,
            type,
            channelId,
            readBy: readBy,
            createdAt,
          });

          io.to(channelId.toString()).emit("newUnreadMessage", {
            channelId,
            count: 1,
            senderId: sender._id,
          });
        } else if (topic === "read_message_update") {
          const { channelId, userId }: { channelId: string; userId: string } =
            JSON.parse(message.value?.toString()!);
          io.to(channelId).emit("messagesRead", { channelId, userId });
        } else if (topic === "list_created") {
          const lists: any[] = JSON.parse(message.value?.toString()!);

          io.emit("onUpdateList", lists);
        } else if (topic === "card_created") {
          const lists: any[] = JSON.parse(message.value?.toString()!);
          io.emit("onUpdateList", lists);
        } else if (topic === "board_updated") {
          const lists: any[] = JSON.parse(message.value?.toString()!);
          io.emit("onUpdateList", lists);
        }
      },
    });

    console.log("Kafka Consumers started successfully for both topics");
  } catch (error) {
    console.log("KAFKA CONSUMER ERROR:", error);
  }
};
