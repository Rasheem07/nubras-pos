"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
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
} from "lucide-react"

interface Supplier {
  id: number
  name: string
  phone: string
  location?: string
  email?: string
  createdAt: Date
  updatedAt: Date
  restockCount: number
  totalQuantity: number
  totalAmount: number
}

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    email: "",
  })

  // Mock data matching your backend structure
  const suppliers: Supplier[] = [
    {
      id: 1,
      name: "Dubai Textile Co.",
      phone: "+971 4 123 4567",
      location: "Dubai Textile Souk, Dubai",
      email: "orders@dubaitextile.ae",
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2024-04-20"),
      restockCount: 45,
      totalQuantity: 2850,
      totalAmount: 125000,
    },
    {
      id: 2,
      name: "Luxury Textiles LLC",
      phone: "+971 2 987 6543",
      location: "Abu Dhabi",
      email: "sales@luxurytextiles.ae",
      createdAt: new Date("2023-03-10"),
      updatedAt: new Date("2024-04-18"),
      restockCount: 28,
      totalQuantity: 1200,
      totalAmount: 89000,
    },
    {
      id: 3,
      name: "Al Noor Garments",
      phone: "+971 6 555 0123",
      location: "Sharjah",
      email: "info@alnoorgarments.ae",
      createdAt: new Date("2023-02-20"),
      updatedAt: new Date("2024-04-15"),
      restockCount: 32,
      totalQuantity: 1850,
      totalAmount: 95000,
    },
    {
      id: 4,
      name: "Fashion Accessories Trading",
      phone: "+971 4 777 8888",
      location: "Deira, Dubai",
      email: "wholesale@fashionacc.ae",
      createdAt: new Date("2023-05-12"),
      updatedAt: new Date("2024-04-10"),
      restockCount: 67,
      totalQuantity: 5200,
      totalAmount: 45000,
    },
  ]

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.phone.includes(searchQuery) ||
      supplier.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.location?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In real app, this would call your backend API
    console.log("Creating supplier:", formData)
    setIsCreateModalOpen(false)
    setFormData({ name: "", phone: "", location: "", email: "" })
  }

  const totalSuppliers = suppliers.length
  const totalRestocks = suppliers.reduce((sum, s) => sum + s.restockCount, 0)
  const totalValue = suppliers.reduce((sum, s) => sum + s.totalAmount, 0)
  const avgOrderValue = totalValue / totalRestocks

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
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">
                      Supplier Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter supplier name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      placeholder="+971 XX XXX XXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="supplier@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Textarea
                      id="location"
                      placeholder="Enter supplier address/location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Supplier</Button>
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
                    <span className="text-sm">{supplier.updatedAt.toLocaleDateString()}</span>
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
                          <Link href={`/inventory/suppliers/${supplier.id}?mode=edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Supplier
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
    </div>
  )
}
