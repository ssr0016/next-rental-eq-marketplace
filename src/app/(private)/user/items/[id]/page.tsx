"use client"

import InfoMessage from "@/components/functional/info-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PageTitle from "@/components/ui/page-title"
import Spinner from "@/components/ui/spinner"
import { ItemInterface } from "@/interfaces"
import { getItemById } from "@/server-actions/items"
import days from "dayjs"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

function ItemInfoPage() {
  const params: any = useParams()
  const [loading, setLoading] = useState(true)
  const [item, setItem] = useState<ItemInterface | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [fromData, setFormData] = useState("")
  const [toDate, setToDate] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isAvailable, setIsAvailable] = useState(false)

  const getData = async () => {
    try {
      setLoading(true)

      const response = await getItemById(params.id)
      if (!response.success) {
        toast.error(response.message)
        return;
      }
      setItem(response.data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  if (!loading && !item) {
    return <InfoMessage message="No items found" />
  }

  if (loading) {
    return <Spinner parentHeight="200" />
  }

  const renderItemProperty = (label: string, value: any) => {
    return (
      <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
        <label className="text-xs sm:text-sm text-gray-600">{label}</label>
        <h1 className="text-xs sm:text-sm font-bold text-gray-800">{value}</h1>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5 p-3 sm:p-4 md:p-0">
      {/* Page Title */}
      <PageTitle title={item?.name!} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5">

        {/* Left Column - Images & Description */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-4 sm:gap-5">

          {/* Main Image */}
          <div className="w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={item?.images[selectedImageIndex]}
              alt={item?.name}
              className="w-full h-64 sm:h-80 md:h-96 object-contain"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
            {item?.images.map((image: string, index: number) => (
              <div
                key={index}
                className={`
                  relative cursor-pointer rounded overflow-hidden border-2 transition-all
                  ${index === selectedImageIndex
                    ? "border-primary shadow-md"
                    : "border-gray-200 hover:border-gray-400"
                  }
                `}
                onClick={() => setSelectedImageIndex(index)}
              >
                <img
                  src={image}
                  alt={`${item?.name} - ${index + 1}`}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain p-1 bg-gray-50"
                />
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">
              Description
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              {item?.description}
            </p>
          </div>
        </div>

        {/* Right Column - Rental Form */}
        <div className="col-span-1 lg:col-span-2">
          <div className="border border-gray-300 p-4 sm:p-5 rounded-lg shadow-sm bg-white sticky top-4">

            {/* Item Properties */}
            <div className="mb-4 sm:mb-5">
              {renderItemProperty("Rent Per Day", `$${item?.rent_per_day}`)}
              {renderItemProperty("Total Quantity", `${item?.total_quantity} units`)}
              {renderItemProperty("Available", `${item?.available_quantity} units`)}
            </div>

            {/* Section Title */}
            <h1 className="text-sm sm:text-base font-bold text-primary mb-3 sm:mb-4 pb-2 border-b-2 border-primary/20">
              Select Rent Duration & Quantity
            </h1>

            {/* Date & Quantity Inputs */}
            <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-5">

              {/* From Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  From Date
                </label>
                <Input
                  type="date"
                  value={fromData}
                  onChange={(e) => setFormData(e.target.value)}
                  min={days().add(1, "day").format("YYYY-MM-DD")}
                  className="h-9 sm:h-10 text-sm"
                />
              </div>

              {/* To Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  To Date
                </label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  disabled={!fromData}
                  min={days(fromData).format("YYYY-MM-DD")}
                  className="h-9 sm:h-10 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Quantity */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min={1}
                  max={item?.total_quantity}
                  className="h-9 sm:h-10 text-sm"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <Button
                variant="outline"
                disabled={!fromData || !toDate || !quantity}
                className="h-9 sm:h-10 text-xs sm:text-sm w-full"
              >
                Check Availability
              </Button>
              <Button
                variant="default"
                disabled={!isAvailable}
                className="h-9 sm:h-10 text-xs sm:text-sm w-full"
              >
                Rent Now
              </Button>
            </div>

            {/* Rental Summary (Optional - shows when dates selected) */}
            {fromData && toDate && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs sm:text-sm text-blue-800">
                  <span className="font-semibold">Total Days:</span> {days(toDate).diff(days(fromData), 'day')} days
                </p>
                <p className="text-xs sm:text-sm text-blue-800 mt-1">
                  <span className="font-semibold">Total Cost:</span> ${(days(toDate).diff(days(fromData), 'day') * (item?.rent_per_day || 0) * quantity).toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemInfoPage