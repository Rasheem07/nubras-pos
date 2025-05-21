"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Download, Filter, Printer } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Import sample charts
import { SalesChart } from "@/components/sales-chart"

export default function ReportsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "quarter" | "year">("month")

  // Sample data for reports
  const salesData = {
    total: 45280,
    change: 12.5,
    items: 267,
    average: 169.59,
  }

  const inventoryData = {
    value: 128450,
    items: 342,
    lowStock: 18,
    outOfStock: 7,
  }

  const profitData = {
    total: 18750,
    margin: 41.4,
    change: 8.2,
    costOfGoods: 26530,
  }

  const topProducts = [
    { name: "Kandura (Premium)", sales: 42, revenue: 18900 },
    { name: "Abaya (Premium)", sales: 38, revenue: 20900 },
    { name: "Custom Kandura", sales: 24, revenue: 15600 },
    { name: "Scarf (Silk)", sales: 56, revenue: 6720 },
    { name: "Alteration - Kandura", sales: 68, revenue: 6800 },
  ]

  const topStaff = [
    { name: "Ahmed Al Mansouri", sales: 86, revenue: 24800 },
    { name: "Fatima Al Zaabi", sales: 72, revenue: 19600 },
    { name: "Mohammed Al Hashimi", sales: 65, revenue: 18200 },
    { name: "Sara Al Marzooqi", sales: 58, revenue: 15400 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">AED {salesData.total.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {salesData.change > 0 ? "+" : ""}
                  {salesData.change}% from previous period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profit</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">AED {profitData.total.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{profitData.margin}% profit margin</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">AED {inventoryData.value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{inventoryData.items} items in stock</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="md:col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <SalesChart />
              </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Top selling products by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center">
                      <div className="font-medium">{index + 1}.</div>
                      <div className="ml-2 flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                      </div>
                      <div className="font-medium">AED {product.revenue.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="md:col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Kandura</div>
                        <div className="text-sm font-medium">45%</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: "45%" }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Abaya</div>
                        <div className="text-sm font-medium">30%</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: "30%" }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Accessories</div>
                        <div className="text-sm font-medium">15%</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: "15%" }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Alterations</div>
                        <div className="text-sm font-medium">10%</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: "10%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Top Staff</CardTitle>
                <CardDescription>Top performing staff by sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topStaff.map((staff, index) => (
                    <div key={index} className="flex items-center">
                      <div className="font-medium">{index + 1}.</div>
                      <div className="ml-2 flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{staff.name}</p>
                        <p className="text-xs text-muted-foreground">{staff.sales} sales</p>
                      </div>
                      <div className="font-medium">AED {staff.revenue.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analysis</CardTitle>
              <CardDescription>Detailed breakdown of sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Select the "Sales" tab to view detailed sales reports and analytics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Analysis</CardTitle>
              <CardDescription>Detailed breakdown of inventory performance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Select the "Inventory" tab to view detailed inventory reports and analytics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance</CardTitle>
              <CardDescription>Detailed breakdown of staff performance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Select the "Staff" tab to view detailed staff performance reports and analytics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analysis</CardTitle>
              <CardDescription>Detailed breakdown of customer data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Select the "Customers" tab to view detailed customer reports and analytics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
