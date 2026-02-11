
"use client"
import InfoMessage from "@/components/functional/info-message"
import PageTitle from "@/components/ui/page-title"
import Spinner from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { IRentOrder } from "@/interfaces"
import { getUserOrders } from "@/server-actions/orders"
import usersGlobalStore, { IUsersGlobalSore } from "@/store/users-store"
import { default as dayjs, default as days } from "dayjs"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function UserRentOrders() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<IRentOrder[]>([])

  const { user } = usersGlobalStore() as IUsersGlobalSore

  const getOrders = async () => {
    try {
      setLoading(true)
      const response: any = await getUserOrders(user?.id as string)
      if (!response.success) {
        toast.error(response.message)
        return;
      }
      setOrders(response.data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getOrders()
  }, [])

  const columns = [
    "Order ID",
    "Product Name",
    "Quantity",
    "Price",
    "Status",
    "From Date",
    "To Date",
    "Created At",
    "Actions",
  ]

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="My Rent Orders" />

      {loading && <Spinner parentHeight="200" />}

      {!loading && orders.length === 0 && <InfoMessage message="No orders found" />}

      {!loading && orders.length > 0 && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    className="font-bold bg-gray-300 text-primary py-2"
                    key={column}
                  >
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: IRentOrder) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.item?.name || "N/A"}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.total_amount}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{dayjs(order.from_date).format("MMM D , YYYY")}</TableCell>
                  <TableCell>{dayjs(order.to_date).format("MMM D , YYYY h:mm A")}</TableCell>
                  <TableCell>{order.created_at}</TableCell>
                  <TableCell>
                    <div className="flex gap-5">
                      {days(order.from_date).isAfter(days()) && (
                        <span className="text-red-800 cursor-pointer underline text-sm">Cancel</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

export default UserRentOrders