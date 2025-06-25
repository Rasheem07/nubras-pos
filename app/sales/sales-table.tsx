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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect, useState } from "react";
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
import { useDebounce } from "./_hooks/useDebounce";
import { useRouter, useSearchParams } from "next/navigation";

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

// Paginated response type matching your backend
interface PaginatedSalesResponse {
  data: SalesOrder[];
  page: number;
  totalPages: number;
  totalCount: number;
}

export function SalesTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);
  const [transactionOrder, setTransactionOrder] = useState<SalesOrder | null>(
    null
  );
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("search");
  // debounce to avoid spamming the API
  const debouncedSearch = useDebounce(searchTerm, 300);
  const router = useRouter();

  useEffect(() => {
    // Initialize filter from URL parameter if available
    if (initialFilter) {
      setSearchTerm(initialFilter);
    }
    // Reset to page 1 when filter changes
    setCurrentPage(1);
  }, [initialFilter]);

  const { data: salesResponse, isLoading } = useQuery<PaginatedSalesResponse>({
    queryKey: ["salesOrders", currentPage, filter, debouncedSearch],
    queryFn: async () => {
      const url = new URL("https://api.alnubras.co/api/v1/sales");
      url.searchParams.set("page", currentPage.toString());
      url.searchParams.set("filter", filter);
      if (debouncedSearch) {
        url.searchParams.set("search", debouncedSearch);
      }
      const res = await fetch(url.toString(), {credentials: "include"});
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Fetch failed");
      return json;
    },
  });

  const salesOrders = salesResponse?.data || [];
  const totalPages = salesResponse?.totalPages || 1;
  const totalCount = salesResponse?.totalCount || 0;

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

  const isOverdue = (
    dueDate: string,
    status: OrderStatus,
    paymentStatus?: string
  ) => {
    const due = new Date(dueDate);
    const today = new Date();
    return (
      due < today &&
      status !== "completed" &&
      status !== "cancelled" &&
      status !== "draft" &&
      paymentStatus !== "completed"
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
      if (transactionOrder) {
        const pending = Number.parseFloat(transactionOrder.amountPending);
        const entered = Number.parseFloat(data.amount);
        if (entered > pending) {
          toast.error(`Amount cannot exceed pending (${pending.toFixed(2)})`);
          return;
        }
      }

      const response = await fetch(
        "https://api.alnubras.co/api/v1/transactions",
        {
          method: "POST",
           credentials: "include",
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
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () => setCurrentPage(Math.max(1, currentPage - 1));
  const goToNextPage = () =>
    setCurrentPage(Math.min(totalPages, currentPage + 1));
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPage = (page: number) => setCurrentPage(page);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Pagination Placeholder */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Loading...</div>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            <div className="h-8 w-20 bg-muted animate-pulse rounded" />
          </div>
        </div>

        {/* Table Placeholder */}
        <div className="rounded-md border">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            <span className="ml-3 text-muted-foreground">
              Loading sales orders...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            value={searchTerm}
            onChange={(e) => {
              setCurrentPage(1);
              setSearchTerm(e.target.value);
            }}
            placeholder="Search by invoice ID, customer name, or sales person..."
            className="pl-8 w-full md:w-[400px] lg:w-[500px] border-gray-300"
          />
        </div>
        {/* <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filter</span>
        </Button> */}
        <Select
          value={filter}
          onValueChange={(value) => {
            setCurrentPage(1);
            setFilter(value);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        {/* Pagination Controls - Top */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-background border rounded-lg p-3">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * 20 + 1} to{" "}
              {Math.min(currentPage * 20, totalCount)} of {totalCount} orders
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToFirstPage}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center space-x-1">
                {getPageNumbers().map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNum)}
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Table Container with Sticky Header */}
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-auto max-h-[calc(100vh-300px)]">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10 border-b">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="bg-background">Invoice ID</TableHead>
                  <TableHead className="bg-background">Customer</TableHead>
                  <TableHead className="bg-background">Sales Person</TableHead>
                  <TableHead className="bg-background">Status</TableHead>
                  <TableHead className="bg-background">Priority</TableHead>
                  <TableHead className="text-right bg-background">
                    Subtotal
                  </TableHead>
                  <TableHead className="text-right bg-background">
                    Tax
                  </TableHead>
                  <TableHead className="text-right bg-background">
                    Discount
                  </TableHead>
                  <TableHead className="text-right bg-background">
                    Total
                  </TableHead>
                  <TableHead className="text-right bg-background">
                    Pending
                  </TableHead>
                  <TableHead className="bg-background">Payment Terms</TableHead>
                  <TableHead className="bg-background">Due Date</TableHead>
                  <TableHead className="bg-background">Delivery Date</TableHead>
                  <TableHead className="bg-background">Sales Date</TableHead>
                  <TableHead className="text-right bg-background">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow
                      onClick={() => router.push(`/sales/${order.id}`)}
                      key={order.id}
                      className={
                        isOverdue(
                          order.dueDate,
                          order.status,
                          order.paymentStatus
                        )
                          ? "bg-red-50 cursor-pointer hover:bg-gray-50 dark:bg-red-900/20 dark:hover:bg-gray-800"
                          : "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
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
                          {isOverdue(
                            order.dueDate,
                            order.status,
                            order.paymentStatus
                          ) && (
                            <Badge
                              variant="destructive"
                              className="text-xs w-fit"
                            >
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
                          <span className="text-muted-foreground text-sm">
                            Not set
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => e.stopPropagation()}
                            >
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
                                <Banknote className="mr-2 h-4 w-4" /> Record
                                Transaction
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
                                e.preventDefault();
                                setCancelOrderId(order.id);
                              }}
                            >
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={15} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <p>No sales orders found.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Cancel Order Dialog */}
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

        {/* Transaction Recording Dialog */}
        <Dialog
          open={transactionOrder !== null}
          onOpenChange={closeTransactionModal}
        >
          <DialogTrigger asChild>
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
              <input
                type="hidden"
                {...register("orderId", { valueAsNumber: true })}
              />

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
                    {isTransactionSubmitting
                      ? "Recording..."
                      : "Record Payment"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
