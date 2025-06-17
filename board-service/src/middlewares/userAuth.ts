import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import CustomError from "../utils/CustomError";
import { config } from "../configs/config";
import mongoose from "mongoose";
// import { IUser } from "../interfaces/userInterface";



export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token)
    return next(new CustomError("Access denied, token missing!", 401));

  const JWT_SECRET_KEY = config.JWT_SECRET_KEY;
  if (!JWT_SECRET_KEY) return next(new CustomError("Key missing!", 400));

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
    if (!decoded) return next(new CustomError("Access Forbidden", 403));
    req.user = decoded as {
      _id: mongoose.Types.ObjectId;
      name: string;
      email: string;
      password?: string;
      profileImg?: string;
      bio: string;
      bannerImg?: string;
      gitHubId?: string;
      googleId?: string;
      createdAt: string;
      servers: mongoose.Types.ObjectId[]
    }
    next();
  } catch (error) {
    next(new CustomError("Invalid token", 401));
  }
};
