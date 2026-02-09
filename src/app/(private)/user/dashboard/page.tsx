
import { IUser } from "@/interfaces/index"
import { getLoggedInUser } from "@/server-actions/users"

async function UserDashboardPage() {
  const userResponse = await getLoggedInUser()

  if (!userResponse.success) {
    return "Unauthorized"
  }

  const user: IUser = userResponse.data

  return (
    <div className="flex flex-col gap-5 p-5">
      <h1>User Dashboard Page</h1>
      <h1>
        ID : {user.id}
      </h1>
      <h1>
        Name : {user.name}
      </h1>
      <h1>
        Email : {user.email}
      </h1>
      <h1>
        Role : {user.role}
      </h1>
    </div>
  )
}

export default UserDashboardPage