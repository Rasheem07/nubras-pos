"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Save,
  Send,
  Plus,
  Trash2,
  Search,
  User,
  Package,
  CalendarIcon,
  Calculator,
  FileText,
  Copy,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { listAllProducts } from "@/services/listProducts";
import { listAllCustomers } from "@/services/listCustomers";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { queryClient } from "@/components/providers";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  sku: string;
  image: string;
}

interface QuotationItem {
  id: number; // For updates, this will be the database ID
  tempId?: string; // For new items added during update
  catalogId?: number;
  description: string;
  sku: string;
  qty: number;
  price: string;
  total: string;
  notes?: string;
  isNew?: boolean; // Flag to identify new items
  customizations?: {
    measurements?: Record<string, string>;
    fabric?: string;
    color?: string;
    embroidery?: string;
    rushOrder?: boolean;
  };
}

interface ExistingQuotation {
  id: number;
  quotationNumber: string;
  validUntil: string;
  customerId: number;
  customerName: string;
  notes?: string;
  terms?: string;
  subtotal: string;
  discountAmount: string;
  taxAmount: string;
  totalAmount: string;
  status: string;
  items: QuotationItem[];
  customer: Customer;
}

// DTO interfaces matching backend
interface UpdateQuoteItemDto {
  id: number;
  description?: string;
  catalogId?: number;
  sku?: string;
  qty?: number;
  price?: string;
  total?: string;
}

interface CreateQuoteItemDto {
  description: string;
  catalogId: number;
  sku: string;
  qty: number;
  price: string;
  total: string;
}

interface UpdateQuotationDto {
  validUntil?: Date;
  customerId?: number;
  customerName?: string;
  notes?: string;
  terms?: string;
  subtotal?: string;
  discountAmount?: string;
  taxAmount?: string;
  totalAmount?: string;
  items?: (UpdateQuoteItemDto | CreateQuoteItemDto)[];
}

