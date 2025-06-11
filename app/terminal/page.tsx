"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  ShoppingBag,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  Smartphone,
  Printer,
  Receipt,
  Save,
  X,
  Calendar,
  Command
} from "lucide-react";
import { toast } from "sonner";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import CustomerSelectDialog from "./_components/customerSelect";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

// Zod schemas matching the exact DTOs
const SalesOrderItemSchema = z.object({
  description: z.string().max(100),
  catelogId: z.number().positive(),
  sku: z.string().max(15).optional(),
  qty: z.number().positive(),
  price: z.string(),
  total: z.string(),
});

const CreateSalesOrderSchema = z.object({
  status: z.enum([
    "draft",
    "pending",
    "confirmed",
    "processing",
    "completed",
    "cancelled",
  ]),
  customerId: z.number().positive(),
  customerName: z.string().max(100),
  salesPersonId: z.number().positive(),
  salesPersonName: z.string().max(100),
  subtotal: z.string(),
  taxAmount: z.string(),
  discountAmount: z.string(),
  totalAmount: z.string(),
  paymentMethod: z.string().max(20),
  notes: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  paymentTerms: z.string(),
  dueDate: z.coerce.date(),
  deliveryDate: z.coerce.date().optional(),
  completedDate: z.coerce.date().optional(),
  items: z.array(SalesOrderItemSchema).min(1),
  partialAmount: z.string().optional(),
});

type CreateSalesOrderDto = z.infer<typeof CreateSalesOrderSchema>;
type SalesOrderItemDto = z.infer<typeof SalesOrderItemSchema>;

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: "new" | "active" | "gold" | "platinum" | "diamond" | "inactive";
}

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    sku?: string;
    image?: string;
    category: string;
  };
  onAdd: () => void;
}

