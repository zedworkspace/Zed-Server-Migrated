import dotenv from "dotenv";
dotenv.config();

export const config = {
    SERVER_PORT : process.env.SERVER_PORT,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
}