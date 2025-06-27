"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Calendar as CalendarIcon,
  Filter, Download, RefreshCw, AlertTriangle, CheckCircle, Clock, Eye, EyeOff,
  ArrowUpRight, ArrowDownRight, Minus, Search, Settings, MoreHorizontal,
  Share2,
  Loader2,
  Copy,
  MessageCircle,
  Mail
} from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Link from 'next/link';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useSearchParams } from 'next/navigation';

const BASE_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

// --- Types ---
type DatePresetKey =
  | 'today'
  | 'yesterday'
  | '7days'
  | '14days'
  | '30days'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisQuarter'
  | 'thisYear';

type DatePreset = {
  label: string;
  key: DatePresetKey;
  days: number | null;
};

type PaymentStatusId = 'no-payment' | 'partial' | 'completed';

type PaymentStatus = {
  id: PaymentStatusId;
  label: string;
  color: string;
};

type ProductTypeId = 'ready-made' | 'custom';

type ProductType = {
  id: ProductTypeId;
  label: string;
};

type Customer = {
  id: string;
  name: string;
  phone: string;
};

type SalesPerson = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
};

type ReportSummary = {
  totalRevenue: number;
  netProfit: number;
  totalOrders: number;
  avgOrderValue: number;
  outstandingReceivables: number;
  topInsights: string[];
  paymentStatusCounts: Record<PaymentStatusId, number>;
  totalTax: number;
  totalDiscount: number;
  cashCollected: number;
};

type ReportTimeSeries = {
  dailyRevenue: { date: string; revenue: number }[];
  orderCount: { date: string; count: number }[];
  avgDaysToPay: number;
  discountRate: number;
};

type ReportCustomer = {
  rank: number;
  customerName: string;
  orders: number;
  avgOrder: number;
  spend: number;
  churnRisk?: boolean;
};

type ReportCategory = {
  categoryName: string;
  revenue: number;
  ordersCount: number;
  avgOrderValue: number;
};

type ReportPaymentSplit = {
  method: string;
  amount: number;
  txnCount: number;
};

type ReportAgingBucket = {
  label: string;
  amount: number;
};

type ReportAging = {
  buckets: ReportAgingBucket[];
  overdueAmount: number;
  overdueCount: number;
};

type ReportData = {
  summary: ReportSummary;
  timeSeries: ReportTimeSeries;
  customers: ReportCustomer[];
  categories: ReportCategory[];
  paymentSplit: ReportPaymentSplit[];
  aging: ReportAging;
};

type CustomDateRange = {
  from: Date | null;
  to: Date | null;
};

// --- Constants ---
const DATE_PRESETS: DatePreset[] = [
  { label: 'Today', key: 'today', days: 0 },
  { label: 'Yesterday', key: 'yesterday', days: 1 },
  { label: 'Last 7 days', key: '7days', days: 7 },
  { label: 'Last 14 days', key: '14days', days: 14 },
  { label: 'Last 30 days', key: '30days', days: 30 },
  { label: 'This month', key: 'thisMonth', days: null },
  { label: 'Last month', key: 'lastMonth', days: null },
  { label: 'This quarter', key: 'thisQuarter', days: null },
  { label: 'This year', key: 'thisYear', days: null },
];

const PAYMENT_STATUSES: PaymentStatus[] = [
  { id: 'no-payment', label: 'No Payment', color: 'bg-red-500' },
  { id: 'partial', label: 'Partial Payment', color: 'bg-yellow-500' },
  { id: 'completed', label: 'Completed', color: 'bg-green-500' },
];

const PRODUCT_TYPES: ProductType[] = [
  { id: 'ready-made', label: 'Ready Made' },
  { id: 'custom', label: 'Custom' },
];

