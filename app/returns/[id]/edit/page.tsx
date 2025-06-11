"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2, Save, RefreshCw, User, Phone, Calendar, DollarSign, Package, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { toast } from "@/hooks/use-toast"

// Form validation schema
const returnItemSchema = z.object({
  id: z.number(),
  orderItemId: z.number().optional(),    
  itemName: z.string().min(1, "Item name is required"),
  qty: z.number().min(1, "Quantity must be at least 1"),
  reason: z.string().min(1, "Reason is required"),
  type: z.enum(["refund", "exchange", "store-credit"]),
  condition: z.enum(["new", "good", "damaged", "defective"]),
  refundAmount: z.string().min(1, "Refund amount is required"),
})

const returnFormSchema = z.object({
  customerId: z.number(),
  customerName: z.string(),
  orderId: z.number(),
  paymentMethod: z.enum(["cash", "mobile", "card", "bank_transfer", "cheque"]),
  notes: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected", "completed"]),
  items: z.array(returnItemSchema).min(1, "At least one item is required"),
})

type ReturnFormData = z.infer<typeof returnFormSchema>

interface OrderItem {
  id: number
  orderId: number
  catelogId: number
  description: string
  qty: number
  sku: string
  price: number
  total: number
}

interface ReturnItem {
  id: number
   orderItemId?: number
  itemName: string
  qty: number
  reason: string
  type: string
  condition: string
  refundAmount: string
  originalPrice?: number
}

interface ReturnData {
  id: number
  orderId: number
  customerId: number
  customerName: string
  paymentMethod: string
  notes: string
  status: string
  createdAt: string
  updatedAt: string
  customer: {
    id: number
    name: string
    phone: string
    email: string
  }
  items: ReturnItem[]
}

