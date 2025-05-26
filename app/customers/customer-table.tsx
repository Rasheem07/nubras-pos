"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { MoreHorizontal, Star, Phone, Mail } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type CustomerStatus = "active" | "vip" | "new" | "inactive"

interface Customer {
  id: string
  name: string
  initials: string
  image?: string
  email: string
  phone: string
  status: CustomerStatus
  totalSpent: number
  lastPurchase: string
  preferences: string[]
}

const customers: Customer[] = [
  {
    id: "CUST-001",
    name: "Fatima Mohammed",
    initials: "FM",
    image: "/frequency-modulation-spectrum.png",
    email: "fatima.m@example.com",
    phone: "+971 50 123 4567",
    status: "vip",
    totalSpent: 7950,
    lastPurchase: "May 4, 2024",
    preferences: ["Luxury Fabric", "French Cuffs"],
  },
  {
    id: "CUST-002",
    name: "Ahmed Al Mansouri",
    initials: "AM",
    image: "/abstract-am.png",
    email: "ahmed.m@example.com",
    phone: "+971 55 987 6543",
    status: "active",
    totalSpent: 3200,
    lastPurchase: "Jan 15, 2024",
    preferences: ["Eid Shopper"],
  },
  {
    id: "CUST-003",
    name: "Layla Khan",
    initials: "LK",
    image: "/abstract-geometric-lk.png",
    email: "layla.k@example.com",
    phone: "+971 52 456 7890",
    status: "active",
    totalSpent: 5400,
    lastPurchase: "Mar 22, 2024",
    preferences: ["Dubai Marina"],
  },
  {
    id: "CUST-004",
    name: "Hassan Al Farsi",
    initials: "HA",
    image: "/ha-characters.png",
    email: "hassan.f@example.com",
    phone: "+971 54 321 0987",
    status: "inactive",
    totalSpent: 1200,
    lastPurchase: "Nov 10, 2023",
    preferences: ["Corporate Orders"],
  },
  {
    id: "CUST-005",
    name: "Sara Al Ameri",
    initials: "SA",
    image: "/abstract-geometric-sa.png",
    email: "sara.a@example.com",
    phone: "+971 56 789 0123",
    status: "active",
    totalSpent: 4500,
    lastPurchase: "Apr 18, 2024",
    preferences: ["Rush Orders", "Premium Fabrics"],
  },
  {
    id: "CUST-006",
    name: "Omar Al Suwaidi",
    initials: "OS",
    image: "/operating-system-concept.png",
    email: "omar.s@example.com",
    phone: "+971 50 234 5678",
    status: "new",
    totalSpent: 550,
    lastPurchase: "May 2, 2024",
    preferences: ["Ready-made"],
  },
  {
    id: "CUST-007",
    name: "Mariam Al Hashimi",
    initials: "MH",
    image: "/stylized-mh.png",
    email: "mariam.h@example.com",
    phone: "+971 55 876 5432",
    status: "active",
    totalSpent: 3200,
    lastPurchase: "Apr 5, 2024",
    preferences: ["Custom Abayas"],
  },
  {
    id: "CUST-008",
    name: "Zayed Al Nahyan",
    initials: "ZN",
    image: "/abstract-geometric-zn.png",
    email: "zayed.n@example.com",
    phone: "+971 52 345 6789",
    status: "vip",
    totalSpent: 12500,
    lastPurchase: "Apr 28, 2024",
    preferences: ["Corporate Orders", "Premium Fabrics"],
  },
]

interface CustomerTableProps {
  filter?: CustomerStatus
}

export function CustomerTable({ filter }: CustomerTableProps) {
  const filteredCustomers = filter ? customers.filter((customer) => customer.status === filter) : customers

  const getStatusBadge = (status: CustomerStatus) => {
    switch (status) {
      case "vip":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">VIP</Badge>
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Spent</TableHead>
            <TableHead>Last Purchase</TableHead>
            <TableHead>Preferences</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={customer.image || "/placeholder.svg"} alt={customer.name} />
                    <AvatarFallback>{customer.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{customer.name}</div>
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
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(customer.status)}</TableCell>
              <TableCell>AED {customer.totalSpent.toLocaleString()}</TableCell>
              <TableCell>{customer.lastPurchase}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {customer.preferences.map((pref, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {pref}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit customer</DropdownMenuItem>
                    <DropdownMenuItem>View orders</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {customer.status === "vip" ? (
                      <DropdownMenuItem>Remove VIP status</DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>
                        <Star className="mr-2 h-4 w-4" />
                        Mark as VIP
                      </DropdownMenuItem>
                    )}
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
