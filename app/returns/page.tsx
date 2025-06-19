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
import { queryClient } from "@/components/providers";
import { Skeleton } from "@/components/ui/skeleton";

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
        const response = await fetch("https://api.alnubras.co/api/v1/returns", {
          credentials: "include",
        });
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

  const { data: analytics, isLoading: analyticsLoading } =
    useQuery<ReturnAnalytics>({
      queryKey: ["returns-analytics"],
      queryFn: async () => {
        const res = await fetch(
          "https://api.alnubras.co/api/v1/returns/analytics",
          { credentials: "include" }
        );
        if (!res.ok) {
          toast.error("Failed to load analytics");
          return null;
        }
        return res.json();
      },
    });

  const exportReturnsData = () => {
    fetch("https://api.alnubras.co/api/v1/returns/export", {
      credentials: "include",
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "returns_export.csv";
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => toast.error("Export failed"));
  };

  // Filter functions
  const filteredTransactions = returnTransactions.filter((transaction) => {
    const matchesSearch =
      String(transaction.id)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.customerName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      String(transaction.orderId)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

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

  const updateStatus = async (id: number, status: string) => {
    const approveUrl = `https://api.alnubras.co/api/v1/returns/status/${id}`;
    fetch(approveUrl, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to approve return");
        }
        return res.json();
      })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["returns"] });
        queryClient.invalidateQueries({ queryKey: ["returns-analytics"] });
        toast.success("Return approved successfully");
        // Optionally, refetch data here
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const statsData = [
    {
      title: "Total Returns",
      icon: Package,
      value: analytics?.totalReturns?.toLocaleString(),
      gradient: "from-purple-600/80 via-purple-700/80 to-pink-600/80",
    },
    {
      title: "Total Refunds",
      icon: DollarSign,
      value: analytics?.totalRefundAmount && `AED ${analytics.totalRefundAmount.toLocaleString()}`,
      gradient: "from-green-500/80 via-emerald-600/80 to-teal-600/80",
    },
    {
      title: "Return Rate",
      icon: BarChart3,
      value: analytics?.returnRate && `${analytics.returnRate}%`,
      gradient: "from-blue-500/80 via-cyan-600/80 to-indigo-600/80",
    },
    {
      title: "Avg Processing Time",
      icon: Clock,
      value: analytics?.avgProcessingTime && `${analytics.avgProcessingTime} days`,
      gradient: "from-orange-500/80 via-red-500/80 to-pink-600/80",
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
        {statsData.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.title}
            icon={stat.icon}
            value={stat.value}
            isLoading={analyticsLoading}
          />
        ))}
      </div>

      {/* Floating background elements */}
     

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
                          {returnTx.status === "pending" && (
                            <Badge variant="outline" className="text-xs">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Approval Required
                            </Badge>
                          )}
                          {returnTx.status === "approved" && (
                            <Button
                              size={"sm"}
                              variant="outline"
                              className="bg-green-100 text-green-600 text-xs h-8"
                              onClick={() =>
                                updateStatus(returnTx.id, "completed")
                              }
                            >
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Mark as Completed
                            </Button>
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
                            <DropdownMenuItem
                              onClick={() => {
                                const receiptUrl = `https://api.alnubras.co/api/v1/returns/receipt/${returnTx.id}`;
                                window.open(receiptUrl, "_blank");
                              }}
                            >
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
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateStatus(returnTx.id, "approved")
                                  }
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve Return
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateStatus(returnTx.id, "rejected")
                                  }
                                >
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
                  {analyticsLoading ? (
                    <div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-full mb-2" />
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-full mb-2" />
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-full" />
                    </div>
                  ) : (
                    analytics &&
                    analytics.topReasons.map((reason, index) => (
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
                    ))
                  )}
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
                  {analytics &&
                    analytics.categoryBreakdown.map((category, index) => (
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
                    {analytics &&
                      analytics.monthlyTrend.map((month) => (
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

type StatCardProps = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  value: React.ReactNode;
  isLoading: boolean;
};


export const StatCard = ({ title, icon: Icon, value, isLoading }: StatCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          <div className="text-2xl font-bold text-center">
            {value ?? "-"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
