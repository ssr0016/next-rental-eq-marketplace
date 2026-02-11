"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ICategory } from "@/interfaces"
import { getAllCategories } from "@/server-actions/categories"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const sortByOptions = [
  { label: "None", value: "all" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
]

function Filters() {
  const searchParams = new URLSearchParams(window.location.search)
  const [category, setCategory] = useState(searchParams.get("category") || "all")
  const [categories, setCategories] = useState([])
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "all")
  const router = useRouter()

  const fetchCategories = async () => {
    try {
      const response: any = await getAllCategories()
      if (!response || response.length === 0) {
        setCategories([])
        return
      }
      setCategories(response.data)
    } catch (error) {
      setCategories([])
    } finally {
    }
  }

  const handleApplyFilters = () => {
    router.push(`/user/items?category=${category}&sortBy=${sortBy}`)
  }

  const handleClearFilters = () => {
    setCategory("all")
    setSortBy("all")
    router.push(`/user/items`)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div className="grid lg:grid-cols-4 gap-5 items-end">
      <div className="flex flex-col gap-1">
        <h1 className="text-sm text-gray-600">Category</h1>
        <Select
          onValueChange={(value) => setCategory(value)}
          defaultValue={category}
          value={category}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>

          <SelectContent className="w-full">
            <SelectItem key={"all"} value={"all"}>
              All
            </SelectItem>
            {categories.map((cat: ICategory) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-sm text-gray-600">Sort By</h1>
        <Select
          onValueChange={(value) => setSortBy(value)}
          defaultValue={sortBy}
          value={sortBy}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select sorting option" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {sortByOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Button variant="outline"
          onClick={handleClearFilters}
        >Clear Filters</Button>
        <Button variant="default"
          onClick={handleApplyFilters}
        >Apply Filters</Button>
      </div>

    </div>
  )
}

export default Filters