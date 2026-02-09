"use client"

import usersGlobalStore, { IUsersGlobalSore } from "@/store/users-store"

function AdminDashboardPage() {
  const { user } = usersGlobalStore() as IUsersGlobalSore

  return (
    <div className="flex flex-col gap-5 p-5">
      <h1>Admin Dashboard age</h1>
      <h1>
        ID : {user?.id}
      </h1>
      <h1>
        Name : {user?.name}
      </h1>
      <h1>
        Email : {user?.email}
      </h1>
      <h1>
        Role : {user?.role}
      </h1>
    </div>
  )
}

export default AdminDashboardPage