"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CustomItemMeasurement {
  frontLength: string
  backLength: string
  shoulder: string
  sleeves: string
  neck: string
  waist: string
  chest: string
  widthEnd: string
  notes?: string
}

interface Customer {
  id: number
  name: string
  measurement?: {
    arabic: CustomItemMeasurement
    kuwaiti: CustomItemMeasurement
  }
}

interface MeasurementDialogProps {
  customer: Customer
  onComplete: (measurement: CustomItemMeasurement) => void
  onClose: () => void
}

export default function MeasurementDialog({ customer, onComplete, onClose }: MeasurementDialogProps) {
  const [activeTab, setActiveTab] = useState("arabic")
  const [measurement, setMeasurement] = useState<CustomItemMeasurement>(
    customer.measurement?.arabic || {
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
  )

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab === "arabic" && customer.measurement?.arabic) {
      setMeasurement(customer.measurement.arabic)
    } else if (tab === "kuwaiti" && customer.measurement?.kuwaiti) {
      setMeasurement(customer.measurement.kuwaiti)
    }
  }

  const handleInputChange = (field: keyof CustomItemMeasurement, value: string) => {
    setMeasurement((prev) => ({ ...prev, [field]: value }))
  }

  const handleComplete = () => {
    // Validate required fields
    const requiredFields = ["frontLength", "backLength", "shoulder", "sleeves", "neck", "waist", "chest", "widthEnd"]
    const isValid = requiredFields.every((field) => measurement[field as keyof CustomItemMeasurement])

    if (!isValid) {
      alert("Please fill in all measurement fields")
      return
    }

    onComplete(measurement)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Measurements for {customer.name}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="arabic">Arabic Style</TabsTrigger>
            <TabsTrigger value="kuwaiti">Kuwaiti Style</TabsTrigger>
          </TabsList>

          <TabsContent value="arabic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frontLength">Front Length (cm)</Label>
                <Input
                  id="frontLength"
                  value={measurement.frontLength}
                  onChange={(e) => handleInputChange("frontLength", e.target.value)}
                  placeholder="58"
                />
              </div>
              <div>
                <Label htmlFor="backLength">Back Length (cm)</Label>
                <Input
                  id="backLength"
                  value={measurement.backLength}
                  onChange={(e) => handleInputChange("backLength", e.target.value)}
                  placeholder="60"
                />
              </div>
              <div>
                <Label htmlFor="shoulder">Shoulder (cm)</Label>
                <Input
                  id="shoulder"
                  value={measurement.shoulder}
                  onChange={(e) => handleInputChange("shoulder", e.target.value)}
                  placeholder="45"
                />
              </div>
              <div>
                <Label htmlFor="sleeves">Sleeves (cm)</Label>
                <Input
                  id="sleeves"
                  value={measurement.sleeves}
                  onChange={(e) => handleInputChange("sleeves", e.target.value)}
                  placeholder="62"
                />
              </div>
              <div>
                <Label htmlFor="neck">Neck (cm)</Label>
                <Input
                  id="neck"
                  value={measurement.neck}
                  onChange={(e) => handleInputChange("neck", e.target.value)}
                  placeholder="42"
                />
              </div>
              <div>
                <Label htmlFor="waist">Waist (cm)</Label>
                <Input
                  id="waist"
                  value={measurement.waist}
                  onChange={(e) => handleInputChange("waist", e.target.value)}
                  placeholder="44"
                />
              </div>
              <div>
                <Label htmlFor="chest">Chest (cm)</Label>
                <Input
                  id="chest"
                  value={measurement.chest}
                  onChange={(e) => handleInputChange("chest", e.target.value)}
                  placeholder="48"
                />
              </div>
              <div>
                <Label htmlFor="widthEnd">Width End (cm)</Label>
                <Input
                  id="widthEnd"
                  value={measurement.widthEnd}
                  onChange={(e) => handleInputChange("widthEnd", e.target.value)}
                  placeholder="28"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="kuwaiti" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frontLength">Front Length (cm)</Label>
                <Input
                  id="frontLength"
                  value={measurement.frontLength}
                  onChange={(e) => handleInputChange("frontLength", e.target.value)}
                  placeholder="56"
                />
              </div>
              <div>
                <Label htmlFor="backLength">Back Length (cm)</Label>
                <Input
                  id="backLength"
                  value={measurement.backLength}
                  onChange={(e) => handleInputChange("backLength", e.target.value)}
                  placeholder="58"
                />
              </div>
              <div>
                <Label htmlFor="shoulder">Shoulder (cm)</Label>
                <Input
                  id="shoulder"
                  value={measurement.shoulder}
                  onChange={(e) => handleInputChange("shoulder", e.target.value)}
                  placeholder="44"
                />
              </div>
              <div>
                <Label htmlFor="sleeves">Sleeves (cm)</Label>
                <Input
                  id="sleeves"
                  value={measurement.sleeves}
                  onChange={(e) => handleInputChange("sleeves", e.target.value)}
                  placeholder="60"
                />
              </div>
              <div>
                <Label htmlFor="neck">Neck (cm)</Label>
                <Input
                  id="neck"
                  value={measurement.neck}
                  onChange={(e) => handleInputChange("neck", e.target.value)}
                  placeholder="41"
                />
              </div>
              <div>
                <Label htmlFor="waist">Waist (cm)</Label>
                <Input
                  id="waist"
                  value={measurement.waist}
                  onChange={(e) => handleInputChange("waist", e.target.value)}
                  placeholder="43"
                />
              </div>
              <div>
                <Label htmlFor="chest">Chest (cm)</Label>
                <Input
                  id="chest"
                  value={measurement.chest}
                  onChange={(e) => handleInputChange("chest", e.target.value)}
                  placeholder="47"
                />
              </div>
              <div>
                <Label htmlFor="widthEnd">Width End (cm)</Label>
                <Input
                  id="widthEnd"
                  value={measurement.widthEnd}
                  onChange={(e) => handleInputChange("widthEnd", e.target.value)}
                  placeholder="27"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <div>
            <Label htmlFor="notes">Special Notes</Label>
            <Textarea
              id="notes"
              value={measurement.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any special instructions or preferences..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleComplete}>Confirm Measurements</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
