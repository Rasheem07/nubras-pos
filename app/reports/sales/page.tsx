"use client"
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Receipt } from 'lucide-react';

const SalesReportDashboard = () => {
  // Sample data - replace with actual data fetching
  const dailySalesData = [
    { day: '2024-01-01', sales: 15420 },
    { day: '2024-01-02', sales: 18650 },
    { day: '2024-01-03', sales: 12340 },
    { day: '2024-01-04', sales: 21750 },
    { day: '2024-01-05', sales: 19200 },
    { day: '2024-01-06', sales: 16800 },
    { day: '2024-01-07', sales: 22100 },
    { day: '2024-01-08', sales: 17500 },
    { day: '2024-01-09', sales: 19800 },
    { day: '2024-01-10', sales: 16200 }
  ];

  const topProductsData = [
    { product: 'Wireless Headphones', revenue: 45620 },
    { product: 'Smartphone Case', revenue: 32400 },
    { product: 'Bluetooth Speaker', revenue: 28750 },
    { product: 'Laptop Stand', revenue: 24300 },
    { product: 'USB Cable', revenue: 19800 },
    { product: 'Power Bank', revenue: 18500 },
    { product: 'Screen Protector', revenue: 15200 },
    { product: 'Wireless Charger', revenue: 12800 },
    { product: 'Tablet Cover', revenue: 11600 },
    { product: 'Car Mount', revenue: 9400 }
  ];
  type KPICardProps = {
    title: string;
    value: string | number;
    change: string;
    icon: React.ElementType;
    trend: 'up' | 'down';
  };

  const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon: Icon, trend }) => (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="flex items-center text-xs text-slate-600 mt-1">
          {trend === 'up' ? (
            <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
          )}
          <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
            {change}
          </span>
          <span className="ml-1">vs last period</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-bold text-slate-900">Sales Report</h1>
          <p className="text-slate-600 mt-1">Monitor revenue trends and performance metrics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Sales (YTD)"
            value="$2.4M"
            change="+12.5%"
            icon={DollarSign}
            trend="up"
          />
          <KPICard
            title="Order Count (MTD)"
            value="1,847"
            change="+8.3%"
            icon={ShoppingCart}
            trend="up"
          />
          <KPICard
            title="Average Order Value"
            value="$127.50"
            change="+3.2%"
            icon={Receipt}
            trend="up"
          />
          <KPICard
            title="Sales Growth"
            value="15.7%"
            change="-2.1%"
            icon={TrendingUp}
            trend="down"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Sales Trend */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">Daily Sales Trend</CardTitle>
              <CardDescription className="text-slate-600">
                Total sales for the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">Top 10 Products by Revenue</CardTitle>
              <CardDescription className="text-slate-600">
                Best performing products this period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProductsData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    type="number"
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <YAxis 
                    type="category"
                    dataKey="product"
                    stroke="#64748b"
                    fontSize={11}
                    width={120}
                    tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="#64748b"
                    radius={[0, 2, 2, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">Sales Alerts</CardTitle>
            <CardDescription className="text-slate-600">
              Current alerts and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm text-green-800">Sales performance is above target for this period</span>
              </div>
              <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <TrendingDown className="h-4 w-4 text-yellow-600 mr-2" />
                <span className="text-sm text-yellow-800">Wireless Charger sales down 15% - consider promotion</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesReportDashboard;