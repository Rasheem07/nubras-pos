"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Building } from "lucide-react"

interface SupplierCreateModalProps {
  trigger?: React.ReactNode
  onSupplierCreated?: (supplier: any) => void
}

export function SupplierCreateModal({ trigger, onSupplierCreated }: SupplierCreateModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    email: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In real app, this would call your backend API
    const newSupplier = {
      id: Date.now(), // Mock ID
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log("Creating supplier:", newSupplier)

    // Call the callback if provided
    onSupplierCreated?.(newSupplier)

    // Reset form and close modal
    setFormData({ name: "", phone: "", location: "", email: "" })
    setIsOpen(false)
  }

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Plus className="mr-2 h-4 w-4" />
      Add Supplier
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Add New Supplier
          </DialogTitle>
          <DialogDescription>
            Create a new supplier for your inventory management. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Supplier Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter supplier name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="+971 XX XXX XXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="supplier@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Textarea
                id="location"
                placeholder="Enter supplier address/location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Supplier</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