export default function UpdateQuotationPage() {
  const params = useParams();
  const quotationId = params.id;
  // Fetch existing quotation data
  const {
    data: quotation,
    isLoading: quotationLoading,
    refetch,
  } = useQuery<ExistingQuotation>({
    queryKey: ["quotation", quotationId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/quotations/${quotationId}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch quotation");
      }
      return response.json();
    },
  });

  const { data: customers = [], isLoading: customerLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      try {
        return await listAllCustomers();
      } catch (err: any) {
        toast.error(err.message);
        return [];
      }
    },
  });

  const { data: products = [], isLoading: productLoading } = useQuery<
    Product[]
  >({
    queryKey: ["productsCatalog"],
    queryFn: async () => {
      try {
        return await listAllProducts();
      } catch (err: any) {
        toast.error(err.message);
        return [];
      }
    },
  });

  //router
  const router = useRouter();

  // Form state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [quotationNumber, setQuotationNumber] = useState(0);
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");
  const [validUntil, setValidUntil] = useState<Date>();
  const [taxRate, setTaxRate] = useState(5);
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [globalDiscountType, setGlobalDiscountType] = useState<
    "amount" | "percentage"
  >("percentage");

  // Dialog states
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showCustomizationDialog, setShowCustomizationDialog] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );

  // Search states
  const [customerSearch, setCustomerSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Counter for new items
  const [newItemCounter, setNewItemCounter] = useState(0);

  // Load quotation data into form when available
  useEffect(() => {
    if (quotation) {
      setQuotationNumber(quotation.id);
      setSelectedCustomer(quotation.customer);
      setValidUntil(new Date(quotation.validUntil));
      setNotes(quotation.notes || "");
      setTerms(quotation.terms || "");

      // Load items
      setItems(
        quotation.items.map((item) => ({
          ...item,
          isNew: false,
        }))
      );

      // Calculate discount and tax from existing data
      const subtotal = Number.parseFloat(quotation.subtotal);
      const discountAmount = Number.parseFloat(quotation.discountAmount);
      const taxAmount = Number.parseFloat(quotation.taxAmount);

      setGlobalDiscount(discountAmount);
      setGlobalDiscountType("amount");

      // Calculate tax rate from tax amount
      const afterDiscount = subtotal - discountAmount;
      if (afterDiscount > 0) {
        setTaxRate((taxAmount / afterDiscount) * 100);
      }
    }
  }, [quotation]);

  // Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + Number.parseFloat(item.total || "0"),
    0
  );
  const discountAmount =
    globalDiscountType === "percentage"
      ? (subtotal * globalDiscount) / 100
      : globalDiscount;
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = (afterDiscount * taxRate) / 100;
  const total = afterDiscount + taxAmount;

  const addItem = (product?: Product) => {
    const rawPrice = product?.price ?? 0;
    const unitPrice =
      typeof rawPrice === "string" ? Number.parseFloat(rawPrice) : rawPrice;
    const quantity = 1;
    const itemTotal = (unitPrice * quantity).toFixed(2);

    const newItem: QuotationItem = {
      id: 0, // Will be handled as new item
      tempId: `new_item_${Date.now()}_${newItemCounter}`,
      catalogId: product?.id,
      description: product?.name || "",
      sku: product?.sku || "",
      qty: quantity,
      price: unitPrice.toFixed(2),
      total: itemTotal,
      notes: "",
      isNew: true,
    };

    setItems([...items, newItem]);
    setNewItemCounter((prev) => prev + 1);
    setShowProductDialog(false);
  };

  const updateItem = (index: number, updates: Partial<QuotationItem>) => {
    const updated = [...items];
    const it = { ...updated[index], ...updates };

    // recalc when qty or unit_price changes
    if (updates.qty !== undefined || updates.price !== undefined) {
      const qty = updates.qty !== undefined ? updates.qty : it.qty;
      const price =
        updates.price !== undefined
          ? parseFloat(updates.price)
          : parseFloat(it.price);
      it.price = price.toFixed(2);
      it.total = (qty * price).toFixed(2);
    }

    updated[index] = it;
    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateQuotation = async (status?: "draft" | "sent") => {
    if (!selectedCustomer) {
      toast.error("Please select a customer");
      return;
    }

    if (items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    if (!validUntil) {
      toast.error("Please set a validity date");
      return;
    }

    setIsSubmitting(true);

    try {
      // Transform items to match DTO structure
      const quotationItems = items.map(
        (item): UpdateQuoteItemDto | CreateQuoteItemDto => {
          // New item - use CreateQuoteItemDto structure
          return {
            description: item.description,
            catalogId: item.catalogId || 0,
            sku: item.sku,
            qty: item.qty,
            price: String(item.price),
            total: String(item.total),
          };
        }
      );

      // Create DTO matching backend expectations
      const updateQuotationDto: UpdateQuotationDto = {
        validUntil: new Date(validUntil),
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        notes: notes || undefined,
        terms: terms || undefined,
        subtotal: subtotal.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        discountAmount: discountAmount.toFixed(2),
        totalAmount: total.toFixed(2),
        items: quotationItems,
      };

      console.log("Updating quotation:", updateQuotationDto);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/quotations/${quotationId}`,
        {
          method: "PATCH",
           credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateQuotationDto),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message);
      }

      toast.success(`Quotation ${quotationNumber} updated successfully`);

      router.push(`/quotations/${quotationId}`);

      queryClient.invalidateQueries({
        queryKey: ["quotation", quotationId, "quotations"],
      });
      // Refetch the quotation data to get updated information
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to update quotation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer: Customer) =>
      customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.phone.includes(customerSearch)
  );

  const filteredProducts = products.filter((product: Product) => {
    const name = (product.name || "").toLowerCase();
    const sku = (product.sku || "").toLowerCase();
    const search = productSearch.toLowerCase();
    return name.includes(search) || sku.includes(search);
  });

  if (quotationLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading quotation...</p>
        </div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <p className="text-muted-foreground">Quotation not found</p>
          <Button asChild className="mt-4">
            <Link href="/quotations">Back to Quotations</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/quotations">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Update Quotation #{quotationNumber}
            </h1>
            <p className="text-muted-foreground">
              Modify the quotation details and items
            </p>
          </div>
          <Badge
            variant={quotation.status === "sent" ? "default" : "secondary"}
          >
            {quotation.status}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={quotationLoading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => updateQuotation("draft")}
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            onClick={() => updateQuotation("sent")}
            disabled={isSubmitting}
          >
            <Send className="mr-2 h-4 w-4" />
            Update & Send
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quotation Details */}
          <Card>
            <CardHeader>
              <CardTitle>Quotation Details</CardTitle>
              <CardDescription>
                Basic information about this quotation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quotation-number">Quotation Number</Label>
                  <Input
                    id="quotation-number"
                    value={quotationNumber}
                    readOnly
                    className="read-only:opacity-75 read-only:bg-gray-50/90"
                    placeholder="QUO-2024-001"
                  />
                </div>
                <div>
                  <Label>Valid Until</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !validUntil && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {validUntil ? format(validUntil, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={validUntil}
                        onSelect={setValidUntil}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Customer Information
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomerDialog(true)}
                >
                  <User className="mr-2 h-4 w-4" />
                  Change Customer
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCustomer ? (
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={"/placeholder.svg"}
                      alt={selectedCustomer.name}
                    />
                    <AvatarFallback>
                      {selectedCustomer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{selectedCustomer.name}</h3>
                      <Badge variant="outline">{selectedCustomer.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedCustomer.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedCustomer.phone}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No customer selected</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Quotation Items
                <Button onClick={() => setShowProductDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {items.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={item.tempId || item.id}>
                        <TableCell>
                          <div>
                            <Input
                              value={item.description}
                              onChange={(e) =>
                                updateItem(index, {
                                  description: e.target.value,
                                })
                              }
                              className="font-medium mb-1"
                              placeholder="Item description"
                            />
                            <div className="flex items-center gap-2 mt-2">
                              {item.catalogId && (
                                <Badge variant="outline" className="text-xs">
                                  ID: {item.catalogId}
                                </Badge>
                              )}
                              {item.isNew && (
                                <Badge variant="secondary" className="text-xs">
                                  New
                                </Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedItemIndex(index);
                                  setShowCustomizationDialog(true);
                                }}
                              >
                                <Settings className="h-3 w-3 mr-1" />
                                Customize
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.sku}
                            onChange={(e) =>
                              updateItem(index, { sku: e.target.value })
                            }
                            placeholder="SKU"
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            value={item.qty}
                            onChange={(e) =>
                              updateItem(index, { qty: Number(e.target.value) })
                            }
                            className="w-16 text-center"
                            min="1"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            value={item.price}
                            onChange={(e) =>
                              updateItem(index, { price: e.target.value })
                            }
                            className="w-24 text-right"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          AED {Number.parseFloat(item.total).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No items added</p>
                  <p className="text-sm">
                    Click "Add Item" to start building your quotation
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes and Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Internal notes (not visible to customer)"
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  placeholder="Terms and conditions for this quotation"
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          {/* Pricing Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Pricing Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>AED {subtotal.toFixed(2)}</span>
                </div>

                {/* Global Discount */}
                <div className="space-y-2">
                  <Label className="text-sm">Global Discount</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={globalDiscount}
                      onChange={(e) =>
                        setGlobalDiscount(Number(e.target.value))
                      }
                      className="flex-1"
                      step="0.01"
                    />
                    <Select
                      value={globalDiscountType}
                      onValueChange={(value) =>
                        setGlobalDiscountType(value as "amount" | "percentage")
                      }
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amount">AED</SelectItem>
                        <SelectItem value="percentage">%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-red-600">
                      <span>Discount:</span>
                      <span>-AED {discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-sm">
                  <span>After Discount:</span>
                  <span>AED {afterDiscount.toFixed(2)}</span>
                </div>

                {/* Tax Rate */}
                <div className="space-y-2">
                  <Label className="text-sm">Tax Rate (%)</Label>
                  <Input
                    type="number"
                    value={taxRate.toFixed(2)}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    step="0.1"
                    min="0"
                    max="100"
                  />
                  <div className="flex justify-between text-sm">
                    <span>Tax ({taxRate.toFixed(1)}%):</span>
                    <span>AED {taxAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total:</span>
                  <span>AED {total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Copy className="mr-2 h-4 w-4" />
                Duplicate Quotation
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calculator className="mr-2 h-4 w-4" />
                Price Calculator
              </Button>
            </CardContent>
          </Card>

          {/* Validation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Validation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                {selectedCustomer ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span>Customer selected</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {items.length > 0 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span>Items added ({items.length})</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {validUntil ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span>Validity date set</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {total > 0 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span>Total amount calculated</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Customer Selection Dialog */}
      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Change Customer</DialogTitle>
            <DialogDescription>
              Select a different customer for this quotation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {filteredCustomers.map((customer: Customer) => (
                <div
                  key={customer.id}
                  className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setShowCustomerDialog(false);
                  }}
                >
                  <Avatar>
                    <AvatarImage src={"/placeholder.svg"} alt={customer.name} />
                    <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{customer.name}</h3>
                      <Badge variant="outline">{customer.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {customer.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {customer.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCustomerDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Selection Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add Product/Service</DialogTitle>
            <DialogDescription>
              Select a product or service to add to the quotation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2 max-h-[400px] overflow-y-auto">
              {filteredProducts.map((product) => (
                <button
                  type="button"
                  key={product.id}
                  className="w-full flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 text-left"
                  onClick={() => addItem(product)}
                >
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    {product.image ? (
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{product.name}</h3>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      SKU: {product.sku}
                    </p>
                    <p className="text-sm font-medium">AED {product.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowProductDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => addItem()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Custom Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Customization Dialog */}
      <Dialog
        open={showCustomizationDialog}
        onOpenChange={setShowCustomizationDialog}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Item Customization</DialogTitle>
            <DialogDescription>
              {selectedItemIndex !== null &&
                items[selectedItemIndex]?.description}
            </DialogDescription>
          </DialogHeader>
          {selectedItemIndex !== null && (
            <div className="space-y-4">
              <div>
                <Label>Special Instructions</Label>
                <Textarea
                  value={items[selectedItemIndex]?.notes || ""}
                  onChange={(e) =>
                    updateItem(selectedItemIndex, { notes: e.target.value })
                  }
                  placeholder="Special instructions for this item..."
                />
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Fabric Choice</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fabric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cotton">Premium Cotton</SelectItem>
                      <SelectItem value="silk">Pure Silk</SelectItem>
                      <SelectItem value="linen">Linen Blend</SelectItem>
                      <SelectItem value="wool">Wool</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Color</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="white">White</SelectItem>
                      <SelectItem value="black">Black</SelectItem>
                      <SelectItem value="navy">Navy Blue</SelectItem>
                      <SelectItem value="gray">Gray</SelectItem>
                      <SelectItem value="beige">Beige</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="rush-order" />
                  <Label htmlFor="rush-order">Rush Order (+25%)</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCustomizationDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowCustomizationDialog(false)}>
              Save Customization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
