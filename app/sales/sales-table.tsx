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
import { MoreHorizontal, Eye, FileText, Scissors } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type SaleType = "walk-in" | "bulk" | "tailoring"

interface Sale {
  id: string
  date: string
  customer: {
    name: string
    initials: string
    image?: string
  }
  type: SaleType
  items: string
  amount: number
  status: "completed" | "pending" | "processing" | "cancelled"
  paymentMethod: string
}

const sales: Sale[] = [
  {
    id: "INV-001",
    date: "May 4, 2024",
    customer: {
      name: "Fatima Mohammed",
      initials: "FM",
      image: "/frequency-modulation-spectrum.png",
    },
    type: "tailoring",
    items: "2 Kanduras (Custom)",
    amount: 1250,
    status: "processing",
    paymentMethod: "Card",
  },
  {
    id: "INV-002",
    date: "May 4, 2024",
    customer: {
      name: "Ahmed Al Mansouri",
      initials: "AM",
      image: "/abstract-am.png",
    },
    type: "walk-in",
    items: "1 Abaya (Ready-made)",
    amount: 450,
    status: "completed",
    paymentMethod: "Cash",
  },
  {
    id: "INV-003",
    date: "May 4, 2024",
    customer: {
      name: "Layla Khan",
      initials: "LK",
      image: "/abstract-geometric-lk.png",
    },
    type: "walk-in",
    items: "3 Scarves (Ready-made)",
    amount: 350,
    status: "completed",
    paymentMethod: "Apple Pay",
  },
  {
    id: "INV-004",
    date: "May 3, 2024",
    customer: {
      name: "Hassan Al Farsi",
      initials: "HA",
      image: "/ha-characters.png",
    },
    type: "bulk",
    items: "5 Kanduras (Bulk Order)",
    amount: 2500,
    status: "pending",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "INV-005",
    date: "May 3, 2024",
    customer: {
      name: "Sara Al Ameri",
      initials: "SA",
      image: "/abstract-geometric-sa.png",
    },
    type: "tailoring",
    items: "1 Custom Abaya (Rush)",
    amount: 850,
    status: "completed",
    paymentMethod: "Card",
  },
  {
    id: "INV-006",
    date: "May 2, 2024",
    customer: {
      name: "Omar Al Suwaidi",
      initials: "OS",
      image: "/operating-system-concept.png",
    },
    type: "walk-in",
    items: "2 Scarves, 1 Ready-made Abaya",
    amount: 550,
    status: "completed",
    paymentMethod: "Cash",
  },
  {
    id: "INV-007",
    date: "May 2, 2024",
    customer: {
      name: "Mariam Al Hashimi",
      initials: "MH",
      image: "/stylized-mh.png",
    },
    type: "tailoring",
    items: "3 Custom Abayas",
    amount: 1950,
    status: "processing",
    paymentMethod: "Card",
  },
  {
    id: "INV-008",
    date: "May 1, 2024",
    customer: {
      name: "Zayed Al Nahyan",
      initials: "ZN",
      image: "/abstract-geometric-zn.png",
    },
    type: "bulk",
    items: "10 Kanduras (Corporate)",
    amount: 4500,
    status: "pending",
    paymentMethod: "Bank Transfer",
  },
]

interface SalesTableProps {
  filter?: SaleType
}

export function SalesTable({ filter }: SalesTableProps) {
  const filteredSales = filter ? sales.filter((sale) => sale.type === filter) : sales

  const getStatusBadge = (status: Sale["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "processing":
        return <Badge variant="secondary">Processing</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return null
    }
  }

  const getTypeIcon = (type: SaleType) => {
    switch (type) {
      case "tailoring":
        return <Scissors className="h-4 w-4 text-purple-500" />
      case "bulk":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "walk-in":
        return <Eye className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell className="font-medium">{sale.id}</TableCell>
              <TableCell>{sale.date}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={sale.customer.image || "/placeholder.svg"} alt={sale.customer.name} />
                    <AvatarFallback>{sale.customer.initials}</AvatarFallback>
                  </Avatar>
                  <span>{sale.customer.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {getTypeIcon(sale.type)}
                  <span className="capitalize">{sale.type}</span>
                </div>
              </TableCell>
              <TableCell>{sale.items}</TableCell>
              <TableCell>AED {sale.amount.toLocaleString()}</TableCell>
              <TableCell>{getStatusBadge(sale.status)}</TableCell>
              <TableCell>{sale.paymentMethod}</TableCell>
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
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem>Edit sale</DropdownMenuItem>
                    <DropdownMenuItem>Print receipt</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Cancel sale</DropdownMenuItem>
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
