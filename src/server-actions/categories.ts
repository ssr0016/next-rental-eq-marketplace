"use server";

import supabaseConfig from "@/config/supabase-config";
import { ICategory } from "@/interfaces";

export const createCategory = async (category: Partial<ICategory>) => {
  try {
    const { data, error } = await supabaseConfig
      .from("categories")
      .insert([category]);
    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: "Category created successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getAllCategories = async () => {
  try {
    const { data, error } = await supabaseConfig
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: "Categories fetched successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const updateCategoryById = async (
  id: string,
  category: Partial<ICategory>,
) => {
  try {
    const { data, error } = await supabaseConfig
      .from("categories")
      .update(category)
      .eq("id", id);
    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: "Category updated successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const deleteCategoryById = async (id: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("categories")
      .delete()
      .eq("id", id);
    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      message: "Category deleted successfully",
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
