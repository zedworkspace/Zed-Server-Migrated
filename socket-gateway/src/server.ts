import express from "express";
import { Server } from "socket.io";
import http from "node:http";
import { config } from "./configs/config";
import { connectProducer, readMessageProducer, sendMessageProducer } from "./kafka/producer";
import { ISendMessageInfo } from "zedspace-shared-types";
import { startKafkaConsumers } from "./kafka/consumer";
import { initKafkaTopics } from "./kafka/admin";
import { waitForKafka } from "./kafka/waitForKafka";
const app = express();

const server = http.createServer(app);
const PORT = config.SERVER_PORT || 5005
var io = new Server(server, {
  cors: {
    origin: config.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
    credentials: true,
  },
});

const startServer = async () => {
  await initKafkaTopics()
  await waitForKafka()
  await startKafkaConsumers()
  await connectProducer()
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinRoom", (channelId, userId) => {
      console.log("io-channelId:", channelId);
      console.log("io-userId:", userId);
      socket.join(channelId);
      console.log(`User joined room: ${channelId}, ${userId}`);
    });

    socket.on("sendMessage", async (data: ISendMessageInfo) => {
      try {
        await sendMessageProducer(data);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on("readMessage", async (data) => {
      try {
        await readMessageProducer(data)
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    });


  });

  server.listen(PORT, () => {
    console.log("")
    console.log("███████╗ ██████╗  ██████╗██╗  ██╗███████╗████████╗     ██████╗  █████╗ ████████╗███████╗██╗    ██╗ █████╗ ██╗   ██╗")
    console.log("██╔════╝██╔═══██╗██╔════╝██║ ██╔╝██╔════╝╚══██╔══╝    ██╔════╝ ██╔══██╗╚══██╔══╝██╔════╝██║    ██║██╔══██╗╚██╗ ██╔╝")
    console.log("███████╗██║   ██║██║     █████╔╝ █████╗     ██║       ██║  ███╗███████║   ██║   █████╗  ██║ █╗ ██║███████║ ╚████╔╝ ")
    console.log("╚════██║██║   ██║██║     ██╔═██╗ ██╔══╝     ██║       ██║   ██║██╔══██║   ██║   ██╔══╝  ██║███╗██║██╔══██║  ╚██╔╝  ")
    console.log("███████║╚██████╔╝╚██████╗██║  ██╗███████╗   ██║       ╚██████╔╝██║  ██║   ██║   ███████╗╚███╔███╔╝██║  ██║   ██║   ")
    console.log("╚══════╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝        ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝   ")
    console.log("")
    console.log("🏃‍♂️ ZED IS RUNNING AND READY!")
    console.log(`⚡ Server active on http://localhost:${PORT}`)
  });
};
startServer();

export function getIO() {
  return io
};
