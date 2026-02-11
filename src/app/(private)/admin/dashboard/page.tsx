"use client"

import DashboardStatsComponent from "@/app/(private)/admin/dashboard/_components/dashboard_stats_cards"
import PageTitle from "@/components/ui/page-title"
import { getDashboardStats } from "@/server-actions/dashboard_stats"

import usersGlobalStore, { IUsersGlobalSore } from "@/store/users-store"
import { useEffect, useState } from "react"

function AdminDashboardPage() {
  const { user } = usersGlobalStore() as IUsersGlobalSore
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats().then(setStats).finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <PageTitle title="Admin Dashboard" />
      <p className="text-xl text-gray-600 mt">Welcome, {user?.name}!</p>
      {stats && <DashboardStatsComponent stats={stats} />}
    </div>
  )
}

export default AdminDashboardPage
