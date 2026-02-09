"use server";

import supabaseConfig from "@/config/supabase-config";
import { ItemInterface } from "@/interfaces";
export const addNewItem = async (item: ItemInterface) => {
  try {
    const { data, error } = await supabaseConfig.from("items").insert([item]);
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      message: "Item added successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getAllItems = async () => {
  try {
    const { data, error } = await supabaseConfig
      .from("items")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      message: "Items fetched successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getItemById = async (id: number) => {
  try {
    const { data, error }: any = await supabaseConfig
      .from("items")
      .select("*")
      .eq("id", id);
    if (error || data.length === 0) {
      throw new Error(error.message || "Item not found");
    }
    return {
      success: true,
      message: "Item fetched successfully",
      data: data[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const updateItemById = async (
  id: number,
  item: Partial<ItemInterface>,
) => {
  try {
    const { data, error } = await supabaseConfig
      .from("items")
      .update(item)
      .eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      message: "Item updated successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const deleteItemById = async (id: number) => {
  try {
    const { data, error } = await supabaseConfig
      .from("items")
      .delete()
      .eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      message: "Item deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
