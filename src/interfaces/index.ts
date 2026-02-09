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
  created_at: string;
  updated_at: string;
  user_id: string;
}
export interface ItemInterface {
  id: string;
  name: string;
  description: string;
  images: string[];
  rent_per_day: number;
  available_quantity: number;
  total_quantity: number;
  category_id: string;
  created_at: string;
  updated_at: string;
}
