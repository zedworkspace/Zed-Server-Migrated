import express from "express"
import cookieParser from "cookie-parser"
import { connectDB } from "./configs/db";
import dotenv from "dotenv";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import { config } from "./configs/config";
import boardRouter from "./routes/boardRouters";
import { initKafkaTopics } from "./kafka/admin";
import { consumeProjectCreated } from "./kafka/consumer";



const app = express()
dotenv.config();
const PORT = config.SERVER_PORT || 5003

connectDB()

app.use(express.json());
app.use(cookieParser());

app.use("/api/boards", boardRouter);

initKafkaTopics()
consumeProjectCreated()


app.use(globalErrorHandler);

const server = app.listen(PORT, () => {
    console.log("")
    console.log("██████╗  ██████╗  █████╗ ██████╗ ██████╗     ███████╗███████╗██████╗ ██╗   ██╗██╗ ██████╗███████╗")
    console.log("██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██╔══██╗    ██╔════╝██╔════╝██╔══██╗██║   ██║██║██╔════╝██╔════╝")
    console.log("██████╔╝██║   ██║███████║██████╔╝██║  ██║    ███████╗█████╗  ██████╔╝██║   ██║██║██║     █████╗  ")
    console.log("██╔══██╗██║   ██║██╔══██║██╔══██╗██║  ██║    ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██║██║     ██╔══╝  ")
    console.log("██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝    ███████║███████╗██║  ██║ ╚████╔╝ ██║╚██████╗███████╗")
    console.log("╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝     ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚═╝ ╚═════╝╚══════╝")
    console.log("")
    console.log("🏃‍♂️ ZED IS RUNNING AND READY!")
    console.log(`⚡ Server active on http://localhost:${PORT}`)
})

process.on('SIGTERM', () => {
    console.debug('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.debug('HTTP server closed');
    });
});