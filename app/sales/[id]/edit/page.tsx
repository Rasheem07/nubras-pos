"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, X, Plus, Trash2, Search, ShoppingCart, Ruler } from "lucide-react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

// Types matching your DTOs exactly
type CustomItemMeasurement = {
  frontLength: string
  backLength: string
  shoulder: string
  sleeves: string
  neck: string
  waist: string
  chest: string
  widthEnd: string
  notes?: string
}

type SalesOrderItem = {
  id?: number
  type: "ready-made" | "custom"
  description: string
  catelogId: number
  sku?: string
  qty: number
  price: string
  modelPrice?: string
  total: string
  modelName?: string
  measurement?: CustomItemMeasurement
  isNew?: boolean
}

type UpdateSalesOrderDto = {
  status: string
  customerId: number
  customerName: string
  salesPersonId: number
  salesPersonName: string
  subtotal: string
  taxAmount: string
  discountAmount: string
  totalAmount: string
  paymentMethod: string
  paymentStatus: "no-payment" | "partial" | "paid"
  notes?: string
  priority: "low" | "medium" | "high"
  paymentTerms: string
  dueDate: Date
  deliveryDate?: Date
  completedDate?: Date
  items: SalesOrderItem[]
  partialAmount: string
}

type Product = {
  id: number
  name: string
  price: string
  sku: string
  image?: string
}

type ProductCategory = {
  category: string
  items: Product[]
}

type SalesOrder = {
  id: number
  status: string
  customerId: number
  customerName: string
  salesPersonId: number
  salesPersonName: string
  subtotal: string
  taxAmount: string
  discountAmount: string
  totalAmount: string
  paymentMethod: string
  paymentStatus: string
  notes?: string
  priority: string
  paymentTerms: string
  dueDate: string
  deliveryDate?: string
  completedDate?: string
  createdAt: string
  updatedAt?: string
  items: SalesOrderItem[]
  partialAmount: string
  customer: {
    id: number
    grpId: number
    phone: string
    name: string
    email: string
    status: string
    address?: string
    measurement: {
      arabic: Measurement
      kuwaiti: Measurement
    }
    preferences: string[]
    createdAt: string
    updatedAt: string | null
  }
  salesPerson: {
    id: number
    name: string
    department: string
    email: string
    phone: string
    address: string
    level: number
    role: string | null
    joinDate: string
    status: string | null
    salary: string
    photo: string | null
    createdAt: string
    updatedAt: string | null
  }
}

type Measurement = {
  neck: number
  chest: number
  notes: string
  waist: number
  sleeves: number
  shoulder: number
  widthEnd: number
  backLength: number
  frontLength: number
}

