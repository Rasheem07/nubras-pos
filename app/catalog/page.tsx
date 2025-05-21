"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Filter, Plus, MoreHorizontal, Package, Edit, Copy, Trash2, Tag } from "lucide-react"
import Link from "next/link"

type ProductType = "ready-made" | "custom" | "alteration" | "fabric" | "service"

interface Product {
  id: string
  name: string
  type: ProductType
  price: number
  cost?: number
  sku: string
  barcode?: string
  description?: string
  category: string
  inStock: number
  minStock?: number
  isActive: boolean
  image?: string
  createdAt: string
  updatedAt: string
}

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const products: Product[] = [
    {
      id: "PRD-001",
      name: "Kandura (Premium)",
      type: "ready-made",
      price: 450,
      cost: 250,
      sku: "KAN-PREM-001",
      barcode: "5901234123457",
      description: "Premium quality kandura made from the finest materials",
      category: "Kandura",
      inStock: 25,
      minStock: 10,
      isActive: true,
      image: "/placeholder.svg?key=ng1v2",
      createdAt: "2024-01-15",
      updatedAt: "2024-04-20",
    },
    {
      id: "PRD-002",
      name: "Kandura (Standard)",
      type: "ready-made",
      price: 350,
      cost: 180,
      sku: "KAN-STD-001",
      barcode: "5901234123458",
      description: "Standard quality kandura for everyday wear",
      category: "Kandura",
      inStock: 42,
      minStock: 15,
      isActive: true,
      image: "/placeholder.svg?key=ng1v2",
      createdAt: "2024-01-15",
      updatedAt: "2024-04-20",
    },
    {
      id: "PRD-003",
      name: "Abaya (Premium)",
      type: "ready-made",
      price: 550,
      cost: 300,
      sku: "ABA-PREM-001",
      barcode: "5901234123459",
      description: "Premium quality abaya with elegant design",
      category: "Abaya",
      inStock: 18,
      minStock: 8,
      isActive: true,
      image: "/placeholder.svg?key=zgibz",
      createdAt: "2024-01-20",
      updatedAt: "2024-04-15",
    },
    {
      id: "PRD-004",
      name: "Abaya (Standard)",
      type: "ready-made",
      price: 350,
      cost: 180,
      sku: "ABA-STD-001",
      barcode: "5901234123460",
      description: "Standard quality abaya for everyday wear",
      category: "Abaya",
      inStock: 30,
      minStock: 12,
      isActive: true,
      image: "/placeholder.svg?key=zgibz",
      createdAt: "2024-01-20",
      updatedAt: "2024-04-15",
    },
    {
      id: "PRD-005",
      name: "Scarf (Silk)",
      type: "ready-made",
      price: 120,
      cost: 60,
      sku: "SCF-SLK-001",
      barcode: "5901234123461",
      description: "Luxurious silk scarf with elegant patterns",
      category: "Accessories",
      inStock: 45,
      minStock: 20,
      isActive: true,
      image: "/cozy-knit-scarf.png",
      createdAt: "2024-02-05",
      updatedAt: "2024-04-10",
    },
    {
      id: "PRD-006",
      name: "Custom Kandura (Premium)",
      type: "custom",
      price: 650,
      cost: 350,
      sku: "CUST-KAN-PREM-001",
      description: "Custom-made premium kandura tailored to your measurements",
      category: "Custom Kandura",
      inStock: 0,
      isActive: true,
      image: "/placeholder.svg?key=du4p4",
      createdAt: "2024-02-10",
      updatedAt: "2024-04-05",
    },
    {
      id: "PRD-007",
      name: "Custom Abaya (Premium)",
      type: "custom",
      price: 750,
      cost: 400,
      sku: "CUST-ABA-PREM-001",
      description: "Custom-made premium abaya tailored to your measurements",
      category: "Custom Abaya",
      inStock: 0,
      isActive: true,
      image: "/placeholder.svg?key=gtqz4",
      createdAt: "2024-02-15",
      updatedAt: "2024-04-01",
    },
    {
      id: "PRD-008",
      name: "Alteration - Kandura",
      type: "alteration",
      price: 100,
      cost: 50,
      sku: "ALT-KAN-001",
      description: "Professional alteration service for kanduras",
      category: "Alterations",
      inStock: 0,
      isActive: true,
      image: "/placeholder.svg?key=eirs7",
      createdAt: "2024-02-20",
      updatedAt: "2024-03-25",
    },
    {
      id: "PRD-009",
      name: "White Linen (per meter)",
      type: "fabric",
      price: 60,
      cost: 30,
      sku: "FAB-LIN-WHT-001",
      barcode: "5901234123462",
      description: "High-quality white linen fabric",
      category: "Fabrics",
      inStock: 150,
      minStock: 50,
      isActive: true,
      image: "/placeholder.svg?key=gkzwi",
      createdAt: "2024-03-01",
      updatedAt: "2024-03-20",
    },
    {
      id: "PRD-010",
      name: "Embroidery Service",
      type: "service",
      price: 150,
      cost: 75,
      sku: "SRV-EMB-001",
      description: "Custom embroidery service for garments",
      category: "Services",
      inStock: 0,
      isActive: true,
      image: "/placeholder.svg?key=55a49",
      createdAt: "2024-03-05",
      updatedAt: "2024-03-15",
    },
  ]

  const categories = Array.from(new Set(products.map((p) => p.category)))

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.barcode && product.barcode.includes(searchQuery)),
    )
    .filter((product) => !selectedCategory || product.category === selectedCategory)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Product Catalog</h1>
        <Button asChild>
          <Link href="/catalog/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, SKU, or barcode..."
            className="pl-8 w-full md:w-[300px] lg:w-[400px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={selectedCategory || "all"}
          onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filter</span>
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="ready-made">Ready-made</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="fabrics">Fabrics</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <ProductsTable products={filteredProducts} />
        </TabsContent>
        <TabsContent value="ready-made" className="space-y-4">
          <ProductsTable products={filteredProducts.filter((p) => p.type === "ready-made")} />
        </TabsContent>
        <TabsContent value="custom" className="space-y-4">
          <ProductsTable products={filteredProducts.filter((p) => p.type === "custom")} />
        </TabsContent>
        <TabsContent value="services" className="space-y-4">
          <ProductsTable products={filteredProducts.filter((p) => p.type === "service" || p.type === "alteration")} />
        </TabsContent>
        <TabsContent value="fabrics" className="space-y-4">
          <ProductsTable products={filteredProducts.filter((p) => p.type === "fabric")} />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Across {categories.length} categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter((p) => p.minStock && p.inStock <= p.minStock && p.inStock > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">Items below minimum stock level</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                products.filter(
                  (p) => p.type !== "custom" && p.type !== "alteration" && p.type !== "service" && p.inStock <= 0,
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Items that need reordering</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface ProductsTableProps {
  products: Product[]
}

function ProductsTable({ products }: ProductsTableProps) {
  const getProductTypeBadge = (type: ProductType) => {
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

  const getStockStatus = (product: Product) => {
    if (product.type === "custom" || product.type === "alteration" || product.type === "service") {
      return <Badge variant="outline">N/A</Badge>
    }

    if (product.inStock <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    }

    if (product.minStock && product.inStock <= product.minStock) {
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
          Low Stock
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
        In Stock
      </Badge>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2">No products found</p>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md overflow-hidden">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getProductTypeBadge(product.type)}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>AED {product.price.toFixed(2)}</TableCell>
                <TableCell>
                  {product.type === "custom" || product.type === "alteration" || product.type === "service"
                    ? "N/A"
                    : product.inStock}
                </TableCell>
                <TableCell>{getStockStatus(product)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      {(product.type === "ready-made" || product.type === "fabric") && (
                        <DropdownMenuItem>
                          <Package className="mr-2 h-4 w-4" />
                          Update Stock
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Tag className="mr-2 h-4 w-4" />
                        Manage Pricing
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
