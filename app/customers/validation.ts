import { z } from "zod"

// Validation schema for measurement details
const measurementDetailsSchema = z.object({
  frontLength: z.number().optional(),
  backLength: z.number().optional(),
  shoulder: z.number().optional(),
  sleeves: z.number().optional(),
  neck: z.number().optional(),
  waist: z.number().optional(),
  chest: z.number().optional(),
  widthEnd: z.number().optional(),
  notes: z.string().optional(),
})

// Validation schema for customer measurement
export const customerMeasurementSchema = z.object({
  arabic: measurementDetailsSchema.optional(),
  kuwaiti: measurementDetailsSchema.optional(),
})

// Validation schema for creating a customer
export const createCustomerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  phone: z.string().min(1, "Phone number is required").max(16),
  email: z.string().email("Invalid email address").max(100).optional().or(z.literal("")),
  status: z.enum(["new", "active", "platinum", "gold", "diamond", "inactive"]).default("new").optional(),
  measurement: customerMeasurementSchema.optional(),
  preferences: z.array(z.string()).optional(),
})

// Validation schema for updating a customer
export const updateCustomerSchema = createCustomerSchema.partial()
