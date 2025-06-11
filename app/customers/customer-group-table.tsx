"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronRight, MoreHorizontal, Phone, Users, Eye, Edit, Star, Crown, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import type { CustomerGroup } from "./types/customer"
import { useDeleteCustomer } from "./use-customers"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CustomerGroupTableProps {
  customerGroups: CustomerGroup[]
  searchQuery: string
}

export function CustomerGroupTable({ customerGroups, searchQuery }: CustomerGroupTableProps) {
  const [expandedGroups, setExpandedGroups] = useState<number[]>([])
  const deleteCustomer = useDeleteCustomer()

  const toggleGroup = (groupId: number) => {
    setExpandedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  const handleDeleteCustomer = (customerId: number) => {
    deleteCustomer.mutate(customerId)
  }

  // Filter customer groups based on search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return customerGroups

    const query = searchQuery.toLowerCase()
    return customerGroups.filter(
      (group) =>
        group.name.toLowerCase().includes(query) ||
        group.phone.toLowerCase().includes(query) ||
        `GRP-${group.groupId}`.toLowerCase().includes(query) ||
        group.customers.some((customer) => customer.name.toLowerCase().includes(query)),
    )
  }, [customerGroups, searchQuery])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "platinum":
      case "gold":
      case "diamond":
        const tierColors = {
          diamond: "bg-purple-100 text-purple-800 border-purple-200",
          platinum: "bg-gray-100 text-gray-800 border-gray-200",
          gold: "bg-amber-100 text-amber-800 border-amber-200",
        }
        return (
          <Badge className={tierColors[status as keyof typeof tierColors] || "bg-amber-100 text-amber-800"}>
            <Crown className="mr-1 h-3 w-3" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
      case "new":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">New</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Customer Groups {filteredGroups.length > 0 && `(${filteredGroups.length})`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredGroups.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery ? "No customers match your search" : "No customer groups found"}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredGroups.map((group) => (
              <Collapsible
                key={group.groupId}
                open={expandedGroups.includes(group.groupId)}
                onOpenChange={() => toggleGroup(group.groupId)}
              >
                <div className="border rounded-lg">
                  {/* Group Header */}
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {expandedGroups.includes(group.groupId) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <Phone className="h-4 w-4 text-muted-foreground" />
                        </div>

                        <Avatar>
                          <AvatarFallback>
                            {group.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <div className="font-medium">{group.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {group.phone} • GRP-{group.groupId}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">AED {group.totalSpent}</div>
                          <div className="text-sm text-muted-foreground">
                            {group.customerCount} customer{group.customerCount > 1 ? "s" : ""}
                          </div>
                        </div>

                        <Badge variant="default">active</Badge>
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  {/* Group Members */}
                  <CollapsibleContent>
                    <div className="border-t">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Orders</TableHead>
                            <TableHead>Total Spent</TableHead>
                            <TableHead>Last Purchase</TableHead>
                            <TableHead>Preferences</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {group.customers.map((customer) => (
                            <TableRow key={customer.id} className="hover:bg-muted/50">
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs">
                                      {customer.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{customer.name}</div>
                                    <div className="text-xs text-muted-foreground">CUST-{customer.id}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(customer.status)}</TableCell>
                              <TableCell>{customer.ordersCount || 0}</TableCell>
                              <TableCell>AED {(customer.totalSpent || 0).toLocaleString()}</TableCell>
                              <TableCell>
                                {customer.lastPurchaseDate
                                  ? new Date(customer.lastPurchaseDate).toLocaleDateString()
                                  : "Never"}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                  {customer.preferences &&
                                    customer.preferences.slice(0, 2).map((pref, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {pref}
                                      </Badge>
                                    ))}
                                  {customer.preferences && customer.preferences.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{customer.preferences.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link href={`/customers/${customer.id}`}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Profile
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link href={`/customers/${customer.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Customer
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Star className="mr-2 h-4 w-4" />
                                      {["platinum", "gold", "diamond"].includes(customer.status)
                                        ? "Remove VIP"
                                        : "Make VIP"}
                                    </DropdownMenuItem>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                          <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                          <span className="text-red-500">Delete</span>
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete this customer? This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteCustomer(customer.id)}
                                            className="bg-red-500 hover:bg-red-600"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
