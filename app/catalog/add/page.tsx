"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"

type ProductType = "ready-made" | "custom" | "alteration" | "fabric" | "service"

export default function AddProductPage() {
  const router = useRouter()

  const [newProduct, setNewProduct] = useState<{
    type: ProductType
    name?: string
    price?: number
    cost?: number
    sku?: string
    barcode?: string
    description?: string
    category?: string
    inStock?: number
    minStock?: number
    isActive: boolean
    image?: string
  }>({
    type: "ready-made",
    isActive: true,
  })

  // Sample categories for the form
  const categories = [
    "Kandura",
    "Abaya",
    "Accessories",
    "Custom Kandura",
    "Custom Abaya",
    "Alterations",
    "Fabrics",
    "Services",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would save the data to your backend
    console.log("Adding product:", newProduct)
    router.push("/catalog")
  }

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
        <Button onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" />
          Save Product
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Costs</TabsTrigger>
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
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter product name"
                    value={newProduct.name || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Product Type</Label>
                  <Select
                    value={newProduct.type}
                    onValueChange={(value: ProductType) => setNewProduct({ ...newProduct, type: value })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ready-made">Ready-made</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                      <SelectItem value="alteration">Alteration</SelectItem>
                      <SelectItem value="fabric">Fabric</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem value="new_category">+ Add New Category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    placeholder="Enter SKU"
                    value={newProduct.sku || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode (optional)</Label>
                  <Input
                    id="barcode"
                    placeholder="Enter barcode"
                    value={newProduct.barcode || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={newProduct.isActive}
                    onCheckedChange={(checked) => setNewProduct({ ...newProduct, isActive: checked })}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Information</CardTitle>
              <CardDescription>Manage stock levels and inventory settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {newProduct.type === "ready-made" || newProduct.type === "fabric" ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="inStock">Current Stock</Label>
                      <Input
                        id="inStock"
                        type="number"
                        placeholder="0"
                        value={newProduct.inStock || ""}
                        onChange={(e) => setNewProduct({ ...newProduct, inStock: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minStock">Minimum Stock</Label>
                      <Input
                        id="minStock"
                        type="number"
                        placeholder="0"
                        value={newProduct.minStock || ""}
                        onChange={(e) => setNewProduct({ ...newProduct, minStock: Number(e.target.value) })}
                      />
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 rounded-md bg-muted p-4 text-center">
                    <p className="text-muted-foreground">
                      Inventory tracking is not applicable for{" "}
                      {newProduct.type === "custom"
                        ? "custom products"
                        : newProduct.type === "alteration"
                          ? "alterations"
                          : "services"}
                      .
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Costs</CardTitle>
              <CardDescription>Set the selling price and cost information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Selling Price (AED)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={newProduct.price || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost (AED)</Label>
                  <Input
                    id="cost"
                    type="number"
                    placeholder="0.00"
                    value={newProduct.cost || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, cost: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Profit Margin</span>
                    <span className="text-sm font-medium">
                      {newProduct.price && newProduct.cost
                        ? `${Math.round(((newProduct.price - newProduct.cost) / newProduct.price) * 100)}%`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    {newProduct.price && newProduct.cost && (
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${Math.min(100, Math.round(((newProduct.price - newProduct.cost) / newProduct.price) * 100))}%`,
                        }}
                      />
                    )}
                  </div>
                </div>
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
                  <Label>Product Image</Label>
                  <div className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-md p-4 h-40">
                    {newProduct.image ? (
                      <div className="relative w-full h-full">
                        <img
                          src={newProduct.image || "/placeholder.svg"}
                          alt="Product preview"
                          className="object-contain w-full h-full"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-0 right-0"
                          onClick={() => setNewProduct({ ...newProduct, image: undefined })}
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
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setNewProduct({ ...newProduct, image: "/placeholder.svg?key=product" })}
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
                    value={newProduct.description || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
