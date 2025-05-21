"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function EditStaffPage() {
  const router = useRouter()
  const params = useParams();
  const id = params.id;

  // In a real app, you would fetch the staff data based on the ID
  const [staffData, setStaffData] = useState({
    id: "STF-" + id,
    firstName: "Ahmed",
    lastName: "Al Mansouri",
    email: "ahmed@example.com",
    phone: "+971 50 123 4567",
    position: "Tailor",
    department: "Production",
    joinDate: "2022-03-15",
    salary: 5000,
    salaryType: "monthly",
    status: "active",
    address: "123 Main St, Dubai, UAE",
    emergencyContact: "Fatima Al Mansouri: +971 50 987 6543",
    notes: "Specialized in traditional kandura tailoring with 10+ years of experience.",
    skills: ["Kandura", "Abaya", "Alterations"],
    permissions: {
      pos: true,
      inventory: false,
      reports: false,
      customers: true,
      settings: false,
    },
  })

  const handleChange = (field: string, value: any) => {
    setStaffData({
      ...staffData,
      [field]: value,
    })
  }

  const handlePermissionChange = (permission: string, value: boolean) => {
    setStaffData({
      ...staffData,
      permissions: {
        ...staffData.permissions,
        [permission]: value,
      },
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would save the data to your backend
    console.log("Saving staff data:", staffData)
    router.push(`/staff/${id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/staff/${id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Edit Staff Member</h1>
        </div>
        <Button onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="employment">Employment Details</TabsTrigger>
          <TabsTrigger value="skills">Skills & Qualifications</TabsTrigger>
          <TabsTrigger value="access">Access & Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update the staff member's personal details and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={staffData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={staffData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={staffData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={staffData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={staffData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="emergency">Emergency Contact</Label>
                  <Input
                    id="emergency"
                    value={staffData.emergencyContact}
                    onChange={(e) => handleChange("emergencyContact", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
              <CardDescription>Update employment information, position, and salary details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Select value={staffData.position} onValueChange={(value) => handleChange("position", value)}>
                    <SelectTrigger id="position">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Tailor">Tailor</SelectItem>
                      <SelectItem value="Cashier">Cashier</SelectItem>
                      <SelectItem value="Sales Associate">Sales Associate</SelectItem>
                      <SelectItem value="Inventory Clerk">Inventory Clerk</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={staffData.department} onValueChange={(value) => handleChange("department", value)}>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Management">Management</SelectItem>
                      <SelectItem value="Production">Production</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Inventory">Inventory</SelectItem>
                      <SelectItem value="Customer Service">Customer Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joinDate">Join Date</Label>
                  <Input
                    id="joinDate"
                    type="date"
                    value={staffData.joinDate}
                    onChange={(e) => handleChange("joinDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={staffData.status} onValueChange={(value) => handleChange("status", value)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on-leave">On Leave</SelectItem>
                      <SelectItem value="terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary (AED)</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={staffData.salary}
                    onChange={(e) => handleChange("salary", Number.parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryType">Salary Type</Label>
                  <Select value={staffData.salaryType} onValueChange={(value) => handleChange("salaryType", value)}>
                    <SelectTrigger id="salaryType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="commission">Commission-based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skills & Qualifications</CardTitle>
              <CardDescription>Update the staff member's skills, qualifications, and notes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {["Kandura", "Abaya", "Alterations", "Embroidery", "Cutting", "Fitting"].map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Switch
                        id={`skill-${skill}`}
                        checked={staffData.skills.includes(skill)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleChange("skills", [...staffData.skills, skill])
                          } else {
                            handleChange(
                              "skills",
                              staffData.skills.filter((s) => s !== skill),
                            )
                          }
                        }}
                      />
                      <Label htmlFor={`skill-${skill}`}>{skill}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={staffData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Access & Permissions</CardTitle>
              <CardDescription>Configure system access and permissions for this staff member.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Module Access</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="pos-access"
                      checked={staffData.permissions.pos}
                      onCheckedChange={(checked) => handlePermissionChange("pos", checked)}
                    />
                    <Label htmlFor="pos-access">POS Terminal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="inventory-access"
                      checked={staffData.permissions.inventory}
                      onCheckedChange={(checked) => handlePermissionChange("inventory", checked)}
                    />
                    <Label htmlFor="inventory-access">Inventory Management</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="reports-access"
                      checked={staffData.permissions.reports}
                      onCheckedChange={(checked) => handlePermissionChange("reports", checked)}
                    />
                    <Label htmlFor="reports-access">Reports & Analytics</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="customers-access"
                      checked={staffData.permissions.customers}
                      onCheckedChange={(checked) => handlePermissionChange("customers", checked)}
                    />
                    <Label htmlFor="customers-access">Customer Management</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="settings-access"
                      checked={staffData.permissions.settings}
                      onCheckedChange={(checked) => handlePermissionChange("settings", checked)}
                    />
                    <Label htmlFor="settings-access">System Settings</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
