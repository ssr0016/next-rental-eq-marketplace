import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"
import Link from "next/link"

function Homepage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 sm:w-8 sm:h-8" />
              <div className="text-xl sm:text-2xl font-bold">S . S . R</div>
            </div>
            <Link href="/login">
              <Button variant="outline" size="sm" className="sm:size-default">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Icon */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="bg-primary/10 p-4 sm:p-6 rounded-full">
                <Package className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-primary" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Welcome to S . S . R Rental Equipment Marketplace
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 px-4 sm:px-6 lg:px-0">
              S . S . R is a peer-to-peer rental marketplace where you can
              effortlessly rent out your equipment or find and rent gear from
              others. Whether you're looking to earn by sharing what you own or
              need something temporarily, S.S.R is your one-stop destination for
              all your rental needs.
            </p>
            <Link href="/get-started">
              <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6">
                GET STARTED
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Homepage