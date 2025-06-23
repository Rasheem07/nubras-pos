"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Download, Printer, Edit3 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

type ItemMeasurement = {
  id: number
  orderItemId: number
  frontLength: string
  backLength: string
  shoulder: string
  sleeves: string
  neck: string
  waist: string
  chest: string
  widthEnd: string
  notes: string
  createdAt: string
  updatedAt: string | null
}

type SalesOrderItem = {
  id: number
  type: string
  orderId: number
  description: string
  catelogId: number
  modelName: string
  sku: string
  qty: number
  price: string
  modelPrice: string
  total: string
  createdAt: string
  updatedAt: string | null
  measurement?: ItemMeasurement | null
}

type CustomerMeasurement = {
  neck: number
  chest: number
  notes: string
  waist: number
  sleeves: number
  shoulder: number
  widthEnd: number
  backLength: number
  frontLength: number
}

type Customer = {
  id: number
  grpId: number
  phone: string
  name: string
  email: string
  status: string
  measurement: {
    arabic: CustomerMeasurement
    kuwaiti: CustomerMeasurement
  }
  preferences: string[]
  createdAt: string
  updatedAt: string | null
}

type SalesPerson = {
  id: number
  name: string
  department: string
  email: string
  phone: string
  address: string
  level: number
  role: string | null
  joinDate: string
  status: string | null
  salary: string
  photo: string | null
  specialties: string
  createdAt: string
  updatedAt: string | null
}

type SalesOrder = {
  id: number
  status: string
  customerId: number
  customerName: string
  salesPersonId: number
  salesPersonName: string
  subtotal: string
  taxAmount: string
  discountAmount: string
  totalAmount: string
  paymentStatus: string
  notes: string
  priority: string
  paymentTerms: string
  dueDate: string
  deliveryDate: string | null
  completedDate: string | null
  quoteId: string | null
  amountPaid: string
  amountPending: string
  paymentCompletedDate: string | null
  createdAt: string
  updatedAt: string | null
  customer: Customer
  salesPerson: SalesPerson
  items: SalesOrderItem[]
  discountPercentage?: number
}

// Terms and conditions mock data
const termsAndConditions = `1. Payment Terms: Net 14 days from invoice date
2. Late Payment: 2% monthly service charge on overdue amounts
3. Returns: Items may be returned within 7 days in original condition
4. Custom Items: Custom tailored items are non-returnable unless defective
5. Alterations: One free alteration within 30 days of delivery
6. Warranty: 6 months warranty on stitching and construction defects
7. Care Instructions: Dry clean only for best results
8. Delivery: Standard delivery 7-10 business days, rush orders 3-5 days
9. Measurements: Customer responsible for accurate measurements
10. Disputes: Any disputes subject to Dubai Courts jurisdiction`

