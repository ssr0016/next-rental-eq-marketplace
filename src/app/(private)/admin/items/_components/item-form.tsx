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
import { ICategory, ItemInterface } from "@/interfaces"
import { getAllCategories } from "@/server-actions/categories"
import { zodResolver } from "@hookform/resolvers/zod"
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
  const [loading, setLoading] = useState(false)

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
      category_id: initialValues?.category_id || "",
      rent_per_day: initialValues?.rent_per_day || 0,
      available_quantity: initialValues?.available_quantity || 0,
      total_quantity: initialValues?.total_quantity || 0,
      images: initialValues?.images || [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {

    } catch (error) {

    }
  }

  const handleFileDelete = (index: number) => {
    const updatedFiles = newlySelectedImageFiles.filter((_, i) => i !== index);
    setNewlySelectedImageFiles(updatedFiles);
  }

  return (
    <div className="mt-7">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-3 gap-5 items-center">
            <div className="col-span-2">
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full" >
                          <SelectValue placeholder="Select a verified catogory to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()} >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem >
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1">
              <FormField
                control={form.control}
                name="rent_per_day"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rent Per Day</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="" {...field}
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
                      <Input type="number" placeholder="" {...field}
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
                      <Input type="number" placeholder="" {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <Input type="file" multiple placeholder="" {...field}
                        onChange={(e => {
                          const files: any = e.target.files
                          setNewlySelectedImageFiles(Array.from(files))
                        })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-5">
            {newlySelectedImageFiles.map((file, index) => (
              <div className=" border border-gray-300 p-1 rounded flex flex-col gap-3" key={index}>
                <img
                  src={URL.createObjectURL(file)}
                  className="w-20 h-20 object-contain"
                />
                <span className="text-sm underline text-gray-600 cursor-pointer"
                  onClick={() => handleFileDelete(index)}
                >
                  Delete
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-5">
            <Button type="button" variant="outline" onClick={() => { }}>
              Cancel{""}
            </Button>
            <Button type="submit" disabled={loading}>
              {formType === "add" ? "Add" : "Edit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ItemForm