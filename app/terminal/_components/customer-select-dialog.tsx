"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Search, User, Plus } from "lucide-react"

interface Customer {
  id: number
  name: string
  phone: string
  email: string
  status: string
}

interface CustomerSelectDialogProps {
  customers: Customer[]
  onSelect: (customer: Customer) => void
}

export default function CustomerSelectDialog({ customers, onSelect }: CustomerSelectDialogProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCustomers = customers.filter(
    (customer) => customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.phone.includes(searchTerm),
  )

  const handleSelect = (customer: Customer) => {
    onSelect(customer)
    setOpen(false)
    setSearchTerm("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center">
          <User className="w-6 h-6 mb-1" />
          <span className="text-sm">Select Customer</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Customer</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name or phone..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Add New Customer Button */}
          <Button variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add New Customer
          </Button>

          {/* Customer List */}
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSelect(customer)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{customer.name}</h3>
                      <p className="text-sm text-gray-600">{customer.phone}</p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                    <Badge variant="outline">{customer.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
