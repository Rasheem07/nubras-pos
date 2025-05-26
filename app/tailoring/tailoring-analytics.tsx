"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Clock, Users, AlertTriangle, Target } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const weeklyData = [
  { day: "Mon", completed: 4, started: 6 },
  { day: "Tue", completed: 6, started: 8 },
  { day: "Wed", completed: 5, started: 7 },
  { day: "Thu", completed: 8, started: 9 },
  { day: "Fri", completed: 7, started: 10 },
  { day: "Sat", completed: 9, started: 12 },
  { day: "Sun", completed: 3, started: 4 },
]

const categoryData = [
  { name: "Kanduras", value: 45, color: "#3B82F6" },
  { name: "Abayas", value: 30, color: "#10B981" },
  { name: "Alterations", value: 15, color: "#F59E0B" },
  { name: "Custom", value: 10, color: "#EF4444" },
]

const tailorPerformance = [
  { name: "Mohammed Ali", efficiency: 95, projects: 8, rating: 4.9 },
  { name: "Aisha Mahmood", efficiency: 92, projects: 6, rating: 4.8 },
  { name: "Yusuf Qasim", efficiency: 88, projects: 10, rating: 4.7 },
  { name: "Fatima Zahra", efficiency: 96, projects: 5, rating: 5.0 },
]

export function TailoringAnalytics() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-3xl font-bold text-gray-900">24</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last week
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Completion Time</p>
                <p className="text-3xl font-bold text-gray-900">4.2</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  days (target: 5 days)
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tailors</p>
                <p className="text-3xl font-bold text-gray-900">8</p>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <Users className="h-3 w-3 mr-1" />2 on leave
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rush Orders</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
                <p className="text-xs text-amber-600 flex items-center mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Requires attention
                </p>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section    
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Progress Chart */}
      {/*
        <Card className="lg:col-span-2 border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200 bg-gray-50/50">
            <CardTitle className="text-lg text-gray-900">Weekly Progress</CardTitle>
            <CardDescription className="text-gray-600">Projects completed vs started this week</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ChartContainer
              config={{
                completed: {
                  label: "Completed",
                  color: "#10B981",
                },
                started: {
                  label: "Started",
                  color: "#3B82F6",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="started"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        */}

        {/* Project Categories */}
        {/*
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200 bg-gray-50/50">
            <CardTitle className="text-lg text-gray-900">Project Categories</CardTitle>
            <CardDescription className="text-gray-600">Distribution by garment type</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm text-gray-600">{data.value}% of projects</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {categoryData.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{category.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div> 
      */}

    </div>
  )
}
