"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Filter,
  UserPlus,
  Users,
  Star,
  TrendingUp,
  Phone,
} from "lucide-react";
import { CustomerGroupTable } from "./customer-group-table";
import Link from "next/link";
import { useState } from "react";
import { useCustomerGroups, useCustomerStats } from "./use-customers";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: customerGroupsData,
    isLoading: isLoadingGroups,
    error: groupsError,
  } = useCustomerGroups();
  const {
    data: statsData,
    isLoading: isLoadingStats,
    error: statsError,
  } = useCustomerStats();

  // Format percentage change
  const formatPercentChange = (value: number | null) => {
    if (value === null) return "N/A";
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `AED ${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `AED ${(value / 1000).toFixed(0)}K`;
    }
    return `AED ${value.toLocaleString()}`;
  };

  const stats = [
    {
      title: "Customer Groups",
      value: isLoadingStats ? "..." : statsData?.totalGroups.toString() || "0",
      change: isLoadingStats
        ? "..."
        : formatPercentChange(statsData?.groupsPercentChange || null),
      icon: Phone,
      color: "text-blue-600",
    },
    {
      title: "Total Customers",
      value: isLoadingStats
        ? "..."
        : statsData?.totalCustomers.toString() || "0",
      change: isLoadingStats
        ? "..."
        : formatPercentChange(statsData?.customersPercentChange || null),
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "VIP Customers",
      value: isLoadingStats ? "..." : statsData?.totalVips.toString() || "0",
      change: isLoadingStats
        ? "..."
        : formatPercentChange(statsData?.vipsPercentChange || null),
      icon: Star,
      color: "text-amber-600",
    },
    {
      title: "Monthly Revenue",
      value: isLoadingStats
        ? "..."
        : formatCurrency(statsData?.totalRevenue || 0),
      change: isLoadingStats
        ? "..."
        : formatPercentChange(statsData?.revenuePercentChange || null),
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Customer Management
          </h1>
          <p className="text-muted-foreground">
            Manage customers grouped by phone numbers
          </p>
        </div>
        <Link href="/customers/form/new">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ) : statsError ? (
                <div className="text-sm text-red-500">Error loading stats</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span
                      className={
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : stat.change.startsWith("-")
                            ? "text-red-600"
                            : "text-muted-foreground"
                      }
                    >
                      {stat.change}
                    </span>{" "}
                    from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, phone number, or group ID..."
            className="pl-8 w-full md:w-[400px] lg:w-[500px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Customer Groups Table */}
      {isLoadingGroups ? (
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : groupsError ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500">
              Error loading customer data. Please try again later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <CustomerGroupTable
          customerGroups={customerGroupsData || []}
          searchQuery={searchQuery}
        />
      )}
    </div>
  );
}
