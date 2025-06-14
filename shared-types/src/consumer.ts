import { IMessage, ISendMessageInfo } from "./message";
import { IUser } from "./user";

export interface ICreateMessage {
  sender: IUser;
  msgInfo: ISendMessageInfo;
}

export interface IMessageCreated {
  sender: IUser;
  message: IMessage;
}
