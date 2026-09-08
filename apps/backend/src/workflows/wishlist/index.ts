import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { addWishlistItemStep } from "./steps/add-wishlist-item"
import { removeWishlistItemStep } from "./steps/remove-wishlist-item"

type WishlistItemInput = {
  customer_id: string
  product_id: string
}

export const addWishlistItemWorkflow = createWorkflow(
  "add-wishlist-item",
  (input: WishlistItemInput) => {
    const item = addWishlistItemStep(input)

    return new WorkflowResponse(item)
  }
)

export const removeWishlistItemWorkflow = createWorkflow(
  "remove-wishlist-item",
  (input: WishlistItemInput) => {
    const result = removeWishlistItemStep(input)

    return new WorkflowResponse(result)
  }
)
