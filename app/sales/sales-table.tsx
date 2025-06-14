"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Printer,
  AlertTriangle,
  Clock,
  Banknote,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type OrderStatus =
  | "draft"
  | "confirmed"
  | "processing"
  | "completed"
  | "cancelled";
type Priority = "low" | "medium" | "high" | "urgent";

// Zod schema for transaction form
const TransactionFormSchema = z.object({
  orderId: z.number(),
  paymentMethod: z.enum(["visa", "bank_transfer", "cash"]),
  amount: z.string().refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Amount must be a positive number" }
  ),
});
type TransactionFormValues = z.infer<typeof TransactionFormSchema>;

interface SalesOrder {
  id: number;
  status: OrderStatus;
  customerId: number;
  customerName: string;
  salesPersonId: number;
  salesPersonName: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  priority: Priority;
  paymentTerms: string;
  dueDate: string;
  deliveryDate?: string;
  completedDate?: string;
  notes?: string;
  amountPaid: string;
  amountPending: string;
  createdAt: string;
}

interface SalesTableProps {
  filter?: string;
}

export function SalesTable({ filter }: SalesTableProps) {
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);
  const [transactionOrder, setTransactionOrder] = useState<SalesOrder | null>(
    null
  );

  const { data: salesOrders = [], isLoading } = useQuery<SalesOrder[]>({
    queryKey: ["salesOrders"],
    queryFn: async () => {
      const response = await fetch("http://localhost:5005/api/v1/sales");
      const json = await response.json();
      if (!response.ok) {
        toast.error("Failed to fetch sales orders!");
      }
      return json;
    },
  });
  const getFilteredOrders = () => {
    if (!filter || filter === "all") return salesOrders;

    if (filter === "overdue") {
      const today = new Date();
      return salesOrders.filter((order) => {
        const dueDate = new Date(order.dueDate);
        return (
          dueDate < today &&
          order.status !== "completed" &&
          order.status !== "cancelled"
        );
      });
    }

    return salesOrders.filter((order) => order.status === filter);
  };

  const filteredOrders = getFilteredOrders();

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "confirmed":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Confirmed
          </Badge>
        );
      case "processing":
        return <Badge variant="secondary">Processing</Badge>;
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        );
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case "low":
        return (
          <Badge variant="outline" className="text-xs">
            Low
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="secondary" className="text-xs">
            Medium
          </Badge>
        );
      case "high":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 text-xs">
            High
          </Badge>
        );
      case "urgent":
        return (
          <Badge variant="destructive" className="text-xs">
            Urgent
          </Badge>
        );
      default:
        return null;
    }
  };

  const isOverdue = (dueDate: string, status: OrderStatus) => {
    const due = new Date(dueDate);
    const today = new Date();
    return (
      due < today &&
      status !== "completed" &&
      status !== "cancelled" &&
      status !== "draft"
    );
  };

  const isDueSoon = (dueDate: string, status: OrderStatus) => {
    const due = new Date(dueDate);
    const today = new Date();
    const threeDaysFromNow = new Date(
      today.getTime() + 3 * 24 * 60 * 60 * 1000
    );
    return (
      due <= threeDaysFromNow &&
      due >= today &&
      status !== "completed" &&
      status !== "cancelled"
    );
  };

  const {
    register,
    handleSubmit,
    reset: resetTransactionForm,
    formState: { errors, isSubmitting: isTransactionSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(TransactionFormSchema),
    defaultValues: {
      orderId: 0,
      paymentMethod: "cash",
      amount: "",
    },
  });

  const openTransactionModal = (order: SalesOrder) => {
    setTransactionOrder(order);
    // Pre-fill orderId
    resetTransactionForm({
      orderId: order.id,
      paymentMethod: "cash",
      amount: "",
    });
  };

  const closeTransactionModal = () => {
    setTransactionOrder(null);
    resetTransactionForm({ orderId: 0, paymentMethod: "cash", amount: "" });
  };

  const onTransactionSubmit = async (data: TransactionFormValues) => {
    try {
      // Optional: validate amount does not exceed pendingAmount
      if (transactionOrder) {
        const pending = parseFloat(transactionOrder.amountPending);
        const entered = parseFloat(data.amount);
        if (entered > pending) {
          toast.error(`Amount cannot exceed pending (${pending.toFixed(2)})`);
          return;
        }
      }

      const response = await fetch(
        "http://localhost:5005/api/v1/transactions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to record transaction");
      }
      toast.success("Transaction recorded successfully");
      closeTransactionModal();
      // Optionally, refetch sales orders to update pending/paid columns
    } catch (err: any) {
      toast.error(err.message);
    }
  };

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
            <TableHead className="text-right">Pending</TableHead>
            <TableHead>Payment Terms</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Delivery Date</TableHead>
            <TableHead>Sales Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow
              key={order.id}
              className={
                isOverdue(order.dueDate, order.status) ? "bg-red-50" : ""
              }
            >
              <TableCell className="font-medium">
                INV-{String(order.id).padStart(3, "0")}
              </TableCell>
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
              <TableCell className="text-right">
                AED {order.subtotal.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                AED {order.taxAmount.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                {order.discountAmount > 0 ? (
                  <span className="text-red-600">
                    -AED {order.discountAmount.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-right font-bold">
                AED {order.totalAmount.toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-bold">
                AED {order.amountPending.toLocaleString()}
              </TableCell>
              <TableCell>{order.paymentTerms}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="text-sm">
                    {new Date(order.dueDate).toLocaleDateString()}
                  </span>
                  {isOverdue(order.dueDate, order.status) && (
                    <Badge variant="destructive" className="text-xs w-fit">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Overdue
                    </Badge>
                  )}
                  {isDueSoon(order.dueDate, order.status) && (
                    <Badge
                      variant="outline"
                      className="text-xs w-fit border-orange-300 text-orange-600"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Due Soon
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {order.deliveryDate ? (
                  <span className="text-sm">
                    {new Date(order.deliveryDate).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="text-muted-foreground text-sm">Not set</span>
                )}
              </TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
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
                      <Link href={`/sales/${order.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/sales/${order.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Order
                      </Link>
                    </DropdownMenuItem>
                    {order.paymentStatus !== "completed" && (
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          openTransactionModal(order);
                        }}
                      >
                        <Banknote className="mr-2 h-4 w-4" /> Record Transaction
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href={`/sales/${order.id}?mode=print`}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Invoice
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onSelect={(e) => {
                        e.preventDefault(); // prevent navigating or closing unexpectedly
                        setCancelOrderId(order.id); // open the dialog
                      }}
                    >
                      Cancel Order
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={cancelOrderId !== null}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Cancel Order INV-{String(cancelOrderId).padStart(3, "0")}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action is
              irreversible and will update the order and its related items as
              canceled.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <div className="flex gap-6 w-full">
              <DialogClose
                className="w-full max-w-[50%]"
                asChild
                onClick={() => setCancelOrderId(null)}
              >
                <Button>Cancel</Button>
              </DialogClose>
              <Button className="flex-1 w-full bg-destructive hover:bg-destructive/90">
                Confirm
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={transactionOrder !== null}
        onOpenChange={closeTransactionModal}
      >
        <DialogTrigger asChild>
          {/* Optional: a hidden trigger since we open via state */}
          <span />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Record Transaction for INV-
              {transactionOrder?.id.toString().padStart(3, "0")}
            </DialogTitle>
            <DialogDescription>
              Enter the payment details below. Remaining: AED{" "}
              {transactionOrder?.amountPending}.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onTransactionSubmit)}
            className="space-y-4 pt-2"
          >
            {/* Hidden orderId */}
            <input
              type="hidden"
              {...register("orderId", { valueAsNumber: true })}
            />

            {/* Reference Amounts */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Total Amount</Label>
              <p className="text-sm">AED {transactionOrder?.totalAmount}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Paid So Far</Label>
              <p className="text-sm">AED {transactionOrder?.amountPaid}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Amount Pending</Label>
              <p className="text-sm">AED {transactionOrder?.amountPending}</p>
            </div>

            {/* Payment Method */}
            <div className="space-y-1">
              <Label htmlFor="paymentMethod" className="text-xs font-medium">
                Payment Method
              </Label>
              <Select defaultValue="cash" {...register("paymentMethod")}>
                <SelectTrigger id="paymentMethod" className="h-8 text-xs">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
              {errors.paymentMethod && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-1">
              <Label htmlFor="amount" className="text-xs font-medium">
                Amount (AED)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("amount")}
                className="h-8 text-xs"
              />
              {errors.amount && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <DialogFooter className="pt-2">
              <div className="flex gap-4 w-full">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-8 text-xs"
                    onClick={closeTransactionModal}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="w-full h-8 text-xs"
                  disabled={isTransactionSubmitting}
                >
                  {isTransactionSubmitting ? "Recording..." : "Record Payment"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
