"use server";

import supabaseConfig from "@/config/supabase-config";

export const createRentOrder = async (payload: any) => {
  try {
    const { data, error } = await supabaseConfig
      .from("orders")
      .insert([payload]);
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getItemAvailability = async ({
  itemId,
  fromDate,
  toDate,
  requestedQuantity,
  totalQuantity,
}: {
  itemId: number;
  fromDate: string;
  toDate: string;
  requestedQuantity: number;
  totalQuantity: number;
}) => {
  try {
    // step 1 : fetch the quantity of all orders for the item in the date range
    const { data, error } = await supabaseConfig
      .from("orders")
      .select("quantity")
      .neq("status", "cancelled")
      .lte("from_date", toDate)
      .gte("to_date", fromDate);
    if (error) {
      throw new Error(error.message);
    }

    // step 2 : some the quantity of all the orders for the item in the date range
    const totalBookedQuantity = data?.reduce(
      (acc: number, order: { quantity: number }) => acc + order.quantity,
      0,
    );

    // if totalQuantity - sum of orders >= requestedQuantity, then available
    const isAvailable =
      totalQuantity - totalBookedQuantity >= requestedQuantity;
    return {
      success: isAvailable,
      availableQuantity: totalQuantity - totalBookedQuantity,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getUserOrders = async (userId: string) => {
  try {
    const { data, error } = await supabaseConfig
      .from("orders")
      .select("*, items(name)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      data: data.map((order: any) => ({
        ...order,
        item: order.items,
      })),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const updateRentOrder = async (orderId: number, payload: any) => {
  try {
    const { data, error } = await supabaseConfig
      .from("orders")
      .update(payload)
      .eq("id", orderId);
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getAllOrders = async () => {
  try {
    const { data, error } = await supabaseConfig
      .from("orders")
      .select("*, items(name), user_profiles(name)")
      .order("created_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: data.map((order: any) => ({
        ...order,
        item: order.items,
        user: order.user_profiles,
      })),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
