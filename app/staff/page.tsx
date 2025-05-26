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

  // Sample staff data
  const staffMembers: StaffMember[] = [
    {
      id: "STF-001",
      name: "Mohammed Ali",
      role: "Salesperson",
      department: "Sales",
      email: "mohammed.ali@nubras.com",
      phone: "+971 50 123 4567",
      status: "active",
      joinDate: "2022-01-15",
      image: "/stylized-letter-ma.png",
    },
    {
      id: "STF-002",
      name: "Aisha Mahmood",
      role: "Salesperson",
      department: "Sales",
      email: "aisha.m@nubras.com",
      phone: "+971 55 987 6543",
      status: "active",
      joinDate: "2022-03-10",
      image: "/abstract-am.png",
    },
    {
      id: "STF-003",
      name: "Khalid Rahman",
      role: "Tailor",
      department: "Production",
      email: "khalid.r@nubras.com",
      phone: "+971 52 456 7890",
      status: "active",
      joinDate: "2021-11-05",
      image: "/placeholder.svg?key=fnyb2",
    },
    {
      id: "STF-004",
      name: "Fatima Zahra",
      role: "Tailor",
      department: "Production",
      email: "fatima.z@nubras.com",
      phone: "+971 54 321 0987",
      status: "on-leave",
      joinDate: "2022-05-20",
      image: "/abstract-fz.png",
    },
    {
      id: "STF-005",
      name: "Yusuf Qasim",
      role: "Tailor",
      department: "Production",
      email: "yusuf.q@nubras.com",
      phone: "+971 56 789 0123",
      status: "active",
      joinDate: "2023-01-10",
      image: "/placeholder.svg?key=x4rnd",
    },
    {
      id: "STF-006",
      name: "Sara Al Ameri",
      role: "Manager",
      department: "Management",
      email: "sara.a@nubras.com",
      phone: "+971 50 987 6543",
      status: "active",
      joinDate: "2021-06-15",
      image: "/abstract-geometric-sa.png",
    },
    {
      id: "STF-007",
      name: "Hassan Al Farsi",
      role: "Accountant",
      department: "Finance",
      email: "hassan.f@nubras.com",
      phone: "+971 55 123 4567",
      status: "active",
      joinDate: "2022-08-01",
      image: "/ha-characters.png",
    },
    {
      id: "STF-008",
      name: "Layla Khan",
      role: "Customer Service",
      department: "Sales",
      email: "layla.k@nubras.com",
      phone: "+971 52 789 0123",
      status: "inactive",
      joinDate: "2022-04-10",
      image: "/abstract-geometric-lk.png",
    },
    {
      id: "STF-009",
      name: "Omar Saeed",
      role: "Delivery Driver",
      department: "Logistics",
      email: "omar.s@nubras.com",
      phone: "+971 54 456 7890",
      status: "active",
      joinDate: "2023-02-15",
      image: "/placeholder.svg?key=os9r2",
    },
    {
      id: "STF-010",
      name: "Mariam Hakim",
      role: "Inventory Specialist",
      department: "Inventory",
      email: "mariam.h@nubras.com",
      phone: "+971 56 321 0987",
      status: "active",
      joinDate: "2022-11-20",
      image: "/placeholder.svg?key=mh7r4",
    },
  ]

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
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link href="/staff/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Staff
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
            <p className="text-xs text-muted-foreground">Across {departments.length} departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeStaff}</div>
            <p className="text-xs text-muted-foreground">
              {((activeStaff / totalStaff) * 100).toFixed(0)}% of total staff
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onLeaveStaff}</div>
            <p className="text-xs text-muted-foreground">
              {((onLeaveStaff / totalStaff) * 100).toFixed(0)}% of total staff
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveStaff}</div>
            <p className="text-xs text-muted-foreground">
              {((inactiveStaff / totalStaff) * 100).toFixed(0)}% of total staff
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, email, or phone..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={selectedRole || "all"}
            onValueChange={(value) => setSelectedRole(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedDepartment || "all"}
            onValueChange={(value) => setSelectedDepartment(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((department) => (
                <SelectItem key={department} value={department}>
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedStatus || "all"}
            onValueChange={(value) => setSelectedStatus(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === "active" ? "Active" : status === "on-leave" ? "On Leave" : "Inactive"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">More filters</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Staff</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="production">Production</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <StaffTable staff={filteredStaff} sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
        </TabsContent>
        <TabsContent value="sales" className="space-y-4">
          <StaffTable
            staff={filteredStaff.filter((staff) => staff.department === "Sales")}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </TabsContent>
        <TabsContent value="production" className="space-y-4">
          <StaffTable
            staff={filteredStaff.filter((staff) => staff.department === "Production")}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </TabsContent>
        <TabsContent value="management" className="space-y-4">
          <StaffTable
            staff={filteredStaff.filter((staff) => staff.department === "Management")}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </TabsContent>
      </Tabs>
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
            <TableHead className="cursor-pointer" onClick={() => onSort("role")}>
              <div className="flex items-center">Role {getSortIcon("role")}</div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("department")}>
              <div className="flex items-center">Department {getSortIcon("department")}</div>
            </TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort("joinDate")}>
              <div className="flex items-center">Join Date {getSortIcon("joinDate")}</div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.department}</TableCell>
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
                <TableCell>{getStatusBadge(member.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span>{new Date(member.joinDate).toLocaleDateString()}</span>
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
                      <DropdownMenuItem asChild>
                        <Link href={`/staff/${member.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/staff/${member.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Staff
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
