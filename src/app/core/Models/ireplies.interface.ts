export interface Ireplies {
  _id: string;
  content: string;
  commentCreator: ICommentCreator;
  post: string;
  image?:string;
  parentComment?: string;
  likes: string[];
  createdAt: string;
  likesCount: number;
  isReply: boolean;
  id: string;
}


export interface ICommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  id: string;
}