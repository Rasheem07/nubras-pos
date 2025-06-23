"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarIcon, Edit, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

export default function QuotationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const { data: quotation, isLoading } = useQuery({
    queryKey: ["quotation", id],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5005/api/v1/quotations/${id}`, { credentials: "include" }
      );
      const json = await response.json();
      if (!response.ok) {
        toast.error("Failed to load sales quotation #" + id);
      }
      return json;
    },
  });

  if (isLoading || !quotation) {
    return (
      <div className="text-center py-10 text-muted-foreground">Loading...</div>
    );
  }

  // Destructure with defaults
  const {
    number,
    validUntil,
    status = "draft",
    customer,
    items,
    subtotal,
    discountAmount,
    taxAmount,
    totalAmount,
    notes,
    terms,
    createdAt,
    updatedAt,
  } = quotation;

  // Parse expiry date
  let expiryDate: Date | undefined;
  if (validUntil) {
    const iso =
      typeof validUntil === "string"
        ? validUntil.includes("T")
          ? validUntil
          : validUntil.replace(" ", "T")
        : new Date(validUntil).toISOString();
    expiryDate = parseISO(iso);
  }
  const expiresText =
    expiryDate && !isNaN(expiryDate.getTime())
      ? format(expiryDate, "PPP")
      : "—";

  // Parse creation & updation
  const createdText = createdAt
    ? format(parseISO(createdAt), "PPP p")
    : "—";
  const updatedText = updatedAt
    ? format(parseISO(updatedAt), "PPP p")
    : "—";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/quotations">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1 text-center space-y-1">
          <h1 className="text-2xl font-semibold">Quotation {number}</h1>
          <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>Expires: {expiresText}</span>
            <Separator orientation="vertical" className="h-4" />
            <span>Created: {createdText}</span>
            <Separator orientation="vertical" className="h-4" />
            <span>Updated: {updatedText}</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/quotations/${id}/edit`)}
        >
          <Edit className="h-5 w-5 mr-1" /> Edit
        </Button>
      </div>

      {/* Customer & Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-medium">{customer.name}</p>
                <p className="text-sm text-muted-foreground">{customer.email}</p>
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
              </div>
            </div>
            <Badge variant="secondary">{(status ?? "").toUpperCase()}</Badge>
          </div>
        </CardHeader>

        {/* Items Table */}
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell className="text-center">{item.qty}</TableCell>
                  <TableCell className="text-right">
                    AED {parseFloat(item.price).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    AED {parseFloat(item.total).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>AED {parseFloat(subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount</span>
                <span>- AED {parseFloat(discountAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>AED {parseFloat(taxAmount).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>AED {parseFloat(totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          {notes && (
            <div>
              <p className="text-sm font-medium">Notes</p>
              <p className="text-sm text-muted-foreground">{notes}</p>
            </div>
          )}
          {terms && (
            <div>
              <p className="text-sm font-medium">Terms & Conditions</p>
              <p className="text-sm text-muted-foreground">{terms}</p>
            </div>
          )}
        </CardContent>

        {/* Actions */}
        <CardFooter className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => router.push(`/quotations/${id}/download`)}
          >
            Download PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}