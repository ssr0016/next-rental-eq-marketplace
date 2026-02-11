"use client"
import InfoMessage from "@/components/functional/info-message"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { getAllOrders, updateRentOrder } from "@/server-actions/orders"
import { default as dayjs, default as days } from "dayjs"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function AdminRentOrdersPage() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<IRentOrder[]>([])

  const getOrders = async () => {
    try {
      setLoading(true)
      const response: any = await getAllOrders()
      if (!response.success) {
        toast.error(response.message)
        return
      }
      setOrders(response.data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOrderUpdate = async (payload: any) => {
    try {
      setLoading(true)
      const response = await updateRentOrder(payload.id, payload)
      if (!response.success) {
        toast.error(response.message)
        return
      }
      toast.success("Order updated successfully")
      setOrders((prev) => prev.map((item: any) => {
        if (item.id === payload.id) {
          return {
            ...item,
            status: payload.status
          }
        }
        return item
      }))
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
    "Product",
    "Customer",
    "Quantity",
    "Price",
    "Status",
    "From Date",
    "To Date",
    "Created At",
    "Actions",
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "booked":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "with-customer":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="All Rent Orders" />

      {loading && <Spinner parentHeight="200" />}

      {!loading && orders.length === 0 && <InfoMessage message="No orders found" />}

      {!loading && orders.length > 0 && (
        <>
          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead
                      className="font-bold bg-gray-300 text-primary py-2 whitespace-nowrap"
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
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{order.item?.name || "N/A"}</TableCell>
                    <TableCell>{order.user?.name || "N/A"}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>${order.total_amount}</TableCell>
                    {/* FIXED STATUS CELL - Clean dropdown with status colors */}
                    <TableCell>
                      <select
                        value={order.status}
                        className={`w-full border rounded-md p-2 text-sm font-semibold text-left disabled:opacity-50 ${getStatusColor(order.status)}`}
                        onChange={(e) => {
                          handleOrderUpdate({
                            id: order.id,
                            status: e.target.value,
                          })
                        }}
                        disabled={order.status === "completed"}
                      >
                        <option value="booked">Booked</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                        <option value="with-customer">With Customer</option>
                      </select>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{dayjs(order.from_date).format("MMM D, YYYY")}</TableCell>
                    <TableCell className="whitespace-nowrap">{dayjs(order.to_date).format("MMM D, YYYY")}</TableCell>
                    <TableCell className="whitespace-nowrap">{dayjs(order.created_at).format("MMM D, YYYY h:mm A")}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {days(order.from_date).isAfter(days()) &&
                          order.status === "booked" && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleOrderUpdate({
                                id: order.id,
                                status: "cancelled",
                              })}
                            >
                              Cancel
                            </Button>
                          )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View - Hidden on desktop */}
          <div className="lg:hidden flex flex-col gap-4">
            {orders.map((order: IRentOrder) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3 pb-3 border-b">
                    <div>
                      <p className="text-xs text-gray-500">Order ID</p>
                      <p className="font-bold text-primary">#{order.id}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-1 ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <select
                        value={order.status}
                        className="border border-gray-300 rounded p-1 text-sm w-full"
                        onChange={(e) => {
                          handleOrderUpdate({
                            id: order.id,
                            status: e.target.value,
                          })
                        }}
                        disabled={order.status === "completed"}
                      >
                        <option value="booked">Booked</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                        <option value="with-customer">With Customer</option>
                      </select>
                    </div>
                  </div>

                  {/* Product & Customer Info */}
                  <div className="space-y-2 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Product</p>
                      <p className="font-medium">{order.item?.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Customer</p>
                      <p className="font-medium">{order.user?.name || "N/A"}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Quantity</p>
                        <p className="font-medium">{order.quantity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="font-medium text-green-700">${order.total_amount}</p>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="space-y-2 mb-3 pb-3 border-b">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">From Date</p>
                        <p className="text-sm">{dayjs(order.from_date).format("MMM D, YYYY")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">To Date</p>
                        <p className="text-sm">{dayjs(order.to_date).format("MMM D, YYYY")}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Created At</p>
                      <p className="text-sm">{dayjs(order.created_at).format("MMM D, YYYY h:mm A")}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  {days(order.from_date).isAfter(days()) &&
                    order.status === "booked" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => handleOrderUpdate({
                          id: order.id,
                          status: "cancelled",
                        })}
                      >
                        Cancel Order
                      </Button>
                    )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default AdminRentOrdersPage
