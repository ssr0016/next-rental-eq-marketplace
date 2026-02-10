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
      <DialogContent className="w-[95vw] max-w-[425px] sm:max-w-[525px] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-base sm:text-lg md:text-xl font-bold">
            {formType === "add" ? "Add Category" : "Edit Category"}
          </DialogTitle>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5 sm:space-y-5">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter category name"
                        className="h-9 sm:h-10 text-sm sm:text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter category description"
                        className="min-h-[70px] sm:min-h-[90px] md:min-h-[100px] text-sm sm:text-base resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              {/* Image Upload Field */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        className="h-9 sm:h-10 text-xs sm:text-sm cursor-pointer file:mr-2 file:px-3 file:py-1 file:rounded file:border-0 file:text-xs file:sm:text-sm file:bg-primary file:text-primary-foreground"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setSelectedImageFile(file)
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              {/* Image Preview */}
              {(selectedImageFile || selectedCategory?.image) && (
                <div className="flex justify-center sm:justify-start pt-1">
                  <div className="relative">
                    <img
                      src={
                        selectedImageFile
                          ? URL.createObjectURL(selectedImageFile)
                          : selectedCategory?.image
                      }
                      alt="Category preview"
                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded border-2 border-gray-300 p-1.5 sm:p-2"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-4 pt-3 sm:pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto h-9 sm:h-10 text-sm sm:text-base"
                  onClick={() => {
                    setOpen(false)
                    form.reset()
                    setSelectedImageFile(null)
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto h-9 sm:h-10 text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <span className="mr-2">•••</span>
                      {formType === "add" ? "Adding" : "Updating"}
                    </>
                  ) : (
                    formType === "add" ? "Add Category" : "Update Category"
                  )}
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