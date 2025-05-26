"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Package, Calendar, Plus } from "lucide-react"
import { SupplierCreateModal } from "@/components/supplier-create-modal"

export default function RestockInventoryItemPage() {
  const params = useParams()
  const router = useRouter()

  // In a real app, this would fetch the item from the database using the ID
  const itemId = params.id as string

  // Mock data for the inventory item
  const item = {
    id: itemId,
    name: "White Linen Fabric",
    sku: "FAB-LIN-WHT-001",
    category: "Fabrics",
    uom: "meter",
    stock: 150,
    minStock: 50,
    cost: 30,
    supplierId: 1,
    location: "Shelf A1",
    image: "/placeholder.svg?key=6k1n3",
  }

  const [quantity, setQuantity] = useState(50)
  const [cost, setCost] = useState(item.cost)
  const [supplierId, setSupplierId] = useState<number | null>(item.supplierId)
  const [notes, setNotes] = useState("")
  const [invNo, setInvNo] = useState("")
  const [restockDate, setRestockDate] = useState(new Date().toISOString().split("T")[0])

  // Mock suppliers data - in real app, this would come from your backend
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: "Dubai Textile Co.", phone: "+971501234567" },
    { id: 2, name: "Luxury Textiles LLC", phone: "+971507654321" },
    { id: 3, name: "Al Noor Garments", phone: "+971509876543" },
    { id: 4, name: "Elegant Abayas LLC", phone: "+971502345678" },
    { id: 5, name: "Fashion Accessories Trading", phone: "+971508765432" },
    { id: 6, name: "Packaging Solutions", phone: "+971503456789" },
  ])

  const handleSupplierCreated = (newSupplier: any) => {
    // Add the new supplier to the list
    setSuppliers((prev) => [...prev, newSupplier])
    // Auto-select the new supplier
    setSupplierId(newSupplier.id)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!supplierId) {
      alert("Please select a supplier")
      return
    }

    // Calculate total based on your service structure
    const total = quantity * cost

    // This matches your CreateRestockDto structure
    const restockData = {
      itemId: Number(itemId),
      qty: quantity,
      cost: cost,
      total: total,
      supplierId: supplierId,
      invNo: invNo || null,
      restockDate: new Date(restockDate),
      notes: notes || null,
    }

    console.log("Restock submitted:", restockData)

    // Navigate back to inventory item detail
    router.push(`/inventory/${itemId}`)
  }

  const selectedSupplier = suppliers.find((s) => s.id === supplierId)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/inventory/${itemId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Restock {item.name}</h1>
        </div>
        <Button onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" />
          Save Restock
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Restock Details</CardTitle>
              <CardDescription>Enter the details for this restock</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">
                    Quantity ({item.uom}) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="0"
                    value={quantity}
                    onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 0)}
                    required
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">
                    Cost Price (AED) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cost"
                    type="number"
                    placeholder="0.00"
                    value={cost}
                    onChange={(e) => setCost(Number.parseFloat(e.target.value) || 0)}
                    required
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">
                    Supplier <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Select value={supplierId?.toString()} onValueChange={(value) => setSupplierId(Number(value))}>
                      <SelectTrigger id="supplier">
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id.toString()}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <SupplierCreateModal
                      trigger={
                        <Button variant="outline" size="icon">
                          <Plus className="h-4 w-4" />
                        </Button>
                      }
                      onSupplierCreated={handleSupplierCreated}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invNo">Invoice Number</Label>
                  <Input
                    id="invNo"
                    placeholder="Enter invoice number"
                    value={invNo}
                    onChange={(e) => setInvNo(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restockDate">
                    Restock Date <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex">
                    <Calendar className="mr-2 h-4 w-4 mt-3 text-muted-foreground" />
                    <Input
                      id="restockDate"
                      type="date"
                      value={restockDate}
                      onChange={(e) => setRestockDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any notes about this restock"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Item Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-16 w-16 rounded-md overflow-hidden">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.sku}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Stock:</span>
                  <span className="font-medium">
                    {item.stock} {item.uom}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Minimum Stock:</span>
                  <span className="font-medium">
                    {item.minStock} {item.uom}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Cost:</span>
                  <span className="font-medium">AED {item.cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{item.category}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Restock Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity to Add:</span>
                  <span className="font-medium">
                    {quantity} {item.uom}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">New Stock Level:</span>
                  <span className="font-medium">
                    {item.stock + quantity} {item.uom}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Selected Supplier:</span>
                  <span className="font-medium">{selectedSupplier?.name || "None"}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cost per Unit:</span>
                  <span className="font-medium">AED {cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Cost:</span>
                  <span className="font-medium">AED {(quantity * cost).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSubmit}>
                <Package className="mr-2 h-4 w-4" />
                Complete Restock
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
