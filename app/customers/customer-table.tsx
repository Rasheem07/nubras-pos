"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Star, Phone, Mail, Users, MapPin, Eye, Edit, UserX } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

type CustomerStatus = "active" | "vip" | "new" | "inactive"
type CustomerType = "individual" | "family_head" | "family_member"

interface Customer {
  id: string
  name: string
  nameArabic: string
  initials: string
  image?: string
  email: string
  phone: string
  emiratesId: string
  nationality: string
  city: string
  area: string
  status: CustomerStatus
  type: CustomerType
  familyGroupId?: string
  familyMembers?: number
  totalSpent: number
  lastPurchase: string
  preferences: string[]
  vipTier?: "Gold" | "Platinum" | "Diamond"
}

const customers: Customer[] = [
  {
    id: "CUST-001",
    name: "Fatima Mohammed Al Zahra",
    nameArabic: "فاطمة محمد الزهراء",
    initials: "FM",
    image: "/frequency-modulation-spectrum.png",
    email: "fatima.alzahra@example.com",
    phone: "+971 50 123 4567",
    emiratesId: "784-1990-1234567-8",
    nationality: "UAE",
    city: "Dubai",
    area: "Dubai Marina",
    status: "vip",
    type: "family_head",
    familyGroupId: "FAM-001",
    familyMembers: 4,
    totalSpent: 15750,
    lastPurchase: "May 4, 2024",
    preferences: ["Luxury Fabrics", "Abayas", "French Cuffs", "Custom Tailoring"],
    vipTier: "Platinum",
  },
  {
    id: "CUST-002",
    name: "Ahmed Abdullah Al Mansouri",
    nameArabic: "أحمد عبدالله المنصوري",
    initials: "AM",
    image: "/abstract-am.png",
    email: "ahmed.mansouri@example.com",
    phone: "+971 55 987 6543",
    emiratesId: "784-1985-9876543-2",
    nationality: "UAE",
    city: "Abu Dhabi",
    area: "Al Reem Island",
    status: "active",
    type: "individual",
    totalSpent: 8200,
    lastPurchase: "Jan 15, 2024",
    preferences: ["Business Suits", "Kandura", "Premium Cotton"],
  },
  {
    id: "CUST-003",
    name: "Layla Hassan Al Khan",
    nameArabic: "ليلى حسن الخان",
    initials: "LK",
    image: "/abstract-geometric-lk.png",
    email: "layla.khan@example.com",
    phone: "+971 50 123 4567",
    emiratesId: "784-1992-5555555-5",
    nationality: "UAE",
    city: "Dubai",
    area: "Dubai Marina",
    status: "active",
    type: "family_member",
    familyGroupId: "FAM-001",
    totalSpent: 5400,
    lastPurchase: "Mar 22, 2024",
    preferences: ["Evening Wear", "Silk Fabrics", "Modern Cuts"],
  },
  {
    id: "CUST-004",
    name: "Hassan Omar Al Farsi",
    nameArabic: "حسن عمر الفارسي",
    initials: "HA",
    image: "/ha-characters.png",
    email: "hassan.farsi@example.com",
    phone: "+971 54 321 0987",
    emiratesId: "784-1988-7777777-7",
    nationality: "UAE",
    city: "Sharjah",
    area: "Al Majaz",
    status: "inactive",
    type: "individual",
    totalSpent: 2200,
    lastPurchase: "Nov 10, 2023",
    preferences: ["Corporate Wear", "Formal Shirts"],
  },
  {
    id: "CUST-005",
    name: "Sara Khalid Al Ameri",
    nameArabic: "سارة خالد العامري",
    initials: "SA",
    image: "/abstract-geometric-sa.png",
    email: "sara.ameri@example.com",
    phone: "+971 56 789 0123",
    emiratesId: "784-1995-3333333-3",
    nationality: "UAE",
    city: "Dubai",
    area: "Jumeirah",
    status: "vip",
    type: "individual",
    totalSpent: 12500,
    lastPurchase: "Apr 18, 2024",
    preferences: ["Designer Abayas", "Premium Fabrics", "Rush Orders"],
    vipTier: "Gold",
  },
  {
    id: "CUST-006",
    name: "Omar Saeed Al Suwaidi",
    nameArabic: "عمر سعيد السويدي",
    initials: "OS",
    image: "/operating-system-concept.png",
    email: "omar.suwaidi@example.com",
    phone: "+971 50 234 5678",
    emiratesId: "784-2000-1111111-1",
    nationality: "UAE",
    city: "Dubai",
    area: "Business Bay",
    status: "new",
    type: "individual",
    totalSpent: 850,
    lastPurchase: "May 2, 2024",
    preferences: ["Ready-made", "Casual Wear"],
  },
]

