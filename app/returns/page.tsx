"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Plus,
  Download,
  Eye,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  FileText,
  Printer,
  Mail,
  BarChart3,
  PieChart,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface ReturnTransaction {
  id: number;
  orderId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  createdAt: Date;
  itemsCount: number;
  totalRefundAmount: number;
  status: "pending" | "approved" | "completed" | "rejected";
  paymentMethod: string;
  // processedBy: string
  // approvedBy?: string
  // requiresManagerApproval: boolean
}

interface ReturnPolicy {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  rules: string[];
  applicableCategories: string[];
  returnPeriod: number;
}

interface ReturnAnalytics {
  totalReturns: number;
  totalRefundAmount: number;
  returnRate: number;
  avgProcessingTime: number;
  topReasons: { reason: string; count: number; percentage: number }[];
  monthlyTrend: { month: string; returns: number; refunds: number }[];
  categoryBreakdown: {
    category: string;
    returns: number;
    percentage: number;
  }[];
}

export default function ReturnsManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [selectedReturn, setSelectedReturn] =
    useState<ReturnTransaction | null>(null);
  const [showReturnDetails, setShowReturnDetails] = useState(false);

  // Sample data
  const { data: returnTransactions = [], isLoading: transactionLoading } =
    useQuery<ReturnTransaction[]>({
      queryKey: ["returns"],
      queryFn: async () => {
        const response = await fetch("http://3.29.240.212/api/v1/returns");
        const json = await response.json();
        if (!response.ok) {
          toast.error("Failed to load return transactions");
        }
        return json;
      },
    });
  const returnPolicies: ReturnPolicy[] = [
    {
      id: "policy_001",
      name: "Standard Return Policy",
      description: "14-day return policy for ready-made items",
      isActive: true,
      applicableCategories: ["Ready-made", "Accessories"],
      returnPeriod: 14,
      rules: [
        "Items must be returned within 14 days of purchase",
        "Original receipt required",
        "Items must have original tags attached",
        "Items must be in unworn, unaltered condition",
        "Refund processed within 3-5 business days",
      ],
    },
    {
      id: "policy_002",
      name: "Custom Order Policy",
      description: "Special policy for custom-made items",
      isActive: true,
      applicableCategories: ["Custom", "Tailored"],
      returnPeriod: 7,
      rules: [
        "Custom orders are final sale",
        "Returns only accepted for manufacturing defects",
        "Quality issues must be reported within 7 days",
        "Customer measurements are final responsibility",
        "Alterations may be offered instead of refund",
      ],
    },
    {
      id: "policy_003",
      name: "Premium Item Policy",
      description: "Extended return policy for premium items",
      isActive: true,
      applicableCategories: ["Premium", "Luxury"],
      returnPeriod: 30,
      rules: [
        "Extended 30-day return period",
        "White glove return service available",
        "Professional cleaning before return accepted",
        "Certificate of authenticity required",
        "Manager approval required for high-value items",
      ],
    },
  ];

  const analytics: ReturnAnalytics = {
    totalReturns: 45,
    totalRefundAmount: 12450.0,
    returnRate: 3.2,
    avgProcessingTime: 2.5,
    topReasons: [
      { reason: "Size/Fit Issue", count: 18, percentage: 40 },
      { reason: "Quality/Defect", count: 12, percentage: 27 },
      { reason: "Customer Changed Mind", count: 8, percentage: 18 },
      { reason: "Wrong Item", count: 4, percentage: 9 },
      { reason: "Other", count: 3, percentage: 6 },
    ],
    monthlyTrend: [
      { month: "Jan", returns: 12, refunds: 3200 },
      { month: "Feb", returns: 8, refunds: 2100 },
      { month: "Mar", returns: 15, refunds: 4200 },
      { month: "Apr", returns: 10, refunds: 2950 },
      { month: "May", returns: 18, refunds: 5100 },
    ],
    categoryBreakdown: [
      { category: "Ready-made", returns: 25, percentage: 56 },
      { category: "Custom", returns: 12, percentage: 27 },
      { category: "Accessories", returns: 8, percentage: 17 },
    ],
  };

  // Filter functions
  const filteredTransactions = returnTransactions.filter((transaction) => {
    const matchesSearch =
      String(transaction.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.customerName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.orderId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "approved":
        return "secondary";
      case "pending":
        return "destructive";
      case "rejected":
        return "outline";
      default:
        return "outline";
    }
  };

  const exportReturnsData = () => {
    alert("Returns data exported successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Returns Management
          </h1>
          <p className="text-muted-foreground">
            Manage returns, refunds, and customer satisfaction
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportReturnsData}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button asChild>
            <Link href="/returns/new">
              <Plus className="mr-2 h-4 w-4" />
              New Return
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalReturns}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                12% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              AED {analytics.totalRefundAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                8% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.returnRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                0.5% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Processing Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.avgProcessingTime} days
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                0.3 days faster
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="returns" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="returns">Return Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Reports</TabsTrigger>
          <TabsTrigger value="policies">Return Policies</TabsTrigger>
        </TabsList>

        {/* Returns Tab */}
        <TabsContent value="returns" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Returns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by return ID, customer, or order..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Returns Table */}
          <Card>
            <CardHeader>
              <CardTitle>Return Transactions</CardTitle>
              <CardDescription>
                Manage and track all return transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Return ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Refund Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((returnTx) => (
                    <TableRow key={returnTx.id}>
                      <TableCell className="font-medium">
                        {returnTx.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {returnTx.customerName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {returnTx.customerPhone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{returnTx.orderId}</TableCell>
                      <TableCell>
                        {new Date(returnTx.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{returnTx.itemsCount}</TableCell>
                      <TableCell>AED {returnTx.totalRefundAmount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(returnTx.status)}>
                            {returnTx.status.charAt(0).toUpperCase() +
                              returnTx.status.slice(1)}
                          </Badge>
                          {true && (
                            <Badge variant="outline" className="text-xs">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Approval Required
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/returns/${returnTx.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="mr-2 h-4 w-4" />
                              Print Receipt
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Email Customer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {returnTx.status === "pending" && (
                              <>
                                <DropdownMenuItem>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve Return
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <AlertCircle className="mr-2 h-4 w-4" />
                                  Reject Return
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Return Reasons Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Return Reasons Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topReasons.map((reason, index) => (
                    <div
                      key={reason.reason}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full bg-primary`}
                          style={{ opacity: 1 - index * 0.2 }}
                        />
                        <span className="text-sm">{reason.reason}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${reason.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {reason.percentage}%
                        </span>
                        <span className="text-xs text-muted-foreground w-8 text-right">
                          ({reason.count})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Category Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.categoryBreakdown.map((category, index) => (
                    <div
                      key={category.category}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full bg-blue-500`}
                          style={{ opacity: 1 - index * 0.3 }}
                        />
                        <span className="text-sm">{category.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {category.percentage}%
                        </span>
                        <span className="text-xs text-muted-foreground w-8 text-right">
                          ({category.returns})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trend */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Monthly Return Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-4">
                    {analytics.monthlyTrend.map((month) => (
                      <div key={month.month} className="text-center">
                        <div className="text-sm text-muted-foreground mb-2">
                          {month.month}
                        </div>
                        <div className="space-y-1">
                          <div className="text-lg font-bold">
                            {month.returns}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Returns
                          </div>
                          <div className="text-sm font-medium text-green-600">
                            AED {month.refunds.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Refunds
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">94%</div>
                    <div className="text-sm text-muted-foreground">
                      Customer Satisfaction
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      2.1 days
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg Resolution Time
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      89%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      First-Time Resolution
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      AED 277
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg Return Value
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies" className="space-y-4">
          <div className="grid gap-4">
            {returnPolicies.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {policy.name}
                        <Badge
                          variant={policy.isActive ? "default" : "secondary"}
                        >
                          {policy.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{policy.description}</CardDescription>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href="/settings/policies">
                        <FileText className="mr-2 h-4 w-4" />
                        Edit Policy
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Policy Rules:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {policy.rules.map((rule, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Policy Details:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Return Period:
                          </span>
                          <span className="font-medium">
                            {policy.returnPeriod} days
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Applicable Categories:
                          </span>
                          <span className="font-medium">
                            {policy.applicableCategories.join(", ")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge
                            variant={policy.isActive ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {policy.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
