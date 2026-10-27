export interface IUser {
  _id: string;
  name: string; 
  followersCount:number;
  mutualFollowersCount:number;
  followingCount:number;
  bookmarksCount:number;
  username: string;
  email: string;
  photo: string;
  cover: string;
}
