"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Clock, AlertTriangle, CheckCircle, DollarSign, TrendingDown } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

interface OverviewMetrics {
  totalRevenue: number
  pendingOrders: number
  overdueOrders: number
  completedToday: number
  averageOrderValue: string
  totalCustomers: number
  monthlyGrowth: number
}

export function SalesOverview() {
  const {
    data: metrics,
    isLoading,
    error,
  } = useQuery<OverviewMetrics>({
    queryKey: ["salesOverview"],
    queryFn: async () => {
      const response = await fetch("https://api.alnubras.co/api/v1/sales/overview")
      const json = await response.json()
      if (!response.ok) {
        toast.error("Failed to fetch sales overview")
        throw new Error("Failed to fetch sales overview")
      }
      return json
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !metrics) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="md:col-span-2 lg:col-span-4">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Failed to load sales overview</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isGrowthPositive = metrics.monthlyGrowth >= 0

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
      {/* Total Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">AED {metrics.totalRevenue.toLocaleString()}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {isGrowthPositive ? (
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
            )}
            <span className={isGrowthPositive ? "text-green-600" : "text-red-600"}>
              {isGrowthPositive ? "+" : ""}
              {metrics.monthlyGrowth}% from last month
            </span>
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
          <div className={`text-2xl font-bold ${metrics.overdueOrders > 0 ? "text-red-600" : "text-green-600"}`}>
            {metrics.overdueOrders}
          </div>
          <div className="flex items-center gap-2">
            {metrics.overdueOrders > 0 ? (
              <Badge variant="destructive" className="text-xs">
                Requires Attention
              </Badge>
            ) : (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">All Current</Badge>
            )}
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
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
              {metrics.completedToday > 0 ? "On Track" : "Getting Started"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics Row */}
      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">AED {Number(metrics.averageOrderValue).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Per order average</p>
        </CardContent>
      </Card>

      {/* <Card className="">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalCustomers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Active customer base</p>
        </CardContent>
      </Card> */}
    </div>
  )
}