export default function EditReturnPage() {
  const router = useRouter()
  const params = useParams()
  const returnId = params.id as string

  const [returnData, setReturnData] = useState<ReturnData | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showAddItemDialog, setShowAddItemDialog] = useState(false)
  const [loadingOrderItems, setLoadingOrderItems] = useState(false)
  const [selectedOrderItems, setSelectedOrderItems] = useState<number[]>([])

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

  const returnTypes = ["refund", "exchange", "store-credit"] as const

  const conditionOptions = [
    { value: "new", label: "New/Resellable", refundPercentage: 100 },
    { value: "good", label: "Good Condition", refundPercentage: 90 },
    { value: "damaged", label: "Damaged", refundPercentage: 50 },
    { value: "defective", label: "Defective", refundPercentage: 100 },
  ] as const

  const paymentMethods = ["cash", "mobile", "card", "bank_transfer", "cheque"] as const

  const statusOptions = ["pending", "approved", "rejected", "completed"] as const

  // Initialize form
  const form = useForm<ReturnFormData>({
    resolver: zodResolver(returnFormSchema),
    defaultValues: {
      items: [],
    },
  })

  useEffect(() => {
     console.log(form.formState.errors)
  }, [form.formState.errors])

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  // Load return data
  useEffect(() => {
    const loadReturnData = async () => {
      try {
        const response = await fetch(`https://api.alnubras.co/api/v1/returns/${returnId}`)
        if (!response.ok) {
          throw new Error("Failed to load return data")
        }
        const data = await response.json()
        setReturnData(data)

        // Set form values
        form.reset({
          customerId: data.customerId,
          customerName: data.customer.name,
          orderId: data.orderId,
          paymentMethod: data.paymentMethod,
          notes: data.notes || "",
          status: data.status,
          items: data.items.map((item: ReturnItem) => ({
            id: item.id,
            orderItemId: item.orderItemId,  
            itemName: item.itemName,
            qty: item.qty,
            reason: item.reason,
            type: item.type as "refund" | "exchange" | "store-credit",
            condition: item.condition as "new" | "good" | "damaged" | "defective",
            refundAmount: item.refundAmount,
          })),
        })
      } catch (error) {
        console.error("Error loading return:", error)
        toast({
          title: "Error",
          description: "Failed to load return data",
          variant: "destructive",
        })
        router.push("/returns")
      } finally {
        setLoading(false)
      }
    }

    if (returnId) {
      loadReturnData()
    }
  }, [returnId, router, form])

  // Load order items for adding
  const loadOrderItems = async () => {
    if (!returnData) return

    setLoadingOrderItems(true)
    try {
      const response = await fetch(`https://api.alnubras.co/api/v1/sales/${returnData.orderId}/items`)
      if (!response.ok) {
        throw new Error("Failed to load order items")
      }
      const items = await response.json()
      setOrderItems(items)
    } catch (error) {
      console.error("Error loading order items:", error)
      toast({
        title: "Error",
        description: "Failed to load order items",
        variant: "destructive",
      })
    } finally {
      setLoadingOrderItems(false)
    }
  }

  // Handle opening add item dialog
  const handleOpenAddItemDialog = () => {
    setShowAddItemDialog(true)
    loadOrderItems()
  }

  // Add selected items to return
  const addSelectedItems = () => {
    const currentItems = form.getValues("items")
    const currentItemNames = currentItems.map((item) => item.itemName)

    selectedOrderItems.forEach((orderItemId) => {
      const orderItem = orderItems.find((item) => item.id === orderItemId)
      if (orderItem && !currentItemNames.includes(orderItem.description)) {
        append({
          id: 0, // New item, will be assigned by backend
          itemName: orderItem.description,
          qty: 1,
          reason: "Customer Changed Mind",
          type: "refund",
          condition: "new",
          refundAmount: orderItem.price.toString(),
          orderItemId: orderItem.id
        })
      }
    })

    setSelectedOrderItems([])
    setShowAddItemDialog(false)
    toast({
      title: "Success",
      description: `Added ${selectedOrderItems.length} item(s) to return`,
    })
  }

  // Calculate refund amount when quantity or condition changes
  const calculateRefundAmount = (index: number, qty: number, condition: string, originalPrice?: number) => {
    const conditionOption = conditionOptions.find((c) => c.value === condition)
    const refundPercentage = conditionOption?.refundPercentage || 100
    const price =
      originalPrice ||
      Number.parseFloat(form.getValues(`items.${index}.refundAmount`)) / form.getValues(`items.${index}.qty`)
    const refundAmount = (qty * price * refundPercentage) / 100
    form.setValue(`items.${index}.refundAmount`, refundAmount.toString())
  }

  // Calculate totals
  const watchedItems = form.watch("items")
  const totalRefund = watchedItems.reduce((sum, item) => sum + Number.parseFloat(item.refundAmount || "0"), 0)
  const totalQuantity = watchedItems.reduce((sum, item) => sum + (item.qty || 0), 0)

  // Save return
  const onSubmit = async (data: ReturnFormData) => {
    setSaving(true)

    try {
      const updateData = {
        customerId: data.customerId,
        customerName: data.customerName,
        orderId: data.orderId,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        status: data.status,
        items: data.items.map((item) => ({
          id: item.id,
          orderItemId: item.orderItemId,
          itemName: item.itemName,
          qty: item.qty,
          reason: item.reason,
          type: item.type,
          condition: item.condition,
          refundAmount: item.refundAmount,
        })),
      }

      const response = await fetch(`https://api.alnubras.co/api/v1/returns/${returnId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error("Failed to update return")
      }

      const result = await response.json()

      toast({
        title: "Success",
        description: result.message || "Return updated successfully!",
      })

      router.push("/returns")
    } catch (error) {
      console.error("Error updating return:", error)
      toast({
        title: "Error",
        description: "Error updating return. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
      setShowConfirmDialog(false)
    }
  }

  // Get available order items (not already in return)
  const availableOrderItems = orderItems.filter(
    (orderItem) => !watchedItems.some((returnItem) => returnItem.itemName === orderItem.description),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!returnData) {
    return (
      <div className="text-center py-8">
        <p>Return not found</p>
      </div>
    )
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
            <h1 className="text-3xl font-bold tracking-tight">Edit Return #{returnData.id}</h1>
            <p className="text-muted-foreground">Update return details and items</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge
            variant={
              returnData.status === "approved"
                ? "default"
                : returnData.status === "rejected"
                  ? "destructive"
                  : "secondary"
            }
          >
            {returnData.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => setShowConfirmDialog(true))} className="space-y-6">
          {/* Return Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Return Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Customer</p>
                      <p className="font-medium">{returnData.customer.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{returnData.customer.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-medium">#{returnData.orderId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="font-medium">{new Date(returnData.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Refund</p>
                      <p className="font-medium text-green-600">AED {totalRefund.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Items</p>
                      <p className="font-medium">
                        {fields.length} items ({totalQuantity} qty)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="font-medium">{new Date(returnData.updatedAt).toLocaleDateString()}</p>
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
              <CardDescription>Update payment method and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method.replace("_", " ").toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((statusOption) => (
                            <SelectItem key={statusOption} value={statusOption}>
                              {statusOption.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Return Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Add any additional notes about this return..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Return Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Return Items</CardTitle>
                  <CardDescription>Update item details and quantities</CardDescription>
                </div>
                <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" onClick={handleOpenAddItemDialog}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Add Items from Order #{returnData.orderId}</DialogTitle>
                      <DialogDescription>Select items from the original order to add to this return</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {loadingOrderItems ? (
                        <div className="flex items-center justify-center py-8">
                          <RefreshCw className="h-6 w-6 animate-spin" />
                        </div>
                      ) : availableOrderItems.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No additional items available to add
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50px]">Select</TableHead>
                              <TableHead>Item Details</TableHead>
                              <TableHead>SKU</TableHead>
                              <TableHead className="text-center">Available Qty</TableHead>
                              <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {availableOrderItems.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <Checkbox
                                    checked={selectedOrderItems.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedOrderItems([...selectedOrderItems, item.id])
                                      } else {
                                        setSelectedOrderItems(selectedOrderItems.filter((id) => id !== item.id))
                                      }
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <div className="font-medium">{item.description}</div>
                                    <div className="text-sm text-muted-foreground">ID: {item.id}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{item.sku}</Badge>
                                </TableCell>
                                <TableCell className="text-center">{item.qty}</TableCell>
                                <TableCell className="text-right">AED {item.price}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setShowAddItemDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={addSelectedItems} disabled={selectedOrderItems.length === 0}>
                        Add {selectedOrderItems.length} Item(s)
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Details</TableHead>
                    <TableHead className="text-center w-[100px]">Qty</TableHead>
                    <TableHead className="w-[150px]">Reason</TableHead>
                    <TableHead className="w-[120px]">Type</TableHead>
                    <TableHead className="w-[120px]">Condition</TableHead>
                    <TableHead className="text-right w-[120px]">Refund Amount</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`items.${index}.itemName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Item name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <FormField
                          control={form.control}
                          name={`items.${index}.qty`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  {...field}
                                  onChange={(e) => {
                                    const qty = Number.parseInt(e.target.value) || 1
                                    field.onChange(qty)
                                    const condition = form.getValues(`items.${index}.condition`)
                                    calculateRefundAmount(index, qty, condition)
                                  }}
                                  className="w-16 text-center"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`items.${index}.reason`}
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {returnReasons.map((reason) => (
                                    <SelectItem key={reason} value={reason}>
                                      {reason}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`items.${index}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {returnTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`items.${index}.condition`}
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value)
                                  const qty = form.getValues(`items.${index}.qty`)
                                  calculateRefundAmount(index, qty, value)
                                }}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <FormField
                          control={form.control}
                          name={`items.${index}.refundAmount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input type="number" step="0.01" min="0" {...field} className="w-24 text-right" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {fields.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No items in this return. Click "Add Item" to add items from the original order.
                </div>
              )}

              {/* Summary */}
              {fields.length > 0 && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{fields.length}</div>
                      <p className="text-sm text-muted-foreground">Items</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{totalQuantity}</div>
                      <p className="text-sm text-muted-foreground">Total Quantity</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">AED {totalRefund.toFixed(2)}</div>
                      <p className="text-sm text-muted-foreground">Total Refund</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Button type="button" variant="outline" asChild>
              <Link href="/returns">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Link>
            </Button>
            <Button type="submit" disabled={fields.length === 0}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </Form>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to save these changes to the return?</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Return ID:</span>
                  <span className="font-medium">#{returnData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-medium">{returnData.customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span className="font-medium">{fields.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Refund:</span>
                  <span className="font-medium text-green-600">AED {totalRefund.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium">{form.getValues("status")}</span>
                </div>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={form.handleSubmit(onSubmit)} disabled={saving}>
              {saving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
