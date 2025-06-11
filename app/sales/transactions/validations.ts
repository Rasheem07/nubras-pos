import { z } from "zod"

export const createTransactionSchema = z.object({
  orderId: z.number().positive("Order ID must be a positive number"),
  paymentMethod: z.enum(["visa", "bank_transfer", "cash"], {
    required_error: "Payment method is required",
  }),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
})

export const updateTransactionSchema = z.object({
  paymentMethod: z.enum(["visa", "bank_transfer", "cash"]).optional(),
  amount: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: "Amount must be a positive number",
    }),
})

export type CreateTransactionForm = z.infer<typeof createTransactionSchema>
export type UpdateTransactionForm = z.infer<typeof updateTransactionSchema>
