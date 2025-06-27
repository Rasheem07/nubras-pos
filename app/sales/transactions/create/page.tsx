"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Search,
  ArrowLeft,
  CreditCard,
  Banknote,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { salesApi, transactionApi } from "../api";
import {
  createTransactionSchema,
  type CreateTransactionForm,
} from "../validations";
import type { Order } from "../types";

export default function CreateTransactionPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const form = useForm<CreateTransactionForm>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      orderId: 0,
      paymentMethod: "cash",
      amount: "",
    },
  });

  // Fetch all orders for search
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: salesApi.getAll,
  });

  // Create transaction mutation
  const createMutation = useMutation({
    mutationFn: transactionApi.create,
    onSuccess: (data) => {
      toast.success(data.message || "Transaction created successfully!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      router.push("/sales/transactions");
    },
    onError: (error) => {
      toast.error("Failed to create transaction", {
        description:
          error instanceof Error ? error.message : "Please try again",
      });
    },
  });

  const filteredOrders = orders.length > 0 && orders.filter(
    (order) =>
      order.id.toString().includes(searchTerm) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectOrder = (order: Order) => {
    setSelectedOrder(order);
    form.setValue("orderId", order.id);
    // Set amount to pending amount by default
    form.setValue("amount", order.amountPending);
  };

  const onSubmit = (data: CreateTransactionForm) => {
    if (!selectedOrder) {
      toast.error("Please select an order first");
      return;
    }

    // Validate amount doesn't exceed pending
    const amount = Number.parseFloat(data.amount);
    const pending = Number.parseFloat(selectedOrder.amountPending);

    if (isNaN(amount) || isNaN(pending)) {
      toast.error("Invalid amount values");
      return;
    }

    if (amount > pending) {
      toast.error(
        `Amount cannot exceed pending amount of AED ${pending.toFixed(2)}`
      );
      return;
    }

    createMutation.mutate(data);
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "no-payment":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Safe number formatting function
  const formatCurrency = (value: string | undefined): string => {
    if (!value) return "AED 0.00";
    const num = Number.parseFloat(value);
    return isNaN(num) ? "AED 0.00" : `AED ${num.toFixed(2)}`;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Link href="/sales/transactions" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create Transaction</h1>
          <p className="text-muted-foreground">
            Record a new payment transaction
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Order</CardTitle>
            <CardDescription>
              Search and select an order to create a transaction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by order ID or customer name..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {ordersLoading ? (
                <div className="text-center py-4">Loading orders...</div>
              ) : filteredOrders.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredOrders.slice(0, 10).map((order) => (
                    <div
                      key={order.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedOrder?.id === order.id
                          ? "bg-primary/10 border-primary"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => selectOrder(order)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            #{order.id} - {order.customerName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Total: {formatCurrency(order.totalAmount)} |
                            Pending: {formatCurrency(order.amountPending)}
                          </p>
                        </div>
                        <Badge
                          className={getPaymentStatusColor(order.paymentStatus)}
                        >
                          {order.paymentStatus.replace("-", " ")}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchTerm ? (
                <div className="text-center py-4 text-muted-foreground">
                  No orders found
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Enter search term to find orders
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Details & Form */}
        <div className="space-y-6">
          {/* Payment Details */}
          {selectedOrder && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  Current payment status for order #{selectedOrder.id}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Total Amount
                    </p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(selectedOrder.totalAmount)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Amount Paid</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(selectedOrder.amountPaid)}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Amount Pending
                    </p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(selectedOrder.amountPending)}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Payment Status
                    </p>
                    <Badge
                      className={getPaymentStatusColor(
                        selectedOrder.paymentStatus
                      )}
                    >
                      {selectedOrder.paymentStatus.replace("-", " ")}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transaction Form */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>Enter payment information</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="visa">
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                Visa/Credit Card
                              </div>
                            </SelectItem>
                            <SelectItem value="bank_transfer">
                              <div className="flex items-center gap-2">
                                <Banknote className="w-4 h-4" />
                                Bank Transfer
                              </div>
                            </SelectItem>
                            <SelectItem value="cash">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Cash
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        {selectedOrder && (
                          <p className="text-xs text-muted-foreground">
                            Maximum:{" "}
                            {formatCurrency(selectedOrder.amountPending)}
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      createMutation.isPending ||
                      !selectedOrder ||
                      selectedOrder.paymentStatus === "completed"
                    }
                  >
                    {createMutation.isPending
                      ? "Creating..."
                      : "Create Transaction"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
