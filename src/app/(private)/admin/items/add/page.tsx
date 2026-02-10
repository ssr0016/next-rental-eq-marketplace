import PageTitle from "@/components/ui/page-title"
import ItemForm from "../_components/item-form"

function AddItemPage() {
  return (
    <div>
      <PageTitle title="Add Item" />
      <ItemForm formType="add" />
    </div>
  )
}

export default AddItemPage