"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { format } from "date-fns";
import { invoices } from "@/lib/invoice-data";

export default function InvoiceDetailPage() {
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const params = useParams() as {id: string};

  useEffect(() => {
    const foundInvoice = invoices.find((inv) => inv.id === params.id);
    if (foundInvoice) {
      setInvoice(foundInvoice);
    } else {
      router.push("/invoices");
    }
  }, [params.id, router]);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const printDocument = printWindow.document;

    printDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice?.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            
            body {
              font-family: 'Inter', sans-serif;
              margin: 0;
              padding: 0;
              color: #333;
              background-color: white;
              line-height: 1.6;
            }
            
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              background-color: white;
            }
            
            .invoice-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 50px;
              padding-bottom: 25px;
              border-bottom: 2px solid #f0f0f0;
            }
            
            .company-logo {
              font-size: 28px;
              font-weight: 700;
              color: #000;
              margin-bottom: 10px;
            }
            
            .company-info {
              margin-top: 12px;
              font-size: 14px;
              color: #555;
              line-height: 1.6;
            }
            
            .invoice-info {
              text-align: right;
            }
            
            .invoice-id {
              font-size: 24px;
              font-weight: 700;
              color: #000;
              margin-bottom: 12px;
            }
            
            .invoice-meta {
              font-size: 14px;
              color: #555;
              line-height: 1.6;
            }
            
            .status-badge {
              display: inline-block;
              padding: 6px 14px;
              border-radius: 9999px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              margin-top: 12px;
              letter-spacing: 0.5px;
            }
            
            .status-paid {
              background-color: #dcfce7;
              color: #166534;
            }
            
            .status-pending {
              background-color: #fef9c3;
              color: #854d0e;
            }
            
            .status-overdue {
              background-color: #fee2e2;
              color: #b91c1c;
            }
            
            .billing-section {
              margin-bottom: 40px;
            }
            
            .section-title {
              font-size: 16px;
              font-weight: 600;
              color: #000;
              margin-bottom: 10px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .customer-info {
              font-size: 14px;
              line-height: 1.6;
              padding: 15px;
              background-color: #f9f9f9;
              border-radius: 6px;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 40px 0;
            }
            
            th {
              background-color: #f3f4f6;
              padding: 14px 16px;
              text-align: left;
              font-size: 14px;
              font-weight: 600;
              color: #374151;
              border-top: 1px solid #e5e7eb;
              border-bottom: 1px solid #e5e7eb;
            }
            
            td {
              padding: 16px;
              font-size: 14px;
              border-bottom: 1px solid #e5e7eb;
              vertical-align: top;
            }
            
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            
            .text-right {
              text-align: right;
            }
            
            .totals-section {
              margin-top: 40px;
              padding-top: 20px;
            }
            
            .totals-table {
              width: 100%;
              max-width: 350px;
              margin-left: auto;
              margin-bottom: 40px;
              background-color: #f9fafb;
              padding: 20px;
              border-radius: 6px;
            }
            
            .totals-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              font-size: 14px;
            }
            
            .totals-row.grand-total {
              font-size: 18px;
              font-weight: 700;
              color: #000;
              padding-top: 15px;
              margin-top: 10px;
              border-top: 2px solid #e5e7eb;
            }
            
            .payment-info {
              margin-top: 40px;
              padding: 20px;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              background-color: #f9fafb;
              font-size: 14px;
              color: #555;
            }
            
            .payment-info p {
              margin: 8px 0;
            }
            
            .footer {
              margin-top: 60px;
              text-align: center;
              font-size: 14px;
              color: #777;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            
            .footer-note {
              margin-top: 10px;
              font-size: 12px;
            }
            
            @media print {
              body {
                background-color: white;
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
              
              .invoice-container {
                margin: 0;
                padding: 20px;
                box-shadow: none;
                max-width: 100%;
              }
              
              @page {
                margin: 0.5cm;
                size: A4;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <div>
                <div class="company-logo">Nubras Tailoring</div>
                <div class="company-info">
                  123 Al Wasl Road<br>
                  Dubai, UAE<br>
                  +971 50 123 4567<br>
                  info@nubrastailoring.com
                </div>
              </div>
              <div class="invoice-info">
                <div class="invoice-id">Invoice #${invoice?.id}</div>
                <div class="invoice-meta">
                  Issue Date: ${format(invoice?.date, "MMMM d, yyyy")}<br>
                  Due Date: ${format(
                    new Date(
                      invoice?.date.getTime() + 14 * 24 * 60 * 60 * 1000
                    ),
                    "MMMM d, yyyy"
                  )}
                </div>
                <div class="status-badge status-${invoice?.status.toLowerCase()}">${
      invoice?.status
    }</div>
              </div>
            </div>
            
            <div class="billing-section">
              <div class="section-title">Bill To</div>
              <div class="customer-info">
                <strong>${invoice?.customer}</strong><br>
                Customer ID: ${invoice?.id.substring(0, 3)}${Math.floor(
      Math.random() * 1000
    )}
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th class="text-right">Quantity</th>
                  <th class="text-right">Unit Price</th>
                  <th class="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${invoice?.items
                  .map(
                    (item: any) => `
                  <tr>
                    <td>${item.name}</td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-right">AED ${item.price.toLocaleString()}</td>
                    <td class="text-right">AED ${(
                      item.quantity * item.price
                    ).toLocaleString()}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
            
            <div class="totals-section">
              <div class="totals-table">
                <div class="totals-row">
                  <div>Subtotal:</div>
                  <div>AED ${invoice?.amount.toLocaleString()}</div>
                </div>
                <div class="totals-row">
                  <div>Tax (5%):</div>
                  <div>AED ${(invoice?.amount * 0.05).toLocaleString()}</div>
                </div>
                <div class="totals-row grand-total">
                  <div>Total:</div>
                  <div>AED ${(invoice?.amount * 1.05).toLocaleString()}</div>
                </div>
              </div>
            </div>
            
            <div class="payment-info">
              <div class="section-title">Payment Information</div>
              <p><strong>Payment Method:</strong> ${invoice?.paymentMethod}</p>
              <p>Please make payment within 14 days of invoice date.</p>
              <p>For any questions regarding this invoice, please contact our accounting department.</p>
            </div>
            
            <div class="footer">
              <p>Thank you for your business!</p>
              <p class="footer-note">This invoice was generated electronically and is valid without a signature.</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onfocus = function() {
                setTimeout(function() {
                  window.close();
                }, 500);
              }
            }
          </script>
        </body>
      </html>
    `);

    printDocument.close();
  };

  if (!invoice) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Invoice {invoice.id}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Invoice
          </Button>
        </div>
      </div>

      <div ref={printRef}>
        <Card className="p-8">
          <div className="flex flex-col md:flex-row justify-between mb-10 pb-6 border-b">
            <div>
              <h3 className="font-bold text-2xl mb-2">Nubras Tailoring</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>123 Al Wasl Road</p>
                <p>Dubai, UAE</p>
                <p>+971 50 123 4567</p>
                <p>info@nubrastailoring.com</p>
              </div>
            </div>
            <div className="mt-6 md:mt-0 md:text-right">
              <h3 className="font-bold text-2xl mb-2">Invoice #{invoice.id}</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Issue Date: {format(invoice.date, "MMMM d, yyyy")}</p>
                <p>
                  Due Date:{" "}
                  {format(
                    new Date(invoice.date.getTime() + 14 * 24 * 60 * 60 * 1000),
                    "MMMM d, yyyy"
                  )}
                </p>
              </div>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    invoice.status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : invoice.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {invoice.status}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="font-semibold text-base mb-3">Bill To:</h4>
            <div className="text-sm space-y-1">
              <p className="font-medium">{invoice.customer}</p>
              <p className="text-muted-foreground">
                Customer ID: {invoice.id.substring(0, 3)}
                {Math.floor(Math.random() * 1000)}
              </p>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">
                  Item Description
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Quantity
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Unit Price
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    AED {item.price.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    AED {(item.quantity * item.price).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-8 flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between py-2 text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>AED {invoice.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span className="text-muted-foreground">Tax (5%):</span>
                <span>AED {(invoice.amount * 0.05).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 text-base font-bold border-t pt-4 mt-2">
                <span>Total:</span>
                <span>AED {(invoice.amount * 1.05).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t space-y-4">
            <div>
              <h4 className="font-semibold text-base mb-2">
                Payment Information
              </h4>
              <p className="text-sm">Payment Method: {invoice.paymentMethod}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Please make payment within 14 days of invoice date.
              </p>
            </div>

            <div className="text-center mt-8 pt-6 border-t text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                Thank you for your business!
              </p>
              <p className="mt-1 text-xs">
                This invoice was generated electronically and is valid without a
                signature.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
