"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Users, AlertTriangle, Target, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode } from "react";

// Define the Kpis type based on the expected API response
type Kpis = {
  activeProjects: number;
  avgCompletionDays: number;
  activeTailors: number;
  rushOrders: number;
};

type KPICardProps = {
  title: string;
  value: string | number | ReactNode;
  change?: string;
  icon: React.ElementType;
  trend?: "up" | "down";
};

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  trend,
}) => (
  <Card className="border-slate-200">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-slate-600">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-slate-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      {change && trend && (
        <div className="flex items-center text-xs text-slate-600 mt-1">
          {trend === "up" ? (
            <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
          )}
          <span className={trend === "up" ? "text-green-600" : "text-red-600"}>
            {change}
          </span>
          <span className="ml-1">vs last period</span>
        </div>
      )}
    </CardContent>
  </Card>
);

export function TailoringAnalytics() {
  const { data: kpis, isLoading } = useQuery<Kpis>({
    queryKey: ["tailoringKpis"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tailoring/kpis`,
        { credentials: "include" }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to fetch KPIs");
      }
      return data as Kpis;
    },
    refetchInterval: 60000,
  });

  const kpiCards = [
    {
      title: "Active Projects",
      value: isLoading ? <Skeleton className="h-10 w-24 my-2" /> : kpis?.activeProjects ?? "-",
      icon: Target,
    },
    {
      title: "Avg. Completion Time",
      value: isLoading ? <Skeleton className="h-10 w-24 my-2" /> : kpis?.avgCompletionDays ?? "-",
      icon: Clock,
    },
    {
      title: "Active Tailors",
      value: isLoading ? <Skeleton className="h-10 w-24 my-2" /> : kpis?.activeTailors ?? "-",
      icon: Users,
    },
    {
      title: "Rush Orders",
      value: isLoading ? <Skeleton className="h-10 w-24 my-2" /> : kpis?.rushOrders ?? "-",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <KPICard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>
    </div>
  );
}
