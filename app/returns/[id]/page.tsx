"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  MoreHorizontal,
  RefreshCw,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Package,
  CreditCard,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  Download,
} from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface Customer {
  id: number
  name: string
  phone: string
  email: string
  status: string
  created_at?: string
  updated_at?: string
}

interface ReturnItem {
  id: number
  return_id: number
  item_name: string
  qty: number
  reason: string
  type: string
  condition: string
  originalTotal: string
  refundAmount: string // Note: matches your schema typo
  createdAt: string
  updatedAt?: string
}


interface ReturnDetails {
  id: number
  orderId: number
  customerId: number
  paymentMethod: string
  status: string
  notes: string
  totalRefundAmount: string
  returnItemsOriginalValue: string;
  createdAt: string
  updatedAt: string
  customer: Customer
  items: ReturnItem[]
}

export default function ReturnDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const returnId = params.id as string

  const [returnData, setReturnData] = useState<ReturnDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejecting, setRejecting] = useState(false)

  // Load return data
  useEffect(() => {
    const loadReturnData = async () => {
      try {
        const response = await fetch(`http://localhost:5005/api/v1/returns/${returnId}`, { credentials: "include"})
        if (!response.ok) {
          throw new Error("Failed to load return data")
        }
        const data = await response.json()
        setReturnData(data)
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
  }, [returnId, router])

  // Reject return
  const rejectReturn = async () => {
    if (!returnData) return

    setRejecting(true)

    try {
      const response = await fetch(`http://localhost:5005/api/v1/returns/${returnData.id}/reject`, {
        method: "PATCH",
         credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to reject return")
      }

      const message = await response.text()

      toast({
        title: "Success",
        description: message,
      })

      // Update local state
      setReturnData({ ...returnData, status: "rejected" })
    } catch (error) {
      console.error("Error rejecting return:", error)
      toast({
        title: "Error",
        description: "Failed to reject return",
        variant: "destructive",
      })
    } finally {
      setRejecting(false)
      setShowRejectDialog(false)
    }
  }

  // Calculate totals
  const totalRefund = returnData?.items.reduce((sum, item) => sum + Number.parseFloat(item.refundAmount), 0) || 0
  const totalQuantity = returnData?.items.reduce((sum, item) => sum + item.qty, 0) || 0

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        )
      case "pending":
      default:
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    return method.replace("_", " ").toUpperCase()
  }

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case "new":
        return <Badge variant="default">New</Badge>
      case "good":
        return <Badge variant="secondary">Good</Badge>
      case "damaged":
        return <Badge variant="destructive">Damaged</Badge>
      case "defective":
        return <Badge variant="destructive">Defective</Badge>
      default:
        return <Badge variant="outline">{condition}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "refund":
        return <Badge variant="default">Refund</Badge>
      case "exchange":
        return <Badge variant="secondary">Exchange</Badge>
      case "store-credit":
        return <Badge variant="outline">Store Credit</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin" />
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
            <h1 className="text-3xl font-bold tracking-tight">Return #{returnData.id}</h1>
            <p className="text-muted-foreground">
              Created on {new Date(returnData.createdAt).toLocaleDateString()} •{" "}
              {new Date(returnData.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(returnData.status)}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/returns/${returnData.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Return
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Printer className="mr-2 h-4 w-4" />
                Print Return
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </DropdownMenuItem>
              {returnData.status === "pending" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowRejectDialog(true)} className="text-red-600">
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Return
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{returnData.items.length}</div>
            <p className="text-xs text-muted-foreground">{totalQuantity} total quantity</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oringal value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">AED {returnData.returnItemsOriginalValue}</div>
            <p className="text-xs text-muted-foreground">Returned items value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refund Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">AED {totalRefund.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total refund value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Order Reference</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{returnData.orderId}</div>
            <p className="text-xs text-muted-foreground">Original order</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Method</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getPaymentMethodLabel(returnData.paymentMethod)}</div>
            <p className="text-xs text-muted-foreground">Refund method</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Customer Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Customer Name</div>
                  <div className="text-lg font-semibold">{returnData.customer.name}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Phone Number</div>
                    <div className="font-medium">{returnData.customer.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Email Address</div>
                    <div className="font-medium">{returnData.customer.email}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Customer ID</div>
                  <div className="text-lg font-semibold">#{returnData.customer.id}</div>
                </div>
                <Badge>{returnData.customer.status}</Badge>
                {returnData.customer.created_at && (
                  <div>
                    <div className="text-sm text-muted-foreground">Customer Since</div>
                    <div className="font-medium">{new Date(returnData.customer.created_at).toLocaleDateString()}</div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Return Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Return Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Return Created</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(returnData.createdAt).toLocaleDateString()} at{" "}
                    {new Date(returnData.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              {returnData.updatedAt !== returnData.createdAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium">Last Updated</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(returnData.updatedAt).toLocaleDateString()} at{" "}
                      {new Date(returnData.updatedAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    returnData.status === "approved"
                      ? "bg-green-500"
                      : returnData.status === "rejected"
                        ? "bg-red-500"
                        : returnData.status === "completed"
                          ? "bg-blue-500"
                          : "bg-gray-400"
                  }`}
                ></div>
                <div>
                  <div className="font-medium">Current Status</div>
                  <div className="text-sm text-muted-foreground">{returnData.status.toUpperCase()}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Return Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Return Items
          </CardTitle>
          <CardDescription>Items included in this return request</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead className="text-right">Original Value</TableHead>
                <TableHead className="text-right">Refund Amount</TableHead>
                <TableHead className="text-center">Date Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {returnData.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{item.item_name}</div>
                      <div className="text-sm text-muted-foreground">Item ID: {item.id}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{item.qty}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{item.reason}</div>
                  </TableCell>
                  <TableCell>{getTypeBadge(item.type)}</TableCell>
                  <TableCell>{getConditionBadge(item.condition)}</TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium text-green-600">
                      AED {Number.parseFloat(item.originalTotal).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium text-green-600">
                      AED {Number.parseFloat(item.refundAmount).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="text-sm text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Items Summary */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{returnData.items.length}</div>
                <p className="text-sm text-muted-foreground">Total Items</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalQuantity}</div>
                <p className="text-sm text-muted-foreground">Total Quantity</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">AED {totalRefund.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground">Total Refund</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      {returnData.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Additional Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm leading-relaxed">{returnData.notes}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/returns">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Returns
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button asChild>
            <Link href={`/returns/${returnData.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Return
            </Link>
          </Button>
        </div>
      </div>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Return</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this return? This action will change the status to "rejected" and cannot
              be undone.
            </AlertDialogDescription>
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
                  <span>Total Refund Amount:</span>
                  <span className="font-medium text-green-600">AED {returnData.totalRefundAmount}</span>
                </div>
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={rejecting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={rejectReturn} disabled={rejecting} className="bg-red-600 hover:bg-red-700">
              {rejecting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Return
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
