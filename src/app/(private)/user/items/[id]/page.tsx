"use client"

import InfoMessage from "@/components/functional/info-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PageTitle from "@/components/ui/page-title"
import Spinner from "@/components/ui/spinner"
import { ItemInterface } from "@/interfaces"
import { getItemById } from "@/server-actions/items"
import { getStripePaymentIntent } from "@/server-actions/payments"
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import days from "dayjs"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import CheckoutForm from "../_components/checkout-form"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function ItemInfoPage() {
  const params: any = useParams()
  const [loading, setLoading] = useState(true)
  const [item, setItem] = useState<ItemInterface | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isAvailable, setIsAvailable] = useState(true) // for now, since we dont have any data in the database
  const [gettingPaymentIntent, setGettingPaymentIntent] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)
  const [clientSecret, setClientSecret] = useState('')
  const [openCheckoutForm, setOpenCheckoutForm] = useState(false)

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

  const getPaymentIntentHandler = async () => {
    try {
      setGettingPaymentIntent(true)
      const response = await getStripePaymentIntent(totalAmount)
      if (!response.success) {
        toast.error(response.message)
        return;
      }
      setClientSecret(response.clientSecret)
      setOpenCheckoutForm(true)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setGettingPaymentIntent(false)
    }
  }

  const handleCheckoutFormSuccess = (paymentId: string) => {
    try {

      console.log("Payment successful with ID:", paymentId);
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    if (fromDate && toDate && quantity) {
      const numberOfDays = days(toDate).diff(days(fromDate), 'day') || 1
      const total = numberOfDays * item?.rent_per_day! * quantity
      setTotalAmount(total)
    }
  }, [fromDate, toDate, quantity])

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

  const options = {
    clientSecret: clientSecret,
  };

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Page Title */}
        <div className="mb-4 sm:mb-6">
          <PageTitle title={item?.name!} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">

          {/* Left Column - Images & Description */}
          <div className="col-span-1 lg:col-span-3 flex flex-col gap-4 sm:gap-5">

            {/* Main Image */}
            <div className="w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={item?.images[selectedImageIndex]}
                alt={item?.name}
                className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-contain"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {item?.images.map((image: string, index: number) => (
                <div
                  key={index}
                  className={`
                    relative cursor-pointer rounded overflow-hidden border-2 transition-all
                    ${index === selectedImageIndex
                      ? "border-primary shadow-md scale-105"
                      : "border-gray-200 hover:border-gray-400"
                    }
                  `}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${item?.name} - ${index + 1}`}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain p-1 bg-gray-50"
                  />
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                Description
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {item?.description}
              </p>
            </div>
          </div>

          {/* Right Column - Rental Form */}
          <div className="col-span-1 lg:col-span-2">
            <div className="border border-gray-300 p-4 sm:p-6 rounded-lg shadow-sm bg-white lg:sticky lg:top-4">

              {/* Item Properties */}
              <div className="mb-5 sm:mb-6">
                {renderItemProperty("Rent Per Day", `$${item?.rent_per_day}`)}
                {renderItemProperty("Total Quantity", `${item?.total_quantity} units`)}
                {renderItemProperty("Available", `${item?.available_quantity} units`)}
              </div>

              {/* Section Title */}
              <h1 className="text-base sm:text-lg font-bold text-primary mb-4 sm:mb-5 pb-2 border-b-2 border-primary/20">
                Select Rent Duration & Quantity
              </h1>

              {/* Date & Quantity Inputs */}
              <div className="flex flex-col gap-4 mb-5 sm:mb-6">

                {/* From Date */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    From Date
                  </label>
                  <Input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    min={days().add(1, "day").format("YYYY-MM-DD")}
                    className="h-10 sm:h-11"
                  />
                </div>

                {/* To Date */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    To Date
                  </label>
                  <Input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    disabled={!fromDate}
                    min={days(fromDate).format("YYYY-MM-DD")}
                    className="h-10 sm:h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Quantity */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min={1}
                    max={item?.total_quantity}
                    className="h-10 sm:h-11"
                  />
                </div>
              </div>

              {/* Total Amount Display */}
              {isAvailable && totalAmount > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base font-medium text-gray-700">
                      Total Amount:
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-green-700">
                      ${totalAmount}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  disabled={!fromDate || !toDate || !quantity}
                  className="h-10 sm:h-11 text-sm w-full"
                >
                  Check Availability
                </Button>

                <Button
                  variant="default"
                  disabled={!isAvailable || gettingPaymentIntent || !totalAmount}
                  className="h-10 sm:h-11 text-sm w-full"
                  onClick={getPaymentIntentHandler}
                >
                  {gettingPaymentIntent ? "Processing..." : "Rent Now"}
                </Button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Checkout Form Modal - Outside the grid */}
      {openCheckoutForm && clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm
            openCheckoutForm={openCheckoutForm}
            setOpenCheckoutForm={setOpenCheckoutForm}
            onPaymentSuccess={handleCheckoutFormSuccess}
          />
        </Elements>
      )}
    </div>
  )
}

export default ItemInfoPage