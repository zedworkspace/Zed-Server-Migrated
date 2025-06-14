import express from "express"
import cookieParser from "cookie-parser"
import { connectDB } from "./configs/db";
import dotenv from "dotenv";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import { config } from "./configs/config";
import projectRouter from "./routes/projectRouters";
import { initKafkaTopics } from "./kafka/admin";
import { connectProducer } from "./kafka/producer";
import inviteRouter from "./routes/inviteRoutes";
import memberRouter from "./routes/membersRoutes";
import activityRouter from "./routes/activityRoutes";


const app = express()
dotenv.config();
const PORT = config.SERVER_PORT || 5002

connectDB()

initKafkaTopics().then(() => { connectProducer() })

app.use(express.json());
app.use(cookieParser());


app.use("/api/projects", projectRouter);
app.use("/api/invite", inviteRouter);
app.use("/api/project/members", memberRouter);
app.use("/api/activity", activityRouter);

app.use(globalErrorHandler);

const server = app.listen(PORT, async () => {
    console.log("")
    console.log("██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗    ███████╗███████╗██████╗ ██╗   ██╗██╗ ██████╗███████╗")
    console.log("██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝    ██╔════╝██╔════╝██╔══██╗██║   ██║██║██╔════╝██╔════╝")
    console.log("██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║       ███████╗█████╗  ██████╔╝██║   ██║██║██║     █████╗  ")
    console.log("██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║       ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██║██║     ██╔══╝  ")
    console.log("██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║       ███████║███████╗██║  ██║ ╚████╔╝ ██║╚██████╗███████╗")
    console.log("╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝       ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚═╝ ╚═════╝╚══════╝")
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