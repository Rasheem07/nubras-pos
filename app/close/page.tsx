"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { PowerOff, Store, Monitor, DollarSign, Clock, User, TrendingUp, Receipt, AlertTriangle } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

export default function ClosePage() {
  const { t } = useTranslation()
  const [closingCash, setClosingCash] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Mock session data
  const sessionData = {
    sessionId: "SES-2024-001234",
    openedAt: "2024-01-25 09:00:00",
    openingCash: 500.0,
    totalSales: 2450.75,
    totalTransactions: 47,
    cashSales: 1200.5,
    cardSales: 1250.25,
    expectedCash: 1700.5, // opening + cash sales
  }

  const difference = closingCash ? Number.parseFloat(closingCash) - sessionData.expectedCash : 0

  const handleRegisterClose = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    // Redirect or show success
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
            <PowerOff className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Close Register</h1>
          <p className="text-gray-600">End your POS session</p>
        </div>

        {/* Session Summary Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center">
              <Receipt className="mr-2 h-5 w-5 text-red-600" />
              Session Summary
            </CardTitle>
            <CardDescription>Session {sessionData.sessionId}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Info */}
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

            {/* Session Duration */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex items-center text-gray-600">
                  <Clock className="mr-1 h-3 w-3" />
                  Session Started
                </div>
                <div className="font-medium">{sessionData.openedAt}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-gray-600">
                  <User className="mr-1 h-3 w-3" />
                  Duration
                </div>
                <div className="font-medium">8h 30m</div>
              </div>
            </div>

            <Separator />

            {/* Sales Summary */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center">
                <TrendingUp className="mr-2 h-4 w-4 text-green-600" />
                Sales Summary
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Sales:</span>
                    <span className="font-medium">AED {sessionData.totalSales.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transactions:</span>
                    <span className="font-medium">{sessionData.totalTransactions}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cash Sales:</span>
                    <span className="font-medium">AED {sessionData.cashSales.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Card Sales:</span>
                    <span className="font-medium">AED {sessionData.cardSales.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Cash Reconciliation */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center">
                <DollarSign className="mr-2 h-4 w-4 text-blue-600" />
                Cash Reconciliation
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Opening Cash:</span>
                  <span className="font-medium">AED {sessionData.openingCash.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cash Sales:</span>
                  <span className="font-medium">+AED {sessionData.cashSales.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Expected Cash:</span>
                  <span>AED {sessionData.expectedCash.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Closing Cash Input */}
            <div className="space-y-3">
              <Label htmlFor="closing-cash" className="text-base font-medium">
                Actual Cash Count
              </Label>
              <Input
                id="closing-cash"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={closingCash}
                onChange={(e) => setClosingCash(e.target.value)}
                className="text-lg text-center font-mono"
              />

              {/* Difference Display */}
              {closingCash && (
                <div
                  className={`p-3 rounded-lg ${
                    Math.abs(difference) < 0.01
                      ? "bg-green-50 border border-green-200"
                      : "bg-yellow-50 border border-yellow-200"
                  }`}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      {Math.abs(difference) < 0.01 ? (
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                      )}
                      Difference:
                    </span>
                    <span
                      className={`font-medium ${
                        Math.abs(difference) < 0.01
                          ? "text-green-700"
                          : difference > 0
                            ? "text-green-700"
                            : "text-red-700"
                      }`}
                    >
                      {difference > 0 ? "+" : ""}AED {difference.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {Math.abs(difference) < 0.01
                      ? "Cash count matches expected amount"
                      : difference > 0
                        ? "Cash overage detected"
                        : "Cash shortage detected"}
                  </p>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Closing Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Any issues or notes for this session..."
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
          onClick={handleRegisterClose}
          disabled={!closingCash || isLoading}
          className="w-full h-12 text-lg font-medium bg-red-600 hover:bg-red-700"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Closing Register...
            </div>
          ) : (
            <div className="flex items-center">
              <PowerOff className="mr-2 h-5 w-5" />
              Close Register
            </div>
          )}
        </Button>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">All session data will be saved for audit purposes</div>
      </div>
    </div>
  )
}
