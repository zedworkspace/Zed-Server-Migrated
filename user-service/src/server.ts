import express from "express"
import cookieParser from "cookie-parser"
import authRouter from "./routes/authRouters";
import { connectDB } from "./configs/db";
import dotenv from "dotenv";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import { config } from "./configs/config";

const app = express()
dotenv.config();
const PORT = config.SERVER_PORT || 5001

connectDB()

app.use(express.json());
app.use(cookieParser());

app.use("/api", authRouter);

app.use(globalErrorHandler);




const server = app.listen(PORT, () => {
    console.log("")
    console.log(" ███████╗███████╗██████╗ ")
    console.log(" ╚══███╔╝██╔════╝██╔══██╗")
    console.log("   ███╔╝ █████╗  ██║  ██║")
    console.log("  ███╔╝  ██╔══╝  ██║  ██║")
    console.log(" ███████╗███████╗██████╔╝")
    console.log(" ╚══════╝╚══════╝╚═════╝ ")
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