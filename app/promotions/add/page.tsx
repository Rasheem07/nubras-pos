"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function AddPromotionPage() {
  const router = useRouter()
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [promotion, setPromotion] = useState({
    name: "",
    code: "",
    type: "percentage",
    value: "",
    minPurchase: "",
    maxDiscount: "",
    description: "",
    isActive: true,
    products: [],
    categories: [],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would add the promotion to the database
    console.log("Adding promotion:", {
      ...promotion,
      startDate,
      endDate,
    })

    // Navigate back to promotions page
    router.push("/promotions")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Create New Promotion</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promotion Details</CardTitle>
          <CardDescription>Create a new promotion or discount code for your customers.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Promotion Name</Label>
                  <Input
                    id="name"
                    value={promotion.name}
                    onChange={(e) => setPromotion({ ...promotion, name: e.target.value })}
                    placeholder="Summer Sale"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Promo Code</Label>
                  <Input
                    id="code"
                    value={promotion.code}
                    onChange={(e) => setPromotion({ ...promotion, code: e.target.value.toUpperCase() })}
                    placeholder="SUMMER25"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Discount Type</Label>
                  <Select
                    value={promotion.type}
                    onValueChange={(value) => setPromotion({ ...promotion, type: value })}
                    required
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">
                    {promotion.type === "percentage" ? "Discount Percentage" : "Discount Amount"}
                  </Label>
                  <div className="relative">
                    <Input
                      id="value"
                      type="number"
                      value={promotion.value}
                      onChange={(e) => setPromotion({ ...promotion, value: e.target.value })}
                      placeholder={promotion.type === "percentage" ? "25" : "100"}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-muted-foreground">
                      {promotion.type === "percentage" ? "%" : "AED"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="startDate"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="endDate"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minPurchase">Minimum Purchase (AED)</Label>
                  <Input
                    id="minPurchase"
                    type="number"
                    value={promotion.minPurchase}
                    onChange={(e) => setPromotion({ ...promotion, minPurchase: e.target.value })}
                    placeholder="200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxDiscount">Maximum Discount (AED)</Label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    value={promotion.maxDiscount}
                    onChange={(e) => setPromotion({ ...promotion, maxDiscount: e.target.value })}
                    placeholder="500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={promotion.description}
                  onChange={(e) => setPromotion({ ...promotion, description: e.target.value })}
                  placeholder="Promotion details and conditions"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={promotion.isActive}
                  onCheckedChange={(checked) => setPromotion({ ...promotion, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">Create Promotion</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
