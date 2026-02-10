"use client"

import { ItemInterface } from "@/interfaces"
import { useRouter } from "next/navigation"

function Item({ item }: { item: ItemInterface }) {
  const router = useRouter()

  return (
    <div className="p-5 border border-gray-300 flex flex-col gap-5 rounded shadow"
      onClick={() => router.push(`/user/items/${item.id}`)}
    >
      <img src={item.images[0]} className="h-40 object-contain rounded"
      />
      <div>
        <h1 className="text-sm font-bold! text-gray-500">{item.name}</h1>
        <h1 className="text-sm font-bold! text-primary">
          $ {item.rent_per_day} Per Day
        </h1>
      </div>
    </div>
  )
}

export default Item