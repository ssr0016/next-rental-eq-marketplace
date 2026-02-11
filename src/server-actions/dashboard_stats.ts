"use server";

import supabaseConfig from "@/config/supabase-config";
import { DashboardStats, UserDashboardStats } from "@/interfaces";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const [categoriesRes, itemsRes, ordersRes, paymentsRes] = await Promise.all(
      [
        // Total categories
        supabaseConfig
          .from("categories")
          .select("id", { count: "exact", head: true }),

        // Total items
        supabaseConfig
          .from("items")
          .select("id", { count: "exact", head: true }),

        // Total orders (adjust table name if different)
        supabaseConfig
          .from("orders")
          .select("id", { count: "exact", head: true }),

        // Total payments received (adjust table name if different)
        supabaseConfig
          .from("payments")
          .select("id", { count: "exact", head: true }),
      ],
    );

    if (
      categoriesRes.error ||
      itemsRes.error ||
      ordersRes.error ||
      paymentsRes.error
    ) {
      throw new Error("Failed to fetch dashboard stats");
    }

    return {
      totalCategories: categoriesRes.count || 0,
      totalItems: itemsRes.count || 0,
      totalOrders: ordersRes.count || 0,
      totalPayments: paymentsRes.count || 0,
    };
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return {
      totalCategories: 0,
      totalItems: 0,
      totalOrders: 0,
      totalPayments: 0,
    };
  }
};

export const getUserDashboardStats = async (
  userId: string,
): Promise<UserDashboardStats> => {
  try {
    const [ordersRes, itemsRes, paymentsRes] = await Promise.all([
      // User's total orders
      supabaseConfig
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),

      // User's total items
      supabaseConfig
        .from("items")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),

      // User's total spend (sum of payments)
      supabaseConfig
        .from("payments")
        .select("amount", { count: "exact", head: false })
        .eq("user_id", userId),
    ]);

    // Calculate total spend
    const totalSpend =
      paymentsRes.data?.reduce(
        (sum: number, payment: any) => sum + parseFloat(payment.amount || 0),
        0,
      ) || 0;

    return {
      totalOrders: ordersRes.count || 0,
      totalItems: itemsRes.count || 0,
      totalSpend: Math.round(totalSpend),
    };
  } catch (error: any) {
    console.error("User dashboard stats error:", error);
    return {
      totalOrders: 0,
      totalItems: 0,
      totalSpend: 0,
    };
  }
};
