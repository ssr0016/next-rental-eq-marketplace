import InfoMessage from "@/components/functional/info-message"
import PageTitle from "@/components/ui/page-title"
import { getItemById } from "@/server-actions/items"
import ItemForm from "../../_components/item-form"

interface EditItemPageProps {
  params: Promise<{
    id: number
  }>
}

async function EditItemPage({ params }: EditItemPageProps) {
  const { id } = await params
  const response = await getItemById(id)
  if (!response.success) {
    return <InfoMessage message={response.message} />
  }

  return (
    <div>
      <PageTitle title="Edit Item" />
      <ItemForm formType="edit" initialValues={response.data} />
    </div>
  )
}

export default EditItemPage