import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./configs/db";
import dotenv from "dotenv";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import { config } from "./configs/config";
import channelRouter from "./routes/channelRoutes";
import messageRouter from "./routes/messageRoutes";
import { createMessageConsumer } from "./kafka/consumer";
import { initKafkaTopics } from "./kafka/admin";
import { connectProducer } from "./kafka/producer";

dotenv.config();

const app = express();
const PORT = config.SERVER_PORT || 5004;

app.use(express.json());
app.use(cookieParser());

app.use("/api/channel", channelRouter);
app.use("/api/messages", messageRouter);

app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await connectDB();
    await initKafkaTopics()
    await createMessageConsumer();
    await connectProducer()
    const server = app.listen(PORT, () => {
      console.log("")
      console.log(" ██████╗██╗  ██╗ █████╗ ███╗   ██╗███╗   ██╗███████╗██╗         ███████╗███████╗██████╗ ██╗   ██╗██╗ ██████╗███████╗")
      console.log("██╔════╝██║  ██║██╔══██╗████╗  ██║████╗  ██║██╔════╝██║         ██╔════╝██╔════╝██╔══██╗██║   ██║██║██╔════╝██╔════╝")
      console.log("██║     ███████║███████║██╔██╗ ██║██╔██╗ ██║█████╗  ██║         ███████╗█████╗  ██████╔╝██║   ██║██║██║     █████╗  ")
      console.log("██║     ██╔══██║██╔══██║██║╚██╗██║██║╚██╗██║██╔══╝  ██║         ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██║██║     ██╔══╝  ")
      console.log("╚██████╗██║  ██║██║  ██║██║ ╚████║██║ ╚████║███████╗███████╗    ███████║███████╗██║  ██║ ╚████╔╝ ██║╚██████╗███████╗")
      console.log(" ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝╚══════╝    ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚═╝ ╚═════╝╚══════╝")
      console.log("")
      console.log("🏃‍♂️ ZED IS RUNNING AND READY!")
      console.log(`⚡ Server active on http://localhost:${PORT}`);
    });

    process.on("SIGTERM", () => {
      console.debug("SIGTERM signal received: closing HTTP server");
      server.close(() => {
        console.debug("HTTP server closed");
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
