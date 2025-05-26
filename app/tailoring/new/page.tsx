"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  CalendarIcon,
  Search,
  User,
  Scissors,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ShoppingBag,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Tailor {
  id: string
  name: string
  initials: string
  image?: string
  level: number
  specialties: string[]
  currentProjects: number
  rating: number
  status: "available" | "busy" | "unavailable"
  efficiency: number
}

interface Customer {
  id: string
  name: string
  phone: string
  email: string
}

const tailors: Tailor[] = [
  {
    id: "T001",
    name: "Mohammed Ali",
    initials: "MA",
    image: "/stylized-letter-ma.png",
    level: 3,
    specialties: ["Kanduras", "Formal Wear"],
    currentProjects: 2,
    rating: 4.8,
    status: "available",
    efficiency: 95,
  },
  {
    id: "T002",
    name: "Khalid Rahman",
    initials: "KR",
    level: 2,
    specialties: ["Alterations", "Casual Wear"],
    currentProjects: 4,
    rating: 4.5,
    status: "busy",
    efficiency: 88,
  },
  {
    id: "T003",
    name: "Aisha Mahmood",
    initials: "AM",
    image: "/abstract-am.png",
    level: 3,
    specialties: ["Abayas", "Women's Wear"],
    currentProjects: 1,
    rating: 4.9,
    status: "available",
    efficiency: 92,
  },
  {
    id: "T004",
    name: "Yusuf Qasim",
    initials: "YQ",
    level: 3,
    specialties: ["Bulk Orders", "Traditional Wear"],
    currentProjects: 3,
    rating: 4.7,
    status: "available",
    efficiency: 88,
  },
  {
    id: "T005",
    name: "Fatima Zahra",
    initials: "FZ",
    image: "/abstract-fz.png",
    level: 3,
    specialties: ["Custom Design", "Premium Wear"],
    currentProjects: 2,
    rating: 5.0,
    status: "available",
    efficiency: 96,
  },
]

const customers: Customer[] = [
  { id: "C001", name: "Ahmed Al Mansouri", phone: "+971 50 123 4567", email: "ahmed@email.com" },
  { id: "C002", name: "Fatima Mohammed", phone: "+971 55 987 6543", email: "fatima@email.com" },
  { id: "C003", name: "Hassan Al Farsi", phone: "+971 52 456 7890", email: "hassan@email.com" },
]

const orders = [
  {
    id: "ORD-001",
    invoiceNumber: "INV-2024-001",
    customer: customers[0],
    date: new Date("2024-01-15"),
    status: "confirmed",
    total: 1250,
    items: [
      { id: 1, name: "Custom Kandura - Navy Blue", type: "custom", quantity: 1, price: 650, requiresTailoring: true },
      { id: 2, name: "Custom Kandura - White", type: "custom", quantity: 1, price: 600, requiresTailoring: true },
    ],
    notes: "Rush order - needed by Friday",
    priority: "high",
  },
  {
    id: "ORD-002",
    invoiceNumber: "INV-2024-002",
    customer: customers[1],
    date: new Date("2024-01-16"),
    status: "confirmed",
    total: 850,
    items: [
      { id: 3, name: "Abaya Alteration", type: "alteration", quantity: 1, price: 150, requiresTailoring: true },
      { id: 4, name: "Premium Kandura", type: "ready-made", quantity: 1, price: 450, requiresTailoring: false },
      { id: 5, name: "Custom Embroidery", type: "custom", quantity: 1, price: 250, requiresTailoring: true },
    ],
    notes: "Customer prefers traditional style",
    priority: "normal",
  },
  {
    id: "ORD-003",
    invoiceNumber: "INV-2024-003",
    customer: customers[2],
    date: new Date("2024-01-17"),
    status: "pending_tailoring",
    total: 2100,
    items: [{ id: 6, name: "Wedding Kandura Set", type: "custom", quantity: 3, price: 700, requiresTailoring: true }],
    notes: "Wedding order - very important customer",
    priority: "high",
  },
]

