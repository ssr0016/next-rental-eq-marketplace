"use client"

import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Button } from "../ui/button"

function LogoutButton() {
  const router = useRouter()
  const onClick = async () => {

    try {
      Cookies.remove("access_token")
      toast.success("Logout successfully")
      router.push("/login")
    } catch (error) {
      toast.error("Logout failed")
    }
  }


  return (
    <Button onClick={onClick}>Logout</Button>
  )
}

export default LogoutButton