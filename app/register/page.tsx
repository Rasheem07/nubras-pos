"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Power, Store, Monitor, DollarSign, Clock, User } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

export default function RegisterPage() {
  const { t } = useTranslation()
  const [openingCash, setOpeningCash] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRegisterOpen = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    // Redirect to POS or show success
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Power className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Open Register</h1>
          <p className="text-gray-600">Start your POS session</p>
        </div>

        {/* Session Info Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center">
              <Monitor className="mr-2 h-5 w-5 text-blue-600" />
              Session Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Store & Terminal Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex items-center text-gray-600">
                  <Store className="mr-1 h-3 w-3" />
                  Store
                </div>
                <div className="font-medium">Main Store - Downtown</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-gray-600">
                  <Monitor className="mr-1 h-3 w-3" />
                  Terminal
                </div>
                <div className="font-medium">Terminal 01</div>
              </div>
            </div>

            <Separator />

            {/* Session Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex items-center text-gray-600">
                  <User className="mr-1 h-3 w-3" />
                  Cashier
                </div>
                <div className="font-medium">John Doe</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-gray-600">
                  <Clock className="mr-1 h-3 w-3" />
                  Date & Time
                </div>
                <div className="font-medium">{new Date().toLocaleString()}</div>
              </div>
            </div>

            <Separator />

            {/* Opening Cash */}
            <div className="space-y-3">
              <Label htmlFor="opening-cash" className="text-base font-medium flex items-center">
                <DollarSign className="mr-2 h-4 w-4 text-green-600" />
                Opening Cash Amount
              </Label>
              <Input
                id="opening-cash"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={openingCash}
                onChange={(e) => setOpeningCash(e.target.value)}
                className="text-lg text-center font-mono"
              />
              <p className="text-xs text-gray-500 text-center">Enter the cash amount in the register drawer</p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Any notes for this session..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <Button
          onClick={handleRegisterOpen}
          disabled={!openingCash || isLoading}
          className="w-full h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Opening Register...
            </div>
          ) : (
            <div className="flex items-center">
              <Power className="mr-2 h-5 w-5" />
              Open Register
            </div>
          )}
        </Button>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">Session will be tracked for audit purposes</div>
      </div>
    </div>
  )
}
