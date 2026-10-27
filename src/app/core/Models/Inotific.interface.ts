import { IPost } from "./Ipost.interface";

export interface INotific {
    _id: string;
  recipient: {
    _id: string;
    name: string;
    photo: string;
  };
  actor: {
    _id: string;
    name: string;
    photo: string;
  };
  entity:IPost;
  type: string;
  entityType: string;
  entityId: string;
  isRead: boolean;
  createdAt: string;
  readAt: string;

}


export interface Icount{
  unreadCount:number

}
