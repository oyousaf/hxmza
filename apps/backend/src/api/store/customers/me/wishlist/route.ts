import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { WISHLIST_MODULE } from "../../../../../modules/wishlist"
import WishlistModuleService from "../../../../../modules/wishlist/service"
import { addWishlistItemWorkflow } from "../../../../../workflows/wishlist"

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context.actor_id
  const wishlistModuleService: WishlistModuleService = req.scope.resolve(
    WISHLIST_MODULE
  )

  const items = await wishlistModuleService.listWishlistItems({
    customer_id: customerId,
  })

  res.json({ wishlist_items: items })
}

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context.actor_id
  const { product_id } = req.body as { product_id: string }

  if (!product_id) {
    res.status(400).json({ message: "product_id is required" })
    return
  }

  const { result } = await addWishlistItemWorkflow(req.scope).run({
    input: { customer_id: customerId, product_id },
  })

  res.json({ wishlist_item: result })
}
