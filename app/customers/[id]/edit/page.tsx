"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  Ruler,
  Heart,
  X,
  Save,
  Phone,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateCustomerSchema } from "../../validation";
import { useCustomer, useUpdateCustomer } from "../../use-customers";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditCustomerPage() {
  const router = useRouter();
  const params = useParams() as { id: string };

  const customerId = Number.parseInt(params.id);
  const { data: customer, isLoading: isLoadingCustomer } =
    useCustomer(customerId);
  const updateCustomer = useUpdateCustomer();

  const [preferences, setPreferences] = useState<string[]>([]);
  const [newPreference, setNewPreference] = useState("");
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
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateCustomerSchema),
  });

  // Load customer data when available
  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name,
        phone: customer.phone,
        email: customer.email || "",
        status: customer.status as "new" | "active" | "platinum" | "gold" | "diamond"
      });

      if (customer.preferences) {
        setPreferences(customer.preferences);
      }

      if (customer.measurement) {
        setMeasurements({
          arabic: {
            frontLength:
              customer.measurement.arabic?.frontLength?.toString() || "",
            backLength:
              customer.measurement.arabic?.backLength?.toString() || "",
            shoulder: customer.measurement.arabic?.shoulder?.toString() || "",
            sleeves: customer.measurement.arabic?.sleeves?.toString() || "",
            neck: customer.measurement.arabic?.neck?.toString() || "",
            waist: customer.measurement.arabic?.waist?.toString() || "",
            chest: customer.measurement.arabic?.chest?.toString() || "",
            widthEnd: customer.measurement.arabic?.widthEnd?.toString() || "",
            notes: customer.measurement.arabic?.notes || "",
          },
          kuwaiti: {
            frontLength:
              customer.measurement.kuwaiti?.frontLength?.toString() || "",
            backLength:
              customer.measurement.kuwaiti?.backLength?.toString() || "",
            shoulder: customer.measurement.kuwaiti?.shoulder?.toString() || "",
            sleeves: customer.measurement.kuwaiti?.sleeves?.toString() || "",
            neck: customer.measurement.kuwaiti?.neck?.toString() || "",
            waist: customer.measurement.kuwaiti?.waist?.toString() || "",
            chest: customer.measurement.kuwaiti?.chest?.toString() || "",
            widthEnd: customer.measurement.kuwaiti?.widthEnd?.toString() || "",
            notes: customer.measurement.kuwaiti?.notes || "",
          },
        });
      }
    }
  }, [customer, reset]);

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
  ];

  const addPreference = (pref: string) => {
    if (pref && !preferences.includes(pref)) {
      setPreferences([...preferences, pref]);
    }
    setNewPreference("");
  };

  const removePreference = (pref: string) => {
    setPreferences(preferences.filter((p) => p !== pref));
  };

  const updateMeasurement = (
    style: "arabic" | "kuwaiti",
    field: string,
    value: string
  ) => {
    setMeasurements((prev) => ({
      ...prev,
      [style]: {
        ...prev[style],
        [field]: value,
      },
    }));
  };

  const onSubmit = async (data: any) => {
    try {
      // Convert string measurements to numbers
      const processedMeasurements = {
        arabic: Object.fromEntries(
          Object.entries(measurements.arabic).map(([key, value]) =>
            key === "notes"
              ? [key, value]
              : [key, value ? Number.parseFloat(value) : 0]
          )
        ),
        kuwaiti: Object.fromEntries(
          Object.entries(measurements.kuwaiti).map(([key, value]) =>
            key === "notes"
              ? [key, value]
              : [key, value ? Number.parseFloat(value) : 0]
          )
        ),
      };

      // Add measurements and preferences to form data
      const customerData = {
        ...data,
        preferences,
        measurement: processedMeasurements,
      };

      await updateCustomer.mutateAsync({ id: customerId, data: customerData });
      router.push(`/customers/${customerId}`);
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Failed to update customer");
    }
  };

  if (isLoadingCustomer) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link href={`/customers/${params.id}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Edit Customer</h1>
            <p className="text-muted-foreground">
              Loading customer information...
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Link href="/customers">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">Edit Customer</h1>
            <p className="text-muted-foreground">Customer not found</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500">
              Customer not found. Please check the ID and try again.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/customers">Return to Customers</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/customers/${params.id}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Edit Customer</h1>
          <p className="text-muted-foreground">
            Update customer information and preferences
          </p>
        </div>
        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
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
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name (English)</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500">
                        {errors.name.message as string}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500">
                          {errors.email.message as string}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Customer Status</Label>
                      <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={customer.status}
                          >
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
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone ? (
                      <p className="text-xs text-red-500">
                        {errors.phone.message as string}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        This phone number determines the customer group. All
                        customers with the same phone number will be grouped
                        together.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Group Information</Label>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">
                        Group ID: {customer.groupCode}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Customer ID: CUST-{customer.id}
                      </p>
                    </div>
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
                <CardDescription>
                  Professional measurements for custom tailoring
                </CardDescription>
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
                        <Label
                          htmlFor="arabic-frontLength"
                          className="text-xs text-muted-foreground font-arabic"
                        >
                          الطول أمام
                        </Label>
                        <Input
                          id="arabic-frontLength"
                          value={measurements.arabic.frontLength}
                          onChange={(e) =>
                            updateMeasurement(
                              "arabic",
                              "frontLength",
                              e.target.value
                            )
                          }
                          placeholder="27¾"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="arabic-backLength" className="text-sm">
                          Back Length
                        </Label>
                        <Label
                          htmlFor="arabic-backLength"
                          className="text-xs text-muted-foreground font-arabic"
                        >
                          الطول خلف
                        </Label>
                        <Input
                          id="arabic-backLength"
                          value={measurements.arabic.backLength}
                          onChange={(e) =>
                            updateMeasurement(
                              "arabic",
                              "backLength",
                              e.target.value
                            )
                          }
                          placeholder="27¾"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="arabic-shoulder" className="text-sm">
                          Shoulder
                        </Label>
                        <Label
                          htmlFor="arabic-shoulder"
                          className="text-xs text-muted-foreground font-arabic"
                        >
                          الكتف
                        </Label>
                        <Input
                          id="arabic-shoulder"
                          value={measurements.arabic.shoulder}
                          onChange={(e) =>
                            updateMeasurement(
                              "arabic",
                              "shoulder",
                              e.target.value
                            )
                          }
                          placeholder="16½"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="arabic-sleeves" className="text-sm">
                          Sleeves
                        </Label>
                        <Label
                          htmlFor="arabic-sleeves"
                          className="text-xs text-muted-foreground font-arabic"
                        >
                          الأيدي
                        </Label>
                        <Input
                          id="arabic-sleeves"
                          value={measurements.arabic.sleeves}
                          onChange={(e) =>
                            updateMeasurement(
                              "arabic",
                              "sleeves",
                              e.target.value
                            )
                          }
                          placeholder="24¼"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="arabic-neck" className="text-sm">
                          Neck
                        </Label>
                        <Label
                          htmlFor="arabic-neck"
                          className="text-xs text-muted-foreground font-arabic"
                        >
                          الرقبة
                        </Label>
                        <Input
                          id="arabic-neck"
                          value={measurements.arabic.neck}
                          onChange={(e) =>
                            updateMeasurement("arabic", "neck", e.target.value)
                          }
                          placeholder="11½"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="arabic-waist" className="text-sm">
                          Waist
                        </Label>
                        <Label
                          htmlFor="arabic-waist"
                          className="text-xs text-muted-foreground font-arabic"
                        >
                          الوسط
                        </Label>
                        <Input
                          id="arabic-waist"
                          value={measurements.arabic.waist}
                          onChange={(e) =>
                            updateMeasurement("arabic", "waist", e.target.value)
                          }
                          placeholder="32"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="arabic-chest" className="text-sm">
                          Chest
                        </Label>
                        <Label
                          htmlFor="arabic-chest"
                          className="text-xs text-muted-foreground font-arabic"
                        >
                          الصدر
                        </Label>
                        <Input
                          id="arabic-chest"
                          value={measurements.arabic.chest}
                          onChange={(e) =>
                            updateMeasurement("arabic", "chest", e.target.value)
                          }
                          placeholder="38"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="arabic-widthEnd" className="text-sm">
                          Width End
                        </Label>
                        <Label
                          htmlFor="arabic-widthEnd"
                          className="text-xs text-muted-foreground font-arabic"
                        >
                          نهاية العرض
                        </Label>
                        <Input
                          id="arabic-widthEnd"
                          value={measurements.arabic.widthEnd}
                          onChange={(e) =>
                            updateMeasurement(
                              "arabic",
                              "widthEnd",
                              e.target.value
                            )
                          }
                          placeholder="19½"
                        />
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <Label htmlFor="arabic-notes">Measurement Notes</Label>
                      <Textarea
                        id="arabic-notes"
                        value={measurements.arabic.notes}
                        onChange={(e) =>
                          updateMeasurement("arabic", "notes", e.target.value)
                        }
                        placeholder="Additional notes about measurements or fitting preferences..."
                        rows={3}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="kuwaiti">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="kuwaiti-frontLength"
                          className="text-sm"
                        >
                          Front Length
                        </Label>
                        <Label
                          htmlFor="kuwaiti-frontLength"
                          className="text-xs text-muted-foreground font-arabic"
                        >
                          الطول أمام
                        </Label>
                        <Input
                          id="kuwaiti-frontLength"
                          value={measurements.kuwaiti.frontLength}
                          onChange={(e) =>
                            updateMeasurement(
                              "kuwaiti",
                              "frontLength",
                              e.target.value
                            )
                          }
                          placeholder="27¾"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="kuwaiti-backLength" className="text-sm">
                          Back Length
                        </Label>
                        <Label
                          htmlFor="kuwaiti-backLength"
                          className="text-xs text-muted-foreground font-arabic"
                        >
                          الطول خلف
                        </Label>
                        <Input
                          id="kuwaiti-backLength"
                          value={measurements.kuwaiti.backLength}
                          onChange={(e) =>
                            updateMeasurement(
                              "kuwaiti",
                              "backLength",
                              e.target.value
                            )
                          }
                          placeholder="27¾"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="kuwaiti-shoulder" className="text-sm">
                          Shoulder
                        </Label>
                        <Label
                          htmlFor="kuwaiti-shoulder"
                          className="text-xs text-muted-foreground font-arabic"
                        >
                          الكتف
                        </Label>
                        <Input
                          id="kuwaiti-shoulder"
                          value={measurements.kuwaiti.shoulder}
                          onChange={(e) =>
                            updateMeasurement(
                              "kuwaiti",
                              "shoulder",
                              e.target.value
                            )
                          }
                          placeholder="16½"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="kuwaiti-sleeves" className="text-sm">
                          Sleeves
                        </Label>
                        <Label
                          htmlFor="kuwaiti-sleeves"
                          className="text-xs text-muted-foreground font-arabic"
                        >
                          الأيدي
                        </Label>
                        <Input
                          id="kuwaiti-sleeves"
                          value={measurements.kuwaiti.sleeves}
                          onChange={(e) =>
                            updateMeasurement(
                              "kuwaiti",
                              "sleeves",
                              e.target.value
                            )
                          }
                          placeholder="24¼"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="kuwaiti-neck" className="text-sm">
                          Neck
                        </Label>
                        <Label
                          htmlFor="kuwaiti-neck"
                          className="text-xs text-muted-foreground font-arabic"
                        >
                          الرقبة
                        </Label>
                        <Input
                          id="kuwaiti-neck"
                          value={measurements.kuwaiti.neck}
                          onChange={(e) =>
                            updateMeasurement("kuwaiti", "neck", e.target.value)
                          }
                          placeholder="11½"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="kuwaiti-waist" className="text-sm">
                          Waist
                        </Label>
                        <Label
                          htmlFor="kuwaiti-waist"
                          className="text-xs text-muted-foreground font-arabic"
                        >
                          الوسط
                        </Label>
                        <Input
                          id="kuwaiti-waist"
                          value={measurements.kuwaiti.waist}
                          onChange={(e) =>
                            updateMeasurement(
                              "kuwaiti",
                              "waist",
                              e.target.value
                            )
                          }
                          placeholder="32"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="kuwaiti-chest" className="text-sm">
                          Chest
                        </Label>
                        <Label
                          htmlFor="kuwaiti-chest"
                          className="text-xs text-muted-foreground font-arabic"
                        >
                          الصدر
                        </Label>
                        <Input
                          id="kuwaiti-chest"
                          value={measurements.kuwaiti.chest}
                          onChange={(e) =>
                            updateMeasurement(
                              "kuwaiti",
                              "chest",
                              e.target.value
                            )
                          }
                          placeholder="38"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="kuwaiti-widthEnd" className="text-sm">
                          Width End
                        </Label>
                        <Label
                          htmlFor="kuwaiti-widthEnd"
                          className="text-xs text-muted-foreground font-arabic"
                        >
                          نهاية العرض
                        </Label>
                        <Input
                          id="kuwaiti-widthEnd"
                          value={measurements.kuwaiti.widthEnd}
                          onChange={(e) =>
                            updateMeasurement(
                              "kuwaiti",
                              "widthEnd",
                              e.target.value
                            )
                          }
                          placeholder="19½"
                        />
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <Label htmlFor="kuwaiti-notes">Measurement Notes</Label>
                      <Textarea
                        id="kuwaiti-notes"
                        value={measurements.kuwaiti.notes}
                        onChange={(e) =>
                          updateMeasurement("kuwaiti", "notes", e.target.value)
                        }
                        placeholder="Additional notes about measurements or fitting preferences..."
                        rows={3}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
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
                <CardDescription>
                  Update customer preferences for better service
                </CardDescription>
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
                              addPreference(pref);
                            } else {
                              removePreference(pref);
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
                  <Label htmlFor="customPreference">
                    Add Custom Preference
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="customPreference"
                      value={newPreference}
                      onChange={(e) => setNewPreference(e.target.value)}
                      placeholder="Enter custom preference"
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addPreference(newPreference))
                      }
                    />
                    <Button
                      type="button"
                      onClick={() => addPreference(newPreference)}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Selected Preferences</Label>
                  <div className="flex flex-wrap gap-2">
                    {preferences.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No preferences selected
                      </p>
                    ) : (
                      preferences.map((pref) => (
                        <Badge
                          key={pref}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {pref}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removePreference(pref)}
                          />
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
          <Link href={`/customers/${params.id}`}>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Update Customer
          </Button>
        </div>
      </form>
    </div>
  );
}
