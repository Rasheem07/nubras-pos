"use client"

import type React from "react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Save, Package, Upload, X, Loader2 } from "lucide-react"

// Create a schema that matches the UpdateInventoryDto (which extends PartialType of CreateInventoryDto)
const inventorySchema = z.object({
  name: z.string().max(75, "Name must be 75 characters or less").optional(),
  sku: z.string().max(15, "SKU must be 15 characters or less").optional(),
  category: z.string().max(15, "Category must be 15 characters or less").optional(),
  uom: z.string().max(20, "UOM must be 20 characters or less").optional(),
  description: z.string().optional(),
  cost: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
  minStock: z.number().int().min(1).optional(),
  reorderPoint: z.number().int().nonnegative().optional(),
  supplierId: z.number().int().positive().optional(),
  barcode: z.string().optional(),
  weight: z.string().max(12, "Weight must be 12 characters or less").optional(),
  notes: z.string().optional(),
})

type InventoryFormValues = z.infer<typeof inventorySchema>

interface Supplier {
  id: number
  name: string
  phone: string
  location?: string
  email?: string
}

export default function EditInventoryItemPage() {
  const params = useParams()
  const router = useRouter()
  const itemId = Number(params.id)

  const [activeTab, setActiveTab] = useState("basic")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
  })

  // Watch form values for summary
  const watchedValues = watch()

  // Fetch item details and suppliers
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch item details
        const itemResponse = await fetch(`https://api.alnubras.co/api/v1/inventory/${itemId}`, { credentials: "include",})
        if (!itemResponse.ok) {
          throw new Error("Failed to fetch item details")
        }
        const itemData = await itemResponse.json()

        // Reset form with item data
        reset({
          name: itemData.name,
          sku: itemData.sku,
          category: itemData.category,
          uom: itemData.uom,
          description: itemData.description ?? undefined,
          cost: itemData.cost,
          stock: itemData.stock,
          minStock: itemData.minStock,
          reorderPoint: itemData.reorderPoint,
          supplierId: itemData.supplierId,
          barcode: itemData.barcode,
          weight: itemData.weight ?? undefined,
          notes: itemData.notes ?? undefined,
        })

        // Fetch suppliers
        const suppliersResponse = await fetch("https://api.alnubras.co/api/v1/suppliers", { credentials: "include",})
        if (!suppliersResponse.ok) {
          throw new Error("Failed to fetch suppliers")
        }
        const suppliersData = await suppliersResponse.json()
        setSuppliers(suppliersData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load item data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [itemId, reset])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
  }

  const onSubmit = async (data: InventoryFormValues) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`https://api.alnubras.co/api/v1/inventory/${itemId}`, {
        credentials: "include",
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update inventory item")
      }

      const result = await response.json()
      toast.success(result.message || "Inventory item updated successfully!")
      router.push(`/inventory/${itemId}`)
    } catch (error) {
      console.error("Error updating inventory item:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update inventory item")
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = ["fabrics", "ready-made", "Accessories", "Packaging"]
  const uoms = ["pc", "meter", "kg", "liter", "box", "roll", "pair"]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          <h1 className="text-3xl font-bold tracking-tight">Edit {watchedValues.name}</h1>
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
              Save Changes
            </>
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="pricing">Pricing & Stock</TabsTrigger>
                <TabsTrigger value="details">Additional Details</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Edit the basic details of the inventory item</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Item Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          placeholder="Enter item name"
                          {...register("name")}
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sku">
                          SKU <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="sku"
                          placeholder="Enter SKU"
                          {...register("sku")}
                          className={errors.sku ? "border-red-500" : ""}
                        />
                        {errors.sku && <p className="text-red-500 text-sm">{errors.sku.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">
                          Category <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) => setValue("category", value)}
                          defaultValue={watchedValues.category}
                        >
                          <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="uom">
                          Unit of Measurement <span className="text-red-500">*</span>
                        </Label>
                        <Select onValueChange={(value) => setValue("uom", value)} defaultValue={watchedValues.uom}>
                          <SelectTrigger id="uom" className={errors.uom ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select UOM" />
                          </SelectTrigger>
                          <SelectContent>
                            {uoms.map((uom) => (
                              <SelectItem key={uom} value={uom}>
                                {uom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.uom && <p className="text-red-500 text-sm">{errors.uom.message}</p>}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Enter item description"
                          {...register("description")}
                          rows={4}
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="pricing" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing & Stock</CardTitle>
                    <CardDescription>Manage pricing and stock information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cost">
                          Cost Price (AED) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="cost"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...register("cost")}
                          className={errors.cost ? "border-red-500" : ""}
                        />
                        {errors.cost && <p className="text-red-500 text-sm">{errors.cost.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock">
                          Current Stock <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="stock"
                          type="number"
                          placeholder="0"
                          {...register("stock", { valueAsNumber: true })}
                          className={errors.stock ? "border-red-500" : ""}
                        />
                        {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minStock">
                          Minimum Stock <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="minStock"
                          type="number"
                          placeholder="1"
                          {...register("minStock", { valueAsNumber: true })}
                          className={errors.minStock ? "border-red-500" : ""}
                        />
                        {errors.minStock && <p className="text-red-500 text-sm">{errors.minStock.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reorderPoint">
                          Reorder Point <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="reorderPoint"
                          type="number"
                          placeholder="0"
                          {...register("reorderPoint", { valueAsNumber: true })}
                          className={errors.reorderPoint ? "border-red-500" : ""}
                        />
                        {errors.reorderPoint && <p className="text-red-500 text-sm">{errors.reorderPoint.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supplierId">Preferred Supplier</Label>
                        <Select
                          onValueChange={(value) => setValue("supplierId", Number.parseInt(value))}
                          defaultValue={watchedValues.supplierId?.toString()}
                        >
                          <SelectTrigger id="supplierId">
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
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="details" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Details</CardTitle>
                    <CardDescription>Edit more information about the item</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="barcode">Barcode</Label>
                        <Input id="barcode" placeholder="Enter barcode" {...register("barcode")} />
                        {errors.barcode && <p className="text-red-500 text-sm">{errors.barcode.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight</Label>
                        <Input
                          id="weight"
                          placeholder="Enter weight"
                          {...register("weight")}
                          className={errors.weight ? "border-red-500" : ""}
                        />
                        {errors.weight && <p className="text-red-500 text-sm">{errors.weight.message}</p>}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" placeholder="Enter additional notes" {...register("notes")} rows={4} />
                        {errors.notes && <p className="text-red-500 text-sm">{errors.notes.message}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Item Image</CardTitle>
                <CardDescription>Upload or change the item image</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Item preview"
                      className="w-full h-auto rounded-md object-cover"
                    />
                    <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={removeImage}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                    <Package className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Drag and drop an image or click to browse</p>
                    <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <Button variant="outline" onClick={() => document.getElementById("image")?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{watchedValues.name || "Not set"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKU:</span>
                    <span className="font-medium">{watchedValues.sku || "Not set"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">{watchedValues.category || "Not set"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost Price:</span>
                    <span className="font-medium">
                      {watchedValues.cost ? `AED ${Number.parseFloat(watchedValues.cost).toFixed(2)}` : "Not set"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Stock:</span>
                    <span className="font-medium">{watchedValues.stock || "0"}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