function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/40 group touch-manipulation
                 h-24 md:h-32 lg:min-h-[100px]"
      onClick={onAdd}
    >
      <CardContent className="p-3 md:p-5 lg:p-4 h-full">
        <div className="flex items-center gap-3 h-full">
          {/* Image */}
          <div className="w-16 h-16 md:w-24 md:h-24 lg:w-16 lg:h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
            <img
              src={product.image || "/placeholder.svg?height=64&width=64"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm md:text-base lg:text-sm text-gray-900 dark:text-primary line-clamp-2 mb-1 leading-tight">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    {product.category}
                  </Badge>
                  {product.sku && (
                    <span className="text-xs text-gray-500">{product.sku}</span>
                  )}
                </div>
                <p className="text-sm md:text-base lg:text-base font-bold text-gray-900">
                  AED {product.price}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-8 h-8 md:w-12 md:h-12 lg:w-8 lg:h-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 touch-manipulation"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd();
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Improved Cart Item
interface CartItemCardProps {
  item: SalesOrderItemDto;
  onUpdateQuantity: (qty: number) => void;
  onRemove: () => void;
}

function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  return (
    <div className="p-3 md:p-4 lg:p-3 border border-gray-200 rounded-lg bg-white hover:border-primary/30 hover:shadow-sm transition-all touch-manipulation">
      <div className="flex items-start justify-between mb-2 gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-gray-900 line-clamp-2 leading-tight">
            {item.description}
          </h3>
          {item.sku && (
            <span className="text-xs text-gray-500 mt-1 block">{item.sku}</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-6 h-6 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0 touch-manipulation"
          onClick={onRemove}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 border rounded-md">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 md:w-10 md:h-10 lg:w-8 lg:h-8 p-0 rounded-none touch-manipulation"
            onClick={() => onUpdateQuantity(item.qty - 1)}
            disabled={item.qty <= 1}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="w-8 text-center text-sm font-semibold">
            {item.qty}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 md:w-10 md:h-10 lg:w-8 lg:h-8 p-0 rounded-none touch-manipulation"
            onClick={() => onUpdateQuantity(item.qty + 1)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-gray-900">
            AED {Number.parseFloat(item.total).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">AED {item.price} each</p>
        </div>
      </div>
    </div>
  );
}

export default function POSTerminalPage() {
  const [applyTax, setApplyTax] = useState(true);
  const [walInMode, setWalkInMode] = useState(false);
  const [paymentType, setPaymentType] = useState<"full" | "partial" | "none">(
    "full"
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize with default sales person
  const form = useForm<CreateSalesOrderDto>({
    resolver: zodResolver(
      CreateSalesOrderSchema
    ) as Resolver<CreateSalesOrderDto>,
    defaultValues: {
      status: "confirmed", // Always confirmed as requested
      customerId: 0,
      customerName: "",
      salesPersonId: 2, // Default sales person ID
      salesPersonName: "Test Sales Person", // Default sales person name
      subtotal: "0.00",
      taxAmount: "0.00",
      discountAmount: "0.00",
      totalAmount: "0.00",
      paymentMethod: "cash",
      notes: "",
      priority: "medium",
      paymentTerms: "immediate",
      dueDate: new Date(), // Today by default
      deliveryDate: undefined,
      completedDate: undefined,
      items: [],
      partialAmount: "0.00",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const formData = watch();
  const cart = formData.items || [];
  const customerId = formData.customerId;
  const customerName = formData.customerName;
  const paymentMethod = formData.paymentMethod;
  const notes = formData.notes;
  const priority = formData.priority;
  const paymentTerms = formData.paymentTerms;
  const dueDate = formData.dueDate;
  const deliveryDate = formData.deliveryDate;
  const discountAmount = Number.parseFloat(formData.discountAmount) || 0;
  const partialAmount = formData?.partialAmount;

  const subtotal = cart.reduce(
    (total, item) => total + Number.parseFloat(item.total),
    0
  );
  const taxAmount = applyTax ? subtotal * 0.05 : 0;
  const totalAmount = subtotal - discountAmount + taxAmount;

  // Update form values when calculations change
  useEffect(() => {
    setValue("subtotal", subtotal.toFixed(2));
    setValue("taxAmount", taxAmount.toFixed(2));
    setValue("totalAmount", totalAmount.toFixed(2));
  }, [subtotal, taxAmount, totalAmount, setValue]);

  // Auto-calculate due date based on payment terms
  useEffect(() => {
    const today = new Date();
    let daysToAdd = 0;

    switch (paymentTerms) {
      case "immediate":
        daysToAdd = 0;
        break;
      case "net-7":
        daysToAdd = 7;
        break;
      case "net-15":
        daysToAdd = 15;
        break;
      case "net-30":
        daysToAdd = 30;
        break;
    }

    const newDueDate = new Date(today);
    newDueDate.setDate(today.getDate() + daysToAdd);
    setValue("dueDate", newDueDate);
  }, [paymentTerms, setValue]);

  // Handle payment type changes
  useEffect(() => {
    if (paymentType === "full") {
      setValue("partialAmount", totalAmount.toFixed(2));
    } else if (paymentType === "none") {
      setValue("partialAmount", "0.00");
    }
  }, [paymentType, totalAmount, setValue]);

  const updateQuantity = (index: number, newQty: number) => {
    if (newQty < 1) return;
    const currentItems = [...cart];
    currentItems[index].qty = newQty;
    currentItems[index].total = (
      Number.parseFloat(currentItems[index].price) * newQty
    ).toFixed(2);
    setValue("items", currentItems);
  };

  const removeItem = (index: number) => {
    const currentItems = cart.filter((_, i) => i !== index);
    setValue("items", currentItems);
  };

  const addItemToCart = (product: any) => {
    const currentItems = [...cart];
    const existingItemIndex = currentItems.findIndex(
      (cartItem) => cartItem.catelogId === product.id
    );

    if (existingItemIndex > -1) {
      currentItems[existingItemIndex].qty += 1;
      currentItems[existingItemIndex].total = (
        Number.parseFloat(currentItems[existingItemIndex].price) *
        currentItems[existingItemIndex].qty
      ).toFixed(2);
    } else {
      const newItem: SalesOrderItemDto = {
        description: product.name,
        catelogId: product.id,
        sku: product.sku,
        qty: 1,
        price: product.price.toString(),
        total: product.price.toString(),
      };
      currentItems.push(newItem);
    }
    setValue("items", currentItems);
  };

  const clearCart = () => {
    form.reset({
      ...form.getValues(),
      items: [],
      subtotal: "0.00",
      taxAmount: "0.00",
      totalAmount: "0.00",
      discountAmount: "0.00",
      partialAmount: "0.00",
    });
    setApplyTax(true);
  };

  const saveDraft = async () => {
    const draftData = { ...formData, status: "draft" as const };
    try {
      const response = await fetch("http://3.29.240.212/api/v1/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(draftData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Failed to save draft!");
      }

      toast.success("Draft saved successfully");
    } catch (error: any) {
      console.error("Error saving draft:", error);
      toast.error(error.message);
    }
  };

  const onSubmit = async (data: CreateSalesOrderDto) => {
    try {
      console.log(data);
      const response = await fetch("http://3.29.240.212/api/v1/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Failed to create sales order!");
      }

      console.log("Order created successfully:", result);

      // Reset form after successful submission
      form.reset();
      setApplyTax(true);
      setPaymentType("full");

      // Show success message
      toast.success(result.message);
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(error.message);
    }
  };

  // Mock data
  const { data: customers = [], isLoading: customerLoading } = useQuery<
    Customer[]
  >({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await fetch(
        "http://3.29.240.212/api/v1/list/customer",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();
      if (!response.ok) {
        toast.error("Failed to fetch customers list");
      }
      return json;
    },
  });

  const { data: products = [], isLoading: catalogLoading } = useQuery({
    queryKey: ["productsCatalog"],
    queryFn: async () => {
      const response = await fetch(
        "http://3.29.240.212/api/v1/products/list/catalog",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();
      if (!response.ok) {
        toast.error("Failed to fetch product catalog!");
      }
      return json;
    },
  });

  const selectedCustomer = customerId
    ? customers.find((c) => c.id === customerId)
    : null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "MMM d");
  };

  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;

    main.classList.remove("p-4", "md:p-6");

    return () => {
      main.classList.add("p-4", "md:p-6");
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-background">
      {/* Professional Header with Order Info */}
      <div
        className="flex-shrink-0 bg-white dark:bg-transparent border-b shadow-sm 
                overflow-x-auto overflow-y-hidden scrollbar-thin
                scrollbar-thumb-gray-400 scrollbar-track-gray-100
                hover:scrollbar-thumb-gray-600"
      >
        <div
          className="flex items-start lg:items-center justify-between gap-3 
                  px-2 sm:px-4 lg:px-6 py-3 flex-nowrap min-w-max"
        >
          {/* Main Header Row */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 px-2 sm:px-4 lg:px-6 py-3">
            {/* Desktop: All controls in one row */}
            <div className="hidden lg:flex items-center gap-x-6 gap-y-4 w-full justify-end">
              {/* Customer Selection */}
              <div className="flex items-center gap-2">
                <div className="w-48">
                  <CustomerSelectDialog
                    customers={customers}
                    customerId={watch("customerId")}
                    setValue={setValue}
                  />
                </div>
              </div>

              {/* Priority Selection */}
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Priority:
                </Label>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant={priority === "low" ? "default" : "outline"}
                    size="sm"
                    className={`h-8 px-3 text-sm touch-manipulation ${priority === "low" ? "" : "border-green-200 text-green-700"}`}
                    onClick={() => setValue("priority", "low")}
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                    Low
                  </Button>
                  <Button
                    type="button"
                    variant={priority === "medium" ? "default" : "outline"}
                    size="sm"
                    className={`h-8 px-3 text-sm touch-manipulation ${priority === "medium" ? "" : "border-yellow-200 text-yellow-700"}`}
                    onClick={() => setValue("priority", "medium")}
                  >
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                    Med
                  </Button>
                  <Button
                    type="button"
                    variant={priority === "high" ? "default" : "outline"}
                    size="sm"
                    className={`h-8 px-3 text-sm touch-manipulation ${priority === "high" ? "" : "border-red-200 text-red-700"}`}
                    onClick={() => setValue("priority", "high")}
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                    High
                  </Button>
                </div>
              </div>

              {/* Payment Terms */}
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Terms:
                </Label>
                <Select
                  value={paymentTerms}
                  onValueChange={(value) => setValue("paymentTerms", value)}
                >
                  <SelectTrigger className="h-8 text-sm w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="net-7">Net 7</SelectItem>
                    <SelectItem value="net-15">Net 15</SelectItem>
                    <SelectItem value="net-30">Net 30</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Due Date Display */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Due: {formatDate(dueDate)}</span>
              </div>

              {/* Delivery Date Selection */}
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Delivery:
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`h-8 px-3 text-sm justify-start text-left font-normal ${
                        !deliveryDate ? "text-muted-foreground" : ""
                      }`}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {deliveryDate ? formatDate(deliveryDate) : "Select"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={deliveryDate}
                      onSelect={(date) => setValue("deliveryDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Walk-in Mode */}
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium whitespace-nowrap">
                  Walk-in:
                </Label>
                <Switch checked={walInMode} onCheckedChange={setWalkInMode} />
              </div>

            </div>

            {/* Mobile/Tablet: Stacked layout */}
            <div className="lg:hidden w-full space-y-2">
              {/* Row 1: Customer and Priority */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <CustomerSelectDialog
                      customers={customers}
                      customerId={watch("customerId")}
                      setValue={setValue}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Label className="text-xs font-medium text-gray-700 whitespace-nowrap">
                    Priority:
                  </Label>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant={priority === "low" ? "default" : "outline"}
                      size="sm"
                      className={`h-7 px-2 text-xs touch-manipulation ${priority === "low" ? "" : "border-green-200 text-green-700"}`}
                      onClick={() => setValue("priority", "low")}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></div>
                      L
                    </Button>
                    <Button
                      type="button"
                      variant={priority === "medium" ? "default" : "outline"}
                      size="sm"
                      className={`h-7 px-2 text-xs touch-manipulation ${priority === "medium" ? "" : "border-yellow-200 text-yellow-700"}`}
                      onClick={() => setValue("priority", "medium")}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1"></div>
                      M
                    </Button>
                    <Button
                      type="button"
                      variant={priority === "high" ? "default" : "outline"}
                      size="sm"
                      className={`h-7 px-2 text-xs touch-manipulation ${priority === "high" ? "" : "border-red-200 text-red-700"}`}
                      onClick={() => setValue("priority", "high")}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1"></div>
                      H
                    </Button>
                  </div>
                </div>
              </div>

              {/* Row 2: Terms, Dates, Payment */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Label className="text-xs font-medium text-gray-700 whitespace-nowrap">
                    Terms:
                  </Label>
                  <Select
                    value={paymentTerms}
                    onValueChange={(value) => setValue("paymentTerms", value)}
                  >
                    <SelectTrigger className="h-7 text-xs w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="net-7">Net 7</SelectItem>
                      <SelectItem value="net-15">Net 15</SelectItem>
                      <SelectItem value="net-30">Net 30</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-xs font-medium text-gray-700 whitespace-nowrap">
                    Delivery:
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`h-7 px-2 text-xs justify-start text-left font-normal ${
                          !deliveryDate ? "text-muted-foreground" : ""
                        }`}
                      >
                        <Calendar className="mr-1 h-3 w-3" />
                        {deliveryDate ? formatDate(deliveryDate) : "Select"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={deliveryDate}
                        onSelect={(date) => setValue("deliveryDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-xs font-medium whitespace-nowrap">
                    Walk-in:
                  </Label>
                  <Switch checked={walInMode} onCheckedChange={setWalkInMode} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - iPad Optimized Layout */}
      <div className="flex-1 flex flex-col md:flex-row lg:flex-row gap-4 p-4 overflow-hidden min-h-0">
        {/* Left Panel - Products (iPad: Full width, Desktop: 2/3) */}
        <div className="flex-1 md:w-full lg:w-2/3 flex flex-col overflow-hidden">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="flex-shrink-0 pb-3 border-b">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle className="text-lg font-semibold">
                  Products & Services
                </CardTitle>
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search products, SKU, or category..."
                    className="pl-10 h-10 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <Tabs defaultValue="kandora" className="h-full flex flex-col">
                <TabsList className="flex-shrink-0 m-4 mb-0 w-full justify-start overflow-x-auto">
                  {products.map((category: any) => (
                    <TabsTrigger
                      key={category.category}
                      value={category.category.toLowerCase()}
                      className="px-4 py-2 text-sm touch-manipulation whitespace-nowrap"
                    >
                      {category.category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {products.map((category: any) => (
                  <TabsContent
                    key={category.category}
                    value={category.category.toLowerCase()}
                    className="flex-1 overflow-hidden m-0"
                  >
                    <ScrollArea className="h-full">
                      <div className="p-4 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-3">
                        {category.items
                          .filter(
                            (item: any) =>
                              searchTerm === "" ||
                              item.name
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              item.sku
                                ?.toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              category.category
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                          )
                          .map((item: any) => (
                            <ProductCard
                              key={item.id}
                              product={{ ...item, category: category.category }}
                              onAdd={() =>
                                addItemToCart({
                                  ...item,
                                  category: category.category,
                                })
                              }
                            />
                          ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Cart Summary (iPad: Fixed width, Desktop: 1/3) */}
        <div className="w-full md:w-80 lg:w-1/3 flex flex-col overflow-hidden">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="flex-shrink-0 pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  Order Summary
                </CardTitle>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {cart.length} item{cart.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-base text-gray-500 mb-1">
                      Cart is empty
                    </p>
                    <p className="text-sm text-gray-400">
                      Add products from the catalog
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item, index) => (
                      <CartItemCard
                        key={index}
                        item={item}
                        onUpdateQuantity={(qty) => updateQuantity(index, qty)}
                        onRemove={() => removeItem(index)}
                      />
                    ))}

                    <Separator className="my-4" />

                    {/* Controls */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Discount</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={formData.discountAmount || ""}
                          onChange={(e) =>
                            setValue("discountAmount", e.target.value)
                          }
                          className="w-24 h-9 text-sm"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                          Apply VAT (5%)
                        </Label>
                        <Switch
                          checked={applyTax}
                          onCheckedChange={setApplyTax}
                        />
                      </div>
                    </div>

                    {/* Totals */}
                    <div className="space-y-2 p-4 bg-gray-50 dark:bg-accent rounded-lg border">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold">
                          AED {subtotal.toFixed(2)}
                        </span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Discount</span>
                          <span className="font-semibold text-red-600">
                            - AED {discountAmount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">VAT (5%)</span>
                        <span className="font-semibold">
                          AED {taxAmount.toFixed(2)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-base font-bold">
                        <span>Total</span>
                        <span>AED {totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Payment Method
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={
                            paymentMethod === "card" ? "default" : "outline"
                          }
                          onClick={() => setValue("paymentMethod", "card")}
                          className="justify-center h-10 text-sm touch-manipulation"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Card
                        </Button>
                        <Button
                          variant={
                            paymentMethod === "cash" ? "default" : "outline"
                          }
                          onClick={() => setValue("paymentMethod", "cash")}
                          className="justify-center h-10 text-sm touch-manipulation"
                        >
                          <Banknote className="w-4 h-4 mr-2" />
                          Cash
                        </Button>
                        <Button
                          variant={
                            paymentMethod === "mobile" ? "default" : "outline"
                          }
                          onClick={() => setValue("paymentMethod", "mobile")}
                          className="justify-center h-10 text-sm touch-manipulation"
                        >
                          <Smartphone className="w-4 h-4 mr-2" />
                          Mobile
                        </Button>
                      </div>
                    </div>

                    {/* Payment Type Selection */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Payment Type
                      </Label>
                      <Select
                        value={paymentType}
                        onValueChange={(value) =>
                          setPaymentType(value as "full" | "partial" | "none")
                        }
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Full Payment</SelectItem>
                          <SelectItem value="partial">
                            Partial Payment
                          </SelectItem>
                          <SelectItem value="none">No Payment</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Partial Amount (conditional) */}
                      {paymentType === "partial" && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Partial Amount
                          </Label>
                          <Input
                            type="number"
                            value={partialAmount}
                            onChange={(e) =>
                              setValue("partialAmount", e.target.value)
                            }
                            className="h-9 text-sm"
                            placeholder="Enter partial amount"
                          />
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Order Notes</Label>
                      <Textarea
                        placeholder="Special instructions or notes..."
                        value={notes}
                        onChange={(e) => setValue("notes", e.target.value)}
                        className="resize-none text-sm min-h-[80px]"
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <CardFooter className="flex-shrink-0 flex flex-col gap-3 border-t bg-gray-50/50 dark:bg-accent p-4">
              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3 w-full">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  disabled={cart.length === 0}
                  className="h-10 text-sm touch-manipulation"
                >
                  Clear
                </Button>
                <Button
                  variant="outline"
                  onClick={saveDraft}
                  disabled={cart.length === 0 || !customerId || isSubmitting}
                  className="h-10 text-sm touch-manipulation"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Draft
                </Button>
                <Button
                  disabled={cart.length === 0 || !customerId || isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                  className="h-10 text-sm touch-manipulation"
                >
                  {isSubmitting ? "Processing..." : "Complete"}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex items-center justify-center h-10 text-sm touch-manipulation"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center h-10 text-sm touch-manipulation"
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
