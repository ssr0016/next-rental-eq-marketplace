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
