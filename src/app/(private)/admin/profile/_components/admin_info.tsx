import { IUser } from "@/interfaces"
import dayjs from "dayjs"

interface ProfileInfoProps {
  user: IUser
}

function AdminProfileInfo({ user }: ProfileInfoProps) {
  return (
    <div className="flex flex-col gap-5 p-6 bg-white rounded-lg shadow">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {user.name?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-sm text-gray-500">Member since {dayjs(user.created_at).format('MMMM D, YYYY')}</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">ID</label>
          <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm">{user.id}</div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Email</label>
          <div className="p-3 bg-gray-50 rounded-lg">{user.email}</div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Role</label>
          <div className="p-3 bg-green-50 rounded-lg font-semibold text-green-800">
            {user.role?.toUpperCase()}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Joined</label>
          <div className="p-3 bg-gray-50 rounded-lg">
            {new Date(user.created_at!).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProfileInfo
