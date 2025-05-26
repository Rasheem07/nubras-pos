"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Upload, Package } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

// Mock data for editing
const mockProduct = {
  id: 1,
  type: "ready-made" as const,
  name: "Kandura (Premium)",
  sku: "KAN-PREM-001",
  barcode: "5901234123457",
  itemId: 4,
  sellingPrice: "450.00",
  description: "Premium quality kandura made from the finest materials",
  categoryName: "Kandura",
  image: "/placeholder.svg?key=ng1v2",
}

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

const productTypes = [
  { value: "ready-made", label: "Ready-made" },
  { value: "custom", label: "Custom" },
  { value: "alteration", label: "Alteration" },
  { value: "fabric", label: "Fabric" },
  { value: "service", label: "Service" },
]

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState(mockProduct)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In real app, call your update API
      console.log("Updating product:", product)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      router.push(`/catalog/${productId}`)
    } catch (error) {
      console.error("Failed to update product:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProduct = (field: string, value: any) => {
    setProduct((prev) => ({ ...prev, [field]: value }))
  }

  const getProductTypeBadge = (type: string) => {
    switch (type) {
      case "ready-made":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ready-made</Badge>
      case "custom":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Custom</Badge>
      case "alteration":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Alteration</Badge>
      case "fabric":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Fabric</Badge>
      case "service":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Service</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/catalog/${productId}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to product</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
            <p className="text-muted-foreground">Update product information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/catalog/${productId}`}>Cancel</Link>
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update the basic details about the product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Product Type</Label>
                <div className="flex items-center gap-2">
                  <Select value={product.type} onValueChange={(value) => updateProduct("type", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {productTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getProductTypeBadge(product.type)}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={product.categoryName} onValueChange={(value) => updateProduct("categoryName", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={product.name}
                  onChange={(e) => updateProduct("name", e.target.value)}
                  placeholder="Enter product name"
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={product.sku}
                  onChange={(e) => updateProduct("sku", e.target.value)}
                  placeholder="Enter SKU"
                  maxLength={15}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  value={product.barcode}
                  onChange={(e) => updateProduct("barcode", e.target.value)}
                  placeholder="Enter barcode"
                />
              </div>

              {(product.type === "ready-made" || product.type === "fabric") && (
                <div className="space-y-2 md:col-span-2">
                  <Label>Linked Inventory Item</Label>
                  <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/20">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Inventory Item #{product.itemId}</p>
                      <p className="text-sm text-muted-foreground">Linked to inventory for stock management</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>Set the selling price for this product</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Selling Price (AED)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={product.sellingPrice}
                  onChange={(e) => updateProduct("sellingPrice", e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media & Description */}
        <Card>
          <CardHeader>
            <CardTitle>Media & Description</CardTitle>
            <CardDescription>Update product image and description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-md overflow-hidden bg-muted">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Change Image
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={product.description || ""}
                onChange={(e) => updateProduct("description", e.target.value)}
                placeholder="Enter product description"
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Type:</span>
                <p className="font-medium">{product.type}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Category:</span>
                <p className="font-medium">{product.categoryName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">SKU:</span>
                <p className="font-medium">{product.sku}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Price:</span>
                <p className="font-medium">AED {Number.parseFloat(product.sellingPrice).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
