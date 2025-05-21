import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Check, Clock, ShoppingCart, Tag, User, Package, AlertTriangle, Info } from "lucide-react"

export default function NotificationsPage() {
  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">View and manage your notifications</p>
      </div>

      <div className="flex items-center justify-between">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm">
              <Check className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          </div>

          <TabsContent value="all" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-blue-100 p-1">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">New Order Received</CardTitle>
                    <Badge>Order</Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    10 minutes ago
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Order #1234 has been placed by Ahmed Al Mansouri. Total amount: AED 1,250.
                </CardDescription>
                <div className="mt-2 flex space-x-2">
                  <Button size="sm" variant="default">
                    View Order
                  </Button>
                  <Button size="sm" variant="outline">
                    Mark as Read
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-amber-100 p-1">
                      <Package className="h-5 w-5 text-amber-600" />
                    </div>
                    <CardTitle className="text-lg">Low Stock Alert</CardTitle>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800">
                      Inventory
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />2 hours ago
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Premium Kandura (SKU: KAN-001) is running low on stock. Current quantity: 5 items.
                </CardDescription>
                <div className="mt-2 flex space-x-2">
                  <Button size="sm" variant="default">
                    Restock Now
                  </Button>
                  <Button size="sm" variant="outline">
                    Mark as Read
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-green-100 p-1">
                      <Tag className="h-5 w-5 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">Promotion Ending Soon</CardTitle>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Promotion
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />1 day ago
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  The "Summer Collection" promotion will end in 2 days. Consider extending or creating a new promotion.
                </CardDescription>
                <div className="mt-2 flex space-x-2">
                  <Button size="sm" variant="default">
                    Extend Promotion
                  </Button>
                  <Button size="sm" variant="outline">
                    Mark as Read
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-purple-100 p-1">
                      <User className="h-5 w-5 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">Staff Schedule Updated</CardTitle>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800">
                      Staff
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />2 days ago
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Fatima Al Zaabi has requested a schedule change for next week. Please review and approve.
                </CardDescription>
                <div className="mt-2 flex space-x-2">
                  <Button size="sm" variant="default">
                    Review Request
                  </Button>
                  <Button size="sm" variant="outline">
                    Mark as Read
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-full bg-red-100 p-1">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <CardTitle className="text-lg">System Update Required</CardTitle>
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      System
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />3 days ago
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  A critical system update is available. Please update your system to ensure security and performance.
                </CardDescription>
                <div className="mt-2 flex space-x-2">
                  <Button size="sm" variant="default">
                    Update Now
                  </Button>
                  <Button size="sm" variant="outline">
                    Remind Later
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unread" className="mt-4">
            <div className="flex flex-col space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="rounded-full bg-blue-100 p-1">
                        <ShoppingCart className="h-5 w-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">New Order Received</CardTitle>
                      <Badge>Order</Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      10 minutes ago
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    Order #1234 has been placed by Ahmed Al Mansouri. Total amount: AED 1,250.
                  </CardDescription>
                  <div className="mt-2 flex space-x-2">
                    <Button size="sm" variant="default">
                      View Order
                    </Button>
                    <Button size="sm" variant="outline">
                      Mark as Read
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="rounded-full bg-amber-100 p-1">
                        <Package className="h-5 w-5 text-amber-600" />
                      </div>
                      <CardTitle className="text-lg">Low Stock Alert</CardTitle>
                      <Badge variant="outline" className="bg-amber-100 text-amber-800">
                        Inventory
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />2 hours ago
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    Premium Kandura (SKU: KAN-001) is running low on stock. Current quantity: 5 items.
                  </CardDescription>
                  <div className="mt-2 flex space-x-2">
                    <Button size="sm" variant="default">
                      Restock Now
                    </Button>
                    <Button size="sm" variant="outline">
                      Mark as Read
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-4">
            <div className="flex flex-col space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="rounded-full bg-blue-100 p-1">
                        <ShoppingCart className="h-5 w-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">New Order Received</CardTitle>
                      <Badge>Order</Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      10 minutes ago
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    Order #1234 has been placed by Ahmed Al Mansouri. Total amount: AED 1,250.
                  </CardDescription>
                  <div className="mt-2 flex space-x-2">
                    <Button size="sm" variant="default">
                      View Order
                    </Button>
                    <Button size="sm" variant="outline">
                      Mark as Read
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="rounded-full bg-blue-100 p-1">
                        <Info className="h-5 w-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">Order Status Updated</CardTitle>
                      <Badge>Order</Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />3 days ago
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    Order #1189 status has been updated to "Ready for Pickup".
                  </CardDescription>
                  <div className="mt-2 flex space-x-2">
                    <Button size="sm" variant="default">
                      View Order
                    </Button>
                    <Button size="sm" variant="outline">
                      Mark as Read
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="mt-4">
            <div className="flex flex-col space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="rounded-full bg-amber-100 p-1">
                        <Package className="h-5 w-5 text-amber-600" />
                      </div>
                      <CardTitle className="text-lg">Low Stock Alert</CardTitle>
                      <Badge variant="outline" className="bg-amber-100 text-amber-800">
                        Inventory
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />2 hours ago
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    Premium Kandura (SKU: KAN-001) is running low on stock. Current quantity: 5 items.
                  </CardDescription>
                  <div className="mt-2 flex space-x-2">
                    <Button size="sm" variant="default">
                      Restock Now
                    </Button>
                    <Button size="sm" variant="outline">
                      Mark as Read
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="rounded-full bg-green-100 p-1">
                        <Package className="h-5 w-5 text-green-600" />
                      </div>
                      <CardTitle className="text-lg">Inventory Restocked</CardTitle>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Inventory
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />4 days ago
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    Luxury Abaya (SKU: ABA-001) has been restocked. New quantity: 25 items.
                  </CardDescription>
                  <div className="mt-2 flex space-x-2">
                    <Button size="sm" variant="default">
                      View Inventory
                    </Button>
                    <Button size="sm" variant="outline">
                      Mark as Read
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="system" className="mt-4">
            <div className="flex flex-col space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="rounded-full bg-red-100 p-1">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <CardTitle className="text-lg">System Update Required</CardTitle>
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        System
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />3 days ago
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    A critical system update is available. Please update your system to ensure security and performance.
                  </CardDescription>
                  <div className="mt-2 flex space-x-2">
                    <Button size="sm" variant="default">
                      Update Now
                    </Button>
                    <Button size="sm" variant="outline">
                      Remind Later
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="rounded-full bg-blue-100 p-1">
                        <Bell className="h-5 w-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">Backup Completed</CardTitle>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        System
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />5 days ago
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    System backup has been completed successfully. Last backup: May 5, 2024, 02:30 AM.
                  </CardDescription>
                  <div className="mt-2 flex space-x-2">
                    <Button size="sm" variant="default">
                      View Backups
                    </Button>
                    <Button size="sm" variant="outline">
                      Mark as Read
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
