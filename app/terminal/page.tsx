"use client";

import { useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  ShoppingBag,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  Smartphone,
  User,
  Printer,
  Receipt,
  Save,
  Clock,
  Percent,
  Ticket,
  X,
} from "lucide-react";
import Link from "next/link";

const priorities = ["Low", "Medium", "High", "Critical"];
interface CartItem {
  id: string;
  name: string;
  type: "ready-made" | "custom" | "alteration" | "fabric" | "service";
  price: number;
  quantity: number;
  discount?: number;
  notes?: string;
}

interface Customer {
  id: string;
  name: string;
  image?: string;
  phone: string;
  email: string;
  loyaltyTier?: "standard" | "silver" | "gold" | "platinum";
}

interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  description: string;
}

export default function POSTerminalPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedSalesperson, setSelectedSalesperson] = useState<string | null>(
    null
  );
  const [selectedTailor, setSelectedTailor] = useState<string | null>(null);
  const [applyTax, setApplyTax] = useState(true);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountType, setDiscountType] = useState<"percent" | "amount">(
    "percent"
  );
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "mobile"
  >("cash");
  const [notes, setNotes] = useState("");
  const [isRushOrder, setIsRushOrder] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponCode, setCouponCode] = useState("");

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const manualDiscount =
    discountType === "percent"
      ? (subtotal * discountPercent) / 100
      : discountAmount;
  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === "percentage"
      ? (subtotal * appliedCoupon.value) / 100
      : Math.min(appliedCoupon.value, subtotal)
    : 0;
  const totalDiscount = manualDiscount + couponDiscount;
  const afterDiscount = subtotal - totalDiscount;
  const vat = applyTax ? afterDiscount * 0.05 : 0;
  const total = afterDiscount + vat;

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const addItemToCart = (item: Omit<CartItem, "id" | "quantity">) => {
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.name === item.name
    );

    if (existingItemIndex > -1) {
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([
        ...cart,
        {
          id: `item${Date.now()}`,
          ...item,
          quantity: 1,
        },
      ]);
    }
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setSelectedSalesperson(null);
    setSelectedTailor(null);
    setDiscountPercent(0);
    setDiscountAmount(0);
    setNotes("");
    setIsRushOrder(false);
    setApplyTax(true);
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const customers: Customer[] = [
    {
      id: "cust1",
      name: "Fatima Mohammed",
      image: "/frequency-modulation-spectrum.png",
      phone: "+971 50 123 4567",
      email: "fatima.m@example.com",
      loyaltyTier: "gold",
    },
    {
      id: "cust2",
      name: "Ahmed Al Mansouri",
      image: "/abstract-am.png",
      phone: "+971 55 987 6543",
      email: "ahmed.m@example.com",
      loyaltyTier: "silver",
    },
    {
      id: "cust3",
      name: "Layla Khan",
      image: "/abstract-geometric-lk.png",
      phone: "+971 52 456 7890",
      email: "layla.k@example.com",
      loyaltyTier: "standard",
    },
    {
      id: "cust4",
      name: "Hassan Al Farsi",
      image: "/ha-characters.png",
      phone: "+971 54 321 0987",
      email: "hassan.f@example.com",
      loyaltyTier: "platinum",
    },
    {
      id: "cust5",
      name: "Sara Al Ameri",
      image: "/abstract-geometric-sa.png",
      phone: "+971 56 789 0123",
      email: "sara.a@example.com",
      loyaltyTier: "gold",
    },
  ];

  const staff = [
    {
      id: "staff1",
      name: "Mohammed Ali",
      role: "Salesperson",
      image: "/stylized-letter-ma.png",
    },
    {
      id: "staff2",
      name: "Aisha Mahmood",
      role: "Salesperson",
      image: "/abstract-am.png",
    },
    {
      id: "staff3",
      name: "Khalid Rahman",
      role: "Tailor",
      image: "/placeholder.svg?key=fnyb2",
    },
    {
      id: "staff4",
      name: "Fatima Zahra",
      role: "Tailor",
      image: "/abstract-fz.png",
    },
    {
      id: "staff5",
      name: "Yusuf Qasim",
      role: "Tailor",
      image: "/placeholder.svg?key=x4rnd",
    },
  ];

  const coupons: Coupon[] = [
    {
      id: "CPL-001",
      code: "WELCOME10",
      type: "percentage",
      value: 10,
      description: "10% off for new customers",
    },
    {
      id: "CPL-002",
      code: "SUMMER50",
      type: "fixed",
      value: 50,
      description: "AED 50 off on purchases above AED 500",
    },
    {
      id: "CPL-003",
      code: "RAMADAN20",
      type: "percentage",
      value: 20,
      description: "20% off during Ramadan",
    },
  ];

  const applyCoupon = () => {
    const coupon = coupons.find((c) => c.code === couponCode);
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponCode("");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const salespeople = staff.filter((s) => s.role === "Salesperson");
  const tailors = staff.filter((s) => s.role === "Tailor");

  const products: {
    category: string;
    items: {
      name: string;
      price: number;
      type: "ready-made" | "custom" | "alteration" | "fabric" | "service";
      image: string;
    }[];
  }[] = [
    {
      category: "Ready-made",
      items: [
        {
          name: "Kandura (Premium)",
          price: 450,
          type: "ready-made",
          image: "/placeholder.svg?key=ng1v2",
        },
        {
          name: "Kandura (Standard)",
          price: 350,
          type: "ready-made",
          image: "/placeholder.svg?key=ng1v2",
        },
        {
          name: "Abaya (Premium)",
          price: 550,
          type: "ready-made",
          image: "/placeholder.svg?key=zgibz",
        },
        {
          name: "Abaya (Standard)",
          price: 350,
          type: "ready-made",
          image: "/placeholder.svg?key=zgibz",
        },
        {
          name: "Scarf (Silk)",
          price: 120,
          type: "ready-made",
          image: "/cozy-knit-scarf.png",
        },
        {
          name: "Scarf (Cotton)",
          price: 80,
          type: "ready-made",
          image: "/cozy-knit-scarf.png",
        },
      ],
    },
    {
      category: "Custom",
      items: [
        {
          name: "Custom Kandura (Premium)",
          price: 650,
          type: "custom",
          image: "/placeholder.svg?key=du4p4",
        },
        {
          name: "Custom Kandura (Standard)",
          price: 550,
          type: "custom",
          image: "/placeholder.svg?key=du4p4",
        },
        {
          name: "Custom Abaya (Premium)",
          price: 750,
          type: "custom",
          image: "/placeholder.svg?key=d4uur",
        },
        {
          name: "Custom Abaya (Standard)",
          price: 550,
          type: "custom",
          image: "/placeholder.svg?key=5b7xm",
        },
      ],
    },
    {
      category: "Services",
      items: [
        {
          name: "Alteration - Kandura",
          price: 100,
          type: "alteration",
          image: "/placeholder.svg?key=2yv7k",
        },
        {
          name: "Alteration - Abaya",
          price: 120,
          type: "alteration",
          image: "/placeholder.svg?key=tk7du",
        },
        {
          name: "Embroidery Service",
          price: 150,
          type: "service",
          image: "/placeholder.svg?key=7rxn2",
        },
        {
          name: "Express Service Fee",
          price: 50,
          type: "service",
          image: "/placeholder.svg?key=d3k03",
        },
      ],
    },
    {
      category: "Fabrics",
      items: [
        {
          name: "White Linen (per meter)",
          price: 60,
          type: "fabric",
          image: "/placeholder.svg?key=6k1n3",
        },
        {
          name: "Black Cotton (per meter)",
          price: 45,
          type: "fabric",
          image: "/placeholder.svg?key=xezuv",
        },
        {
          name: "Premium Silk (per meter)",
          price: 120,
          type: "fabric",
          image: "/placeholder.svg?key=8toom",
        },
        {
          name: "Wool Blend (per meter)",
          price: 80,
          type: "fabric",
          image: "/placeholder.svg?key=s4aoc",
        },
      ],
    },
  ];

  const selectedCustomerData = selectedCustomer
    ? customers.find((c) => c.id === selectedCustomer)
    : null;

  const [selectedPriority, setSelectedPriority] = useState("Low");
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">POS Terminal</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Pending
          </Button>
          <Button size="sm" asChild>
            <Link href="/terminal">
              <ShoppingBag className="mr-2 h-4 w-4" />
              New Sale
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        {/* Left side - Products & Customer */}
        <div className="lg:col-span-2 h-full overflow-hidden flex flex-col">
          <ScrollArea className="h-full pr-4">
            <Card className="mb-4">
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Products & Services
                  </CardTitle>
                  <div className="relative w-[250px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="pl-8 w-full h-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <Tabs defaultValue="ready-made" className="w-full">
                  <TabsList className="mb-3 w-full">
                    {products.map((category) => (
                      <TabsTrigger
                        key={category.category}
                        value={category.category
                          .toLowerCase()
                          .replace(/\s+/g, "-")}
                        className="text-xs"
                      >
                        {category.category}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {products.map((category) => (
                    <TabsContent
                      key={category.category}
                      value={category.category
                        .toLowerCase()
                        .replace(/\s+/g, "-")}
                      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-0"
                    >
                      {category.items.map((item, index) => (
                        <ProductCard
                          key={`${category.category}-${index}`}
                          name={item.name}
                          price={item.price}
                          image={item.image}
                          onAdd={() => addItemToCart(item)}
                        />
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </ScrollArea>
        </div>

        {/* Right side - Cart */}
        <div className="h-full overflow-hidden flex flex-col">
          <Card className="h-full flex flex-col">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Cart</span>
                <Badge variant="outline" className="text-xs">
                  {cart.length} {cart.length === 1 ? "item" : "items"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <ScrollArea className="flex-grow px-4 py-2">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground/50" />
                  <p className="mt-2 text-sm">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between border-b pb-2"
                    >
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="font-medium text-sm">{item.name}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 -mt-1 -mr-1"
                            onClick={() => removeItem(item.id)}
                          >
                            <X className="h-3 w-3 text-muted-foreground" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.type === "ready-made" && "Ready-made"}
                            {item.type === "custom" && "Custom"}
                            {item.type === "alteration" && "Alteration"}
                            {item.type === "fabric" && "Fabric"}
                            {item.type === "service" && "Service"}
                          </Badge>
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-5 w-5 rounded-full"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="h-2.5 w-2.5" />
                              <span className="sr-only">Decrease</span>
                            </Button>
                            <span className="w-6 text-center text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-5 w-5 rounded-full"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-2.5 w-2.5" />
                              <span className="sr-only">Increase</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-2 text-sm font-medium">
                        AED {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <div className="mt-4 space-y-3">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="discounts" className="border-b-0">
                      <AccordionTrigger className="py-2 text-xs font-medium">
                        <div className="flex items-center">
                          <Percent className="mr-2 h-3.5 w-3.5" />
                          Discounts & Coupons
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pt-1">
                          <div className="space-y-2">
                            <Label htmlFor="discount-type" className="text-xs">
                              Manual Discount
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Select
                                value={discountType}
                                onValueChange={(value: "percent" | "amount") =>
                                  setDiscountType(value)
                                }
                              >
                                <SelectTrigger
                                  id="discount-type"
                                  className="h-8"
                                >
                                  <SelectValue placeholder="Discount Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="percent">
                                    Percentage (%)
                                  </SelectItem>
                                  <SelectItem value="amount">
                                    Fixed Amount (AED)
                                  </SelectItem>
                                </SelectContent>
                              </Select>

                              {discountType === "percent" ? (
                                <div className="flex items-center">
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    value={discountPercent || ""}
                                    onChange={(e) =>
                                      setDiscountPercent(Number(e.target.value))
                                    }
                                    min={0}
                                    max={100}
                                    className="h-8"
                                  />
                                  <span className="ml-2 text-xs">%</span>
                                </div>
                              ) : (
                                <Input
                                  type="number"
                                  placeholder="0.00"
                                  value={discountAmount || ""}
                                  onChange={(e) =>
                                    setDiscountAmount(Number(e.target.value))
                                  }
                                  min={0}
                                  max={subtotal}
                                  className="h-8"
                                />
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="coupon-code" className="text-xs">
                              Apply Coupon
                            </Label>
                            <div className="flex space-x-2">
                              <Input
                                id="coupon-code"
                                placeholder="Enter coupon code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="h-8"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 whitespace-nowrap"
                                onClick={applyCoupon}
                                disabled={!couponCode}
                              >
                                <Ticket className="mr-1 h-3 w-3" />
                                Apply
                              </Button>
                            </div>
                          </div>

                          {appliedCoupon && (
                            <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                              <div>
                                <div className="text-xs font-medium flex items-center">
                                  <Ticket className="mr-1 h-3 w-3" />
                                  {appliedCoupon.code}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {appliedCoupon.description}
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className="text-xs font-medium mr-2">
                                  -{" "}
                                  {appliedCoupon.type === "percentage"
                                    ? `${appliedCoupon.value}%`
                                    : `AED ${appliedCoupon.value}`}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5"
                                  onClick={removeCoupon}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>AED {subtotal.toFixed(2)}</span>
                    </div>

                    {manualDiscount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Manual Discount
                        </span>
                        <span className="text-red-500">
                          - AED {manualDiscount.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {couponDiscount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Coupon Discount
                        </span>
                        <span className="text-red-500">
                          - AED {couponDiscount.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">VAT (5%)</span>
                        <div className="flex items-center space-x-1">
                          <Switch
                            id="apply-tax"
                            checked={applyTax}
                            onCheckedChange={setApplyTax}
                            className="scale-75"
                          />
                        </div>
                      </div>
                      <span>AED {vat.toFixed(2)}</span>
                    </div>

                    <Separator />
                    <div className="flex items-center justify-between font-medium">
                      <span>Total</span>
                      <span>AED {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="text-xs font-medium mb-1 block">
                      Order Notes
                    </label>
                    <Input
                      placeholder="Add notes about this order..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              )}
                <div className="flex flex-col gap-4 mt-4">
                  <div>
                    <label className="text-xs font-medium mb-1 block">
                      Customer
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <Select
                        value={selectedCustomer || ""}
                        onValueChange={setSelectedCustomer}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage
                                    src={customer.image || "/placeholder.svg"}
                                    alt={customer.name}
                                  />
                                  <AvatarFallback>
                                    {customer.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                {customer.name}
                                {customer.loyaltyTier &&
                                  customer.loyaltyTier !== "standard" && (
                                    <Badge
                                      variant="outline"
                                      className="ml-1 text-xs capitalize"
                                    >
                                      {customer.loyaltyTier}
                                    </Badge>
                                  )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" className="h-8">
                        <User className="mr-2 h-3 w-3" />
                        <span className="text-xs">Add New Customer</span>
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1 block">
                      Salesperson
                    </label>
                    <Select
                      value={selectedSalesperson || ""}
                      onValueChange={setSelectedSalesperson}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select salesperson" />
                      </SelectTrigger>
                      <SelectContent>
                        {salespeople.map((person) => (
                          <SelectItem key={person.id} value={person.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage
                                  src={person.image || "/placeholder.svg"}
                                  alt={person.name}
                                />
                                <AvatarFallback>
                                  {person.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {person.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {cart.some(
                    (item) =>
                      item.type === "custom" || item.type === "alteration"
                  ) && (
                    <div>
                      <label className="text-xs font-medium mb-1 block">
                        Assign Tailor
                      </label>
                      <Select
                        value={selectedTailor || ""}
                        onValueChange={setSelectedTailor}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select tailor" />
                        </SelectTrigger>
                        <SelectContent>
                          {tailors.map((tailor) => (
                            <SelectItem key={tailor.id} value={tailor.id}>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage
                                    src={tailor.image || "/placeholder.svg"}
                                    alt={tailor.name}
                                  />
                                  <AvatarFallback>
                                    {tailor.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                {tailor.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-nowrap mr-4 font-medium  block">
                      Order priority
                    </label>
                    <div className="flex gap-1.5">
                      {priorities.map((priority) => (
                        <Button
                          size={"sm"}
                          key={priority}
                          variant={
                            selectedPriority === priority
                              ? "default"
                              : "outline"
                          }
                          className="text-xs font-medium"
                          onClick={() => setSelectedPriority(priority)}
                        >
                          {priority}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-nowrap mr-4 font-medium  block">
                      Shipping method (optional)
                    </label>
                    <div className="flex gap-1.5">
                      <Select>
                        <SelectTrigger className="w-full text-nowrap h-8">
                          <SelectValue placeholder="Select a shipping method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="express">Express</SelectItem>
                          <SelectItem value="customer pickup">
                            Customer pickup
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-nowrap mr-4 font-medium  block">
                      Payment terms
                    </label>
                    <div className="flex gap-1.5">
                      <Select>
                        <SelectTrigger id="paymentTerms" className="h-8" >
                          <SelectValue placeholder="Select payment terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Net 30">Net 30</SelectItem>
                          <SelectItem value="Net 15">Net 15</SelectItem>
                          <SelectItem value="Net 7">Net 7</SelectItem>
                          <SelectItem value="Due on Receipt">
                            Due on Receipt
                          </SelectItem>
                          <SelectItem value="Advance Payment">
                            Advance Payment
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {selectedCustomerData && (
                  <div className="mt-3 bg-muted/40 rounded-md p-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium">
                        Customer Details
                      </span>
                      {selectedCustomerData.loyaltyTier &&
                        selectedCustomerData.loyaltyTier !== "standard" && (
                          <Badge
                            className={`text-xs ${
                              selectedCustomerData.loyaltyTier === "silver"
                                ? "bg-gray-200 text-gray-800"
                                : selectedCustomerData.loyaltyTier === "gold"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {selectedCustomerData.loyaltyTier.toUpperCase()}{" "}
                            MEMBER
                          </Badge>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div>
                        <span className="text-muted-foreground">Phone:</span>{" "}
                        <span>{selectedCustomerData.phone}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email:</span>{" "}
                        <span>{selectedCustomerData.email}</span>
                      </div>
                    </div>
                  </div>
                )}
            </ScrollArea>
            <CardFooter className="flex flex-col gap-3 p-4 border-t mt-auto">
              <div className="grid grid-cols-3 gap-2 w-full">
                <Button
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  className="w-full h-9"
                  onClick={() => setPaymentMethod("card")}
                >
                  <CreditCard className="mr-2 h-3.5 w-3.5" />
                  <span className="text-xs">Card</span>
                </Button>
                <Button
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  className="w-full h-9"
                  onClick={() => setPaymentMethod("cash")}
                >
                  <Banknote className="mr-2 h-3.5 w-3.5" />
                  <span className="text-xs">Cash</span>
                </Button>
                <Button
                  variant={paymentMethod === "mobile" ? "default" : "outline"}
                  className="w-full h-9"
                  onClick={() => setPaymentMethod("mobile")}
                >
                  <Smartphone className="mr-2 h-3.5 w-3.5" />
                  <span className="text-xs">Mobile</span>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button
                  variant="outline"
                  className="w-full h-9"
                  onClick={clearCart}
                >
                  <span className="text-xs">Clear</span>
                </Button>
                <Button className="w-full h-9" disabled={cart.length === 0}>
                  <span className="text-xs">Complete Sale</span>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button variant="outline" className="w-full h-9">
                  <Printer className="mr-2 h-3.5 w-3.5" />
                  <span className="text-xs">Print</span>
                </Button>
                <Button variant="outline" className="w-full h-9">
                  <Receipt className="mr-2 h-3.5 w-3.5" />
                  <span className="text-xs">Email</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
          
        </div>
      </div>
    </div>
  );
}

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  onAdd: () => void;
}

function ProductCard({ name, price, image, onAdd }: ProductCardProps) {
  return (
    <Card
      className="overflow-hidden scale-95 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onAdd}
    >
      <CardContent className="p-0">
        <div className="aspect-square relative">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-2">
          <h3 className="font-medium text-xs line-clamp-2">{name}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="font-bold text-xs">AED {price}</span>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}