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
  RefreshCw,
  User,
  Phone,
  Calendar,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

interface OrderItem {
  id: number
  name: string
  sku: string
  price: number
  quantity: number
  category: string
}

interface Order {
  id: number
  date: Date
  customer: {
    id: number
    name: string
    phone: string
    email: string
  }
  items: OrderItem[]
  total: number
  paymentMethod: string
  status: string
}

interface ReturnItem {
  itemName: string
  qty: number
  reason: string
  type: string
  condition: string
  refundAmount: string
  selected: boolean
  originalPrice: number
  maxQty: number
  orderItemId: number
}

export default function NewReturnPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("order-selection")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([])
  const [returnNotes, setReturnNotes] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [status, setStatus] = useState("pending")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Sample orders data
  const {data: orders = [], isLoading: orderLoading} = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await fetch("http://localhost:5005/api/v1/sales/list/orders?type=ready-made", { credentials: "include" });
      const json = await response.json();
      if(!response.ok) {
        toast.error("Failed to load orders")
      }
      return json;
    }
  })

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

  const returnTypes = ["refund", "exchange", "store-credit"]

  const conditionOptions = [
    { value: "new", label: "New/Resellable", refundPercentage: 100 },
    { value: "good", label: "Good Condition", refundPercentage: 90 },
    { value: "damaged", label: "Damaged", refundPercentage: 50 },
    { value: "defective", label: "Defective", refundPercentage: 100 },
  ]

  const paymentMethods = ["cash", "mobile", "card", "bank_transfer", "cheque"]

  const statusOptions = ["pending", "approved", "rejected", "completed"]

  // Search for orders
  const searchOrders = () => {
    if (!searchQuery.trim()) {
      toast.message("Please enter a search term")
      return
    }

    const found = orders.find(
      (order) =>
        order.id.toString().includes(searchQuery) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.phone.includes(searchQuery),
    )

    if (found) {
      setSelectedOrder(found)
      initializeReturnItems(found)
      setActiveTab("item-selection")
    } else {
      toast.error("Order not found. Please check the order number, customer name, or phone number.")
    }
  }

  // Initialize return items from order
  const initializeReturnItems = (order: Order) => {
    const initialReturnItems: ReturnItem[] = order.items.map((item) => ({
      itemName: item.name,
      qty: 1,
      reason: "",
      type: "refund",
      condition: "new",
      refundAmount: item.price.toString(),
      selected: false,
      orderItemId: item.id,
      originalPrice: item.price,
      maxQty: item.quantity,
    }))
    setReturnItems(initialReturnItems)
  }

  // Toggle item selection
  const toggleItemSelection = (index: number, selected: boolean) => {
    setReturnItems(
      returnItems.map((item, i) =>
        i === index
          ? {
              ...item, 
              selected,
              reason: selected ? "Customer Changed Mind" : "",
              type: selected ? "refund" : "refund",
            }
          : item,
      ),
    )
  }

  // Update return item
  const updateReturnItem = (index: number, field: keyof ReturnItem, value: any) => {
    setReturnItems(
      returnItems.map((item, i) => {
        if (i === index) {
          const updated = { ...item, [field]: value }

          // Recalculate refund amount when quantity or condition changes
          if (field === "qty" || field === "condition") {
            const condition = conditionOptions.find((c) => c.value === updated.condition)
            const refundPercentage = condition?.refundPercentage || 100
            updated.refundAmount = ((updated.qty * updated.originalPrice * refundPercentage) / 100).toString()
          }

          return updated
        }
        return item
      }),
    )
  }

  // Calculate totals
  const selectedItems = returnItems.filter((item) => item.selected)
  const totalRefund = selectedItems.reduce((sum, item) => sum + Number.parseFloat(item.refundAmount), 0)

  // Validation
  const canProceedToProcessing = () => {
    return (
      selectedItems.length > 0 &&
      selectedItems.every((item) => item.reason && item.type && item.condition && item.qty > 0)
    )
  }

  const canSubmitReturn = () => {
    return canProceedToProcessing() && paymentMethod && status
  }

  // Process return
  const processReturn = async () => {
    if (!canSubmitReturn() || !selectedOrder) {
      toast.message("Please complete all required fields")
      return
    }

    setIsProcessing(true)

    try {
      const returnData = {
        customerId: selectedOrder.customer.id,
        customerName: selectedOrder.customer.name,
        orderId: selectedOrder.id,
        paymentMethod,
        notes: returnNotes,
        status,
        items: selectedItems.map((item) => ({
          returnId: 0, // Will be set by backend
          orderItemId: item.orderItemId,
          itemName: item.itemName,
          qty: item.qty,
          reason: item.reason,
          type: item.type,
          condition: item.condition,
          refundAmount: item.refundAmount,
        })),
      }

      const response = await fetch("http://localhost:5005/api/v1/returns", {
        method: "POST",
         credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(returnData),
      })

      if (!response.ok) {
        throw new Error("Failed to create return")
      }

      const result = await response.json()

      toast.success(result.message || "Return processed successfully!")

      // Reset and redirect
      router.push("/returns")
    } catch (error) {
      console.error("Error processing return:", error)
      toast.error("Error processing return. Please try again.")
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
                  {orders.map((order) => (
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
                                <p className="font-medium text-lg">Order #{order.id}</p>
                                <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
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
                    Order Summary - #{selectedOrder.id}
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
                          <p className="font-medium">{new Date(selectedOrder.date).toLocaleDateString()}</p>
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
                  <CardTitle>Select Items to Return</CardTitle>
                  <CardDescription>Choose items and specify return details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Select</TableHead>
                        <TableHead>Item Details</TableHead>
                        <TableHead className="text-center w-[100px]">Return Qty</TableHead>
                        <TableHead className="w-[150px]">Reason</TableHead>
                        <TableHead className="w-[120px]">Type</TableHead>
                        <TableHead className="w-[120px]">Condition</TableHead>
                        <TableHead className="text-right w-[120px]">Refund</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {returnItems.map((item, index) => (
                        <TableRow key={index} className={item.selected ? "bg-muted/50" : ""}>
                          <TableCell>
                            <Checkbox
                              checked={item.selected}
                              onCheckedChange={(checked) => toggleItemSelection(index, !!checked)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{item.itemName}</div>
                              <div className="text-sm text-muted-foreground">
                                AED {item.originalPrice.toFixed(2)} each (Max: {item.maxQty})
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {item.selected ? (
                              <Input
                                type="number"
                                min="1"
                                max={item.maxQty}
                                value={item.qty}
                                onChange={(e) => updateReturnItem(index, "qty", Number.parseInt(e.target.value) || 1)}
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
                                onValueChange={(value) => updateReturnItem(index, "reason", value)}
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
                                value={item.type}
                                onValueChange={(value) => updateReturnItem(index, "type", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {returnTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
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
                                onValueChange={(value) => updateReturnItem(index, "condition", value)}
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
                              <div className="font-medium">AED {Number.parseFloat(item.refundAmount).toFixed(2)}</div>
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">{selectedItems.length}</div>
                          <p className="text-sm text-muted-foreground">Items Selected</p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            {selectedItems.reduce((sum, item) => sum + item.qty, 0)}
                          </div>
                          <p className="text-sm text-muted-foreground">Total Quantity</p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-600">AED {totalRefund.toFixed(2)}</div>
                          <p className="text-sm text-muted-foreground">Total Refund</p>
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
                          <span className="font-medium">{selectedItems.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Quantity:</span>
                          <span className="font-medium">{selectedItems.reduce((sum, item) => sum + item.qty, 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Return Date:</span>
                          <span className="font-medium">{new Date().toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Customer Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Customer ID:</span>
                          <span className="font-medium">{selectedOrder.customer.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Customer Name:</span>
                          <span className="font-medium">{selectedOrder.customer.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Order ID:</span>
                          <span className="font-medium">{selectedOrder.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium">Refund Calculation</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total Refund:</span>
                          <span className="text-green-600">AED {totalRefund.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Return Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Return Configuration</CardTitle>
                  <CardDescription>Configure payment method and status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="payment-method">Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method.replace("_", " ").toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((statusOption) => (
                            <SelectItem key={statusOption} value={statusOption}>
                              {statusOption.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="return-notes">Return Notes (Optional)</Label>
                    <Textarea
                      id="return-notes"
                      placeholder="Add any additional notes about this return..."
                      value={returnNotes}
                      onChange={(e) => setReturnNotes(e.target.value)}
                    />
                  </div>
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
                  <span className="font-medium">{selectedItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Refund:</span>
                  <span className="font-medium text-green-600">AED {totalRefund.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-medium">{paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium">{status}</span>
                </div>
              </div>
            </div>
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
