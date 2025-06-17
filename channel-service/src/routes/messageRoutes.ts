import express, { Router } from "express";
import { getMessagesByChannel, readMessage, sendFile, sendMessage, unReadMessages } from "../controllers/messageController";
import upload from "../middlewares/imageUploadingMiddleware";
import { userAuth } from "../middlewares/userAuth";

const messageRouter:Router = express.Router();

messageRouter.post("/send", sendMessage);
messageRouter.post('/file', userAuth,upload.single("fileMessage"),sendFile)
messageRouter.get("/:channelId", getMessagesByChannel);
messageRouter.get('/get/unread',userAuth,unReadMessages)
messageRouter.put('/read/:channelId',userAuth,readMessage)

export default messageRouter;
