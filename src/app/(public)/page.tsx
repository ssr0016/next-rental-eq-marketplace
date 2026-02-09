
import { Button } from "@/components/ui/button"
import Link from "next/link"

function Homepage() {
  return (
    <div>
      <div className="flex justify-between items-center py-5 px-20 bg-primary">
        <h1 className="text-xl font-bold! text-white">S . S . R</h1>
        <Button variant="outline">
          <Link href="/login">Login</Link>
        </Button>
      </div>

      <div className="grid mt-20 lg:grid-cols-2 gap-5 h-[70vh] items-center px-20">
        <div className="col-span-1">
          <div className="flex flex-col gap-5">
            <h1 className="text-xl font-semibold! text-primary">Welcome to S . S . R Rental Equipment Marketplace</h1>
            <p className="text-gray-600 text-sm">
              S . S . R is a peer-to-peer rental marketplace where you can effortlessly rent out your equipment or find and rent gear from others. Whether you're looking to earn by sharing what you own or need someting temporarily, S.S.R is your one-stop destination for all your rental needs.
            </p>
            <Button className="w-max">GET STARTED</Button>
          </div>
        </div>
        <div className="col-span-1 justify-end flex items-center">
          <img src={"https://static.vecteezy.com/system/resources/previews/020/898/692/non_2x/mechanic-tool-logo-free-vector.jpg"} className="h-96 object-contain" alt="" />
        </div>
      </div>
    </div>
  )
}

export default Homepage