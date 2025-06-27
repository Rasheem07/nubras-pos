"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  ShoppingBag,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  Smartphone,
  X,
  User,
  Calculator,
  Package,
  Scissors,
  UserPlus,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import QuickCustomerCreationForm from "./_components/quick-customer-creation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HeldOrdersPopover } from "@/components/held-orders-popover";
import { indexedDBManager, type HeldOrder } from "@/lib/indexeddb";
import Link from "next/link";
import { useHotkeys } from "react-hotkeys-hook";
import KeyboardShortcuts from "./_components/keyboardShortcuts";
import ModelSelectionDialog from "./_components/model-selection-dialog";
import { useTranslation } from "react-i18next";

// DTO Types matching your backend exactly
const CustomItemMeasurementSchema = z.object({
  frontLength: z.string().optional(),
  backLength: z.string().optional(),
  shoulder: z.string().optional(),
  sleeves: z.string().optional(),
  neck: z.string().optional(),
  waist: z.string().optional(),
  chest: z.string().optional(),
  widthEnd: z.string().optional(),
  notes: z.string().optional(),
});

const SalesOrderItemSchema = z.object({
  type: z.enum(["ready-made", "custom"]),
  description: z.string().max(100),
  catelogId: z.number().positive(),
  sku: z.string().max(15).optional(),
  qty: z.number().positive(),
  price: z.string(),
  total: z.string(),
  modelName: z.string().optional(),
  modelPrice: z.string().optional(),
  measurement: CustomItemMeasurementSchema.optional(),
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
  paymentStatus: z.enum(["no-payment", "partial", "completed"]).optional(),
  notes: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  paymentTerms: z.string(),
  dueDate: z.coerce.date(),
  deliveryDate: z.coerce.date().optional(),
  completedDate: z.coerce.date().optional(),
  items: z.array(SalesOrderItemSchema).min(1),
  partialAmount: z.string(),
});

type CreateSalesOrderDto = z.infer<typeof CreateSalesOrderSchema>;
type SalesOrderItemDto = z.infer<typeof SalesOrderItemSchema>;
type CustomItemMeasurement = z.infer<typeof CustomItemMeasurementSchema>;

const OrderFormSchema = z.object({
  customerId: z.number().positive("Please select a customer"),
  items: z.array(SalesOrderItemSchema).min(1, "Please add at least one item"),
  paymentMethod: z.enum(["cash", "card", "mobile"]),
  paymentTerms: z.string().min(1),
  priority: z.enum(["low", "medium", "high"]),
  notes: z.string().optional(),
  discountAmount: z.number().min(0, "Discount cannot be negative"),
  partialAmount: z.number().min(0, "Amount cannot be negative"),
});

type OrderFormData = z.infer<typeof OrderFormSchema>;

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: "new" | "active" | "gold" | "platinum" | "diamond" | "inactive";
  measurement?: {
    arabic?: CustomItemMeasurement;
    kuwaiti?: CustomItemMeasurement;
  };
}

interface Product {
  id: number;
  name: string;
  price: number;
  sku?: string;
  category: string;
  type: "ready-made" | "custom";
  image: string;
  models: CustomModel[];
}

interface CustomModel {
  id: number;
  name: string;
  charge: number;
  productId: number;
}

// Numeric Keypad Component
function NumericKeypad({
  onNumberClick,
  onClear,
  onEnter,
}: {
  onNumberClick: (num: string) => void;
  onClear: () => void;
  onEnter: () => void;
}) {
  const numbers = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    ["00", "0", "."],
  ];

  return (
    <div className="grid grid-cols-3 gap-2 p-3 bg-gray-100 dark:bg-secondary rounded-lg">
      {numbers.map((row, rowIndex) =>
        row.map((num) => (
          <Button
            key={`${rowIndex}-${num}`}
            variant="outline"
            className="h-10 text-base font-semibold touch-manipulation hover:bg-primary hover:text-primary-foreground"
            onClick={() => onNumberClick(num)}
          >
            {num}
          </Button>
        ))
      )}
      <Button
        variant="destructive"
        className="h-10 text-sm font-semibold touch-manipulation"
        onClick={onClear}
      >
        Clear
      </Button>
      <Button
        variant="default"
        className="h-10 text-sm font-semibold touch-manipulation col-span-2"
        onClick={onEnter}
      >
        Enter
      </Button>
    </div>
  );
}

