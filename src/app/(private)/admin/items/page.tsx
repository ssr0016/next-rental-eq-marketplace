import { Button } from "@/components/ui/button"
import PageTitle from "@/components/ui/page-title"
import Link from "next/link"

function AddItemsPage() {
  return (
    <div>
      <div className="flex justify-between gap-5 items-center">
        <PageTitle title="Items" />
        <Button>
          <Link href="/admin/items/add">Add Item</Link>
        </Button>
      </div>
    </div>
  )
}

export default AddItemsPage