interface CustomerTableProps {
  filter?: string
}

export function CustomerTable({ filter }: CustomerTableProps) {
  const filteredCustomers =
    filter && filter !== "all"
      ? customers.filter((customer) => {
          if (filter === "families") return customer.type === "family_head"
          return customer.status === filter
        })
      : customers

  const getStatusBadge = (status: CustomerStatus, vipTier?: string) => {
    switch (status) {
      case "vip":
        const tierColor =
          vipTier === "Diamond"
            ? "bg-purple-100 text-purple-800"
            : vipTier === "Platinum"
              ? "bg-gray-100 text-gray-800"
              : "bg-amber-100 text-amber-800"
        return <Badge className={`${tierColor} hover:${tierColor}`}>{vipTier || "VIP"}</Badge>
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "new":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">New</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      default:
        return null
    }
  }

  const getTypeBadge = (type: CustomerType, familyMembers?: number) => {
    switch (type) {
      case "family_head":
        return (
          <Badge variant="outline" className="text-xs">
            <Users className="mr-1 h-3 w-3" />
            Family ({familyMembers})
          </Badge>
        )
      case "family_member":
        return (
          <Badge variant="outline" className="text-xs">
            Member
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Individual
          </Badge>
        )
    }
  }

  const handleRowClick = (customerId: string, event: React.MouseEvent) => {
    // Prevent navigation if clicking on dropdown trigger
    if ((event.target as HTMLElement).closest("[data-dropdown-trigger]")) {
      return
    }
    window.location.href = `/customers/${customerId}`
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Contact & Location</TableHead>
            <TableHead>Emirates ID</TableHead>
            <TableHead>Status & Type</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead>Last Purchase</TableHead>
            <TableHead>Preferences</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomers.map((customer) => (
            <TableRow
              key={customer.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={(e) => handleRowClick(customer.id, e)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={customer.image || "/placeholder.svg"} alt={customer.name} />
                    <AvatarFallback>{customer.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-muted-foreground font-arabic">{customer.nameArabic}</div>
                    <div className="text-xs text-muted-foreground">{customer.id}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center text-sm">
                    <Mail className="mr-2 h-3 w-3 text-muted-foreground" />
                    {customer.email}
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
                    {customer.phone}
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-3 w-3 text-muted-foreground" />
                    {customer.area}, {customer.city}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm font-mono">{customer.emiratesId}</div>
                <div className="text-xs text-muted-foreground">{customer.nationality}</div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {getStatusBadge(customer.status, customer.vipTier)}
                  {getTypeBadge(customer.type, customer.familyMembers)}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">AED {customer.totalSpent.toLocaleString()}</div>
              </TableCell>
              <TableCell>{customer.lastPurchase}</TableCell>
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
                  <DropdownMenuTrigger asChild data-dropdown-trigger>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
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
                    <DropdownMenuSeparator />
                    {customer.status === "vip" ? (
                      <DropdownMenuItem>Remove VIP Status</DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>
                        <Star className="mr-2 h-4 w-4" />
                        Mark as VIP
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-red-600">
                      <UserX className="mr-2 h-4 w-4" />
                      Deactivate
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
