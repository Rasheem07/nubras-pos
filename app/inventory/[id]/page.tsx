"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  Printer,
  FileText,
  Building,
  Loader2,
} from "lucide-react"

interface Restock {
  id: number
  itemId: number
  qty: number
  cost: string
  total: string
  supplierId: number
  invNo?: string
  restockDate: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface InventoryItem {
  id: number
  name: string
  sku: string
  category: string
  uom: string
  description?: string
  cost: string
  stock: number
  minStock: number
  reorderPoint: number
  barcode?: string
  supplierId?: number
  weight?: string
  notes?: string
  createdAt: string
  updatedAt: string
  restocks: Restock[]
}

interface Supplier {
  id: number
  name: string
  phone: string
  location?: string
  email?: string
}

export default function InventoryItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [item, setItem] = useState<InventoryItem | null>(null)
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const itemId = params.id as string

  // Fetch inventory item details
  useEffect(() => {
    const fetchItemDetails = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`http://3.29.240.212/api/v1/inventory/${itemId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch item details")
        }
        const data = await response.json()
        setItem(data)

        // If item has a supplier, fetch supplier details
        if (data.supplierId) {
          const supplierResponse = await fetch(`http://3.29.240.212/api/v1/suppliers/${data.supplierId}`)
          if (supplierResponse.ok) {
            const supplierData = await supplierResponse.json()
            setSupplier(supplierData)
          }
        }
      } catch (error) {
        console.error("Error fetching item details:", error)
        toast.error("Failed to load item details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchItemDetails()
  }, [itemId])

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://3.29.240.212/api/v1/inventory/${itemId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete item")
      }

      const data = await response.json()
      toast.success(data.message || "Item deleted successfully")
      router.push("/inventory")
    } catch (error) {
      console.error("Error deleting item:", error)
      toast.error("Failed to delete item")
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  const getStockStatus = (stock: number, reorderPoint: number) => {
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
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-2">Item Not Found</h2>
        <p className="text-muted-foreground mb-4">The inventory item you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/inventory">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Inventory
          </Link>
        </Button>
      </div>
    )
  }

  // Calculate statistics
  const totalRestockQty = item.restocks.reduce((sum, restock) => sum + restock.qty, 0)
  const totalRestockValue = item.restocks.reduce((sum, restock) => sum + Number.parseFloat(restock.total), 0)
  const avgCostPrice = totalRestockQty > 0 ? totalRestockValue / totalRestockQty : Number.parseFloat(item.cost)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/inventory">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{item.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/inventory/${itemId}/restock`}>
              <Package className="mr-2 h-4 w-4" />
              Restock
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/inventory/${itemId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
              <CardDescription>Basic information about the inventory item</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">SKU</h3>
                    <p>{item.sku}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                    <p>{item.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Unit of Measure</h3>
                    <p>{item.uom}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Barcode</h3>
                    <p>{item.barcode || "Not set"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Supplier</h3>
                    {supplier ? (
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <Link href={`/inventory/suppliers/${supplier.id}`} className="text-blue-600 hover:underline">
                          {supplier.name}
                        </Link>
                      </div>
                    ) : (
                      <p>Not set</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Weight</h3>
                    <p>{item.weight || "Not set"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                    <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                    <p>{new Date(item.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {item.description && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                    <p>{item.description}</p>
                  </div>
                </>
              )}

              {item.notes && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                    <p>{item.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Restock History</CardTitle>
              <CardDescription>Complete record of all restocks for this item</CardDescription>
            </CardHeader>
            <CardContent>
              {item.restocks && item.restocks.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {item.restocks.map((restock) => (
                      <TableRow key={restock.id}>
                        <TableCell>{new Date(restock.restockDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <ArrowUpRight className="mr-1 h-4 w-4 text-green-600" />
                            {restock.qty} {item.uom}
                          </div>
                        </TableCell>
                        <TableCell>AED {Number.parseFloat(restock.cost).toFixed(2)}</TableCell>
                        <TableCell>AED {Number.parseFloat(restock.total).toFixed(2)}</TableCell>
                        <TableCell>{restock.invNo || "-"}</TableCell>
                        <TableCell>{restock.notes || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2">No restock history found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Stock Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Stock:</span>
                <div className="flex items-center">
                  <span className="font-medium text-lg">
                    {item.stock} {item.uom}
                  </span>
                  {item.stock <= item.minStock && item.stock > 0 && (
                    <AlertTriangle className="ml-2 h-4 w-4 text-amber-500" />
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Minimum Stock:</span>
                <span className="font-medium">
                  {item.minStock} {item.uom}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Reorder Point:</span>
                <span className="font-medium">
                  {item.reorderPoint} {item.uom}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <div>{getStockStatus(item.stock, item.reorderPoint)}</div>
              </div>
              <Separator />
              <Button className="w-full" asChild>
                <Link href={`/inventory/${itemId}/restock`}>
                  <Package className="mr-2 h-4 w-4" />
                  Restock Item
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Pricing & Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Cost:</span>
                <span className="font-medium">AED {Number.parseFloat(item.cost).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Average Cost:</span>
                <span className="font-medium">AED {avgCostPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Value:</span>
                <span className="font-medium">AED {(item.stock * Number.parseFloat(item.cost)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Restocks:</span>
                <span className="font-medium">{item.restocks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Restocked:</span>
                <span className="font-medium">
                  {totalRestockQty} {item.uom}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/inventory/${itemId}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Item
                </Link>
              </Button>
              {supplier && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/inventory/suppliers/${supplier.id}`}>
                    <Building className="mr-2 h-4 w-4" />
                    View Supplier
                  </Link>
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                Usage Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Restock
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Printer className="mr-2 h-4 w-4" />
                Print Details
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

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
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
