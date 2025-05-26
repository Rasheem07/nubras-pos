"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
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
  Search,
  ShoppingCart,
  Package,
  Calculator,
  CheckCircle,
  ArrowLeft,
  AlertTriangle,
  RefreshCw,
  CreditCard,
  Banknote,
  Receipt,
  User,
  Phone,
  Calendar,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface OrderItem {
  id: string
  name: string
  sku: string
  price: number
  quantity: number
  category: string
  description?: string
}

interface Order {
  id: string
  date: Date
  customer: {
    id: string
    name: string
    phone: string
    email: string
    address: string
  }
  items: OrderItem[]
  subtotal: number
  discount: number
  tax: number
  total: number
  amountPaid: number
  amountDue: number
  paymentMethod: string
  paymentReference?: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
}

interface ReturnItem {
  id: string
  name: string
  sku: string
  originalPrice: number
  originalQuantity: number
  returnQuantity: number
  reason: string
  returnType: "refund" | "exchange" | "store-credit"
  condition: "new" | "good" | "damaged" | "defective"
  refundAmount: number
  selected: boolean
}

export default function NewReturnPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("order-selection")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([])
  const [returnNotes, setReturnNotes] = useState("")
  const [refundMethod, setRefundMethod] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Sample orders data
  const sampleOrders: Order[] = [
    {
      id: "ORD-2024-001",
      date: new Date("2024-05-15"),
      customer: {
        id: "CUST-001",
        name: "Fatima Mohammed Al Zahra",
        phone: "+971 50 123 4567",
        email: "fatima.alzahra@example.com",
        address: "Villa 123, Al Wasl Road, Jumeirah 1, Dubai, UAE",
      },
      items: [
        {
          id: "item1",
          name: "Premium Kandura - White",
          sku: "KAN-PREM-WHT-001",
          price: 450,
          quantity: 2,
          category: "Ready-made",
          description: "Premium cotton kandura with traditional embroidery",
        },
        {
          id: "item2",
          name: "Silk Scarf - Gold Pattern",
          sku: "SCF-SILK-GLD-001",
          price: 120,
          quantity: 1,
          category: "Accessories",
          description: "Hand-woven silk scarf with gold thread pattern",
        },
        {
          id: "item3",
          name: "Traditional Abaya - Black",
          sku: "ABA-TRAD-BLK-001",
          price: 380,
          quantity: 1,
          category: "Ready-made",
          description: "Traditional black abaya with pearl details",
        },
      ],
      subtotal: 1400,
      discount: 140,
      tax: 63,
      total: 1323,
      amountPaid: 1323,
      amountDue: 0,
      paymentMethod: "Credit Card",
      paymentReference: "CC-2024-001-789",
      status: "completed",
    },
    {
      id: "ORD-2024-002",
      date: new Date("2024-05-10"),
      customer: {
        id: "CUST-002",
        name: "Ahmed Al Mansouri",
        phone: "+971 55 987 6543",
        email: "ahmed.mansouri@example.com",
        address: "Apartment 456, Sheikh Zayed Road, Business Bay, Dubai, UAE",
      },
      items: [
        {
          id: "item4",
          name: "Custom Thobe - Navy Blue",
          sku: "THO-CUST-NVY-001",
          price: 650,
          quantity: 1,
          category: "Custom",
          description: "Custom-tailored thobe with personalized measurements",
        },
        {
          id: "item5",
          name: "Leather Belt - Brown",
          sku: "BLT-LEAT-BRN-001",
          price: 85,
          quantity: 2,
          category: "Accessories",
          description: "Genuine leather belt with traditional buckle",
        },
      ],
      subtotal: 820,
      discount: 0,
      tax: 41,
      total: 861,
      amountPaid: 861,
      amountDue: 0,
      paymentMethod: "Cash",
      status: "completed",
    },
  ]

  const returnReasons = [
    "Size/Fit Issue",
    "Quality/Manufacturing Defect",
    "Wrong Item Delivered",
    "Customer Changed Mind",
    "Not as Described",
    "Damaged in Transit",
    "Color Mismatch",
    "Fabric Issue",
    "Other",
  ]

  const returnTypes = [
    { value: "refund", label: "Full Refund" },
    { value: "exchange", label: "Exchange" },
    { value: "store-credit", label: "Store Credit" },
  ]

  const conditionOptions = [
    { value: "new", label: "New/Resellable", refundPercentage: 100 },
    { value: "good", label: "Good Condition", refundPercentage: 90 },
    { value: "damaged", label: "Damaged", refundPercentage: 50 },
    { value: "defective", label: "Defective", refundPercentage: 100 },
  ]

  const refundMethods = [
    { value: "original", label: "Original Payment Method", icon: CreditCard },
    { value: "store-credit", label: "Store Credit", icon: Receipt },
    { value: "cash", label: "Cash Refund", icon: Banknote },
  ]

  // Search for orders
  const searchOrders = () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search term")
      return
    }

    const found = sampleOrders.find(
      (order) =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.phone.includes(searchQuery),
    )

    if (found) {
      setSelectedOrder(found)
      initializeReturnItems(found)
      setActiveTab("item-selection")
    } else {
      alert("Order not found. Please check the order number, customer name, or phone number.")
    }
  }

  // Initialize return items from order
  const initializeReturnItems = (order: Order) => {
    const initialReturnItems: ReturnItem[] = order.items.map((item) => ({
      id: item.id,
      name: item.name,
      sku: item.sku,
      originalPrice: item.price,
      originalQuantity: item.quantity,
      returnQuantity: 1,
      reason: "",
      returnType: "refund",
      condition: "new",
      refundAmount: item.price,
      selected: false,
    }))
    setReturnItems(initialReturnItems)
  }

  // Toggle item selection
  const toggleItemSelection = (itemId: string, selected: boolean) => {
    setReturnItems(
      returnItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              selected,
              reason: selected ? "Customer Changed Mind" : "",
              returnType: selected ? "refund" : "refund",
            }
          : item,
      ),
    )
  }

  // Select all items
  const selectAllItems = (selected: boolean) => {
    setReturnItems(
      returnItems.map((item) => ({
        ...item,
        selected,
        reason: selected ? "Customer Changed Mind" : "",
        returnType: selected ? "refund" : "refund",
      })),
    )
  }

  // Update return item
  const updateReturnItem = (itemId: string, field: keyof ReturnItem, value: any) => {
    setReturnItems(
      returnItems.map((item) => {
        if (item.id === itemId) {
          const updated = { ...item, [field]: value }

          // Recalculate refund amount when quantity or condition changes
          if (field === "returnQuantity" || field === "condition") {
            const condition = conditionOptions.find((c) => c.value === updated.condition)
            const refundPercentage = condition?.refundPercentage || 100
            updated.refundAmount = (updated.returnQuantity * updated.originalPrice * refundPercentage) / 100
          }

          return updated
        }
        return item
      }),
    )
  }

  // Calculate totals
  const selectedItems = returnItems.filter((item) => item.selected)
  const totalRefund = selectedItems.reduce((sum, item) => sum + item.refundAmount, 0)
  const totalItems = selectedItems.length
  const totalQuantity = selectedItems.reduce((sum, item) => sum + item.returnQuantity, 0)

  // Check if manager approval is required
  const requiresManagerApproval = totalRefund > 1000 || selectedItems.some((item) => item.condition === "defective")

  // Validation
  const canProceedToProcessing = () => {
    return (
      selectedItems.length > 0 &&
      selectedItems.every((item) => item.reason && item.returnType && item.condition && item.returnQuantity > 0)
    )
  }

  const canSubmitReturn = () => {
    return canProceedToProcessing() && refundMethod
  }

  // Process return
  const processReturn = async () => {
    if (!canSubmitReturn()) {
      alert("Please complete all required fields")
      return
    }

    setIsProcessing(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const returnData = {
        id: `RET-${Date.now()}`,
        orderId: selectedOrder!.id,
        customerName: selectedOrder!.customer.name,
        customerPhone: selectedOrder!.customer.phone,
        customerEmail: selectedOrder!.customer.email,
        returnDate: new Date(),
        items: selectedItems,
        totalRefund,
        refundMethod,
        status: requiresManagerApproval ? "pending" : "approved",
        processedBy: "Current User",
        notes: returnNotes,
        requiresManagerApproval,
      }

      console.log("Return processed:", returnData)
      alert(`Return processed successfully! Return ID: ${returnData.id}`)

      // Reset and redirect
      router.push("/pos/returns")
    } catch (error) {
      alert("Error processing return. Please try again.")
    } finally {
      setIsProcessing(false)
      setShowConfirmDialog(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/returns">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Returns
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Return</h1>
            <p className="text-muted-foreground">Process a new return, exchange, or refund</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="order-selection" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Find Order
          </TabsTrigger>
          <TabsTrigger value="item-selection" disabled={!selectedOrder} className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Select Items
          </TabsTrigger>
          <TabsTrigger value="processing" disabled={!canProceedToProcessing()} className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Process Return
          </TabsTrigger>
        </TabsList>

        {/* Order Selection Tab */}
        <TabsContent value="order-selection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Find Order to Return
              </CardTitle>
              <CardDescription>
                Search for the original order using order number, customer name, or phone number
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter order number, customer name, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchOrders()}
                  className="flex-1"
                />
                <Button onClick={searchOrders} disabled={!searchQuery.trim()}>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>

              {/* Sample Orders */}
              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Recent Orders (Click to Select):</h4>
                <div className="grid gap-4">
                  {sampleOrders.map((order) => (
                    <Card
                      key={order.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        setSelectedOrder(order)
                        initializeReturnItems(order)
                        setActiveTab("item-selection")
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="font-medium text-lg">{order.id}</p>
                                <p className="text-sm text-muted-foreground">{order.date.toLocaleDateString()}</p>
                              </div>
                              <Badge variant="outline">{order.status}</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="font-medium">{order.customer.name}</p>
                                <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                                <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  {order.items.length} items • AED {order.total.toFixed(2)}
                                </p>
                                <p className="text-sm text-muted-foreground">Payment: {order.paymentMethod}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Item Selection Tab */}
        <TabsContent value="item-selection" className="space-y-4">
          {selectedOrder && (
            <>
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Order Summary - {selectedOrder.id}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Customer</p>
                          <p className="font-medium">{selectedOrder.customer.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{selectedOrder.customer.phone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Order Date</p>
                          <p className="font-medium">{selectedOrder.date.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                          <p className="font-medium">AED {selectedOrder.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Payment Method</p>
                          <p className="font-medium">{selectedOrder.paymentMethod}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Items</p>
                          <p className="font-medium">{selectedOrder.items.length} items</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Item Selection */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Select Items to Return</CardTitle>
                      <CardDescription>Choose items and specify return details</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => selectAllItems(true)}>
                        Select All
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => selectAllItems(false)}>
                        Clear All
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Select</TableHead>
                        <TableHead>Item Details</TableHead>
                        <TableHead className="text-center w-[80px]">Qty</TableHead>
                        <TableHead className="text-center w-[100px]">Return Qty</TableHead>
                        <TableHead className="w-[150px]">Reason</TableHead>
                        <TableHead className="w-[120px]">Type</TableHead>
                        <TableHead className="w-[120px]">Condition</TableHead>
                        <TableHead className="text-right w-[120px]">Refund</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {returnItems.map((item) => (
                        <TableRow key={item.id} className={item.selected ? "bg-muted/50" : ""}>
                          <TableCell>
                            <Checkbox
                              checked={item.selected}
                              onCheckedChange={(checked) => toggleItemSelection(item.id, !!checked)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">SKU: {item.sku}</div>
                              <div className="text-sm text-muted-foreground">
                                AED {item.originalPrice.toFixed(2)} each
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-medium">{item.originalQuantity}</TableCell>
                          <TableCell className="text-center">
                            {item.selected ? (
                              <Input
                                type="number"
                                min="1"
                                max={item.originalQuantity}
                                value={item.returnQuantity}
                                onChange={(e) =>
                                  updateReturnItem(item.id, "returnQuantity", Number.parseInt(e.target.value) || 1)
                                }
                                className="w-16 text-center"
                              />
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {item.selected ? (
                              <Select
                                value={item.reason}
                                onValueChange={(value) => updateReturnItem(item.id, "reason", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  {returnReasons.map((reason) => (
                                    <SelectItem key={reason} value={reason}>
                                      {reason}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {item.selected ? (
                              <Select
                                value={item.returnType}
                                onValueChange={(value: "refund" | "exchange" | "store-credit") =>
                                  updateReturnItem(item.id, "returnType", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {returnTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {item.selected ? (
                              <Select
                                value={item.condition}
                                onValueChange={(value: "new" | "good" | "damaged" | "defective") =>
                                  updateReturnItem(item.id, "condition", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {conditionOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      <div>
                                        <div>{option.label}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {option.refundPercentage}% refund
                                        </div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.selected ? (
                              <div className="font-medium">AED {item.refundAmount.toFixed(2)}</div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Selection Summary */}
                  {selectedItems.length > 0 && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">{totalItems}</div>
                          <p className="text-sm text-muted-foreground">Items Selected</p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-primary">{totalQuantity}</div>
                          <p className="text-sm text-muted-foreground">Total Quantity</p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-600">AED {totalRefund.toFixed(2)}</div>
                          <p className="text-sm text-muted-foreground">Total Refund</p>
                        </div>
                        <div>
                          {requiresManagerApproval ? (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Manager Approval Required
                            </Badge>
                          ) : (
                            <Badge variant="default" className="text-xs">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Auto-Approved
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setActiveTab("order-selection")}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Search
                    </Button>
                    <Button onClick={() => setActiveTab("processing")} disabled={!canProceedToProcessing()}>
                      Continue to Processing
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Processing Tab */}
        <TabsContent value="processing" className="space-y-4">
          {selectedOrder && (
            <>
              {/* Return Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Return Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Return Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Items to Return:</span>
                          <span className="font-medium">{totalItems}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Quantity:</span>
                          <span className="font-medium">{totalQuantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Return Date:</span>
                          <span className="font-medium">{new Date().toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Original Order</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Order Total:</span>
                          <span className="font-medium">AED {selectedOrder.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment Method:</span>
                          <span className="font-medium">{selectedOrder.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment Reference:</span>
                          <span className="font-medium text-xs">{selectedOrder.paymentReference || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Refund Calculation</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Gross Refund:</span>
                          <span className="font-medium">AED {totalRefund.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Processing Fee:</span>
                          <span className="font-medium">AED 0.00</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Net Refund:</span>
                          <span className="text-green-600">AED {totalRefund.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Refund Method Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Refund Method</CardTitle>
                  <CardDescription>Select how the refund should be processed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {refundMethods.map((method) => {
                      const Icon = method.icon
                      return (
                        <div
                          key={method.value}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            refundMethod === method.value
                              ? "border-primary bg-primary/5"
                              : "border-muted hover:border-primary/50"
                          }`}
                          onClick={() => setRefundMethod(method.value)}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded ${
                                refundMethod === method.value ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium">{method.label}</div>
                              {method.value === "original" && selectedOrder && (
                                <div className="text-sm text-muted-foreground">
                                  Refund to {selectedOrder.paymentMethod}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="return-notes">Return Notes (Optional)</Label>
                    <Textarea
                      id="return-notes"
                      placeholder="Add any additional notes about this return..."
                      value={returnNotes}
                      onChange={(e) => setReturnNotes(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Approval Requirements */}
                  {requiresManagerApproval && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-amber-800">Manager Approval Required</h4>
                          <p className="text-sm text-amber-700 mt-1">This return requires manager approval due to:</p>
                          <ul className="text-sm text-amber-700 mt-2 space-y-1">
                            {totalRefund > 1000 && <li>• High refund amount (over AED 1,000)</li>}
                            {selectedItems.some((item) => item.condition === "defective") && (
                              <li>• Contains defective items</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("item-selection")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Selection
                </Button>
                <Button onClick={() => setShowConfirmDialog(true)} disabled={!canSubmitReturn()}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Process Return
                </Button>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Return Processing</AlertDialogTitle>
            <AlertDialogDescription>
              Please review the return details before processing. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-medium">{selectedOrder?.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-medium">{selectedOrder?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Items to Return:</span>
                  <span className="font-medium">{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Refund:</span>
                  <span className="font-medium text-green-600">AED {totalRefund.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Refund Method:</span>
                  <span className="font-medium">{refundMethods.find((m) => m.value === refundMethod)?.label}</span>
                </div>
              </div>
            </div>
            {requiresManagerApproval && (
              <div className="flex items-center gap-2 text-amber-600 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>This return will be pending manager approval</span>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={processReturn} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Process Return
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
