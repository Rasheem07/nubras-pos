"use client"

import { useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Download, Printer, Edit3, Save, X, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"

// Mock data - replace with actual data fetching
const mockSale = {
  id: "INV-001",
  date: new Date("2024-05-04"),
  dueDate: new Date("2024-05-18"),
  customer: {
    name: "Fatima Mohammed",
    email: "fatima@example.com",
    phone: "+971 50 123 4567",
    address: "Al Wasl Road, Dubai, UAE",
  },
  status: "completed",
  paymentMethod: "Card",
  items: [
    { id: 1, name: "Custom Kandura - Navy Blue", sku: "KAN-001", quantity: 1, price: 650, total: 650 },
    { id: 2, name: "Custom Kandura - White", sku: "KAN-002", quantity: 1, price: 600, total: 600 },
  ],
  subtotal: 1250,
  discountAmount: 125, // 10% discount
  discountPercentage: 10,
  tax: 56.25, // 5% on discounted amount
  total: 1181.25,
  amountPaid: 500,
  amountDue: 681.25,
  notes: "Rush order - needed by Friday",
  termsAndConditions: `1. Payment Terms: Net 14 days from invoice date
2. Late Payment: 2% monthly service charge on overdue amounts
3. Returns: Items may be returned within 7 days in original condition
4. Custom Items: Custom tailored items are non-returnable unless defective
5. Alterations: One free alteration within 30 days of delivery
6. Warranty: 6 months warranty on stitching and construction defects
7. Care Instructions: Dry clean only for best results
8. Delivery: Standard delivery 7-10 business days, rush orders 3-5 days
9. Measurements: Customer responsible for accurate measurements
10. Disputes: Any disputes subject to Dubai Courts jurisdiction`,
}

export default function SalesOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "view"
  const [sale, setSale] = useState(mockSale)
  const [isEditing, setIsEditing] = useState(mode === "edit")
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const content = printRef.current
    if (!content) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${sale.id}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.4;
              color: #2d3748;
              background: white;
            }
            .invoice { 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 30px;
              background: white;
            }
            .header { 
              display: flex; 
              justify-content: space-between; 
              align-items: flex-start;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #e2e8f0;
            }
            .company { font-size: 24px; font-weight: 700; color: #1a202c; }
            .company-info { margin-top: 8px; font-size: 13px; color: #4a5568; line-height: 1.5; }
            .invoice-info { text-align: right; }
            .invoice-number { font-size: 20px; font-weight: 600; color: #1a202c; margin-bottom: 8px; }
            .invoice-meta { font-size: 13px; color: #4a5568; }
            .status { 
              display: inline-block; 
              padding: 4px 12px; 
              border-radius: 20px; 
              font-size: 11px; 
              font-weight: 600; 
              text-transform: uppercase;
              margin-top: 8px;
              background: #c6f6d5; 
              color: #22543d;
            }
            .billing { margin-bottom: 30px; }
            .section-title { 
              font-size: 14px; 
              font-weight: 600; 
              color: #2d3748; 
              margin-bottom: 8px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .customer-info { 
              background: #f7fafc; 
              padding: 15px; 
              border-radius: 6px;
              font-size: 13px;
              line-height: 1.5;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 30px 0;
              font-size: 13px;
            }
            th { 
              background: #edf2f7; 
              padding: 12px 8px; 
              text-align: left; 
              font-weight: 600;
              color: #2d3748;
              border-bottom: 1px solid #cbd5e0;
            }
            td { 
              padding: 12px 8px; 
              border-bottom: 1px solid #e2e8f0;
              vertical-align: top;
            }
            .text-right { text-align: right; }
            .totals { 
              margin-top: 30px;
              display: flex;
              justify-content: flex-end;
            }
            .totals-table { 
              background: #f7fafc;
              padding: 20px;
              border-radius: 6px;
              min-width: 350px;
            }
            .total-row { 
              display: flex; 
              justify-content: space-between; 
              padding: 6px 0;
              font-size: 13px;
            }
            .total-row.discount { color: #e53e3e; font-weight: 600; }
            .total-row.due { 
              font-size: 16px; 
              font-weight: 700; 
              color: #e53e3e;
              padding-top: 12px;
              margin-top: 8px;
              border-top: 2px solid #cbd5e0;
            }
            .total-row.final { 
              font-size: 16px; 
              font-weight: 700; 
              color: #1a202c;
              padding-top: 12px;
              margin-top: 8px;
              border-top: 2px solid #cbd5e0;
            }
            .terms { 
              margin-top: 40px; 
              padding: 20px;
              background: #f7fafc;
              border-radius: 6px;
            }
            .terms h4 { 
              font-size: 14px; 
              font-weight: 600; 
              margin-bottom: 12px;
              color: #2d3748;
            }
            .terms-list { 
              font-size: 12px; 
              line-height: 1.6;
              color: #4a5568;
            }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              font-size: 12px; 
              color: #718096;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
            }
            @media print {
              body { print-color-adjust: exact; }
              .invoice { padding: 20px; }
              @page { margin: 0.5cm; }
            }
          </style>
        </head>
        <body>
          <div class="invoice">
            <div class="header">
              <div>
                <div class="company">Nubras Tailoring</div>
                <div class="company-info">
                  123 Al Wasl Road<br>
                  Dubai, UAE<br>
                  +971 50 123 4567<br>
                  info@nubrastailoring.com<br>
                  TRN: 100123456789003
                </div>
              </div>
              <div class="invoice-info">
                <div class="invoice-number">Invoice #${sale.id}</div>
                <div class="invoice-meta">
                  Date: ${format(sale.date, "MMM dd, yyyy")}<br>
                  Due: ${format(sale.dueDate, "MMM dd, yyyy")}
                </div>
                <div class="status">${sale.status}</div>
              </div>
            </div>
            
            <div class="billing">
              <div class="section-title">Bill To</div>
              <div class="customer-info">
                <strong>${sale.customer.name}</strong><br>
                ${sale.customer.email}<br>
                ${sale.customer.phone}<br>
                ${sale.customer.address}
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>SKU</th>
                  <th class="text-right">Qty</th>
                  <th class="text-right">Price</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${sale.items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.sku}</td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-right">AED ${item.price}</td>
                    <td class="text-right">AED ${item.total}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
            
            <div class="totals">
              <div class="totals-table">
                <div class="total-row">
                  <span>Subtotal:</span>
                  <span>AED ${sale.subtotal}</span>
                </div>
                <div class="total-row discount">
                  <span>Discount (${sale.discountPercentage}%):</span>
                  <span>-AED ${sale.discountAmount}</span>
                </div>
                <div class="total-row">
                  <span>Tax (5%):</span>
                  <span>AED ${sale.tax}</span>
                </div>
                <div class="total-row final">
                  <span>Total:</span>
                  <span>AED ${sale.total}</span>
                </div>
                <div class="total-row">
                  <span>Amount Paid:</span>
                  <span>AED ${sale.amountPaid}</span>
                </div>
                <div class="total-row due">
                  <span>Amount Due:</span>
                  <span>AED ${sale.amountDue}</span>
                </div>
              </div>
            </div>
            
            <div class="terms">
              <h4>Terms & Conditions</h4>
              <div class="terms-list">
                ${sale.termsAndConditions
                  .split("\n")
                  .map((term) => `<div>${term}</div>`)
                  .join("")}
              </div>
            </div>
            
            <div class="footer">
              <p><strong>Payment Method:</strong> ${sale.paymentMethod}</p>
              <p>Thank you for choosing Nubras Tailoring!</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onfocus = function() {
                setTimeout(() => window.close(), 500);
              }
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const toggleMode = () => {
    const newMode = isEditing ? "view" : "edit"
    setIsEditing(!isEditing)
    router.push(`/sales/${params.id}?mode=${newMode}`)
  }

  const handleSave = () => {
    // Save logic here
    setIsEditing(false)
    router.push(`/sales/${params.id}?mode=view`)
  }

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: "",
      sku: "",
      quantity: 1,
      price: 0,
      total: 0,
    }
    setSale((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }))
  }

  const removeItem = (id: number) => {
    setSale((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }))
  }

  const updateItem = (id: number, field: string, value: any) => {
    setSale((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === "quantity" || field === "price") {
            updated.total = updated.quantity * updated.price
          }
          return updated
        }
        return item
      }),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Invoice {sale.id}</h1>
            <p className="text-sm text-muted-foreground">
              {isEditing ? "Edit Mode" : "View Mode"} • Due: {format(sale.dueDate, "MMM dd, yyyy")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" onClick={() => {}}>
                <Download className="mr-2 h-4 w-4" />
                PDF
              </Button>
              <Button onClick={toggleMode}>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={toggleMode}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Invoice Content */}
      <div ref={printRef}>
        <Card className="p-6">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b">
            <div>
              <h2 className="text-xl font-bold mb-2">Nubras Tailoring</h2>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>123 Al Wasl Road</p>
                <p>Dubai, UAE</p>
                <p>+971 50 123 4567</p>
                <p>info@nubrastailoring.com</p>
                <p>TRN: 100123456789003</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-bold mb-2">Invoice #{sale.id}</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Date: {format(sale.date, "MMM dd, yyyy")}</p>
                <p>Due: {format(sale.dueDate, "MMM dd, yyyy")}</p>
              </div>
              <div className="mt-2">
                {isEditing ? (
                  <Select
                    value={sale.status}
                    onValueChange={(value) => setSale((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      sale.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : sale.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : sale.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {sale.status}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Bill To:</h4>
            {isEditing ? (
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label htmlFor="customerName">Name</Label>
                  <Input
                    id="customerName"
                    value={sale.customer.name}
                    onChange={(e) =>
                      setSale((prev) => ({
                        ...prev,
                        customer: { ...prev.customer, name: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    value={sale.customer.email}
                    onChange={(e) =>
                      setSale((prev) => ({
                        ...prev,
                        customer: { ...prev.customer, email: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input
                    id="customerPhone"
                    value={sale.customer.phone}
                    onChange={(e) =>
                      setSale((prev) => ({
                        ...prev,
                        customer: { ...prev.customer, phone: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="customerAddress">Address</Label>
                  <Input
                    id="customerAddress"
                    value={sale.customer.address}
                    onChange={(e) =>
                      setSale((prev) => ({
                        ...prev,
                        customer: { ...prev.customer, address: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 bg-muted/50 rounded-lg text-sm">
                <p className="font-medium">{sale.customer.name}</p>
                <p>{sale.customer.email}</p>
                <p>{sale.customer.phone}</p>
                <p>{sale.customer.address}</p>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Items</h4>
              {isEditing && (
                <Button size="sm" onClick={addItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              )}
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  {isEditing && <TableHead className="w-10"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sale.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={item.name}
                          onChange={(e) => updateItem(item.id, "name", e.target.value)}
                          className="min-w-[200px]"
                        />
                      ) : (
                        item.name
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditing ? (
                        <Input
                          value={item.sku}
                          onChange={(e) => updateItem(item.id, "sku", e.target.value)}
                          className="w-24"
                        />
                      ) : (
                        item.sku
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                          className="w-20 text-right"
                        />
                      ) : (
                        item.quantity
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, "price", Number.parseFloat(e.target.value) || 0)}
                          className="w-24 text-right"
                        />
                      ) : (
                        `AED ${item.price}`
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">AED {item.total}</TableCell>
                    {isEditing && (
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Enhanced Totals */}
          <div className="flex justify-end mb-6">
            <div className="w-96 space-y-2 p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>AED {sale.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-red-600 font-medium">
                <span>Discount ({sale.discountPercentage}%):</span>
                <span>-AED {sale.discountAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (5%):</span>
                <span>AED {sale.tax}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t">
                <span>Total:</span>
                <span>AED {sale.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Amount Paid:</span>
                <span>AED {sale.amountPaid}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-red-600 pt-2 border-t">
                <span>Amount Due:</span>
                <span>AED {sale.amountDue}</span>
              </div>
            </div>
          </div>

          {/* Payment & Notes */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t mb-6">
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              {isEditing ? (
                <Select
                  value={sale.paymentMethod}
                  onValueChange={(value) => setSale((prev) => ({ ...prev, paymentMethod: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Apple Pay">Apple Pay</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm font-medium mt-1">{sale.paymentMethod}</p>
              )}
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              {isEditing ? (
                <Textarea
                  id="notes"
                  value={sale.notes}
                  onChange={(e) => setSale((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              ) : (
                <p className="text-sm mt-1">{sale.notes}</p>
              )}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="pt-6 border-t">
            <h4 className="font-semibold mb-3">Terms & Conditions</h4>
            {isEditing ? (
              <Textarea
                value={sale.termsAndConditions}
                onChange={(e) => setSale((prev) => ({ ...prev, termsAndConditions: e.target.value }))}
                rows={8}
                className="text-sm"
              />
            ) : (
              <div className="p-4 bg-muted/50 rounded-lg text-sm space-y-1">
                {sale.termsAndConditions.split("\n").map((term, index) => (
                  <p key={index} className="text-muted-foreground">
                    {term}
                  </p>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
