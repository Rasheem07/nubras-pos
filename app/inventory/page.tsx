"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Types based on the provided DTOs and schema
interface InventoryItem {
  id: number
  name: string
  sku: string
  category: string
  uom: string
  description?: string
  cost: string // Using string as per DTO
  stock: number
  minStock: number
  reorderPoint: number
  barcode?: string
  supplierId?: number
  weight?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface Supplier {
  id: number
  name: string
  phone: string
  location?: string
  email?: string
}

type SortField = "name" | "sku" | "stock" | "cost" | "updatedAt"
type SortDirection = "asc" | "desc"

export default function InventoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedUom, setSelectedUom] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [uoms, setUoms] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Fetch inventory items from API
  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("http://localhost:5005/api/v1/inventory", {  credentials: "include" })
        if (!response.ok) {
          throw new Error("Failed to fetch inventory")
        }
        const data = await response.json()
        setInventoryItems(data)

        // Extract unique categories and UOMs
        const uniqueCategories = Array.from(new Set(data.map((item: InventoryItem) => item.category)))
        const uniqueUoms = Array.from(new Set(data.map((item: InventoryItem) => item.uom)))

        setCategories(uniqueCategories as string[])
        setUoms(uniqueUoms as string[])
      } catch (error) {
        console.error("Error fetching inventory:", error)
        toast.error("Failed to load inventory items")
      } finally {
        setIsLoading(false)
      }
    }

    fetchInventory()
  }, [])

  // Handle item deletion
  const handleDeleteItem = async () => {
    if (!deleteItemId) return

    try {
      const response = await fetch(`http://localhost:5005/api/v1/inventory/${deleteItemId}`, {
        method: "DELETE",
         credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to delete item")
      }

      const data = await response.json()
      toast.success(data.message || "Item deleted successfully")

      // Remove the deleted item from the state
      setInventoryItems(inventoryItems.filter((item) => item.id !== deleteItemId))
    } catch (error) {
      console.error("Error deleting item:", error)
      toast.error("Failed to delete item")
    } finally {
      setDeleteItemId(null)
      setIsDeleteDialogOpen(false)
    }
  }

  // Filter and sort inventory items
  const filteredItems = inventoryItems
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((item) => !selectedCategory || item.category === selectedCategory)
    .filter((item) => !selectedUom || item.uom === selectedUom)
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
        comparison = Number.parseFloat(a.cost) - Number.parseFloat(b.cost)
      } else if (sortField === "updatedAt") {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
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

  // Calculate inventory statistics
  const totalItems = inventoryItems.length
  const lowStockItems = inventoryItems.filter((item) => item.stock <= item.reorderPoint).length
  const outOfStockItems = inventoryItems.filter((item) => item.stock === 0).length
  const totalValue = inventoryItems.reduce((total, item) => total + Number.parseFloat(item.cost) * item.stock, 0)

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
            placeholder="Search by name or SKU..."
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
            value={selectedUom || "all"}
            onValueChange={(value) => setSelectedUom(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All UOMs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All UOMs</SelectItem>
              {uoms.map((uom) => (
                <SelectItem key={uom} value={uom}>
                  {uom}
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
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
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
            onDelete={(id) => {
              setDeleteItemId(id)
              setIsDeleteDialogOpen(true)
            }}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="low-stock" className="space-y-4">
          <InventoryTable
            items={filteredItems.filter((item) => item.stock <= item.reorderPoint && item.stock > 0)}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onDelete={(id) => {
              setDeleteItemId(id)
              setIsDeleteDialogOpen(true)
            }}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="out-of-stock" className="space-y-4">
          <InventoryTable
            items={filteredItems.filter((item) => item.stock === 0)}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onDelete={(id) => {
              setDeleteItemId(id)
              setIsDeleteDialogOpen(true)
            }}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="reorder" className="space-y-4">
          <InventoryTable
            items={filteredItems.filter((item) => item.stock <= item.reorderPoint)}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onDelete={(id) => {
              setDeleteItemId(id)
              setIsDeleteDialogOpen(true)
            }}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the inventory item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

interface InventoryTableProps {
  items: InventoryItem[]
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
  onDelete: (id: number) => void
  isLoading: boolean
}

function InventoryTable({ items, sortField, sortDirection, onSort, onDelete, isLoading }: InventoryTableProps) {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return sortDirection === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
  }

  const getStatusBadge = (stock: number, reorderPoint: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    } else if (stock <= reorderPoint) {
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Low Stock</Badge>
    } else {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => onSort("name")}>
              <div className="flex items-center">Item {getSortIcon("name")}</div>
            </TableHead>
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
            <TableHead className="cursor-pointer" onClick={() => onSort("updatedAt")}>
              <div className="flex items-center">Last Updated {getSortIcon("updatedAt")}</div>
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
                      <div className="text-xs text-muted-foreground">ID: {item.id}</div>
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
                <TableCell>AED {Number.parseFloat(item.cost).toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(item.stock, item.reorderPoint)}</TableCell>
                <TableCell>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : " --- "}</TableCell>
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
                      <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-destructive">
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
