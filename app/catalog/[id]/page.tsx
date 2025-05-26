"use client"
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
import { ArrowLeft, Edit, MoreHorizontal, Package, ShoppingCart, Users, TrendingUp, Calendar, User } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock data matching your service's findOne response
const mockProductData = {
  id: 1,
  name: "Kandura (Premium)",
  sku: "KAN-PREM-001",
  barcode: "5901234123457",
  image: "/placeholder.svg?key=ng1v2",
  category: "Kandura",
  price: "450.00",
  stock: 25,
  minQty: 10,
  inStock: true,
  recentOrders: [
    {
      orderId: 1001,
      orderedAt: new Date("2024-01-20"),
      customerId: 1,
      customerName: "Ahmed Al Mansouri",
      qty: 2,
      unitPrice: "450.00",
      itemTotal: "900.00",
    },
    {
      orderId: 1002,
      orderedAt: new Date("2024-01-18"),
      customerId: 2,
      customerName: "Mohammed Al Zaabi",
      qty: 1,
      unitPrice: "450.00",
      itemTotal: "450.00",
    },
    {
      orderId: 1003,
      orderedAt: new Date("2024-01-15"),
      customerId: 3,
      customerName: "Khalid Al Nuaimi",
      qty: 3,
      unitPrice: "450.00",
      itemTotal: "1350.00",
    },
  ],
  topCustomers: [
    {
      customerId: 1,
      customerName: "Ahmed Al Mansouri",
      totalQty: 8,
      orderCount: 4,
    },
    {
      customerId: 2,
      customerName: "Mohammed Al Zaabi",
      totalQty: 5,
      orderCount: 3,
    },
    {
      customerId: 3,
      customerName: "Khalid Al Nuaimi",
      totalQty: 4,
      orderCount: 2,
    },
  ],
}

export default function ProductViewPage() {
  const params = useParams()
  const productId = params.id as string
  const product = mockProductData // In real app, fetch using productId

  const getStockStatus = () => {
    if (!product.stock || product.stock <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    }
    if (product.stock <= product.minQty) {
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
          Low Stock
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
        In Stock
      </Badge>
    )
  }

  const formatCurrency = (amount: string | number) => {
    return `AED ${Number.parseFloat(amount.toString()).toFixed(2)}`
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-AE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/catalog">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to catalog</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-muted-foreground">SKU: {product.sku}</p>
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
                <span className="sr-only">More actions</span>
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
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Disable Product</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Product Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                    <p className="font-medium">{product.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Barcode</h3>
                    <p className="font-medium font-mono">{product.barcode}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Selling Price</h3>
                    <p className="font-medium text-lg">{formatCurrency(product.price)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Stock Status</h3>
                    <div className="mt-1">{getStockStatus()}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{product.stock || 0}</div>
              <p className="text-sm text-muted-foreground">Units in Stock</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Min. Quantity:</span>
                <p className="font-medium">{product.minQty}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Available:</span>
                <p className="font-medium">{product.inStock ? "Yes" : "No"}</p>
              </div>
            </div>
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
