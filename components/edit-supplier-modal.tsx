"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Building } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Supplier {
  id: number;
  name: string;
  phone: string;
  location: string | null;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface EditSupplierModalProps {
  supplier: Supplier;
  trigger?: React.ReactNode;
  onSupplierUpdated?: (supplier: Supplier) => void;
}

export function EditSupplierModal({
  supplier,
  trigger,
  onSupplierUpdated,
}: EditSupplierModalProps) {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode"); // replace 'key' with your param name
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (mode === "edit") {
      setIsOpen(true);
    }
  }, [mode]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    email: "",
  });

  // Initialize form data when supplier changes or modal opens
  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        phone: supplier.phone,
        location: supplier.location || "",
        email: supplier.email || "",
      });
    }
  }, [supplier, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In real app, this would call your backend API
    const updatedSupplier = {
      ...supplier,
      ...formData,
      updatedAt: new Date(),
    };

    console.log("Updating supplier:", updatedSupplier);

    // Call the callback if provided
    onSupplierUpdated?.(updatedSupplier);

    // Close modal
    setIsOpen(false);
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: supplier.name,
      phone: supplier.phone,
      location: supplier.location || "",
      email: supplier.email || "",
    });
    setIsOpen(false);
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Edit className="mr-2 h-4 w-4" />
      Edit
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Edit Supplier
          </DialogTitle>
          <DialogDescription>
            Update supplier information. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">
                Supplier Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                placeholder="Enter supplier name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-phone"
                placeholder="+971 XX XXX XXXX"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="supplier@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-location">Location</Label>
              <Textarea
                id="edit-location"
                placeholder="Enter supplier address/location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Update Supplier</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
