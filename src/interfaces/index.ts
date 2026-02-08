export interface IUser {
  id: string;
  name: string;
  email: string;
  profile_pic: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
}
