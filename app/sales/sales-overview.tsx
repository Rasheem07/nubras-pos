"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Clock, AlertTriangle, CheckCircle, DollarSign } from "lucide-react"

export function SalesOverview() {
  // Mock data - in real app, this would come from your API
  const metrics = {
    totalRevenue: 125750.5,
    pendingOrders: 12,
    overdueOrders: 3,
    completedToday: 8,
    averageOrderValue: 485.25,
    totalCustomers: 156,
    monthlyGrowth: 12.5,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">AED {metrics.totalRevenue.toLocaleString()}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />+{metrics.monthlyGrowth}% from last month
          </div>
        </CardContent>
      </Card>

      {/* Pending Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.pendingOrders}</div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Awaiting Processing
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Overdue Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue Orders</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{metrics.overdueOrders}</div>
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-xs">
              Requires Attention
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Completed Today */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{metrics.completedToday}</div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">On Track</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
