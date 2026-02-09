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
import { getAllCategories } from "@/server-actions/categories"
import dayjs from "dayjs"
import { Edit2, Trash2 } from "lucide-react"
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
      console.log(response)
      setCategories(response.data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const colums = [
    "Id",
    "Name",
    "Image",
    "Created At",
    "Action",
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <PageTitle title="Categories" />
        <Button onClick={() => {
          setOpenCategoryForm(true)
          setFormType("add")
        }}>Add Category</Button>
      </div>

      {loading && <Spinner parentHeight="200" />}

      {!loading && categories.length === 0 && (
        <InfoMessage message="No categories found" />
      )}

      {!loading && categories.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              {
                colums.map((colum) => (
                  <TableHead
                    className="font-bold! bg-gray-300 text-primary py-2"
                    key={colum}>
                    {colum}
                  </TableHead>
                ))
              }
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
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
                  {dayjs(item.created_at).format("MMM DD , YYYY h:mm A")}
                </TableCell>

                <TableCell>
                  <div className="flex gap-5">
                    <Button
                      variant={"outline"} size={"icon"}
                      onClick={() => {
                        setFormType("edit")
                        setSelectedCategory(item)
                        setOpenCategoryForm(true)
                      }}
                    >
                      <Edit2 />
                    </Button>

                    <Button variant={"outline"} size={"icon"}>
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}



      {openCategoryForm && (
        <CategoryFormModal
          open={openCategoryForm}
          setOpen={setOpenCategoryForm}
          selectedCategory={selectedCategory}
          formType={formType}
          onSuccess={getData}
        />)
      }
    </div>
  )
}

export default CategoriesPage