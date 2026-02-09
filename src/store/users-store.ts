import { IUser } from "@/interfaces";
import { create } from "zustand";

const usersGlobalStore = create((set) => ({
  users: null,
  setUser: (user: IUser) => set({ user }),
}));

export default usersGlobalStore;

export interface IUsersGlobalSore {
  user: IUser | null;
  setUser: (user: IUser) => void;
}
