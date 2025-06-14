"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Edit,
  MoreHorizontal,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Calendar,
  User,
  Loader2,
  Printer,
  Share2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

// API functions
const productsApi = {
  getById: async (id: number) => {
    const response = await fetch(`http://localhost:5005/api/v1/products/${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch product details")
    }
    return response.json()
  },
}

// Types
interface CustomModel {
  id: number
  product_id: number
  name: string
  model_charge: string
  created_at: Date
  updated_at: Date
}

interface RecentOrder {
  orderId: number
  orderedAt: Date
  customerId: number
  customerName: string
  qty: number
  unitPrice: string
  itemTotal: string
}

interface TopCustomer {
  customerId: number
  customerName: string
  totalQty: number
  orderCount: number
}

interface Product {
  id: number
  name: string
  sku: string
  barcode: string
  image: string
  category: string
  price: string
  stock?: number
  minQty?: number
  type: "ready-made" | "custom" | "both"
  enabled: boolean
  status: string
  inStock: boolean
  recentOrders: RecentOrder[]
  topCustomers: TopCustomer[]
  models: CustomModel[]
}

export default function ProductViewPage() {
  const params = useParams()
  const productId = Number.parseInt(params.id as string)

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productsApi.getById(productId),
  })

  const getStockStatus = (status: string) => {
    switch (status) {
      case "In stock":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>
      case "Out of stock":
        return <Badge variant="destructive">Out of Stock</Badge>
      case "Available":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Available</Badge>
      case "Unavailable":
        return <Badge variant="destructive">Unavailable</Badge>
      default:
        return <Badge variant="outline">N/A</Badge>
    }
  }

  const getProductTypeLabel = (type: string) => {
    switch (type) {
      case "ready-made":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Ready Made</Badge>
      case "custom":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Custom</Badge>
      case "both":
        return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Ready Made & Custom</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const formatCurrency = (amount: string | number) => {
    return `AED ${amount}`
  }

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat("en-AE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The product you're looking for doesn't exist or couldn't be loaded.
          </p>
          <Button asChild>
            <Link href="/catalog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Catalog
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/catalog">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>SKU: {product.sku}</span>
              <span>•</span>
              <span>Barcode: {product.barcode}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/catalog/${productId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Package className="mr-2 h-4 w-4" />
                View in Inventory
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Sale
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Printer className="mr-2 h-4 w-4" />
                Print Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Share Product
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                {product.enabled ? "Disable Product" : "Enable Product"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Product Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 rounded-lg overflow-hidden bg-muted">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover aspect-square"
                />
              </div>
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                    <p className="font-medium">{product.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Product Type</h3>
                    <div className="mt-1">{getProductTypeLabel(product.type)}</div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Selling Price</h3>
                    <p className="font-medium text-lg">{formatCurrency(product.price)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <div className="mt-1">{getStockStatus(product.status)}</div>
                  </div>
                </div>

                {/* Custom Models - Only show if product type is custom or both */}
                {(product.type === "custom" || product.type === "both") && product.models.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Custom Models</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {product.models.map((model) => (
                          <div key={model.id} className="flex items-center justify-between p-3 border rounded-md">
                            <span className="font-medium">{model.name}</span>
                            <Badge variant="outline">+{formatCurrency(model.model_charge)}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Information */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {product.type === "ready-made" || product.type === "both" ? (
              <>
                <div className="text-center">
                  <div className="text-3xl font-bold">{product.stock || 0}</div>
                  <p className="text-sm text-muted-foreground">Units in Stock</p>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Minimum Quantity:</span>
                    <span className="font-medium">{product.minQty || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <div>{getStockStatus(product.status)}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">In Stock:</span>
                    <span className="font-medium">{product.inStock ? "Yes" : "No"}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-muted-foreground">
                  {product.type === "custom"
                    ? "Custom products don't have stock information"
                    : "No stock information available"}
                </p>
                <div className="mt-4">
                  <Badge variant={product.status === "Available" ? "outline" : "destructive"}>{product.status}</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="customers">Top Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Orders
              </CardTitle>
              <CardDescription>Last 10 orders containing this product</CardDescription>
            </CardHeader>
            <CardContent>
              {product.recentOrders.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2">No recent orders found</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product.recentOrders.map((order) => (
                        <TableRow key={order.orderId}>
                          <TableCell>
                            <Link
                              href={`/sales/${order.orderId}`}
                              className="font-medium text-blue-600 hover:underline"
                            >
                              #{order.orderId}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Link href={`/customers/${order.customerId}`} className="hover:underline">
                              {order.customerName}
                            </Link>
                          </TableCell>
                          <TableCell>{formatDate(order.orderedAt)}</TableCell>
                          <TableCell>{order.qty}</TableCell>
                          <TableCell>{formatCurrency(order.unitPrice)}</TableCell>
                          <TableCell>{formatCurrency(order.itemTotal)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Top Customers
              </CardTitle>
              <CardDescription>Customers who purchase this product most frequently</CardDescription>
            </CardHeader>
            <CardContent>
              {product.topCustomers.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <User className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2">No customer data available</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total Quantity</TableHead>
                        <TableHead>Order Count</TableHead>
                        <TableHead>Avg. per Order</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product.topCustomers.map((customer, index) => (
                        <TableRow key={customer.customerId}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                                {index + 1}
                              </div>
                              <Link href={`/customers/${customer.customerId}`} className="hover:underline">
                                {customer.customerName}
                              </Link>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              {customer.totalQty}
                            </div>
                          </TableCell>
                          <TableCell>{customer.orderCount}</TableCell>
                          <TableCell>{(customer.totalQty / customer.orderCount).toFixed(1)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
