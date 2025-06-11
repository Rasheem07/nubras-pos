"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  ShoppingBag,
  Users,
  CreditCard,
  Crown,
  FileText,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useCustomer } from "../use-customers"
import { useParams } from "next/navigation"

export default function CustomerViewPage() {
  const params = useParams() as {id: string}
  const { data: customer, isLoading, error } = useCustomer(Number.parseInt(params.id))

  // Function to render status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "platinum":
      case "gold":
      case "diamond":
        const tierColors = {
          diamond: "bg-purple-100 text-purple-800 border-purple-200",
          platinum: "bg-gray-100 text-gray-800 border-gray-200",
          gold: "bg-amber-100 text-amber-800 border-amber-200",
        }
        return (
          <Badge className={tierColors[status as keyof typeof tierColors] || "bg-amber-100 text-amber-800"}>
            <Crown className="mr-1 h-3 w-3" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
      case "new":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">New</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Analytics cards data
  const analytics = customer
    ? [
        {
          title: "Total Spent",
          value: `AED ${customer.totalSpent.toLocaleString()}`,
          icon: CreditCard,
          color: "text-green-600",
        },
        {
          title: "Total Orders",
          value: customer.totalOrders.toString(),
          icon: ShoppingBag,
          color: "text-blue-600",
        },
        {
          title: "Average Order",
          value: `AED ${customer.averageOrderValue}`,
          icon: TrendingUp,
          color: "text-purple-600",
        },
        {
          title: "Group Members",
          value: customer.groupMembersCount.toString(),
          icon: Users,
          color: "text-amber-600",
        },
      ]
    : []

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link href="/customers">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Customer Profile</h1>
            <p className="text-muted-foreground">Loading customer information...</p>
          </div>
        </div>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link href="/customers">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Customer Profile</h1>
            <p className="text-muted-foreground">Error loading customer information</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500">Error loading customer data. Please try again later.</p>
            <Button className="mt-4" asChild>
              <Link href="/customers">Return to Customers</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/customers">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Customer Profile</h1>
          <p className="text-muted-foreground">Complete customer information and analytics</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/invoices/new?customer=${customer.id}`}>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </Link>
          <Link href={`/customers/${customer.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Customer
            </Button>
          </Link>
        </div>
      </div>

      {/* Customer Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-lg">
                {customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl">{customer.name}</CardTitle>
                {getStatusBadge(customer.status)}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {customer.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {customer.email || "No email"}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Group: {customer.groupCode}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Since {customer.joinedYear}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analytics.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
          <TabsTrigger value="group">Group</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Customer ID</label>
                    <p className="font-mono">CUST-{customer.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Group ID</label>
                    <p className="font-mono">{customer.groupCode}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="flex gap-2">{getStatusBadge(customer.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Join Year</label>
                    <p>{customer.joinedYear}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Preferences</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {customer.preferences && customer.preferences.length > 0 ? (
                      customer.preferences.map((pref, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {pref}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No preferences set</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customer.orderHistory && customer.orderHistory.length > 0 ? (
                    customer.orderHistory.slice(0, 3).map((order) => (
                      <div key={order.orderId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">ORD-{order.orderId}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.itemCount} items • {new Date(order.orderDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">AED {order.totalAmount}</p>
                          <Badge variant="outline" className="text-xs">
                            {order.orderStatus}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No orders found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {customer.orderHistory && customer.orderHistory.length > 0 ? (
                <div className="space-y-3">
                  {customer.orderHistory.map((order) => (
                    <div key={order.orderId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">ORD-{order.orderId}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.itemCount} items • {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">AED {order.totalAmount}</p>
                        <Badge variant="outline" className="text-xs">
                          {order.orderStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No orders found for this customer</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="measurements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Body Measurements</CardTitle>
            </CardHeader>
            <CardContent>
              {customer.measurement ? (
                <Tabs defaultValue="arabic">
                  <TabsList className="mb-4">
                    <TabsTrigger value="arabic">Arabic Style</TabsTrigger>
                    <TabsTrigger value="kuwaiti">Kuwaiti Style</TabsTrigger>
                  </TabsList>

                  <TabsContent value="arabic">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 border rounded-lg text-center">
                        <p className="text-sm font-medium text-muted-foreground">Front Length</p>
                        <p className="text-sm font-medium text-muted-foreground font-arabic">الطول أمام</p>
                        <p className="text-lg font-bold">{customer.measurement.arabic?.frontLength || "N/A"}</p>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <p className="text-sm font-medium text-muted-foreground">Back Length</p>
                        <p className="text-sm font-medium text-muted-foreground font-arabic">الطول خلف</p>
                        <p className="text-lg font-bold">{customer.measurement.arabic?.backLength || "N/A"}</p>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <p className="text-sm font-medium text-muted-foreground">Shoulder</p>
                        <p className="text-sm font-medium text-muted-foreground font-arabic">الكتف</p>
                        <p className="text-lg font-bold">{customer.measurement.arabic?.shoulder || "N/A"}</p>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <p className="text-sm font-medium text-muted-foreground">Sleeves</p>
                        <p className="text-sm font-medium text-muted-foreground font-arabic">الأيدي</p>
                        <p className="text-lg font-bold">{customer.measurement.arabic?.sleeves || "N/A"}</p>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <p className="text-sm font-medium text-muted-foreground">Neck</p>
                        <p className="text-sm font-medium text-muted-foreground font-arabic">الرقبة</p>
                        <p className="text-lg font-bold">{customer.measurement.arabic?.neck || "N/A"}</p>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <p className="text-sm font-medium text-muted-foreground">Waist</p>
                        <p className="text-sm font-medium text-muted-foreground font-arabic">الوسط</p>
                        <p className="text-lg font-bold">{customer.measurement.arabic?.waist || "N/A"}</p>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <p className="text-sm font-medium text-muted-foreground">Chest</p>
                        <p className="text-sm font-medium text-muted-foreground font-arabic">الصدر</p>
                        <p className="text-lg font-bold">{customer.measurement.arabic?.chest || "N/A"}</p>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <p className="text-sm font-medium text-muted-foreground">Width End</p>
                        <p className="text-sm font-medium text-muted-foreground font-arabic">نهاية العرض</p>
                        <p className="text-lg font-bold">{customer.measurement.arabic?.widthEnd || "N/A"}</p>
                      </div>
                    </div>
                    {customer.measurement.arabic?.notes && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                        <p className="text-sm">{customer.measurement.arabic.notes}</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="kuwaiti">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 border rounded-lg text-center">
                        <p className="text-sm font-medium text-muted-foreground">Front Length</p>
                        <p className="text-sm font-medium text-muted-foreground font-arabic">الطول أمام</p>
                        <p className="text-lg font-bold">{customer.measurement.kuwaiti?.frontLength || "N/A"}</p>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <p className="text-sm font-medium text-muted-foreground">Back Length</p>
                        <p className="text-sm font-medium text-muted-foreground font-arabic">الطول خلف</p>
                        <p className="text-lg font-bold">{customer.measurement.kuwaiti?.backLength || "N/A"}</p>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <p className="text-sm font-medium text-muted-foreground">Shoulder</p>
                        <p className="text-sm font-medium text-muted-foreground font-arabic">الكتف</p>
                        <p className="text-lg font-bold">{customer.measurement.kuwaiti?.shoulder || "N/A"}</p>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <p className="text-sm font-medium text-muted-foreground">Sleeves</p>
                        <p className="text-sm font-medium text-muted-foreground font-arabic">الأيدي</p>
                        <p className="text-lg font-bold">{customer.measurement.kuwaiti?.sleeves || "N/A"}</p>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <p className="text-sm font-medium text-muted-foreground">Neck</p>
                        <p className="text-sm font-medium text-muted-foreground font-arabic">الرقبة</p>
                        <p className="text-lg font-bold">{customer.measurement.kuwaiti?.neck || "N/A"}</p>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <p className="text-sm font-medium text-muted-foreground">Waist</p>
                        <p className="text-sm font-medium text-muted-foreground font-arabic">الوسط</p>
                        <p className="text-lg font-bold">{customer.measurement.kuwaiti?.waist || "N/A"}</p>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <p className="text-sm font-medium text-muted-foreground">Chest</p>
                        <p className="text-sm font-medium text-muted-foreground font-arabic">الصدر</p>
                        <p className="text-lg font-bold">{customer.measurement.kuwaiti?.chest || "N/A"}</p>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <p className="text-sm font-medium text-muted-foreground">Width End</p>
                        <p className="text-sm font-medium text-muted-foreground font-arabic">نهاية العرض</p>
                        <p className="text-lg font-bold">{customer.measurement.kuwaiti?.widthEnd || "N/A"}</p>
                      </div>
                    </div>
                    {customer.measurement.kuwaiti?.notes && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                        <p className="text-sm">{customer.measurement.kuwaiti.notes}</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No measurements recorded for this customer</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="group" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Phone Group Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customer.groupMembers && customer.groupMembers.length > 0 ? (
                  customer.groupMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Avatar>
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">CUST-{member.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">AED {member.totalSpent}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {member.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-muted-foreground">No other group members found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
