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

app.use("/api/v1", proxy(config.USER_SERVICE_URL, proxyOptions))

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