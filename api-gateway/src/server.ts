import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import proxy from "express-http-proxy"
import { config } from "./config/config";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import CustomError from "./utils/CustomError";
const app = express();
const PORT = config.SERVER_PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


const proxyOptions = {
  proxyReqPathResolver(req: Request) {
    return req.originalUrl.replace(/^\/api\/v1/, "/api")
  },
  proxyErrorHandler(err: any, res: Response, next: NextFunction) {
    console.error(`Proxy error: ${err.message}`)
    next(new CustomError("Internal server error", 500))
  },
}


// user service
app.use("/api/v1/user", proxy(config.USER_SERVICE_URL, proxyOptions))
app.use("/api/v1/profile", proxy(config.USER_SERVICE_URL, proxyOptions))
app.use("/api/v1/logout", proxy(config.USER_SERVICE_URL, proxyOptions))

// project service
app.use("/api/v1/projects", proxy(config.PROJECT_SERVICE_URL, proxyOptions))
app.use("/api/v1/invite", proxy(config.PROJECT_SERVICE_URL, proxyOptions))
app.use("/api/v1/activity", proxy(config.PROJECT_SERVICE_URL, proxyOptions))
app.use("/api/v1/project/members", proxy(config.PROJECT_SERVICE_URL, proxyOptions))

// board service
app.use("/api/v1/boards", proxy(config.BOARD_SERVICE_URL, proxyOptions))
app.use("/api/v1/lists", proxy(config.BOARD_SERVICE_URL, proxyOptions))
app.use("/api/v1/cards", proxy(config.BOARD_SERVICE_URL, proxyOptions))

// channel service
app.use("/api/v1/channel", proxy(config.CHANNEL_SERVICE_URL, proxyOptions))
app.use("/api/v1/messages", proxy(config.CHANNEL_SERVICE_URL, proxyOptions))

app.use(globalErrorHandler)

const server = app.listen(PORT, () => {
  console.log("")
  console.log(" ███████╗███████╗██████╗    ██████╗  █████╗ ████████╗███████╗██╗    ██╗ █████╗ ██╗   ██╗")
  console.log(" ╚══███╔╝██╔════╝██╔══██╗  ██╔════╝ ██╔══██╗╚══██╔══╝██╔════╝██║    ██║██╔══██╗╚██╗ ██╔╝")
  console.log("   ███╔╝ █████╗  ██║  ██║  ██║  ███╗███████║   ██║   █████╗  ██║ █╗ ██║███████║ ╚████╔╝")
  console.log("  ███╔╝  ██╔══╝  ██║  ██║  ██║   ██║██╔══██║   ██║   ██╔══╝  ██║███╗██║██╔══██║  ╚██╔╝")
  console.log(" ███████╗███████╗██████╔╝  ╚██████╔╝██║  ██║   ██║   ███████╗╚███╔███╔╝██║  ██║   ██║")
  console.log(" ╚══════╝╚══════╝╚═════╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝")
  console.log("")
  console.log("🏃‍♂️ ZED GATEWAY IS RUNNING AND READY!")
  console.log(`⚡ Server active on http://localhost:${PORT}`)
});

process.on('SIGTERM', () => {
  console.debug('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.debug('HTTP server closed');
  });
});