import { deleteLineItem } from "@lib/data/cart"
import { notifyCartUpdated } from "@lib/util/cart-events"
import { Trash } from "@medusajs/icons"
import { clx } from "@modules/common/components/ui"

const DeleteButton = ({
  id,
  quantity = 1,
  onRemoved,
  onRestore,
  children,
  className,
}: {
  id: string
  /** Line item quantity, so the basket badge drops by the right amount immediately. */
  quantity?: number
  /** Called synchronously on click so the parent can hide the row instantly. */
  onRemoved?: () => void
  /** Called if the delete actually fails, so the parent can bring the row back. */
  onRestore?: () => void
  children?: React.ReactNode
  className?: string
}) => {
  const handleDelete = async (id: string) => {
    onRemoved?.()
    notifyCartUpdated(-quantity)

    try {
      await deleteLineItem(id)
    } catch {
      notifyCartUpdated(quantity)
      onRestore?.()
    }
  }

  return (
    <div
      className={clx(
        "flex items-center justify-between text-small-regular",
        className
      )}
    >
      <button
        className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
        onClick={() => handleDelete(id)}
      >
        <Trash />
        <span>{children}</span>
      </button>
    </div>
  )
}

export default DeleteButton
