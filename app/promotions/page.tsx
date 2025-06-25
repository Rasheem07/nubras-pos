"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Promotion {
  id: number;
  name: string;
  code: string;
  type: "percentage" | "fixed-amount";
  value: number;
  minPurchaseAmt: number;
  maxPurchaseAmt: number;
  startDate: string;
  endDate: string;
  description?: string;
  enabled: boolean;
  // you can extend with usageCount & revenue if you add them server-side
}

export default function PromotionsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<
    "active" | "inactive" | "analytics"
  >("active");
  const [searchQuery, setSearchQuery] = useState("");

  // 1️⃣ Fetch promotions
  const { data: promotions = [], isLoading } = useQuery<Promotion[]>({
    queryKey: ["promotions"],
    queryFn: async () => {
      const res = await fetch(
        "https://api.alnubras.co/api/v1/promotions?limit=1000",
        {
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to fetch promotions");
      return res.json();
    },
  });

  // 2️⃣ Delete mutation
  const deletePromotion = useMutation({
    mutationFn: (id: number) =>
      fetch(`https://api.alnubras.co/api/v1/promotions/${id}`, {
        method: "DELETE",
        credentials: "include",
      }),
    onSuccess: () => {
      toast.success("Promotion deleted");
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
    onError: () => toast.error("Failed to delete"),
  });

  // 3️⃣ Filter & partition
  const filtered = promotions.filter(
    (promo) =>
      promo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const active = filtered.filter((p) => p.enabled);
  const inactive = filtered.filter((p) => !p.enabled);

  // 4️⃣ Analytics (computed client-side)
  const totalRevenue = promotions.reduce(
    (sum, p) => sum + (p as any).revenue || 0,
    0
  );
  const totalUsage = promotions.reduce(
    (sum, p) => sum + (p as any).usageCount || 0,
    0
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Promotions & Discounts
        </h1>
        <Button onClick={() => router.push("/promotions/add")}>
          <Plus className="mr-2 h-4 w-4" /> Add Promotion
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center mb-4">
        <Input
          placeholder="Search promotions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "active" | "inactive" | "analytics")
        }
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="active">Active Promotions</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Promotions</TabsTrigger>
        </TabsList>

        {/* Active Tab */}
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Promotions</CardTitle>
              <CardDescription>Currently active promotions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Min. Purchase</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i} className="animate-pulse">
                        {Array.from({ length: 6 }).map((_, j) => (
                          <TableCell key={j} className="h-6 bg-gray-200/50" />
                        ))}
                      </TableRow>
                    ))
                  ) : active.length > 0 ? (
                    active.map((promo) => (
                      <TableRow key={promo.id}>
                        <TableCell className="font-medium">
                          {promo.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{promo.code}</Badge>
                        </TableCell>
                        <TableCell>
                          {promo.type === "percentage"
                            ? `${promo.value}%`
                            : `AED ${promo.value}`}
                        </TableCell>
                        <TableCell>
                          {promo.minPurchaseAmt > 0
                            ? `AED ${promo.minPurchaseAmt}`
                            : "None"}
                        </TableCell>
                        <TableCell>
                          {format(new Date(promo.endDate), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Link href={`/promotions/${promo.id}/edit`}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Link>
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Promotion</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete “
                                    {promo.name}”? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() =>
                                      deletePromotion.mutate(promo.id)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-6 text-muted-foreground"
                      >
                        No active promotions
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inactive Tab (same pattern) */}
        <TabsContent value="inactive">
          <Card>
            <CardHeader>
              <CardTitle>Active Promotions</CardTitle>
              <CardDescription>Currently active promotions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Min. Purchase</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i} className="animate-pulse">
                        {Array.from({ length: 6 }).map((_, j) => (
                          <TableCell key={j} className="h-6 bg-gray-200/50" />
                        ))}
                      </TableRow>
                    ))
                  ) : inactive.length > 0 ? (
                    inactive.map((promo) => (
                      <TableRow key={promo.id}>
                        <TableCell className="font-medium">
                          {promo.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{promo.code}</Badge>
                        </TableCell>
                        <TableCell>
                          {promo.type === "percentage"
                            ? `${promo.value}%`
                            : `AED ${promo.value}`}
                        </TableCell>
                        <TableCell>
                          {promo.minPurchaseAmt > 0
                            ? `AED ${promo.minPurchaseAmt}`
                            : "None"}
                        </TableCell>
                        <TableCell>
                          {format(new Date(promo.endDate), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Link href={`/promotions/${promo.id}/edit`}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Link>
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Delete Promotion</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete “
                                    {promo.name}”? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() =>
                                      deletePromotion.mutate(promo.id)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-6 text-muted-foreground"
                      >
                        No active promotions
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
