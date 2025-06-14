"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { PauseIcon as Hold, Clock, X } from "lucide-react"
import { useIndexedDB } from "../_hooks/use-indexed-db"

interface HeldOrder {
  id: string
  customerName: string
  totalAmount: string
  items: Array<{ description: string; qty: number }>
  heldAt: string
}

interface HoldOrdersPopoverProps {
  onSelectOrder: (order: any) => void
}

export default function HoldOrdersPopover({ onSelectOrder }: HoldOrdersPopoverProps) {
  const [open, setOpen] = useState(false)
  const [heldOrders, setHeldOrders] = useState<HeldOrder[]>([])
  const { getHeldOrders, removeHeldOrder } = useIndexedDB()

  useEffect(() => {
    if (open) {
      loadHeldOrders()
    }
  }, [open])

  const loadHeldOrders = async () => {
    const orders = await getHeldOrders()
    setHeldOrders(orders)
  }

  const handleSelectOrder = (order: HeldOrder) => {
    onSelectOrder(order)
    setOpen(false)
  }

  const handleRemoveOrder = async (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await removeHeldOrder(orderId)
    loadHeldOrders()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Hold className="w-4 h-4 mr-2" />
          Held Orders
          {heldOrders.length > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs">
              {heldOrders.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 overflow-visible" align="end">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Hold className="w-4 h-4" />
            <h3 className="font-semibold">Held Orders</h3>
          </div>

          {heldOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No held orders</p>
            </div>
          ) : (
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {heldOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleSelectOrder(order)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{order.customerName}</h4>
                        <p className="text-xs text-gray-500">
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-gray-500">{new Date(order.heldAt).toLocaleTimeString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">AED {Number.parseFloat(order.totalAmount).toFixed(2)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-6 h-6 p-0 text-red-500 hover:text-red-700"
                          onClick={(e) => handleRemoveOrder(order.id, e)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
