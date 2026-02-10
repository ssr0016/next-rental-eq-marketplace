"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { uploadFileAndGetUrl } from "@/helpers"
import { ICategory, ItemInterface } from "@/interfaces"
import { getAllCategories } from "@/server-actions/categories"
import { addNewItem, updateItemById } from "@/server-actions/items"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"


interface ItemFormProps {
  formType: "add" | "edit"
  initialValues?: Partial<ItemInterface>
}

function ItemForm({ formType, initialValues }: ItemFormProps) {
  const [categories, setCategories] = useState<ICategory[]>([])
  const [newlySelectedImageFiles, setNewlySelectedImageFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>(initialValues?.images || [])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const getData = async () => {
    try {
      const response: any = await getAllCategories()
      if (!response.success) {
        toast.error(response.message)
        return;
      }
      // console.log(response)
      setCategories(response.data)
    } catch (error: any) {
      setCategories([])
    } finally {
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    category_id: z.string().min(1, "Category is required"),
    rent_per_day: z.number().min(1, "Rent per day is required"),
    available_quantity: z.number().min(1, "Available quantity is required"),
    total_quantity: z.number().min(1, "Total quantity is required"),
    images: z.array(z.string()),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      category_id: initialValues?.category_id?.toString() || "",
      rent_per_day: initialValues?.rent_per_day || 0,
      available_quantity: initialValues?.available_quantity || 0,
      total_quantity: initialValues?.total_quantity || 0,
      images: initialValues?.images || [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      let newImageUrls = []
      for (let file of newlySelectedImageFiles) {
        const response = await uploadFileAndGetUrl(file)
        if (!response.success) {
          throw new Error(response.message)
        }
        newImageUrls.push(response.data)
      }

      const allImages = [...existingImages, ...newImageUrls]
      values.images = allImages
      let saveResponse = null

      if (formType === "add") {
        saveResponse = await addNewItem(values)
      } else {
        saveResponse = await updateItemById(initialValues?.id || 0, values)
      }
      if (!saveResponse.success) {
        throw new Error(saveResponse.message)
      }
      toast.success(
        formType === "add"
          ? "Item added successfully"
          : "Item updated successfully"
      )
      router.push("/admin/items")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileDelete = (index: number) => {
    const updatedFiles = newlySelectedImageFiles.filter((_, i) => i !== index);
    setNewlySelectedImageFiles(updatedFiles);
  }

  const handleExistingImageDelete = (url: string) => {
    setExistingImages((prev) => prev.filter((item) => item !== url));
  }

  return (
    <div className="p-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="col-span-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-1">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full">
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Description - Already responsive */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Quantity/Price Grid - RESPONSIVE CHANGE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="col-span-1">
              <FormField
                control={form.control}
                name="rent_per_day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rent Per Day</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder=""
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-1">
              <FormField
                control={form.control}
                name="available_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder=""
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-1">
              <FormField
                control={form.control}
                name="total_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder=""
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Image Upload - RESPONSIVE CHANGE */}
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="col-span-1">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        multiple
                        placeholder=""
                        onChange={(e) => {
                          const files: any = e.target.files
                          setNewlySelectedImageFiles(Array.from(files))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Image Preview Grid - RESPONSIVE CHANGE */}
          <div className="flex flex-wrap gap-3 md:gap-5">
            {[...newlySelectedImageFiles, ...existingImages].map((item, index) => (
              <div
                className="border border-gray-300 p-1 rounded flex flex-col gap-2 md:gap-3"
                key={index}
              >
                <img
                  src={
                    typeof item === "string"
                      ? item
                      : URL.createObjectURL(item)
                  }
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                  alt={`Preview ${index}`}
                />
                <span
                  className="text-xs md:text-sm underline text-gray-600 cursor-pointer"
                  onClick={() => {
                    if (typeof item === "string") {
                      handleExistingImageDelete(item)
                    } else {
                      handleFileDelete(index)
                    }
                  }}
                >
                  Delete
                </span>
              </div>
            ))}
          </div>

          {/* Buttons - RESPONSIVE CHANGE */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-5">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => { router.push("/admin/items") }}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {formType === "add" ? "Add" : "Edit"}
            </Button>
          </div>
        </form>
      </Form>
    </div >
  )
}

export default ItemForm