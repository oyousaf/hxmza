import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { removeWishlistItemWorkflow } from "../../../../../../workflows/wishlist"

export async function DELETE(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const customerId = req.auth_context.actor_id
  const { product_id } = req.params

  await removeWishlistItemWorkflow(req.scope).run({
    input: { customer_id: customerId, product_id },
  })

  res.json({ id: product_id, deleted: true })
}
