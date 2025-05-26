import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  ShoppingBag,
  Users,
  Ruler,
  CreditCard,
  Crown,
  FileText,
} from "lucide-react"
import Link from "next/link"

export default function CustomerViewPage({ params }: { params: { id: string } }) {
  // Mock data - replace with actual API call
  const customer = {
    id: "CUST-001",
    groupId: "GRP-001",
    name: "Fatima Mohammed Al Zahra",
    nameArabic: "فاطمة محمد الزهراء",
    image: "/frequency-modulation-spectrum.png",
    email: "fatima.alzahra@example.com",
    phoneNumber: "+971 50 123 4567",
    isPrimary: true,
    status: "vip",
    vipTier: "Platinum",
    joinDate: "2022-01-15",
    totalSpent: 15750,
    totalOrders: 28,
    averageOrderValue: 562,
    lastPurchase: "May 4, 2024",
    preferences: ["Luxury Fabrics", "Abayas", "French Cuffs", "Custom Tailoring"],
    measurements: {
      frontLength: "27¾", // الطول أمام
      backLength: "27¾", // الطول خلف
      shoulder: "16½", // الكتف
      sleeves: "24¼", // الأيدي
      neck: "11½", // الرقبة
      waist: "32", // الوسط
      chest: "38", // الصدر
      widthEnd: "19½", // نهاية العرض
      notes: "Customer prefers loose fit",
    },
  }

  const groupMembers = [
    {
      id: "CUST-003",
      name: "Layla Hassan Al Khan",
      nameArabic: "ليلى حسن الخان",
      relationship: "Daughter",
      totalSpent: 5400,
      image: "/abstract-geometric-lk.png",
      status: "active",
    },
    {
      id: "CUST-007",
      name: "Mohammed Fatima Al Zahra",
      nameArabic: "محمد فاطمة الزهراء",
      relationship: "Son",
      totalSpent: 3200,
      image: "/stylized-mh.png",
      status: "new",
    },
  ]

  const recentOrders = [
    {
      id: "ORD-2024-156",
      date: "May 4, 2024",
      items: 3,
      total: 1250,
      status: "Completed",
      type: "Custom Abaya",
    },
    {
      id: "ORD-2024-134",
      date: "Apr 18, 2024",
      items: 2,
      total: 850,
      status: "Delivered",
      type: "Alterations",
    },
    {
      id: "ORD-2024-098",
      date: "Mar 22, 2024",
      items: 1,
      total: 2100,
      status: "Completed",
      type: "Wedding Dress",
    },
  ]

  const analytics = [
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
      value: (groupMembers.length + 1).toString(),
      icon: Users,
      color: "text-amber-600",
    },
  ]

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
              <AvatarImage src={customer.image || "/placeholder.svg"} alt={customer.name} />
              <AvatarFallback className="text-lg">FM</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl">{customer.name}</CardTitle>
                {customer.status === "vip" && (
                  <Badge className="bg-amber-100 text-amber-800">
                    <Crown className="mr-1 h-3 w-3" />
                    {customer.vipTier}
                  </Badge>
                )}
                {customer.isPrimary && <Badge variant="outline">Primary Contact</Badge>}
              </div>
              <p className="text-lg text-muted-foreground font-arabic mb-3">{customer.nameArabic}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {customer.phoneNumber}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {customer.email}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Group: {customer.groupId}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Since {new Date(customer.joinDate).getFullYear()}
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
                    <p className="font-mono">{customer.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Group ID</label>
                    <p className="font-mono">{customer.groupId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="flex gap-2">
                      {customer.status === "vip" ? (
                        <Badge className="bg-amber-100 text-amber-800">
                          <Crown className="mr-1 h-3 w-3" />
                          {customer.vipTier}
                        </Badge>
                      ) : (
                        <Badge>{customer.status}</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Join Date</label>
                    <p>{new Date(customer.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Preferences</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {customer.preferences.map((pref, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {pref}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Last 3 orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.type} • {order.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">AED {order.total}</p>
                        <Badge variant="outline" className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Complete order history for this customer</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>{order.type}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">AED {order.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="measurements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                Body Measurements
              </CardTitle>
              <CardDescription>
                Stored measurements for custom tailoring (based on Arabic invoice format)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm font-medium text-muted-foreground">Front Length</p>
                  <p className="text-sm font-medium text-muted-foreground font-arabic">الطول أمام</p>
                  <p className="text-lg font-bold">{customer.measurements.frontLength}</p>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm font-medium text-muted-foreground">Back Length</p>
                  <p className="text-sm font-medium text-muted-foreground font-arabic">الطول خلف</p>
                  <p className="text-lg font-bold">{customer.measurements.backLength}</p>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm font-medium text-muted-foreground">Shoulder</p>
                  <p className="text-sm font-medium text-muted-foreground font-arabic">الكتف</p>
                  <p className="text-lg font-bold">{customer.measurements.shoulder}</p>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm font-medium text-muted-foreground">Sleeves</p>
                  <p className="text-sm font-medium text-muted-foreground font-arabic">الأيدي</p>
                  <p className="text-lg font-bold">{customer.measurements.sleeves}</p>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm font-medium text-muted-foreground">Neck</p>
                  <p className="text-sm font-medium text-muted-foreground font-arabic">الرقبة</p>
                  <p className="text-lg font-bold">{customer.measurements.neck}</p>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm font-medium text-muted-foreground">Waist</p>
                  <p className="text-sm font-medium text-muted-foreground font-arabic">الوسط</p>
                  <p className="text-lg font-bold">{customer.measurements.waist}</p>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm font-medium text-muted-foreground">Chest</p>
                  <p className="text-sm font-medium text-muted-foreground font-arabic">الصدر</p>
                  <p className="text-lg font-bold">{customer.measurements.chest}</p>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm font-medium text-muted-foreground">Width End</p>
                  <p className="text-sm font-medium text-muted-foreground font-arabic">نهاية العرض</p>
                  <p className="text-lg font-bold">{customer.measurements.widthEnd}</p>
                </div>
              </div>
              {customer.measurements.notes && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{customer.measurements.notes}</p>
                </div>
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
              <CardDescription>All customers sharing phone number {customer.phoneNumber}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Current Customer */}
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
                  <Avatar>
                    <AvatarImage src={customer.image || "/placeholder.svg"} alt={customer.name} />
                    <AvatarFallback>FM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{customer.name} (Current)</p>
                    <p className="text-sm text-muted-foreground font-arabic">{customer.nameArabic}</p>
                    <p className="text-sm text-muted-foreground">Primary Contact</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">AED {customer.totalSpent.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                </div>

                {/* Group Members */}
                {groupMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Avatar>
                      <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground font-arabic">{member.nameArabic}</p>
                      <p className="text-sm text-muted-foreground">{member.relationship}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">AED {member.totalSpent.toLocaleString()}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {member.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
