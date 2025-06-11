import { z } from "zod"

/**
 * 1) Define the base object schema separately, WITHOUT refine:
 */
const productBase = z.object({
  type: z.enum(["ready-made", "custom", "alteration", "fabric", "service"]),
  name: z
    .string()
    .min(1, "Name is required")
    .max(75, "Name must be less than 75 characters"),
  sku: z
    .string()
    .min(1, "SKU is required")
    .max(15, "SKU must be less than 15 characters"),
  barcode: z.string().min(1, "Barcode is required"),
  itemId: z.number().positive().optional(),
  sellingPrice: z.string().min(1, "Selling price is required"),
  description: z.string().optional(),
  categoryName: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category must be less than 50 characters"),
})

/**
 * 2) Create the “create” schema by refining the base:
 *    (still requires itemId on ready-made/fabric)
 */
export const createProductSchema = productBase.refine(
  (data) => {
    if (
      (data.type === "ready-made" || data.type === "fabric") &&
      !data.itemId
    ) {
      return false
    }
    return true
  },
  {
    message: "Item ID is required for ready-made and fabric products",
    path: ["itemId"],
  }
)

/**
 * 3) Create the “update” schema by first making every field optional
 *    (via .partial()), then re‐applying the same refinement logic.
 */
export const updateProductSchema = productBase
  .partial() // ← now, every property in productBase is optional
  .refine(
    (data) => {
      // If they set type = "ready-made" or "fabric", then itemId must exist
      // But because everything is optional, you only run this check
      // when type is actually provided:
      if (
        (data.type === "ready-made" || data.type === "fabric") &&
        !data.itemId
      ) {
        return false
      }
      return true
    },
    {
      message: "Item ID is required for ready-made and fabric products",
      path: ["itemId"],
    }
  )

export type CreateProductFormData = z.infer<typeof createProductSchema>
export type UpdateProductFormData = z.infer<typeof updateProductSchema>
