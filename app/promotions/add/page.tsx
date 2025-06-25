"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
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

export default function AddPromotionPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
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

  interface PromotionRequest {
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
  }

  interface PromotionResponse {
    id: string;
    name: string;
    code: string;
    type: "percentage" | "fixed-amount";
    value: number;
    startDate: string;
    endDate: string;
    minPurchaseAmt: number;
    maxPurchaseAmt: number;
    description: string;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
    // Add other fields as needed
  }

  interface ApiError {
    message: string;
    [key: string]: any;
  }

  const createPromotion = useMutation<
    PromotionResponse,
    Error,
    PromotionRequest
  >({
    mutationFn: async (data: PromotionRequest): Promise<PromotionResponse> => {
      const resp: Response = await fetch(
        "https://api.alnubras.co/api/v1/promotions",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            code: data.code,
            type: data.type,
            value: data.value,
            startDate: data.startDate.toISOString(),
            endDate: data.endDate.toISOString(),
            minPurchaseAmt: data.minPurchaseAmt,
            maxPurchaseAmt: data.maxPurchaseAmt,
            description: data.description,
            enabled: data.enabled,
          }),
        }
      );
      if (!resp.ok) {
        const err: ApiError | null = await resp.json().catch(() => null);
        throw new Error(err?.message || "Failed to create promotion");
      }
      return resp.json() as Promise<PromotionResponse>;
    },
    onSuccess: () => {
      toast.success("Promotion created");
      qc.invalidateQueries({ queryKey: ["promotions"] });
      router.push("/promotions");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const onSubmit = (data: FormValues) => {
    createPromotion.mutate(data);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Create New Promotion</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promotion Details</CardTitle>
          <CardDescription>
            Create a new promotion or discount code for your customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6">
              {/* Name + Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Promotion Name</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    placeholder="Summer Sale"
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
                      required: "Code is required",
                      setValueAs: (v) => v.toUpperCase(),
                    })}
                    placeholder="SUMMER25"
                  />
                  {errors.code && (
                    <p className="text-xs text-red-500">
                      {errors.code.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Type + Value */}
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
                        required: "Value is required",
                        valueAsNumber: true,
                        min: { value: 1, message: "Must be at least 1" },
                      })}
                      placeholder={
                        watch("type") === "percentage" ? "25" : "100"
                      }
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
                {["startDate", "endDate"].map((field) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>
                      {field === "startDate" ? "Start Date" : "End Date"}
                    </Label>
                    <Controller
                      control={control}
                      name={field as "startDate" | "endDate"}
                      rules={{ required: "Date is required" }}
                      render={({ field: f }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id={field}
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !f.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {f.value ? (
                                format(f.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={f.value}
                              onSelect={f.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors[field as keyof FormValues] && (
                      <p className="text-xs text-red-500">
                        {errors[field as keyof FormValues]?.message as string}
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
                      min: { value: 0, message: "Must be ≥ 0" },
                    })}
                    placeholder="200"
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
                      min: { value: 0, message: "Must be ≥ 0" },
                    })}
                    placeholder="500"
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
                  placeholder="Promotion details and conditions"
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

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Create Promotion"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
