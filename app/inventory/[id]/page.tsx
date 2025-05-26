"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
} from "lucide-react"

export default function InventoryItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // In a real app, this would fetch the item from the database using the ID
  const itemId = params.id as string

  // Mock data matching your service structure
  const item = {
    id: Number(itemId),
    name: "White Linen Fabric",
    sku: "FAB-LIN-WHT-001",
    category: "Fabrics",
    uom: "meter",
    description:
      "High-quality white linen fabric, perfect for premium kanduras and other garments. Sourced from the finest mills in Europe.",
    cost: 30.0,
    stock: 150,
    minStock: 50,
    reorderPoint: 75,
    barcode: "5901234123457",
    supplierId: 1,
    weight: "200g per meter",
    notes: "Popular during summer months. Consider increasing minimum stock level during peak season.",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-04-15"),

    // Nested restocks from your service
    restocks: [
      {
        id: 1,
        itemId: Number(itemId),
        qty: 50,
        cost: 30.0,
        total: 1500.0,
        supplierId: 1,
        invNo: "INV-2024-001",
        restockDate: new Date("2024-04-15"),
        notes: "Regular monthly restock",
        createdAt: new Date("2024-04-15"),
        updatedAt: new Date("2024-04-15"),
      },
      {
        id: 2,
        itemId: Number(itemId),
        qty: 100,
        cost: 28.0,
        total: 2800.0,
        supplierId: 1,
        invNo: "INV-2024-002",
        restockDate: new Date("2024-03-20"),
        notes: "Initial stock",
        createdAt: new Date("2024-03-20"),
        updatedAt: new Date("2024-03-20"),
      },
    ],
  }

  // Mock supplier data
  const supplier = {
    id: 1,
    name: "Dubai Textile Co.",
    phone: "+971501234567",
    location: "Dubai Textile Souk, Bur Dubai",
    email: "orders@dubaitextile.ae",
  }

  const handleDelete = () => {
    // In a real app, this would delete the item from the database
    console.log(`Deleting ${item.name}`)
    setIsDeleteDialogOpen(false)
    router.push("/inventory")
  }

  const getStockStatus = () => {
    if (item.stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    } else if (item.stock <= item.minStock) {
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Low Stock</Badge>
    } else if (item.stock <= item.reorderPoint) {
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Reorder Point</Badge>
    } else {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>
    }
  }

  const totalRestockValue = item.restocks.reduce((sum, restock) => sum + restock.total, 0)
  const totalRestockQty = item.restocks.reduce((sum, restock) => sum + restock.qty, 0)
  const avgCostPrice = totalRestockQty > 0 ? totalRestockValue / totalRestockQty : item.cost

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
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Inventory Item</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this inventory item? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <Link href={`/inventory/suppliers/${supplier.id}`} className="text-blue-600 hover:underline">
                        {supplier.name}
                      </Link>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Weight</h3>
                    <p>{item.weight || "Not set"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                    <p>{item.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                    <p>{item.updatedAt.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p>{item.description || "No description provided."}</p>
              </div>

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
                      <TableCell>{restock.restockDate.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <ArrowUpRight className="mr-1 h-4 w-4 text-green-600" />
                          {restock.qty} {item.uom}
                        </div>
                      </TableCell>
                      <TableCell>AED {restock.cost.toFixed(2)}</TableCell>
                      <TableCell>AED {restock.total.toFixed(2)}</TableCell>
                      <TableCell>{restock.invNo || "-"}</TableCell>
                      <TableCell>{restock.notes || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                <div>{getStockStatus()}</div>
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
                <span className="font-medium">AED {item.cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Average Cost:</span>
                <span className="font-medium">AED {avgCostPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Value:</span>
                <span className="font-medium">AED {(item.stock * avgCostPrice).toFixed(2)}</span>
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
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/inventory/suppliers/${supplier.id}`}>
                  <Building className="mr-2 h-4 w-4" />
                  View Supplier
                </Link>
              </Button>
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
    </div>
  )
}
