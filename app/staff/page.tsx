"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  UserCircle,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  FileText,
  Edit,
  Eye,
  Trash2,
  Mail,
  Phone,
  Calendar,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"

interface StaffMember {
  id: string
  name: string
  role: string
  department: string
  email: string
  phone: string
  status: "active" | "on-leave" | "inactive"
  joinDate: string
  image?: string
}

type SortField = "name" | "role" | "department" | "joinDate"
type SortDirection = "asc" | "desc"

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const { data: staffMembers = [] } = useQuery<StaffMember[]>({
    queryKey: ["staffMembers"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/staff`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch staff members");
      }
      return data as StaffMember[];
    },
  })

  // Get unique roles, departments, and statuses for filters
  const roles = Array.from(new Set(staffMembers.map((staff) => staff.role)))
  const departments = Array.from(new Set(staffMembers.map((staff) => staff.department)))
  const statuses = Array.from(new Set(staffMembers.map((staff) => staff.status)))

  // Filter and sort staff members
  const filteredStaff = staffMembers
    .filter(
      (staff) =>
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.phone.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((staff) => !selectedRole || staff.role === selectedRole)
    .filter((staff) => !selectedDepartment || staff.department === selectedDepartment)
    .filter((staff) => !selectedStatus || staff.status === selectedStatus)
    .sort((a, b) => {
      let comparison = 0

      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortField === "role") {
        comparison = a.role.localeCompare(b.role)
      } else if (sortField === "department") {
        comparison = a.department.localeCompare(b.department)
      } else if (sortField === "joinDate") {
        comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

  // Toggle sort direction or change sort field
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Get status badge based on status
  const getStatusBadge = (status: StaffMember["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "on-leave":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">On Leave</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      default:
        return null
    }
  }

  // Calculate staff statistics
  const totalStaff = staffMembers.length
  const activeStaff = staffMembers.filter((staff) => staff.status === "active").length
  const onLeaveStaff = staffMembers.filter((staff) => staff.status === "on-leave").length
  const inactiveStaff = staffMembers.filter((staff) => staff.status === "inactive").length

  return (
    <div className="flex flex-col gap-5  md:p-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sales persons</h1>
      </div>

      <StaffTable
        staff={filteredStaff.filter((staff) => staff.department === "sales")}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    </div>
  )
}

interface StaffTableProps {
  staff: StaffMember[]
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
}

function StaffTable({ staff, sortField, sortDirection, onSort }: StaffTableProps) {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return sortDirection === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
  }

  const getStatusBadge = (status: StaffMember["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "on-leave":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">On Leave</Badge>
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
            <TableHead className="cursor-pointer" onClick={() => onSort("name")}>
              <div className="flex items-center">Staff Member {getSortIcon("name")}</div>
            </TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("joinDate")}>
              <div className="flex items-center">Join Date {getSortIcon("joinDate")}</div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                <UserCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2">No staff members found</p>
              </TableCell>
            </TableRow>
          ) : (
            staff.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-xs">
                    <div className="flex items-center">
                      <Mail className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Phone className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span>{member.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span>{new Date(member.joinDate).toLocaleDateString()}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
