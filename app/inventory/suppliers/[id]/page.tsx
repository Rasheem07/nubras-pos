"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
import { EditSupplierModal } from "@/components/edit-supplier-modal"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Package,
  TrendingUp,
  FileText,
  ArrowUpRight,
} from "lucide-react"

export default function SupplierDetailPage() {
  const params = useParams()
  const supplierId = params.id as string
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Mock data matching your backend structure
  const [supplier, setSupplier] = useState({
    id: Number(supplierId),
    name: "Dubai Textile Co.",
    phone: "+971 4 123 4567",
    location: "Dubai Textile Souk, Dubai",
    email: "orders@dubaitextile.ae",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-04-20"),
    restocks: [
      {
        id: 1,
        itemId: 1,
        qty: 50,
        cost: 30.0,
        total: 1500.0,
        supplierId: 1,
        invNo: "INV-2024-001",
        restockDate: new Date("2024-04-20"),
        notes: "Regular monthly restock",
        createdAt: new Date("2024-04-20"),
        updatedAt: new Date("2024-04-20"),
        // Additional fields for display
        itemName: "White Linen Fabric",
        itemSku: "FAB-LIN-WHT-001",
      },
      {
        id: 2,
        itemId: 2,
        qty: 75,
        cost: 25.0,
        total: 1875.0,
        supplierId: 1,
        invNo: "INV-2024-002",
        restockDate: new Date("2024-04-15"),
        notes: "Bulk order discount applied",
        createdAt: new Date("2024-04-15"),
        updatedAt: new Date("2024-04-15"),
        itemName: "Black Cotton Fabric",
        itemSku: "FAB-COT-BLK-001",
      },
      {
        id: 3,
        itemId: 3,
        qty: 25,
        cost: 70.0,
        total: 1750.0,
        supplierId: 1,
        invNo: "INV-2024-003",
        restockDate: new Date("2024-04-10"),
        notes: "Premium quality silk",
        createdAt: new Date("2024-04-10"),
        updatedAt: new Date("2024-04-10"),
        itemName: "Premium Silk Fabric",
        itemSku: "FAB-SLK-PRM-001",
      },
    ],
  })

  const handleDelete = () => {
    // In real app, this would call your backend API
    console.log(`Deleting supplier ${supplier.name}`)
    setIsDeleteDialogOpen(false)
  }

  const handleSupplierUpdated = (updatedSupplier: any) => {
    setSupplier(updatedSupplier)
    console.log("Supplier updated:", updatedSupplier)
  }

  // Calculate statistics
  const totalRestocks = supplier.restocks.length
  const totalQuantity = supplier.restocks.reduce((sum, r) => sum + r.qty, 0)
  const totalValue = supplier.restocks.reduce((sum, r) => sum + r.total, 0)
  const avgOrderValue = totalValue / totalRestocks

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/inventory/suppliers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{supplier.name}</h1>
        </div>
        <div className="flex gap-2">
          <EditSupplierModal
            supplier={supplier}
            onSupplierUpdated={handleSupplierUpdated}
            trigger={
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            }
          />
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Supplier</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this supplier? This action cannot be undone and will affect all
                  related inventory records.
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
              <CardTitle>Supplier Information</CardTitle>
              <CardDescription>Basic details and contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Supplier ID</h3>
                    <p>{supplier.id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Phone Number</h3>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p>{supplier.phone}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Email Address</h3>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p>{supplier.email}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p>{supplier.location}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p>{supplier.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p>{supplier.updatedAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="restocks" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="restocks">Restock History</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="restocks" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Restock History</CardTitle>
                  <CardDescription>All restocks from this supplier</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supplier.restocks.map((restock) => (
                        <TableRow key={restock.id}>
                          <TableCell>{restock.restockDate.toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{restock.itemName}</div>
                              <div className="text-xs text-muted-foreground">{restock.itemSku}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {restock.invNo ? (
                              <Badge variant="outline">{restock.invNo}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <ArrowUpRight className="mr-1 h-3 w-3 text-green-600" />
                              {restock.qty}
                            </div>
                          </TableCell>
                          <TableCell>AED {restock.cost.toFixed(2)}</TableCell>
                          <TableCell className="font-medium">AED {restock.total.toFixed(2)}</TableCell>
                          <TableCell>
                            {restock.notes ? (
                              <span className="text-sm">{restock.notes}</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Monthly Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12%</div>
                    <p className="text-xs text-muted-foreground">vs last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Top Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Fabrics</div>
                    <p className="text-xs text-muted-foreground">85% of orders</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Restocks:</span>
                <div className="flex items-center">
                  <Package className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{totalRestocks}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Quantity:</span>
                <div className="flex items-center">
                  <TrendingUp className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{totalQuantity.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Value:</span>
                <span className="font-medium">AED {totalValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg Order Value:</span>
                <span className="font-medium">AED {avgOrderValue.toFixed(0)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <EditSupplierModal
                supplier={supplier}
                onSupplierUpdated={handleSupplierUpdated}
                trigger={
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Supplier
                  </Button>
                }
              />
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Export History
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Create Restock
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
