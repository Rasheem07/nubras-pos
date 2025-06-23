"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  FileText,
  Trash2,
  Send,
  Download,
  Printer,
  Copy,
  CheckCircle,
  Clock,
  MoreHorizontal,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  X,
  ExternalLink,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/components/providers";
import { DialogTrigger } from "@radix-ui/react-dialog";

const termOptions = [
  { label: "Due on Receipt", days: 0 },
  { label: "Net 15", days: 15 },
  { label: "Net 30", days: 30 },
  { label: "Net 60", days: 60 },
];

const deliveryOptions = [
  { label: "Tomorrow", days: 1 },
  { label: "+7 Days", days: 7 },
  { label: "Custom", days: null },
];

const priorityOptions = ["low", "medium", "high"] as const;

type QuotationStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "expired"
  | "converted";

interface Quotation {
  id: number;
  validUntil: Date;
  customerId: number;
  customerName: string;
  customerPhone: string;
  notes: string;
  terms: string;
  itemCount: number;
  totalAmount: string;
  status: QuotationStatus;
  createdAt: Date;
  convertedToSale?: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  items: Array<{
    name: string;
    description: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
}

type convertPayloadType = {
  dueDate: string; // YYYY-MM-DD
  deliveryDate?: string; // YYYY-MM-DD
  paymentTerms: string; // e.g. "Net 30"
  priority: "low" | "medium" | "high";
  notes: string;
  partialAmount: string; // e.g. "0.00"
  paymentMethod: "cash" | "visa" | "bank_transfer";
};

export default function QuotationsPage() {
  const [convertTarget, setConvertTarget] = useState<Quotation | null>(null);
  const [convertPayload, setConvertPayload] = useState<convertPayloadType>({
    dueDate: "", // YYYY-MM-DD
    deliveryDate: undefined,
    paymentTerms: termOptions[2].label,
    priority: "medium" as "low" | "medium" | "high",
    notes: "",
    partialAmount: "0.00",
    paymentMethod: "cash" as "cash" | "visa" | "bank_transfer",
  });

  useEffect(() => {
    const term = termOptions.find(
      (t) => t.label === convertPayload.paymentTerms
    );
    if (term) {
      const d = new Date();
      d.setDate(d.getDate() + term.days);
      setConvertPayload((p) => ({
        ...p,
        dueDate: d.toISOString().slice(0, 10),
      }));
    }
  }, [convertPayload.paymentTerms]);

  const { data: quotations = [], isLoading } = useQuery<Quotation[]>({
    queryKey: ["quotations"],
    queryFn: async () => {
      const response = await fetch("http://localhost:5005/api/v1/quotations", {
        credentials: "include",
      });
      const json = await response.json();
      if (!response.ok) {
        toast.error("Failed to load sales quotations!");
      }
      return json;
    },
  });

  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const statusColors = {
    draft: "bg-gray-100 text-gray-800 hover:bg-gray-100/90",
    sent: "bg-blue-100 text-blue-800 hover:bg-blue-100/90",
    accepted: "bg-green-100 text-green-800 hover:bg-green-100/90",
    rejected: "bg-red-100 text-red-800 hover:bg-red-100/90",
    expired: "bg-orange-100 text-orange-800 hover:bg-orange-100/90",
    converted: "bg-purple-100 text-purple-800 hover:bg-purple-100/90",
  };

  const filteredQuotations =
    quotations.length > 0
      ? quotations.filter((quotation) => {
          const matchesSearch =
            quotation.customerName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            quotation.customerPhone
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            String(quotation.id)
              .toLowerCase()
              .includes(searchQuery.toLowerCase());

          const matchesStatus =
            statusFilter === "all" || quotation.status === statusFilter;

          return matchesSearch && matchesStatus;
        })
      : [];

  const sendQuotation = async (quotation: Quotation) => {
    const response = await fetch(
      `http://localhost:5005/api/v1/quotations/send/${quotation.id}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = await response.json();
    if (!response.ok) {
      toast.error(json.message ?? "Failed to send quotation!");
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["quotations"] });

    toast.success(
      `Quotation ${quotation.id} sent to ${quotation.customerPhone}`
    );
  };

  const deleteQuotation = async (id: number) => {
    if (confirm("Are you sure you want to delete this quotation?")) {
      const response = await fetch(
        `http://localhost:5005/api/v1/quotations/${id}`,
        {
          credentials: "include",
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const json = await response.json();
      if (!response.ok) {
        toast.error(json.message ?? "Failed to delete quotation!");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      toast.success(json.message ?? "deleted successfully!");
    }
  };

  const exportQuotation = (quotation: Quotation) => {
    // In a real app, this would generate a PDF
    toast.success(`Exporting quotation ${quotation.id} as PDF`);
  };

  const printQuotation = (quotation: Quotation) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Quotation ${quotation.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .company { font-size: 24px; font-weight: bold; }
            .quotation-info { text-align: right; }
            .customer-info { background: #f5f5f5; padding: 20px; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f5f5f5; }
            .totals { text-align: right; margin-top: 20px; }
            .terms { margin-top: 30px; padding: 20px; background: #f9f9f9; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="company">Nubras Tailoring</div>
              <div>123 Al Wasl Road, Dubai, UAE</div>
              <div>+971 50 123 4567</div>
              <div>info@nubras.com</div>
            </div>
            <div class="quotation-info">
              <h2>QUOTATION</h2>
              <div><strong>Number:</strong> ${quotation.id}</div>
              <div><strong>Date:</strong> ${quotation.createdAt.toLocaleDateString()}</div>
              <div><strong>Valid Until:</strong> ${quotation.validUntil.toLocaleDateString()}</div>
            </div>
          </div>

          <div class="customer-info">
            <h3>Quote For:</h3>
            <div><strong>${quotation.customer.name}</strong></div>
            <div>${quotation.customer.email}</div>
            <div>${quotation.customer.phone}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Discount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${quotation.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>AED ${item.price.toFixed(2)}</td>
                  <td>AED ${item.total.toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="totals">
            <div>Subtotal: AED ${quotation.subtotal.toFixed(2)}</div>
            <div>Discount: AED ${quotation.discount.toFixed(2)}</div>
            <div>Tax (5%): AED ${quotation.tax.toFixed(2)}</div>
            <div style="font-size: 18px; font-weight: bold; margin-top: 10px;">
              Total: AED ${quotation.total.toFixed(2)}
            </div>
          </div>

          <div class="terms">
            <h3>Terms & Conditions</h3>
            <p>${quotation.terms}</p>
            ${
              quotation.notes
                ? `<p><strong>Notes:</strong> ${quotation.notes}</p>`
                : ""
            }
          </div>

          <div style="text-align: center; margin-top: 40px; color: #666;">
            <p>Thank you for considering Nubras Tailoring for your needs.</p>
            <p>This quotation is valid until ${quotation.validUntil.toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const updateQuotationStatus = async (
    id: number,
    newStatus: "accepted" | "rejected"
  ) => {
    const response = await fetch(
      `http://localhost:5005/api/v1/quotations/${
        newStatus === "accepted" ? "accept" : "reject"
      }/${id}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = await response.json();
    if (!response.ok) {
      toast.error(json.message ?? `Failed to ${newStatus} quotation!`);
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["quotations"] });
    toast.success(`Quotation ${id} ${newStatus}`);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Sales Quotations
          </h1>
          <p className="text-muted-foreground">
            Create, manage, and track customer quotations
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex relative group">
            <Button variant="outline" asChild>
              <Link href="/quotations/templates">
                <FileText className="mr-2 h-4 w-4" />
                Templates
              </Link>
            </Button>

            {/* Tooltip on hover */}
            <div className="absolute -bottom-8 left-1/2  -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Under development
            </div>
          </div>
          <Button asChild>
            <Link href="/quotations/new">
              <Plus className="mr-2 h-4 w-4" />
              New Quotation
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Quotations
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotations.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Response
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quotations.length > 0
                ? quotations.filter((q) => q.status === "sent").length
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting customer response
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quotations.length > 0
                ? Math.round(
                    (quotations.filter((q) => q.status === "converted").length /
                      quotations.length) *
                      100
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Quotes to sales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              AED{" "}
              {quotations.length > 0
                ? quotations
                    .reduce((sum, q) => sum + Number(q.totalAmount), 0)
                    .toLocaleString()
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">All quotations</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quotations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quotations</CardTitle>
          <CardDescription>
            Manage and track all customer quotations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quotation</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotations.map((quotation: Quotation) => (
                <TableRow key={quotation.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{quotation.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {String(quotation.itemCount)} item
                        {Number(quotation.itemCount) !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={"/placeholder.svg"}
                          alt={quotation.customerName}
                        />
                        <AvatarFallback>
                          {quotation.customerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {quotation.customerName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {quotation.customerPhone}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      AED {quotation.totalAmount.toLocaleString()}
                    </div>
                    {quotation.convertedToSale && (
                      <div className="text-sm text-muted-foreground">
                        → {quotation.convertedToSale}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[quotation.status]}>
                        {quotation.status?.toUpperCase()}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(quotation.validUntil).toLocaleDateString()}
                      {quotation.validUntil < new Date() &&
                        quotation.status !== "converted" && (
                          <div className="text-red-500 text-xs">Expired</div>
                        )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(quotation.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Quick Status Actions */}
                      {quotation.status === "draft" && (
                        <Button
                          size="sm"
                          onClick={() => sendQuotation(quotation)}
                          className="h-8"
                        >
                          <Send className="mr-1 h-3 w-3" />
                          Send
                        </Button>
                      )}

                      {quotation.status === "sent" && (
                        <div className="flex gap-1">
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateQuotationStatus(quotation.id, "accepted")
                            }
                            className="h-8 text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateQuotationStatus(quotation.id, "rejected")
                            }
                            className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <X className="mr-1 h-3 w-3" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {quotation.status === "accepted" &&
                        !quotation.convertedToSale && (
                          <Dialog
                            open={!!convertTarget}
                            onOpenChange={(open) =>
                              !open && setConvertTarget(null)
                            }
                          >
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setConvertTarget(quotation);
                                }}
                                className="h-8 bg-purple-600 hover:bg-purple-700"
                              >
                                <ArrowRight className="mr-1 h-3 w-3" />
                                Convert to Sale
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="w-full max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>
                                  Convert Quotation #{convertTarget?.id} to Sale
                                </DialogTitle>
                              </DialogHeader>

                              {/* PAYMENT TERMS → Select */}
                              <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block mb-1">
                                    Payment Terms
                                  </label>
                                  <Select
                                    value={convertPayload.paymentTerms}
                                    onValueChange={(val) =>
                                      setConvertPayload((p) => ({
                                        ...p,
                                        paymentTerms: val,
                                      }))
                                    }
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select terms" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {termOptions.map((opt) => (
                                        <SelectItem
                                          key={opt.label}
                                          value={opt.label}
                                        >
                                          {opt.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* DUE DATE is auto-filled (read-only) */}
                                <div>
                                  <label className="block mb-1">Due Date</label>
                                  <Input
                                    type="date"
                                    value={convertPayload.dueDate}
                                    readOnly
                                  />
                                </div>

                                {/* DELIVERY DATE: allow pick, but show as chip */}
                                <div>
                                  <label className="block mb-1">
                                    Delivery Date
                                  </label>
                                  <Input
                                    type="date"
                                    value={convertPayload.deliveryDate}
                                    onChange={(e) =>
                                      setConvertPayload((p) => ({
                                        ...p,
                                        deliveryDate: e.target.value,
                                      }))
                                    }
                                  />
                                </div>

                                {/* PRIORITY → Select + chip */}
                                <div>
                                  <label className="block mb-1">Priority</label>
                                  <Select
                                    value={convertPayload.priority}
                                    onValueChange={(val) =>
                                      setConvertPayload((p) => ({
                                        ...p,
                                        priority: val as any,
                                      }))
                                    }
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="low">Low</SelectItem>
                                      <SelectItem value="medium">
                                        Medium
                                      </SelectItem>
                                      <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="mb-4">
                                  <p className="font-sans text-sm">
                                    Total Amount to be paid:{" "}
                                    <strong>{quotation.totalAmount}</strong>
                                  </p>
                                  <p className="mb-1 font-medium">
                                    Amount Paid Now
                                  </p>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="w-full p-2 border rounded"
                                    value={convertPayload.partialAmount}
                                    onChange={(e) =>
                                      setConvertPayload((p) => ({
                                        ...p,
                                        partialAmount: e.target.value,
                                      }))
                                    }
                                    placeholder="0.00"
                                  />
                                </div>

                                {/* PAYMENT METHOD */}
                                <div className="mb-4">
                                  <p className="mb-1 font-medium">
                                    Payment Method
                                  </p>
                                  <div className="flex gap-2">
                                    {["cash", "visa", "bank_transfer"].map(
                                      (method) => (
                                        <Badge
                                          key={method}
                                          variant={
                                            convertPayload.paymentMethod ===
                                            method
                                              ? "secondary"
                                              : "outline"
                                          }
                                          onClick={() =>
                                            setConvertPayload((p) => ({
                                              ...p,
                                              paymentMethod: method as
                                                | "cash"
                                                | "visa"
                                                | "bank_transfer",
                                            }))
                                          }
                                          className={`cursor-pointer uppercase py-2 px-4 hover:bg-purple-600 hover:text-white ${
                                            convertPayload.paymentMethod ===
                                            method
                                              ? "bg-purple-600 text-white"
                                              : "bg-white text-purple-600 border border-purple-200"
                                          }`}
                                        >
                                          {method.replace("_", " ")}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </div>
                                {/* NOTES */}
                                <div>
                                  <label className="block mb-1">Notes</label>
                                  <Input
                                    placeholder="Any special instructions?"
                                    value={convertPayload.notes}
                                    onChange={(e) =>
                                      setConvertPayload((p) => ({
                                        ...p,
                                        notes: e.target.value,
                                      }))
                                    }
                                  />
                                </div>
                              </div>

                              <DialogFooter className="mt-4">
                                <Button
                                  onClick={async () => {
                                    if (!convertTarget) return;
                                    const dto = {
                                      quoteId: convertTarget.id,
                                      salesPersonId: 2,
                                      salesPersonName: "Test sales person",
                                      ...convertPayload,
                                    };
                                    const resp = await fetch(
                                      `http://localhost:5005/api/v1/quotations/convert/${convertTarget.id}`,
                                      {
                                        method: "POST",
                                        credentials: "include",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify(dto),
                                      }
                                    );
                                    const j = await resp.json();
                                    if (!resp.ok) {
                                      toast.error(
                                        j.message || "Conversion failed"
                                      );
                                    } else {
                                      setConvertPayload({
                                        dueDate: "",
                                        deliveryDate: undefined,
                                        paymentTerms: termOptions[2].label,
                                        priority: "medium",
                                        notes: "",
                                        partialAmount: "0.00",
                                        paymentMethod: "cash",
                                      });
                                      toast.success(
                                        `Converted to sale #${j.salesOrderId}`
                                      );
                                      queryClient.invalidateQueries({
                                        queryKey: ["quotations"],
                                      });
                                      queryClient.invalidateQueries({
                                        queryKey: ["sales"],
                                      });
                                      setConvertTarget(null);
                                    }
                                  }}
                                >
                                  Confirm & Convert
                                </Button>
                                <Button
                                  variant="ghost"
                                  onClick={() => setConvertTarget(null)}
                                >
                                  Cancel
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}

                      {quotation.status === "converted" &&
                        quotation.convertedToSale && (
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="h-8"
                          >
                            <Link
                              href={`/sales?search=${quotation.customerName}`}
                            >
                              <ExternalLink className="mr-1 h-3 w-3" />
                              View Sale
                            </Link>
                          </Button>
                        )}

                      {/* More Actions Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>More Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/quotations/${quotation.id}`}>
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              const response = await fetch(
                                `http://localhost:5005/api/v1/quotations/send/${quotation.id}`,
                                {
                                  method: "POST",
                                  credentials: "include",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                }
                              );
                              const json = await response.json();
                              if (!response.ok) {
                                toast.error(
                                  json.message ?? "Failed to send quotation!"
                                );
                                return;
                              }
                              queryClient.invalidateQueries({
                                queryKey: ["quotations"],
                              });
                              toast.success(
                                `Quotation ${quotation.id} sent to ${quotation.customerPhone}`
                              );
                            }}
                          >
                            <RefreshCcw className="mr-1 h-3 w-3" />
                            Resend
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => printQuotation(quotation)}
                          >
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => deleteQuotation(quotation.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
