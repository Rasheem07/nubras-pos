"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, Download, Filter, Printer } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function InventoryReportPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "quarter" | "year">("month")

  // Sample inventory data
  const inventoryItems = [
    {
      id: 1,
      name: "Premium Kandura Fabric",
      sku: "FAB-KAN-001",
      category: "Fabric",
      inStock: 45,
      reorderLevel: 20,
      costPrice: 120,
      sellingPrice: 0,
      value: 5400,
      lastRestocked: new Date(2024, 3, 15),
      status: "In Stock",
    },
    {
      id: 2,
      name: "Standard Kandura Fabric",
      sku: "FAB-KAN-002",
      category: "Fabric",
      inStock: 32,
      reorderLevel: 15,
      costPrice: 80,
      sellingPrice: 0,
      value: 2560,
      lastRestocked: new Date(2024, 3, 20),
      status: "In Stock",
    },
    {
      id: 3,
      name: "Premium Abaya Fabric",
      sku: "FAB-ABA-001",
      category: "Fabric",
      inStock: 28,
      reorderLevel: 15,
      costPrice: 150,
      sellingPrice: 0,
      value: 4200,
      lastRestocked: new Date(2024, 4, 5),
      status: "In Stock",
    },
    {
      id: 4,
      name: "Gold Thread",
      sku: "THR-GLD-001",
      category: "Thread",
      inStock: 12,
      reorderLevel: 10,
      costPrice: 45,
      sellingPrice: 0,
      value: 540,
      lastRestocked: new Date(2024, 4, 1),
      status: "Low Stock",
    },
    {
      id: 5,
      name: "Silver Thread",
      sku: "THR-SLV-001",
      category: "Thread",
      inStock: 18,
      reorderLevel: 10,
      costPrice: 35,
      sellingPrice: 0,
      value: 630,
      lastRestocked: new Date(2024, 3, 25),
      status: "In Stock",
    },
    {
      id: 6,
      name: "Buttons (Gold)",
      sku: "BTN-GLD-001",
      category: "Accessories",
      inStock: 8,
      reorderLevel: 20,
      costPrice: 5,
      sellingPrice: 0,
      value: 40,
      lastRestocked: new Date(2024, 3, 10),
      status: "Low Stock",
    },
    {
      id: 7,
      name: "Buttons (Silver)",
      sku: "BTN-SLV-001",
      category: "Accessories",
      inStock: 25,
      reorderLevel: 20,
      costPrice: 4,
      sellingPrice: 0,
      value: 100,
      lastRestocked: new Date(2024, 3, 10),
      status: "In Stock",
    },
    {
      id: 8,
      name: "Silk Scarf",
      sku: "ACC-SCF-001",
      category: "Accessories",
      inStock: 0,
      reorderLevel: 10,
      costPrice: 60,
      sellingPrice: 120,
      value: 0,
      lastRestocked: new Date(2024, 2, 15),
      status: "Out of Stock",
    },
  ]

  // Calculate inventory statistics
  const totalItems = inventoryItems.length
  const totalValue = inventoryItems.reduce((sum, item) => sum + item.value, 0)
  const lowStockItems = inventoryItems.filter((item) => item.status === "Low Stock").length
  const outOfStockItems = inventoryItems.filter((item) => item.status === "Out of Stock").length

  // Calculate category breakdown
  const categories = inventoryItems.reduce((acc: Record<string, number>, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.value
    return acc
  }, {})

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return <Badge className="bg-green-500 hover:bg-green-600">In Stock</Badge>
      case "Low Stock":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Low Stock</Badge>
      case "Out of Stock":
        return <Badge className="bg-red-500 hover:bg-red-600">Out of Stock</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Report</h1>
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

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
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
            <div className="text-2xl font-bold">AED {totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{totalItems} items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
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
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Need reordering</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock Items</CardTitle>
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
            <div className="text-2xl font-bold">{outOfStockItems}</div>
            <p className="text-xs text-muted-foreground">Urgent reordering</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Item Value</CardTitle>
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
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AED {(totalValue / totalItems).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per inventory item</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
            <CardDescription>Current inventory status and valuation.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>In Stock</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.inStock}</TableCell>
                    <TableCell>AED {item.value.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
            <CardDescription>Value distribution across categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {Object.entries(categories).map(([category, value]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{category}</div>
                    <div className="text-sm font-medium">
                      AED {value.toLocaleString()} ({((value / totalValue) * 100).toFixed(1)}%)
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${(value / totalValue) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
