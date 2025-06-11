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
import { ArrowLeft, User, Ruler, Heart, X, Save, Phone, Loader2 } from "lucide-react"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createCustomerSchema } from "../../validation"
import { useCreateCustomer } from "../../use-customers"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function NewCustomerPage() {
  const router = useRouter()
  const createCustomer = useCreateCustomer()

  const [preferences, setPreferences] = useState<string[]>([])
  const [newPreference, setNewPreference] = useState("")
  const [measurements, setMeasurements] = useState({
    arabic: {
      frontLength: "",
      backLength: "",
      shoulder: "",
      sleeves: "",
      neck: "",
      waist: "",
      chest: "",
      widthEnd: "",
      notes: "",
    },
    kuwaiti: {
      frontLength: "",
      backLength: "",
      shoulder: "",
      sleeves: "",
      neck: "",
      waist: "",
      chest: "",
      widthEnd: "",
      notes: "",
    },
  })

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: undefined,
      status: "new",
    },
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

  const addPreference = (pref: string) => {
    if (pref && !preferences.includes(pref)) {
      setPreferences([...preferences, pref])
    }
    setNewPreference("")
  }

  const removePreference = (pref: string) => {
    setPreferences(preferences.filter((p) => p !== pref))
  }

  const updateMeasurement = (style: "arabic" | "kuwaiti", field: string, value: string) => {
    setMeasurements((prev) => ({
      ...prev,
      [style]: {
        ...prev[style],
        [field]: value,
      },
    }))
  }

  const onSubmit = async (data: any) => {
    try {
      // Convert string measurements to numbers
      const processedMeasurements = {
        arabic: Object.fromEntries(
          Object.entries(measurements.arabic).map(([key, value]) =>
            key === "notes" ? [key, value] : [key, value ? Number.parseFloat(value) : 0],
          ),
        ),
        kuwaiti: Object.fromEntries(
          Object.entries(measurements.kuwaiti).map(([key, value]) =>
            key === "notes" ? [key, value] : [key, value ? Number.parseFloat(value) : 0],
          ),
        ),
      }

      // Add measurements and preferences to form data
      const customerData = {
        ...data,
        preferences,
        measurement: processedMeasurements,
      }

      await createCustomer.mutateAsync(customerData)
      router.push("/customers")
    } catch (error) {
      console.error("Error creating customer:", error)
      toast.error("Failed to create customer")
    }
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
        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Create Customer
        </Button>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                      <Input
                        id="name"
                        placeholder="Enter full name"
                        {...register("name")}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <p className="text-xs text-red-500">{errors.name.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nameArabic">Full Name (Arabic)</Label>
                      <Input id="nameArabic" placeholder="أدخل الاسم الكامل" className="font-arabic" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="customer@example.com"
                        {...register("email")}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-xs text-red-500">{errors.email.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Customer Status</Label>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="platinum">Platinum</SelectItem>
                              <SelectItem value="gold">Gold</SelectItem>
                              <SelectItem value="diamond">Diamond</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
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
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="+971 50 123 4567"
                      {...register("phone")}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone ? (
                      <p className="text-xs text-red-500">{errors.phone.message as string}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Phone number is used for customer grouping. Family members share the same phone number.
                      </p>
                    )}
                  </div>
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
                <CardDescription>Professional measurements for custom tailoring</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="arabic">
                  <TabsList className="mb-4">
                    <TabsTrigger value="arabic">Arabic Style</TabsTrigger>
                    <TabsTrigger value="kuwaiti">Kuwaiti Style</TabsTrigger>
                  </TabsList>

                  <TabsContent value="arabic">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="arabic-frontLength" className="text-sm">
                          Front Length
                        </Label>
                        <Label htmlFor="arabic-frontLength" className="text-xs text-muted-foreground font-arabic">
                          الطول أمام
                        </Label>
                        <Input
                          id="arabic-frontLength"
                          value={measurements.arabic.frontLength}
                          onChange={(e) => updateMeasurement("arabic", "frontLength", e.target.value)}
                          placeholder="27¾"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="arabic-backLength" className="text-sm">
                          Back Length
                        </Label>
                        <Label htmlFor="arabic-backLength" className="text-xs text-muted-foreground font-arabic">
                          الطول خلف
                        </Label>
                        <Input
                          id="arabic-backLength"
                          value={measurements.arabic.backLength}
                          onChange={(e) => updateMeasurement("arabic", "backLength", e.target.value)}
                          placeholder="27¾"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="arabic-shoulder" className="text-sm">
                          Shoulder
                        </Label>
                        <Label htmlFor="arabic-shoulder" className="text-xs text-muted-foreground font-arabic">
                          الكتف
                        </Label>
                        <Input
                          id="arabic-shoulder"
                          value={measurements.arabic.shoulder}
                          onChange={(e) => updateMeasurement("arabic", "shoulder", e.target.value)}
                          placeholder="16½"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="arabic-sleeves" className="text-sm">
                          Sleeves
                        </Label>
                        <Label htmlFor="arabic-sleeves" className="text-xs text-muted-foreground font-arabic">
                          الأيدي
                        </Label>
                        <Input
                          id="arabic-sleeves"
                          value={measurements.arabic.sleeves}
                          onChange={(e) => updateMeasurement("arabic", "sleeves", e.target.value)}
                          placeholder="24¼"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="arabic-neck" className="text-sm">
                          Neck
                        </Label>
                        <Label htmlFor="arabic-neck" className="text-xs text-muted-foreground font-arabic">
                          الرقبة
                        </Label>
                        <Input
                          id="arabic-neck"
                          value={measurements.arabic.neck}
                          onChange={(e) => updateMeasurement("arabic", "neck", e.target.value)}
                          placeholder="11½"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="arabic-waist" className="text-sm">
                          Waist
                        </Label>
                        <Label htmlFor="arabic-waist" className="text-xs text-muted-foreground font-arabic">
                          الوسط
                        </Label>
                        <Input
                          id="arabic-waist"
                          value={measurements.arabic.waist}
                          onChange={(e) => updateMeasurement("arabic", "waist", e.target.value)}
                          placeholder="32"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="arabic-chest" className="text-sm">
                          Chest
                        </Label>
                        <Label htmlFor="arabic-chest" className="text-xs text-muted-foreground font-arabic">
                          الصدر
                        </Label>
                        <Input
                          id="arabic-chest"
                          value={measurements.arabic.chest}
                          onChange={(e) => updateMeasurement("arabic", "chest", e.target.value)}
                          placeholder="38"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="arabic-widthEnd" className="text-sm">
                          Width End
                        </Label>
                        <Label htmlFor="arabic-widthEnd" className="text-xs text-muted-foreground font-arabic">
                          نهاية العرض
                        </Label>
                        <Input
                          id="arabic-widthEnd"
                          value={measurements.arabic.widthEnd}
                          onChange={(e) => updateMeasurement("arabic", "widthEnd", e.target.value)}
                          placeholder="19½"
                        />
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <Label htmlFor="arabic-notes">Measurement Notes</Label>
                      <Textarea
                        id="arabic-notes"
                        value={measurements.arabic.notes}
                        onChange={(e) => updateMeasurement("arabic", "notes", e.target.value)}
                        placeholder="Additional notes about measurements or fitting preferences..."
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="kuwaiti">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="kuwaiti-frontLength" className="text-sm">
                          Front Length
                        </Label>
                        <Label htmlFor="kuwaiti-frontLength" className="text-xs text-muted-foreground font-arabic">
                          الطول أمام
                        </Label>
                        <Input
                          id="kuwaiti-frontLength"
                          value={measurements.kuwaiti.frontLength}
                          onChange={(e) => updateMeasurement("kuwaiti", "frontLength", e.target.value)}
                          placeholder="27¾"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="kuwaiti-backLength" className="text-sm">
                          Back Length
                        </Label>
                        <Label htmlFor="kuwaiti-backLength" className="text-xs text-muted-foreground font-arabic">
                          الطول خلف
                        </Label>
                        <Input
                          id="kuwaiti-backLength"
                          value={measurements.kuwaiti.backLength}
                          onChange={(e) => updateMeasurement("kuwaiti", "backLength", e.target.value)}
                          placeholder="27¾"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="kuwaiti-shoulder" className="text-sm">
                          Shoulder
                        </Label>
                        <Label htmlFor="kuwaiti-shoulder" className="text-xs text-muted-foreground font-arabic">
                          الكتف
                        </Label>
                        <Input
                          id="kuwaiti-shoulder"
                          value={measurements.kuwaiti.shoulder}
                          onChange={(e) => updateMeasurement("kuwaiti", "shoulder", e.target.value)}
                          placeholder="16½"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="kuwaiti-sleeves" className="text-sm">
                          Sleeves
                        </Label>
                        <Label htmlFor="kuwaiti-sleeves" className="text-xs text-muted-foreground font-arabic">
                          الأيدي
                        </Label>
                        <Input
                          id="kuwaiti-sleeves"
                          value={measurements.kuwaiti.sleeves}
                          onChange={(e) => updateMeasurement("kuwaiti", "sleeves", e.target.value)}
                          placeholder="24¼"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="kuwaiti-neck" className="text-sm">
                          Neck
                        </Label>
                        <Label htmlFor="kuwaiti-neck" className="text-xs text-muted-foreground font-arabic">
                          الرقبة
                        </Label>
                        <Input
                          id="kuwaiti-neck"
                          value={measurements.kuwaiti.neck}
                          onChange={(e) => updateMeasurement("kuwaiti", "neck", e.target.value)}
                          placeholder="11½"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="kuwaiti-waist" className="text-sm">
                          Waist
                        </Label>
                        <Label htmlFor="kuwaiti-waist" className="text-xs text-muted-foreground font-arabic">
                          الوسط
                        </Label>
                        <Input
                          id="kuwaiti-waist"
                          value={measurements.kuwaiti.waist}
                          onChange={(e) => updateMeasurement("kuwaiti", "waist", e.target.value)}
                          placeholder="32"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="kuwaiti-chest" className="text-sm">
                          Chest
                        </Label>
                        <Label htmlFor="kuwaiti-chest" className="text-xs text-muted-foreground font-arabic">
                          الصدر
                        </Label>
                        <Input
                          id="kuwaiti-chest"
                          value={measurements.kuwaiti.chest}
                          onChange={(e) => updateMeasurement("kuwaiti", "chest", e.target.value)}
                          placeholder="38"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="kuwaiti-widthEnd" className="text-sm">
                          Width End
                        </Label>
                        <Label htmlFor="kuwaiti-widthEnd" className="text-xs text-muted-foreground font-arabic">
                          نهاية العرض
                        </Label>
                        <Input
                          id="kuwaiti-widthEnd"
                          value={measurements.kuwaiti.widthEnd}
                          onChange={(e) => updateMeasurement("kuwaiti", "widthEnd", e.target.value)}
                          placeholder="19½"
                        />
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <Label htmlFor="kuwaiti-notes">Measurement Notes</Label>
                      <Textarea
                        id="kuwaiti-notes"
                        value={measurements.kuwaiti.notes}
                        onChange={(e) => updateMeasurement("kuwaiti", "notes", e.target.value)}
                        placeholder="Additional notes about measurements or fitting preferences..."
                        rows={3}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

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
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPreference(newPreference))}
                    />
                    <Button type="button" onClick={() => addPreference(newPreference)}>
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Selected Preferences</Label>
                  <div className="flex flex-wrap gap-2">
                    {preferences.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No preferences selected</p>
                    ) : (
                      preferences.map((pref) => (
                        <Badge key={pref} variant="secondary" className="flex items-center gap-1">
                          {pref}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removePreference(pref)} />
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Link href="/customers">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Create Customer
          </Button>
        </div>
      </form>
    </div>
  )
}
