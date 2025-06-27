"use client"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CustomerListItem {
  id: number
  name: string
  phone: string
  email: string
  status: "new" | "active" | "gold" | "platinum" | "diamond" | "inactive"
}

//
// 1) Zod schema
const measurementShape = z.object({
  frontLength: z.number().min(0),
  backLength: z.number().min(0),
  shoulder: z.number().min(0),
  sleeves: z.number().min(0),
  neck: z.number().min(0),
  waist: z.number().min(0),
  chest: z.number().min(0),
  widthEnd: z.number().min(0),
  notes: z.string().optional().or(z.literal("")),
})

const formSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  status: z.enum(["new", "active", "gold", "platinum", "diamond", "inactive"]),
  measurementsRequired: z.boolean(),
  measurement: z
    .object({
      arabic: measurementShape,
      kuwaiti: measurementShape,
    })
    .optional(),
})

type FormValues = z.infer<typeof formSchema>

//
// 2) Measurement fields
//
const measurementFields: Array<{
  key: keyof z.infer<typeof measurementShape>
  label: string
}> = [
    { key: "frontLength", label: "Front Length" },
    { key: "backLength", label: "Back Length" },
    { key: "shoulder", label: "Shoulder" },
    { key: "sleeves", label: "Sleeves" },
    { key: "neck", label: "Neck" },
    { key: "waist", label: "Waist" },
    { key: "chest", label: "Chest" },
    { key: "widthEnd", label: "Width End" },
    { key: "notes", label: "Notes" },
  ]

//
// 3) Component
//
export default function QuickCustomerCreationForm({
  onBack,
  handleSelect,
  open,
  onOpenChange,
}: {
  onBack: () => void
  handleSelect: (data: CustomerListItem) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      name: "",
      phone: "",
      email: undefined,
      status: "new",
      measurementsRequired: false,
      measurement: undefined,
    },
  })

  const { control, watch, handleSubmit } = form
  const measurementsRequired = watch("measurementsRequired")

  const onAddAndSelect = async (data: FormValues) => {
    console.log(data)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/customers`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    const json = await response.json()
    if (!response.ok) {
      toast.error(json.message)
      return
    }
    toast.success(json.message)
    handleSelect(json.newCustomer[0])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription className="max-w-sm">
            Fill in the details below to add a new customer and select them for further actions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onAddAndSelect)} className="space-y-6 max-w-md">
            {/* header */}

            {/* basic info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+971 50 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="customer@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* status using shadcn Select */}
              <FormField
                control={control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="gold">Gold</SelectItem>
                          <SelectItem value="platinum">Platinum</SelectItem>
                          <SelectItem value="diamond">Diamond</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* measurements switch */}
            <FormField
              control={control}
              name="measurementsRequired"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="!mb-0">Measurements required</FormLabel>
                </FormItem>
              )}
            />

            {/* measurement tabs */}
            {measurementsRequired && (
              <>
                <Separator />
                <Tabs defaultValue="arabic" className="w-full">
                  <TabsList>
                    <TabsTrigger value="arabic">Arabic</TabsTrigger>
                    <TabsTrigger value="kuwaiti">Kuwaiti</TabsTrigger>
                  </TabsList>

                  {(["arabic", "kuwaiti"] as const).map((locale) => (
                    <TabsContent key={locale} value={locale}>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {measurementFields.map(({ key, label }) => (
                          <FormField
                            key={`${locale}.${key}`}
                            control={control}
                            name={`measurement.${locale}.${key}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{label}</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </>
            )}

            {/* footer actions */}
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Back to list
              </Button>
              <Button type="submit">Add &amp; Select</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