export default function SalesOrderEditPage() {
  const params = useParams()
  const router = useRouter()
  const [sale, setSale] = useState<SalesOrder | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isMeasurementDialogOpen, setIsMeasurementDialogOpen] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentItemForMeasurement, setCurrentItemForMeasurement] = useState<SalesOrderItem | null>(null)
  const [measurementData, setMeasurementData] = useState<CustomItemMeasurement>({
    frontLength: "",
    backLength: "",
    shoulder: "",
    sleeves: "",
    neck: "",
    waist: "",
    chest: "",
    widthEnd: "",
    notes: "",
  })

  // Fetch products for the dialog
  const { data: productCategories, isLoading: isLoadingProducts } = useQuery<ProductCategory[]>({
    queryKey: ["active-products"],
    queryFn: async () => {
      const response = await fetch("http://localhost:5005/api/v1/products/list/catalog", {  credentials: "include" })
      const json = await response.json()
      if (!response.ok) {
        throw new Error("Failed to load products")
      }
      return json
    },
    enabled: isProductDialogOpen,
  })

  const {
    data: saleOrder,
    isLoading,
    error,
    refetch,
  } = useQuery<SalesOrder>({
    queryKey: [`sales-edit-${params?.id}`],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5005/api/v1/sales/${params?.id}`, {  credentials: "include"})
      const json = await response.json()
      if (!response.ok) {
        toast.error(json.message ?? "Failed to load sales order")
        throw new Error(json.message ?? "Failed to load sales order")
      }
      return json
    },
  })

  const { mutate: updateSale, isPending } = useMutation({
    mutationFn: async (data: UpdateSalesOrderDto) => {
      const response = await fetch(`http://localhost:5005/api/v1/sales/${params?.id}`, {
        method: "PATCH",
         credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      const json = await response.json()
      if (!response.ok) {
        throw new Error(json.message ?? "Failed to update sales order")
      }
      return json
    },
    onError: (err: any) => {
      toast.error(err.message)
    },
    onSuccess: (data: any) => {
      toast.success(data.message || "Sales order updated successfully")
      router.push(`/sales/${params?.id}`)
    },
  })

  useEffect(() => {
    if (saleOrder) {
      const enhancedSale = {
        ...saleOrder,
        paymentStatus: saleOrder.paymentStatus || "no-payment",
        priority: saleOrder.priority || "medium",
        paymentTerms: saleOrder.paymentTerms || "net 30",
        notes: saleOrder.notes || "",
        partialAmount: saleOrder.partialAmount || "0.00",
        items:
          Array.isArray(saleOrder.items) && saleOrder.items.length > 0
            ? saleOrder.items.map((item) => ({
                ...item,
                type: item.type || "ready-made",
                catelogId: item.catelogId || 1,
                sku: item.sku || "",
                modelPrice: item.modelPrice || undefined,
                modelName: item.modelName || undefined,
                isNew: false,
              }))
            : [],
      }
      setSale(enhancedSale)
    }
  }, [saleOrder])

  useEffect(() => {
    if (isCalculating && sale) {
      const items = sale.items || []
      const subtotal = items.reduce((sum, item) => sum + Number.parseFloat(item.total || "0"), 0)
      const discountAmount = subtotal * 0.1
      const afterDiscount = subtotal - discountAmount
      const taxAmount = afterDiscount * 0.05
      const totalAmount = afterDiscount + taxAmount

      setSale((prev) => {
        if (!prev) return null
        return {
          ...prev,
          subtotal: subtotal.toFixed(2),
          discountAmount: discountAmount.toFixed(2),
          taxAmount: taxAmount.toFixed(2),
          totalAmount: totalAmount.toFixed(2),
        }
      })

      setIsCalculating(false)
    }
  }, [isCalculating, sale])

  const handleSave = () => {
    if (!sale) return

    // Format data to match UpdateSalesOrderDto exactly
    const updateData: UpdateSalesOrderDto = {
      status: sale.status,
      customerId: sale.customerId,
      customerName: sale.customerName,
      salesPersonId: sale.salesPersonId,
      salesPersonName: sale.salesPersonName,
      subtotal: sale.subtotal,
      taxAmount: sale.taxAmount,
      discountAmount: sale.discountAmount,
      totalAmount: sale.totalAmount,
      paymentMethod: sale.paymentMethod,
      paymentStatus: sale.paymentStatus as "no-payment" | "partial" | "paid",
      notes: sale.notes,
      priority: sale.priority as "low" | "medium" | "high",
      paymentTerms: sale.paymentTerms,
      dueDate: new Date(sale.dueDate),
      deliveryDate: sale.deliveryDate ? new Date(sale.deliveryDate) : undefined,
      completedDate: sale.completedDate ? new Date(sale.completedDate) : undefined,
      partialAmount: sale.partialAmount,
      items: sale.items.map((item) => ({
        id: item.id,
        type: item.type,
        description: item.description,
        catelogId: item.catelogId,
        sku: item.sku,
        qty: item.qty,
        price: item.price,
        modelPrice: item.modelPrice,
        total: item.total,
        modelName: item.modelName,
        measurement: item.measurement,
      })),
    }

    updateSale(updateData)
  }

  const handleProductSelect = (product: Product, isSelected: boolean) => {
    if (isSelected) {
      setSelectedProducts((prev) => [...prev, product])
    } else {
      setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id))
    }
  }

  const addSelectedProducts = () => {
    if (!sale || selectedProducts.length === 0) return

    const newItems: SalesOrderItem[] = selectedProducts.map((product) => ({
      id: undefined, // Temporary ID for new items
      type: "ready-made",
      description: product.name,
      catelogId: product.id,
      sku: product.sku,
      qty: 1,
      price: product.price,
      total: product.price,
      isNew: true,
    }))

    setSale({
      ...sale,
      items: [...(sale.items || []), ...newItems],
    })

    setSelectedProducts([])
    setIsProductDialogOpen(false)
    setIsCalculating(true)
    toast.success(`Added ${newItems.length} product(s) to the order`)
  }

  const removeItem = (id?: number) => {
    if (!sale || !sale.items) return
    setSale({
      ...sale,
      items: sale.items.filter((item) => item.id !== id),
    })
    setIsCalculating(true)
  }

  const updateItemQuantity = (qty: number, id?: number) => {
    if (!sale || !sale.items) return

    const updatedItems = sale.items.map((item) => {
      if (item.id === id) {
        const price = Number.parseFloat(item.price)
        const total = (qty * price).toFixed(2)
        return { ...item, qty, total }
      }
      return item
    })

    setSale({
      ...sale,
      items: updatedItems,
    })

    setIsCalculating(true)
  }

  const updateItemType = (type: "ready-made" | "custom", id?: number) => {
    if (!sale || !sale.items) return

    const updatedItems = sale.items.map((item) => {
      if (item.id === id) {
        return { ...item, type, measurement: type === "ready-made" ? undefined : item.measurement }
      }
      return item
    })

    setSale({
      ...sale,
      items: updatedItems,
    })
  }

  const openMeasurementDialog = (item: SalesOrderItem) => {
    setCurrentItemForMeasurement(item)
    setMeasurementData(
      item.measurement || {
        frontLength: "",
        backLength: "",
        shoulder: "",
        sleeves: "",
        neck: "",
        waist: "",
        chest: "",
        widthEnd: "",
        notes: "",
      },
    )
    setIsMeasurementDialogOpen(true)
  }

  const saveMeasurement = () => {
    if (!sale || !currentItemForMeasurement) return

    const updatedItems = sale.items.map((item) => {
      if (item.id === currentItemForMeasurement.id) {
        return { ...item, measurement: measurementData }
      }
      return item
    })

    setSale({
      ...sale,
      items: updatedItems,
    })

    setIsMeasurementDialogOpen(false)
    setCurrentItemForMeasurement(null)
    toast.success("Measurement saved successfully")
  }

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return ""
    return new Date(dateString).toISOString().slice(0, 16)
  }

  const handleDateChange = (field: string, value: string) => {
    if (!sale) return
    setSale({
      ...sale,
      [field]: value ? new Date(value).toISOString() : undefined,
    })
  }

  // Get a fast lookup of IDs already in the order
  const existingIds = new Set(sale?.items.map((i) => i.catelogId) || [])

  // Filter out both existing items AND apply search term
  const filteredCategories = productCategories
    ?.map((category) => ({
      ...category,
      items: category.items.filter(
        (product) =>
          // 1) not already in order
          !existingIds.has(product.id) &&
          // 2) matches search
          (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase())),
      ),
    }))
    .filter((category) => category.items.length > 0)

  if (isLoading || !sale) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-[300px] text-center">
          <CardContent className="space-y-4 py-8">
            <div className="w-10 h-10 mx-auto border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-lg font-medium text-gray-700">Loading invoice…</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="w-full max-w-md border-red-300">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{(error as Error).message || "Failed to load invoice."}</p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Invoice #{sale.id}</h1>
            <p className="text-sm text-muted-foreground">
              Edit Mode • Due: {new Date(sale.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/sales/${params?.id}/view`)}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            <Save className="mr-2 h-4 w-4" />
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Product Selection Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Add Products to Order</DialogTitle>
            <DialogDescription>Select one or more products to add to this sales order.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name or SKU..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Selected Products Summary */}
            {selectedProducts.length > 0 && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-2">Selected Products ({selectedProducts.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProducts.map((product) => (
                    <Badge key={product.id} variant="secondary">
                      {product.name} - AED {product.price}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Products List */}
            <div className="max-h-96 overflow-y-auto space-y-4">
              {isLoadingProducts ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                </div>
              ) : filteredCategories && filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      {category.category}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {category.items.map((product) => {
                        const isSelected = selectedProducts.some((p) => p.id === product.id)
                        return (
                          <div
                            key={product.id}
                            className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                              isSelected ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                            }`}
                            onClick={() => handleProductSelect(product, !isSelected)}
                          >
                            <Checkbox checked={isSelected} onChange={() => {}} />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{product.name}</p>
                              <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                              <p className="text-sm font-semibold text-green-600">AED {product.price}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No products found matching your search." : "No products available."}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addSelectedProducts} disabled={selectedProducts.length === 0}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add {selectedProducts.length} Product(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Measurement Dialog */}
      <Dialog open={isMeasurementDialogOpen} onOpenChange={setIsMeasurementDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Custom Measurements</DialogTitle>
            <DialogDescription>Enter measurements for {currentItemForMeasurement?.description}</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frontLength">Front Length *</Label>
              <Input
                id="frontLength"
                value={measurementData.frontLength}
                onChange={(e) => setMeasurementData({ ...measurementData, frontLength: e.target.value })}
                placeholder="e.g., 42"
              />
            </div>
            <div>
              <Label htmlFor="backLength">Back Length *</Label>
              <Input
                id="backLength"
                value={measurementData.backLength}
                onChange={(e) => setMeasurementData({ ...measurementData, backLength: e.target.value })}
                placeholder="e.g., 44"
              />
            </div>
            <div>
              <Label htmlFor="shoulder">Shoulder *</Label>
              <Input
                id="shoulder"
                value={measurementData.shoulder}
                onChange={(e) => setMeasurementData({ ...measurementData, shoulder: e.target.value })}
                placeholder="e.g., 18"
              />
            </div>
            <div>
              <Label htmlFor="sleeves">Sleeves *</Label>
              <Input
                id="sleeves"
                value={measurementData.sleeves}
                onChange={(e) => setMeasurementData({ ...measurementData, sleeves: e.target.value })}
                placeholder="e.g., 24"
              />
            </div>
            <div>
              <Label htmlFor="neck">Neck *</Label>
              <Input
                id="neck"
                value={measurementData.neck}
                onChange={(e) => setMeasurementData({ ...measurementData, neck: e.target.value })}
                placeholder="e.g., 16"
              />
            </div>
            <div>
              <Label htmlFor="waist">Waist *</Label>
              <Input
                id="waist"
                value={measurementData.waist}
                onChange={(e) => setMeasurementData({ ...measurementData, waist: e.target.value })}
                placeholder="e.g., 32"
              />
            </div>
            <div>
              <Label htmlFor="chest">Chest *</Label>
              <Input
                id="chest"
                value={measurementData.chest}
                onChange={(e) => setMeasurementData({ ...measurementData, chest: e.target.value })}
                placeholder="e.g., 40"
              />
            </div>
            <div>
              <Label htmlFor="widthEnd">Width End *</Label>
              <Input
                id="widthEnd"
                value={measurementData.widthEnd}
                onChange={(e) => setMeasurementData({ ...measurementData, widthEnd: e.target.value })}
                placeholder="e.g., 22"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="measurementNotes">Notes</Label>
            <Textarea
              id="measurementNotes"
              value={measurementData.notes || ""}
              onChange={(e) => setMeasurementData({ ...measurementData, notes: e.target.value })}
              placeholder="Additional measurement notes..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMeasurementDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveMeasurement}>
              <Ruler className="mr-2 h-4 w-4" />
              Save Measurements
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice Content */}
      <Card className="p-6">
        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-8 pb-6 border-b">
          <div>
            <h2 className="text-xl font-bold mb-2">Nubras Tailoring</h2>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>123 Al Wasl Road</p>
              <p>Dubai, UAE</p>
              <p>+971 50 123 4567</p>
              <p>info@nubrastailoring.com</p>
              <p>TRN: 100123456789003</p>
            </div>
          </div>
          <div className="text-right space-y-4">
            <h3 className="text-lg font-bold mb-2">Invoice #{sale.id}</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Date: {new Date(sale.createdAt).toLocaleDateString()}</p>
              <p>Due: {new Date(sale.dueDate).toLocaleDateString()}</p>
            </div>

            {/* Status, Priority, Payment Status */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={sale.status} onValueChange={(value) => setSale({ ...sale, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={sale.priority} onValueChange={(value) => setSale({ ...sale, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select
                  value={sale.paymentStatus}
                  onValueChange={(value) => setSale({ ...sale, paymentStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-payment">No Payment</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Customer and Sales Person Information */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Customer: {sale.customerName}</h4>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium">Customer ID: {sale.customerId}</p>
                <p className="text-sm text-muted-foreground">{sale.customer?.email || "No email provided"}</p>
                <p className="text-sm text-muted-foreground">{sale.customer?.phone || "No phone provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Sales Person: {sale.salesPersonName}</p>
                <p className="text-sm text-muted-foreground">ID: {sale.salesPersonId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Date Fields */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Important Dates:</h4>
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={formatDateForInput(sale.dueDate)}
                onChange={(e) => handleDateChange("dueDate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="deliveryDate">Delivery Date</Label>
              <Input
                id="deliveryDate"
                type="datetime-local"
                value={formatDateForInput(sale.deliveryDate)}
                onChange={(e) => handleDateChange("deliveryDate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="completedDate">Completed Date</Label>
              <Input
                id="completedDate"
                type="datetime-local"
                value={formatDateForInput(sale.completedDate)}
                onChange={(e) => handleDateChange("completedDate", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold">Order Items</h4>
            <Button size="sm" onClick={() => setIsProductDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Products
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Model</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sale.items && sale.items.length > 0 ? (
                sale.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Select
                        value={item.type}
                        onValueChange={(value: "ready-made" | "custom") => updateItemType(value, item.id)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ready-made">Ready Made</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{item.description}</div>
                      <div className="text-xs text-muted-foreground">Catalog ID: {item.catelogId}</div>
                      {item.type === "custom" && item.measurement && (
                        <Badge variant="outline" className="mt-1">
                          <Ruler className="w-3 h-3 mr-1" />
                          Measured
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Input
                          placeholder="Model name"
                          value={item.modelName || ""}
                          onChange={(e) => {
                            const updatedItems = sale.items.map((i) =>
                              i.id === item.id ? { ...i, modelName: e.target.value } : i,
                            )
                            setSale({ ...sale, items: updatedItems })
                          }}
                          className="text-xs"
                        />
                        <Input
                          placeholder="Model price"
                          value={item.modelPrice || ""}
                          onChange={(e) => {
                            const updatedItems = sale.items.map((i) =>
                              i.id === item.id ? { ...i, modelPrice: e.target.value } : i,
                            )
                            setSale({ ...sale, items: updatedItems })
                          }}
                          className="text-xs"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={item.qty}
                        onChange={(e) => updateItemQuantity(Number.parseInt(e.target.value) || 1, item.id)}
                        className="w-20 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="1"
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </TableCell>
                    <TableCell className="text-right">AED {item.price}</TableCell>
                    <TableCell className="text-right font-medium">AED {item.total}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-center">
                        {item.type === "custom" && (
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => openMeasurementDialog(item)}
                            className="h-8 w-8"
                          >
                            <Ruler className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <p>No items in this order.</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsProductDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Products
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Financial Totals */}
        <div className="flex justify-end mb-6">
          <div className="w-96 space-y-2 p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>AED {sale.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-red-600 font-medium">
              <span>Discount Amount:</span>
              <span>-AED {sale.discountAmount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax Amount (5%):</span>
              <span>AED {sale.taxAmount}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t">
              <span>Total Amount:</span>
              <span>AED {sale.totalAmount}</span>
            </div>
            {sale.paymentStatus === "partial" && (
              <div className="flex justify-between text-sm text-blue-600 font-medium">
                <span>Partial Amount Paid:</span>
                <span>AED {sale.partialAmount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment & Additional Information */}
        <div className="grid grid-cols-3 gap-6 pt-6 border-t mb-6">
          <div>
            <Label htmlFor="paymentMethod">Payment Method *</Label>
            <Select value={sale.paymentMethod} onValueChange={(value) => setSale({ ...sale, paymentMethod: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="apple_pay">Apple Pay</SelectItem>
                <SelectItem value="check">Check</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="paymentTerms">Payment Terms *</Label>
            <Input
              id="paymentTerms"
              value={sale.paymentTerms}
              onChange={(e) => setSale({ ...sale, paymentTerms: e.target.value })}
              placeholder="net 30"
            />
          </div>
          <div>
            <Label htmlFor="partialAmount">Partial Amount</Label>
            <Input
              id="partialAmount"
              type="number"
              step="0.01"
              value={sale.partialAmount}
              onChange={(e) => setSale({ ...sale, partialAmount: e.target.value })}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="pt-6 border-t">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={sale.notes}
            onChange={(e) => setSale({ ...sale, notes: e.target.value })}
            rows={4}
            placeholder="Additional notes or special instructions..."
          />
        </div>
      </Card>
    </div>
  )
}
