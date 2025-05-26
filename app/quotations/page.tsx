"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface QuotationItem {
  id: string
  name: string
  description: string
  quantity: number
  unitPrice: number
  discount: number
  total: number
  category: "ready-made" | "custom" | "alteration" | "fabric"
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  image?: string
}

interface Quotation {
  id: string
  number: string
  customer: Customer
  items: QuotationItem[]
  subtotal: number
  discount: number
  tax: number
  total: number
  validUntil: Date
  status: "draft" | "sent" | "accepted" | "rejected" | "expired" | "converted"
  notes: string
  terms: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  convertedToSale?: string
  followUpDate?: Date
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([
    {
      id: "quot_001",
      number: "QUO-2024-001",
      customer: {
        id: "cust_001",
        name: "Fatima Mohammed",
        email: "fatima.m@example.com",
        phone: "+971 50 123 4567",
        address: "123 Al Wasl Road, Dubai, UAE",
        image: "/frequency-modulation-spectrum.png",
      },
      items: [
        {
          id: "item_001",
          name: "Custom Kandura",
          description: "Premium white kandura with custom embroidery",
          quantity: 2,
          unitPrice: 650,
          discount: 50,
          total: 1250,
          category: "custom",
        },
        {
          id: "item_002",
          name: "Alteration Service",
          description: "Hemming and sleeve adjustment",
          quantity: 1,
          unitPrice: 100,
          discount: 0,
          total: 100,
          category: "alteration",
        },
      ],
      subtotal: 1350,
      discount: 50,
      tax: 65,
      total: 1365,
      validUntil: new Date("2024-06-15"),
      status: "sent",
      notes: "Customer requested rush delivery",
      terms: "50% deposit required to start production. Balance due upon completion.",
      createdAt: new Date("2024-05-20"),
      updatedAt: new Date("2024-05-20"),
      createdBy: "Mohammed Ali",
    },
    {
      id: "quot_002",
      number: "QUO-2024-002",
      customer: {
        id: "cust_002",
        name: "Ahmed Al Mansouri",
        email: "ahmed.m@example.com",
        phone: "+971 55 987 6543",
        address: "456 Sheikh Zayed Road, Dubai, UAE",
        image: "/abstract-am.png",
      },
      items: [
        {
          id: "item_003",
          name: "Premium Abaya",
          description: "Black abaya with gold trim",
          quantity: 1,
          unitPrice: 450,
          discount: 0,
          total: 450,
          category: "ready-made",
        },
      ],
      subtotal: 450,
      discount: 0,
      tax: 22.5,
      total: 472.5,
      validUntil: new Date("2024-06-10"),
      status: "accepted",
      notes: "",
      terms: "Payment due within 14 days of acceptance.",
      createdAt: new Date("2024-05-18"),
      updatedAt: new Date("2024-05-22"),
      createdBy: "Aisha Mahmood",
      convertedToSale: "INV-2024-045",
    },
  ])

  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showPreview, setShowPreview] = useState(false)

  const statusColors = {
    draft: "bg-gray-100 text-gray-800 hover:bg-gray-100/90",
    sent: "bg-blue-100 text-blue-800 hover:bg-blue-100/90",
    accepted: "bg-green-100 text-green-800 hover:bg-green-100/90",
    rejected: "bg-red-100 text-red-800 hover:bg-red-100/90",
    expired: "bg-orange-100 text-orange-800 hover:bg-orange-100/90",
    converted: "bg-purple-100 text-purple-800 hover:bg-purple-100/90",
  }

  const filteredQuotations = quotations.filter((quotation) => {
    const matchesSearch =
      quotation.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quotation.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quotation.customer.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || quotation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const duplicateQuotation = (quotation: Quotation) => {
    const newQuotation: Quotation = {
      ...quotation,
      id: `quot_${Date.now()}`,
      number: `QUO-2024-${String(quotations.length + 1).padStart(3, "0")}`,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      convertedToSale: undefined,
    }
    setQuotations([newQuotation, ...quotations])
  }

  const convertToSale = (quotation: Quotation) => {
    const saleNumber = `INV-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`
    setQuotations(
      quotations.map((q) =>
        q.id === quotation.id
          ? {
              ...q,
              status: "converted" as const,
              convertedToSale: saleNumber,
              updatedAt: new Date(),
            }
          : q,
      ),
    )
    toast.success(`Quotation converted to sale ${saleNumber}`)
  }

  const sendQuotation = (quotation: Quotation) => {
    setQuotations(
      quotations.map((q) =>
        q.id === quotation.id
          ? {
              ...q,
              status: "sent" as const,
              updatedAt: new Date(),
            }
          : q,
      ),
    )
    toast.success(`Quotation ${quotation.number} sent to ${quotation.customer.email}`)
  }

  const deleteQuotation = (id: string) => {
    if (confirm("Are you sure you want to delete this quotation?")) {
      setQuotations(quotations.filter((q) => q.id !== id))
    }
  }

  const exportQuotation = (quotation: Quotation) => {
    // In a real app, this would generate a PDF
    toast.success(`Exporting quotation ${quotation.number} as PDF`)
  }

  const printQuotation = (quotation: Quotation) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Quotation ${quotation.number}</title>
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
              <div><strong>Number:</strong> ${quotation.number}</div>
              <div><strong>Date:</strong> ${quotation.createdAt.toLocaleDateString()}</div>
              <div><strong>Valid Until:</strong> ${quotation.validUntil.toLocaleDateString()}</div>
            </div>
          </div>
          
          <div class="customer-info">
            <h3>Quote For:</h3>
            <div><strong>${quotation.customer.name}</strong></div>
            <div>${quotation.customer.email}</div>
            <div>${quotation.customer.phone}</div>
            <div>${quotation.customer.address}</div>
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
                  <td>AED ${item.unitPrice.toFixed(2)}</td>
                  <td>AED ${item.discount.toFixed(2)}</td>
                  <td>AED ${item.total.toFixed(2)}</td>
                </tr>
              `,
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
            ${quotation.notes ? `<p><strong>Notes:</strong> ${quotation.notes}</p>` : ""}
          </div>
          
          <div style="text-align: center; margin-top: 40px; color: #666;">
            <p>Thank you for considering Nubras Tailoring for your needs.</p>
            <p>This quotation is valid until ${quotation.validUntil.toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.print()
  }

  const updateQuotationStatus = (id: string, newStatus: "accepted" | "rejected") => {
    setQuotations(
      quotations.map((q) =>
        q.id === id
          ? {
              ...q,
              status: newStatus,
              updatedAt: new Date(),
            }
          : q,
      ),
    )

    const quotation = quotations.find((q) => q.id === id)
    if (quotation) {
      toast.success(`Quotation ${quotation.number} ${newStatus}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Quotations</h1>
          <p className="text-muted-foreground">Create, manage, and track customer quotations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/quotations/templates">
              <FileText className="mr-2 h-4 w-4" />
              Templates
            </Link>
          </Button>
          <Button asChild>
            <Link href="/quotations/new">
              <Plus className="mr-2 h-4 w-4" />
              New Quotation
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quotations, customers..."
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

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotations</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotations.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotations.filter((q) => q.status === "sent").length}</div>
            <p className="text-xs text-muted-foreground">Awaiting customer response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((quotations.filter((q) => q.status === "converted").length / quotations.length) * 100)}%
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
              AED {quotations.reduce((sum, q) => sum + q.total, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All quotations</p>
          </CardContent>
        </Card>
      </div>

      {/* Quotations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quotations</CardTitle>
          <CardDescription>Manage and track all customer quotations</CardDescription>
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
              {filteredQuotations.map((quotation) => (
                <TableRow key={quotation.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{quotation.number}</div>
                      <div className="text-sm text-muted-foreground">
                        {quotation.items.length} item{quotation.items.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={quotation.customer.image || "/placeholder.svg"}
                          alt={quotation.customer.name}
                        />
                        <AvatarFallback>{quotation.customer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{quotation.customer.name}</div>
                        <div className="text-sm text-muted-foreground">{quotation.customer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">AED {quotation.total.toLocaleString()}</div>
                    {quotation.convertedToSale && (
                      <div className="text-sm text-muted-foreground">→ {quotation.convertedToSale}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={statusColors[quotation.status]}>{quotation.status.toUpperCase()}</Badge>
                      {quotation.status === "sent" && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateQuotationStatus(quotation.id, "accepted")}
                            className="h-6 w-6 p-0 text-green-600 hover:bg-green-50"
                            title="Accept"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateQuotationStatus(quotation.id, "rejected")}
                            className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                            title="Reject"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {quotation.validUntil.toLocaleDateString()}
                      {quotation.validUntil < new Date() && quotation.status !== "converted" && (
                        <div className="text-red-500 text-xs">Expired</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {quotation.createdAt.toLocaleDateString()}
                      <div className="text-xs text-muted-foreground">by {quotation.createdBy}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Quick Status Actions */}
                      {quotation.status === "draft" && (
                        <Button size="sm" onClick={() => sendQuotation(quotation)} className="h-8">
                          <Send className="mr-1 h-3 w-3" />
                          Send
                        </Button>
                      )}

                      {quotation.status === "sent" && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuotationStatus(quotation.id, "accepted")}
                            className="h-8 text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuotationStatus(quotation.id, "rejected")}
                            className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <X className="mr-1 h-3 w-3" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {quotation.status === "accepted" && !quotation.convertedToSale && (
                        <Button
                          size="sm"
                          onClick={() => convertToSale(quotation)}
                          className="h-8 bg-purple-600 hover:bg-purple-700"
                        >
                          <ArrowRight className="mr-1 h-3 w-3" />
                          Convert to Sale
                        </Button>
                      )}

                      {quotation.status === "converted" && quotation.convertedToSale && (
                        <Button size="sm" variant="outline" asChild className="h-8">
                          <Link href={`/sales/${quotation.convertedToSale}`}>
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
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedQuotation(quotation)
                              setShowPreview(true)
                            }}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => printQuotation(quotation)}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => exportQuotation(quotation)}>
                            <Download className="mr-2 h-4 w-4" />
                            Export PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicateQuotation(quotation)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => deleteQuotation(quotation.id)} className="text-red-600">
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

      {/* Quotation Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Quotation {selectedQuotation?.number}</span>
              <Badge className={selectedQuotation ? statusColors[selectedQuotation.status] : ""}>
                {selectedQuotation?.status.toUpperCase()}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Created {selectedQuotation?.createdAt.toLocaleDateString()} • Valid until{" "}
              {selectedQuotation?.validUntil.toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          {selectedQuotation && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={selectedQuotation.customer.image || "/placeholder.svg"}
                        alt={selectedQuotation.customer.name}
                      />
                      <AvatarFallback>{selectedQuotation.customer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedQuotation.customer.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {selectedQuotation.customer.email}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {selectedQuotation.customer.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {selectedQuotation.customer.address}
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-medium mb-3">Quoted Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Discount</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedQuotation.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {item.category}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">AED {item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          {item.discount > 0 ? `-AED ${item.discount.toFixed(2)}` : "-"}
                        </TableCell>
                        <TableCell className="text-right font-medium">AED {item.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>AED {selectedQuotation.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedQuotation.discount > 0 && (
                    <div className="flex justify-between text-sm text-red-600">
                      <span>Discount:</span>
                      <span>-AED {selectedQuotation.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Tax (5%):</span>
                    <span>AED {selectedQuotation.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>AED {selectedQuotation.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Terms and Notes */}
              {(selectedQuotation.terms || selectedQuotation.notes) && (
                <div className="space-y-4">
                  {selectedQuotation.terms && (
                    <div>
                      <h3 className="font-medium mb-2">Terms & Conditions</h3>
                      <div className="bg-muted/30 rounded p-3 text-sm">{selectedQuotation.terms}</div>
                    </div>
                  )}
                  {selectedQuotation.notes && (
                    <div>
                      <h3 className="font-medium mb-2">Notes</h3>
                      <div className="bg-muted/30 rounded p-3 text-sm">{selectedQuotation.notes}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            {selectedQuotation?.status === "draft" && (
              <Button onClick={() => selectedQuotation && sendQuotation(selectedQuotation)}>
                <Send className="mr-2 h-4 w-4" />
                Send to Customer
              </Button>
            )}
            {selectedQuotation?.status === "accepted" && !selectedQuotation.convertedToSale && (
              <Button onClick={() => selectedQuotation && convertToSale(selectedQuotation)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Convert to Sale
              </Button>
            )}
            <Button onClick={() => selectedQuotation && printQuotation(selectedQuotation)}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
