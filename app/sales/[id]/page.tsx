"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Download, Printer, Edit3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

type SalesOrder = {
  id: number;
  status: string;
  customerId: number;
  customerName: string;
  salesPersonId: number;
  salesPersonName: string;
  subtotal: string;
  taxAmount: string;
  discountAmount: string;
  totalAmount: string;
  paymentStatus: string;
  notes: string;
  priority: string;
  paymentTerms: string;
  dueDate: string;
  deliveryDate: string;
  completedDate: string | null;
  createdAt: string;
  updatedAt: string | null;
  amountPaid: string;
  amountPending: string;
  items: any[] | null;
  customer: {
    id: number;
    grpId: number;
    phone: string;
    name: string;
    email: string;
    status: string;
    measurement: {
      arabic: Measurement;
      kuwaiti: Measurement;
    };
    preferences: string[];
    createdAt: string;
    updatedAt: string | null;
  };
  salesPerson: {
    id: number;
    name: string;
    department: string;
    email: string;
    phone: string;
    address: string;
    level: number;
    role: string | null;
    joinDate: string;
    status: string | null;
    salary: string;
    photo: string | null;
    createdAt: string;
    updatedAt: string | null;
  };
  discountPercentage?: number;
};

type Measurement = {
  neck: number;
  chest: number;
  notes: string;
  waist: number;
  sleeves: number;
  shoulder: number;
  widthEnd: number;
  backLength: number;
  frontLength: number;
};

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
10. Disputes: Any disputes subject to Dubai Courts jurisdiction`;

export default function SalesOrderViewPage() {
  const params = useParams();
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  const [sale, setSale] = useState<SalesOrder | null>(null);
  const searchParams = useSearchParams();
  const mode = searchParams?.get("mode");
  
  const {
    data: saleOrder,
    isLoading,
    error,
    refetch,
  } = useQuery<SalesOrder>({
    queryKey: [`sales-${params?.id}`],
    queryFn: async () => {
      const response = await fetch(
        `http://3.29.240.212/api/v1/sales/${params?.id}`
      );
      const json = await response.json();
      if (!response.ok) {
        toast.error(json.message ?? "Failed to load sales order");
        throw new Error(json.message ?? "Failed to load sales order");
      }
      return json;
    },
  });

  useEffect(() => {
    if (saleOrder) {
      // Calculate amount due if not provided
      const enhancedSale = {
        ...saleOrder,
        amountPaid: saleOrder.amountPaid || "0",
        amountDue:
          saleOrder.amountPending ||
          (
            Number.parseFloat(saleOrder.totalAmount) -
            Number.parseFloat(saleOrder.amountPaid || "0")
          ).toFixed(2),
        discountPercentage: saleOrder.discountPercentage || 10,
      };
      setSale(enhancedSale);
    }
  }, [saleOrder]);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const items = Array.isArray(sale?.items)
      ? sale.items
      : sale?.items
        ? [sale.items]
        : [];

    const hasCustomItems = items.some((item) =>
      item.description?.toLowerCase().includes("custom")
    );

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
          
          /* Compact Measurements Section */
          .measurements-section {
            margin: 15px 0;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 3px;
            background: #fafafa;
          }
          .measurements-header {
            text-align: center;
            margin-bottom: 10px;
            font-size: 12px;
            font-weight: bold;
            color: #000;
          }
          .measurements-container {
            display: flex;
            justify-content: space-between;
            gap: 20px;
          }
          
          /* Arabic Measurements */
          .arabic-measurements {
            flex: 1;
            background: white;
            border: 1px solid #ddd;
            border-radius: 3px;
            padding: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          /* Kuwaiti Measurements */
          .kuwaiti-measurements {
            flex: 1;
            background: white;
            border: 1px solid #ddd;
            border-radius: 3px;
            padding: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          .measurement-type-title {
            font-size: 10px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 8px;
            color: #000;
            border-bottom: 1px solid #eee;
            padding-bottom: 3px;
            width: 100%;
          }
          
          /* Diagram within each section */
          .section-diagram {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 10px 0;
            gap: 5px;
          }
          
          .diagram-image {
            width: 120px;
            height: 150px;
            object-fit: contain;
          }
          
          .kuwaiti-diagrams {
            display: flex;
            gap: 10px;
          }
          
          .kuwaiti-diagrams .diagram-image {
            width: 120px;
            height: 150px;
          }
          
          .diagram-label {
            font-size: 8px;
            color: #666;
            margin-top: 2px;
          }
          
          /* Measurement fields in single column */
          .measurement-grid {
            display: flex;
            flex-direction: column;
            gap: 3px;
            font-size: 9px;
            width: 100%;
          }
          
          .measurement-item {
            display: flex;
            justify-content: space-between;
            padding: 4px 8px;
            background: #f9f9f9;
            border: 1px solid #eee;
            border-radius: 2px;
            align-items: center;
          }
          
          .measurement-label {
            font-weight: 500;
            color: #555;
            font-size: 8px;
            line-height: 1.2;
            flex: 1;
          }
          
          .measurement-value {
            font-weight: bold;
            color: #000;
            min-width: 35px;
            text-align: right;
            font-size: 9px;
            background: white;
            padding: 2px 5px;
            border: 1px solid #ddd;
            border-radius: 2px;
          }
          
          .arabic-label {
            font-size: 7px;
            color: #999;
            font-style: italic;
            display: block;
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
          
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Description</th>
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
                  <td>${item.sku || ""}</td>
                  <td class="text-center">${item.qty || ""}</td>
                  <td class="text-right">AED ${item.price || ""}</td>
                  <td class="text-right">AED ${item.total || ""}</td>
                </tr>
              `
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
                <span>Discount (${sale?.discountPercentage || 0}%):</span>
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
              ? `
          <div class="measurements-section">
            <div class="measurements-header">
              Body Measurements / قياسات الجسم
            </div>
            <div class="measurements-container">
              
              <!-- Arabic Measurements -->
              <div class="arabic-measurements">
                <div class="measurement-type-title">Arabic Style / الطراز العربي</div>
                
                <!-- Arabic Diagram -->
                <div class="section-diagram">
                  <img src="/diagram1.png" alt="Arabic Style" class="diagram-image" />
                  <div class="diagram-label">Arabic Style</div>
                </div>
                
                <!-- Arabic Measurements Grid -->
                <div class="measurement-grid">
                  <div class="measurement-item">
                    <span class="measurement-label">
                      الطول أمام<br>
                      <span class="arabic-label">Front Length</span>
                    </span>
                    <span class="measurement-value">${sale?.customer?.measurement?.arabic?.frontLength || "___"}</span>
                  </div>
                  
                  <div class="measurement-item">
                    <span class="measurement-label">
                      الطول خلف<br>
                      <span class="arabic-label">Back Length</span>
                    </span>
                    <span class="measurement-value">${sale?.customer?.measurement?.arabic?.backLength || "___"}</span>
                  </div>
                  
                  <div class="measurement-item">
                    <span class="measurement-label">
                      الكتف<br>
                      <span class="arabic-label">Shoulder</span>
                    </span>
                    <span class="measurement-value">${sale?.customer?.measurement?.arabic?.shoulder || "___"}</span>
                  </div>
                  
                  <div class="measurement-item">
                    <span class="measurement-label">
                      الأيدي<br>
                      <span class="arabic-label">Arms</span>
                    </span>
                    <span class="measurement-value">${sale?.customer?.measurement?.arabic?.sleeves || "___"}</span>
                  </div>
                  
                  <div class="measurement-item">
                    <span class="measurement-label">
                      الرقبة<br>
                      <span class="arabic-label">Neck</span>
                    </span>
                    <span class="measurement-value">${sale?.customer?.measurement?.arabic?.neck || "___"}</span>
                  </div>
                  
                  <div class="measurement-item">
                    <span class="measurement-label">
                      الوسط<br>
                      <span class="arabic-label">Waist</span>
                    </span>
                    <span class="measurement-value">${sale?.customer?.measurement?.arabic?.waist || "___"}</span>
                  </div>
                  
                  <div class="measurement-item">
                    <span class="measurement-label">
                      الصدر<br>
                      <span class="arabic-label">Chest</span>
                    </span>
                    <span class="measurement-value">${sale?.customer?.measurement?.arabic?.chest || "___"}</span>
                  </div>
                  
                  <div class="measurement-item">
                    <span class="measurement-label">
                      نهاية العرض<br>
                      <span class="arabic-label">Width End</span>
                    </span>
                    <span class="measurement-value">${sale?.customer?.measurement?.arabic?.widthEnd || "___"}</span>
                  </div>
                </div>
              </div>
              
              <!-- Kuwaiti Measurements -->
              <div class="kuwaiti-measurements">
                <div class="measurement-type-title">Kuwaiti Style / الطراز الكويتي</div>
                
                <!-- Kuwaiti Diagrams -->
                <div class="kuwaiti-diagrams">
                  <div class="section-diagram">
                    <img src="/diagram2.png" alt="Kuwaiti Front" class="diagram-image" />
                    <div class="diagram-label">Front</div>
                  </div>
                  <div class="section-diagram">
                    <img src="/diagram2.png" alt="Kuwaiti Back" class="diagram-image" />
                    <div class="diagram-label">Back</div>
                  </div>
                </div>
                
                <!-- Kuwaiti Measurements Grid -->
                <div class="measurement-grid">
                  <div class="measurement-item">
                    <span class="measurement-label">
                      الطول الأمامي<br>
                      <span class="arabic-label">Front Length</span>
                    </span>
                    <span class="measurement-value">${sale?.customer?.measurement?.kuwaiti?.frontLength || "___"}</span>
                  </div>
                  
                  <div class="measurement-item">
                    <span class="measurement-label">
                      الطول الخلفي<br>
                      <span class="arabic-label">Back Length</span>
                    </span>
                    <span class="measurement-value">${sale?.customer?.measurement?.kuwaiti?.backLength || "___"}</span>
                  </div>
                  
                  <div class="measurement-item">
                    <span class="measurement-label">
                      عرض الكتف<br>
                      <span class="arabic-label">Shoulder Width</span>
                    </span>
                    <span class="measurement-value">${sale?.customer?.measurement?.kuwaiti?.shoulder || "___"}</span>
                  </div>
                  
                  <div class="measurement-item">
                    <span class="measurement-label">
                      طول الكم<br>
                      <span class="arabic-label">Sleeve Length</span>
                    </span>
                    <span class="measurement-value">${sale?.customer?.measurement?.kuwaiti?.sleeves || "___"}</span>
                  </div>
                  
                  <div class="measurement-item">
                    <span class="measurement-label">
                      محيط الرقبة<br>
                      <span class="arabic-label">Neck Circumference</span>
                    </span>
                    <span class="measurement-value">${sale?.customer?.measurement?.kuwaiti?.neck || "___"}</span>
                  </div>
                  
                  <div class="measurement-item">
                    <span class="measurement-label">
                      محيط الخصر<br>
                      <span class="arabic-label">Waist Circumference</span>
                    </span>
                    <span class="measurement-value">${sale?.customer?.measurement?.kuwaiti?.waist || "___"}</span>
                  </div>
                  
                  <div class="measurement-item">
                    <span class="measurement-label">
                      محيط الصدر<br>
                      <span class="arabic-label">Chest Circumference</span>
                    </span>
                    <span class="measurement-value">${sale?.customer?.measurement?.kuwaiti?.chest || "___"}</span>
                  </div>
                  
                  <div class="measurement-item">
                    <span class="measurement-label">
                      العرض السفلي<br>
                      <span class="arabic-label">Bottom Width</span>
                    </span>
                    <span class="measurement-value">${sale?.customer?.measurement?.kuwaiti?.widthEnd || "___"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          `
              : ""
          }
          
          <div class="terms">
            <h4>Terms & Conditions</h4>
            <div class="terms-list">
              ${termsAndConditions
                .split("\n")
                .slice(0, 3)
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
  `);
    printWindow.document.close();
  };

  useEffect(() => {
    if (mode == "print" && !isLoading && sale) {
      handlePrint();
    }
  }, [mode, isLoading, sale]);

  if (isLoading || !sale) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-[300px] text-center">
          <CardContent className="space-y-4 py-8">
            <div className="w-10 h-10 mx-auto border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-lg font-medium text-gray-700">
              Loading invoice…
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="w-full max-w-md border-red-300">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              {(error as Error).message || "Failed to load invoice."}
            </p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
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

          {/* Customer Information */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Bill To:</h4>
            <div className="p-4 bg-muted/50 rounded-lg text-sm">
              <p className="font-medium">{sale.customer.name}</p>
              <p>{sale.customer.email}</p>
              <p>{sale.customer.phone}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Items</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sale.items && sale.items.length > 0 ? (
                  sale.items.map((item, index) => (
                    <TableRow key={item.id || index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell className="text-right">{item.qty}</TableCell>
                      <TableCell className="text-right">
                        AED {item.price}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        AED {item.total}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No items found
                    </TableCell>
                  </TableRow>
                )}
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
                <span>Discount ({sale.discountPercentage || 0}%):</span>
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
                <span>AED {sale.amountPaid || "0"}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-red-600 pt-2 border-t">
                <span>Amount Due:</span>
                <span>AED {sale.amountPending || "0"}</span>
              </div>
            </div>
          </div>

          {/* Payment & Notes */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t mb-6">
            
            <div>
              <h4 className="font-semibold mb-2">Notes</h4>
              <p className="text-sm">{sale.notes || "No notes provided"}</p>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="pt-6 border-t">
            <h4 className="font-semibold mb-3">Terms & Conditions</h4>
            <div className="p-4 bg-muted/50 rounded-lg text-sm space-y-1">
              {termsAndConditions
                ? termsAndConditions.split("\n").map((term, index) => (
                    <p key={index} className="text-muted-foreground">
                      {term}
                    </p>
                  ))
                : ""}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
