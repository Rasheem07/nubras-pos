"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Package, Calendar, Loader2 } from "lucide-react"

// Create a schema that matches the CreateRestockDto
const restockSchema = z.object({
  itemId: z.number().int().positive(),
  qty: z.number().int().min(1, "Quantity must be at least 1"),
  cost: z.string().min(1, "Cost is required"),
  total: z.string().min(1, "Total is required"),
  supplierId: z.number().int().positive("Supplier is required"),
  invNo: z.string().max(15, "Invoice number must be 15 characters or less").optional(),
  restockDate: z.string().min(1, "Restock date is required"),
  notes: z.string().optional(),
})

type RestockFormValues = z.infer<typeof restockSchema>

interface InventoryItem {
  id: number
  name: string
  sku: string
  category: string
  uom: string
  description?: string
  cost: string
  stock: number
  minStock: number
  reorderPoint: number
  barcode?: string
  supplierId?: number
  weight?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface Supplier {
  id: number
  name: string
  phone: string
  location?: string
  email?: string
}


export default function RestockInventoryItemPage() {
  const params = useParams()
  const router = useRouter()
  const itemId = Number(params.id)

  const [item, setItem] = useState<InventoryItem | null>(null)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RestockFormValues>({
    resolver:  zodResolver(restockSchema),
    defaultValues: {
      itemId: itemId,
      qty: 1,
      cost: "",
      total: "",
      supplierId: undefined,
      invNo: "",
      restockDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
  })

  // Watch quantity and cost to calculate total
  const watchQty = watch("qty")
  const watchCost = watch("cost")
  const watchSupplierId = watch("supplierId")

  // Calculate total when quantity or cost changes
  useEffect(() => {
    if (watchQty && watchCost) {
      const total = (watchQty * Number.parseFloat(watchCost)).toFixed(2)
      setValue("total", total)
    }
  }, [watchQty, watchCost, setValue])

  // Fetch item details and suppliers
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch item details
        const itemResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/inventory/${itemId}`, {
          credentials: "include"
        })
        if (!itemResponse.ok) {
          throw new Error("Failed to fetch item details")
        }
        const itemData = await itemResponse.json()
        setItem(itemData)
        setValue("cost", itemData.cost)

        // Fetch suppliers
        const suppliersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/suppliers`, {
          credentials: "include"
        })
        if (!suppliersResponse.ok) {
          throw new Error("Failed to fetch suppliers")
        }
        const suppliersData = await suppliersResponse.json()
        setSuppliers(suppliersData)

        // Set default supplier if item has one
        if (itemData.supplierId) {
          setValue("supplierId", itemData.supplierId)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load required data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [itemId, setValue])

  const onSubmit = async (data: RestockFormValues) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/inventory/restock`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to restock item")
      }

      const result = await response.json()
      toast.success(result.message || "Item restocked successfully!")
      router.push(`/inventory/${itemId}`)
    } catch (error) {
      console.error("Error restocking item:", error)
      toast.error(error instanceof Error ? error.message : "Failed to restock item")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedSupplier = suppliers.find((s) => s.id === watchSupplierId)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-2">Item Not Found</h2>
        <p className="text-muted-foreground mb-4">The inventory item you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/inventory">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Inventory
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/inventory/${itemId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Restock {item.name}</h1>
        </div>
        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </div>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Restock
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Restock Details</CardTitle>
              <CardDescription>Enter the details for this restock</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qty">
                    Quantity ({item.uom}) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="qty"
                    type="number"
                    placeholder="0"
                    {...register("qty", { valueAsNumber: true })}
                    className={errors.qty ? "border-red-500" : ""}
                    min="1"
                  />
                  {errors.qty && <p className="text-red-500 text-sm">{errors.qty.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">
                    Cost Price (AED) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cost"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    {...register("cost")}
                    className={errors.cost ? "border-red-500" : ""}
                  />
                  {errors.cost && <p className="text-red-500 text-sm">{errors.cost.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplierId">
                    Supplier <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) => setValue("supplierId", Number(value))}
                    defaultValue={watchSupplierId?.toString()}
                  >
                    <SelectTrigger id="supplierId" className={errors.supplierId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id.toString()}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.supplierId && <p className="text-red-500 text-sm">{errors.supplierId.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invNo">Invoice Number</Label>
                  <Input
                    id="invNo"
                    placeholder="Enter invoice number"
                    {...register("invNo")}
                    className={errors.invNo ? "border-red-500" : ""}
                  />
                  {errors.invNo && <p className="text-red-500 text-sm">{errors.invNo.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restockDate">
                    Restock Date <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex">
                    <Calendar className="mr-2 h-4 w-4 mt-3 text-muted-foreground" />
                    <Input
                      id="restockDate"
                      type="date"
                      {...register("restockDate")}
                      className={errors.restockDate ? "border-red-500" : ""}
                    />
                  </div>
                  {errors.restockDate && <p className="text-red-500 text-sm">{errors.restockDate.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any notes about this restock"
                    {...register("notes")}
                    rows={4}
                  />
                  {errors.notes && <p className="text-red-500 text-sm">{errors.notes.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Item Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-16 w-16 rounded-md overflow-hidden bg-primary/10 flex items-center justify-center">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.sku}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Stock:</span>
                  <span className="font-medium">
                    {item.stock} {item.uom}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Minimum Stock:</span>
                  <span className="font-medium">
                    {item.minStock} {item.uom}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Cost:</span>
                  <span className="font-medium">AED {Number.parseFloat(item.cost).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{item.category}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Restock Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity to Add:</span>
                  <span className="font-medium">
                    {watchQty} {item.uom}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">New Stock Level:</span>
                  <span className="font-medium">
                    {item.stock + watchQty} {item.uom}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Selected Supplier:</span>
                  <span className="font-medium">{selectedSupplier?.name || "None"}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cost per Unit:</span>
                  <span className="font-medium">
                    AED {watchCost ? Number.parseFloat(watchCost).toFixed(2) : "0.00"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Cost:</span>
                  <span className="font-medium">
                    AED {watchQty && watchCost ? (watchQty * Number.parseFloat(watchCost)).toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <Package className="mr-2 h-4 w-4" />
                    Complete Restock
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