// Customer Selection Component for Main Space
function CustomerSelectionScreen({
  customers,
  onSelectCustomer,
  onShowForm,
  searchTerm,
  setSearchTerm,
}: {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  onShowForm: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) {
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
  );

  const { t } = useTranslation();

  return (
    <div className="h-full flex flex-col p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">{t("terminal.selectCustomer")}</h2>
        <p className="text-gray-600">
          {t("terminal.beginOrderInstruction")}
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder={t("terminal.searchCustomersPlaceholder")}
          className="pl-10 py-6 text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Button
        variant="outline"
        size="lg"
        className="w-full py-6 text-lg mb-6"
        onClick={onShowForm}
      >
        <UserPlus className="w-5 h-5 mr-2" />
        {t("terminal.addNewCustomer")}
      </Button>

      <ScrollArea className="flex-1 border rounded-lg bg-gray-50 dark:bg-secondary p-3">
        <div className="grid grid-cols-2 gap-3">
          {filteredCustomers.map((customer) => (
            <Button
              key={customer.id}
              variant="outline"
              className="w-full justify-between h-auto p-4 hover:border-primary hover:bg-primary/5 bg-white dark:bg-card"
              onClick={() => onSelectCustomer(customer)}
            >
              <div className="text-left">
                <div className="font-medium text-lg">{customer.name}</div>
                <div className="text-sm text-gray-500">{customer.phone}</div>
                <Badge variant="secondary" className="mt-1">
                  {customer.status}
                </Badge>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}



interface MeasurementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: any;
  onSave: (measurement: CustomItemMeasurement) => void;
}

// Measurement Form Dialog
export function MeasurementDialog({
  open,
  onOpenChange,
  customer,
  onSave,
}: MeasurementDialogProps) {
  const [measurement, setMeasurement] = useState<CustomItemMeasurement>({
    frontLength: "",
    backLength: "",
    shoulder: "",
    sleeves: "",
    neck: "",
    waist: "",
    chest: "",
    widthEnd: "",
    notes: undefined,
  });

  // pre-fill if available
  useEffect(() => {
    const pre = customer?.measurement?.arabic;
    if (pre) {
      setMeasurement({ ...pre });
    }
  }, [customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave(measurement);
    setMeasurement({
      frontLength: "",
      backLength: "",
      shoulder: "",
      sleeves: "",
      neck: "",
      waist: "",
      chest: "",
      widthEnd: "",
      notes: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Custom Measurements</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Front Length", key: "frontLength" },
              { label: "Back Length", key: "backLength" },
              { label: "Shoulder", key: "shoulder" },
              { label: "Sleeves", key: "sleeves" },
              { label: "Neck", key: "neck" },
              { label: "Waist", key: "waist" },
              { label: "Chest", key: "chest" },
              { label: "Width End", key: "widthEnd" },
            ].map(({ label, key }) => (
              <div className="space-y-2" key={key}>
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  name={key}
                  required
                  value={measurement[key as keyof CustomItemMeasurement]}
                  onChange={(e) =>
                    setMeasurement((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  placeholder="Enter measurement"
                />
              </div>
            ))}
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={measurement.notes}
              onChange={(e) =>
                setMeasurement((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Additional notes or special instructions"
              rows={3}
            />
          </div>
          <div className="flex justify-between gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Measurements</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Category Card Component
function CategoryCard({
  category,
  isSelected,
  itemCount,
  onClick,
}: {
  category: string;
  isSelected: boolean;
  itemCount: number;
  onClick: () => void;
}) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 touch-manipulation h-16 ${isSelected
        ? "border-primary bg-primary/10 shadow-md"
        : "hover:shadow-md hover:border-primary/40 bg-white border border-gray-200"
        }`}
      onClick={onClick}
    >
      <CardContent className="p-3 h-full flex flex-col justify-center items-center text-center">
        <h3
          className={`font-semibold text-xs ${isSelected ? "text-primary" : "text-gray-900"
            }`}
        >
          {category}
        </h3>
        {itemCount > 0 && (
          <Badge
            variant={isSelected ? "default" : "secondary"}
            className="text-xs mt-1"
          >
            {itemCount}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

// Product Card Component
function ProductCard({
  product,
  onAdd,
  isCustom = false,
  disabled = false,
}: {
  product: Product;
  onAdd: () => void;
  isCustom?: boolean;
  disabled?: boolean;
}) {
  const hasImage = product.image && product.image.trim() !== "";

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md group touch-manipulation ${disabled
        ? "opacity-60 cursor-not-allowed bg-gray-50"
        : "hover:border-primary/30 bg-white border border-gray-200 cursor-pointer"
        }`}
      onClick={
        disabled
          ? () => toast.error("Please select a customer first")
          : onAdd
      }
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Image Section */}
          <div className="flex-shrink-0">
            {hasImage ? (
              <Dialog>
                <DialogTrigger asChild>
                  <div
                    className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="max-w-full max-h-[70vh] object-contain rounded-lg"
                    />
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-gray-900 line-clamp-1 mb-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-lg font-semibold text-gray-900">
                    AED {product.price}
                  </p>
                  {isCustom && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      Custom
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500">SKU: {product.sku}</p>
              </div>

              {/* Add Button */}
              <Button
                size="sm"
                variant="outline"
                className={`w-8 h-8 p-0 rounded-full flex-shrink-0 ${disabled
                  ? "opacity-0"
                  : "opacity-0 group-hover:opacity-100 transition-opacity"
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!disabled) onAdd();
                }}
                disabled={disabled}
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

// Cart Item Component - Fixed for visibility
function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: SalesOrderItemDto;
  onUpdateQuantity: (qty: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="p-3 border border-gray-200 rounded-lg bg-white dark:bg-card min-h-[90px] w-full">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2 leading-tight">
            {item.description}
          </h3>
          {item.sku && (
            <span className="text-sm text-gray-500">{item.sku}</span>
          )}
          <div className="text-sm text-blue-600 mt-1">{item.modelName}</div>
          {item.measurement && (
            <Badge variant="outline" className="text-xs mt-1">
              Measured
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-6 h-6 p-0 text-gray-400 hover:text-red-500 flex-shrink-0"
          onClick={onRemove}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex items-center justify-between">
        {item.type == "ready-made" && (
          <div className="flex items-center gap-1 border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0"
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
              className="w-8 h-8 p-0"
              onClick={() => onUpdateQuantity(item.qty + 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
        <div
          className={`text-right ${item.type == "custom" && "flex flex-col gap-1 justify-end w-full"
            }`}
        >
          <p className="text-sm font-bold">
            AED {Number.parseFloat(item.total).toFixed(2)}
          </p>
          <p className={`text-sm text-gray-500 text-right`}>
            AED {item.price} + {item.type === "custom" && item.modelPrice} each
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProfessionalPOSTerminal() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [cart, setCart] = useState<SalesOrderItemDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("NUBRAS GENTS KANDORA SECTION");
  const [applyTax, setApplyTax] = useState(true);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "mobile"
  >("cash");
  const [paymentTerms, setPaymentTerms] = useState("immediate");
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [amountInput, setAmountInput] = useState("");
  const [measurementDialogOpen, setMeasurementDialogOpen] = useState(false);
  const [pendingCustomItem, setPendingCustomItem] = useState<Product | null>(
    null
  );
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [selectedModel, setSelectedModel] = useState<CustomModel | null>(null);
  const [modelDialogOpen, setModelDialogOpen] = useState(false);
  const [tab, setTab] = useState("categories");

  //refs
  const amountInputRef = useRef<HTMLInputElement>(null);

  const onTabChange = (value: string) => {
    setTab(value);
  };

  const [navOpen, setNavOpen] = useState(true);

  useHotkeys("alt+1", () => setNavOpen((o) => !o), {
    preventDefault: true,
  });

  // Alt+2, Alt+3, Alt+4: switch POS tabs
  useHotkeys("alt+2", () => setTab("categories"));
  useHotkeys("alt+3", () => setTab("ready-made"));
  useHotkeys("alt+4", () => setTab("custom"));
  useHotkeys("alt+a", () => {
    if (amountInputRef.current) {
      amountInputRef.current.focus();
    }
  });

  const form = useForm<OrderFormData>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      customerId: 0,
      items: [],
      paymentMethod: "cash",
      paymentTerms: "immediate",
      priority: "medium",
      notes: "",
      discountAmount: 0,
      partialAmount: 0,
    },
  });

  // API Queries
  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/list/customer`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("Failed to fetch customers");
      return response.json();
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ["productsCatalog"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/list/catalog`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  // Get categories and selected category items
  const categories = products.map((cat: any) => cat.category) || [];
  const selectedCategoryData = products.find(
    (cat: any) => cat.category === selectedCategory
  );
  const categoryItems = selectedCategoryData?.items || [];

  // Get item count per category from cart
  const getCategoryItemCount = (category: string) => {
    const categoryData = products.find((cat: any) => cat.category === category);
    if (!categoryData) return 0;

    return cart
      .filter((cartItem) =>
        categoryData.items.some((item: any) => item.id === cartItem.catelogId)
      )
      .reduce((sum, cartItem) => sum + cartItem.qty, 0);
  };

  // Auto-calculate due date based on payment terms
  const getDueDate = () => {
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

    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + daysToAdd);
    return dueDate;
  };

  // Delivery date quick options
  const getDeliveryDateOptions = () => {
    const today = new Date();
    return [
      {
        label: t("terminal.tomorrow"),
        date: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
      {
        label: t("terminal.plus3Days"),
        date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        label: t("terminal.plus5Days"),
        date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        label: t("terminal.plus7Days"),
        date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        label: t("terminal.plus10Days"),
        date: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
      },
      {
        label: t("terminal.plus14Days"),
        date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
      },
    ];
  };

  // Calculations
  const subtotal = cart.reduce(
    (total, item) => total + Number.parseFloat(item.total),
    0
  );
  const taxAmount = applyTax ? subtotal * 0.05 : 0;
  const totalAmount = subtotal - discountAmount + taxAmount;
  const enteredAmount = Number.parseFloat(amountInput) || 0;

  // Determine payment status
  const getPaymentStatus = (): "no-payment" | "partial" | "completed" => {
    if (enteredAmount === 0) return "no-payment";
    if (enteredAmount < totalAmount) return "partial";
    return "completed";
  };

  // Cart operations
  // Replace the existing addToCart function with this:
  const addToCart = (
    product: Product,
    model?: CustomModel,
    measurement?: CustomItemMeasurement
  ) => {
    if (!selectedCustomer) {
      toast.error("Please select a customer first");
      return;
    }

    // For custom items, always create a new line item
    if (product.type === "custom") {
      const newItem: SalesOrderItemDto = {
        description: product.name,
        catelogId: product.id,
        sku: product.sku,
        qty: 1,
        price: Number(product.price).toFixed(2),
        total: (Number(product.price) + (Number(model?.charge) || 0)).toFixed(
          2
        ),
        modelName: model?.name || undefined,
        modelPrice: String(model?.charge) || undefined,
        measurement: measurement ? measurement : undefined,
        type: "custom", // Add type identifier
      };

      setCart((prev) => [...prev, newItem]);
      return;
    }

    // For ready-made items, merge quantities
    const newItem: SalesOrderItemDto = {
      description: product.name,
      catelogId: product.id,
      sku: product.sku,
      qty: 1,
      price: Number(product.price).toFixed(2),
      total: (Number(product.price) + (Number(model?.charge) || 0)).toFixed(2),
      modelName: model?.name || undefined,
      modelPrice:
        model?.charge !== undefined ? String(model.charge) : undefined,
      measurement: undefined, // Ready-made don't have measurements
      type: "ready-made", // Add type identifier
    };

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.catelogId === product.id &&
          item.modelName === newItem.modelName &&
          item.type === "ready-made" // Only merge ready-made items
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].qty += 1;
        updated[existingIndex].total = (
          Number.parseFloat(updated[existingIndex].price) *
          updated[existingIndex].qty
        ).toString();
        return updated;
      }

      return [...prev, newItem];
    });
  };

  // Replace the existing updateQuantity function with this:
  const updateQuantity = (index: number, newQty: number) => {
    if (newQty < 1) return;

    // Prevent quantity updates for custom items
    if (cart[index].type === "custom") {
      toast.warning(
        "Cannot change quantity for custom items. Add a new item instead."
      );
      return;
    }

    setCart((prev) => {
      const updated = [...prev];
      updated[index].qty = newQty;
      updated[index].total = (
        Number.parseFloat(updated[index].price) * newQty
      ).toString();
      return updated;
    });
  };
  const removeItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  function handleAddProduct(prod: Product) {
    if (prod.type === "custom") {
      setPendingCustomItem(prod);
      setModelDialogOpen(true);
    } else {
      // ready-made
      addToCart(prod);
    }
  }

  /** Called when user picks a model in the model-dialog */
  function onModelSelect(model: CustomModel) {
    // you can still pop the measurement dialog here if needed;
    setSelectedModel(model);
    setModelDialogOpen(false);
    setMeasurementDialogOpen(true);
  }

  // Handle custom item selection
  const handleCustomItemAdd = (product: Product) => {
    console.log("product recieved from custom item add func: ", product);
    // Prevent adding items if no customer is selected
    if (!selectedCustomer) {
      toast.error("Please select a customer first");
      return;
    }

    setPendingCustomItem(product);
    setModelDialogOpen(true);
  };

  const handleMeasurementSave = (measurement?: CustomItemMeasurement) => {
    console.log("Debug: pendingCustomItem", pendingCustomItem);
    console.log("Debug: selectedModel", selectedModel);
    console.log("Debug: measurement", measurement);

    if (!pendingCustomItem || !selectedModel) {
      toast.error("Missing product or model to add to cart");
      return;
    }

    // Add to cart only after both are ready
    addToCart(pendingCustomItem, selectedModel, measurement);

    // Reset
    setPendingCustomItem(null);
    setSelectedModel(null);
    form.reset(); // if using react-hook-form for measurement
    setMeasurementDialogOpen(false);
  };

  // Numeric keypad handlers
  const handleNumberClick = (num: string) => {
    setAmountInput((prev) => {
      const newValue = prev + num;
      const numericValue = Number.parseFloat(newValue) || 0;

      // Prevent entering more than 10x the total amount as a reasonable limit
      if (numericValue > totalAmount * 10) {
        toast.warning("Amount exceeds reasonable payment limit");
        return prev;
      }

      return newValue;
    });
  };

  const handleClear = () => {
    setAmountInput("");
  };

  const handleEnter = () => {
    if (enteredAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (enteredAmount > totalAmount) {
      toast.success(
        `Amount entered: AED ${enteredAmount.toFixed(2)} (Change: AED ${(
          enteredAmount - totalAmount
        ).toFixed(2)})`
      );
    } else if (enteredAmount === totalAmount) {
      toast.success(`Exact amount entered: AED ${enteredAmount.toFixed(2)}`);
    } else {
      toast.success(`Partial payment entered: AED ${enteredAmount.toFixed(2)}`);
    }
  };

  // Hold order functionality
  const handleHoldOrder = async () => {
    if (!selectedCustomer || cart.length === 0) {
      toast.error("Please select a customer and add items to hold order");
      return;
    }

    const heldOrder: HeldOrder = {
      id: `held-${Date.now()}`,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      items: cart,
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount,
      paymentMethod,
      paymentTerms,
      deliveryDate: deliveryDate ?? undefined,
      notes,
      priority,
      createdAt: new Date(),
    };

    try {
      await indexedDBManager.saveHeldOrder(heldOrder);
      toast.success("Order held successfully");

      // Reset form
      setCart([]);
      setSelectedCustomer(null);
      setAmountInput("");
      setDiscountAmount(0);
      await indexedDBManager.saveHeldOrder(heldOrder);

      // Reset form
      setCart([]);
      setSelectedCustomer(null);
      setAmountInput("");
      setDiscountAmount(0);
      setNotes("");
      setDeliveryDate(null);
    } catch (error) {
      toast.error("Failed to hold order");
      console.error(error);
    }
  };

  const handleRestoreOrder = (order: HeldOrder) => {
    // Find customer by name (you might want to store customer ID in held orders)
    const customer = customers.find((c) => c.name === order.customerName);
    if (customer) {
      setSelectedCustomer(customer);
    }

    setCart(order.items);
    setDiscountAmount(order.discountAmount);
    setPaymentMethod(order.paymentMethod as "cash" | "card" | "mobile");
    setPaymentTerms(order.paymentTerms);
    setDeliveryDate(order.deliveryDate || null);
    setNotes(order.notes);
    setPriority(order.priority as "low" | "medium" | "high");
  };

  // Submit order
  const handleSubmitOrder = async () => {
    if (!selectedCustomer || cart.length === 0) {
      toast.error("Please select a customer and add items to cart");
      return;
    }

    const formData: OrderFormData = {
      customerId: selectedCustomer?.id || 0,
      items: cart,
      paymentMethod,
      paymentTerms,
      priority,
      notes,
      discountAmount,
      partialAmount: enteredAmount,
    };

    const validation = OrderFormSchema.safeParse(formData);

    if (!validation.success) {
      validation.error.errors.forEach((error) => {
        toast.error(error.message);
      });
      return;
    }

    const orderData: CreateSalesOrderDto = {
      status: "confirmed",
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      salesPersonId: 2,
      salesPersonName: "Test Sales Person",
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      paymentMethod,
      paymentStatus: getPaymentStatus(),
      notes,
      priority,
      paymentTerms,
      dueDate: getDueDate(),
      deliveryDate: deliveryDate ?? undefined,
      items: cart,
      partialAmount: enteredAmount.toFixed(2),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/sales`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message ?? "Failed to create order");

      toast.success("Order created successfully!");

      // Reset form
      setCart([]);
      setSelectedCustomer(null);
      setAmountInput("");
      setDiscountAmount(0);
      setNotes("");
      setDeliveryDate(null);
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
    }
  };

  const applyPromotion = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/promotions/apply`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode, totalAmount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // 2️⃣ Add the returned discount to any existing manual discount
      setDiscountAmount((prev) => prev + data.discountAmount);

      toast.success(
        `Applied '${data.promotion.code}': AED ${data.discountAmount.toFixed(
          2
        )} off`
      );
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const { t } = useTranslation();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Left Panel - Cart/Bill - Medium Compact, Fully Scrollable */}
      {navOpen && (
        <div className="w-80 bg-white dark:bg-background border-r flex flex-col shadow-md">
          <div className="p-4 border-b  bg-gray-50 dark:bg-secondary flex justify-between w-full">
            <div>
              <h2 className="text-lg font-bold mb-2">{t('terminal.bill')}</h2>
              <Badge variant="secondary" className="text-sm">
                {t("terminal.items", { count: cart.length })}
              </Badge>
            </div>
            <div className="bg-background/95 backdrop-blur-md border border-border/60 rounded-md px-2.5 py-1.5 shadow-sm animate-in fade-in-0 zoom-in-95 duration-200 text-sm font-sans text-gray-600 ">
              <div className="text-[10px] text-gray-900b text-muted-foreground/80 space-y-0.5">
                <div className="flex items-center gap-1.5 justify-center">
                  <kbd className="inline-flex items-center rounded border bg-muted/50 px-1 py-0.5 text-[9px] text-gray-900 font-mono text-muted-foreground">
                    {typeof window !== "undefined" &&
                      navigator?.platform?.includes("Mac")
                      ? "⌘"
                      : "Ctrl"}{" "}
                    + `
                  </kbd>
                  <span className="text-[9px]">Toggle</span>
                </div>
              </div>
              Navigation bar
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4">
              {/* Cart Items - No internal scroll, all visible */}
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <ShoppingBag className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">{t("terminal.cartIsEmpty")}</p>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {cart.map((item, index) => (
                    <CartItem
                      key={index}
                      item={item}
                      onUpdateQuantity={(qty) => updateQuantity(index, qty)}
                      onRemove={() => removeItem(index)}
                    />
                  ))}
                </div>
              )}

              {/* All controls and totals in the scrollable area */}
              <div className="space-y-3">
                <div className="space-y-4 p-4 bg-gray-50 rounded-md border">
                  {/* Promo Code Input */}
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder={t("terminal.enterPromoCode")}
                      value={promoCode}
                      onChange={(e) =>
                        setPromoCode(e.target.value.toUpperCase())
                      }
                      className="flex-1"
                    />
                    <Button onClick={applyPromotion}>{t("terminal.apply")}</Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{t("terminal.discount")}</Label>
                    <Input
                      type="number"
                      value={discountAmount}
                      onChange={(e) =>
                        setDiscountAmount(
                          Number.parseFloat(e.target.value)
                        )
                      }
                      className="w-20 h-8 text-sm"
                    />
                  </div>

                  {/* Discount Display */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t("terminal.totalDiscount")}</span>
                    <span className="font-semibold">
                      AED {discountAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">{t("terminal.vat")}</Label>
                  <Switch checked={applyTax} onCheckedChange={setApplyTax} />
                </div>
              </div>

              <div className="space-y-2 p-3 bg-gray-50 dark:bg-secondary rounded border mb-3 text-sm mt-4">
                <div className="flex justify-between">
                  <span>{t("terminal.subtotal")}</span>
                  <span>AED {subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>{t("terminal.discount")}</span>
                    <span>-AED {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t("terminal.vatLabel")}</span>
                  <span>AED {taxAmount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>{t("terminal.total")}</span>
                  <span>AED {totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="grid grid-cols-3 gap-1 mb-2">
                <Button
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("cash")}
                  className="h-8 text-sm"
                >
                  <Banknote className="w-3 h-3 mr-1" />
                  {t("terminal.cash")}
                </Button>
                <Button
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("card")}
                  className="h-8 text-sm"
                >
                  <CreditCard className="w-3 h-3 mr-1" />
                  {t("terminal.card")}
                </Button>
                <Button
                  variant={paymentMethod === "mobile" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("mobile")}
                  className="h-8 text-sm"
                >
                  <Smartphone className="w-3 h-3 mr-1" />
                  {t("terminal.mobile")}
                </Button>
              </div>

              {/* Payment Terms */}
              <div className="mb-2">
                <Label className="text-sm mb-1 block">{t("terminal.paymentTerms")}</Label>
                <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">{t("terminal.immediate")}</SelectItem>
                    <SelectItem value="net-7">{t("terminal.net7")}</SelectItem>
                    <SelectItem value="net-15">{t("terminal.net15")}</SelectItem>
                    <SelectItem value="net-30">{t("terminal.net30")}</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-gray-500 mt-1">
                  {t("terminal.due", {
                    date: getDueDate().toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  })}

                </div>
              </div>

              {/* Delivery Date Chips */}
              <div className="mb-2">
                <Label className="text-sm mb-1 block">{t("terminal.deliveryDate")}</Label>
                <div className="grid grid-cols-3 gap-1 mb-1">
                  {getDeliveryDateOptions()
                    .slice(0, 6)
                    .map((option) => (
                      <Button
                        key={option.label}
                        variant={
                          deliveryDate?.toDateString() ===
                            option.date.toDateString()
                            ? "default"
                            : "outline"
                        }
                        onClick={() => setDeliveryDate(option.date)}
                        className="h-8 text-sm"
                      >
                        {option.label}
                      </Button>
                    ))}
                </div>
                {deliveryDate && (
                  <div className="text-sm text-gray-600">
                    {t("terminal.selected", { date: deliveryDate.toLocaleDateString() })}
                  </div>
                )}
              </div>

              {/* Priority */}
              <div className="mb-2">
                <Label className="text-sm mb-1 block">{t("terminal.priority")}</Label>
                <div className="grid grid-cols-3 gap-1">
                  <Button
                    variant={priority === "low" ? "default" : "outline"}
                    onClick={() => setPriority("low")}
                    className="h-8 text-sm"
                  >
                    {t("terminal.low")}
                  </Button>
                  <Button
                    variant={priority === "medium" ? "default" : "outline"}
                    onClick={() => setPriority("medium")}
                    className="h-8 text-sm"
                  >
                    {t("terminal.mediumShort")}
                  </Button>
                  <Button
                    variant={priority === "high" ? "default" : "outline"}
                    onClick={() => setPriority("high")}
                    className="h-8 text-sm"
                  >
                    {t("terminal.high")}
                  </Button>
                </div>
              </div>

              {/* Amount Display */}
              <div className="mb-2 p-3 bg-gray-50 dark:bg-secondary rounded border">
                <div className="text-sm text-gray-600">{t("terminal.amountEntered")}</div>
                <div className="text-base font-bold">
                  AED {enteredAmount.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  {t("terminal.status", { status: getPaymentStatus().replace("-", " ").toUpperCase() })}
                </div>

                {enteredAmount > totalAmount && (
                  <div className="mt-1 text-sm text-green-600">
                    {t("change", { change: (enteredAmount - totalAmount).toFixed(2) })}
                  </div>
                )}

                {enteredAmount > totalAmount * 1.5 && (
                  <div className="mt-1 text-xs text-amber-600">
                    {t("terminal.warningHighAmount")}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleHoldOrder}
                  disabled={!selectedCustomer || cart.length === 0}
                  className="flex-1 h-9 font-semibold text-sm"
                >
                  {t("terminal.holdOrder")}
                </Button>
                <Button
                  onClick={handleSubmitOrder}
                  disabled={!selectedCustomer || cart.length === 0}
                  className="flex-1 h-9 font-semibold text-sm"
                >
                  {t("terminal.completeOrder")}
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Right Panel - Products and Controls */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Customer Selection Header - Fixed */}
        <div className="p-3 bg-white dark:bg-background border-b flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-56">
              {selectedCustomer ? (
                <Button
                  variant="default"
                  className="w-full justify-start h-9 text-left"
                  onClick={() => setSelectedCustomer(null)}
                >
                  <User className="w-4 h-4 mr-2" />
                  {selectedCustomer.name}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full justify-start h-9 text-left"
                  disabled
                >
                  <User className="w-4 h-4 mr-2" />
                  {t("terminal.noCustomerSelected")}
                </Button>
              )}
            </div>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t("terminal.searchProductsPlaceholder")}
                className="pl-10 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Link href="/sales">
                <Button variant="outline" size="sm">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  {t("terminal.orders")}
                </Button>
              </Link>
              <HeldOrdersPopover onRestoreOrder={handleRestoreOrder} />
              <KeyboardShortcuts />
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Products Area - Independent Scroll */}
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-black/90">
            {!selectedCustomer ? (
              // Customer Selection Screen
              <CustomerSelectionScreen
                customers={customers}
                onSelectCustomer={setSelectedCustomer}
                onShowForm={() => setShowCustomerForm(true)}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            ) : (
              // Products Display
              <div className="p-3 h-full flex flex-col min-h-0">
                <Tabs
                  value={tab}
                  onValueChange={onTabChange}
                  className="h-full flex flex-col"
                >
                  <TabsList className="mb-3">
                    <TabsTrigger value="categories">
                      <Package className="w-4 h-4 mr-2" />
                      {t("terminal.categories")}
                    </TabsTrigger>
                    <TabsTrigger value="ready-made">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      {t("terminal.readyMade")}
                    </TabsTrigger>
                    <TabsTrigger value="custom">
                      <Scissors className="w-4 h-4 mr-2" />
                      {t("terminal.customService")}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value="categories"
                    className="flex-1 min-h-0 overflow-hidden"
                  >
                    <div className="h-full flex flex-col min-h-0">
                      {/* Category Selection Grid - Fixed */}
                      <div className="mb-3 flex-shrink-0">
                        <h3 className="text-sm font-semibold mb-2">
                          {t("terminal.selectCategory")}
                        </h3>
                        <div className="grid grid-cols-5 gap-2 overflow-x-auto">
                          {categories.map((category: string) => (
                            <CategoryCard
                              key={category}
                              category={category}
                              isSelected={selectedCategory === category}
                              itemCount={getCategoryItemCount(category)}
                              onClick={() => setSelectedCategory(category)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Products Grid - Scrollable */}
                      <div className="flex-1 min-h-0">
                        <h3 className="text-sm font-semibold mb-2">
                          {t("terminal.products", {
                            category: selectedCategory || "All Categories",
                          })}
                        </h3>
                        <ScrollArea className="h-full">
                          <div className="grid grid-cols-1 gap-2 pr-4 pb-10 ">
                            {categoryItems
                              .filter(
                                (item: any) =>
                                  searchTerm === "" ||
                                  item.name
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                              )
                              .map((item: any) => (
                                <ProductCard
                                  key={item.id}
                                  product={{
                                    ...item,
                                    category: selectedCategory,
                                  }}
                                  onAdd={() => handleAddProduct(item)}
                                />
                              ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="ready-made"
                    className="flex-1 min-h-0 overflow-hidden"
                  >
                    <ScrollArea className="h-full">
                      <div className="grid grid-cols-1 gap-2 pr-4 pb-10">
                        {products.flatMap((category: any) =>
                          category.items
                            .filter(
                              (item: any) =>
                                (searchTerm === "" ||
                                  item.name
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())) &&
                                (item.type == "ready-made" ||
                                  item.type == "both")
                            )
                            .map((item: any) => (
                              <ProductCard
                                key={item.id}
                                product={{
                                  ...item,
                                  category: category.category,
                                  type: "ready-made",
                                }}
                                onAdd={() =>
                                  addToCart({
                                    ...item,
                                    category: category.category,
                                    type: "ready-made",
                                  })
                                }
                              />
                            ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent
                    value="custom"
                    className="flex-1 min-h-0 overflow-hidden"
                  >
                    <ScrollArea className="h-full">
                      <div className="grid grid-cols-1 gap-2 pr-4 pb-10">
                        {products.flatMap((category: any) =>
                          category.items
                            .filter(
                              (item: any) =>
                                (searchTerm === "" ||
                                  item.name
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())) &&
                                (item.type == "custom" || item.type == "both")
                            )
                            .map((item: any) => (
                              <ProductCard
                                key={`custom-${item.id}`}
                                product={{
                                  ...item,
                                  category: category.category,
                                  type: "custom",
                                }}
                                onAdd={() =>
                                  handleCustomItemAdd({
                                    ...item,
                                    category: category.category,
                                    type: "custom",
                                  })
                                }
                                isCustom={true}
                              />
                            ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>

          {/* Fixed Numeric Keypad - Independent Scroll */}
          <div className="w-64 p-3 bg-white dark:bg-background border-l flex-shrink-0 flex flex-col shadow-md">
            <div className="mb-3 flex-shrink-0">
              <h3 className="font-semibold mb-2 flex items-center text-sm">
                <Calculator className="w-4 h-4 mr-2" />
                {t("terminal.amountEntry")}
              </h3>
              <div className="p-2 bg-gray-50 rounded border mb-2">
                <Input
                  ref={amountInputRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // optional: prevents form submission
                      handleEnter();
                    }
                  }}
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0.00"
                  className="text-right text-4xl font-mono "
                />
              </div>
            </div>
            <div className="flex-shrink-0">
              <NumericKeypad
                onNumberClick={handleNumberClick}
                onClear={handleClear}
                onEnter={handleEnter}
              />
            </div>

            {/* Notes - Scrollable if needed */}
            <div className="mt-3 flex-1 min-h-0">
              <Label className="text-sm mb-1 block">{t("terminal.orderNotes")}</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("terminal.specialInstructions")}
                className="text-sm h-12 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Customer Creation Form */}
      {showCustomerForm && (
        <QuickCustomerCreationForm
          open={showCustomerForm}
          onOpenChange={setShowCustomerForm}
          onBack={() => setShowCustomerForm(false)}
          handleSelect={(customer) => {
            setSelectedCustomer(customer);
            setShowCustomerForm(false);
          }}
        />
      )}

      {/* — Custom model selection — */}
      <ModelSelectionDialog
        open={modelDialogOpen}
        onOpenChange={setModelDialogOpen}
        productName={pendingCustomItem?.name || ""}
        basePrice={Number(pendingCustomItem?.price || 0)}
        models={pendingCustomItem?.models || []}
        onSelect={onModelSelect}
      />

      {/* Measurement Dialog */}
      <MeasurementDialog
        open={measurementDialogOpen}
        onOpenChange={setMeasurementDialogOpen}
        customer={selectedCustomer}
        onSave={handleMeasurementSave}
      />
    </div>
  );
}
