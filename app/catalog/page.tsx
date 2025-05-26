"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Search, Filter, Plus, MoreHorizontal, Package, Edit, Trash2, XCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type ProductType = "ready-made" | "custom" | "alteration" | "fabric" | "service"

interface Product {
  id: number
  name: string
  image: string
  sku: string
  category: string
  price: number
  stock: number
  status: "In stock" | "Low stock" | "Out of stock" | "N/A"
}

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const products: Product[] = [
    {
      id: 1,
      name: "Kandura (Premium)",
      image: "/placeholder.svg?key=ng1v2",
      sku: "KAN-PREM-001",
      category: "Kandura",
      price: 450.0,
      stock: 25,
      status: "In stock" as const,
    },
    {
      id: 2,
      name: "Kandura (Standard)",
      image: "/placeholder.svg?key=ng1v2",
      sku: "KAN-STD-001",
      category: "Kandura",
      price: 350.0,
      stock: 5,
      status: "Low stock" as const,
    },
    {
      id: 3,
      name: "Abaya (Premium)",
      image: "/placeholder.svg?key=zgibz",
      sku: "ABA-PREM-001",
      category: "Abaya",
      price: 550.0,
      stock: 0,
      status: "Out of stock" as const,
    },
    {
      id: 4,
      name: "Abaya (Standard)",
      image: "/placeholder.svg?key=zgibz",
      sku: "ABA-STD-001",
      category: "Abaya",
      price: 350.0,
      stock: 30,
      status: "In stock" as const,
    },
    {
      id: 5,
      name: "Scarf (Silk)",
      image: "/cozy-knit-scarf.png",
      sku: "SCF-SLK-001",
      category: "Accessories",
      price: 120.0,
      stock: 45,
      status: "In stock" as const,
    },
    {
      id: 6,
      name: "Custom Kandura (Premium)",
      image: "/placeholder.svg?key=du4p4",
      sku: "CUST-KAN-PREM-001",
      category: "Custom Kandura",
      price: 650.0,
      stock: 0,
      status: "N/A" as const,
    },
    {
      id: 7,
      name: "Custom Abaya (Premium)",
      image: "/placeholder.svg?key=gtqz4",
      sku: "CUST-ABA-PREM-001",
      category: "Custom Abaya",
      price: 750.0,
      stock: 0,
      status: "N/A" as const,
    },
    {
      id: 8,
      name: "Alteration - Kandura",
      image: "/placeholder.svg?key=eirs7",
      sku: "ALT-KAN-001",
      category: "Alterations",
      price: 100.0,
      stock: 0,
      status: "N/A" as const,
    },
    {
      id: 9,
      name: "White Linen (per meter)",
      image: "/placeholder.svg?key=gkzwi",
      sku: "FAB-LIN-WHT-001",
      category: "Fabrics",
      price: 60.0,
      stock: 150,
      status: "In stock" as const,
    },
    {
      id: 10,
      name: "Embroidery Service",
      image: "/placeholder.svg?key=55a49",
      sku: "SRV-EMB-001",
      category: "Services",
      price: 150.0,
      stock: 0,
      status: "N/A" as const,
    },
  ]

  const categories = Array.from(new Set(products.map((p) => p.category)))

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()),
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
          <ProductsTable
            products={filteredProducts.filter(
              (p) => p.category === "Kandura" || p.category === "Abaya" || p.category === "Accessories",
            )}
          />
        </TabsContent>
        <TabsContent value="custom" className="space-y-4">
          <ProductsTable
            products={filteredProducts.filter((p) => p.category === "Custom Kandura" || p.category === "Custom Abaya")}
          />
        </TabsContent>
        <TabsContent value="services" className="space-y-4">
          <ProductsTable
            products={filteredProducts.filter((p) => p.category === "Services" || p.category === "Alterations")}
          />
        </TabsContent>
        <TabsContent value="fabrics" className="space-y-4">
          <ProductsTable products={filteredProducts.filter((p) => p.category === "Fabrics")} />
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
            <div className="text-2xl font-bold">{products.filter((p) => p.status === "Low stock").length}</div>
            <p className="text-xs text-muted-foreground">Items below minimum stock level</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.filter((p) => p.status === "Out of stock").length}</div>
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
  const router = useRouter()

  const handleRowClick = (id: number) => {
    router.push(`/catalog/${id}`)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
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
              <TableRow key={product.id} onClick={() => handleRowClick(product.id)} className="cursor-pointer">
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
                      <div className="text-xs text-muted-foreground">#{product.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>AED {product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.status}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/catalog/${product.id}/edit`)
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Disable
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
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
