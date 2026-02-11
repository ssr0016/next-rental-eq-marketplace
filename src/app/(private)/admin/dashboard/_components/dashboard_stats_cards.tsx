"use client"

import { Card, CardContent } from "@/components/ui/card"
import { DashboardStats } from "@/interfaces"

import { DollarSign, Package, ShoppingCart, Users } from "lucide-react"

interface DashboardStatsProps {
  stats: DashboardStats
}

export default function DashboardStatsComponent({ stats }: DashboardStatsProps) {
  const statCards = [
    { value: stats.totalCategories, label: "Categories", icon: Users, color: "bg-blue-500" },
    { value: stats.totalItems, label: "Items", icon: Package, color: "bg-green-500" },
    { value: stats.totalOrders, label: "Orders", icon: ShoppingCart, color: "bg-purple-500" },
    { value: stats.totalPayments, label: "Payments", icon: DollarSign, color: "bg-orange-500" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-600 mt-1">{stat.label}</p>
                </div>
                <div className={`p-3 ${stat.color} rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
