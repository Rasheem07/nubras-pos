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
  Clock,
  X,
  User,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";

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
  paymentStatus: z.enum(["no-payment", "partial", "paid"]).optional(),
  notes: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  paymentTerms: z.string(),
  dueDate: z.coerce.date(),
  deliveryDate: z.coerce.date().optional(),
  completedDate: z.coerce.date().optional(),
  items: z.array(SalesOrderItemSchema).min(1),
});

type CreateSalesOrderDto = z.infer<typeof CreateSalesOrderSchema>;
type SalesOrderItemDto = z.infer<typeof SalesOrderItemSchema>;

interface CartItem {
  id: string;
  description: string;
  catelogId: number;
  sku?: string;
  qty: number;
  price: number;
  total: number;
  image?: string;
  category: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  loyaltyTier?: "standard" | "silver" | "gold" | "platinum";
  address?: string;
}

interface Staff {
  id: number;
  name: string;
  role: string;
  department: string;
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
      className="cursor-pointer hover:shadow-sm transition-all duration-200 hover:border-blue-300 group"
      onClick={onAdd}
    >
      <CardContent className="p-2">
        <div className="flex items-center gap-2">
          {/* Image Left */}
          <div className="w-12 h-12 rounded bg-gray-100 flex-shrink-0 overflow-hidden">
            <img
              src={product.image || "/placeholder.svg?height=48&width=48"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Right */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-xs text-gray-900 line-clamp-1 mb-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {product.category}
                  </Badge>
                  {product.sku && (
                    <span className="text-xs text-gray-500">{product.sku}</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  AED {product.price}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd();
                }}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Ultra Compact Cart Item
interface CartItemCardProps {
  item: SalesOrderItemDto;
  onUpdateQuantity: (qty: number) => void;
  onRemove: () => void;
}

function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  return (
    <div className="p-2 border border-gray-200 rounded bg-white">
      <div className="flex items-center justify-between mb-1">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-xs text-gray-900 line-clamp-1">
            {item.description}
          </h3>
          <div className="flex items-center gap-1">
            {/* <Badge variant="outline" className="text-xs px-1 py-0">
              {item.category}
            </Badge> */}
            {item.sku && (
              <span className="text-xs text-gray-500">{item.sku}</span>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-5 h-5 p-0 text-gray-400 hover:text-red-500"
          onClick={onRemove}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="w-5 h-5 p-0"
            onClick={() => onUpdateQuantity(item.qty - 1)}
            disabled={item.qty <= 1}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="w-6 text-center text-xs font-medium">
            {item.qty}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="w-5 h-5 p-0"
            onClick={() => onUpdateQuantity(item.qty + 1)}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-gray-900">
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

  const form = useForm<CreateSalesOrderDto>({
    resolver: zodResolver(CreateSalesOrderSchema),
    defaultValues: {
      status: "draft",
      customerId: 0,
      customerName: "",
      salesPersonId: 0,
      salesPersonName: "",
      subtotal: "0.00",
      taxAmount: "0.00",
      discountAmount: "0.00",
      totalAmount: "0.00",
      paymentMethod: "cash",
      paymentStatus: "no-payment",
      notes: "",
      priority: "medium",
      paymentTerms: "immediate",
      dueDate: undefined,
      deliveryDate: undefined,
      completedDate: undefined,
      items: [],
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
  const salesPersonId = formData.salesPersonId;
  const salesPersonName = formData.salesPersonName;
  const paymentMethod = formData.paymentMethod;
  const paymentStatus = formData.paymentStatus;
  const notes = formData.notes;
  const priority = formData.priority;
  const paymentTerms = formData.paymentTerms;
  const dueDate = formData.dueDate;
  const deliveryDate = formData.deliveryDate;
  const discountAmount = Number.parseFloat(formData.discountAmount) || 0;
  const status = formData.status;

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
    form.reset();
    setApplyTax(true);
  };

  const onSubmit = async (data: CreateSalesOrderDto) => {
    try {
      console.log(data);
      const response = await fetch("http://localhost:5005/api/v1/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        crendentials: "include",
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

      // Show success message (you can add a toast notification here)
      toast.success(result.message);
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(error.message);
    }
  };

  // Mock data
  const customers: Customer[] = [
    {
      id: 1,
      name: "Fatima Mohammed",
      phone: "+971 50 123 4567",
      email: "fatima.m@example.com",
      loyaltyTier: "gold",
      address: "Dubai Marina, UAE",
    },
    {
      id: 2,
      name: "Ahmed Al Mansouri",
      phone: "+971 55 987 6543",
      email: "ahmed.m@example.com",
      loyaltyTier: "silver",
      address: "Business Bay, Dubai",
    },
    {
      id: 3,
      name: "Layla Khan",
      phone: "+971 52 456 7890",
      email: "layla.k@example.com",
      loyaltyTier: "standard",
      address: "Jumeirah, Dubai",
    },
  ];

  const { data: staff = [], isLoading: staffLoading } = useQuery({
    queryFn: ["staffs"],
    queryFn: async () => {
      const response = await fetch(
        "http://localhost:5005/api/v1/list/sales-person",
        {
          headers: {
            "Content-Type": "application/json",
          },
          crendentials: "include",
        }
      );
      const json = await response.json();
      if (!response.ok) {
        toast.error("Failed to fetch sales person list");
      }
      return json;
    },
  });

  const products = [
    {
      category: "Men",
      items: [
        {
          id: 1,
          name: "Premium Kandura",
          price: 450,
          sku: "KAN-001",
          image: "/placeholder.svg?height=50&width=50&text=KAN",
        },
        {
          id: 2,
          name: "Standard Kandura",
          price: 350,
          sku: "KAN-002",
          image: "/placeholder.svg?height=50&width=50&text=KAN",
        },
        {
          id: 3,
          name: "Formal Thobe",
          price: 520,
          sku: "THB-001",
          image: "/placeholder.svg?height=50&width=50&text=THB",
        },
        {
          id: 4,
          name: "Casual Kandura",
          price: 280,
          sku: "KAN-003",
          image: "/placeholder.svg?height=50&width=50&text=KAN",
        },
      ],
    },
    {
      category: "Women",
      items: [
        {
          id: 5,
          name: "Premium Abaya",
          price: 550,
          sku: "ABY-001",
          image: "/placeholder.svg?height=50&width=50&text=ABY",
        },
        {
          id: 6,
          name: "Standard Abaya",
          price: 350,
          sku: "ABY-002",
          image: "/placeholder.svg?height=50&width=50&text=ABY",
        },
        {
          id: 7,
          name: "Designer Abaya",
          price: 750,
          sku: "ABY-003",
          image: "/placeholder.svg?height=50&width=50&text=ABY",
        },
        {
          id: 8,
          name: "Casual Abaya",
          price: 280,
          sku: "ABY-004",
          image: "/placeholder.svg?height=50&width=50&text=ABY",
        },
      ],
    },
    {
      category: "Junior",
      items: [
        {
          id: 9,
          name: "Kids Kandura",
          price: 180,
          sku: "JKN-001",
          image: "/placeholder.svg?height=50&width=50&text=JKN",
        },
        {
          id: 10,
          name: "Kids Abaya",
          price: 200,
          sku: "JAB-001",
          image: "/placeholder.svg?height=50&width=50&text=JAB",
        },
        {
          id: 11,
          name: "Teen Thobe",
          price: 250,
          sku: "JTH-001",
          image: "/placeholder.svg?height=50&width=50&text=JTH",
        },
      ],
    },
    {
      category: "Accessories",
      items: [
        {
          id: 12,
          name: "Silk Scarf",
          price: 120,
          sku: "SCF-001",
          image: "/placeholder.svg?height=50&width=50&text=SCF",
        },
        {
          id: 13,
          name: "Prayer Beads",
          price: 85,
          sku: "PBD-001",
          image: "/placeholder.svg?height=50&width=50&text=PBD",
        },
        {
          id: 14,
          name: "Traditional Belt",
          price: 95,
          sku: "BLT-001",
          image: "/placeholder.svg?height=50&width=50&text=BLT",
        },
      ],
    },
    {
      category: "Fabrics",
      items: [
        {
          id: 15,
          name: "Premium Cotton",
          price: 45,
          sku: "CTN-001",
          image: "/placeholder.svg?height=50&width=50&text=CTN",
        },
        {
          id: 16,
          name: "Silk Fabric",
          price: 85,
          sku: "SLK-001",
          image: "/placeholder.svg?height=50&width=50&text=SLK",
        },
        {
          id: 17,
          name: "Linen Blend",
          price: 55,
          sku: "LNN-001",
          image: "/placeholder.svg?height=50&width=50&text=LNN",
        },
      ],
    },
    {
      category: "Services",
      items: [
        {
          id: 18,
          name: "Alteration Service",
          price: 100,
          sku: "ALT-001",
          image: "/placeholder.svg?height=50&width=50&text=ALT",
        },
        {
          id: 19,
          name: "Embroidery Service",
          price: 150,
          sku: "EMB-001",
          image: "/placeholder.svg?height=50&width=50&text=EMB",
        },
        {
          id: 20,
          name: "Express Service",
          price: 50,
          sku: "EXP-001",
          image: "/placeholder.svg?height=50&width=50&text=EXP",
        },
        {
          id: 21,
          name: "Custom Fitting",
          price: 200,
          sku: "FIT-001",
          image: "/placeholder.svg?height=50&width=50&text=FIT",
        },
      ],
    },
  ];

  const selectedCustomer = customerId
    ? customers.find((c) => c.id === customerId)
    : null;
  const selectedStaff = salesPersonId
    ? staff.find((s) => s.id === salesPersonId)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Compact Professional Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              POS Terminal
            </h1>
            <p className="text-xs text-gray-500">Create sales order</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor(priority)}>
              {priority} priority
            </Badge>
            <Badge className={getStatusColor(status)}>{status}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
            <Save className="w-3 h-3 mr-1" />
            Save Draft
          </Button>
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Hold Order
          </Button>
          <Button size="sm" className="h-8 px-3 text-xs">
            <ShoppingBag className="w-3 h-3 mr-1" />
            New Order
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-3 p-3 overflow-hidden">
        {/* Left Panel - Products & Details */}
        <div className="col-span-8 flex flex-col gap-3 overflow-hidden">
          {/* Products Section - Full Height minus Order Details */}
          <Card
            className="overflow-y-auto"
            style={{ height: "calc(100% - 200px)" }}
          >
            <CardHeader className="pb-2 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Products & Services
                </CardTitle>
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search products, SKU, or category..."
                    className="pl-9 h-8 text-sm"
                    value={""}
                    onChange={(e) => {}}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <Tabs defaultValue="men" className="h-full flex flex-col">
                <TabsList className="m-3 mb-0 w-fit">
                  {products.map((category) => (
                    <TabsTrigger
                      key={category.category}
                      value={category.category.toLowerCase()}
                      className="text-xs px-3 py-1"
                    >
                      {category.category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {products.map((category) => (
                  <TabsContent
                    key={category.category}
                    value={category.category.toLowerCase()}
                    className="flex-1 overflow-hidden m-0 h-full"
                  >
                    <ScrollArea className="h-full">
                      <div className="p-3 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                        {category.items
                          .filter(
                            (item) =>
                              "" === "" ||
                              item.name
                                .toLowerCase()
                                .includes("".toLowerCase()) ||
                              item.sku
                                ?.toLowerCase()
                                .includes("".toLowerCase()) ||
                              category.category
                                .toLowerCase()
                                .includes("".toLowerCase())
                          )
                          .map((item) => (
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

          {/* Order Details - Fixed Height */}
          <Card className="flex-shrink-0 h-48">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-4 gap-3 mb-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-700">
                    Customer *
                  </Label>
                  <Select
                    value={customerId?.toString() || ""}
                    onValueChange={(value) => {
                      const id = Number.parseInt(value);
                      setValue("customerId", id);
                      const customer = customers.find((c) => c.id === id);
                      setValue("customerName", customer?.name || "");
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem
                          key={customer.id}
                          value={customer.id.toString()}
                        >
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3" />
                            <span>{customer.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-700">
                    Salesperson *
                  </Label>
                  <Select
                    value={salesPersonId?.toString() || ""}
                    onValueChange={(value) => {
                      const id = Number.parseInt(value);
                      setValue("salesPersonId", id);
                      const person = staff.find((s) => s.id === id);
                      setValue("salesPersonName", person?.name || "");
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select salesperson">
                        {salesPersonId
                          ? staff.find((s) => s.id === salesPersonId)?.name
                          : "Select salesperson"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {staff.length === 0
                        ? "No sales person found"
                        : staff.map((person) => (
                            <SelectItem
                              key={person.id}
                              value={person.id.toString()}
                            >
                              <div className="flex items-center gap-2">
                                <User className="w-3 h-3" />
                                <div>
                                  <div className="font-medium">
                                    {person.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {person.phone}
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-700">
                    Priority
                  </Label>
                  <Select
                    value={priority}
                    onValueChange={(value: "low" | "medium" | "high") =>
                      setValue("priority", value)
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          Low Priority
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          Medium Priority
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          High Priority
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-700">
                    Status
                  </Label>
                  <Select
                    value={status}
                    onValueChange={(value: "draft" | "pending" | "confirmed") =>
                      setValue("status", value)
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-700">
                    Payment Terms
                  </Label>
                  <Select
                    value={paymentTerms}
                    onValueChange={(value) => setValue("paymentTerms", value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="net-7">Net 7 days</SelectItem>
                      <SelectItem value="net-15">Net 15 days</SelectItem>
                      <SelectItem value="net-30">Net 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-700">
                    Due Date *
                  </Label>
                  <div className="relative">
                    <Input
                      type="date"
                      {...register("dueDate", { valueAsDate: true })}
                      className="h-8 text-xs"
                    />
                    <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-700">
                    Delivery Date
                  </Label>
                  <div className="relative">
                    <Input
                      type="date"
                      {...register("deliveryDate", { valueAsDate: true })}
                      className="h-8 text-xs"
                    />
                    <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-700">
                    Payment Status
                  </Label>
                  <Select
                    value={paymentStatus}
                    onValueChange={(value: "no-payment" | "partial" | "paid") =>
                      setValue("paymentStatus", value)
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-payment">No Payment</SelectItem>
                      <SelectItem value="partial">Partial Payment</SelectItem>
                      <SelectItem value="paid">Fully Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Customer & Staff Info */}
              {(selectedCustomer || selectedStaff) && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {selectedCustomer && (
                    <div className="p-2 bg-blue-50 rounded border border-blue-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-blue-900">
                          Customer Info
                        </span>
                        {selectedCustomer.loyaltyTier !== "standard" && (
                          <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-300">
                            {selectedCustomer.loyaltyTier}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-xs text-blue-800">
                        <div>📞 {selectedCustomer.phone}</div>
                        <div>✉️ {selectedCustomer.email}</div>
                        {selectedCustomer.address && (
                          <div>📍 {selectedCustomer.address}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedStaff && (
                    <div className="p-2 bg-green-50 rounded border border-green-200">
                      <span className="text-xs font-medium text-green-900">
                        Salesperson Info
                      </span>
                      <div className="space-y-1 text-xs text-green-800">
                        <div>👤 {selectedStaff.role}</div>
                        <div>🏢 {selectedStaff.department}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Compact Cart */}
        <div className="col-span-4 flex flex-col overflow-hidden">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Order Summary
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {cart.length} item{cart.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </CardHeader>

            <ScrollArea className="flex-1">
              <div className="p-3">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32 text-center">
                    <ShoppingBag className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-xs text-gray-500 mb-1">Cart is empty</p>
                    <p className="text-xs text-gray-400">
                      Add products to start
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cart.map((item, index) => (
                      <CartItemCard
                        key={index}
                        item={item}
                        onUpdateQuantity={(qty) => updateQuantity(index, qty)}
                        onRemove={() => removeItem(index)}
                      />
                    ))}

                    <Separator className="my-3" />

                    {/* Compact Controls */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium">Discount</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={formData.discountAmount || ""}
                          onChange={(e) =>
                            setValue("discountAmount", e.target.value)
                          }
                          className="h-7 w-20 text-xs"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium">
                          Apply VAT (5%)
                        </Label>
                        <Switch
                          checked={applyTax}
                          onCheckedChange={setApplyTax}
                        />
                      </div>
                    </div>

                    {/* Professional Totals */}
                    <div className="space-y-1 p-2 bg-gray-50 rounded border">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">
                          AED {subtotal.toFixed(2)}
                        </span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Discount</span>
                          <span className="font-medium text-red-600">
                            - AED {discountAmount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">VAT (5%)</span>
                        <span className="font-medium">
                          AED {taxAmount.toFixed(2)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Total</span>
                        <span>AED {totalAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Order Notes</Label>
                      <Textarea
                        placeholder="Special instructions..."
                        value={notes}
                        onChange={(e) => setValue("notes", e.target.value)}
                        className="h-12 resize-none text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <CardFooter className="flex flex-col gap-2 border-t bg-gray-50/50 p-3">
              {/* Payment Method */}
              <div className="w-full space-y-1">
                <Label className="text-xs font-medium">Payment Method</Label>
                <div className="grid grid-cols-3 gap-1">
                  <Button
                    variant={paymentMethod === "card" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setValue("paymentMethod", "card")}
                    className="h-7 text-xs"
                  >
                    <CreditCard className="w-3 h-3 mr-1" />
                    Card
                  </Button>
                  <Button
                    variant={paymentMethod === "cash" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setValue("paymentMethod", "cash")}
                    className="h-7 text-xs"
                  >
                    <Banknote className="w-3 h-3 mr-1" />
                    Cash
                  </Button>
                  <Button
                    variant={paymentMethod === "mobile" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setValue("paymentMethod", "mobile")}
                    className="h-7 text-xs"
                  >
                    <Smartphone className="w-3 h-3 mr-1" />
                    Mobile
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="h-7 text-xs"
                >
                  Clear Cart
                </Button>
                <Button
                  disabled={
                    cart.length === 0 ||
                    !customerId ||
                    !salesPersonId ||
                    isSubmitting
                  }
                  className="h-7 text-xs"
                  onClick={handleSubmit(onSubmit)}
                >
                  {isSubmitting ? "Creating..." : "Create Order"}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full">
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Printer className="w-3 h-3 mr-1" />
                  Print
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Receipt className="w-3 h-3 mr-1" />
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