export default function SalesOrderViewPage() {
  const params = useParams()
  const router = useRouter()
  const printRef = useRef<HTMLDivElement>(null)
  const [sale, setSale] = useState<SalesOrder | null>(null)
  const searchParams = useSearchParams()
  const mode = searchParams?.get("mode")

  const {
    data: saleOrder,
    isLoading,
    error,
    refetch,
  } = useQuery<SalesOrder>({
    queryKey: [`sales-${params?.id}`],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5005/api/v1/sales/${params?.id}`, { credentials: "include",})
      const json = await response.json()
      if (!response.ok) {
        toast.error(json.message ?? "Failed to load sales order")
        throw new Error(json.message ?? "Failed to load sales order")
      }
      return json
    },
  })

  useEffect(() => {
    if (saleOrder) {
      // Calculate discount percentage if not provided
      const enhancedSale = {
        ...saleOrder,
        discountPercentage:
          saleOrder.discountPercentage ||
          (Number.parseFloat(saleOrder.discountAmount) / Number.parseFloat(saleOrder.subtotal)) * 100 ||
          0,
      }
      setSale(enhancedSale)
    }
  }, [saleOrder])

  const handlePrint = () => {
    const content = printRef.current
    if (!content) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const items = sale?.items || []
    const hasCustomItems = items.some((item) => item.type === "custom")

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice ${sale?.id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Arial', sans-serif;
            line-height: 1.3;
            color: #333;
            background: white;
            font-size: 12px;
          }
          .invoice { 
            max-width: 210mm; 
            margin: 0 auto; 
            padding: 15mm;
            background: white;
            min-height: 297mm;
          }
          .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #000;
          }
          .company { 
            font-size: 18px; 
            font-weight: bold; 
            color: #000; 
            margin-bottom: 5px;
          }
          .company-info { 
            font-size: 10px; 
            color: #666; 
            line-height: 1.4; 
          }
          .invoice-info { text-align: right; }
          .invoice-number { 
            font-size: 16px; 
            font-weight: bold; 
            color: #000; 
            margin-bottom: 5px; 
          }
          .invoice-meta { font-size: 10px; color: #666; }
          .status { 
            display: inline-block; 
            padding: 3px 8px; 
            border-radius: 3px; 
            font-size: 9px; 
            font-weight: bold; 
            text-transform: uppercase;
            margin-top: 5px;
            background: #e6ffe6; 
            color: #006600;
            border: 1px solid #006600;
          }
          
          .billing-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
          }
          .billing { width: 48%; }
          .section-title { 
            font-size: 11px; 
            font-weight: bold; 
            color: #000; 
            margin-bottom: 5px;
            text-transform: uppercase;
          }
          .customer-info { 
            background: #f8f8f8; 
            padding: 10px; 
            border-radius: 3px;
            font-size: 10px;
            line-height: 1.4;
            border: 1px solid #ddd;
          }
          
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 15px 0;
            font-size: 10px;
          }
          th { 
            background: #f0f0f0; 
            padding: 6px 4px; 
            text-align: left; 
            font-weight: bold;
            color: #000;
            border: 1px solid #ccc;
            font-size: 9px;
          }
          td { 
            padding: 6px 4px; 
            border: 1px solid #ddd;
            vertical-align: top;
          }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          
          .totals { 
            display: flex;
            justify-content: flex-end;
            margin: 15px 0;
          }
          .totals-table { 
            background: #f8f8f8;
            padding: 10px;
            border-radius: 3px;
            min-width: 250px;
            border: 1px solid #ddd;
          }
          .total-row { 
            display: flex; 
            justify-content: space-between; 
            padding: 3px 0;
            font-size: 10px;
          }
          .total-row.discount { color: #cc0000; font-weight: bold; }
          .total-row.due { 
            font-size: 11px; 
            font-weight: bold; 
            color: #cc0000;
            padding-top: 5px;
            margin-top: 5px;
            border-top: 1px solid #ccc;
          }
          .total-row.final { 
            font-size: 11px; 
            font-weight: bold; 
            color: #000;
            padding-top: 5px;
            margin-top: 5px;
            border-top: 1px solid #ccc;
          }
          
          /* Individual Item Measurements Section */
          .item-measurements-section {
            margin: 15px 0;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 3px;
            background: #fafafa;
            page-break-inside: avoid;
          }
          .item-measurements-header {
            text-align: center;
            margin-bottom: 10px;
            font-size: 12px;
            font-weight: bold;
            color: #000;
          }
          .measurement-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            font-size: 9px;
          }
          .measurement-item {
            display: flex;
            flex-direction: column;
            padding: 6px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 2px;
            text-align: center;
          }
          .measurement-label {
            font-weight: 500;
            color: #555;
            font-size: 8px;
            margin-bottom: 3px;
          }
          .measurement-value {
            font-weight: bold;
            color: #000;
            font-size: 10px;
            background: #f0f0f0;
            padding: 2px 4px;
            border-radius: 2px;
          }
          
          .terms { 
            margin-top: 15px; 
            padding: 10px;
            background: #f8f8f8;
            border-radius: 3px;
            border: 1px solid #ddd;
          }
          .terms h4 { 
            font-size: 10px; 
            font-weight: bold; 
            margin-bottom: 5px;
            color: #000;
          }
          .terms-list { 
            font-size: 8px; 
            line-height: 1.4;
            color: #555;
          }
          .footer { 
            margin-top: 15px; 
            text-align: center; 
            font-size: 9px; 
            color: #666;
            padding-top: 10px;
            border-top: 1px solid #ddd;
          }
          
          @media print {
            body { print-color-adjust: exact; }
            .invoice { padding: 10mm; }
            @page { 
              size: A4; 
              margin: 5mm; 
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <div>
              <div class="company">Nubras Tailoring</div>
              <div class="company-info">
                123 Al Wasl Road, Dubai, UAE<br>
                +971 50 123 4567 | info@nubrastailoring.com<br>
                TRN: 100123456789003
              </div>
            </div>
            <div class="invoice-info">
              <div class="invoice-number">INVOICE #${sale?.id}</div>
              <div class="invoice-meta">
                Date: ${new Date(sale?.createdAt || "").toLocaleDateString()}<br>
                Due: ${new Date(sale?.dueDate || "").toLocaleDateString()}
              </div>
              <div class="status">${sale?.status}</div>
            </div>
          </div>
          
          <div class="billing-section">
            <div class="billing">
              <div class="section-title">Bill To</div>
              <div class="customer-info">
                <strong>${sale?.customer?.name}</strong><br>
                ${sale?.customer?.email || ""}<br>
                ${sale?.customer?.phone || ""}
              </div>
            </div>
            <div class="billing">
              <div class="section-title">Sales Person</div>
              <div class="customer-info">
                <strong>${sale?.salesPerson?.name}</strong><br>
                ${sale?.salesPerson?.email || ""}<br>
                ${sale?.salesPerson?.phone || ""}
              </div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Model</th>
                <th>SKU</th>
                <th class="text-center" width="8%">Qty</th>
                <th class="text-right" width="12%">Price</th>
                <th class="text-right" width="12%">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item) => `
                <tr>
                  <td>${item.description || ""}</td>
                  <td>${item.modelName || ""}</td>
                  <td>${item.sku || ""}</td>
                  <td class="text-center">${item.qty || ""}</td>
                  <td class="text-right">AED ${item.price || ""}</td>
                  <td class="text-right">AED ${item.total || ""}</td>
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
                <span>AED ${sale?.subtotal || "0"}</span>
              </div>
              <div class="total-row discount">
                <span>Discount (${(sale?.discountPercentage || 0).toFixed(1)}%):</span>
                <span>-AED ${sale?.discountAmount || "0"}</span>
              </div>
              <div class="total-row">
                <span>Tax (5%):</span>
                <span>AED ${sale?.taxAmount || "0"}</span>
              </div>
              <div class="total-row final">
                <span>Total:</span>
                <span>AED ${sale?.totalAmount || "0"}</span>
              </div>
              <div class="total-row">
                <span>Amount Paid:</span>
                <span>AED ${sale?.amountPaid || "0"}</span>
              </div>
              <div class="total-row due">
                <span>Amount Due:</span>
                <span>AED ${sale?.amountPending || "0"}</span>
              </div>
            </div>
          </div>
          
          ${
            hasCustomItems
              ? items
                  .filter((item) => item.type === "custom" && item.measurement)
                  .map(
                    (item) => `
          <div class="item-measurements-section">
            <div class="item-measurements-header">
              Measurements for: ${item.description} (${item.modelName})
            </div>
            <div class="measurement-grid">
              <div class="measurement-item">
                <span class="measurement-label">Front Length</span>
                <span class="measurement-value">${item.measurement?.frontLength || "___"}</span>
              </div>
              <div class="measurement-item">
                <span class="measurement-label">Back Length</span>
                <span class="measurement-value">${item.measurement?.backLength || "___"}</span>
              </div>
              <div class="measurement-item">
                <span class="measurement-label">Shoulder</span>
                <span class="measurement-value">${item.measurement?.shoulder || "___"}</span>
              </div>
              <div class="measurement-item">
                <span class="measurement-label">Sleeves</span>
                <span class="measurement-value">${item.measurement?.sleeves || "___"}</span>
              </div>
              <div class="measurement-item">
                <span class="measurement-label">Neck</span>
                <span class="measurement-value">${item.measurement?.neck || "___"}</span>
              </div>
              <div class="measurement-item">
                <span class="measurement-label">Waist</span>
                <span class="measurement-value">${item.measurement?.waist || "___"}</span>
              </div>
              <div class="measurement-item">
                <span class="measurement-label">Chest</span>
                <span class="measurement-value">${item.measurement?.chest || "___"}</span>
              </div>
              <div class="measurement-item">
                <span class="measurement-label">Width End</span>
                <span class="measurement-value">${item.measurement?.widthEnd || "___"}</span>
              </div>
            </div>
            ${
              item.measurement?.notes
                ? `<div style="margin-top: 10px; padding: 8px; background: white; border: 1px solid #ddd; border-radius: 3px;">
                     <strong>Notes:</strong> ${item.measurement.notes}
                   </div>`
                : ""
            }
          </div>
          `,
                  )
                  .join("")
              : ""
          }
          
          <div class="terms">
            <h4>Terms & Conditions</h4>
            <div class="terms-list">
              ${termsAndConditions
                .split("\n")
                .slice(0, 5)
                .map((term) => `<div>${term}</div>`)
                .join("")}
            </div>
          </div>
          
          <div class="footer">
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

  useEffect(() => {
    if (mode == "print" && !isLoading && sale) {
      handlePrint()
    }
  }, [mode, isLoading, sale])

  if (isLoading || !sale) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-[300px] text-center">
          <CardContent className="space-y-4 py-8">
            <div className="w-10 h-10 mx-auto border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-lg font-medium text-gray-700">Loading invoice…</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="w-full max-w-md border-red-300">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{(error as Error).message || "Failed to load invoice."}</p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Invoice #{sale.id}</h1>
            <p className="text-sm text-muted-foreground">
              View Mode • Due: {new Date(sale.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button onClick={() => router.push(`/sales/${params?.id}/edit`)}>
            <Edit3 className="mr-2 h-4 w-4" />
            Edit
          </Button>
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
                <p>Date: {new Date(sale.createdAt).toLocaleDateString()}</p>
                <p>Due: {new Date(sale.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="mt-2">
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
              </div>
            </div>
          </div>

          {/* Customer & Sales Person Information */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-3">Bill To:</h4>
              <div className="p-4 bg-muted/50 rounded-lg text-sm">
                <p className="font-medium">{sale.customer.name}</p>
                <p>{sale.customer.email}</p>
                <p>{sale.customer.phone}</p>
                <p className="text-xs text-muted-foreground mt-2">Customer ID: {sale.customer.id}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Sales Person:</h4>
              <div className="p-4 bg-muted/50 rounded-lg text-sm">
                <p className="font-medium">{sale.salesPerson.name}</p>
                <p>{sale.salesPerson.email}</p>
                <p>{sale.salesPerson.phone}</p>
                <p className="text-xs text-muted-foreground mt-2">Department: {sale.salesPerson.department}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Items</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sale.items && sale.items.length > 0 ? (
                  sale.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p>{item.description}</p>
                          {item.type === "custom" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                              Custom Item
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.modelName}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell className="text-right">{item.qty}</TableCell>
                      <TableCell className="text-right">AED {item.price}</TableCell>
                      <TableCell className="text-right font-medium">AED {item.total}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Individual Item Measurements */}
          {sale.items?.some((item) => item.type === "custom" && item.measurement) && (
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Custom Item Measurements</h4>
              <div className="space-y-4">
                {sale.items
                  .filter((item) => item.type === "custom" && item.measurement)
                  .map((item) => (
                    <Card key={item.id} className="p-4">
                      <h5 className="font-medium mb-3">
                        {item.description} - {item.modelName}
                      </h5>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <p className="font-medium">Front Length</p>
                          <p className="text-lg font-bold">{item.measurement?.frontLength}</p>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <p className="font-medium">Back Length</p>
                          <p className="text-lg font-bold">{item.measurement?.backLength}</p>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <p className="font-medium">Shoulder</p>
                          <p className="text-lg font-bold">{item.measurement?.shoulder}</p>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <p className="font-medium">Sleeves</p>
                          <p className="text-lg font-bold">{item.measurement?.sleeves}</p>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <p className="font-medium">Neck</p>
                          <p className="text-lg font-bold">{item.measurement?.neck}</p>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <p className="font-medium">Waist</p>
                          <p className="text-lg font-bold">{item.measurement?.waist}</p>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <p className="font-medium">Chest</p>
                          <p className="text-lg font-bold">{item.measurement?.chest}</p>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <p className="font-medium">Width End</p>
                          <p className="text-lg font-bold">{item.measurement?.widthEnd}</p>
                        </div>
                      </div>
                      {item.measurement?.notes && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-sm">
                            <strong>Notes:</strong> {item.measurement.notes}
                          </p>
                        </div>
                      )}
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* Enhanced Totals */}
          <div className="flex justify-end mb-6">
            <div className="w-96 space-y-2 p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>AED {sale.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-red-600 font-medium">
                <span>Discount ({(sale.discountPercentage || 0).toFixed(1)}%):</span>
                <span>-AED {sale.discountAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (5%):</span>
                <span>AED {sale.taxAmount}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t">
                <span>Total:</span>
                <span>AED {sale.totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Amount Paid:</span>
                <span>AED {sale.amountPaid}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-red-600 pt-2 border-t">
                <span>Amount Due:</span>
                <span>AED {sale.amountPending}</span>
              </div>
            </div>
          </div>

          {/* Payment & Notes */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t mb-6">
            <div>
              <h4 className="font-semibold mb-2">Payment Terms</h4>
              <p className="text-sm">{sale.paymentTerms}</p>
              <p className="text-sm mt-1">
                <span className="font-medium">Priority:</span> {sale.priority}
              </p>
              <p className="text-sm mt-1">
                <span className="font-medium">Payment Status:</span> {sale.paymentStatus}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Notes</h4>
              <p className="text-sm">{sale.notes || "No notes provided"}</p>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="pt-6 border-t">
            <h4 className="font-semibold mb-3">Terms & Conditions</h4>
            <div className="p-4 bg-muted/50 rounded-lg text-sm space-y-1">
              {termsAndConditions.split("\n").map((term, index) => (
                <p key={index} className="text-muted-foreground">
                  {term}
                </p>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
