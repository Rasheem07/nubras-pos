"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const performanceData = [
  { name: "Fatima", sales: 42, tailoring: 38, customer: 4.8 },
  { name: "Ahmed", sales: 28, tailoring: 45, customer: 4.5 },
  { name: "Mohammed", sales: 35, tailoring: 30, customer: 4.7 },
  { name: "Aisha", sales: 39, tailoring: 25, customer: 4.9 },
  { name: "Khalid", sales: 22, tailoring: 42, customer: 4.3 },
  { name: "Layla", sales: 45, tailoring: 20, customer: 4.6 },
]

const attendanceData = [
  { name: "Present", value: 85 },
  { name: "Late", value: 10 },
  { name: "Absent", value: 5 },
]

const COLORS = ["#4ade80", "#facc15", "#f87171"]

export default function StaffReportsPage() {
  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Staff Reports</h1>
        <p className="text-muted-foreground">Analyze staff performance, attendance, and productivity metrics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Staff</CardTitle>
            <CardDescription>Active employees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Average Performance</CardTitle>
            <CardDescription>Based on KPIs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Attendance Rate</CardTitle>
            <CardDescription>Monthly average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">+1% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
        </TabsList>
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance Metrics</CardTitle>
              <CardDescription>Sales performance, tailoring quality, and customer satisfaction ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    sales: {
                      label: "Sales Performance",
                      color: "hsl(var(--chart-1))",
                    },
                    tailoring: {
                      label: "Tailoring Quality",
                      color: "hsl(var(--chart-2))",
                    },
                    customer: {
                      label: "Customer Rating (x10)",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={performanceData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="sales" fill="var(--color-sales)" />
                      <Bar dataKey="tailoring" fill="var(--color-tailoring)" />
                      <Bar dataKey="customer" fill="var(--color-customer)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Staff</CardTitle>
              <CardDescription>Based on combined metrics of sales, quality, and customer satisfaction</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Sales Performance</TableHead>
                    <TableHead>Tailoring Quality</TableHead>
                    <TableHead>Customer Rating</TableHead>
                    <TableHead>Overall Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Fatima Al Zaabi</TableCell>
                    <TableCell>Sales & Tailoring</TableCell>
                    <TableCell>42</TableCell>
                    <TableCell>38</TableCell>
                    <TableCell>4.8/5</TableCell>
                    <TableCell className="font-bold">94%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Layla Mahmoud</TableCell>
                    <TableCell>Sales</TableCell>
                    <TableCell>45</TableCell>
                    <TableCell>20</TableCell>
                    <TableCell>4.6/5</TableCell>
                    <TableCell className="font-bold">92%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Aisha Khalid</TableCell>
                    <TableCell>Customer Service</TableCell>
                    <TableCell>39</TableCell>
                    <TableCell>25</TableCell>
                    <TableCell>4.9/5</TableCell>
                    <TableCell className="font-bold">91%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Mohammed Al Hashimi</TableCell>
                    <TableCell>Tailoring</TableCell>
                    <TableCell>35</TableCell>
                    <TableCell>30</TableCell>
                    <TableCell>4.7/5</TableCell>
                    <TableCell className="font-bold">89%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Ahmed Al Mansouri</TableCell>
                    <TableCell>Tailoring</TableCell>
                    <TableCell>28</TableCell>
                    <TableCell>45</TableCell>
                    <TableCell>4.5/5</TableCell>
                    <TableCell className="font-bold">88%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
                <CardDescription>Monthly attendance statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attendanceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {attendanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Summary</CardTitle>
                <CardDescription>Staff attendance records for the current month</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Present</TableCell>
                      <TableCell>510</TableCell>
                      <TableCell className="text-green-600">85%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Late</TableCell>
                      <TableCell>60</TableCell>
                      <TableCell className="text-yellow-600">10%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Absent</TableCell>
                      <TableCell>30</TableCell>
                      <TableCell className="text-red-600">5%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total</TableCell>
                      <TableCell>600</TableCell>
                      <TableCell>100%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Staff Attendance Details</CardTitle>
              <CardDescription>Individual attendance records for the current month</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Present Days</TableHead>
                    <TableHead>Late Days</TableHead>
                    <TableHead>Absent Days</TableHead>
                    <TableHead>Attendance Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Fatima Al Zaabi</TableCell>
                    <TableCell>Sales & Tailoring</TableCell>
                    <TableCell>22</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell className="text-green-600">100%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Ahmed Al Mansouri</TableCell>
                    <TableCell>Tailoring</TableCell>
                    <TableCell>20</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell className="text-green-600">91%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Mohammed Al Hashimi</TableCell>
                    <TableCell>Tailoring</TableCell>
                    <TableCell>21</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell className="text-green-600">95%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Aisha Khalid</TableCell>
                    <TableCell>Customer Service</TableCell>
                    <TableCell>22</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell className="text-green-600">100%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Khalid Al Suwaidi</TableCell>
                    <TableCell>Tailoring</TableCell>
                    <TableCell>19</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell className="text-yellow-600">86%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="productivity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Productivity Metrics</CardTitle>
              <CardDescription>Tasks completed, efficiency, and work quality</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Tasks Completed</TableHead>
                    <TableHead>Avg. Completion Time</TableHead>
                    <TableHead>Quality Score</TableHead>
                    <TableHead>Productivity Index</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Fatima Al Zaabi</TableCell>
                    <TableCell>Sales & Tailoring</TableCell>
                    <TableCell>42</TableCell>
                    <TableCell>1.2 days</TableCell>
                    <TableCell>95%</TableCell>
                    <TableCell className="font-bold text-green-600">9.4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Ahmed Al Mansouri</TableCell>
                    <TableCell>Tailoring</TableCell>
                    <TableCell>38</TableCell>
                    <TableCell>1.5 days</TableCell>
                    <TableCell>92%</TableCell>
                    <TableCell className="font-bold text-green-600">8.8</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Mohammed Al Hashimi</TableCell>
                    <TableCell>Tailoring</TableCell>
                    <TableCell>35</TableCell>
                    <TableCell>1.3 days</TableCell>
                    <TableCell>94%</TableCell>
                    <TableCell className="font-bold text-green-600">9.0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Aisha Khalid</TableCell>
                    <TableCell>Customer Service</TableCell>
                    <TableCell>45</TableCell>
                    <TableCell>0.9 days</TableCell>
                    <TableCell>97%</TableCell>
                    <TableCell className="font-bold text-green-600">9.7</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Khalid Al Suwaidi</TableCell>
                    <TableCell>Tailoring</TableCell>
                    <TableCell>32</TableCell>
                    <TableCell>1.7 days</TableCell>
                    <TableCell>88%</TableCell>
                    <TableCell className="font-bold text-yellow-600">7.9</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Department Productivity</CardTitle>
              <CardDescription>Productivity metrics by department</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Staff Count</TableHead>
                    <TableHead>Tasks Completed</TableHead>
                    <TableHead>Avg. Completion Time</TableHead>
                    <TableHead>Quality Score</TableHead>
                    <TableHead>Productivity Index</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Sales</TableCell>
                    <TableCell>8</TableCell>
                    <TableCell>320</TableCell>
                    <TableCell>1.1 days</TableCell>
                    <TableCell>93%</TableCell>
                    <TableCell className="font-bold text-green-600">9.2</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tailoring</TableCell>
                    <TableCell>12</TableCell>
                    <TableCell>410</TableCell>
                    <TableCell>1.5 days</TableCell>
                    <TableCell>91%</TableCell>
                    <TableCell className="font-bold text-green-600">8.8</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Customer Service</TableCell>
                    <TableCell>4</TableCell>
                    <TableCell>180</TableCell>
                    <TableCell>0.8 days</TableCell>
                    <TableCell>96%</TableCell>
                    <TableCell className="font-bold text-green-600">9.5</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
