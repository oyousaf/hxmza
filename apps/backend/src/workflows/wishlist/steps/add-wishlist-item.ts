import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { WISHLIST_MODULE } from "../../../modules/wishlist"
import WishlistModuleService from "../../../modules/wishlist/service"

type AddWishlistItemInput = {
  customer_id: string
  product_id: string
}

export const addWishlistItemStep = createStep(
  "add-wishlist-item",
  async (input: AddWishlistItemInput, { container }) => {
    const service: WishlistModuleService = container.resolve(WISHLIST_MODULE)

    const existing = await service.listWishlistItems({
      customer_id: input.customer_id,
      product_id: input.product_id,
    })

    if (existing.length) {
      return new StepResponse(existing[0], null)
    }

    const item = await service.createWishlistItems(input)

    return new StepResponse(item, item.id)
  },
  async (createdId: string | null, { container }) => {
    if (!createdId) {
      return
    }

    const service: WishlistModuleService = container.resolve(WISHLIST_MODULE)
    await service.deleteWishlistItems([createdId])
  }
)
