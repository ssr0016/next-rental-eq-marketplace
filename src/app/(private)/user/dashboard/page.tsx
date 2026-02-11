import { Card, CardContent } from "@/components/ui/card"
import { IUser, UserDashboardStats } from "@/interfaces/index"
import { getUserDashboardStats } from "@/server-actions/dashboard_stats"
import { getLoggedInUser } from "@/server-actions/users"
import { DollarSign, Package, ShoppingCart } from "lucide-react"

interface UserDashboardStatsProps {
  stats: UserDashboardStats
}

function StatsCard({ title, value, icon: Icon, color }: { title: string; value: any; icon: any; color: string }) {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-gray-600 mt-1">{title}</p>
          </div>
          <div className={`p-3 ${color} rounded-xl`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

async function UserDashboardPage() {
  const userResponse = await getLoggedInUser()

  if (!userResponse.success) {
    return "Unauthorized"
  }

  const user: IUser = userResponse.data
  const stats: UserDashboardStats = await getUserDashboardStats(user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-xl text-gray-600">Welcome back, {user.name}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          color="bg-purple-500"
        />
        <StatsCard
          title="Total Items"
          value={stats.totalItems}
          icon={Package}
          color="bg-green-500"
        />
        <StatsCard
          title="Total Spend"
          value={`$${stats.totalSpend}`}
          icon={DollarSign}
          color="bg-orange-500"
        />
      </div>
    </div>
  )
}

export default UserDashboardPage
