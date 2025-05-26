"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Download, Filter, Printer } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { SalesChart } from "@/components/sales-chart"

export default function SalesReportPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "quarter" | "year">("month")
  const [reportType, setReportType] = useState<"overview" | "products" | "categories" | "staff" | "time">("overview")

  // Sample data for sales reports
  const salesData = {
    total: 45280,
    change: 12.5,
    items: 267,
    average: 169.59,
    byCategory: [
      { name: "Kandura", percentage: 45, value: 20376 },
      { name: "Abaya", percentage: 30, value: 13584 },
      { name: "Accessories", percentage: 15, value: 6792 },
      { name: "Alterations", percentage: 10, value: 4528 },
    ],
    byPaymentMethod: [
      { method: "Credit Card", percentage: 65, value: 29432 },
      { method: "Cash", percentage: 20, value: 9056 },
      { method: "Bank Transfer", percentage: 10, value: 4528 },
      { method: "Digital Wallet", percentage: 5, value: 2264 },
    ],
    topProducts: [
      { name: "Kandura (Premium)", sales: 42, revenue: 18900 },
      { name: "Abaya (Premium)", sales: 38, revenue: 20900 },
      { name: "Custom Kandura", sales: 24, revenue: 15600 },
      { name: "Scarf (Silk)", sales: 56, revenue: 6720 },
      { name: "Alteration - Kandura", sales: 68, revenue: 6800 },
    ],
    topStaff: [
      { name: "Ahmed Al Mansouri", sales: 86, revenue: 24800 },
      { name: "Fatima Al Zaabi", sales: 72, revenue: 19600 },
      { name: "Mohammed Al Hashimi", sales: 65, revenue: 18200 },
      { name: "Sara Al Marzooqi", sales: 58, revenue: 15400 },
    ],
    byTime: [
      { time: "Morning (8AM-12PM)", percentage: 25, value: 11320 },
      { time: "Afternoon (12PM-4PM)", percentage: 35, value: 15848 },
      { time: "Evening (4PM-8PM)", percentage: 40, value: 18112 },
    ],
    byDay: [
      { day: "Monday", percentage: 10, value: 4528 },
      { day: "Tuesday", percentage: 12, value: 5434 },
      { day: "Wednesday", percentage: 15, value: 6792 },
      { day: "Thursday", percentage: 18, value: 8150 },
      { day: "Friday", percentage: 25, value: 11320 },
      { day: "Saturday", percentage: 15, value: 6792 },
      { day: "Sunday", percentage: 5, value: 2264 },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales Reports</h1>
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

      <Tabs value={reportType} onValueChange={(v) => setReportType(v as any)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="time">Time Analysis</TabsTrigger>
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
                <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
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
                <div className="text-2xl font-bold">{salesData.items}</div>
                <p className="text-xs text-muted-foreground">Average order value: AED {salesData.average.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales by Category</CardTitle>
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
                <div className="text-2xl font-bold">4 Categories</div>
                <p className="text-xs text-muted-foreground">Kandura is the top category at 45%</p>
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
                  {salesData.topProducts.map((product, index) => (
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
                  {salesData.byCategory.map((category) => (
                    <div key={category.name} className="flex items-center">
                      <div className="w-full space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">{category.name}</div>
                          <div className="text-sm font-medium">{category.percentage}%</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-2 rounded-full bg-primary" style={{ width: `${category.percentage}%` }} />
                        </div>
                        <div className="text-xs text-muted-foreground">AED {category.value.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Sales by payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.byPaymentMethod.map((method) => (
                    <div key={method.method} className="flex items-center">
                      <div className="w-full space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">{method.method}</div>
                          <div className="text-sm font-medium">{method.percentage}%</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-2 rounded-full bg-primary" style={{ width: `${method.percentage}%` }} />
                        </div>
                        <div className="text-xs text-muted-foreground">AED {method.value.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Sales Analysis</CardTitle>
              <CardDescription>Detailed breakdown of product performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="mb-4 text-lg font-medium">Top 5 Products by Revenue</h3>
                  <div className="relative overflow-x-auto rounded-lg border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted text-xs uppercase">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Product Name
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Units Sold
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Revenue
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Profit Margin
                          </th>
                          <th scope="col" className="px-6 py-3">
                            % of Total Sales
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b bg-background">
                          <td className="px-6 py-4 font-medium">Kandura (Premium)</td>
                          <td className="px-6 py-4">42</td>
                          <td className="px-6 py-4">AED 18,900</td>
                          <td className="px-6 py-4">45%</td>
                          <td className="px-6 py-4">41.7%</td>
                        </tr>
                        <tr className="border-b bg-background">
                          <td className="px-6 py-4 font-medium">Abaya (Premium)</td>
                          <td className="px-6 py-4">38</td>
                          <td className="px-6 py-4">AED 20,900</td>
                          <td className="px-6 py-4">48%</td>
                          <td className="px-6 py-4">46.2%</td>
                        </tr>
                        <tr className="border-b bg-background">
                          <td className="px-6 py-4 font-medium">Custom Kandura</td>
                          <td className="px-6 py-4">24</td>
                          <td className="px-6 py-4">AED 15,600</td>
                          <td className="px-6 py-4">52%</td>
                          <td className="px-6 py-4">34.5%</td>
                        </tr>
                        <tr className="border-b bg-background">
                          <td className="px-6 py-4 font-medium">Scarf (Silk)</td>
                          <td className="px-6 py-4">56</td>
                          <td className="px-6 py-4">AED 6,720</td>
                          <td className="px-6 py-4">38%</td>
                          <td className="px-6 py-4">14.8%</td>
                        </tr>
                        <tr className="bg-background">
                          <td className="px-6 py-4 font-medium">Alteration - Kandura</td>
                          <td className="px-6 py-4">68</td>
                          <td className="px-6 py-4">AED 6,800</td>
                          <td className="px-6 py-4">65%</td>
                          <td className="px-6 py-4">15.0%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">Product Performance Metrics</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Best Selling Product</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">Alteration - Kandura</div>
                        <p className="text-xs text-muted-foreground">68 units sold</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Highest Revenue Product</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">Abaya (Premium)</div>
                        <p className="text-xs text-muted-foreground">AED 20,900 revenue</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Highest Profit Margin</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">Alteration - Kandura</div>
                        <p className="text-xs text-muted-foreground">65% profit margin</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">AED 169.59</div>
                        <p className="text-xs text-muted-foreground">Across all products</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">Product Sales Trends</h3>
                  <Card>
                    <CardContent className="pt-6">
                      <SalesChart />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Sales Analysis</CardTitle>
              <CardDescription>Detailed breakdown of sales by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="mb-4 text-lg font-medium">Sales by Category</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      {salesData.byCategory.map((category) => (
                        <div key={category.name} className="flex items-center">
                          <div className="w-full space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium">{category.name}</div>
                              <div className="text-sm font-medium">{category.percentage}%</div>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted">
                              <div
                                className="h-2 rounded-full bg-primary"
                                style={{ width: `${category.percentage}%` }}
                              />
                            </div>
                            <div className="text-xs text-muted-foreground">AED {category.value.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-medium">Category Distribution</div>
                        <div className="mt-2 h-64 w-64 rounded-full border-8 border-background relative">
                          <div
                            className="absolute inset-0 rounded-full bg-green-500"
                            style={{ clipPath: "polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 50% 100%)" }}
                          ></div>
                          <div
                            className="absolute inset-0 rounded-full bg-blue-500"
                            style={{ clipPath: "polygon(50% 50%, 100% 100%, 0 100%, 0 70%, 50% 50%)" }}
                          ></div>
                          <div
                            className="absolute inset-0 rounded-full bg-yellow-500"
                            style={{ clipPath: "polygon(50% 50%, 0 70%, 0 0, 30% 0, 50% 50%)" }}
                          ></div>
                          <div
                            className="absolute inset-0 rounded-full bg-red-500"
                            style={{ clipPath: "polygon(50% 50%, 30% 0, 50% 0, 50% 50%)" }}
                          ></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-16 w-16 rounded-full bg-background"></div>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                            <span>Kandura (45%)</span>
                          </div>
                          <div className="flex items-center">
                            <div className="mr-2 h-3 w-3 rounded-full bg-blue-500"></div>
                            <span>Abaya (30%)</span>
                          </div>
                          <div className="flex items-center">
                            <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500"></div>
                            <span>Accessories (15%)</span>
                          </div>
                          <div className="flex items-center">
                            <div className="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
                            <span>Alterations (10%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">Category Performance Metrics</h3>
                  <div className="relative overflow-x-auto rounded-lg border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted text-xs uppercase">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Category
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Revenue
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Units Sold
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Avg. Price
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Growth
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b bg-background">
                          <td className="px-6 py-4 font-medium">Kandura</td>
                          <td className="px-6 py-4">AED 20,376</td>
                          <td className="px-6 py-4">98</td>
                          <td className="px-6 py-4">AED 207.92</td>
                          <td className="px-6 py-4 text-green-600">+15.2%</td>
                        </tr>
                        <tr className="border-b bg-background">
                          <td className="px-6 py-4 font-medium">Abaya</td>
                          <td className="px-6 py-4">AED 13,584</td>
                          <td className="px-6 py-4">62</td>
                          <td className="px-6 py-4">AED 219.10</td>
                          <td className="px-6 py-4 text-green-600">+12.8%</td>
                        </tr>
                        <tr className="border-b bg-background">
                          <td className="px-6 py-4 font-medium">Accessories</td>
                          <td className="px-6 py-4">AED 6,792</td>
                          <td className="px-6 py-4">85</td>
                          <td className="px-6 py-4">AED 79.91</td>
                          <td className="px-6 py-4 text-green-600">+8.5%</td>
                        </tr>
                        <tr className="bg-background">
                          <td className="px-6 py-4 font-medium">Alterations</td>
                          <td className="px-6 py-4">AED 4,528</td>
                          <td className="px-6 py-4">68</td>
                          <td className="px-6 py-4">AED 66.59</td>
                          <td className="px-6 py-4 text-green-600">+5.2%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance Analysis</CardTitle>
              <CardDescription>Detailed breakdown of staff sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="mb-4 text-lg font-medium">Top Performing Staff</h3>
                  <div className="relative overflow-x-auto rounded-lg border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted text-xs uppercase">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Staff Name
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Sales Count
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Revenue Generated
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Avg. Sale Value
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Performance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesData.topStaff.map((staff, index) => (
                          <tr
                            key={index}
                            className={
                              index < salesData.topStaff.length - 1 ? "border-b bg-background" : "bg-background"
                            }
                          >
                            <td className="px-6 py-4 font-medium">{staff.name}</td>
                            <td className="px-6 py-4">{staff.sales}</td>
                            <td className="px-6 py-4">AED {staff.revenue.toLocaleString()}</td>
                            <td className="px-6 py-4">
                              AED {Math.round(staff.revenue / staff.sales).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="mr-2 h-2.5 w-full max-w-24 rounded-full bg-muted">
                                  <div
                                    className="h-2.5 rounded-full bg-primary"
                                    style={{ width: `${(staff.revenue / 25000) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-medium">
                                  {Math.round((staff.revenue / 25000) * 100)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">Staff Performance Metrics</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">Ahmed Al Mansouri</div>
                        <p className="text-xs text-muted-foreground">AED 24,800 in sales</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Most Sales</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">Ahmed Al Mansouri</div>
                        <p className="text-xs text-muted-foreground">86 sales completed</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Highest Avg. Sale</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">Mohammed Al Hashimi</div>
                        <p className="text-xs text-muted-foreground">AED 280 per sale</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Most Improved</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">Fatima Al Zaabi</div>
                        <p className="text-xs text-muted-foreground">+24% from last month</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">Staff Sales by Category</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {salesData.topStaff.slice(0, 2).map((staff, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-base">{staff.name}</CardTitle>
                          <CardDescription>Category breakdown</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {salesData.byCategory.map((category) => (
                              <div key={category.name} className="flex items-center">
                                <div className="w-full space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-medium">{category.name}</div>
                                    <div className="text-sm font-medium">{Math.floor(Math.random() * 20 + 10)}%</div>
                                  </div>
                                  <div className="h-2 w-full rounded-full bg-muted">
                                    <div
                                      className="h-2 rounded-full bg-primary"
                                      style={{ width: `${Math.floor(Math.random() * 20 + 10)}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Time-Based Sales Analysis</CardTitle>
              <CardDescription>Detailed breakdown of sales by time periods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="mb-4 text-lg font-medium">Sales by Time of Day</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      {salesData.byTime.map((timeSlot) => (
                        <div key={timeSlot.time} className="flex items-center">
                          <div className="w-full space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium">{timeSlot.time}</div>
                              <div className="text-sm font-medium">{timeSlot.percentage}%</div>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted">
                              <div
                                className="h-2 rounded-full bg-primary"
                                style={{ width: `${timeSlot.percentage}%` }}
                              />
                            </div>
                            <div className="text-xs text-muted-foreground">AED {timeSlot.value.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Peak Hours</CardTitle>
                        <CardDescription>Busiest times for sales</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-lg font-bold">Evening (4PM-8PM)</div>
                              <div className="text-sm text-muted-foreground">Peak sales period</div>
                            </div>
                            <div className="text-2xl font-bold">40%</div>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div className="h-2 rounded-full bg-primary" style={{ width: "40%" }} />
                          </div>
                          <div className="pt-4 text-sm">
                            <div className="mb-2 font-medium">Key Insights:</div>
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Highest customer traffic after work hours</li>
                              <li>Average transaction value increases by 15%</li>
                              <li>More family shopping during this period</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">Sales by Day of Week</h3>
                  <div className="relative overflow-x-auto rounded-lg border">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted text-xs uppercase">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Day
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Revenue
                          </th>
                          <th scope="col" className="px-6 py-3">
                            % of Total
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Transactions
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Avg. Sale
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesData.byDay.map((day, index) => (
                          <tr
                            key={index}
                            className={index < salesData.byDay.length - 1 ? "border-b bg-background" : "bg-background"}
                          >
                            <td className="px-6 py-4 font-medium">{day.day}</td>
                            <td className="px-6 py-4">AED {day.value.toLocaleString()}</td>
                            <td className="px-6 py-4">{day.percentage}%</td>
                            <td className="px-6 py-4">{Math.floor(day.value / 170)}</td>
                            <td className="px-6 py-4">AED {Math.floor(170 + Math.random() * 30)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-medium">Monthly Sales Trend</h3>
                  <Card>
                    <CardContent className="pt-6">
                      <SalesChart />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
