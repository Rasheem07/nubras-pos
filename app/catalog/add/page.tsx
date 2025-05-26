"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ArrowLeft, Save, Upload, AlertCircle, Package, Search } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Mock inventory items for demonstration
const mockInventoryItems = [
  {
    id: 1,
    name: "White Linen Fabric",
    category: "Fabrics",
    sku: "FAB-LIN-WHT-001",
    quantity: 150,
    cost: 30,
  },
  {
    id: 2,
    name: "Black Cotton Fabric",
    category: "Fabrics",
    sku: "FAB-COT-BLK-001",
    quantity: 120,
    cost: 25,
  },
  {
    id: 3,
    name: "Premium Silk Fabric",
    category: "Fabrics",
    sku: "FAB-SLK-PRM-001",
    quantity: 30,
    cost: 70,
  },
  {
    id: 4,
    name: "Kandura (Premium)",
    category: "Ready-made",
    sku: "KAN-PREM-001",
    quantity: 25,
    cost: 250,
  },
  {
    id: 5,
    name: "Kandura (Standard)",
    category: "Ready-made",
    sku: "KAN-STD-001",
    quantity: 8,
    cost: 180,
  },
  {
    id: 6,
    name: "Abaya (Premium)",
    category: "Ready-made",
    sku: "ABA-PREM-001",
    quantity: 18,
    cost: 300,
  },
]

type ProductType = "ready-made" | "custom" | "alteration" | "fabric" | "service"