// --- Component ---
export default function BusinessIntelligenceDashboard() {
  const search = useSearchParams()
  const id = search.get('id')
  // State management
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // Filter states
  const [datePreset, setDatePreset] = useState<DatePresetKey>('30days');
  const [customDateRange, setCustomDateRange] = useState<CustomDateRange>({ from: null, to: null });
  const [useCustomDate, setUseCustomDate] = useState<boolean>(false);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [selectedSalesPersons, setSelectedSalesPersons] = useState<string[]>([]);
  const [selectedPaymentStatuses, setSelectedPaymentStatuses] = useState<PaymentStatusId[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState<ProductTypeId[]>([]);

  // Data sources
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [salesPersons, setSalesPersons] = useState<SalesPerson[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // UI states
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [searchCustomer, setSearchCustomer] = useState<string>('');
  const [searchSalesPerson, setSearchSalesPerson] = useState<string>('');
  const [searchCategory, setSearchCategory] = useState<string>('');

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const [day, month, year] = dateString.split('/');
    const date = new Date(`${year}-${month}-${day}`);

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDateRange = useCallback((preset: DatePresetKey) => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    switch (preset) {
      case 'today':
        return {
          startDate: startOfDay.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        };
      case 'yesterday':
        const yesterday = new Date(startOfDay);
        yesterday.setDate(yesterday.getDate() - 1);
        return {
          startDate: yesterday.toISOString().split('T')[0],
          endDate: yesterday.toISOString().split('T')[0]
        };
      case 'thisMonth':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return {
          startDate: startOfMonth.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        };
      case 'lastMonth':
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        return {
          startDate: lastMonth.toISOString().split('T')[0],
          endDate: endOfLastMonth.toISOString().split('T')[0]
        };
      case 'thisQuarter':
        const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        return {
          startDate: quarterStart.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        };
      case 'thisYear':
        const yearStart = new Date(today.getFullYear(), 0, 1);
        return {
          startDate: yearStart.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        };
      default:
        const preset_config = DATE_PRESETS.find(p => p.key === preset);
        if (preset_config && preset_config.days !== null) {
          const startDate = new Date(startOfDay);
          startDate.setDate(startDate.getDate() - preset_config.days);
          return {
            startDate: startDate.toISOString().split('T')[0],
            endDate: today.toISOString().split('T')[0]
          };
        }
        return {
          startDate: startOfDay.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0]
        };
    }
  }, []);

  // API calls
  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/customers/list`);
      const data: Customer[] = await response.json();
      setCustomers(data);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    }
  };

  const fetchSalesPersons = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/staff/list/sales-persons`);
      const data: SalesPerson[] = await response.json();
      setSalesPersons(data);
    } catch (err) {
      console.error('Failed to fetch sales persons:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/products/list/categories`);
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchReportData = async () => {
    setLoading(true);
    setError(null);

    try {
      const dateRange = useCustomDate ? {
        startDate: customDateRange.from?.toISOString().split('T')[0],
        endDate: customDateRange.to?.toISOString().split('T')[0]
      } : getDateRange(datePreset);

      const filters: Record<string, any> = {
        ...dateRange,
        ...(selectedCustomers.length > 0 && { customerIds: selectedCustomers }),
        ...(selectedSalesPersons.length > 0 && { salesPersonIds: selectedSalesPersons }),
        ...(selectedPaymentStatuses.length > 0 && { paymentStatuses: selectedPaymentStatuses }),
        ...(selectedCategories.length > 0 && { categoryNames: selectedCategories }),
        ...(selectedProductTypes.length > 0 && { productTypes: selectedProductTypes }),
      };


      const response = await fetch(`${BASE_API_URL}/reports/share?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        if(response.status === 404) {
          setError('404 Not Found: The requested report does not exist.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ReportData = await response.json();
      setReportData(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to fetch report data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription className="text-red-600">
              <p className="text-sm">Error fetching report data: {error}</p>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Effects
  useEffect(() => {
    fetchCustomers();
    fetchSalesPersons();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchReportData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datePreset, useCustomDate, customDateRange, selectedCustomers, selectedSalesPersons, selectedPaymentStatuses, selectedCategories, selectedProductTypes]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchReportData, 1000 * 10); // Refresh every second
      setRefreshInterval(interval as unknown as NodeJS.Timeout);
      return () => clearInterval(interval);
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh]);



  // Chart colors
  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

  const { startDate, endDate } = useCustomDate
    ? {
      startDate: customDateRange.from?.toISOString().slice(0, 10)!,
      endDate: customDateRange.to?.toISOString().slice(0, 10)!,
    }
    : getDateRange(datePreset)




  const formatDateISO = (iso: string): string => {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';        // safety
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };


  return (
    <div className="min-h-screen bg-gray-50  space-y-6" id='report-container'>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Al Nubras Report</h1>
              <p className="text-sm text-gray-600 mt-1">
                from {formatDateISO(startDate)} to {formatDateISO(endDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {
        loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
              <p className="text-gray-600">Loading business insights...</p>
            </div>
          </div>
        )
      }

      {
        reportData && (
          <div className='space-y-6'>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">
                    {formatCurrency(reportData.summary.totalRevenue)}
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Net Profit: {formatCurrency(reportData.summary.netProfit)}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">
                    {reportData.summary.totalOrders}
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Avg Order: {formatCurrency(reportData.summary.avgOrderValue)}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700">Outstanding</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">
                    {formatCurrency(reportData.summary.outstandingReceivables)}
                  </div>
                  <p className="text-xs text-purple-600 mt-1">
                    {reportData.aging.overdueCount} overdue accounts
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-700">Payment Time</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-900">
                    {Math.round(reportData.timeSeries.avgDaysToPay)} days
                  </div>
                  <p className="text-xs text-yellow-600 mt-1">
                    Average payment time
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Insights Alert */}
            {reportData.summary.topInsights && reportData.summary.topInsights.length > 0 && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <div className="space-y-2">
                  <h4 className="font-medium text-amber-800">Key Insights</h4>
                  <div className="space-y-1">
                    {reportData.summary.topInsights.map((insight, index) => (
                      <p key={index} className="text-sm text-amber-700">{insight}</p>
                    ))}
                  </div>
                </div>
              </Alert>
            )}

            {/* Charts and Analytics */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue Trend */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <span>Revenue Trend</span>
                      </CardTitle>
                      <CardDescription>Daily revenue over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={reportData.timeSeries.dailyRevenue}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            tickFormatter={formatDateISO}
                          />
                          <YAxis
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `AED ${(value / 1000).toFixed(0)}K`}
                          />
                          <Tooltip
                            formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                            labelFormatter={formatDateISO}
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#3b82f6"
                            fill="url(#colorRevenue)"
                            strokeWidth={2}
                          />
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Order Count Trend */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <ShoppingCart className="w-5 h-5 text-green-600" />
                        <span>Order Volume</span>
                      </CardTitle>
                      <CardDescription>Daily order count</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={reportData.timeSeries.orderCount}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            tickFormatter={formatDateISO}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip
                            formatter={(value) => [value, 'Orders']}
                            labelFormatter={formatDateISO}
                          />
                          <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Payment Status Distribution */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-500 to-green-500" />
                      <span>Payment Status Overview</span>
                    </CardTitle>
                    <CardDescription>Distribution of payment statuses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      {/* Pie chart */}
                      <div className="flex justify-center">
                        <div className="w-full max-w-xs h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={Object.entries(reportData.summary.paymentStatusCounts).map(
                                  ([status, count]) => ({
                                    name: PAYMENT_STATUSES.find(s => s.id === status)?.label || status,
                                    value: count,
                                  })
                                )}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={120}
                                paddingAngle={4}
                                dataKey="value"
                                label={({ name, percent }) =>
                                  `${name}: ${(percent * 100).toFixed(0)}%`
                                }
                                labelLine={false}
                              >
                                {Object.keys(reportData.summary.paymentStatusCounts).map(
                                  (status, idx) => (
                                    <Cell
                                      key={idx}
                                      fill={
                                        status === 'completed'
                                          ? '#10b981'
                                          : status === 'partial'
                                            ? '#f59e0b'
                                            : '#ef4444'
                                      }
                                    />
                                  )
                                )}
                              </Pie>
                              <Legend verticalAlign="bottom" height={36} />
                              <Tooltip formatter={(value, name) => [`${value}`, name]} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Status bars */}
                      <div className="space-y-6">
                        {Object.entries(reportData.summary.paymentStatusCounts).map(
                          ([status, count]) => {
                            const cfg = PAYMENT_STATUSES.find(s => s.id === status)!;
                            const pct = (count / reportData.summary.totalOrders) * 100;
                            return (
                              <div key={status} className="flex flex-col">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center space-x-2">
                                    <span className={`w-3 h-3 rounded-full ${cfg.color}`} />
                                    <span className="text-sm font-medium">{cfg.label}</span>
                                  </div>
                                  <span className="text-sm text-gray-600">
                                    {count} ({pct.toFixed(1)}%)
                                  </span>
                                </div>
                                <Progress
                                  value={pct}
                                  className="h-2 rounded-full bg-gray-200"
                                />
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="revenue" className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Detailed Revenue Chart */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Revenue Analytics</CardTitle>
                      <CardDescription>
                        Comprehensive revenue analysis with trend indicators
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={reportData.timeSeries.dailyRevenue}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            tickFormatter={formatDateISO}
                          />
                          <YAxis
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `AED ${(value / 1000).toFixed(0)}K`}
                          />
                          <Tooltip
                            formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                            labelFormatter={formatDateISO}
                          />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Revenue Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Revenue Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Gross Revenue</span>
                            <span className="font-medium">{formatCurrency(reportData.summary.totalRevenue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total Tax</span>
                            <span className="font-medium text-red-600">-{formatCurrency(reportData.summary.totalTax)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total Discount</span>
                            <span className="font-medium text-red-600">-{formatCurrency(reportData.summary.totalDiscount)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-medium">Net Profit</span>
                            <span className="font-bold text-green-600">{formatCurrency(reportData.summary.netProfit)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-gray-600">Discount Rate</span>
                              <span className="text-sm font-medium">{reportData.timeSeries.discountRate.toFixed(1)}%</span>
                            </div>
                            <Progress value={reportData.timeSeries.discountRate} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-gray-600">Profit Margin</span>
                              <span className="text-sm font-medium">
                                {((reportData.summary.netProfit / reportData.summary.totalRevenue) * 100).toFixed(1)}%
                              </span>
                            </div>
                            <Progress
                              value={(reportData.summary.netProfit / reportData.summary.totalRevenue) * 100}
                              className="h-2"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Cash Flow</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Cash Collected</span>
                            <span className="font-medium text-green-600">{formatCurrency(reportData.summary.cashCollected)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Outstanding</span>
                            <span className="font-medium text-orange-600">{formatCurrency(reportData.summary.outstandingReceivables)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-medium">Collection Rate</span>
                            <span className="font-bold">
                              {((reportData.summary.cashCollected / reportData.summary.totalRevenue) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="customers" className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Top Customers */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        <span>Top Customers</span>
                      </CardTitle>
                      <CardDescription>
                        Your most valuable customers ranked by total spend
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {reportData.customers.slice(0, 8).map((customer, index) => (
                          <div key={customer.rank} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                            <div className="flex-shrink-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                index === 1 ? 'bg-gray-100 text-gray-800' :
                                  index === 2 ? 'bg-orange-100 text-orange-800' :
                                    'bg-blue-100 text-blue-800'
                                }`}>
                                {customer.rank}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {customer.customerName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {customer.orders} orders • Avg: {formatCurrency(customer.avgOrder)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">
                                {formatCurrency(customer.spend)}
                              </p>
                              {customer.churnRisk && (
                                <Badge variant="destructive" className="mt-1">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Risk
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Customer Analytics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle>Customer Distribution</CardTitle>
                        <CardDescription>Revenue distribution by customer</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={reportData.customers.slice(0, 6)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                              dataKey="customerName"
                              tick={{ fontSize: 12 }}
                              angle={-45}
                              textAnchor="end"
                              height={100}
                            />
                            <YAxis
                              tick={{ fontSize: 12 }}
                              tickFormatter={(value) => `AED ${(value / 1000).toFixed(0)}K`}
                            />
                            <Tooltip
                              formatter={(value) => [formatCurrency(Number(value)), 'Total Spend']}
                            />
                            <Bar dataKey="spend" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle>Customer Metrics</CardTitle>
                        <CardDescription>Key customer performance indicators</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{reportData.customers.length}</div>
                            <div className="text-sm text-gray-600">Total Customers</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {formatCurrency(reportData.customers.reduce((sum, c) => sum + c.spend, 0) / reportData.customers.length)}
                            </div>
                            <div className="text-sm text-gray-600">Avg Customer Value</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-gray-600">Customer Concentration</span>
                              <span className="text-sm font-medium">
                                {((reportData.customers[0]?.spend || 0) / reportData.summary.totalRevenue * 100).toFixed(1)}%
                              </span>
                            </div>
                            <Progress
                              value={(reportData.customers[0]?.spend || 0) / reportData.summary.totalRevenue * 100}
                              className="h-2"
                            />
                            <p className="text-xs text-gray-500 mt-1">Top customer's share of revenue</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="categories" className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Category Performance */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Category Performance</CardTitle>
                      <CardDescription>Revenue and order analysis by product category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {reportData.categories.map((category, index) => (
                          <Card key={index} className="border border-gray-200">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">
                                {category.categoryName || 'Uncategorized'}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Revenue</span>
                                  <span className="font-bold">{formatCurrency(category.revenue)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Orders</span>
                                  <span className="font-medium">{category.ordersCount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Avg Order</span>
                                  <span className="font-medium">{formatCurrency(category.avgOrderValue)}</span>
                                </div>
                              </div>
                              <div className="pt-2 border-t">
                                <div className="text-center">
                                  <div className="text-sm text-gray-600 mb-1">Revenue Share</div>
                                  <div className="font-bold text-lg">
                                    {((category.revenue / reportData.summary.totalRevenue) * 100).toFixed(1)}%
                                  </div>
                                  <Progress
                                    value={(category.revenue / reportData.summary.totalRevenue) * 100}
                                    className="h-2 mt-2"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Category Comparison Chart */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Category Comparison</CardTitle>
                      <CardDescription>Revenue comparison across categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={reportData.categories}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis
                            dataKey="categoryName"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => value || 'Uncategorized'}
                          />
                          <YAxis
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `AED ${(value / 1000).toFixed(0)}K`}
                          />
                          <Tooltip
                            formatter={(value, name) => [
                              name === 'revenue' ? formatCurrency(Number(value)) : value,
                              name === 'revenue' ? 'Revenue' : 'Orders'
                            ]}
                            labelFormatter={(label) => label || 'Uncategorized'}
                          />
                          <Bar dataKey="revenue" fill="#3b82f6" name="revenue" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="ordersCount" fill="#10b981" name="ordersCount" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="payments" className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Payment Methods */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>Payment Methods</CardTitle>
                      <CardDescription>Breakdown of payment methods used</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {reportData.paymentSplit.map((payment, index) => (
                            <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                              <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                <div>
                                  <p className="font-medium capitalize">{payment.method}</p>
                                  <p className="text-sm text-gray-600">{payment.txnCount} transactions</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">{formatCurrency(payment.amount)}</p>
                                <p className="text-sm text-gray-600">
                                  {((payment.amount / reportData.summary.totalRevenue) * 100).toFixed(1)}%
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={reportData.paymentSplit.map((payment) => ({
                                  name: payment.method,
                                  value: payment.amount
                                }))}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {reportData.paymentSplit.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Aging Analysis */}
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <span>Receivables Aging</span>
                      </CardTitle>
                      <CardDescription>
                        Outstanding receivables categorized by age
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {reportData.aging.buckets.map((bucket, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">{bucket.label}</span>
                                <span className="text-sm font-bold">{formatCurrency(bucket.amount)}</span>
                              </div>
                              <Progress
                                value={(bucket.amount / reportData.summary.outstandingReceivables) * 100}
                                className={`h-3 ${bucket.label.includes('>90') ? 'bg-red-100' :
                                  bucket.label.includes('61-90') ? 'bg-orange-100' :
                                    bucket.label.includes('31-60') ? 'bg-yellow-100' : 'bg-green-100'
                                  }`}
                              />
                            </div>
                          ))}
                          <div className="mt-4 flex justify-between font-bold">
                            <span>Total Overdue</span>
                            <span>{formatCurrency(reportData.aging.overdueAmount)} ({reportData.aging.overdueCount} items)</span>
                          </div>
                        </div>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={reportData.aging.buckets.map(b => ({ name: b.label, value: b.amount }))}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={80}
                                dataKey="value"
                              >
                                {reportData.aging.buckets.map((entry, idx) => (
                                  <Cell key={`cell-${idx}`} fill={['#10b981', '#f59e0b', '#ef4444', '#3b82f6'][idx]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

              </TabsContent>
            </Tabs>
          </div>
        )
      }
    </div >
  )
}

