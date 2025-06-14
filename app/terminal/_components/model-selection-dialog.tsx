"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Model {
  id: number
  productId: number
  name: string
  charge: number
}

interface ModelSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (model: Model) => void
  models: Model[]
  productName: string
  basePrice: number
}

export default function ModelSelectionDialog({
  open,
  onOpenChange,
  onSelect,
  models,
  productName,
  basePrice,
}: ModelSelectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Model for {productName}</DialogTitle>
        </DialogHeader>
        <div className="py-2 space-y-3">
          {models.map((model) => (
            <Button
              key={model.id}
              variant="outline"
              className="w-full justify-between h-auto p-4"
              onClick={() => {
                onSelect(model)
                onOpenChange(false)
              }}
            >
              <div className="text-left">
                <div className="font-medium">{model.name}</div>
                <div className="text-sm text-gray-500">Additional charge: AED {Number(model.charge).toFixed(2)}</div>
              </div>
              <div className="text-right font-bold">AED {(basePrice + Number(model.charge)).toFixed(2)}</div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
