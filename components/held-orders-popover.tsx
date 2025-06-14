"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, ShoppingBag, User, Calendar } from "lucide-react"
import { indexedDBManager, type HeldOrder } from "@/lib/indexeddb"
import { toast } from "sonner"

interface HeldOrdersPopoverProps {
  onRestoreOrder: (order: HeldOrder) => void
}

export function HeldOrdersPopover({ onRestoreOrder }: HeldOrdersPopoverProps) {
  const [heldOrders, setHeldOrders] = useState<HeldOrder[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    loadHeldOrders()
  }, [open])

  const loadHeldOrders = async () => {
    try {
      const orders = await indexedDBManager.getHeldOrders()
      setHeldOrders(orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch (error) {
      console.error("Failed to load held orders:", error)
      toast.error("Failed to load held orders")
    }
  }

  const handleCompleteOrder = async (order: HeldOrder) => {
    try {
      await indexedDBManager.deleteHeldOrder(order.id)
      onRestoreOrder(order)
      setOpen(false)
      toast.success("Order restored successfully")
      loadHeldOrders()
    } catch (error) {
      console.error("Failed to restore order:", error)
      toast.error("Failed to restore order")
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Clock className="h-4 w-4 mr-2" />
          Held Orders
          {heldOrders.length > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
              {heldOrders.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b">
          <h4 className="font-semibold">Held Orders</h4>
          <p className="text-sm text-muted-foreground">
            {heldOrders.length} order{heldOrders.length !== 1 ? "s" : ""} on hold
          </p>
        </div>
        <ScrollArea className="max-h-96">
          {heldOrders.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No held orders</div>
          ) : (
            <div className="p-2 space-y-2">
              {heldOrders.map((order) => (
                <div key={order.id} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-3 w-3" />
                        <span className="font-medium text-sm truncate">{order.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ShoppingBag className="h-3 w-3" />
                        <span>{order.items.length} items</span>
                        <span>•</span>
                        <span>AED {order.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {order.priority}
                    </Badge>
                  </div>
                  <Button size="sm" className="w-full h-7 text-xs" onClick={() => handleCompleteOrder(order)}>
                    Complete Order
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
