"use client"

import { Button } from "@/components/ui/button"
import PageTitle from "@/components/ui/page-title"
import { ICategory } from "@/interfaces"
import { useState } from "react"
import CategoryFormModal from "./_components/category-form-modal"

function CategoriesPage() {
  const [openCategoryForm, setOpenCategoryForm] = useState(false)
  const [formType, setFormType] = useState<"add" | "edit">("add")
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null)

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageTitle title="Categories" />
        <Button onClick={() => {
          setOpenCategoryForm(true)
          setFormType("add")
        }}>Add Category</Button>
      </div>
      {openCategoryForm && (
        <CategoryFormModal
          open={openCategoryForm}
          setOpen={setOpenCategoryForm}
          selectedCategory={selectedCategory}
          formType={formType}
        />)
      }
    </div>
  )
}

export default CategoriesPage