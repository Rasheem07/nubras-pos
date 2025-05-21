"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Printer,
  Download,
  AlertTriangle,
} from "lucide-react"

export default function StaffDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // In a real app, this would fetch the staff member from the database using the ID
  const staffId = params.id as string

  // Mock data for the staff member
  const staff = {
    id: staffId,
    name: "Mohammed Ali",
    role: "Salesperson",
    department: "Sales",
    email: "mohammed.ali@nubras.com",
    phone: "+971 50 123 4567",
    address: "Downtown Dubai, Dubai, UAE",
    emergencyContact: "+971 55 987 6543 (Fatima Ali - Wife)",
    status: "active",
    joinDate: "2022-01-15",
    salary: 8000,
    bankAccount: "ENBD-1234567890",
    idNumber: "784-1234-5678901-2",
    passport: "A12345678",
    workPermit: "WP-12345-2022",
    notes: "Top performing salesperson for 3 consecutive quarters. Fluent in Arabic, English, and Urdu.",
    image: "/stylized-letter-ma.png",
  }

  // Mock data for attendance
  const attendance = [
    { date: "2024-05-01", status: "present", checkIn: "08:45", checkOut: "17:30" },
    { date: "2024-05-02", status: "present", checkIn: "08:30", checkOut: "17:15" },
    { date: "2024-05-03", status: "present", checkIn: "08:55", checkOut: "17:45" },
    { date: "2024-05-04", status: "present", checkIn: "08:40", checkOut: "17:20" },
    { date: "2024-05-05", status: "absent", checkIn: "", checkOut: "" },
    { date: "2024-05-06", status: "present", checkIn: "08:35", checkOut: "17:10" },
    { date: "2024-05-07", status: "late", checkIn: "09:20", checkOut: "17:30" },
  ]

  // Mock data for sales performance
  const salesPerformance = [
    { month: "January", sales: 120000, target: 100000, commission: 6000 },
    { month: "February", sales: 95000, target: 100000, commission: 4750 },
    { month: "March", sales: 135000, target: 110000, commission: 6750 },
    { month: "April", sales: 150000, target: 120000, commission: 7500 },
  ]

  const handleDelete = () => {
    // In a real app, this would delete the staff member from the database
    console.log(`Deleting ${staff.name}`)
    setIsDeleteDialogOpen(false)
    router.push("/staff")
  }

  const getStatusBadge = (status: string) => {
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

  const getAttendanceStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Present</Badge>
      case "absent":
        return <Badge variant="destructive">Absent</Badge>
      case "late":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Late</Badge>
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/staff">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{staff.name}</h1>
          {getStatusBadge(staff.status)}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/staff/${staffId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Staff Member</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this staff member? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Staff Details</CardTitle>
              <CardDescription>Basic information about the staff member</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                    <p>{staff.role}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
                    <p>{staff.department}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                    <div className="flex items-center">
                      <Mail className="mr-1 h-4 w-4 text-muted-foreground" />
                      <p>{staff.email}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                    <div className="flex items-center">
                      <Phone className="mr-1 h-4 w-4 text-muted-foreground" />
                      <p>{staff.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                      <p>{staff.address}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Join Date</h3>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                      <p>{new Date(staff.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Emergency Contact</h3>
                    <p>{staff.emergencyContact}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">ID Number</h3>
                    <p>{staff.idNumber}</p>
                  </div>
                </div>
              </div>

              {staff.notes && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                    <p>{staff.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="attendance" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            <TabsContent value="attendance" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Record</CardTitle>
                  <CardDescription>Recent attendance history</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Hours</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendance.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>{getAttendanceStatusBadge(record.status)}</TableCell>
                          <TableCell>
                            {record.checkIn ? (
                              <div className="flex items-center">
                                <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                                {record.checkIn}
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            {record.checkOut ? (
                              <div className="flex items-center">
                                <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                                {record.checkOut}
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            {record.checkIn && record.checkOut ? calculateHours(record.checkIn, record.checkOut) : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="performance" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                  <CardDescription>Monthly sales performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Sales</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Achievement</TableHead>
                        <TableHead>Commission</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesPerformance.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell>{record.month}</TableCell>
                          <TableCell>AED {record.sales.toLocaleString()}</TableCell>
                          <TableCell>AED {record.target.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {record.sales >= record.target ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  {Math.round((record.sales / record.target) * 100)}%
                                </Badge>
                              ) : (
                                <Badge variant="outline">{Math.round((record.sales / record.target) * 100)}%</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>AED {record.commission.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Staff Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Avatar className="h-48 w-48">
                  <AvatarImage src={staff.image || "/placeholder.svg"} alt={staff.name} />
                  <AvatarFallback className="text-4xl">{staff.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Employment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <div>{getStatusBadge(staff.status)}</div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Join Date:</span>
                <span className="font-medium">{new Date(staff.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tenure:</span>
                <span className="font-medium">{calculateTenure(staff.joinDate)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Salary:</span>
                <span className="font-medium">AED {staff.salary.toLocaleString()}/month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Bank Account:</span>
                <span className="font-medium">{staff.bankAccount}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">ID Card:</span>
                <span className="font-medium">{staff.idNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Passport:</span>
                <span className="font-medium">{staff.passport}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Work Permit:</span>
                <span className="font-medium">{staff.workPermit}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/staff/${staffId}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Staff
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                View Contract
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Printer className="mr-2 h-4 w-4" />
                Print Details
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline" className="w-full justify-start text-amber-600">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Mark as On Leave
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Helper function to calculate hours between check-in and check-out
function calculateHours(checkIn: string, checkOut: string): string {
  const [inHour, inMinute] = checkIn.split(":").map(Number)
  const [outHour, outMinute] = checkOut.split(":").map(Number)

  const inMinutes = inHour * 60 + inMinute
  const outMinutes = outHour * 60 + outMinute
  const diffMinutes = outMinutes - inMinutes

  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60

  return `${hours}h ${minutes}m`
}

// Helper function to calculate tenure
function calculateTenure(joinDate: string): string {
  const join = new Date(joinDate)
  const now = new Date()

  const diffTime = Math.abs(now.getTime() - join.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  const years = Math.floor(diffDays / 365)
  const months = Math.floor((diffDays % 365) / 30)

  if (years > 0) {
    return `${years} year${years > 1 ? "s" : ""} ${months} month${months > 1 ? "s" : ""}`
  } else {
    return `${months} month${months > 1 ? "s" : ""}`
  }
}
