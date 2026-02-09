
import usersGlobalStore, { IUsersGlobalSore } from "@/store/users-store"
import { Menu } from "lucide-react"
import { useState } from "react"
import Sidebar from "./sidebar"

function PrivateLayoutHeader() {
  const { user } = usersGlobalStore() as IUsersGlobalSore
  const [openSidebar, setOpenSidebar] = useState(false)

  return (
    <div className="flex item-center bg-primary p-5 justify-between">
      <div className="text-2xl font-bold! text-white">S . S . R</div>

      <div className="flex gap-5 items-center">
        <h1 className="text-sm text-white">{user?.name}</h1>
        <Menu size={16} color="white" className="cursor-pointer" onClick={() => setOpenSidebar(true)} />
      </div>

      {openSidebar && <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />}
    </div>
  )
}

export default PrivateLayoutHeader