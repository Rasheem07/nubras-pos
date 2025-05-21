"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Save, UserCircle, Upload, X } from "lucide-react"

export default function AddStaffPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    joinDate: new Date().toISOString().split("T")[0],
    status: "active",
    address: "",
    emergencyContact: "",
    notes: "",
    salary: "",
    bankAccount: "",
    idNumber: "",
    passport: "",
    workPermit: "",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the data to the database
    console.log("Form submitted:", formData)

    // Navigate back to staff list
    router.push("/staff")
  }

  const roles = [
    "Salesperson",
    "Tailor",
    "Manager",
    "Accountant",
    "Customer Service",
    "Delivery Driver",
    "Inventory Specialist",
  ]

  const departments = ["Sales", "Production", "Management", "Finance", "Logistics", "Inventory"]
  const statuses = ["active", "on-leave", "inactive"]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/staff">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Add Staff Member</h1>
        </div>
        <Button onClick={handleSubmit}>
          <Save className="mr-2 h-4 w-4" />
          Save Staff
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="employment">Employment Details</TabsTrigger>
                <TabsTrigger value="personal">Personal Details</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Enter the basic details of the staff member</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          placeholder="Enter full name"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter email address"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          Phone <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phone"
                          placeholder="Enter phone number"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          placeholder="Enter address"
                          value={formData.address}
                          onChange={(e) => handleChange("address", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Emergency Contact</Label>
                        <Input
                          id="emergencyContact"
                          placeholder="Enter emergency contact"
                          value={formData.emergencyContact}
                          onChange={(e) => handleChange("emergencyContact", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Enter any additional notes"
                          value={formData.notes}
                          onChange={(e) => handleChange("notes", e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="employment" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Employment Details</CardTitle>
                    <CardDescription>Manage employment information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="role">
                          Role <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
                          <SelectTrigger id="role">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">
                          Department <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.department}
                          onValueChange={(value) => handleChange("department", value)}
                        >
                          <SelectTrigger id="department">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((department) => (
                              <SelectItem key={department} value={department}>
                                {department}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="joinDate">
                          Join Date <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="joinDate"
                          type="date"
                          value={formData.joinDate}
                          onChange={(e) => handleChange("joinDate", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">
                          Status <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status === "active" ? "Active" : status === "on-leave" ? "On Leave" : "Inactive"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salary">Salary (AED)</Label>
                        <Input
                          id="salary"
                          type="number"
                          placeholder="Enter salary amount"
                          value={formData.salary}
                          onChange={(e) => handleChange("salary", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankAccount">Bank Account</Label>
                        <Input
                          id="bankAccount"
                          placeholder="Enter bank account details"
                          value={formData.bankAccount}
                          onChange={(e) => handleChange("bankAccount", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="personal" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Details</CardTitle>
                    <CardDescription>Add personal and identification information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="idNumber">ID Number</Label>
                        <Input
                          id="idNumber"
                          placeholder="Enter ID number"
                          value={formData.idNumber}
                          onChange={(e) => handleChange("idNumber", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="passport">Passport Number</Label>
                        <Input
                          id="passport"
                          placeholder="Enter passport number"
                          value={formData.passport}
                          onChange={(e) => handleChange("passport", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workPermit">Work Permit / Visa</Label>
                        <Input
                          id="workPermit"
                          placeholder="Enter work permit details"
                          value={formData.workPermit}
                          onChange={(e) => handleChange("workPermit", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff Photo</CardTitle>
                <CardDescription>Upload a photo of the staff member</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Staff preview"
                      className="w-full h-auto rounded-md object-cover"
                    />
                    <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={removeImage}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                    <UserCircle className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Drag and drop a photo or click to browse</p>
                    <Input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <Button variant="outline" onClick={() => document.getElementById("image")?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Photo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{formData.name || "Not set"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{formData.email || "Not set"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Role:</span>
                    <span className="font-medium">{formData.role || "Not set"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Department:</span>
                    <span className="font-medium">{formData.department || "Not set"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Join Date:</span>
                    <span className="font-medium">{formData.joinDate || "Not set"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium">
                      {formData.status === "active"
                        ? "Active"
                        : formData.status === "on-leave"
                          ? "On Leave"
                          : formData.status === "inactive"
                            ? "Inactive"
                            : "Not set"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleSubmit}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Staff
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
