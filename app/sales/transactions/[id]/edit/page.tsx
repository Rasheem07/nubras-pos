"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ArrowLeft, CreditCard, Banknote, DollarSign } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { transactionApi, salesApi } from "../../api"
import { updateTransactionSchema, type UpdateTransactionForm } from "../../validations"
import type { PaymentDetails } from "../../types"
import { useParams } from "next/navigation"

export default function EditTransactionPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const transactionId = Number.parseInt(params.id as string)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)

  const form = useForm<UpdateTransactionForm>({
    resolver: zodResolver(updateTransactionSchema),
    defaultValues: {
      paymentMethod: "cash",
      amount: "",
    },
  })

  // Fetch transaction details
  const { data: transaction, isLoading: transactionLoading } = useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: () => transactionApi.getById(transactionId),
  })

  // Update transaction mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdateTransactionForm) => transactionApi.update(transactionId, data),
    onSuccess: (data) => {
      toast.success(data.message || "Transaction updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["transaction", transactionId] })
      router.push("/sales/transactions")
    },
    onError: (error) => {
      toast.error("Failed to update transaction", {
        description: error instanceof Error ? error.message : "Please try again",
      })
    },
  })

  // Fetch payment details when transaction is loaded
  useEffect(() => {
    if (transaction) {
      // Set form values
      form.reset({
        paymentMethod: transaction.paymentMethod,
        amount: transaction.amount,
      })

      // Fetch payment details
      salesApi
        .getPaymentDetails(transaction.orderId)
        .then((details) => {
            console.log("fetched paymentDetails:", details);

          setPaymentDetails(details[0])
        })
        .catch((error) => {
          console.error("Error fetching payment details:", error)
          toast.error("Failed to load payment details")
        })
    }
  }, [transaction, form])

  const onSubmit = (data: UpdateTransactionForm) => {
    updateMutation.mutate(data)
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "partial":
        return "bg-yellow-100 text-yellow-800"
      case "no-payment":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Safe number formatting function
  const formatCurrency = (value: string | undefined): string => {
    if (!value) return "AED 0.00"
    const num = Number.parseFloat(value)
    return isNaN(num) ? "AED 0.00" : `AED ${num.toFixed(2)}`
  }

  if (transactionLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-10">Loading transaction details...</div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-10">
          <p className="text-lg font-medium">Transaction not found</p>
          <Link href="/sales/transactions">
            <Button className="mt-4">Back to Transactions</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Link href="/sales/transactions" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Transaction</h1>
          <p className="text-muted-foreground">Update transaction #{transaction.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Info */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Information</CardTitle>
            <CardDescription>Current transaction details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Transaction ID</p>
                  <p className="font-medium">#{transaction.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-medium">#{transaction.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{new Date(transaction.updatedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Amount</p>
                  <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium capitalize">{transaction.paymentMethod.replace("_", " ")}</p>
                </div>
              </div>

              {/* Order Payment Details */}
              {paymentDetails && (
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Order Payment Status</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="font-medium">{formatCurrency(paymentDetails.totalAmount)}</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Amount Paid</p>
                      <p className="font-medium">{formatCurrency(paymentDetails.paidAmount)}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Amount Pending</p>
                      <p className="font-medium">{formatCurrency(paymentDetails.pendingAmount)}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Payment Status</p>
                      <Badge className={getPaymentStatusColor(paymentDetails.orderPaymentStatus)}>
                        {String(paymentDetails.orderPaymentStatus).replace("-", " ")}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Update Transaction</CardTitle>
            <CardDescription>Modify transaction details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
                        <Input type="number" step="0.01" min="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Note: Changing the amount may require manual adjustments to the order.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Updating..." : "Update Transaction"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
