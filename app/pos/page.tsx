"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  Smartphone,
  Scissors,
  User,
  BarChart4,
} from "lucide-react"

interface CartItem {
  id: string
  name: string
  type: "ready-made" | "custom" | "alteration" | "fabric"
  price: number
  quantity: number
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: "item1",
      name: "Kandura (Premium)",
      type: "ready-made",
      price: 450,
      quantity: 1,
    },
    {
      id: "item2",
      name: "Fabric - White Linen (2m)",
      type: "fabric",
      price: 120,
      quantity: 1,
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [selectedSalesperson, setSelectedSalesperson] = useState<string | null>(null)
  const [selectedTailor, setSelectedTailor] = useState<string | null>(null)

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const vat = subtotal * 0.05
  const total = subtotal + vat

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setCart(cart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: string) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const customers = [
    { id: "cust1", name: "Fatima Mohammed", image: "/frequency-modulation-spectrum.png" },
    { id: "cust2", name: "Ahmed Al Mansouri", image: "/abstract-am.png" },
    { id: "cust3", name: "Layla Khan", image: "/abstract-geometric-lk.png" },
    { id: "cust4", name: "Hassan Al Farsi", image: "/ha-characters.png" },
    { id: "cust5", name: "Sara Al Ameri", image: "/abstract-geometric-sa.png" },
  ]

  const staff = [
    { id: "staff1", name: "Mohammed Ali", role: "Salesperson", image: "/stylized-letter-ma.png" },
    { id: "staff2", name: "Aisha Mahmood", role: "Salesperson", image: "/abstract-am.png" },
    { id: "staff3", name: "Khalid Rahman", role: "Tailor", image: "/placeholder.svg?key=fnyb2" },
    { id: "staff4", name: "Fatima Zahra", role: "Tailor", image: "/abstract-fz.png" },
    { id: "staff5", name: "Yusuf Qasim", role: "Tailor", image: "/placeholder.svg?key=x4rnd" },
  ]

  const salespeople = staff.filter((s) => s.role === "Salesperson")
  const tailors = staff.filter((s) => s.role === "Tailor")

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Point of Sale</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Products</CardTitle>
                <div className="relative w-[300px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="ready-made">Ready-made</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                  <TabsTrigger value="fabrics">Fabrics</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <ProductCard
                    name="Kandura (Premium)"
                    price={450}
                    image="/placeholder.svg?key=ng1v2"
                    onAdd={() =>
                      setCart([
                        ...cart,
                        {
                          id: `item${Date.now()}`,
                          name: "Kandura (Premium)",
                          type: "ready-made",
                          price: 450,
                          quantity: 1,
                        },
                      ])
                    }
                  />
                  <ProductCard
                    name="Abaya (Standard)"
                    price={350}
                    image="/placeholder.svg?key=zgibz"
                    onAdd={() =>
                      setCart([
                        ...cart,
                        {
                          id: `item${Date.now()}`,
                          name: "Abaya (Standard)",
                          type: "ready-made",
                          price: 350,
                          quantity: 1,
                        },
                      ])
                    }
                  />
                  <ProductCard
                    name="Scarf (Silk)"
                    price={120}
                    image="/cozy-knit-scarf.png"
                    onAdd={() =>
                      setCart([
                        ...cart,
                        {
                          id: `item${Date.now()}`,
                          name: "Scarf (Silk)",
                          type: "ready-made",
                          price: 120,
                          quantity: 1,
                        },
                      ])
                    }
                  />
                  <ProductCard
                    name="Custom Kandura"
                    price={650}
                    image="/placeholder.svg?key=du4p4"
                    onAdd={() =>
                      setCart([
                        ...cart,
                        {
                          id: `item${Date.now()}`,
                          name: "Custom Kandura",
                          type: "custom",
                          price: 650,
                          quantity: 1,
                        },
                      ])
                    }
                  />
                  <ProductCard
                    name="Custom Abaya"
                    price={550}
                    image="/placeholder.svg?height=100&width=100&query=custom+abaya"
                    onAdd={() =>
                      setCart([
                        ...cart,
                        {
                          id: `item${Date.now()}`,
                          name: "Custom Abaya",
                          type: "custom",
                          price: 550,
                          quantity: 1,
                        },
                      ])
                    }
                  />
                  <ProductCard
                    name="Alteration Service"
                    price={100}
                    image="/placeholder.svg?height=100&width=100&query=alteration"
                    onAdd={() =>
                      setCart([
                        ...cart,
                        {
                          id: `item${Date.now()}`,
                          name: "Alteration Service",
                          type: "alteration",
                          price: 100,
                          quantity: 1,
                        },
                      ])
                    }
                  />
                  <ProductCard
                    name="White Linen (per meter)"
                    price={60}
                    image="/placeholder.svg?height=100&width=100&query=white+fabric"
                    onAdd={() =>
                      setCart([
                        ...cart,
                        {
                          id: `item${Date.now()}`,
                          name: "White Linen (per meter)",
                          type: "fabric",
                          price: 60,
                          quantity: 1,
                        },
                      ])
                    }
                  />
                  <ProductCard
                    name="Black Cotton (per meter)"
                    price={45}
                    image="/placeholder.svg?height=100&width=100&query=black+fabric"
                    onAdd={() =>
                      setCart([
                        ...cart,
                        {
                          id: `item${Date.now()}`,
                          name: "Black Cotton (per meter)",
                          type: "fabric",
                          price: 45,
                          quantity: 1,
                        },
                      ])
                    }
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer & Staff</CardTitle>
              <CardDescription>Select customer and assign staff</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Customer</label>
                  <div className="grid grid-cols-1 gap-2">
                    <Select value={selectedCustomer || ""} onValueChange={setSelectedCustomer}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={customer.image || "/placeholder.svg"} alt={customer.name} />
                                <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {customer.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <User className="mr-2 h-4 w-4" />
                      Add New Customer
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Salesperson</label>
                  <Select value={selectedSalesperson || ""} onValueChange={setSelectedSalesperson}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select salesperson" />
                    </SelectTrigger>
                    <SelectContent>
                      {salespeople.map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={person.image || "/placeholder.svg"} alt={person.name} />
                              <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {person.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {cart.some((item) => item.type === "custom" || item.type === "alteration") && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Assign Tailor</label>
                    <Select value={selectedTailor || ""} onValueChange={setSelectedTailor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tailor" />
                      </SelectTrigger>
                      <SelectContent>
                        {tailors.map((tailor) => (
                          <SelectItem key={tailor.id} value={tailor.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={tailor.image || "/placeholder.svg"} alt={tailor.name} />
                                <AvatarFallback>{tailor.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {tailor.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Cart</span>
                <Badge variant="outline" className="text-sm">
                  {cart.length} {cart.length === 1 ? "item" : "items"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2">Your cart is empty</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <Badge variant="outline" className="mt-1">
                              {item.type === "ready-made" && "Ready-made"}
                              {item.type === "custom" && "Custom"}
                              {item.type === "alteration" && "Alteration"}
                              {item.type === "fabric" && "Fabric"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                              <span className="sr-only">Decrease</span>
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                              <span className="sr-only">Increase</span>
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">AED {(item.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Subtotal</span>
                  <span>AED {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>VAT (5%)</span>
                  <span>AED {vat.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>AED {total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-2 w-full">
                <Button variant="outline" className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Card
                </Button>
                <Button variant="outline" className="w-full">
                  <Banknote className="mr-2 h-4 w-4" />
                  Cash
                </Button>
                <Button variant="outline" className="w-full">
                  <Smartphone className="mr-2 h-4 w-4" />
                  Mobile
                </Button>
              </div>
              <Button className="w-full" size="lg" disabled={cart.length === 0}>
                Complete Sale
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  <Scissors className="mr-2 h-4 w-4" />
                  Tailoring
                </Button>
                <Button variant="outline" className="justify-start">
                  <BarChart4 className="mr-2 h-4 w-4" />
                  Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface ProductCardProps {
  name: string
  price: number
  image: string
  onAdd: () => void
}

function ProductCard({ name, price, image, onAdd }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-square relative">
          <img src={image || "/placeholder.svg"} alt={name} className="object-cover w-full h-full" />
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm">{name}</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold">AED {price}</span>
            <Button size="sm" variant="ghost" onClick={onAdd}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
