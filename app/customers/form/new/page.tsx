"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Users, Ruler, Heart, X, Save, Phone } from "lucide-react"
import Link from "next/link"

export default function NewCustomerPage() {
  const [customerType, setCustomerType] = useState<"individual" | "family_head" | "family_member">("individual")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [existingGroup, setExistingGroup] = useState<any>(null)
  const [preferences, setPreferences] = useState<string[]>([])
  const [newPreference, setNewPreference] = useState("")
  const [measurements, setMeasurements] = useState({
    frontLength: "", // الطول أمام
    backLength: "", // الطول خلف
    shoulder: "", // الكتف
    sleeves: "", // الأيدي
    neck: "", // الرقبة
    waist: "", // الوسط
    chest: "", // الصدر
    widthEnd: "", // نهاية العرض
    notes: "",
  })

  const preferenceOptions = [
    "Luxury Fabrics",
    "Abayas",
    "Kandura",
    "Business Suits",
    "Evening Wear",
    "Custom Tailoring",
    "Ready-made",
    "Alterations",
    "Rush Orders",
    "Premium Cotton",
    "Silk Fabrics",
    "French Cuffs",
    "Modern Cuts",
    "Traditional Wear",
  ]

  // Mock existing groups for phone number lookup
  const existingGroups = [
    {
      groupId: "GRP-001",
      phoneNumber: "+971 50 123 4567",
      primaryCustomer: "Fatima Mohammed Al Zahra",
      totalMembers: 3,
    },
    {
      groupId: "GRP-002",
      phoneNumber: "+971 55 987 6543",
      primaryCustomer: "Ahmed Abdullah Al Mansouri",
      totalMembers: 1,
    },
  ]

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value)

    // Check if phone number exists in any group
    const group = existingGroups.find((g) => g.phoneNumber === value)
    if (group) {
      setExistingGroup(group)
      setCustomerType("family_member")
    } else {
      setExistingGroup(null)
      setCustomerType("individual")
    }
  }

  const addPreference = (pref: string) => {
    if (pref && !preferences.includes(pref)) {
      setPreferences([...preferences, pref])
    }
    setNewPreference("")
  }

  const removePreference = (pref: string) => {
    setPreferences(preferences.filter((p) => p !== pref))
  }

  const updateMeasurement = (field: string, value: string) => {
    setMeasurements((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // Save logic here
    console.log("Creating new customer:", {
      customerType,
      phoneNumber,
      existingGroup,
      measurements,
      preferences,
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/customers">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Add New Customer</h1>
          <p className="text-muted-foreground">Create a new customer profile with measurements and preferences</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Create Customer
        </Button>
      </div>

      <form className="space-y-6">
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name (English) *</Label>
                      <Input id="name" placeholder="Enter full name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nameArabic">Full Name (Arabic)</Label>
                      <Input id="nameArabic" placeholder="أدخل الاسم الكامل" className="font-arabic" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="customer@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Customer Status</Label>
                      <Select defaultValue="new">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="vip">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact & Group Detection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => handlePhoneNumberChange(e.target.value)}
                      placeholder="+971 50 123 4567"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Phone number is used for customer grouping. Family members share the same phone number.
                    </p>
                  </div>

                  {existingGroup && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <p className="text-sm font-medium text-blue-800">Existing Group Found</p>
                      </div>
                      <p className="text-xs text-blue-700">
                        Group ID: {existingGroup.groupId}
                        <br />
                        Primary Contact: {existingGroup.primaryCustomer}
                        <br />
                        Total Members: {existingGroup.totalMembers}
                      </p>
                      <p className="text-xs text-blue-600 mt-2">
                        This customer will be added to the existing group as a family member.
                      </p>
                    </div>
                  )}

                  {!existingGroup && phoneNumber && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-green-600" />
                        <p className="text-sm font-medium text-green-800">New Group</p>
                      </div>
                      <p className="text-xs text-green-700">
                        A new customer group will be created for this phone number.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="measurements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="h-5 w-5" />
                  Body Measurements
                </CardTitle>
                <CardDescription>
                  Professional measurements for custom tailoring (based on Arabic invoice format)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frontLength" className="text-sm">
                      Front Length
                    </Label>
                    <Label htmlFor="frontLength" className="text-xs text-muted-foreground font-arabic">
                      الطول أمام
                    </Label>
                    <Input
                      id="frontLength"
                      value={measurements.frontLength}
                      onChange={(e) => updateMeasurement("frontLength", e.target.value)}
                      placeholder="27¾"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backLength" className="text-sm">
                      Back Length
                    </Label>
                    <Label htmlFor="backLength" className="text-xs text-muted-foreground font-arabic">
                      الطول خلف
                    </Label>
                    <Input
                      id="backLength"
                      value={measurements.backLength}
                      onChange={(e) => updateMeasurement("backLength", e.target.value)}
                      placeholder="27¾"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shoulder" className="text-sm">
                      Shoulder
                    </Label>
                    <Label htmlFor="shoulder" className="text-xs text-muted-foreground font-arabic">
                      الكتف
                    </Label>
                    <Input
                      id="shoulder"
                      value={measurements.shoulder}
                      onChange={(e) => updateMeasurement("shoulder", e.target.value)}
                      placeholder="16½"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sleeves" className="text-sm">
                      Sleeves
                    </Label>
                    <Label htmlFor="sleeves" className="text-xs text-muted-foreground font-arabic">
                      الأيدي
                    </Label>
                    <Input
                      id="sleeves"
                      value={measurements.sleeves}
                      onChange={(e) => updateMeasurement("sleeves", e.target.value)}
                      placeholder="24¼"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="neck" className="text-sm">
                      Neck
                    </Label>
                    <Label htmlFor="neck" className="text-xs text-muted-foreground font-arabic">
                      الرقبة
                    </Label>
                    <Input
                      id="neck"
                      value={measurements.neck}
                      onChange={(e) => updateMeasurement("neck", e.target.value)}
                      placeholder="11½"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="waist" className="text-sm">
                      Waist
                    </Label>
                    <Label htmlFor="waist" className="text-xs text-muted-foreground font-arabic">
                      الوسط
                    </Label>
                    <Input
                      id="waist"
                      value={measurements.waist}
                      onChange={(e) => updateMeasurement("waist", e.target.value)}
                      placeholder="32"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chest" className="text-sm">
                      Chest
                    </Label>
                    <Label htmlFor="chest" className="text-xs text-muted-foreground font-arabic">
                      الصدر
                    </Label>
                    <Input
                      id="chest"
                      value={measurements.chest}
                      onChange={(e) => updateMeasurement("chest", e.target.value)}
                      placeholder="38"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="widthEnd" className="text-sm">
                      Width End
                    </Label>
                    <Label htmlFor="widthEnd" className="text-xs text-muted-foreground font-arabic">
                      نهاية العرض
                    </Label>
                    <Input
                      id="widthEnd"
                      value={measurements.widthEnd}
                      onChange={(e) => updateMeasurement("widthEnd", e.target.value)}
                      placeholder="19½"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Label htmlFor="measurementNotes">Measurement Notes</Label>
                  <Textarea
                    id="measurementNotes"
                    value={measurements.notes}
                    onChange={(e) => updateMeasurement("notes", e.target.value)}
                    placeholder="Additional notes about measurements or fitting preferences..."
                    rows={3}
                  />
                </div>

                {/* Measurement Guide */}
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-3">Measurement Guide</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>
                        <strong>Front Length (الطول أمام):</strong> From shoulder to desired hem length
                      </p>
                      <p>
                        <strong>Back Length (الطول خلف):</strong> From back neck to desired hem length
                      </p>
                      <p>
                        <strong>Shoulder (الكتف):</strong> Across shoulder blades
                      </p>
                      <p>
                        <strong>Sleeves (الأيدي):</strong> From shoulder to wrist
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Neck (الرقبة):</strong> Around the neck circumference
                      </p>
                      <p>
                        <strong>Waist (الوسط):</strong> Around the natural waistline
                      </p>
                      <p>
                        <strong>Chest (الصدر):</strong> Around the fullest part of chest
                      </p>
                      <p>
                        <strong>Width End (نهاية العرض):</strong> Bottom hem width
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Customer Preferences
                </CardTitle>
                <CardDescription>Set customer preferences for personalized service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Quick Select Preferences</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {preferenceOptions.map((pref) => (
                      <div key={pref} className="flex items-center space-x-2">
                        <Checkbox
                          id={pref}
                          checked={preferences.includes(pref)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              addPreference(pref)
                            } else {
                              removePreference(pref)
                            }
                          }}
                        />
                        <Label htmlFor={pref} className="text-sm">
                          {pref}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customPreference">Add Custom Preference</Label>
                  <div className="flex gap-2">
                    <Input
                      id="customPreference"
                      value={newPreference}
                      onChange={(e) => setNewPreference(e.target.value)}
                      placeholder="Enter custom preference"
                      onKeyPress={(e) => e.key === "Enter" && addPreference(newPreference)}
                    />
                    <Button type="button" onClick={() => addPreference(newPreference)}>
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Selected Preferences</Label>
                  <div className="flex flex-wrap gap-2">
                    {preferences.map((pref) => (
                      <Badge key={pref} variant="secondary" className="flex items-center gap-1">
                        {pref}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removePreference(pref)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

        <div className="flex justify-end gap-4">
          <Link href="/customers">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Create Customer
          </Button>
        </div>
      </form>
    </div>
  )
}
