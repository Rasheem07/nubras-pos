"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Plus,
  MoreHorizontal,
  Building,
  ArrowLeft,
  Edit,
  Eye,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Package,
  TrendingUp,
  FileText,
  Loader2,
} from "lucide-react"

// Create a schema that matches the CreateSupplierDto
const supplierSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  location: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
})

type SupplierFormValues = z.infer<typeof supplierSchema>

interface Supplier {
  id: number
  name: string
  phone: string
  location?: string
  email?: string
  createdAt: string
  updatedAt: string
  restockCount: number
  totalQuantity: number
  totalAmount: number
}

export default function SuppliersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteSupplier, setDeleteSupplier] = useState<Supplier | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      phone: "",
      location: "",
      email: "",
    },
  })

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("http://localhost:5005/api/v1/suppliers", { credentials: "include"})
        if (!response.ok) {
          throw new Error("Failed to fetch suppliers")
        }
        const data = await response.json()
        setSuppliers(data)
      } catch (error) {
        console.error("Error fetching suppliers:", error)
        toast.error("Failed to load suppliers")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuppliers()
  }, [])

  const onSubmit = async (data: SupplierFormValues) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("http://localhost:5005/api/v1/suppliers", {
        method: "POST",
         credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create supplier")
      }

      const result = await response.json()
      toast.success(result.message || "Supplier created successfully!")

      // Refresh suppliers list
      const suppliersResponse = await fetch("http://localhost:5005/api/v1/suppliers", { credentials: "include" })
      if (suppliersResponse.ok) {
        const suppliersData = await suppliersResponse.json()
        setSuppliers(suppliersData)
      }

      // Close modal and reset form
      setIsCreateModalOpen(false)
      reset()
    } catch (error) {
      console.error("Error creating supplier:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create supplier")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSupplier = async () => {
    if (!deleteSupplier) return

    try {
      const response = await fetch(`http://localhost:5005/api/v1/suppliers/${deleteSupplier.id}`, {
        method: "DELETE",
         credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to delete supplier")
      }

      const data = await response.json()
      toast.success(data.message || "Supplier deleted successfully")

      // Remove the deleted supplier from the state
      setSuppliers(suppliers.filter((s) => s.id !== deleteSupplier.id))
    } catch (error) {
      console.error("Error deleting supplier:", error)
      toast.error("Failed to delete supplier")
    } finally {
      setDeleteSupplier(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.phone.includes(searchQuery) ||
      supplier.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.location?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate statistics
  const totalSuppliers = suppliers.length
  const totalRestocks = suppliers.reduce((sum, s) => sum + s.restockCount, 0)
  const totalValue = suppliers.reduce((sum, s) => sum + s.totalAmount, 0)
  const avgOrderValue = totalRestocks > 0 ? totalValue / totalRestocks : 0

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
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
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
                <DialogDescription>Create a new supplier for your inventory management.</DialogDescription>
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
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </div>
                    ) : (
                      "Create Supplier"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSuppliers}</div>
            <p className="text-xs text-muted-foreground">Active suppliers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Restocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRestocks}</div>
            <p className="text-xs text-muted-foreground">All time restocks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total purchase value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {avgOrderValue.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Per restock order</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search suppliers by name, phone, email, or location..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Restocks</TableHead>
              <TableHead>Total Quantity</TableHead>
              <TableHead>Total Value</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  <Building className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2">No suppliers found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{supplier.name}</div>
                        <div className="text-xs text-muted-foreground">ID: {supplier.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs space-y-1">
                      <div className="flex items-center">
                        <Phone className="mr-1 h-3 w-3 text-muted-foreground" />
                        <span>{supplier.phone}</span>
                      </div>
                      {supplier.email && (
                        <div className="flex items-center">
                          <Mail className="mr-1 h-3 w-3 text-muted-foreground" />
                          <span>{supplier.email}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {supplier.location ? (
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                        <span>{supplier.location}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Package className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{supplier.restockCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <TrendingUp className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{supplier.totalQuantity.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">AED {supplier.totalAmount.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{new Date(supplier.updatedAt).toLocaleDateString()}</span>
                  </TableCell>
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
                          <Link href={`/inventory/suppliers/${supplier.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/inventory/suppliers/${supplier.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Supplier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setDeleteSupplier(supplier)
                            setIsDeleteDialogOpen(true)
                          }}
                          className="text-destructive"
                        >
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the supplier and may affect inventory items
              associated with this supplier.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSupplier} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
