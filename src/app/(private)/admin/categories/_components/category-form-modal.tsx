"use client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { uploadFileAndGetUrl } from "@/helpers"
import { ICategory } from "@/interfaces"
import { createCategory, updateCategoryById } from "@/server-actions/categories"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

interface ICategoryFormModalProps {
  open: boolean
  setOpen: (open: boolean) => void
  selectedCategory?: ICategory | null
  formType: "add" | "edit"
  onSuccess?: () => void
}

function CategoryFormModal({ open, setOpen, selectedCategory, formType, onSuccess }: ICategoryFormModalProps) {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)



  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    image: z.string()
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: selectedCategory?.name || "",
      description: selectedCategory?.description || "",
      image: selectedCategory?.image || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)

      let imageUrl = selectedCategory?.image || ""
      if (selectedImageFile) {
        const response = await uploadFileAndGetUrl(selectedImageFile)
        if (!response.success) {
          throw new Error(response.message)
        }
        // console.log("Image URL", response.data)
        imageUrl = response.data
      }

      let saveResponse = null
      if (formType === "add") {
        saveResponse = await createCategory({
          ...values,
          image: imageUrl,
        })
      } else {
        saveResponse = await updateCategoryById(
          selectedCategory?.id || "",
          {
            ...values,
            image: imageUrl,
          },
        )
      }

      if (!saveResponse.success) {
        throw new Error(saveResponse.message)
      }

      toast.success(
        formType === "add"
          ? "Category added successfully"
          : "Category updated successfully",
      )
      if (onSuccess) {
        onSuccess()
      }
      setOpen(false)
      form.reset()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-131.25">
        <DialogHeader>
          <DialogTitle className="font-bold!">
            {formType === "add" ? "Add Category" : "Edit Category"}
          </DialogTitle>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        placeholder="" {...field}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setSelectedImageFile(file)
                          }
                        }}
                      />

                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedImageFile && (
                <div>
                  <img
                    src={URL.createObjectURL(selectedImageFile)}
                    className="w-20 h-20 object-cover rounded p-2 border border-gray-300"
                  />
                </div>
              )}

              <div className="flex justify-end gap-5">
                <Button
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {formType === "add" ? "Add" : "Edit"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryFormModal