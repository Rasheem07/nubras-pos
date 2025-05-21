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
  LineChart,
  Line,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const customerAcquisitionData = [
  { month: "Jan", new: 45, returning: 30 },
  { month: "Feb", new: 52, returning: 35 },
  { month: "Mar", new: 48, returning: 40 },
  { month: "Apr", new: 61, returning: 42 },
  { month: "May", new: 55, returning: 48 },
  { month: "Jun", new: 67, returning: 50 },
]

const customerSegmentData = [
  { name: "Premium", value: 35 },
  { name: "Regular", value: 45 },
  { name: "Occasional", value: 20 },
]

const COLORS = ["#4ade80", "#60a5fa", "#f97316"]

const customerRetentionData = [
  { month: "Jan", rate: 78 },
  { month: "Feb", rate: 80 },
  { month: "Mar", rate: 79 },
  { month: "Apr", rate: 82 },
  { month: "May", rate: 85 },
  { month: "Jun", rate: 88 },
]

export default function CustomerReportsPage() {
  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Customer Reports</h1>
        <p className="text-muted-foreground">Analyze customer acquisition, retention, and spending patterns</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Customers</CardTitle>
            <CardDescription>Active customer base</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">2,853</div>
            <p className="text-xs text-green-500">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Average Order Value</CardTitle>
            <CardDescription>Per customer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">AED 450</div>
            <p className="text-xs text-green-500">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Customer Retention</CardTitle>
            <CardDescription>Monthly rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">88%</div>
            <p className="text-xs text-green-500">+3% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="acquisition" className="w-full">
        <TabsList>
          <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
          <TabsTrigger value="segmentation">Segmentation</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="spending">Spending Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="acquisition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Acquisition Trends</CardTitle>
              <CardDescription>New vs. returning customers over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    new: {
                      label: "New Customers",
                      color: "hsl(var(--chart-1))",
                    },
                    returning: {
                      label: "Returning Customers",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={customerAcquisitionData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="new" fill="var(--color-new)" />
                      <Bar dataKey="returning" fill="var(--color-returning)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acquisition Sources</CardTitle>
              <CardDescription>Where our customers are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>New Customers</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                    <TableHead>Cost per Acquisition</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Referrals</TableCell>
                    <TableCell>128</TableCell>
                    <TableCell>32%</TableCell>
                    <TableCell>8.5%</TableCell>
                    <TableCell>AED 25</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Social Media</TableCell>
                    <TableCell>95</TableCell>
                    <TableCell>24%</TableCell>
                    <TableCell>4.2%</TableCell>
                    <TableCell>AED 42</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Search</TableCell>
                    <TableCell>82</TableCell>
                    <TableCell>21%</TableCell>
                    <TableCell>3.8%</TableCell>
                    <TableCell>AED 38</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Direct</TableCell>
                    <TableCell>65</TableCell>
                    <TableCell>16%</TableCell>
                    <TableCell>7.2%</TableCell>
                    <TableCell>AED 18</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Other</TableCell>
                    <TableCell>28</TableCell>
                    <TableCell>7%</TableCell>
                    <TableCell>2.5%</TableCell>
                    <TableCell>AED 55</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segmentation" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>Distribution of customers by segment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerSegmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {customerSegmentData.map((entry, index) => (
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
                <CardTitle>Segment Characteristics</CardTitle>
                <CardDescription>Key metrics by customer segment</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Segment</TableHead>
                      <TableHead>Avg. Order Value</TableHead>
                      <TableHead>Purchase Frequency</TableHead>
                      <TableHead>Retention Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Premium</TableCell>
                      <TableCell>AED 850</TableCell>
                      <TableCell>2.8 per month</TableCell>
                      <TableCell>95%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Regular</TableCell>
                      <TableCell>AED 450</TableCell>
                      <TableCell>1.5 per month</TableCell>
                      <TableCell>82%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Occasional</TableCell>
                      <TableCell>AED 250</TableCell>
                      <TableCell>0.5 per month</TableCell>
                      <TableCell>65%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>Customers with highest lifetime value</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Segment</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Avg. Order Value</TableHead>
                    <TableHead>Last Purchase</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Ahmed Al Mansouri</TableCell>
                    <TableCell>Premium</TableCell>
                    <TableCell>AED 25,450</TableCell>
                    <TableCell>32</TableCell>
                    <TableCell>AED 795</TableCell>
                    <TableCell>2 days ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Fatima Al Zaabi</TableCell>
                    <TableCell>Premium</TableCell>
                    <TableCell>AED 18,720</TableCell>
                    <TableCell>24</TableCell>
                    <TableCell>AED 780</TableCell>
                    <TableCell>5 days ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Mohammed Al Hashimi</TableCell>
                    <TableCell>Premium</TableCell>
                    <TableCell>AED 15,890</TableCell>
                    <TableCell>18</TableCell>
                    <TableCell>AED 883</TableCell>
                    <TableCell>1 week ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Aisha Khalid</TableCell>
                    <TableCell>Premium</TableCell>
                    <TableCell>AED 14,250</TableCell>
                    <TableCell>16</TableCell>
                    <TableCell>AED 891</TableCell>
                    <TableCell>3 days ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Khalid Al Suwaidi</TableCell>
                    <TableCell>Premium</TableCell>
                    <TableCell>AED 12,780</TableCell>
                    <TableCell>15</TableCell>
                    <TableCell>AED 852</TableCell>
                    <TableCell>2 weeks ago</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Retention Trends</CardTitle>
              <CardDescription>Monthly retention rates over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    rate: {
                      label: "Retention Rate (%)",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={customerRetentionData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[70, 100]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="rate" stroke="var(--color-rate)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Retention by Customer Segment</CardTitle>
              <CardDescription>How different customer segments retain over time</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Segment</TableHead>
                    <TableHead>30-Day Retention</TableHead>
                    <TableHead>60-Day Retention</TableHead>
                    <TableHead>90-Day Retention</TableHead>
                    <TableHead>Churn Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Premium</TableCell>
                    <TableCell>95%</TableCell>
                    <TableCell>92%</TableCell>
                    <TableCell>90%</TableCell>
                    <TableCell>5%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Regular</TableCell>
                    <TableCell>82%</TableCell>
                    <TableCell>75%</TableCell>
                    <TableCell>68%</TableCell>
                    <TableCell>18%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Occasional</TableCell>
                    <TableCell>65%</TableCell>
                    <TableCell>52%</TableCell>
                    <TableCell>45%</TableCell>
                    <TableCell>35%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Spending Patterns</CardTitle>
              <CardDescription>Analysis of customer spending habits</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Sales Volume</TableHead>
                    <TableHead>Percentage of Total</TableHead>
                    <TableHead>Avg. Order Value</TableHead>
                    <TableHead>Growth (MoM)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Kandura</TableCell>
                    <TableCell>AED 125,450</TableCell>
                    <TableCell>42%</TableCell>
                    <TableCell>AED 650</TableCell>
                    <TableCell className="text-green-600">+8%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Abaya</TableCell>
                    <TableCell>AED 98,720</TableCell>
                    <TableCell>33%</TableCell>
                    <TableCell>AED 580</TableCell>
                    <TableCell className="text-green-600">+5%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Accessories</TableCell>
                    <TableCell>AED 45,890</TableCell>
                    <TableCell>15%</TableCell>
                    <TableCell>AED 180</TableCell>
                    <TableCell className="text-green-600">+12%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Custom Tailoring</TableCell>
                    <TableCell>AED 30,250</TableCell>
                    <TableCell>10%</TableCell>
                    <TableCell>AED 850</TableCell>
                    <TableCell className="text-green-600">+15%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seasonal Spending Trends</CardTitle>
              <CardDescription>How customer spending varies throughout the year</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Season</TableHead>
                    <TableHead>Sales Volume</TableHead>
                    <TableHead>Top Category</TableHead>
                    <TableHead>Avg. Order Value</TableHead>
                    <TableHead>YoY Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Ramadan</TableCell>
                    <TableCell>AED 245,450</TableCell>
                    <TableCell>Kandura (Premium)</TableCell>
                    <TableCell>AED 780</TableCell>
                    <TableCell className="text-green-600">+18%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Eid</TableCell>
                    <TableCell>AED 298,720</TableCell>
                    <TableCell>Complete Sets</TableCell>
                    <TableCell>AED 950</TableCell>
                    <TableCell className="text-green-600">+22%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Summer</TableCell>
                    <TableCell>AED 145,890</TableCell>
                    <TableCell>Lightweight Kandura</TableCell>
                    <TableCell>AED 580</TableCell>
                    <TableCell className="text-green-600">+5%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Winter</TableCell>
                    <TableCell>AED 180,250</TableCell>
                    <TableCell>Premium Fabrics</TableCell>
                    <TableCell>AED 720</TableCell>
                    <TableCell className="text-green-600">+8%</TableCell>
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
