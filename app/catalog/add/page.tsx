"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Upload, AlertCircle, Package, Search, Loader2 } from "lucide-react"
import { createProductSchema, type CreateProductFormData } from "@/lib/schemas/product"
import { productsApi } from "@/lib/api/products"
import { inventoryApi, type InventoryItem } from "@/lib/api/inventory"
import { toast } from "sonner"
import { categoriesApi } from "@/lib/api/categories"
import { AddCategoryDialog } from "./_components/add-category-dialog"

// const categories = [
//   "Kandura",
//   "Abaya",
//   "Accessories",
//   "Custom Kandura",
//   "Custom Abaya",
//   "Alterations",
//   "Fabrics",
//   "Services",
// ]

export default function AddProductPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState("basic")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<InventoryItem | null>(null)
  const [showInventorySelector, setShowInventorySelector] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      type: "ready-made",
      name: "",
      sku: "",
      barcode: "",
      sellingPrice: "",
      description: "",
      categoryName: "",
    },
  })

  const { data: inventoryItems = [], isLoading: isLoadingInventory } = useQuery({
    queryKey: ["inventory"],
    queryFn: inventoryApi.getAll,
  })

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  })

  const createProductMutation = useMutation({
    mutationFn: ({ data, image }: { data: CreateProductFormData; image: File }) => productsApi.create(data, image),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ["products"] })
      router.push("/catalog")
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const productType = form.watch("type")

  // Filter inventory items based on product type
  const filteredInventoryItems = inventoryItems
    .filter((item) => {
      if (productType === "ready-made") {
        return item.category === "Ready-made"
      } else if (productType === "fabric") {
        return item.category === "Fabrics"
      }
      return false
    })
    .filter(
      (item) =>
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  const handleProductTypeChange = (type: CreateProductFormData["type"]) => {
    form.setValue("type", type)
    setSelectedInventoryItem(null)
    form.setValue("itemId", undefined)

    // Show inventory selector for ready-made and fabric products
    setShowInventorySelector(type === "ready-made" || type === "fabric")
  }

  const handleSelectInventoryItem = (item: InventoryItem) => {
    setSelectedInventoryItem(item)
    form.setValue("itemId", item.id)
    form.setValue("name", item.name)
    form.setValue("sku", item.sku)
    setShowInventorySelector(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
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
  }

  const onSubmit = (data: CreateProductFormData) => {
    if (!imageFile) {
      toast.error("Please upload a product image")
      return
    }

    createProductMutation.mutate({ data, image: imageFile })
  }

  const needsInventoryLink = productType === "ready-made" || productType === "fabric"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/catalog">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={createProductMutation.isPending}>
          {createProductMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Product
        </Button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Product Type</CardTitle>
            <CardDescription>Select the type of product you want to add</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={productType}
              onValueChange={handleProductTypeChange}
              className="grid grid-cols-2 gap-4 sm:grid-cols-5"
            >
              {[
                { value: "ready-made", label: "Ready-made", icon: Package },
                { value: "custom", label: "Custom", icon: Package },
                { value: "alteration", label: "Alteration", icon: Package },
                { value: "fabric", label: "Fabric", icon: Package },
                { value: "service", label: "Service", icon: Package },
              ].map(({ value, label, icon: Icon }) => (
                <div key={value}>
                  <RadioGroupItem value={value} id={value} className="peer sr-only" />
                  <Label
                    htmlFor={value}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Icon className="mb-3 h-6 w-6" />
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Inventory Item Selector */}
        {needsInventoryLink && (
          <Card>
            <CardHeader>
              <CardTitle>Link to Inventory Item</CardTitle>
              <CardDescription>Select an existing inventory item for this {productType} product</CardDescription>
            </CardHeader>
            <CardContent>
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
                        form.setValue("itemId", undefined)
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
                  <Alert variant="default">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Required</AlertTitle>
                    <AlertDescription>You must select an inventory item for {productType} products</AlertDescription>
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="media">Media & Description</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the basic details about the product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Name field */}
                  {!needsInventoryLink || !selectedInventoryItem ? (
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input id="name" placeholder="Enter product name" {...form.register("name")} />
                      {form.formState.errors.name && (
                        <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Product Name</Label>
                      <div className="p-2 border rounded-md bg-muted/20">
                        {selectedInventoryItem?.name || "Select an inventory item"}
                      </div>
                      <p className="text-xs text-muted-foreground">Name is inherited from the linked inventory item</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={form.watch("categoryName")}
                      onValueChange={(value) => form.setValue("categoryName", value)}
                      disabled={isLoadingCategories}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select category"} />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingCategories ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="ml-2 text-sm">Loading...</span>
                          </div>
                        ) : (
                          <>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                            <div className="border-t mt-1 pt-1">
                              <AddCategoryDialog
                                onCategoryAdded={(categoryName) => {
                                  form.setValue("categoryName", categoryName)
                                }}
                              />
                            </div>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.categoryName && (
                      <p className="text-sm text-destructive">{form.formState.errors.categoryName.message}</p>
                    )}
                  </div>

                  {/* SKU field */}
                  {!needsInventoryLink || !selectedInventoryItem ? (
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU *</Label>
                      <Input id="sku" placeholder="Enter SKU" {...form.register("sku")} />
                      {form.formState.errors.sku && (
                        <p className="text-sm text-destructive">{form.formState.errors.sku.message}</p>
                      )}
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

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="barcode">Barcode *</Label>
                    <Input id="barcode" placeholder="Enter barcode" {...form.register("barcode")} />
                    {form.formState.errors.barcode && (
                      <p className="text-sm text-destructive">{form.formState.errors.barcode.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Set the selling price for this product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Selling Price (AED) *</Label>
                    <Input id="price" type="number" step="0.01" placeholder="0.00" {...form.register("sellingPrice")} />
                    {form.formState.errors.sellingPrice && (
                      <p className="text-sm text-destructive">{form.formState.errors.sellingPrice.message}</p>
                    )}
                  </div>

                  {/* Show cost from inventory for ready-made and fabric products */}
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
                  {form.watch("sellingPrice") && selectedInventoryItem?.cost && (
                    <div className="space-y-2 sm:col-span-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Profit Margin</span>
                        <span className="text-sm font-medium">
                          {(() => {
                            const sellingPrice = Number.parseFloat(form.watch("sellingPrice"))
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
                                ((Number.parseFloat(form.watch("sellingPrice")) -
                                  Number.parseFloat(selectedInventoryItem.cost)) /
                                  Number.parseFloat(form.watch("sellingPrice"))) *
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
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Media & Description</CardTitle>
                <CardDescription>Add images and detailed description for the product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label>Product Image *</Label>
                    <div className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md p-4 h-40">
                      {imagePreview ? (
                        <div className="relative w-full h-full">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Product preview"
                            className="object-contain w-full h-full"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-0 right-0"
                            onClick={removeImage}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center">
                          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-1">
                            Drag & drop an image here, or click to browse
                          </p>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => document.getElementById("image-upload")?.click()}
                          >
                            Upload Image
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter product description"
                      className="min-h-[120px]"
                      {...form.register("description")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Product Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Product Type</h3>
                <p className="font-medium">{productType.charAt(0).toUpperCase() + productType.slice(1)}</p>
              </div>
              {selectedInventoryItem && needsInventoryLink && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Linked Inventory</h3>
                  <p className="font-medium">{selectedInventoryItem.name}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                <p className="font-medium">{form.watch("categoryName") || "Not set"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Selling Price</h3>
                <p className="font-medium">
                  {form.watch("sellingPrice")
                    ? `AED ${Number.parseFloat(form.watch("sellingPrice")).toFixed(2)}`
                    : "Not set"}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" asChild>
              <Link href="/catalog">Cancel</Link>
            </Button>
            <Button type="submit" disabled={createProductMutation.isPending}>
              {createProductMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Product
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
