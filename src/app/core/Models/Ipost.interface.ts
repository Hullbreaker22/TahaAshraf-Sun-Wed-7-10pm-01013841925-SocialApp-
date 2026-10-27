export interface IPost {
    _id: string;
    body?: string;
    image?: string;
    privacy?: "public" | "private";
    user?: InterUser; 
    unavailable?: boolean;
    sharedPost?: IPost | null; 
    likes?: string[];
    createdAt?: string;
    commentsCount?: number;
    topComment?: unknown | null;
    sharesCount?: number;
    likesCount?: number;
    isShare?: boolean;
    id?: string;
    bookmarked?: boolean;
}

export interface InterUser {
  _id: string;
  name: string;
  username: string;
  photo?: string; 
}