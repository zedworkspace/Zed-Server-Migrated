import express from "express";
import { getBulkUsers } from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.post("/", getBulkUsers);

export default userRouter;
