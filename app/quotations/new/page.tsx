"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  image?: string
  type: "individual" | "business"
  taxId?: string
}

interface Product {
  id: string
  name: string
  description: string
  category: "ready-made" | "custom" | "alteration" | "fabric" | "accessory"
  basePrice: number
  image?: string
  inStock: boolean
  customizable: boolean
}

interface QuotationItem {
  id: string
  productId?: string
  name: string
  description: string
  category: string
  quantity: number
  unitPrice: number
  discount: number
  discountType: "amount" | "percentage"
  total: number
  notes?: string
  customizations?: {
    measurements?: Record<string, string>
    fabric?: string
    color?: string
    embroidery?: string
    rushOrder?: boolean
  }
}

interface QuotationTemplate {
  id: string
  name: string
  items: Omit<QuotationItem, "id" | "total">[]
  terms: string
  validityDays: number
}

export default function NewQuotationPage() {
  const [customers] = useState<Customer[]>([
    {
      id: "cust_001",
      name: "Fatima Mohammed",
      email: "fatima.m@example.com",
      phone: "+971 50 123 4567",
      address: "123 Al Wasl Road, Dubai, UAE",
      type: "individual",
      image: "/frequency-modulation-spectrum.png",
    },
    {
      id: "cust_002",
      name: "Ahmed Al Mansouri",
      email: "ahmed.m@example.com",
      phone: "+971 55 987 6543",
      address: "456 Sheikh Zayed Road, Dubai, UAE",
      type: "business",
      taxId: "TRN123456789",
      image: "/abstract-am.png",
    },
    {
      id: "cust_003",
      name: "Mariam Hassan",
      email: "mariam.h@example.com",
      phone: "+971 52 111 2222",
      address: "789 Jumeirah Beach Road, Dubai, UAE",
      type: "individual",
    },
  ])

  const [products] = useState<Product[]>([
    {
      id: "prod_001",
      name: "Premium Kandura",
      description: "High-quality traditional kandura with premium fabric",
      category: "custom",
      basePrice: 650,
      inStock: true,
      customizable: true,
      image: "/stylized-letter-ma.png",
    },
    {
      id: "prod_002",
      name: "Classic Abaya",
      description: "Elegant black abaya with modern cut",
      category: "ready-made",
      basePrice: 450,
      inStock: true,
      customizable: false,
      image: "/abstract-geometric-lk.png",
    },
    {
      id: "prod_003",
      name: "Alteration Service",
      description: "Professional alteration services",
      category: "alteration",
      basePrice: 100,
      inStock: true,
      customizable: true,
    },
    {
      id: "prod_004",
      name: "Premium Silk Fabric",
      description: "High-quality silk fabric per meter",
      category: "fabric",
      basePrice: 85,
      inStock: true,
      customizable: false,
    },
  ])

  const [templates] = useState<QuotationTemplate[]>([
    {
      id: "temp_001",
      name: "Custom Kandura Package",
      items: [
        {
          productId: "prod_001",
          name: "Premium Kandura",
          description: "Custom kandura with premium fabric and embroidery",
          category: "custom",
          quantity: 1,
          unitPrice: 650,
          discount: 0,
          discountType: "amount",
          notes: "Includes custom measurements and fitting",
        },
        {
          name: "Premium Finishing",
          description: "Hand-finished seams and custom buttons",
          category: "custom",
          quantity: 1,
          unitPrice: 100,
          discount: 0,
          discountType: "amount",
        },
      ],
      terms: "50% deposit required to start production. Delivery in 2-3 weeks. Final fitting included.",
      validityDays: 30,
    },
  ])

  // Form state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [quotationNumber, setQuotationNumber] = useState("")
  const [items, setItems] = useState<QuotationItem[]>([])
  const [notes, setNotes] = useState("")
  const [terms, setTerms] = useState("Payment terms: 50% deposit required, balance due upon completion.")
  const [validUntil, setValidUntil] = useState<Date>()
  const [taxRate, setTaxRate] = useState(5)
  const [globalDiscount, setGlobalDiscount] = useState(0)
  const [globalDiscountType, setGlobalDiscountType] = useState<"amount" | "percentage">("percentage")

  // Dialog states
  const [showCustomerDialog, setShowCustomerDialog] = useState(false)
  const [showProductDialog, setShowProductDialog] = useState(false)
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [showCustomizationDialog, setShowCustomizationDialog] = useState(false)
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null)

  // Search states
  const [customerSearch, setCustomerSearch] = useState("")
  const [productSearch, setProductSearch] = useState("")

  // Generate quotation number on mount
  useEffect(() => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    setQuotationNumber(`QUO-${year}${month}${day}-${random}`)

    // Set default validity (30 days from now)
    const defaultValidity = new Date()
    defaultValidity.setDate(defaultValidity.getDate() + 30)
    setValidUntil(defaultValidity)
  }, [])

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const discountAmount = globalDiscountType === "percentage" ? (subtotal * globalDiscount) / 100 : globalDiscount
  const afterDiscount = subtotal - discountAmount
  const taxAmount = (afterDiscount * taxRate) / 100
  const total = afterDiscount + taxAmount

  const addItem = (product?: Product) => {
    const newItem: QuotationItem = {
      id: `item_${Date.now()}`,
      productId: product?.id,
      name: product?.name || "",
      description: product?.description || "",
      category: product?.category || "custom",
      quantity: 1,
      unitPrice: product?.basePrice || 0,
      discount: 0,
      discountType: "amount",
      total: product?.basePrice || 0,
      notes: "",
    }
    setItems([...items, newItem])
    setShowProductDialog(false)
  }

  const updateItem = (index: number, updates: Partial<QuotationItem>) => {
    const updatedItems = [...items]
    const item = { ...updatedItems[index], ...updates }

    // Recalculate total
    const discountAmount =
      item.discountType === "percentage" ? (item.quantity * item.unitPrice * item.discount) / 100 : item.discount
    item.total = item.quantity * item.unitPrice - discountAmount

    updatedItems[index] = item
    setItems(updatedItems)
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const applyTemplate = (template: QuotationTemplate) => {
    const templateItems: QuotationItem[] = template.items.map((item, index) => ({
      id: `item_${Date.now()}_${index}`,
      ...item,
      total:
        item.quantity * item.unitPrice -
        (item.discountType === "percentage" ? (item.quantity * item.unitPrice * item.discount) / 100 : item.discount),
    }))

    setItems(templateItems)
    setTerms(template.terms)

    const validity = new Date()
    validity.setDate(validity.getDate() + template.validityDays)
    setValidUntil(validity)

    setShowTemplateDialog(false)
  }

  const saveQuotation = (status: "draft" | "sent") => {
    if (!selectedCustomer) {
      alert("Please select a customer")
      return
    }

    if (items.length === 0) {
      alert("Please add at least one item")
      return
    }

    const quotationData = {
      number: quotationNumber,
      customer: selectedCustomer,
      items,
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total,
      validUntil,
      status,
      notes,
      terms,
      createdAt: new Date(),
    }

    console.log("Saving quotation:", quotationData)

    if (status === "sent") {
      alert(`Quotation ${quotationNumber} sent to ${selectedCustomer.email}`)
    } else {
      alert(`Quotation ${quotationNumber} saved as draft`)
    }

    // In a real app, you would navigate back to the quotations list
    // router.push("/sales/quotations")
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.phone.includes(customerSearch),
  )

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.description.toLowerCase().includes(productSearch.toLowerCase()),
  )

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
            <h1 className="text-3xl font-bold tracking-tight">New Quotation</h1>
            <p className="text-muted-foreground">Create a new sales quotation for a customer</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowTemplateDialog(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Use Template
          </Button>
          <Button variant="outline" onClick={() => saveQuotation("draft")}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={() => saveQuotation("sent")}>
            <Send className="mr-2 h-4 w-4" />
            Send Quotation
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
              <CardDescription>Basic information about this quotation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quotation-number">Quotation Number</Label>
                  <Input
                    id="quotation-number"
                    value={quotationNumber}
                    onChange={(e) => setQuotationNumber(e.target.value)}
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
                          !validUntil && "text-muted-foreground",
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
                <Button variant="outline" size="sm" onClick={() => setShowCustomerDialog(true)}>
                  <User className="mr-2 h-4 w-4" />
                  {selectedCustomer ? "Change Customer" : "Select Customer"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCustomer ? (
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedCustomer.image || "/placeholder.svg"} alt={selectedCustomer.name} />
                    <AvatarFallback>{selectedCustomer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{selectedCustomer.name}</h3>
                      <Badge variant="outline">{selectedCustomer.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                    <p className="text-sm text-muted-foreground">{selectedCustomer.phone}</p>
                    <p className="text-sm text-muted-foreground">{selectedCustomer.address}</p>
                    {selectedCustomer.taxId && (
                      <p className="text-sm text-muted-foreground">Tax ID: {selectedCustomer.taxId}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No customer selected</p>
                  <p className="text-sm">Click "Select Customer" to choose a customer</p>
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
                      <TableHead>Item</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Discount</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <Input
                              value={item.name}
                              onChange={(e) => updateItem(index, { name: e.target.value })}
                              className="font-medium mb-1"
                              placeholder="Item name"
                            />
                            <Input
                              value={item.description}
                              onChange={(e) => updateItem(index, { description: e.target.value })}
                              className="text-sm"
                              placeholder="Description"
                            />
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                              {item.productId && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedItemIndex(index)
                                    setShowCustomizationDialog(true)
                                  }}
                                >
                                  <Settings className="h-3 w-3 mr-1" />
                                  Customize
                                </Button>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, { quantity: Number(e.target.value) })}
                            className="w-16 text-center"
                            min="1"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(index, { unitPrice: Number(e.target.value) })}
                            className="w-24 text-right"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={item.discount}
                              onChange={(e) => updateItem(index, { discount: Number(e.target.value) })}
                              className="w-16 text-right"
                              step="0.01"
                            />
                            <Select
                              value={item.discountType}
                              onValueChange={(value: "amount" | "percentage") =>
                                updateItem(index, { discountType: value })
                              }
                            >
                              <SelectTrigger className="w-16">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="amount">AED</SelectItem>
                                <SelectItem value="percentage">%</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">AED {item.total.toFixed(2)}</TableCell>
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
                  <p className="text-sm">Click "Add Item" to start building your quotation</p>
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
                      onChange={(e) => setGlobalDiscount(Number(e.target.value))}
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
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    step="0.1"
                    min="0"
                    max="100"
                  />
                  <div className="flex justify-between text-sm">
                    <span>Tax ({taxRate}%):</span>
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
              <Button variant="outline" className="w-full justify-start" onClick={() => setShowTemplateDialog(true)}>
                <FileText className="mr-2 h-4 w-4" />
                Load Template
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Copy className="mr-2 h-4 w-4" />
                Copy from Previous
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
            <DialogTitle>Select Customer</DialogTitle>
            <DialogDescription>Choose a customer for this quotation</DialogDescription>
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
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    setSelectedCustomer(customer)
                    setShowCustomerDialog(false)
                  }}
                >
                  <Avatar>
                    <AvatarImage src={customer.image || "/placeholder.svg"} alt={customer.name} />
                    <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{customer.name}</h3>
                      <Badge variant="outline">{customer.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomerDialog(false)}>
              Cancel
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Selection Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add Product/Service</DialogTitle>
            <DialogDescription>Select a product or service to add to the quotation</DialogDescription>
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
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50"
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
                      {product.customizable && <Badge variant="secondary">Customizable</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    <p className="text-sm font-medium">AED {product.basePrice.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProductDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => addItem()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Custom Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Selection Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Load Template</DialogTitle>
            <DialogDescription>Choose a template to quickly populate the quotation</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {templates.map((template) => (
              <div
                key={template.id}
                className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50"
                onClick={() => applyTemplate(template)}
              >
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {template.items.length} items • Valid for {template.validityDays} days
                </p>
                <div className="space-y-1">
                  {template.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span>AED {item.unitPrice.toFixed(2)}</span>
                    </div>
                  ))}
                  {template.items.length > 3 && (
                    <p className="text-xs text-muted-foreground">+{template.items.length - 3} more items</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Customization Dialog */}
      <Dialog open={showCustomizationDialog} onOpenChange={setShowCustomizationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Item Customization</DialogTitle>
            <DialogDescription>{selectedItemIndex !== null && items[selectedItemIndex]?.name}</DialogDescription>
          </DialogHeader>
          {selectedItemIndex !== null && (
            <div className="space-y-4">
              <div>
                <Label>Special Instructions</Label>
                <Textarea
                  value={items[selectedItemIndex]?.notes || ""}
                  onChange={(e) => updateItem(selectedItemIndex, { notes: e.target.value })}
                  placeholder="Special instructions for this item..."
                />
              </div>

              {items[selectedItemIndex]?.category === "custom" && (
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
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCustomizationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowCustomizationDialog(false)}>Save Customization</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
