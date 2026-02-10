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
import { ICategory } from "@/interfaces"
import { deleteCategoryById, getAllCategories } from "@/server-actions/categories"
import dayjs from "dayjs"
import { Edit2, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import CategoryFormModal from "./_components/category-form-modal"


function CategoriesPage() {
  const [openCategoryForm, setOpenCategoryForm] = useState(false)
  const [formType, setFormType] = useState<"add" | "edit">("add")
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<ICategory[]>([])

  const getData = async () => {
    try {
      setLoading(true)
      const response: any = await getAllCategories()
      if (!response.success) {
        toast.error(response.message)
        return;
      }
      setCategories(response.data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      setLoading(true)
      const response = await deleteCategoryById(id)
      if (!response.success) {
        toast.error(response.message)
        return
      }
      toast.success(response.message)
      setCategories((prev) => prev.filter((item) => item.id !== id))
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const columns = [
    "Id",
    "Name",
    "Image",
    "Created At",
    "Action",
  ]

  return (
    <div className="flex flex-col gap-4 sm:gap-5 p-3 sm:p-4 md:p-0">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <PageTitle title="Categories" />
        <Button
          onClick={() => {
            setOpenCategoryForm(true)
            setSelectedCategory(null)
            setFormType("add")
          }}
          className="w-full sm:w-auto h-9 sm:h-10 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 mr-1 sm:mr-2" />
          Add Category
        </Button>
      </div>

      {/* Loading State */}
      {loading && <Spinner parentHeight="200" />}

      {/* Empty State */}
      {!loading && categories.length === 0 && (
        <InfoMessage message="No categories found" />
      )}

      {/* Desktop Table View - Hidden on Mobile */}
      {!loading && categories.length > 0 && (
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
              {categories.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.id}
                  </TableCell>
                  <TableCell>
                    {item.name}
                  </TableCell>
                  <TableCell>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded p-1 border border-gray-300"
                    />
                  </TableCell>
                  <TableCell>
                    {dayjs(item.created_at).format("MMM DD, YYYY h:mm A")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setFormType("edit")
                          setSelectedCategory(item)
                          setOpenCategoryForm(true)
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

      {/* Mobile Card View - Hidden on Desktop */}
      {!loading && categories.length > 0 && (
        <div className="md:hidden flex flex-col gap-3">
          {categories.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white shadow-sm"
            >
              {/* Image and Name Row */}
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded border border-gray-300 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 break-all">
                    ID: {item.id}
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
                    setFormType("edit")
                    setSelectedCategory(item)
                    setOpenCategoryForm(true)
                  }}
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteCategory(item.id)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Form Modal */}
      {openCategoryForm && (
        <CategoryFormModal
          open={openCategoryForm}
          setOpen={setOpenCategoryForm}
          selectedCategory={selectedCategory}
          formType={formType}
          onSuccess={getData}
        />
      )}
    </div>
  )
}

export default CategoriesPage