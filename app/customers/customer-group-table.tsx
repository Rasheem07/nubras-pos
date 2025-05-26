"use client"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronRight, MoreHorizontal, Phone, Users, Eye, Edit, Star, Crown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

interface CustomerGroup {
  groupId: string
  phoneNumber: string
  primaryCustomer: {
    id: string
    name: string
    nameArabic?: string
    image?: string
  }
  totalCustomers: number
  totalSpent: number
  lastActivity: string
  status: "active" | "inactive"
  customers: Customer[]
}

interface Customer {
  id: string
  name: string
  nameArabic?: string
  image?: string
  status: "active" | "vip" | "new" | "inactive"
  vipTier?: "Gold" | "Platinum" | "Diamond"
  totalSpent: number
  totalOrders: number
  lastPurchase?: string
  preferences: string[]
}

const customerGroups: CustomerGroup[] = [
  {
    groupId: "GRP-001",
    phoneNumber: "+971 50 123 4567",
    primaryCustomer: {
      id: "CUST-001",
      name: "Fatima Mohammed Al Zahra",
      nameArabic: "فاطمة محمد الزهراء",
      image: "/frequency-modulation-spectrum.png",
    },
    totalCustomers: 3,
    totalSpent: 24350,
    lastActivity: "May 4, 2024",
    status: "active",
    customers: [
      {
        id: "CUST-001",
        name: "Fatima Mohammed Al Zahra",
        nameArabic: "فاطمة محمد الزهراء",
        image: "/frequency-modulation-spectrum.png",
        status: "vip",
        vipTier: "Platinum",
        totalSpent: 15750,
        totalOrders: 28,
        lastPurchase: "May 4, 2024",
        preferences: ["Luxury Fabrics", "Abayas", "Custom Tailoring"],
      },
      {
        id: "CUST-003",
        name: "Layla Hassan Al Khan",
        nameArabic: "ليلى حسن الخان",
        image: "/abstract-geometric-lk.png",
        status: "active",
        totalSpent: 5400,
        totalOrders: 12,
        lastPurchase: "Mar 22, 2024",
        preferences: ["Evening Wear", "Silk Fabrics"],
      },
      {
        id: "CUST-007",
        name: "Mohammed Fatima Al Zahra",
        nameArabic: "محمد فاطمة الزهراء",
        image: "/stylized-mh.png",
        status: "new",
        totalSpent: 3200,
        totalOrders: 5,
        lastPurchase: "Apr 15, 2024",
        preferences: ["Kandura", "Traditional Wear"],
      },
    ],
  },
  {
    groupId: "GRP-002",
    phoneNumber: "+971 55 987 6543",
    primaryCustomer: {
      id: "CUST-002",
      name: "Ahmed Abdullah Al Mansouri",
      nameArabic: "أحمد عبدالله المنصوري",
      image: "/abstract-am.png",
    },
    totalCustomers: 1,
    totalSpent: 8200,
    lastActivity: "Jan 15, 2024",
    status: "active",
    customers: [
      {
        id: "CUST-002",
        name: "Ahmed Abdullah Al Mansouri",
        nameArabic: "أحمد عبدالله المنصوري",
        image: "/abstract-am.png",
        status: "active",
        totalSpent: 8200,
        totalOrders: 15,
        lastPurchase: "Jan 15, 2024",
        preferences: ["Business Suits", "Premium Cotton"],
      },
    ],
  },
  {
    groupId: "GRP-003",
    phoneNumber: "+971 56 789 0123",
    primaryCustomer: {
      id: "CUST-005",
      name: "Sara Khalid Al Ameri",
      nameArabic: "سارة خالد العامري",
      image: "/abstract-geometric-sa.png",
    },
    totalCustomers: 2,
    totalSpent: 18900,
    lastActivity: "Apr 18, 2024",
    status: "active",
    customers: [
      {
        id: "CUST-005",
        name: "Sara Khalid Al Ameri",
        nameArabic: "سارة خالد العامري",
        image: "/abstract-geometric-sa.png",
        status: "vip",
        vipTier: "Gold",
        totalSpent: 12500,
        totalOrders: 22,
        lastPurchase: "Apr 18, 2024",
        preferences: ["Designer Abayas", "Premium Fabrics"],
      },
      {
        id: "CUST-008",
        name: "Zayed Al Nahyan",
        nameArabic: "زايد آل نهيان",
        image: "/abstract-geometric-zn.png",
        status: "vip",
        vipTier: "Diamond",
        totalSpent: 6400,
        totalOrders: 8,
        lastPurchase: "Apr 10, 2024",
        preferences: ["Corporate Orders", "Luxury Items"],
      },
    ],
  },
]

export function CustomerGroupTable() {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  const getStatusBadge = (status: string, vipTier?: string) => {
    switch (status) {
      case "vip":
        const tierColors = {
          Diamond: "bg-purple-100 text-purple-800 border-purple-200",
          Platinum: "bg-gray-100 text-gray-800 border-gray-200",
          Gold: "bg-amber-100 text-amber-800 border-amber-200",
        }
        return (
          <Badge className={tierColors[vipTier as keyof typeof tierColors] || "bg-amber-100 text-amber-800"}>
            <Crown className="mr-1 h-3 w-3" />
            {vipTier || "VIP"}
          </Badge>
        )
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
      case "new":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">New</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Customer Groups
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {customerGroups.map((group) => (
            <Collapsible
              key={group.groupId}
              open={expandedGroups.includes(group.groupId)}
              onOpenChange={() => toggleGroup(group.groupId)}
            >
              <div className="border rounded-lg">
                {/* Group Header */}
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {expandedGroups.includes(group.groupId) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      </div>

                      <Avatar>
                        <AvatarImage src={group.primaryCustomer.image || "/placeholder.svg"} />
                        <AvatarFallback>
                          {group.primaryCustomer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="font-medium">{group.primaryCustomer.name}</div>
                        <div className="text-sm text-muted-foreground font-arabic">
                          {group.primaryCustomer.nameArabic}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {group.phoneNumber} • {group.groupId}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">AED {group.totalSpent.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {group.totalCustomers} customer{group.totalCustomers > 1 ? "s" : ""}
                        </div>
                      </div>

                      <Badge variant={group.status === "active" ? "default" : "outline"}>{group.status}</Badge>
                    </div>
                  </div>
                </CollapsibleTrigger>

                {/* Group Members */}
                <CollapsibleContent>
                  <div className="border-t">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Orders</TableHead>
                          <TableHead>Total Spent</TableHead>
                          <TableHead>Last Purchase</TableHead>
                          <TableHead>Preferences</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.customers.map((customer) => (
                          <TableRow key={customer.id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={customer.image || "/placeholder.svg"} />
                                  <AvatarFallback className="text-xs">
                                    {customer.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{customer.name}</div>
                                  <div className="text-xs text-muted-foreground font-arabic">{customer.nameArabic}</div>
                                  <div className="text-xs text-muted-foreground">{customer.id}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(customer.status, customer.vipTier)}</TableCell>
                            <TableCell>{customer.totalOrders}</TableCell>
                            <TableCell>AED {customer.totalSpent.toLocaleString()}</TableCell>
                            <TableCell>{customer.lastPurchase || "Never"}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {customer.preferences.slice(0, 2).map((pref, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {pref}
                                  </Badge>
                                ))}
                                {customer.preferences.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{customer.preferences.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/customers/${customer.id}`}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Profile
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/customers/${customer.id}/edit`}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit Customer
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Star className="mr-2 h-4 w-4" />
                                    {customer.status === "vip" ? "Remove VIP" : "Make VIP"}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