export default function AddProductPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<number | null>(null)
  const [showInventorySelector, setShowInventorySelector] = useState(false)

  const [newProduct, setNewProduct] = useState<{
    type: ProductType
    name?: string
    sellingPrice?: number
    sku?: string
    barcode?: string
    description?: string
    category?: string
    enabled: boolean
    image?: string
    inventoryItemId?: number
  }>({
    type: "ready-made",
    enabled: true,
  })

  // Filter inventory items based on product type
  const filteredInventoryItems = mockInventoryItems.filter((item) => {
    if (newProduct.type === "ready-made") {
      return item.category === "Ready-made"
    } else if (newProduct.type === "fabric") {
      return item.category === "Fabrics"
    }
    return false
  }).filter(
    (item) =>
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get selected inventory item details
  const selectedItem = selectedInventoryItem
    ? mockInventoryItems.find((item) => item.id === selectedInventoryItem)
    : null

  // Update product type and reset inventory selection if needed
  const handleProductTypeChange = (type: ProductType) => {
    setNewProduct({
      ...newProduct,
      type,
      inventoryItemId: undefined,
    })
    setSelectedInventoryItem(null)
    
    // Show inventory selector for ready-made and fabric products
    setShowInventorySelector(type === "ready-made" || type === "fabric")
  }

  // Select inventory item
  const handleSelectInventoryItem = (id: number) => {
    setSelectedInventoryItem(id)
    setNewProduct({
      ...newProduct,
      inventoryItemId: id,
    })
    setShowInventorySelector(false)
  }

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

  // Determine if we need to show inventory selector
  useEffect(() => {
    setShowInventorySelector(
      (newProduct.type === "ready-made" || newProduct.type === "fabric") && !selectedInventoryItem
    )
  }, [newProduct.type, selectedInventoryItem])

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

      {/* Product Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Product Type</CardTitle>
          <CardDescription>Select the type of product you want to add</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={newProduct.type}
            onValueChange={(value: ProductType) => handleProductTypeChange(value)}
            className="grid grid-cols-2 gap-4 sm:grid-cols-5"
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-3 h-6 w-6"
                >
                  <path d="M3 6v18h18V6" />
                  <path d="M3 6V3h18v3" />
                  <path d="M3 6l9 6 9-6" />
                </svg>
                Custom
              </Label>
            </div>
            <div>
              <RadioGroupItem value="alteration" id="alteration" className="peer sr-only" />
              <Label
                htmlFor="alteration"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-3 h-6 w-6"
                >
                  <path d="M12 22v-5" />
                  <path d="M9 8V2" />
                  <path d="M15 8V2" />
                  <path d="M5 8h14" />
                  <path d="M19 8a7 7 0 0 1-14 0" />
                </svg>
                Alteration
              </Label>
            </div>
            <div>
              <RadioGroupItem value="fabric" id="fabric" className="peer sr-only" />
              <Label
                htmlFor="fabric"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-3 h-6 w-6"
                >
                  <path d="M3 3v18h18" />
                  <path d="M7 14l4-4 4 4 4-4" />
                </svg>
                Fabric
              </Label>
            </div>
            <div>
              <RadioGroupItem value="service" id="service" className="peer sr-only" />
              <Label
                htmlFor="service"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-3 h-6 w-6"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m4.93 4.93 14.14 14.14" />
                </svg>
                Service
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Inventory Item Selector for ready-made and fabric products */}
      {(newProduct.type === "ready-made" || newProduct.type === "fabric") && (
        <Card>
          <CardHeader>
            <CardTitle>Link to Inventory Item</CardTitle>
            <CardDescription>
              {newProduct.type === "ready-made" || newProduct.type === "fabric"
                ? `Select an existing inventory item for this ${newProduct.type} product`
                : "Inventory link not required for this product type"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedItem ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium">{selectedItem.name}</h3>
                      <p className="text-sm text-muted-foreground">SKU: {selectedItem.sku}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    {selectedItem.category}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedInventoryItem(null)
                      setNewProduct({
                        ...newProduct,
                        inventoryItemId: undefined,
                      })
                      setShowInventorySelector(true)
                    }}
                  >
                    Change
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Available Quantity:</span>
                    <p className="font-medium">{selectedItem.quantity}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cost Price:</span>
                    <p className="font-medium">AED {selectedItem.cost.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ID:</span>
                    <p className="font-medium">{selectedItem.id}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert variant="default">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Required</AlertTitle>
                  <AlertDescription>
                    {newProduct.type === "ready-made" || newProduct.type === "fabric"
                      ? `You must select an inventory item for ${newProduct.type} products`
                      : "Inventory link not required for this product type"}
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
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowInventorySelector(true)
                    }}
                  >
                    Browse Items
                  </Button>
                </div>

                {showInventorySelector && (
                  <div className="border rounded-md max-h-[300px] overflow-y-auto">
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
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>AED {item.cost.toFixed(2)}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSelectInventoryItem(item.id)}
                                >
                                  Select
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
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
                {/* For non-inventory linked products, show name field */}
                {(newProduct.type !== "ready-made" && newProduct.type !== "fabric") || !selectedItem ? (
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter product name"
                      value={newProduct.name || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Product Name</Label>
                    <div className="p-2 border rounded-md bg-muted/20">
                      {selectedItem?.name || "Select an inventory item"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Name is inherited from the linked inventory item
                    </p>
                  </div>
                )}

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

                {/* For non-inventory linked products, show SKU field */}
                {(newProduct.type !== "ready-made" && newProduct.type !== "fabric") || !selectedItem ? (
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      placeholder="Enter SKU"
                      value={newProduct.sku || ""}
                      onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>SKU</Label>
                    <div className="p-2 border rounded-md bg-muted/20">
                      {selectedItem?.sku || "Select an inventory item"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      SKU is inherited from the linked inventory item
                    </p>
                  </div>
                )}

                {/* Barcode field for all product types */}
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
                    checked={newProduct.enabled}
                    onCheckedChange={(checked) => setNewProduct({ ...newProduct, enabled: checked })}
                  />
                  <Label htmlFor="active">Active</Label>
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
                  <Label htmlFor="price">Selling Price (AED)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={newProduct.sellingPrice || ""}
                    onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: Number(e.target.value) })}
                  />
                </div>

                {/* Show cost from inventory for ready-made and fabric products */}
                {(newProduct.type === "ready-made" || newProduct.type === "fabric") && selectedItem ? (
                  <div className="space-y-2">
                    <Label>Cost Price (AED)</Label>
                    <div className="p-2 border rounded-md bg-muted/20">
                      AED {selectedItem?.cost.toFixed(2) || "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Cost is inherited from the linked inventory item
                    </p>
                  </div>
                ) : null}

                {/* Show profit margin calculation if we have both price and cost */}
                {newProduct.sellingPrice && selectedItem?.cost && (
                  <div className="space-y-2 sm:col-span-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Profit Margin</span>
                      <span className="text-sm font-medium">
                        {`${Math.round(((newProduct.sellingPrice - selectedItem.cost) / newProduct.sellingPrice) * 100)}%`}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(((newProduct.sellingPrice - selectedItem.cost) / newProduct.sellingPrice) * 100)
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

      <Card>
        <CardHeader>
          <CardTitle>Product Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Product Type</h3>
              <p className="font-medium">
                {newProduct.type.charAt(0).toUpperCase() + newProduct.type.slice(1)}
              </p>
            </div>
            {selectedItem && (newProduct.type === "ready-made" || newProduct.type === "fabric") && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Linked Inventory</h3>
                <p className="font-medium">{selectedItem.name}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
              <p className="font-medium">{newProduct.category || "Not set"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Selling Price</h3>
              <p className="font-medium">
                {newProduct.sellingPrice ? `AED ${newProduct.sellingPrice.toFixed(2)}` : "Not set"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="font-medium">{newProduct.enabled ? "Active" : "Inactive"}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="/catalog">Cancel</Link>
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" />
            Save Product
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
