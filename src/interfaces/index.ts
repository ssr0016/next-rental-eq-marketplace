export interface IUser {
  id: string;
  name: string;
  email: string;
  profile_pic: string;
  password: string;
  role: "user" | "admin";
  created_at: string;
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
  id: number;
  name: string;
  description: string;
  images: string[];
  rent_per_day: number;
  available_quantity: number;
  total_quantity: number;
  category_id: string;
  created_at: string;
  updated_at: string;

  // runtime only
  category: ICategory;
}

export interface IRentOrder {
  id: string;
  item_id: string;
  user_id: string;
  from_date: Date;
  to_date: Date;
  quantity: number;
  total_amount: number;
  total_days: number;
  status: "booked" | "returned" | "cancelled" | "completed" | "with-customer";
  created_at: string;
  updated_at: string;

  // runtime only
  item?: ItemInterface;
  user?: IUser;
}

export interface DashboardStats {
  totalCategories: number;
  totalItems: number;
  totalOrders: number;
  totalPayments: number;
}

export interface UserDashboardStats {
  totalOrders: number;
  totalItems: number;
  totalSpend: number;
}