export default function NewTailoringProject() {
  const [activeTab, setActiveTab] = useState("order")
  const [selectedTailor, setSelectedTailor] = useState<Tailor | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [deadline, setDeadline] = useState<Date>()
  const [isRush, setIsRush] = useState(false)
  const [searchTailor, setSearchTailor] = useState("")
  const [searchCustomer, setSearchCustomer] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [searchOrder, setSearchOrder] = useState("")
  const [orderItems, setOrderItems] = useState<any[]>([])

  const filteredTailors = tailors.filter(
    (tailor) =>
      tailor.name.toLowerCase().includes(searchTailor.toLowerCase()) ||
      tailor.specialties.some((specialty) => specialty.toLowerCase().includes(searchTailor.toLowerCase())),
  )

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
      customer.phone.includes(searchCustomer) ||
      customer.email.toLowerCase().includes(searchCustomer.toLowerCase()),
  )

  const filteredOrders = orders.filter(
    (order) =>
      order.invoiceNumber.toLowerCase().includes(searchOrder.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchOrder.toLowerCase()) ||
      order.id.toLowerCase().includes(searchOrder.toLowerCase()),
  )

  const getStatusBadge = (status: Tailor["status"]) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Available</Badge>
      case "busy":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Busy</Badge>
      case "unavailable":
        return <Badge variant="destructive">Unavailable</Badge>
    }
  }

  const getEfficiencyBadge = (efficiency: number) => {
    if (efficiency >= 90) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Excellent</Badge>
    } else if (efficiency >= 80) {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Good</Badge>
    } else {
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Average</Badge>
    }
  }

  const handleOrderSelection = (order: any) => {
    setSelectedOrder(order)
    setSelectedCustomer(order.customer)
    setOrderItems(order.items.filter((item: any) => item.requiresTailoring))
  }

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Confirmed</Badge>
      case "pending_tailoring":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending Tailoring</Badge>
      case "in_progress":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">In Progress</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800 border-red-200">High Priority</Badge>
      case "normal":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Normal</Badge>
      case "low":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const canProceed = selectedOrder && selectedTailor && deadline

  return (
    <div className="flex flex-col gap-8">
      {/* Professional Header */}
      <div className="flex items-center gap-6">
        <Link href="/tailoring">
          <Button variant="outline" size="icon" className="border-gray-300">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create New Project</h1>
          <p className="text-gray-600 mt-1">Set up a new tailoring project with customer and tailor assignment</p>
        </div>
      </div>

      {/* Professional Tab Navigation */}
      <Card className="border-gray-200 shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent border-none p-0 h-auto">
            <TabsTrigger
              value="order"
              className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-6 py-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                    activeTab === "order" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600",
                  )}
                >
                  1
                </div>
                Select Order
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="details"
              disabled={!selectedOrder}
              className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-6 py-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                    activeTab === "details"
                      ? "bg-blue-600 text-white"
                      : selectedOrder
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-600",
                  )}
                >
                  {selectedOrder ? <CheckCircle2 className="h-3 w-3" /> : "2"}
                </div>
                Project Details
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="tailor"
              disabled={!selectedOrder || !selectedCustomer}
              className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-6 py-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                    activeTab === "tailor"
                      ? "bg-blue-600 text-white"
                      : selectedCustomer
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-600",
                  )}
                >
                  {selectedCustomer ? <CheckCircle2 className="h-3 w-3" /> : "3"}
                </div>
                Tailor Assignment
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="review"
              disabled={!canProceed}
              className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none px-6 py-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                    activeTab === "review"
                      ? "bg-blue-600 text-white"
                      : canProceed
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-600",
                  )}
                >
                  {canProceed ? <CheckCircle2 className="h-3 w-3" /> : "4"}
                </div>
                Review & Create
              </div>
            </TabsTrigger>
          </TabsList>

          <div className="p-8">
            <TabsContent value="order" className="mt-0 space-y-8">
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-200 bg-gray-50/50">
                  <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                    <ShoppingBag className="h-5 w-5 text-blue-600" />
                    Select Order for Tailoring
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Choose an existing order that requires tailoring work
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search orders by invoice number, customer name, or order ID..."
                      value={searchOrder}
                      onChange={(e) => setSearchOrder(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="font-semibold text-gray-900">Order Details</TableHead>
                          <TableHead className="font-semibold text-gray-900">Customer</TableHead>
                          <TableHead className="font-semibold text-gray-900">Items Requiring Tailoring</TableHead>
                          <TableHead className="font-semibold text-gray-900">Total Value</TableHead>
                          <TableHead className="font-semibold text-gray-900">Priority</TableHead>
                          <TableHead className="font-semibold text-gray-900">Status</TableHead>
                          <TableHead className="font-semibold text-gray-900">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <TableRow
                            key={order.id}
                            className={cn(
                              "hover:bg-gray-50 transition-colors",
                              selectedOrder?.id === order.id && "bg-blue-50 border-l-4 border-l-blue-500",
                            )}
                          >
                            <TableCell>
                              <div>
                                <div className="font-medium text-gray-900">{order.invoiceNumber}</div>
                                <div className="text-sm text-gray-500">{order.id}</div>
                                <div className="text-xs text-gray-400">{format(order.date, "MMM dd, yyyy")}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium text-gray-900">{order.customer.name}</div>
                                <div className="text-sm text-gray-500">{order.customer.phone}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {order.items
                                  .filter((item: any) => item.requiresTailoring)
                                  .map((item: any) => (
                                    <div key={item.id} className="text-sm">
                                      <span className="font-medium">{item.name}</span>
                                      <Badge variant="outline" className="ml-2 text-xs">
                                        {item.type}
                                      </Badge>
                                    </div>
                                  ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-gray-900">AED {order.total}</div>
                            </TableCell>
                            <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                            <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                            <TableCell>
                              <Button
                                variant={selectedOrder?.id === order.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleOrderSelection(order)}
                                className={selectedOrder?.id === order.id ? "bg-blue-600 hover:bg-blue-700" : ""}
                              >
                                {selectedOrder?.id === order.id ? "Selected" : "Select"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {selectedOrder && (
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-blue-900">Selected Order Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-blue-700 font-medium">Customer</div>
                            <div className="text-blue-900">{selectedOrder.customer.name}</div>
                          </div>
                          <div>
                            <div className="text-sm text-blue-700 font-medium">Order Value</div>
                            <div className="text-blue-900">AED {selectedOrder.total}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-blue-700 font-medium mb-2">Items for Tailoring</div>
                          <div className="space-y-2">
                            {orderItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex justify-between items-center p-2 bg-white rounded border"
                              >
                                <span className="font-medium">{item.name}</span>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{item.type}</Badge>
                                  <span className="text-sm">Qty: {item.quantity}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {selectedOrder.notes && (
                          <div>
                            <div className="text-sm text-blue-700 font-medium">Order Notes</div>
                            <div className="text-blue-900 text-sm">{selectedOrder.notes}</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end pt-6 border-t border-gray-200">
                <Button
                  onClick={() => setActiveTab("details")}
                  disabled={!selectedOrder}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  Next: Project Details
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="details" className="mt-0 space-y-8">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Customer Selection */}
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="border-b border-gray-200 bg-gray-50/50">
                    <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                      <User className="h-5 w-5 text-blue-600" />
                      Customer Selection
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Search and select the customer for this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search customers by name, phone, or email..."
                        value={searchCustomer}
                        onChange={(e) => setSearchCustomer(e.target.value)}
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-3">
                      {filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          className={cn(
                            "p-4 rounded-lg border cursor-pointer transition-all duration-200",
                            selectedCustomer?.id === customer.id
                              ? "border-blue-500 bg-blue-50 shadow-sm"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
                          )}
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-600">{customer.phone}</div>
                          <div className="text-sm text-gray-600">{customer.email}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Project Information */}
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="border-b border-gray-200 bg-gray-50/50">
                    <CardTitle className="text-lg text-gray-900">Project Information</CardTitle>
                    <CardDescription className="text-gray-600">
                      Enter the project details and requirements
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                        Project Description
                      </Label>
                      <Input
                        id="description"
                        placeholder="e.g., 2 Custom Kanduras with Traditional Embroidery"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                        Garment Category
                      </Label>
                      <Select>
                        <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select garment category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kandura">Kandura</SelectItem>
                          <SelectItem value="abaya">Abaya</SelectItem>
                          <SelectItem value="formal">Formal Wear</SelectItem>
                          <SelectItem value="alterations">Alterations</SelectItem>
                          <SelectItem value="custom">Custom Design</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Delivery Deadline</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                              !deadline && "text-gray-500",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {deadline ? format(deadline, "PPP") : "Select delivery date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <Checkbox
                        id="rush"
                        checked={isRush}
                        onCheckedChange={(checked) => setIsRush(checked === true)}
                      />
                      <Label htmlFor="rush" className="flex items-center gap-2 text-sm font-medium text-amber-800">
                        <AlertTriangle className="h-4 w-4" />
                        Rush Order (Priority Processing)
                      </Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                        Special Instructions
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special requirements, measurements notes, or design preferences..."
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => setActiveTab("order")} className="border-gray-300">
                  Back to Order Selection
                </Button>
                <Button
                  onClick={() => setActiveTab("tailor")}
                  disabled={!selectedCustomer}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  Next: Assign Tailor
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="tailor" className="mt-0 space-y-6">
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-200 bg-gray-50/50">
                  <CardTitle className="flex items-center gap-2 text-lg text-gray-900">
                    <Scissors className="h-5 w-5 text-blue-600" />
                    Tailor Assignment
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Select the most suitable tailor based on expertise and availability
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search tailors by name, specialty, or skill level..."
                      value={searchTailor}
                      onChange={(e) => setSearchTailor(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="font-semibold text-gray-900">Tailor</TableHead>
                          <TableHead className="font-semibold text-gray-900">Level & Rating</TableHead>
                          <TableHead className="font-semibold text-gray-900">Specialties</TableHead>
                          <TableHead className="font-semibold text-gray-900">Workload</TableHead>
                          <TableHead className="font-semibold text-gray-900">Performance</TableHead>
                          <TableHead className="font-semibold text-gray-900">Status</TableHead>
                          <TableHead className="font-semibold text-gray-900">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTailors.map((tailor) => (
                          <TableRow
                            key={tailor.id}
                            className={cn(
                              "hover:bg-gray-50 transition-colors",
                              selectedTailor?.id === tailor.id && "bg-blue-50 border-l-4 border-l-blue-500",
                            )}
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={tailor.image || "/placeholder.svg"} alt={tailor.name} />
                                  <AvatarFallback className="bg-gray-200 text-gray-700">
                                    {tailor.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-gray-900">{tailor.name}</div>
                                  <div className="text-sm text-gray-500">{tailor.id}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <Badge variant="outline" className="border-blue-200 text-blue-800">
                                  Level {tailor.level}
                                </Badge>
                                <div className="flex items-center gap-1 text-sm">
                                  <span className="text-yellow-500">★</span>
                                  <span className="font-medium text-gray-900">{tailor.rating}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {tailor.specialties.map((specialty) => (
                                  <Badge
                                    key={specialty}
                                    variant="secondary"
                                    className="text-xs bg-gray-100 text-gray-700"
                                  >
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-900">{tailor.currentProjects} active</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {getEfficiencyBadge(tailor.efficiency)}
                                <div className="text-xs text-gray-600">{tailor.efficiency}% efficiency</div>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(tailor.status)}</TableCell>
                            <TableCell>
                              <Button
                                variant={selectedTailor?.id === tailor.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedTailor(tailor)}
                                disabled={tailor.status === "unavailable"}
                                className={selectedTailor?.id === tailor.id ? "bg-blue-600 hover:bg-blue-700" : ""}
                              >
                                {selectedTailor?.id === tailor.id ? "Selected" : "Select"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => setActiveTab("details")} className="border-gray-300">
                  Back to Details
                </Button>
                <Button
                  onClick={() => setActiveTab("review")}
                  disabled={!selectedTailor}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  Review Project
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="review" className="mt-0 space-y-6">
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-200 bg-gray-50/50">
                  <CardTitle className="text-lg text-gray-900">Project Review</CardTitle>
                  <CardDescription className="text-gray-600">
                    Review all project details before creation
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid gap-8 lg:grid-cols-2">
                    {/* Customer Summary */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 text-lg">Customer Information</h3>
                      {selectedCustomer && (
                        <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
                          <div className="font-medium text-gray-900 text-lg">{selectedCustomer.name}</div>
                          <div className="text-gray-600 mt-1">{selectedCustomer.phone}</div>
                          <div className="text-gray-600">{selectedCustomer.email}</div>
                        </div>
                      )}
                    </div>

                    {/* Tailor Summary */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 text-lg">Assigned Tailor</h3>
                      {selectedTailor && (
                        <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={selectedTailor.image || "/placeholder.svg"} alt={selectedTailor.name} />
                              <AvatarFallback className="bg-gray-200 text-gray-700">
                                {selectedTailor.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900 text-lg">{selectedTailor.name}</div>
                              <div className="text-gray-600">
                                Level {selectedTailor.level} • ★ {selectedTailor.rating} • {selectedTailor.efficiency}%
                                efficiency
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Details Summary */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 text-lg">Project Details</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="text-sm text-gray-600 mb-1">Delivery Deadline</div>
                        <div className="font-medium text-gray-900 text-lg">
                          {deadline ? format(deadline, "EEEE, MMMM do, yyyy") : "Not set"}
                        </div>
                      </div>
                      <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="text-sm text-gray-600 mb-1">Priority Level</div>
                        <div className="font-medium text-gray-900 text-lg flex items-center gap-2">
                          {isRush ? (
                            <>
                              <AlertTriangle className="h-5 w-5 text-amber-500" />
                              Rush Order
                            </>
                          ) : (
                            "Standard Priority"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => setActiveTab("tailor")} className="border-gray-300">
                  Back to Tailor Selection
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-medium">
                  Create Project
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  )
}
