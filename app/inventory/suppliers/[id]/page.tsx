"use client"

import { AlertDialogTrigger } from "@/components/ui/alert-dialog"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Phone,
  Mail,
  MapPin,
  Calendar,
  Package,
  TrendingUp,
  FileText,
  ArrowUpRight,
  Loader2,
} from "lucide-react"

// Create a schema that matches the UpdateSupplierDto
const supplierSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  location: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
})

type SupplierFormValues = z.infer<typeof supplierSchema>

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

interface Supplier {
  id: number
  name: string
  phone: string
  location?: string
  email?: string
  createdAt: string
  updatedAt: string
  restocks: Restock[]
}

export default function SupplierDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supplierId = Number(params.id)

  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
  })

  // Fetch supplier details
  useEffect(() => {
    const fetchSupplier = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`https://api.alnubras.co/api/v1/suppliers/${supplierId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch supplier details")
        }
        const data = await response.json()
        setSupplier(data)

        // Set form default values
        reset({
          name: data.name,
          phone: data.phone,
          location: data.location || "",
          email: data.email || "",
        })
      } catch (error) {
        console.error("Error fetching supplier:", error)
        toast.error("Failed to load supplier details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSupplier()
  }, [supplierId, reset])

  const onSubmit = async (data: SupplierFormValues) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`https://api.alnubras.co/api/v1/suppliers/${supplierId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update supplier")
      }

      const result = await response.json()
      toast.success(result.message || "Supplier updated successfully!")

      // Update local state
      if (supplier) {
        setSupplier({
          ...supplier,
          ...data,
          updatedAt: new Date().toISOString(),
        })
      }

      setIsEditModalOpen(false)
    } catch (error) {
      console.error("Error updating supplier:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update supplier")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`https://api.alnubras.co/api/v1/suppliers/${supplierId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete supplier")
      }

      const data = await response.json()
      toast.success(data.message || "Supplier deleted successfully")
      router.push("/inventory/suppliers")
    } catch (error) {
      console.error("Error deleting supplier:", error)
      toast.error("Failed to delete supplier")
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!supplier) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-2">Supplier Not Found</h2>
        <p className="text-muted-foreground mb-4">The supplier you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/inventory/suppliers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Suppliers
          </Link>
        </Button>
      </div>
    )
  }

  // Calculate statistics
  const totalRestocks = supplier.restocks.length
  const totalQuantity = supplier.restocks.reduce((sum, r) => sum + r.qty, 0)
  const totalValue = supplier.restocks.reduce((sum, r) => sum + Number.parseFloat(r.total), 0)
  const avgOrderValue = totalRestocks > 0 ? totalValue / totalRestocks : 0

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
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Supplier</DialogTitle>
                <DialogDescription>Update the supplier information.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">
                      Supplier Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter supplier name"
                      {...register("name")}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      placeholder="+971 XX XXX XXXX"
                      {...register("phone")}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="supplier@example.com"
                      {...register("email")}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Textarea
                      id="location"
                      placeholder="Enter supplier address/location"
                      {...register("location")}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </div>
                    ) : (
                      "Update Supplier"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this supplier? This action cannot be undone and will affect all
                  related inventory records.
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
                      <p>{supplier.email || "Not provided"}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p>{supplier.location || "Not provided"}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p>{new Date(supplier.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p>{new Date(supplier.updatedAt).toLocaleDateString()}</p>
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
                  {supplier.restocks && supplier.restocks.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Item ID</TableHead>
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
                            <TableCell>{new Date(restock.restockDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Link
                                href={`/inventory/${restock.itemId}`}
                                className="text-blue-600 hover:underline font-medium"
                              >
                                #{restock.itemId}
                              </Link>
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
                            <TableCell>AED {Number.parseFloat(restock.cost).toFixed(2)}</TableCell>
                            <TableCell className="font-medium">
                              AED {Number.parseFloat(restock.total).toFixed(2)}
                            </TableCell>
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
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-2">No restock history found</p>
                    </div>
                  )}
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
              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Supplier
                  </Button>
                </DialogTrigger>
              </Dialog>
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
