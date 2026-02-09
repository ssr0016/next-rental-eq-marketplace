export interface IUser {
  id: string;
  name: string;
  email: string;
  profile_pic: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
}

export interface ICategory {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  user_id: string;
}
