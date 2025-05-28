import dotenv from "dotenv";
dotenv.config();

export const config = {
    SERVER_PORT: process.env.SERVER_PORT,
    USER_SERVICE_URL: process.env.USER_SERVICE_URL as string
}