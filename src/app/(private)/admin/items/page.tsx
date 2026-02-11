"use client"

import InfoMessage from "@/components/functional/info-message"
import { Button } from "@/components/ui/button"
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
import { ItemInterface } from "@/interfaces"
import { deleteItemById, getAllItems } from "@/server-actions/items"
import dayjs from "dayjs"
import { Edit2, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"


function AddItemsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const getData = async () => {
    try {
      setLoading(true)
      const response: any = await getAllItems({})
      if (!response.success) {
        toast.error(response.message)
        return;
      }
      // console.log(response)
      setItems(response.data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const handleDeleteItem = async (id: number) => {
    try {
      setLoading(true)
      const response = await deleteItemById(id)
      if (!response.success) {
        toast.error(response.message)
        return
      }
      toast.success(response.message)
      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    "Id",
    "Name",
    "Image",
    "Category",
    "Rent Per Day",
    "Total Quantity",
    "Available Quantity",
    "Created At",
    "Action",
  ]

  return (
    <div className="flex flex-col gap-4 sm:gap-5 p-3 sm:p-4 md:p-0">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <PageTitle title="Items" />
        <Button
          className="w-full sm:w-auto h-9 sm:h-10 text-sm sm:text-base"
          asChild
        >
          <Link href="/admin/items/add">
            <Plus className="w-4 h-4 mr-1 sm:mr-2" />
            Add Item
          </Link>
        </Button>
      </div>

      {/* Loading State */}
      {loading && <Spinner parentHeight="200" />}

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <InfoMessage message="No items found" />
      )}

      {/* Desktop Table View - Hidden on Mobile */}
      {!loading && items.length > 0 && (
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
              {items.map((item: ItemInterface) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell className="min-w-[150px]">{item.name}</TableCell>
                  <TableCell>
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded p-1 border border-gray-300"
                    />
                  </TableCell>
                  <TableCell>{item.category.name}</TableCell>
                  <TableCell>${item.rent_per_day}</TableCell>
                  <TableCell>{item.total_quantity}</TableCell>
                  <TableCell>{item.available_quantity}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {dayjs(item.created_at).format("MMM DD, YYYY h:mm A")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          router.push(`/admin/items/edit/${item.id}`)
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Mobile/Tablet Card View - Hidden on Desktop */}
      {!loading && items.length > 0 && (
        <div className="lg:hidden flex flex-col gap-3">
          {items.map((item: ItemInterface) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white shadow-sm"
            >
              {/* Image and Name Row */}
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded border border-gray-300 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    ID: {item.id}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Category: <span className="font-medium">{item.category.name}</span>
                  </p>
                </div>
              </div>

              {/* Item Details Grid */}
              <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Rent Per Day</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    ${item.rent_per_day}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Quantity</p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    {item.total_quantity}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Available Quantity</p>
                  <p className="text-sm font-semibold text-green-600 mt-0.5">
                    {item.available_quantity} available
                  </p>
                </div>
              </div>

              {/* Created At */}
              <div className="mb-3 pb-3 border-b border-gray-100">
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-xs sm:text-sm text-gray-700 mt-0.5">
                  {dayjs(item.created_at).format("MMM DD, YYYY h:mm A")}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs sm:text-sm"
                  onClick={() => {
                    router.push(`/admin/items/edit/${item.id}`)
                  }}
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AddItemsPage