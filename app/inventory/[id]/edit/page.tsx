"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Save, Package, Upload, X } from "lucide-react"

export default function EditInventoryItemPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")

  // In a real app, this would fetch the item from the database using the ID
  const itemId = params.id as string

  // Mock data for the inventory item
  const initialData = {
    id: itemId,
    name: "White Linen Fabric",
    sku: "FAB-LIN-WHT-001",
    category: "Fabrics",
    type: "fabric",
    description:
      "High-quality white linen fabric, perfect for premium kanduras and other garments. Sourced from the finest mills in Europe.",
    inStock: 150,
    minStock: 50,
    costPrice: 30,
    sellingPrice: 60,
    supplier: "Dubai Textile Co.",
    location: "Shelf A1",
    lastRestocked: "2024-04-15",
    status: "in-stock",
    barcode: "5901234123457",
    weight: "200g per meter",
    dimensions: "150cm width",
    notes: "Popular during summer months. Consider increasing minimum stock level during peak season.",
    image: "/placeholder.svg?key=6k1n3",
  }

  const [formData, setFormData] = useState(initialData)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.image || null)

  const handleChange = (field: string, value: string | number) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would update the database
    console.log("Form submitted:", formData)

    // Navigate back to inventory item detail
    router.push(`/inventory/${itemId}`)
  }

  const categories = ["Fabrics", "Ready-made", "Accessories", "Packaging"]
  const types = ["fabric", "ready-made", "accessory", "packaging"]
  const suppliers = [
    "Dubai Textile Co.",
    "Luxury Textiles LLC",
    "Al Noor Garments",
    "Elegant Abayas LLC",
    "Fashion Accessories Trading",
    "Packaging Solutions",
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/inventory/${itemId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit {formData.name}</h1>
        </div>
        <Button onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
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
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sku">
                          SKU <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="sku"
                          placeholder="Enter SKU"
                          value={formData.sku}
                          onChange={(e) => handleChange("sku", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">
                          Category <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                          <SelectTrigger id="category">
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
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">
                          Type <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {types.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Enter item description"
                          value={formData.description}
                          onChange={(e) => handleChange("description", e.target.value)}
                          rows={4}
                        />
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
                        <Label htmlFor="costPrice">
                          Cost Price (AED) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="costPrice"
                          type="number"
                          placeholder="0.00"
                          value={formData.costPrice || ""}
                          onChange={(e) => handleChange("costPrice", Number.parseFloat(e.target.value) || 0)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sellingPrice">
                          Selling Price (AED) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="sellingPrice"
                          type="number"
                          placeholder="0.00"
                          value={formData.sellingPrice || ""}
                          onChange={(e) => handleChange("sellingPrice", Number.parseFloat(e.target.value) || 0)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inStock">
                          Current Stock <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="inStock"
                          type="number"
                          placeholder="0"
                          value={formData.inStock || ""}
                          onChange={(e) => handleChange("inStock", Number.parseInt(e.target.value) || 0)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minStock">
                          Minimum Stock <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="minStock"
                          type="number"
                          placeholder="0"
                          value={formData.minStock || ""}
                          onChange={(e) => handleChange("minStock", Number.parseInt(e.target.value) || 0)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="supplier">Supplier</Label>
                        <Select value={formData.supplier} onValueChange={(value) => handleChange("supplier", value)}>
                          <SelectTrigger id="supplier">
                            <SelectValue placeholder="Select supplier" />
                          </SelectTrigger>
                          <SelectContent>
                            {suppliers.map((supplier) => (
                              <SelectItem key={supplier} value={supplier}>
                                {supplier}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Storage Location</Label>
                        <Input
                          id="location"
                          placeholder="Enter storage location"
                          value={formData.location}
                          onChange={(e) => handleChange("location", e.target.value)}
                        />
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
                        <Input
                          id="barcode"
                          placeholder="Enter barcode"
                          value={formData.barcode}
                          onChange={(e) => handleChange("barcode", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight</Label>
                        <Input
                          id="weight"
                          placeholder="Enter weight"
                          value={formData.weight}
                          onChange={(e) => handleChange("weight", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dimensions">Dimensions</Label>
                        <Input
                          id="dimensions"
                          placeholder="Enter dimensions (e.g., 10x20x30 cm)"
                          value={formData.dimensions}
                          onChange={(e) => handleChange("dimensions", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Enter additional notes"
                          value={formData.notes}
                          onChange={(e) => handleChange("notes", e.target.value)}
                          rows={4}
                        />
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
                    <span className="font-medium">{formData.name || "Not set"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKU:</span>
                    <span className="font-medium">{formData.sku || "Not set"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">{formData.category || "Not set"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost Price:</span>
                    <span className="font-medium">
                      {formData.costPrice ? `AED ${formData.costPrice.toFixed(2)}` : "Not set"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Selling Price:</span>
                    <span className="font-medium">
                      {formData.sellingPrice ? `AED ${formData.sellingPrice.toFixed(2)}` : "Not set"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Stock:</span>
                    <span className="font-medium">{formData.inStock || "0"}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleSubmit}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
