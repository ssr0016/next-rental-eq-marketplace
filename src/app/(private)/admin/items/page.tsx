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
import { Edit2, Trash2 } from "lucide-react"
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
      const response: any = await getAllItems()
      if (!response.success) {
        toast.error(response.message)
        return;
      }
      console.log(response)
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

  const handleDeleteCategory = async (id: number) => {
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
    <div className="flex flex-col gap-5 ">
      <div className="flex justify-between gap-5 items-center">
        <PageTitle title="Items" />
        <Button>
          <Link href="/admin/items/add">Add Item</Link>
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
        <div className="hidden md:block overflow-x-auto">
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
              {items.map((item: ItemInterface) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded p-1 border border-gray-300"
                    />
                  </TableCell>
                  <TableCell>
                    {item.category.name}
                  </TableCell>
                  <TableCell>{item.rent_per_day}</TableCell>
                  <TableCell>{item.total_quantity}</TableCell>
                  <TableCell>{item.available_quantity}</TableCell>
                  <TableCell>
                    {dayjs(item.created_at).format("MMM DD, YYYY h:mm A")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-3">
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
                        onClick={() => handleDeleteCategory(item.id)}
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
    </div>
  )
}

export default AddItemsPage