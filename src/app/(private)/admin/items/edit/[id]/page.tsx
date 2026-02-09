import PageTitle from "@/components/ui/page-title"
import ItemForm from "../../_components/item-form"
function EditItemPage() {
  return (
    <div>
      <PageTitle
        title="Edit Item"
      />
      <ItemForm formType="edit" />
    </div>
  )
}

export default EditItemPage