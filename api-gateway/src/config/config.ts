import dotenv from "dotenv";
dotenv.config();

export const config = {
    SERVER_PORT: process.env.SERVER_PORT,
    USER_SERVICE_URL: process.env.USER_SERVICE_URL as string,
    PROJECT_SERVICE_URL: process.env.PROJECT_SERVICE_URL as string,
    BOARD_SERVICE_URL: process.env.BOARD_SERVICE_URL as string
}