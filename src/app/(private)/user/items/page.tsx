import InfoMessage from "@/components/functional/info-message"
import PageTitle from "@/components/ui/page-title"
import { ItemInterface } from "@/interfaces"
import { getAllItems } from "@/server-actions/items"
import Filters from "./_components/filters"
import Item from "./_components/item"

interface userItemsPageProps {
  searchParams: Promise<{
    category?: string
    sortBy?: string
  }>
}

async function UserITemPage({ searchParams }: userItemsPageProps) {
  const { category, sortBy } = await searchParams

  const response: any = await getAllItems({ category, sortBy })
  if (!response.success) {
    return <InfoMessage message="No items found" />
  }

  const items: ItemInterface[] = response.data
  return (
    <div className="flex flex-col gap-5">
      <PageTitle title="My Items" />

      <Filters />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item: ItemInterface) => (
          <Item key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

export default UserITemPage