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
} from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  type: "fabric" | "ready-made" | "accessory" | "packaging"
  inStock: number
  minStock: number
  costPrice: number
  sellingPrice: number
  supplier: string
  location: string
  lastRestocked: string
  status: "in-stock" | "low-stock" | "out-of-stock"
  image?: string
}

type SortField = "name" | "sku" | "inStock" | "costPrice" | "sellingPrice" | "lastRestocked"
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
      id: "INV-001",
      name: "White Linen Fabric",
      sku: "FAB-LIN-WHT-001",
      category: "Fabrics",
      type: "fabric",
      inStock: 150,
      minStock: 50,
      costPrice: 30,
      sellingPrice: 60,
      supplier: "Dubai Textile Co.",
      location: "Shelf A1",
      lastRestocked: "2024-04-15",
      status: "in-stock",
      image: "/placeholder.svg?key=6k1n3",
    },
    {
      id: "INV-002",
      name: "Black Cotton Fabric",
      sku: "FAB-COT-BLK-001",
      category: "Fabrics",
      type: "fabric",
      inStock: 120,
      minStock: 40,
      costPrice: 25,
      sellingPrice: 45,
      supplier: "Dubai Textile Co.",
      location: "Shelf A2",
      lastRestocked: "2024-04-10",
      status: "in-stock",
      image: "/placeholder.svg?key=xezuv",
    },
    {
      id: "INV-003",
      name: "Premium Silk Fabric",
      sku: "FAB-SLK-PRM-001",
      category: "Fabrics",
      type: "fabric",
      inStock: 30,
      minStock: 20,
      costPrice: 70,
      sellingPrice: 120,
      supplier: "Luxury Textiles LLC",
      location: "Shelf A3",
      lastRestocked: "2024-04-05",
      status: "in-stock",
      image: "/placeholder.svg?key=8toom",
    },
    {
      id: "INV-004",
      name: "Kandura (Premium)",
      sku: "KAN-PREM-001",
      category: "Ready-made",
      type: "ready-made",
      inStock: 25,
      minStock: 10,
      costPrice: 250,
      sellingPrice: 450,
      supplier: "Al Noor Garments",
      location: "Section B1",
      lastRestocked: "2024-04-20",
      status: "in-stock",
      image: "/placeholder.svg?key=ng1v2",
    },
    {
      id: "INV-005",
      name: "Kandura (Standard)",
      sku: "KAN-STD-001",
      category: "Ready-made",
      type: "ready-made",
      inStock: 8,
      minStock: 15,
      costPrice: 180,
      sellingPrice: 350,
      supplier: "Al Noor Garments",
      location: "Section B2",
      lastRestocked: "2024-04-20",
      status: "low-stock",
      image: "/placeholder.svg?key=ng1v2",
    },
    {
      id: "INV-006",
      name: "Abaya (Premium)",
      sku: "ABA-PREM-001",
      category: "Ready-made",
      type: "ready-made",
      inStock: 18,
      minStock: 8,
      costPrice: 300,
      sellingPrice: 550,
      supplier: "Elegant Abayas LLC",
      location: "Section B3",
      lastRestocked: "2024-04-15",
      status: "in-stock",
      image: "/placeholder.svg?key=zgibz",
    },
    {
      id: "INV-007",
      name: "Abaya (Standard)",
      sku: "ABA-STD-001",
      category: "Ready-made",
      type: "ready-made",
      inStock: 0,
      minStock: 12,
      costPrice: 180,
      sellingPrice: 350,
      supplier: "Elegant Abayas LLC",
      location: "Section B4",
      lastRestocked: "2024-03-15",
      status: "out-of-stock",
      image: "/placeholder.svg?key=zgibz",
    },
    {
      id: "INV-008",
      name: "Buttons (Gold)",
      sku: "ACC-BTN-GLD-001",
      category: "Accessories",
      type: "accessory",
      inStock: 500,
      minStock: 200,
      costPrice: 0.5,
      sellingPrice: 2,
      supplier: "Fashion Accessories Trading",
      location: "Drawer C1",
      lastRestocked: "2024-04-01",
      status: "in-stock",
      image: "/placeholder.svg?key=bnvr4",
    },
    {
      id: "INV-009",
      name: "Zippers (Black)",
      sku: "ACC-ZIP-BLK-001",
      category: "Accessories",
      type: "accessory",
      inStock: 150,
      minStock: 100,
      costPrice: 1,
      sellingPrice: 3,
      supplier: "Fashion Accessories Trading",
      location: "Drawer C2",
      lastRestocked: "2024-04-01",
      status: "in-stock",
      image: "/placeholder.svg?key=zp9r2",
    },
    {
      id: "INV-010",
      name: "Premium Gift Box",
      sku: "PKG-BOX-PRM-001",
      category: "Packaging",
      type: "packaging",
      inStock: 5,
      minStock: 20,
      costPrice: 10,
      sellingPrice: 0,
      supplier: "Packaging Solutions",
      location: "Storage D1",
      lastRestocked: "2024-03-10",
      status: "low-stock",
      image: "/placeholder.svg?key=bx7r9",
    },
  ]

  // Get unique categories, types, and statuses for filters
  const categories = Array.from(new Set(inventoryItems.map((item) => item.category)))
  const types = Array.from(new Set(inventoryItems.map((item) => item.type)))
  const statuses = Array.from(new Set(inventoryItems.map((item) => item.status)))

  // Filter and sort inventory items
  const filteredItems = inventoryItems
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((item) => !selectedCategory || item.category === selectedCategory)
    .filter((item) => !selectedType || item.type === selectedType)
    .filter((item) => !selectedStatus || item.status === selectedStatus)
    .sort((a, b) => {
      let comparison = 0

      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortField === "sku") {
        comparison = a.sku.localeCompare(b.sku)
      } else if (sortField === "inStock") {
        comparison = a.inStock - b.inStock
      } else if (sortField === "costPrice") {
        comparison = a.costPrice - b.costPrice
      } else if (sortField === "sellingPrice") {
        comparison = a.sellingPrice - b.sellingPrice
      } else if (sortField === "lastRestocked") {
        comparison = new Date(a.lastRestocked).getTime() - new Date(b.lastRestocked).getTime()
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
  const getStatusBadge = (status: InventoryItem["status"]) => {
    switch (status) {
      case "in-stock":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>
      case "low-stock":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Low Stock</Badge>
      case "out-of-stock":
        return <Badge variant="destructive">Out of Stock</Badge>
      default:
        return null
    }
  }

  // Calculate inventory statistics
  const totalItems = inventoryItems.length
  const lowStockItems = inventoryItems.filter((item) => item.status === "low-stock").length
  const outOfStockItems = inventoryItems.filter((item) => item.status === "out-of-stock").length
  const totalValue = inventoryItems.reduce((total, item) => total + item.costPrice * item.inStock, 0)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        <div className="flex gap-2">
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
                  {type.charAt(0).toUpperCase() + type.slice(1)}
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
                  {status === "in-stock" ? "In Stock" : status === "low-stock" ? "Low Stock" : "Out of Stock"}
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
            items={filteredItems.filter((item) => item.status === "low-stock")}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </TabsContent>
        <TabsContent value="out-of-stock" className="space-y-4">
          <InventoryTable
            items={filteredItems.filter((item) => item.status === "out-of-stock")}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </TabsContent>
        <TabsContent value="reorder" className="space-y-4">
          <InventoryTable
            items={filteredItems.filter((item) => item.inStock <= item.minStock)}
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

  const getStatusBadge = (status: InventoryItem["status"]) => {
    switch (status) {
      case "in-stock":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>
      case "low-stock":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Low Stock</Badge>
      case "out-of-stock":
        return <Badge variant="destructive">Out of Stock</Badge>
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
            <TableHead className="cursor-pointer" onClick={() => onSort("inStock")}>
              <div className="flex items-center">Stock {getSortIcon("inStock")}</div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("costPrice")}>
              <div className="flex items-center">Cost {getSortIcon("costPrice")}</div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("sellingPrice")}>
              <div className="flex items-center">Price {getSortIcon("sellingPrice")}</div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("lastRestocked")}>
              <div className="flex items-center">Last Restocked {getSortIcon("lastRestocked")}</div>
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
                    <div className="h-10 w-10 rounded-md overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className={`${item.inStock <= item.minStock ? "text-amber-600 font-medium" : ""}`}>
                      {item.inStock}
                    </span>
                    {item.inStock <= item.minStock && item.inStock > 0 && (
                      <AlertTriangle className="ml-1 h-4 w-4 text-amber-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>AED {item.costPrice.toFixed(2)}</TableCell>
                <TableCell>AED {item.sellingPrice.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell>{new Date(item.lastRestocked).toLocaleDateString()}</TableCell>
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
