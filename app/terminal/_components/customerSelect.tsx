"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User, X, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuickCustomerCreationForm from "./customerAddForm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getColorFromChar } from "@/lib/utils"

export interface CustomerListItem {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: "new" | "active" | "gold" | "platinum" | "diamond" | "inactive";
}

interface Props {
  customers: CustomerListItem[];
  customerId?: number;
  setValue: any;
}

export default function CustomerSelectDialog({
  customers,
  customerId,
  setValue,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  const filtered = useMemo(() => {
    return customers
      .filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.phone.includes(search) ||
          c.id.toString().includes(search)
      )
      .slice(0, visibleCount);
  }, [search, visibleCount, customers]);

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerListItem | null>(null);



  const handleSelect = (customer: CustomerListItem) => {
    setSelectedCustomer(customer)
    setValue("customerId", customer.id);
    setValue("customerName", customer.name);
    if (isNewCustomer) {
      setIsNewCustomer(false);
    }
  };

  const getStatusColor = (status: CustomerListItem["status"]) => {
    switch (status) {
      case "new":
        return "bg-gray-500";
      case "active":
        return "bg-green-400";
      case "gold":
        return "bg-yellow-400";
      case "platinum":
        return "bg-blue-300";
      case "diamond":
        return "bg-purple-400";
      case "inactive":
        return "bg-red-300";
    }
  };

  const c = customers.find(c => c.id === customerId) ?? null;


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-8 text-xs w-full justify-between"
        >
          {selectedCustomer ? selectedCustomer.name : "Select customer"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg p-4  space-y-2 min-h-[512px] max-h-[512px] overflow-y-auto">
        {isNewCustomer ? (
          <QuickCustomerCreationForm onBack={() => setIsNewCustomer(false)} handleSelect={handleSelect} />
        ) : c ? (
          <>
            <DialogHeader>
              <DialogTitle>Selected customer details</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center gap-6 h-full  shadow-sm rounded-full px-4 py-2 space-x-3">
              <div className={` bg-blue-500 w-20 h-20 border uppercase rounded-full flex items-center justify-center text-white`}>
                {c?.name.charAt(0)}
              </div>
              <div className="space-y-4 text-center">
                <h1 className="text-4xl font-medium">{c?.name}</h1>
                <p className="text-lg font-mono">{c?.phone}</p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="bg-green-500 hover:bg-green-600 text-zinc-50 w-full flex gap-2 hover:text-zinc-100"
                onClick={() => {
                  setOpen(false)
                }}
              >
                <Plus className="w-6 h-6 text-zinc-50" />
                Select and continue
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="bg-red-500 hover:bg-red-600 text-zinc-50 w-full flex gap-2 hover:text-zinc-100"
                onClick={() => {
                  setSelectedCustomer(null);
                  setValue("customerId", undefined);
                  setValue("customerName", "");
                }}
              >
                <X className="w-6 h-6 text-zinc-50" />
                Deselect & change
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Select or add new customer</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Search by name, phone, or ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 text-xs"
            />
            <ScrollArea className="h-64 border rounded-sm">
              <Table>
                <TableHeader>
                  <TableRow className="text-xs">
                    <TableHead className="w-1/6">ID</TableHead>
                    <TableHead className="w-1/3">Name</TableHead>
                    <TableHead className="w-1/3">Phone</TableHead>
                    <TableHead className="w-1/6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((customer) => (
                    <TableRow
                      key={customer.id}
                      onClick={() => handleSelect(customer)}
                      className="text-xs cursor-pointer hover:bg-muted"
                    >
                      <TableCell>{customer.id}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {customer.name}
                      </TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>
                        <Badge
                          className={`text-white ${getStatusColor(customer.status)} px-4 py-0.5 text-[10px]`}
                        >
                          {customer.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-xs">
                        No customers found

                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
            {visibleCount < customers.length && (
              <Button
                variant="ghost"
                className="text-xs h-6 w-full"
                onClick={() => setVisibleCount((c) => c + 10)}
              >
                Load more
              </Button>
            )}
            <div className="flex justify-end w-full">
              <Button className="w-full" onClick={() => setIsNewCustomer(true)}>
                Create new customer
              </Button>
            </div>
          </>
        )
        }
      </DialogContent>
    </Dialog>
  );
}
