"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type FormValues = {
  name: string;
  code: string;
  type: "percentage" | "fixed-amount";
  value: number;
  startDate: Date;
  endDate: Date;
  minPurchaseAmt: number;
  maxPurchaseAmt: number;
  description: string;
  enabled: boolean;
};

export default function EditPromotionPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const promoId = Number(id);
  const qc = useQueryClient();

  // fetch existing promotion
  const { data: promo, isLoading: loadingPromo } = useQuery<FormValues>({
    queryKey: ["promotion", promoId],
    queryFn: async () => {
      const res = await fetch(`https://api.alnubras.co/api/v1/promotions/${promoId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load promotion");
      const data = await res.json();
      return {
        name: data.name,
        code: data.code,
        type: data.type,
        value: data.value,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        minPurchaseAmt: data.minPurchaseAmt,
        maxPurchaseAmt: data.maxPurchaseAmt,
        description: data.description || "",
        enabled: data.enabled,
      };
    },
  });

  // form setup
  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      code: "",
      type: "percentage",
      value: undefined,
      startDate: undefined,
      endDate: undefined,
      minPurchaseAmt: 0,
      maxPurchaseAmt: 0,
      description: "",
      enabled: true,
    },
  });

  // populate form when data arrives
  useEffect(() => {
    if (promo) reset(promo);
  }, [promo, reset]);

  // update mutation
  const updatePromo = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await fetch(`https://api.alnubras.co/api/v1/promotions/${promoId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          startDate: data.startDate.toISOString(),
          endDate: data.endDate.toISOString(),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Update failed");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Promotion updated");
      qc.invalidateQueries({ queryKey: ["promotions"] });
      qc.invalidateQueries({ queryKey: ["promotion", promoId] });
      router.push("/promotions");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const onSubmit = (data: FormValues) => {
    updatePromo.mutate(data);
  };

  if (loadingPromo) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <Card>
          <CardContent>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded mb-4" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Edit Promotion</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promotion Details</CardTitle>
          <CardDescription>
            Update your promotion settings below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6">
              {/* Name & Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Promotion Name</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Name required" })}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Promo Code</Label>
                  <Input
                    id="code"
                    {...register("code", {
                      required: "Code required",
                      setValueAs: (v) => v.toUpperCase(),
                    })}
                  />
                  {errors.code && (
                    <p className="text-xs text-red-500">
                      {errors.code.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Type & Value */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Discount Type</Label>
                  <Controller
                    control={control}
                    name="type"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">
                            Percentage (%)
                          </SelectItem>
                          <SelectItem value="fixed-amount">
                            Fixed Amount
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">
                    {watch("type") === "percentage"
                      ? "Discount Percentage"
                      : "Discount Amount"}
                  </Label>
                  <div className="relative">
                    <Input
                      id="value"
                      type="number"
                      {...register("value", {
                        required: "Value required",
                        valueAsNumber: true,
                        min: { value: 1, message: "Min 1" },
                      })}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-muted-foreground">
                      {watch("type") === "percentage" ? "%" : "AED"}
                    </div>
                  </div>
                  {errors.value && (
                    <p className="text-xs text-red-500">
                      {errors.value.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(["startDate", "endDate"] as const).map((fld) => (
                  <div key={fld} className="space-y-2">
                    <Label htmlFor={fld}>
                      {fld === "startDate" ? "Start Date" : "End Date"}
                    </Label>
                    <Controller
                      control={control}
                      name={fld}
                      rules={{ required: "Date required" }}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors[fld] && (
                      <p className="text-xs text-red-500">
                        {errors[fld]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Min/Max */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minPurchaseAmt">Minimum Purchase (AED)</Label>
                  <Input
                    id="minPurchaseAmt"
                    type="number"
                    {...register("minPurchaseAmt", {
                      valueAsNumber: true,
                      min: { value: 0, message: "≥ 0" },
                    })}
                  />
                  {errors.minPurchaseAmt && (
                    <p className="text-xs text-red-500">
                      {errors.minPurchaseAmt.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPurchaseAmt">Maximum Discount (AED)</Label>
                  <Input
                    id="maxPurchaseAmt"
                    type="number"
                    {...register("maxPurchaseAmt", {
                      valueAsNumber: true,
                      min: { value: 0, message: "≥ 0" },
                    })}
                  />
                  {errors.maxPurchaseAmt && (
                    <p className="text-xs text-red-500">
                      {errors.maxPurchaseAmt.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={4}
                />
              </div>

              {/* Enabled */}
              <div className="flex items-center space-x-2">
                <Controller
                  control={control}
                  name="enabled"
                  render={({ field }) => (
                    <Switch
                      id="enabled"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="enabled">Active</Label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={updatePromo.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updatePromo.isPending}>
                {updatePromo.isPending ? "Updating…" : "Update Promotion"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
