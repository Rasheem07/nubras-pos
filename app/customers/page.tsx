import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, UserPlus, Users, Star, TrendingUp, Phone } from "lucide-react"
import { CustomerGroupTable } from "./customer-group-table"
import Link from "next/link"

export default function CustomersPage() {
  const stats = [
    {
      title: "Customer Groups",
      value: "1,203",
      change: "+8.2%",
      icon: Phone,
      color: "text-blue-600",
    },
    {
      title: "Total Customers",
      value: "2,847",
      change: "+12.5%",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "VIP Customers",
      value: "156",
      change: "+15.3%",
      icon: Star,
      color: "text-amber-600",
    },
    {
      title: "Monthly Revenue",
      value: "AED 485K",
      change: "+22.1%",
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
          <p className="text-muted-foreground">Manage customers grouped by phone numbers</p>
        </div>
        <Link href="/customers/form/new">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, phone number, or group ID..."
            className="pl-8 w-full md:w-[400px] lg:w-[500px]"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Customer Groups Table */}
      <CustomerGroupTable />
    </div>
  )
}
