"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Delete } from "lucide-react"

interface NumericKeypadProps {
  value: string
  onChange: (value: string) => void
  onClose: () => void
  maxValue?: number
}

export default function NumericKeypad({ value, onChange, onClose, maxValue }: NumericKeypadProps) {
  const handleNumberClick = (num: string) => {
    const newValue = value + num
    if (maxValue && Number.parseFloat(newValue) > maxValue) return
    onChange(newValue)
  }

  const handleDecimalClick = () => {
    if (!value.includes(".")) {
      onChange(value + ".")
    }
  }

  const handleBackspace = () => {
    onChange(value.slice(0, -1))
  }

  const handleClear = () => {
    onChange("")
  }

  const handleMaxAmount = () => {
    if (maxValue) {
      onChange(maxValue.toFixed(2))
    }
  }

  return (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Enter Amount</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-2xl font-bold text-center py-2 bg-gray-50 rounded">AED {value || "0.00"}</div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Number Grid */}
        <div className="grid grid-cols-3 gap-2">
          {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
            <Button
              key={num}
              variant="outline"
              size="lg"
              className="h-12 text-lg font-semibold"
              onClick={() => handleNumberClick(num.toString())}
            >
              {num}
            </Button>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="lg" className="h-12 text-lg font-semibold" onClick={handleDecimalClick}>
            .
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 text-lg font-semibold"
            onClick={() => handleNumberClick("0")}
          >
            0
          </Button>
          <Button variant="outline" size="lg" className="h-12" onClick={handleBackspace}>
            <Delete className="w-5 h-5" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          {maxValue && (
            <Button variant="secondary" onClick={handleMaxAmount}>
              Max (AED {maxValue.toFixed(2)})
            </Button>
          )}
        </div>

        <Button className="w-full" onClick={onClose}>
          Confirm
        </Button>
      </CardContent>
    </Card>
  )
}
