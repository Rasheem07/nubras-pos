"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Notebook, Info } from "lucide-react"
import Link from "next/link"
import { transactionApi } from "./api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleCount, setVisibleCount] = useState(10)

  const {
    data: transactions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: transactionApi.getAll,
  })

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.id.toString().includes(searchTerm) ||
      transaction.orderId.toString().includes(searchTerm) ||
      transaction.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const visibleTransactions = filteredTransactions.slice(0, visibleCount)

  const loadMore = () => {
    setVisibleCount((prev) => prev + 10)
  }

  const getPaymentMethodBadge = (method: string) => {
    const variants = {
      visa: "bg-blue-100 text-blue-800",
      bank_transfer: "bg-green-100 text-green-800",
      cash: "bg-yellow-100 text-yellow-800",
    }

    return (
      <Badge className={variants[method as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
        {method === "bank_transfer" ? "Bank Transfer" : method.charAt(0).toUpperCase() + method.slice(1)}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-10">Loading transactions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-10 text-red-600">Error loading transactions: {error.message}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">Manage payment transactions</p>
        </div>
      </div>

      <Alert className="my-6 bg-yellow-50 border-yellow-200 ">
        <div className="flex items-center gap-4">
          <Info className="w-10 h-10 text-yellow-600" />
          <div>
            <AlertTitle>Go to <Link href="/sales" className="font-bold text-blue-600 underline underline-offset-4">Sales page</Link> to create new transaction</AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground mt-2">
              You can view and manage sales orders and transactions from the Sales page.
            </AlertDescription>
          </div>
        </div>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Transaction List</CardTitle>
          <CardDescription>View and manage all payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleTransactions.length > 0 ? (
                  visibleTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">#{transaction.id}</TableCell>
                      <TableCell>#{transaction.orderId}</TableCell>
                      <TableCell>{getPaymentMethodBadge(transaction.paymentMethod)}</TableCell>
                      <TableCell className="font-medium">AED {Number.parseFloat(transaction.amount).toFixed(2)}</TableCell>
                      <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Link href={`/sales/transactions/${transaction.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {filteredTransactions.length > visibleCount && (
            <div className="flex justify-center mt-6">
              <Button onClick={loadMore} variant="outline">
                Load More ({filteredTransactions.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
