"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { ArrowLeft, Save, Upload, Package, Plus, Trash2, Search, Loader2, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

// API functions
const productsApi = {
  create: async (data: FormData) => {
    const response = await fetch("http://localhost:5005/api/v1/products", {
      method: "POST",
      body: data,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to create product")
    }

    return response.json()
  },
}

const inventoryApi = {
  getAll: async () => {
    const response = await fetch("http://localhost:5005/api/v1/inventory")
    if (!response.ok) {
      throw new Error("Failed to fetch inventory items")
    }
    return response.json()
  },
}

const categoriesApi = {
  getAll: async () => {
    const response = await fetch("http://localhost:5005/api/v1/products/list/categories")
    if (!response.ok) {
      throw new Error("Failed to fetch categories")
    }
    return response.json()
  },
  create: async (name: string) => {
    const response = await fetch("http://localhost:5005/api/v1/products/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
    if (!response.ok) {
      throw new Error("Failed to create category")
    }
    return response.json()
  },
}

// Types
interface InventoryItem {
  id: number
  name: string
  sku: string
  category: string
  stock: number
  cost: string
  barcode: string
}

interface Category {
  id: number
  name: string
}

// Schema for custom models
const customModelSchema = z.object({
  name: z.string().min(1, "Model name is required"),
  charge: z.string().min(1, "Charge amount is required"),
})

// Schema matching the CreateProductDto
const createProductSchema = z.object({
  type: z.enum(["ready-made", "custom"]),
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required").max(15, "SKU must be 15 characters or less"),
  barcode: z.string().min(1, "Barcode is required"),
  itemId: z.number().int().positive().optional(),
  sellingPrice: z.string().min(1, "Selling price is required"),
  description: z.string().optional(),
  categoryName: z.string().min(1, "Category is required").max(50, "Category must be 50 characters or less"),
  models: z.array(customModelSchema).optional(),
})

type CreateProductFormData = z.infer<typeof createProductSchema>

export default function AddProductPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null)
  const [showInventorySelector, setShowInventorySelector] = useState(false)
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // React Query hooks
  const { data: inventoryItems = [], isLoading: isLoadingInventory } = useQuery({
    queryKey: ["inventory"],
    queryFn: inventoryApi.getAll,
  })

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  })

  const createCategoryMutation = useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      setIsCreateCategoryOpen(false)
      setNewCategoryName("")
      toast.success("Category created successfully")
    },
    onError: (error) => {
      toast.error(`Failed to create category: ${error.message}`)
    },
  })

  const createProductMutation = useMutation({
    mutationFn: (formData: FormData) => productsApi.create(formData),
    onSuccess: (data) => {
      toast.success(data.message || "Product created successfully")
      queryClient.invalidateQueries({ queryKey: ["products"] })
      router.push("/catalog")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create product")
    },
  })

  // Form setup with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      type: "ready-made",
      name: "",
      sku: "",
      barcode: "",
      sellingPrice: "",
      description: "",
      categoryName: "",
      models: [],
    },
  })

  // Setup field array for custom models
  const { fields, append, remove } = useFieldArray({
    control,
    name: "models",
  })

  // Watch form values for conditional rendering
  const productType = watch("type")

  // Filter inventory items based on search query
  const filteredInventoryItems = inventoryItems.filter(
    (item) =>
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleProductTypeChange = (type: CreateProductFormData["type"]) => {
    setValue("type", type)

    if (type === "ready-made") {
      setShowInventorySelector(true)
    } else {
      setSelectedInventoryItem(null)
      setValue("itemId", undefined)
      setShowInventorySelector(false)
    }
  }

  const handleSelectInventoryItem = (item: InventoryItem) => {
    setSelectedInventoryItem(item)
    setValue("itemId", item.id)
    setValue("name", item.name)
    setValue("sku", item.sku)
    setShowInventorySelector(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.match(/image\/(jpeg|png|gif|webp)/)) {
        toast.error("Only image files are allowed (jpg, png, gif, webp)")
        return
      }

      // Validate file size (20MB max)
      if (file.size > 20 * 1024 * 1024) {
        toast.error("Image size must be less than 20MB")
        return
      }

      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const addCustomModel = () => {
    append({ name: "", charge: "" })
  }

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      createCategoryMutation.mutate(newCategoryName.trim())
    }
  }

  const onSubmit = (data: CreateProductFormData) => {
    if (!imageFile) {
      toast.error("Please upload a product image")
      return
    }

    // Create FormData for multipart/form-data submission
    const formData = new FormData()

    // Add the image file
    formData.append("image", imageFile)

    // Add all form data
    Object.entries(data).forEach(([key, value]) => {
      if (key === "models") {
        // Skip models, we'll add them separately
      } else if (key === "itemId" && value) {
        formData.append(key, String(value))
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })

    // Add models as JSON string if present
    if (data.models && data.models.length > 0 && (data.type === "custom")) {
      formData.append("models", JSON.stringify(data.models))
    }

    createProductMutation.mutate(formData)
  }

  const needsInventoryLink = productType === "ready-made"

  useEffect(() => {
     setValue("barcode", selectedInventoryItem?.barcode)
  }, [selectedInventoryItem?.barcode])

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background py-4 border-b">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/catalog">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
          </div>
          <Button onClick={handleSubmit(onSubmit)} disabled={createProductMutation.isPending}>
            {createProductMutation.isPending ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </div>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Product
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main content - Left column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Product Type Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Product Type</CardTitle>
                <CardDescription>Select the type of product you want to add</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={productType}
                  onValueChange={handleProductTypeChange}
                  className="grid grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem value="ready-made" id="ready-made" className="peer sr-only" />
                    <Label
                      htmlFor="ready-made"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Package className="mb-3 h-6 w-6" />
                      Ready-made
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="custom" id="custom" className="peer sr-only" />
                    <Label
                      htmlFor="custom"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Package className="mb-3 h-6 w-6" />
                      Custom
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Inventory Item Selector (for ready-made and both types) */}
            {needsInventoryLink && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Link to Inventory Item</CardTitle>
                  <CardDescription>Select an existing inventory item for this product</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedInventoryItem ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-medium">{selectedInventoryItem.name}</h3>
                            <p className="text-sm text-muted-foreground">SKU: {selectedInventoryItem.sku}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{selectedInventoryItem.category}</Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedInventoryItem(null)
                            setValue("itemId", undefined)
                            setShowInventorySelector(true)
                          }}
                        >
                          Change
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Available Quantity:</span>
                          <p className="font-medium">{selectedInventoryItem.stock}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cost Price:</span>
                          <p className="font-medium">AED {Number.parseFloat(selectedInventoryItem.cost).toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">ID:</span>
                          <p className="font-medium">{selectedInventoryItem.id}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Alert variant="destructive">
                        <AlertDescription>
                          You must select an inventory item for {productType} products
                        </AlertDescription>
                      </Alert>

                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search inventory items..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <Button type="button" variant="outline" onClick={() => setShowInventorySelector(true)}>
                          Browse Items
                        </Button>
                      </div>

                      {showInventorySelector && (
                        <div className="border rounded-md max-h-[300px] overflow-y-auto">
                          {isLoadingInventory ? (
                            <div className="flex items-center justify-center p-6">
                              <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                          ) : (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>SKU</TableHead>
                                  <TableHead>Category</TableHead>
                                  <TableHead>Quantity</TableHead>
                                  <TableHead>Cost</TableHead>
                                  <TableHead className="w-[80px]"></TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredInventoryItems.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                      No inventory items found
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  filteredInventoryItems.map((item) => (
                                    <TableRow key={item.id}>
                                      <TableCell className="font-medium">{item.name}</TableCell>
                                      <TableCell>{item.sku}</TableCell>
                                      <TableCell>{item.category}</TableCell>
                                      <TableCell>{item.stock}</TableCell>
                                      <TableCell>AED {Number.parseFloat(item.cost).toFixed(2)}</TableCell>
                                      <TableCell>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleSelectInventoryItem(item)}
                                        >
                                          Select
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Basic Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name field */}
                  {!needsInventoryLink || !selectedInventoryItem ? (
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Product Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter product name"
                        {...register("name")}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>Product Name</Label>
                      <div className="p-2 border rounded-md bg-muted/20">
                        {selectedInventoryItem?.name || "Select an inventory item"}
                      </div>
                      <p className="text-xs text-muted-foreground">Name is inherited from the linked inventory item</p>
                    </div>
                  )}

                  {/* SKU field */}
                  {!needsInventoryLink || !selectedInventoryItem ? (
                    <div className="space-y-2">
                      <Label htmlFor="sku">
                        SKU <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="sku"
                        placeholder="Enter SKU (max 15 chars)"
                        {...register("sku")}
                        className={errors.sku ? "border-red-500" : ""}
                        maxLength={15}
                      />
                      {errors.sku && <p className="text-red-500 text-sm">{errors.sku.message}</p>}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>SKU</Label>
                      <div className="p-2 border rounded-md bg-muted/20">
                        {selectedInventoryItem?.sku || "Select an inventory item"}
                      </div>
                      <p className="text-xs text-muted-foreground">SKU is inherited from the linked inventory item</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="barcode">
                      Barcode <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="barcode"
                      placeholder="Enter barcode"
                      value={selectedInventoryItem?.barcode}
                      onChange={(e) => setValue("barcode", e.target.value)}
                      className={errors.barcode ? "border-red-500" : "bg-muted/20 focus:outline-none"}
                    />
                    {errors.barcode && <p className="text-red-500 text-sm">{errors.barcode.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="categoryName">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCreateCategoryOpen(true)}
                        className="h-8 px-2 text-xs"
                      >
                        <PlusCircle className="h-3.5 w-3.5 mr-1" />
                        Add New
                      </Button>
                    </div>
                    <Select
                      onValueChange={(value) => setValue("categoryName", value)}
                      defaultValue={watch("categoryName")}
                    >
                      <SelectTrigger id="categoryName" className={errors.categoryName ? "border-red-500" : ""}>
                        <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select category"} />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingCategories ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="ml-2 text-sm">Loading...</span>
                          </div>
                        ) : (
                          categories.map((category: Category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {errors.categoryName && <p className="text-red-500 text-sm">{errors.categoryName.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter product description"
                    {...register("description")}
                    rows={3}
                  />
                  {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sellingPrice">
                      Selling Price (AED) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="sellingPrice"
                      type="text"
                      placeholder="0.00"
                      {...register("sellingPrice")}
                      className={errors.sellingPrice ? "border-red-500" : ""}
                    />
                    {errors.sellingPrice && <p className="text-red-500 text-sm">{errors.sellingPrice.message}</p>}
                  </div>

                  {/* Show cost from inventory for ready-made and both products */}
                  {needsInventoryLink && selectedInventoryItem && (
                    <div className="space-y-2">
                      <Label>Cost Price (AED)</Label>
                      <div className="p-2 border rounded-md bg-muted/20">
                        AED {Number.parseFloat(selectedInventoryItem.cost).toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground">Cost is inherited from the linked inventory item</p>
                    </div>
                  )}

                  {/* Show profit margin calculation */}
                  {watch("sellingPrice") && selectedInventoryItem?.cost && (
                    <div className="space-y-2 md:col-span-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Profit Margin</span>
                        <span className="text-sm font-medium">
                          {(() => {
                            const sellingPrice = Number.parseFloat(watch("sellingPrice"))
                            const cost = Number.parseFloat(selectedInventoryItem.cost)
                            const margin = Math.round(((sellingPrice - cost) / sellingPrice) * 100)
                            return `${margin}%`
                          })()}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(
                                ((Number.parseFloat(watch("sellingPrice")) -
                                  Number.parseFloat(selectedInventoryItem.cost)) /
                                  Number.parseFloat(watch("sellingPrice"))) *
                                  100,
                              ),
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Custom Models Section - Only show for custom or both types */}
            {(productType === "custom" || productType === "both") && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Custom Models</CardTitle>
                  <CardDescription>Add variations of this product with different pricing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {fields.length === 0
                        ? "No custom models added yet. Click 'Add Model' to create variations."
                        : `${fields.length} model${fields.length !== 1 ? "s" : ""} added`}
                    </p>
                    <Button type="button" variant="outline" size="sm" onClick={addCustomModel}>
                      <Plus className="h-4 w-4 mr-1" /> Add Model
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border p-3 rounded-md"
                      >
                        <div className="space-y-2 md:col-span-5">
                          <Label htmlFor={`models.${index}.name`}>
                            Model Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`models.${index}.name`}
                            placeholder="Model name"
                            {...register(`models.${index}.name`)}
                            className={errors.models?.[index]?.name ? "border-red-500" : ""}
                          />
                          {errors.models?.[index]?.name && (
                            <p className="text-red-500 text-sm">{errors.models[index].name?.message}</p>
                          )}
                        </div>
                        <div className="space-y-2 md:col-span-5">
                          <Label htmlFor={`models.${index}.charge`}>
                            Additional Charge <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`models.${index}.charge`}
                            placeholder="0.00"
                            {...register(`models.${index}.charge`)}
                            className={errors.models?.[index]?.charge ? "border-red-500" : ""}
                          />
                          {errors.models?.[index]?.charge && (
                            <p className="text-red-500 text-sm">{errors.models[index].charge?.message}</p>
                          )}
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                          <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right column - Image upload and summary */}
          <div className="lg:col-span-4 space-y-6">
            {/* Product Image */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>
                  Product Image <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Product preview"
                      className="w-full h-auto rounded-md object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                    <Package className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Drag and drop an image or click to browse</p>
                    <Input
                      id="image"
                      type="file"
                      ref={fileInputRef}
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button type="button" variant="outline" onClick={() => document.getElementById("image")?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </Button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Supported formats: JPG, PNG, GIF, WebP. Maximum size: 20MB.
                </p>
              </CardContent>
            </Card>

            {/* Product Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Product Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium capitalize">{productType}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{watch("name") || "Not set"}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU:</span>
                  <span className="font-medium">{watch("sku") || "Not set"}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{watch("categoryName") || "Not set"}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Selling Price:</span>
                  <span className="font-medium">
                    {watch("sellingPrice") ? `AED ${watch("sellingPrice")}` : "Not set"}
                  </span>
                </div>
                {needsInventoryLink && selectedInventoryItem && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Linked Inventory:</span>
                      <span className="font-medium">#{selectedInventoryItem.id}</span>
                    </div>
                  </>
                )}
                {(productType === "custom" || productType === "both") && fields.length > 0 && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Custom Models:</span>
                      <span className="font-medium">{fields.length}</span>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleSubmit(onSubmit)} disabled={createProductMutation.isPending}>
                  {createProductMutation.isPending ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Product
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>

      {/* Create Category Dialog */}
      {isCreateCategoryOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Create New Category</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-category">Category Name</Label>
                <Input
                  id="new-category"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateCategoryOpen(false)}
                  disabled={createCategoryMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={!newCategoryName.trim() || createCategoryMutation.isPending}
                >
                  {createCategoryMutation.isPending ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    "Create Category"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
