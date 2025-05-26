"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  History,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Printer,
  FileText,
} from "lucide-react"

export default function InventoryItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false)
  const [restockQuantity, setRestockQuantity] = useState(0)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // In a real app, this would fetch the item from the database using the ID
  const itemId = params.id as string

  // Mock data for the inventory item
  const item = {
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

  // Mock data for stock history
  const stockHistory = [
    {
      id: "SH-001",
      date: "2024-04-15",
      type: "restock",
      quantity: 50,
      user: "Mohammed Ali",
      notes: "Regular monthly restock",
    },
    {
      id: "SH-002",
      date: "2024-04-10",
      type: "sale",
      quantity: -10,
      user: "Aisha Mahmood",
      notes: "Bulk order for Al Noor Garments",
    },
    {
      id: "SH-003",
      date: "2024-04-05",
      type: "adjustment",
      quantity: -5,
      user: "Khalid Rahman",
      notes: "Inventory count adjustment",
    },
    { id: "SH-004", date: "2024-03-20", type: "restock", quantity: 100, user: "Mohammed Ali", notes: "Initial stock" },
  ]

  // Mock data for price history
  const priceHistory = [
    {
      id: "PH-001",
      date: "2024-04-01",
      costPrice: 30,
      sellingPrice: 60,
      user: "Mohammed Ali",
      notes: "Price increase due to supplier changes",
    },
    {
      id: "PH-002",
      date: "2024-01-15",
      costPrice: 28,
      sellingPrice: 55,
      user: "Mohammed Ali",
      notes: "Initial pricing",
    },
  ]

  const handleRestock = () => {
    // In a real app, this would update the database
    console.log(`Restocking ${restockQuantity} units of ${item.name}`)
    setIsRestockDialogOpen(false)
    // Refresh the page or update the state
  }

  const handleDelete = () => {
    // In a real app, this would delete the item from the database
    console.log(`Deleting ${item.name}`)
    setIsDeleteDialogOpen(false)
    router.push("/inventory")
  }

  const getStatusBadge = (status: string) => {
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
                    <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                    <p>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Barcode</h3>
                    <p>{item.barcode || "Not set"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Supplier</h3>
                    <p>{item.supplier}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Storage Location</h3>
                    <p>{item.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Weight</h3>
                    <p>{item.weight || "Not set"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Dimensions</h3>
                    <p>{item.dimensions || "Not set"}</p>
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

          <Tabs defaultValue="stock-history" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="stock-history">Stock History</TabsTrigger>
              <TabsTrigger value="price-history">Price History</TabsTrigger>
            </TabsList>
            <TabsContent value="stock-history" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Stock History</CardTitle>
                  <CardDescription>Record of stock changes over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stockHistory.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {record.type === "restock" ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Restock</Badge>
                              ) : record.type === "sale" ? (
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Sale</Badge>
                              ) : (
                                <Badge variant="outline">Adjustment</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {record.quantity > 0 ? (
                                <ArrowUpRight className="mr-1 h-4 w-4 text-green-600" />
                              ) : (
                                <ArrowDownRight className="mr-1 h-4 w-4 text-red-600" />
                              )}
                              {Math.abs(record.quantity)}
                            </div>
                          </TableCell>
                          <TableCell>{record.user}</TableCell>
                          <TableCell>{record.notes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="price-history" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Price History</CardTitle>
                  <CardDescription>Record of price changes over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Cost Price</TableHead>
                        <TableHead>Selling Price</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {priceHistory.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>AED {record.costPrice.toFixed(2)}</TableCell>
                          <TableCell>AED {record.sellingPrice.toFixed(2)}</TableCell>
                          <TableCell>{record.user}</TableCell>
                          <TableCell>{record.notes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Item Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md overflow-hidden">
                <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-auto object-cover" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Stock Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Stock:</span>
                <div className="flex items-center">
                  <span className="font-medium text-lg">{item.inStock}</span>
                  {item.inStock <= item.minStock && item.inStock > 0 && (
                    <AlertTriangle className="ml-2 h-4 w-4 text-amber-500" />
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Minimum Stock:</span>
                <span className="font-medium">{item.minStock}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <div>{getStatusBadge(item.status)}</div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last Restocked:</span>
                <span className="font-medium">{item.lastRestocked}</span>
              </div>
              <Separator />
              <Dialog open={isRestockDialogOpen} onOpenChange={setIsRestockDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Package className="mr-2 h-4 w-4" />
                    Restock
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Restock Item</DialogTitle>
                    <DialogDescription>Enter the quantity you want to add to the current stock.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="quantity" className="text-right">
                        Quantity
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={restockQuantity}
                        onChange={(e) => setRestockQuantity(Number.parseInt(e.target.value) || 0)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsRestockDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleRestock}>Restock</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cost Price:</span>
                <span className="font-medium">AED {item.costPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Selling Price:</span>
                <span className="font-medium">AED {item.sellingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Profit Margin:</span>
                <span className="font-medium">
                  {(((item.sellingPrice - item.costPrice) / item.sellingPrice) * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Value:</span>
                <span className="font-medium">AED {(item.inStock * item.costPrice).toFixed(2)}</span>
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
              <Button variant="outline" className="w-full justify-start">
                <History className="mr-2 h-4 w-4" />
                View All History
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                Sales Analytics
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
