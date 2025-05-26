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
  measurements: {
    neck: 40,
    shoulder: 48,
    chest: 100,
    waist: 90,
    hips: 102,
    sleeveLength: 62,
    kanduraLength: 150,
  },
  isCustomOrder: true, // Flag to indicate if it's a custom order
}

const generateArabicInvoice = (sale: any) => {
  return `
      <!DOCTYPE html>
      <html lang="en" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${sale.id}</title>
        <style>
          /* Reset styles */
          body, html {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            font-size: 12px;
            direction: rtl; /* Right-to-left */
            background: #fff;
            color: #333;
          }

          /* Invoice container */
          .invoice-container {
            width: 210mm; /* A4 width */
            min-height: 297mm; /* A4 height */
            margin: 0 auto;
            padding: 20mm;
            box-sizing: border-box;
            background: #fff;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
          }

          /* Header styles */
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
          }

          .logo img {
            max-width: 150px;
          }

          .invoice-info {
            text-align: left;
          }

          .invoice-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
          }

          .invoice-meta {
            font-size: 12px;
            color: #777;
          }

          /* Customer and Company Info */
          .customer-company-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }

          .customer-info, .company-info {
            width: 48%;
            padding: 10px;
            border: 1px solid #eee;
            box-sizing: border-box;
          }

          .section-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 5px;
          }

          /* Table styles */
          .table-container {
            overflow: auto;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            table-layout: fixed;
          }

          th, td {
            border: 1px solid #eee;
            padding: 8px;
            text-align: right;
            word-wrap: break-word;
          }

          th {
            background-color: #f7f7f7;
            font-weight: bold;
          }

          /* Totals */
          .totals {
            text-align: left;
            margin-bottom: 20px;
          }

          .totals-table {
            width: 50%;
            margin-left: auto;
            border: 1px solid #eee;
            padding: 10px;
          }

          .totals-table tr {
            display: flex;
            justify-content: space-between;
          }

          .totals-table td {
            border: none;
            padding: 5px;
            text-align: right;
          }

          .total-amount {
            font-weight: bold;
          }

          /* Measurements */
          .measurements {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
          }

          .measurement-diagram {
            width: 45%;
          }

          .measurement-diagram img {
            max-width: 100%;
            height: auto;
          }

          .measurement-list {
            width: 45%;
          }

          .measurement-list ul {
            list-style: none;
            padding: 0;
          }

          .measurement-list li {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
          }

          /* Notes and Terms */
          .notes, .terms {
            margin-bottom: 20px;
            padding: 10px;
            border: 1px solid #eee;
          }

          /* Footer */
          .footer {
            text-align: center;
            font-size: 10px;
            color: #777;
            border-top: 1px solid #eee;
            padding-top: 10px;
          }

          /* RTL adjustments */
          body {
            font-family: 'Arial', sans-serif;
          }

          /* Print styles */
          @media print {
            body, html {
              background: #fff;
              color: #000;
            }

            .invoice-container {
              box-shadow: none;
              margin: 0;
              padding: 10mm;
            }

            /* Add more print-specific adjustments as needed */
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="logo">
              <img src="https://via.placeholder.com/150x50" alt="Logo">
            </div>
            <div class="invoice-info">
              <div class="invoice-title">فاتورة / Invoice</div>
              <div class="invoice-meta">
                رقم الفاتورة / Invoice Number: #${sale.id}<br>
                تاريخ الفاتورة / Invoice Date: ${format(sale.date, "dd/MM/yyyy")}<br>
                تاريخ الاستحقاق / Due Date: ${format(sale.dueDate, "dd/MM/yyyy")}
              </div>
            </div>
          </div>

          <div class="customer-company-info">
            <div class="customer-info">
              <div class="section-title">معلومات العميل / Customer Information</div>
              ${sale.customer.name}<br>
              ${sale.customer.email}<br>
              ${sale.customer.phone}<br>
              ${sale.customer.address}
            </div>
            <div class="company-info">
              <div class="section-title">معلومات الشركة / Company Information</div>
              Nubras Tailoring<br>
              123 Al Wasl Road<br>
              Dubai, UAE<br>
              +971 50 123 4567<br>
              info@nubrastailoring.com
            </div>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>الوصف / Description</th>
                  <th>الرمز / SKU</th>
                  <th>الكمية / Qty</th>
                  <th>السعر / Price</th>
                  <th>الإجمالي / Total</th>
                </tr>
              </thead>
              <tbody>
                ${sale.items
                  .map(
                    (item: any) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.sku}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price}</td>
                    <td>${item.total}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          <div class="totals">
            <table class="totals-table">
              <tr>
                <td>المجموع الفرعي / Subtotal:</td>
                <td>${sale.subtotal}</td>
              </tr>
              <tr>
                <td>الخصم / Discount (${sale.discountPercentage}%):</td>
                <td>-${sale.discountAmount}</td>
              </tr>
              <tr>
                <td>الضريبة / Tax (5%):</td>
                <td>${sale.tax}</td>
              </tr>
              <tr>
                <td>المجموع الكلي / Total:</td>
                <td class="total-amount">${sale.total}</td>
              </tr>
              <tr>
                <td>المدفوع / Amount Paid:</td>
                <td>${sale.amountPaid}</td>
              </tr>
              <tr>
                <td>المتبقي / Amount Due:</td>
                <td class="total-amount">${sale.amountDue}</td>
              </tr>
            </table>
          </div>

          <div class="measurements">
            <div class="measurement-diagram">
              <img src="https://via.placeholder.com/300x400" alt="Measurement Diagram">
            </div>
            <div class="measurement-list">
              <div class="section-title">المقاسات / Measurements</div>
              <ul>
                <li><span>الرقبة / Neck:</span><span>${sale.measurements.neck} cm</span></li>
                <li><span>الكتف / Shoulder:</span><span>${sale.measurements.shoulder} cm</span></li>
                <li><span>الصدر / Chest:</span><span>${sale.measurements.chest} cm</span></li>
                <li><span>الخصر / Waist:</span><span>${sale.measurements.waist} cm</span></li>
                <li><span>الأرداف / Hips:</span><span>${sale.measurements.hips} cm</span></li>
                <li><span>طول الكم / Sleeve Length:</span><span>${sale.measurements.sleeveLength} cm</span></li>
                <li><span>طول الثوب / Kandura Length:</span><span>${sale.measurements.kanduraLength} cm</span></li>
              </ul>
            </div>
          </div>

          <div class="notes">
            <div class="section-title">ملاحظات / Notes</div>
            ${sale.notes}
          </div>
  
          <div class="terms">
            <div class="section-title">الشروط والأحكام / Terms & Conditions</div>
            ${sale.termsAndConditions
              .split("\n")
              .map((term: any) => `<div>${term}</div>`)
              .join("")}
          </div>

          <div class="footer">
            © 2024 Nubras Tailoring. All rights reserved.
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
    `
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

    // Check if order contains custom items
    const hasCustomItems = sale.items.some((item) => item.name.toLowerCase().includes("custom"))

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
          
          /* Measurement Section Styles */
          .measurements-section {
            margin: 30px 0;
            padding: 20px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            background: #fafafa;
          }
          .measurements-header {
            text-align: center;
            margin-bottom: 20px;
            font-size: 16px;
            font-weight: 600;
            color: #2d3748;
          }
          .measurements-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .measurements-diagrams {
            width: 45%;
            display: flex;
            justify-content: space-around;
          }
          .diagram {
            text-align: center;
            margin: 0 10px;
          }
          .diagram-title {
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 10px;
            color: #4a5568;
          }
          .diagram-svg {
            width: 120px;
            height: 160px;
            border: 1px solid #cbd5e0;
            background: white;
            margin-bottom: 10px;
          }
          .measurements-list {
            width: 50%;
            padding-left: 20px;
          }
          .measurement-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            font-size: 12px;
          }
          .measurement-item {
            display: flex;
            justify-content: space-between;
            padding: 6px 8px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
          }
          .measurement-label {
            font-weight: 500;
            color: #4a5568;
          }
          .measurement-value {
            font-weight: 600;
            color: #2d3748;
            min-width: 40px;
            text-align: right;
          }
          .arabic-label {
            font-size: 10px;
            color: #718096;
            font-style: italic;
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
          
          ${
            hasCustomItems
              ? `
          <div class="measurements-section">
            <div class="measurements-header">
              Body Measurements / قياسات الجسم
            </div>
            <div class="measurements-content">
              <div class="measurements-diagrams">
              <div class="diagram">
              <img src="/diagram2.png" alt="diagram" style="height: 150px; width: 150px;"/>
              </div>
              <div class="diagram">
                <img src="/diagram1.png" alt="diagram" style="height: 150px; width: 150px;"/>
               </div>
              </div>
              
              <div class="measurements-list">
                <div class="measurement-grid">
                  <div class="measurement-item">
                    <span class="measurement-label">
                      الطول أمام<br>
                      <span class="arabic-label">Front Length</span>
                    </span>
                    <span class="measurement-value">${sale.measurements?.kanduraLength || "___"}</span>
                  </div>
                  
                  <div class="measurement-item">
                    <span class="measurement-label">
                      الطول خلف<br>
                      <span class="arabic-label">Back Length</span>
                    </span>
                    <span class="measurement-value">${sale.measurements?.kanduraLength || "___"}</span>
                  </div>
                  
                  <div class="measurement-item">
                    <span class="measurement-label">
                      الكتف<br>
                      <span class="arabic-label">Shoulder</span>
                    </span>
                    <span class="measurement-value">${sale.measurements?.shoulder || "___"}</span>
                  </div>
                  
                  <div class="measurement-item">
                    <span class="measurement-label">
                      الأيدي<br>
                      <span class="arabic-label">Arms</span>
                    </span>
                    <span class="measurement-value">${sale.measurements?.sleeveLength || "___"}</span>
                  </div>
                  
                  <div class="measurement-item">
                    <span class="measurement-label">
                      الرقبة<br>
                      <span class="arabic-label">Neck</span>
                    </span>
                    <span class="measurement-value">${sale.measurements?.neck || "___"}</span>
                  </div>
                  
                  <div class="measurement-item">
                    <span class="measurement-label">
                      الوسط<br>
                      <span class="arabic-label">Waist</span>
                    </span>
                    <span class="measurement-value">${sale.measurements?.waist || "___"}</span>
                  </div>
                  
                  <div class="measurement-item">
                    <span class="measurement-label">
                      الصدر<br>
                      <span class="arabic-label">Chest</span>
                    </span>
                    <span class="measurement-value">${sale.measurements?.chest || "___"}</span>
                  </div>
                  
                  <div class="measurement-item">
                    <span class="measurement-label">
                      نهاية العرض<br>
                      <span class="arabic-label">Width End</span>
                    </span>
                    <span class="measurement-value">${sale.measurements?.hips || "___"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          `
              : ""
          }
          
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
