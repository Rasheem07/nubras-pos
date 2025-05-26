"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Trash } from "lucide-react"
import { format } from "date-fns"

export default function PromotionsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")

  // Sample promotions data
  const promotions = [
    {
      id: 1,
      name: "Summer Sale",
      code: "SUMMER25",
      type: "percentage",
      value: 25,
      minPurchase: 200,
      maxDiscount: 500,
      startDate: new Date(2024, 4, 1),
      endDate: new Date(2024, 5, 30),
      isActive: true,
      usageCount: 45,
      revenue: 12500,
    },
    {
      id: 2,
      name: "New Customer",
      code: "WELCOME10",
      type: "percentage",
      value: 10,
      minPurchase: 0,
      maxDiscount: 200,
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 11, 31),
      isActive: true,
      usageCount: 120,
      revenue: 18000,
    },
    {
      id: 3,
      name: "Eid Special",
      code: "EID2024",
      type: "fixed",
      value: 100,
      minPurchase: 500,
      maxDiscount: 100,
      startDate: new Date(2024, 3, 10),
      endDate: new Date(2024, 3, 20),
      isActive: false,
      usageCount: 78,
      revenue: 42500,
    },
    {
      id: 4,
      name: "Weekend Flash Sale",
      code: "FLASH30",
      type: "percentage",
      value: 30,
      minPurchase: 300,
      maxDiscount: 300,
      startDate: new Date(2024, 4, 10),
      endDate: new Date(2024, 4, 12),
      isActive: true,
      usageCount: 25,
      revenue: 8200,
    },
    {
      id: 5,
      name: "Ramadan Offer",
      code: "RAMADAN20",
      type: "percentage",
      value: 20,
      minPurchase: 250,
      maxDiscount: 400,
      startDate: new Date(2024, 2, 10),
      endDate: new Date(2024, 3, 10),
      isActive: false,
      usageCount: 95,
      revenue: 28500,
    },
  ]

  const filteredPromotions = promotions.filter(
    (promo) =>
      promo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const activePromotions = filteredPromotions.filter((promo) => promo.isActive)
  const inactivePromotions = filteredPromotions.filter((promo) => !promo.isActive)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Promotions & Discounts</h1>
        <Button onClick={() => router.push("/promotions/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Promotion
        </Button>
      </div>

      <div className="flex items-center mb-4">
        <Input
          placeholder="Search promotions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Promotions</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Promotions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Promotions</CardTitle>
              <CardDescription>Currently active promotions and discounts.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Min. Purchase</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activePromotions.length > 0 ? (
                    activePromotions.map((promo) => (
                      <TableRow key={promo.id}>
                        <TableCell className="font-medium">{promo.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{promo.code}</Badge>
                        </TableCell>
                        <TableCell>{promo.type === "percentage" ? `${promo.value}%` : `AED ${promo.value}`}</TableCell>
                        <TableCell>{promo.minPurchase > 0 ? `AED ${promo.minPurchase}` : "None"}</TableCell>
                        <TableCell>{format(promo.endDate, "MMM d, yyyy")}</TableCell>
                        <TableCell>{promo.usageCount} uses</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No active promotions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Promotions</CardTitle>
              <CardDescription>Expired or disabled promotions and discounts.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Min. Purchase</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inactivePromotions.length > 0 ? (
                    inactivePromotions.map((promo) => (
                      <TableRow key={promo.id}>
                        <TableCell className="font-medium">{promo.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{promo.code}</Badge>
                        </TableCell>
                        <TableCell>{promo.type === "percentage" ? `${promo.value}%` : `AED ${promo.value}`}</TableCell>
                        <TableCell>{promo.minPurchase > 0 ? `AED ${promo.minPurchase}` : "None"}</TableCell>
                        <TableCell>{format(promo.endDate, "MMM d, yyyy")}</TableCell>
                        <TableCell>{promo.usageCount} uses</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No inactive promotions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  AED {promotions.reduce((sum, promo) => sum + promo.revenue, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">From all promotions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{promotions.reduce((sum, promo) => sum + promo.usageCount, 0)}</div>
                <p className="text-xs text-muted-foreground">Across all promotions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activePromotions.length}</div>
                <p className="text-xs text-muted-foreground">Currently running</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Promotion Performance</CardTitle>
              <CardDescription>Revenue and usage by promotion</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Promotion</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Avg. Order Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPromotions.length > 0 ? (
                    filteredPromotions
                      .sort((a, b) => b.revenue - a.revenue)
                      .map((promo) => (
                        <TableRow key={promo.id}>
                          <TableCell className="font-medium">{promo.name}</TableCell>
                          <TableCell>{promo.code}</TableCell>
                          <TableCell>{promo.usageCount} uses</TableCell>
                          <TableCell>AED {promo.revenue.toLocaleString()}</TableCell>
                          <TableCell>AED {(promo.revenue / promo.usageCount).toFixed(2)}</TableCell>
                          <TableCell>
                            {promo.isActive ? (
                              <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                            ) : (
                              <Badge variant="outline">Inactive</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No promotions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
