
import Spinner from "@/components/ui/spinner"
import { getLoggedInUser } from "@/server-actions/users"
import usersGlobalStore, { IUsersGlobalSore } from "@/store/users-store"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import PrivateLayoutHeader from "./header"

function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { setUser } = usersGlobalStore() as IUsersGlobalSore
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const getData = async () => {
    try {
      setLoading(true)
      const response = await getLoggedInUser()
      if (!response.success) {
        throw new Error(response.message)
      } else {
        setUser(response.data)
      }
    } catch (error: any) {
      Cookies.remove("token")
      toast.error(error.message)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  if (loading) {
    return (<Spinner />)
  }

  return (
    <div>
      <PrivateLayoutHeader />
      {children}
    </div>
  )
}

export default PrivateLayout