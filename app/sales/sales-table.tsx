"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Printer, AlertTriangle, Clock } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"

type OrderStatus = "draft" | "confirmed" | "processing" | "completed" | "cancelled"
type Priority = "low" | "medium" | "high" | "urgent"

interface SalesOrder {
  id: number
  invId: string
  status: OrderStatus
  customerName: string
  salesPersonName: string
  subtotal: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  priority: Priority
  paymentTerms: string
  dueDate: string
  deliveryDate?: string
  completedDate?: string
  notes?: string
  createdAt: string
}

const salesOrders: SalesOrder[] = [
  {
    id: 1,
    invId: "INV-2024-001",
    status: "processing",
    customerName: "Fatima Mohammed",
    salesPersonName: "Ahmed Al Mansouri",
    subtotal: 1050.0,
    taxAmount: 52.5,
    discountAmount: 100.0,
    totalAmount: 1002.5,
    priority: "high",
    paymentTerms: "net 15",
    dueDate: "2024-05-20",
    deliveryDate: "2024-05-18",
    createdAt: "2024-05-04",
    notes: "Custom kandura with rush delivery",
  },
  {
    id: 2,
    invId: "INV-2024-002",
    status: "confirmed",
    customerName: "Ahmed Al Suwaidi",
    salesPersonName: "Sara Al Ameri",
    subtotal: 750.0,
    taxAmount: 37.5,
    discountAmount: 0,
    totalAmount: 787.5,
    priority: "medium",
    paymentTerms: "net 30",
    dueDate: "2024-05-25",
    deliveryDate: "2024-05-22",
    createdAt: "2024-05-03",
  },
  {
    id: 3,
    invId: "INV-2024-003",
    status: "draft",
    customerName: "Layla Khan",
    salesPersonName: "Omar Al Hashimi",
    subtotal: 450.0,
    taxAmount: 22.5,
    discountAmount: 50.0,
    totalAmount: 422.5,
    priority: "low",
    paymentTerms: "net 30",
    dueDate: "2024-05-30",
    createdAt: "2024-05-04",
  },
  {
    id: 4,
    invId: "INV-2024-004",
    status: "completed",
    customerName: "Hassan Al Farsi",
    salesPersonName: "Mariam Al Zahra",
    subtotal: 2200.0,
    taxAmount: 110.0,
    discountAmount: 200.0,
    totalAmount: 2110.0,
    priority: "medium",
    paymentTerms: "net 15",
    dueDate: "2024-05-15",
    deliveryDate: "2024-05-12",
    completedDate: "2024-05-12",
    createdAt: "2024-04-28",
  },
  {
    id: 5,
    invId: "INV-2024-005",
    status: "processing",
    customerName: "Zayed Al Nahyan",
    salesPersonName: "Ahmed Al Mansouri",
    subtotal: 3500.0,
    taxAmount: 175.0,
    discountAmount: 350.0,
    totalAmount: 3325.0,
    priority: "urgent",
    paymentTerms: "net 7",
    dueDate: "2024-05-10", // Overdue
    deliveryDate: "2024-05-15",
    createdAt: "2024-04-25",
  },
]

interface SalesTableProps {
  filter?: string
}

export function SalesTable({ filter }: SalesTableProps) {
  const getFilteredOrders = () => {
    if (!filter || filter === "all") return salesOrders

    if (filter === "overdue") {
      const today = new Date()
      return salesOrders.filter((order) => {
        const dueDate = new Date(order.dueDate)
        return dueDate < today && order.status !== "completed" && order.status !== "cancelled"
      })
    }

    return salesOrders.filter((order) => order.status === filter)
  }

  const filteredOrders = getFilteredOrders()

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "confirmed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Confirmed</Badge>
      case "processing":
        return <Badge variant="secondary">Processing</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case "low":
        return (
          <Badge variant="outline" className="text-xs">
            Low
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="secondary" className="text-xs">
            Medium
          </Badge>
        )
      case "high":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 text-xs">High</Badge>
      case "urgent":
        return (
          <Badge variant="destructive" className="text-xs">
            Urgent
          </Badge>
        )
      default:
        return null
    }
  }

  const isOverdue = (dueDate: string, status: OrderStatus) => {
    const due = new Date(dueDate)
    const today = new Date()
    return due < today && status !== "completed" && status !== "cancelled" && status !== "draft"
  }

  const isDueSoon = (dueDate: string, status: OrderStatus) => {
    const due = new Date(dueDate)
    const today = new Date()
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)
    return due <= threeDaysFromNow && due >= today && status !== "completed" && status !== "cancelled"
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Sales Person</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Subtotal</TableHead>
            <TableHead className="text-right">Tax</TableHead>
            <TableHead className="text-right">Discount</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Payment Terms</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Delivery Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id} className={isOverdue(order.dueDate, order.status) ? "bg-red-50" : ""}>
              <TableCell className="font-medium">{order.invId}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {order.customerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>{order.customerName}</span>
                </div>
              </TableCell>
              <TableCell>{order.salesPersonName}</TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell>{getPriorityBadge(order.priority)}</TableCell>
              <TableCell className="text-right">AED {order.subtotal.toLocaleString()}</TableCell>
              <TableCell className="text-right">AED {order.taxAmount.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                {order.discountAmount > 0 ? (
                  <span className="text-red-600">-AED {order.discountAmount.toLocaleString()}</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-right font-bold">AED {order.totalAmount.toLocaleString()}</TableCell>
              <TableCell>{order.paymentTerms}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="text-sm">{new Date(order.dueDate).toLocaleDateString()}</span>
                  {isOverdue(order.dueDate, order.status) && (
                    <Badge variant="destructive" className="text-xs w-fit">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Overdue
                    </Badge>
                  )}
                  {isDueSoon(order.dueDate, order.status) && (
                    <Badge variant="outline" className="text-xs w-fit border-orange-300 text-orange-600">
                      <Clock className="w-3 h-3 mr-1" />
                      Due Soon
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {order.deliveryDate ? (
                  <span className="text-sm">{new Date(order.deliveryDate).toLocaleDateString()}</span>
                ) : (
                  <span className="text-muted-foreground text-sm">Not set</span>
                )}
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
                      <Link href={`/sales/${order.invId}?mode=view`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/sales/${order.invId}?mode=edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Order
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Printer className="mr-2 h-4 w-4" />
                      Print Invoice
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Cancel Order</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
