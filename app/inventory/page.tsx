"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Package,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  FileText,
  Edit,
  Eye,
  Trash2,
  AlertTriangle,
  Building,
} from "lucide-react"

interface InventoryItem {
  id: number
  name: string
  sku: string
  category: string
  uom: string
  description?: string
  cost: number
  stock: number
  minStock: number
  reorderPoint: number
  barcode?: string
  supplierId?: number
  weight?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

type SortField = "name" | "sku" | "stock" | "cost" | "lastRestocked"
type SortDirection = "asc" | "desc"

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  // Sample inventory data
  const inventoryItems: InventoryItem[] = [
    {
      id: 1,
      name: "White Linen Fabric",
      sku: "FAB-LIN-WHT-001",
      category: "Fabrics",
      uom: "Meter",
      description: "High-quality white linen fabric",
      cost: 30,
      stock: 150,
      minStock: 50,
      reorderPoint: 75,
      barcode: "1234567890",
      supplierId: 1,
      weight: "0.2 kg",
      notes: "Ideal for summer clothing",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: "Black Cotton Fabric",
      sku: "FAB-COT-BLK-001",
      category: "Fabrics",
      uom: "Meter",
      description: "Durable black cotton fabric",
      cost: 25,
      stock: 120,
      minStock: 40,
      reorderPoint: 60,
      barcode: "0987654321",
      supplierId: 1,
      weight: "0.25 kg",
      notes: "Perfect for lining",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: "Premium Silk Fabric",
      sku: "FAB-SLK-PRM-001",
      category: "Fabrics",
      uom: "Meter",
      description: "Luxurious premium silk fabric",
      cost: 70,
      stock: 30,
      minStock: 20,
      reorderPoint: 25,
      barcode: "1122334455",
      supplierId: 2,
      weight: "0.15 kg",
      notes: "Suitable for evening wear",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      name: "Kandura (Premium)",
      sku: "KAN-PREM-001",
      category: "Ready-made",
      uom: "Piece",
      description: "High-end Kandura",
      cost: 250,
      stock: 25,
      minStock: 10,
      reorderPoint: 15,
      barcode: "6677889900",
      supplierId: 3,
      weight: "0.8 kg",
      notes: "Elegant traditional wear",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 5,
      name: "Kandura (Standard)",
      sku: "KAN-STD-001",
      category: "Ready-made",
      uom: "Piece",
      description: "Standard Kandura",
      cost: 180,
      stock: 8,
      minStock: 15,
      reorderPoint: 20,
      barcode: "5544332211",
      supplierId: 3,
      weight: "0.7 kg",
      notes: "Everyday wear",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 6,
      name: "Abaya (Premium)",
      sku: "ABA-PREM-001",
      category: "Ready-made",
      uom: "Piece",
      description: "Luxury Abaya",
      cost: 300,
      stock: 18,
      minStock: 8,
      reorderPoint: 12,
      barcode: "1020304050",
      supplierId: 4,
      weight: "0.9 kg",
      notes: "Exclusive design",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 7,
      name: "Abaya (Standard)",
      sku: "ABA-STD-001",
      category: "Ready-made",
      uom: "Piece",
      description: "Standard Abaya",
      cost: 180,
      stock: 0,
      minStock: 12,
      reorderPoint: 18,
      barcode: "5040302010",
      supplierId: 4,
      weight: "0.85 kg",
      notes: "Comfortable and stylish",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 8,
      name: "Buttons (Gold)",
      sku: "ACC-BTN-GLD-001",
      category: "Accessories",
      uom: "Piece",
      description: "Gold plated buttons",
      cost: 0.5,
      stock: 500,
      minStock: 200,
      reorderPoint: 300,
      barcode: "1928374655",
      supplierId: 5,
      weight: "0.01 kg",
      notes: "Adds elegance to garments",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 9,
      name: "Zippers (Black)",
      sku: "ACC-ZIP-BLK-001",
      category: "Accessories",
      uom: "Piece",
      description: "Durable black zippers",
      cost: 1,
      stock: 150,
      minStock: 100,
      reorderPoint: 125,
      barcode: "5647382911",
      supplierId: 5,
      weight: "0.02 kg",
      notes: "Essential for clothing",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 10,
      name: "Premium Gift Box",
      sku: "PKG-BOX-PRM-001",
      category: "Packaging",
      uom: "Piece",
      description: "Luxury gift box",
      cost: 10,
      stock: 5,
      minStock: 20,
      reorderPoint: 25,
      barcode: "9182736455",
      supplierId: 6,
      weight: "0.3 kg",
      notes: "Perfect for special occasions",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  // Get unique categories, types, and statuses for filters
  const categories = Array.from(new Set(inventoryItems.map((item) => item.category)))
  const types = Array.from(new Set(inventoryItems.map((item) => item.uom)))
  const statuses = Array.from(
    new Set(inventoryItems.map((item) => (item.stock <= item.reorderPoint ? "low-stock" : "in-stock"))),
  )

  // Filter and sort inventory items
  const filteredItems = inventoryItems
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((item) => !selectedCategory || item.category === selectedCategory)
    .filter((item) => !selectedType || item.uom === selectedType)
    .filter(
      (item) => !selectedStatus || (item.stock <= item.reorderPoint ? "low-stock" : "in-stock") === selectedStatus,
    )
    .sort((a, b) => {
      let comparison = 0

      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortField === "sku") {
        comparison = a.sku.localeCompare(b.sku)
      } else if (sortField === "stock") {
        comparison = a.stock - b.stock
      } else if (sortField === "cost") {
        comparison = a.cost - b.cost
      } else if (sortField === "lastRestocked") {
        comparison = a.updatedAt.getTime() - b.updatedAt.getTime()
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

  // Toggle sort direction or change sort field
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Get status badge based on status
  const getStatusBadge = (stock: number, reorderPoint: number) => {
    const status = stock <= reorderPoint ? "low-stock" : "in-stock"
    switch (status) {
      case "in-stock":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>
      case "low-stock":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Low Stock</Badge>
      default:
        return null
    }
  }

  // Calculate inventory statistics
  const totalItems = inventoryItems.length
  const lowStockItems = inventoryItems.filter((item) => item.stock <= item.reorderPoint).length
  const outOfStockItems = inventoryItems.filter((item) => item.stock === 0).length
  const totalValue = inventoryItems.reduce((total, item) => total + item.cost * item.stock, 0)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/inventory/suppliers">
              <Building className="mr-2 h-4 w-4" />
              Suppliers
            </Link>
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link href="/inventory/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">Across {categories.length} categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items below minimum stock level</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStockItems}</div>
            <p className="text-xs text-muted-foreground">Items that need reordering</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Based on cost price</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, SKU, or supplier..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={selectedCategory || "all"}
            onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[150px]">
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

          <Select
            value={selectedType || "all"}
            onValueChange={(value) => setSelectedType(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedStatus || "all"}
            onValueChange={(value) => setSelectedStatus(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "in-stock" ? "In Stock" : "Low Stock"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">More filters</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
          <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
          <TabsTrigger value="reorder">Reorder List</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <InventoryTable
            items={filteredItems}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </TabsContent>
        <TabsContent value="low-stock" className="space-y-4">
          <InventoryTable
            items={filteredItems.filter((item) => item.stock <= item.reorderPoint)}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </TabsContent>
        <TabsContent value="out-of-stock" className="space-y-4">
          <InventoryTable
            items={filteredItems.filter((item) => item.stock === 0)}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </TabsContent>
        <TabsContent value="reorder" className="space-y-4">
          <InventoryTable
            items={filteredItems.filter((item) => item.stock <= item.reorderPoint)}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface InventoryTableProps {
  items: InventoryItem[]
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
}

function InventoryTable({ items, sortField, sortDirection, onSort }: InventoryTableProps) {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return sortDirection === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
  }

  const getStatusBadge = (stock: number, reorderPoint: number) => {
    const status = stock <= reorderPoint ? "low-stock" : "in-stock"
    switch (status) {
      case "in-stock":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>
      case "low-stock":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Low Stock</Badge>
      default:
        return null
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("sku")}>
              <div className="flex items-center">SKU {getSortIcon("sku")}</div>
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead>UOM</TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("stock")}>
              <div className="flex items-center">Stock {getSortIcon("stock")}</div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("cost")}>
              <div className="flex items-center">Cost {getSortIcon("cost")}</div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("lastRestocked")}>
              <div className="flex items-center">Last Updated {getSortIcon("lastRestocked")}</div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2">No inventory items found</p>
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.uom}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className={`${item.stock <= item.reorderPoint ? "text-amber-600 font-medium" : ""}`}>
                      {item.stock}
                    </span>
                    {item.stock <= item.reorderPoint && item.stock > 0 && (
                      <AlertTriangle className="ml-1 h-4 w-4 text-amber-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>AED {item.cost.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(item.stock, item.reorderPoint)}</TableCell>
                <TableCell>{new Date(item.updatedAt).toLocaleDateString()}</TableCell>
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
                      <DropdownMenuItem asChild>
                        <Link href={`/inventory/${item.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/inventory/${item.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Item
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/inventory/${item.id}/restock`}>
                          <Package className="mr-2 h-4 w-4" />
                          Restock
                        </Link>
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
