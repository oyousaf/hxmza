import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { WISHLIST_MODULE } from "../../../modules/wishlist"
import WishlistModuleService from "../../../modules/wishlist/service"

type RemoveWishlistItemInput = {
  customer_id: string
  product_id: string
}

export const removeWishlistItemStep = createStep(
  "remove-wishlist-item",
  async (input: RemoveWishlistItemInput, { container }) => {
    const service: WishlistModuleService = container.resolve(WISHLIST_MODULE)

    const existing = await service.listWishlistItems({
      customer_id: input.customer_id,
      product_id: input.product_id,
    })

    if (existing.length) {
      await service.deleteWishlistItems(existing.map((item) => item.id))
    }

    return new StepResponse({ deleted: true })
  }
)
