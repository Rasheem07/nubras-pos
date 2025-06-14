"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Scissors } from "lucide-react"

interface ProductTypeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (type: "ready-made" | "custom") => void
  productName: string
}

export default function ProductTypeDialog({ open, onOpenChange, onSelect, productName }: ProductTypeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Product Type</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            "{productName}" is available as both ready-made and custom. Please select how you would like to proceed:
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center gap-2"
              onClick={() => {
                onSelect("ready-made")
                onOpenChange(false)
              }}
            >
              <ShoppingBag className="h-8 w-8" />
              <div>
                <div className="font-medium">Ready-Made</div>
                <div className="text-xs text-muted-foreground">Standard pricing</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center gap-2"
              onClick={() => {
                onSelect("custom")
                onOpenChange(false)
              }}
            >
              <Scissors className="h-8 w-8" />
              <div>
                <div className="font-medium">Custom</div>
                <div className="text-xs text-muted-foreground">With measurements</div>
              </div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
