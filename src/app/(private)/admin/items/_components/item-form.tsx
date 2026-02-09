import { ItemInterface } from "@/interfaces"

interface ItemFormProps {
  formType: "add" | "edit"
  initialValues?: Partial<ItemInterface>
}

function ItemForm({ formType, initialValues }: ItemFormProps) {
  return (
    <div className="mt-5">ItemForm</div>
  )
}

export default ItemForm