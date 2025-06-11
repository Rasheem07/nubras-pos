// File: components/DailySalesReport.tsx
"use client";

import React, { useRef } from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

////////////////////////////////////////////////////////////////////////////////
// 1) TypeScript Types
////////////////////////////////////////////////////////////////////////////////
// File: components/DailySalesReport.tsx

// ─── 1) Types ──────────────────────────────────────────────────────────────
interface Order {
  invoice_id: number;
  sales_date: string;
  product_name: string;
  qty: number;
  unit_price: number;
  total: number;
  visa_amount: number | null;
  bank_amount: number | null;
  cash_amount: number | null;
  paid_amount: number;
  total_amount: number;
  tax_amount: number;
  disc_amount: number;
  balance_amount: number;
  sales_person: string;
  delivery_date: string;
  order_status: string;
  order_payment_status: string;
}

interface DailyProduct {
  product_name: string;
  total_daily_qty: number;
  total_daily_amount: number;
  total_monthly_qty?: number | null;
  total_monthly_amount?: number | null;
}

interface NonKandoraDailyProduct {
  product_name: string;
  total_daily_sales_count: number;
  avg_daily_qty_sold: number;
  total_monthly_qty?: number | null;
  total_monthly_sales_count?: number | null;
  avg_monthly_qty_sold?: number | null;
  total_monthly_amount?: number | null;
}

interface Summary {
  total_daily_qty?: number | null;
  total_daily_amount?: number | null;
  total_monthly_qty?: number | null;
  total_monthly_amount?: number | null;
}

interface SectionData {
  orders: Order[];
  dailyProducts: DailyProduct[] | NonKandoraDailyProduct[];
  dailyOverall: Summary;
  monthlyProducts: DailyProduct[] | NonKandoraDailyProduct[];
  monthlyOverall: Summary;
  // Kandora‐only:
  paymentToday?: {
    visa_amount: number | null;
    bank_amount: number | null;
    cash_amount: number | null;
    total_paid: number | null;
  };
  paymentMonth?: {
    visa_amount: number | null;
    bank_amount: number | null;
    cash_amount: number | null;
    total_paid: number | null;
  };
  oldPayments?: {
    paid_date: string;
    paid_invoice_id: number;
    visa_amount: number;
    bank_amount: number;
    cash_amount: number;
    total_amount: number;
  }[];
  oldPaymentsSum?: {
    visa_amount: number;
    bank_amount: number;
    cash_amount: number;
    total_amount: number;
  };
  lastMonthPayments?: {
    month_year: string;
    visa_amount: number;
    bank_amount: number;
    cash_amount: number;
    total_amount: number;
  };
  lastMonthPending?: { last_month_pending: number };
  lastMonthPendBreakdown?: {
    visa_amount: number;
    bank_amount: number;
    cash_amount: number;
  };
  currentMonthPayments?: {
    visa_amount: number;
    bank_amount: number;
    cash_amount: number;
    total_paid_this_month: number;
  };
}
interface SectionSummary {
  section: string;
  visa_amount: number;
  bank_amount: number;
  cash_amount: number;
  paid_amount: number;
  total_amount: number;
  tax_amount: number;
  balance_amount: number;
}

interface DailyReport {
  kandora: SectionData;
  gentsItems: SectionData;
  juniorKid: SectionData;
  gentsJacket: SectionData;
  footwear: SectionData;
  overallLastMonth: {
    last_month_pending: number;
    old_received: number;
    breakdown: { visa: number; bank: number; cash: number; total: number };
  };
  dailySectionSummary: SectionSummary[];
  monthlySectionSummary: SectionSummary[];
  overallReceived: {
    old_balance_paid: number;
    current_paid: number;
    total_received: number;
  };
  overallMonth: {
    total_sales: number;
    total_pending: number;
  };
}

////////////////////////////////////////////////////////////////////////////////
// 2) Utility: format currency as “AED X,XXX.XX”
////////////////////////////////////////////////////////////////////////////////
function formatCurrency(num: number | null | undefined): string {
  if (num == null) return "AED 0.00";
  return (
    "AED " +
    num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

function sumFieldArr<T extends Record<string, any>>(
  arr: T[] = [],
  field: keyof T
): number {
  return arr.reduce((sum, cur) => sum + Number(cur[field] ?? 0), 0);
}

////////////////////////////////////////////////////////////////////////////////
// 3) Shared CSS for both on‐screen & print
////////////////////////////////////////////////////////////////////////////////
const reportStyles = `
  .report-container {
    width: 100%;
    margin: 0 auto;
    padding: 0;
    font-family: Arial, sans-serif;
    font-size: 10px;
    line-height: 1.2;
    color: #1f2937;
  }

  .header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #111827;
    padding: 4px 8px;
    margin-bottom: 6px;
  }
  .header-left {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .header-left img {
    width: 28px;
    height: 28px;
    object-fit: contain;
    border-radius: 3px;
  }
  .title {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
  }
  .subtitle,
  .header-date {
    font-size: 0.75rem;
    color: #374151;
  }

  .section-title {
    font-size: 1rem;
    font-weight: bold;
    margin: 8px 0 4px;
    color: #111827;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 3px;
  }

  .section-split {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }
  .left-column { flex: 2; }
  .right-column { flex: 1; }

  .section-box {
    border: 1px solid #e5e7eb;
    border-radius: 3px;
    background: #fff;
    margin-bottom: 8px;
  }
  .section-header {
    background: #f3f4f6;
    padding: 4px 6px;
    font-weight: 600;
    font-size: 0.8rem;
    border-bottom: 1px solid #e5e7eb;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9px;
  }
  th, td {
    border: 1px solid #e5e7eb;
    padding: 3px 4px;
    text-align: left;
    white-space: nowrap;
  }
  th {
    background: #f9fafb;
    font-weight: 600;
    color: #111827;
  }
  tr:nth-child(even) td {
    background: #fefefe;
  }
  .totals-row {
    background: #e0f2fe;
    font-weight: bold;
  }

  .status-badge {
    padding: 1px 4px;
    font-size: 7px;
    font-weight: 600;
    color: #fff;
    border-radius: 2px;
    display: inline-block;
  }
  .status-completed { background: #16a34a; }
  .status-partial   { background: #eab308; }
  .status-no-payment { background: #dc2626; }

  @media print {
    @page { size: A4 portrait; margin: 5mm; }
    html, body, .popup-container {
      width: 210mm;
      height: 297mm;
      margin: 0;
      padding: 0;
      background: #fff;
      font-size: 10px;
      line-height: 1.2;
    }
    .report-container {
      margin: 0;
      padding: 0;
    }
    .section-header,
    .totals-row,
    .status-completed,
    .status-partial,
    .status-no-payment {
      -webkit-print-color-adjust: exact;
    }
  }
`;

////////////////////////////////////////////////////////////////////////////////
// 4) Main Component
////////////////////////////////////////////////////////////////////////////////
export default function DailySalesReport() {
  const printRef = useRef<HTMLDivElement>(null);
  const today = format(new Date(), "yyyy-MM-dd");

  const { data, isLoading, isError, refetch } = useQuery<DailyReport>({
    queryKey: ["dailyReport", today],
    queryFn: async () => {
      const resp = await fetch("https://api.alnubras.co/api/v1/reports/daily");
      const json = await resp.json();
      if (!resp.ok) toast.error("Failed to load Daily report!");
      return json as DailyReport;
    },
    retry: false,
    refetchInterval: 1000 * 60,
  });

  // Loading state
  if (isLoading) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: reportStyles }} />
        <div
          style={{
            padding: "150px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Loader2 className="animate-spin h-6 w-6 text-gray-600" />
          <span style={{ fontSize: "10px" }}>Loading Daily Sales Report…</span>
        </div>
      </>
    );
  }

  // Error state
  if (isError || !data) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: reportStyles }} />
        <div
          style={{
            padding: "150px",
            textAlign: "center",
            color: "red",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "10px" }}>
            Failed to load Daily Sales Report.
          </span>
          <div style={{ display: "flex", gap: "6px" }}>
            <Button
              onClick={() => refetch()}
              variant="secondary"
              style={{ fontSize: "8px", padding: "3px 6px" }}
            >
              Retry
            </Button>
            <Button asChild style={{ fontSize: "8px", padding: "3px 6px" }}>
              <Link href="/reports">Back to Reports</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Print handler
  const handlePrint = () => {
    if (!printRef.current) return;
    const reportInnerHTML = printRef.current.innerHTML;
    const completeHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>Daily Sales Report</title>
          <style>${reportStyles}</style>
        </head>
        <body class="popup-container">
          ${reportInnerHTML}
        </body>
        </html>
      `;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(completeHTML);
    w.document.close();
    w.onload = () => {
      w.focus();
      w.print();
      setTimeout(() => w.close(), 500);
    };
  };

  // Sum helper
  const sumField = (orders: Order[] | undefined, field: keyof Order) =>
    (orders ?? []).reduce((sum, o) => sum + Number(o[field] ?? 0), 0);

  return (
    <>
      {/* Inject shared CSS */}
      <style dangerouslySetInnerHTML={{ __html: reportStyles }} />

      {/* Print Button (not printed) */}
      <div
        style={{
          padding: "4px 8px",
          background: "#f9fafb",
          textAlign: "right",
        }}
      >
        <button
          onClick={handlePrint}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "3px",
            cursor: "pointer",
            fontSize: "0.75rem",
          }}
        >
          Print / Save PDF
        </button>
      </div>

      {/* Report Container */}
      <div className="report-container" ref={printRef}>
        {/* Header */}
        <div className="header-bar">
          <div className="header-left">
            <img src="/logo.jpg" alt="Logo" />
            <div>
              <div className="title">Daily Sales Report</div>
              <div className="subtitle">All Sections</div>
            </div>
          </div>
          <div className="header-date">Date: {today}</div>
        </div>

        {/* Horizontal scroll only on screen */}
        <div className="scroll-container">
          {/* ====== 1) Kandora Section ====== */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="section-title">Kandora Section</div>
            <div className="section-split">
              {/* Left Column: Orders & Products Summary */}
              <div className="left-column">
                {/* Orders Table */}
                <div className="section-box">
                  <div className="section-header">ORDERS (KANDORA)</div>
                  <table>
                    <thead>
                      <tr>
                        <th>Sales Date</th>
                        <th>Invoice #</th>
                        <th>Products</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Visa</th>
                        <th>Bank</th>
                        <th>Cash</th>
                        <th>Paid</th>
                        <th>Total</th>
                        <th>Tax</th>
                        <th>Disc</th>
                        <th>Balance</th>
                        <th>Sales Person</th>
                        <th>Delivery Date</th>
                        <th>Status</th>
                        <th>Pay Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.kandora.orders.map((order) => {
                        const badgeClass =
                          order.order_payment_status === "completed"
                            ? "status-completed"
                            : order.order_payment_status === "partial"
                              ? "status-partial"
                              : "status-no-payment";

                        return (
                          <tr key={order.invoice_id}>
                            <td>{order.sales_date}</td>
                            <td>{order.invoice_id}</td>
                            <td>{order.product_name}</td>
                            <td>{order.qty}</td>
                            <td>{formatCurrency(order.unit_price)}</td>
                            <td>{formatCurrency(order.visa_amount)}</td>
                            <td>{formatCurrency(order.bank_amount)}</td>
                            <td>{formatCurrency(order.cash_amount)}</td>
                            <td>{formatCurrency(order.paid_amount)}</td>
                            <td>{formatCurrency(order.total)}</td>
                            <td>{formatCurrency(order.tax_amount)}</td>
                            <td>{formatCurrency(order.disc_amount)}</td>
                            <td>{formatCurrency(order.balance_amount)}</td>
                            <td>{order.sales_person}</td>
                            <td>{order.delivery_date}</td>
                            <td>{order.order_status}</td>
                            <td>
                              <span className={`status-badge ${badgeClass}`}>
                                {order.order_payment_status?.replace(
                                  "-",
                                  " "
                                ) ?? ""}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="totals-row">
                        <td colSpan={5} style={{ fontSize: "0.8rem" }}>
                          Grand Totals
                        </td>
                        <td>
                          {formatCurrency(
                            sumField(data.kandora.orders, "visa_amount")
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            sumField(data.kandora.orders, "bank_amount")
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            sumField(data.kandora.orders, "cash_amount")
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            sumField(data.kandora.orders, "paid_amount")
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            sumField(data.kandora.orders, "total_amount")
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            sumField(data.kandora.orders, "tax_amount")
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            sumField(data.kandora.orders, "disc_amount")
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            sumField(data.kandora.orders, "balance_amount")
                          )}
                        </td>
                        <td colSpan={3}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Products Summary */}
                <div className="section-box" style={{ marginTop: "6px" }}>
                  <div className="section-header">
                    Products Summary (Kandora)
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Total Qty (Daily)</th>
                        <th>Total Amount (Daily)</th>
                        <th>Total Qty (Monthly)</th>
                        <th>Total Amount (Monthly)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.kandora.dailyProducts.map((dp, i) => (
                        <tr key={i}>
                          <td>{(dp as DailyProduct).product_name}</td>
                          <td>{(dp as DailyProduct).total_daily_qty}</td>
                          <td>
                            {formatCurrency(
                              (dp as DailyProduct).total_daily_amount
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              (dp as DailyProduct).total_monthly_qty ?? 0
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              (dp as DailyProduct).total_monthly_amount ?? 0
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="totals-row">
                        <td style={{ fontWeight: "700" }}>Grand Totals</td>
                        <td>
                          {data.kandora.dailyOverall.total_daily_qty ?? 0}
                        </td>
                        <td>
                          {formatCurrency(
                            data.kandora.dailyOverall.total_daily_amount
                          )}
                        </td>
                        <td>
                          {data.kandora.dailyOverall.total_monthly_qty ?? 0}
                        </td>
                        <td>
                          {formatCurrency(
                            data.kandora.dailyOverall.total_monthly_amount
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Right Column: Payments (Kandora) */}
              <div className="right-column">
                {/* Payment Breakdown (Today) */}
                <div className="section-box">
                  <div className="section-header">
                    Payment Breakdown (Today)
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Visa</th>
                        <th>Bank</th>
                        <th>Cash</th>
                        <th>Total Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {formatCurrency(
                            data.kandora.paymentToday?.visa_amount
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            data.kandora.paymentToday?.bank_amount
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            data.kandora.paymentToday?.cash_amount
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            data.kandora.paymentToday?.total_paid
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Payment Breakdown (Current Month) */}
                <div className="section-box" style={{ marginTop: "6px" }}>
                  <div className="section-header">
                    Payment Breakdown (Current Month)
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Visa</th>
                        <th>Bank</th>
                        <th>Cash</th>
                        <th>Total Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {formatCurrency(
                            data.kandora.paymentMonth?.visa_amount
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            data.kandora.paymentMonth?.bank_amount
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            data.kandora.paymentMonth?.cash_amount
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            data.kandora.paymentMonth?.total_paid
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Old Payments (Before Today) */}
                <div className="section-box" style={{ marginTop: "6px" }}>
                  <div className="section-header">
                    Old Payments (Before Today)
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Paid Date</th>
                        <th>Invoice #</th>
                        <th>Visa</th>
                        <th>Bank</th>
                        <th>Cash</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.kandora.oldPayments?.map((op, i) => (
                        <tr key={i}>
                          <td>{op.paid_date}</td>
                          <td>{op.paid_invoice_id}</td>
                          <td>{formatCurrency(op.visa_amount)}</td>
                          <td>{formatCurrency(op.bank_amount)}</td>
                          <td>{formatCurrency(op.cash_amount)}</td>
                          <td>{formatCurrency(op.total_amount)}</td>
                        </tr>
                      )) ?? null}
                    </tbody>
                    <tfoot>
                      <tr className="totals-row">
                        <td colSpan={2} style={{ fontWeight: "700" }}>
                          Grand Total
                        </td>
                        <td>
                          {formatCurrency(
                            data.kandora.oldPaymentsSum?.visa_amount
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            data.kandora.oldPaymentsSum?.bank_amount
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            data.kandora.oldPaymentsSum?.cash_amount
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            data.kandora.oldPaymentsSum?.total_amount
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Last Month Payments & Pending */}
                <div className="section-box" style={{ marginTop: "6px" }}>
                  <div className="section-header">
                    Last Month (Payments & Pending)
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Month-Year</th>
                        <th>Visa</th>
                        <th>Bank</th>
                        <th>Cash</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {data.kandora.lastMonthPayments?.month_year ?? ""}
                        </td>
                        <td>
                          {formatCurrency(
                            data.kandora.lastMonthPayments?.visa_amount
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            data.kandora.lastMonthPayments?.bank_amount
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            data.kandora.lastMonthPayments?.cash_amount
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            data.kandora.lastMonthPayments?.total_amount
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table style={{ marginTop: "4px" }}>
                    <thead>
                      <tr>
                        <th>Last Month Pending</th>
                        <th>Visa (Pending Paid)</th>
                        <th>Bank (Pending Paid)</th>
                        <th>Cash (Pending Paid)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {formatCurrency(
                            data.kandora.lastMonthPending?.last_month_pending
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            data.kandora.lastMonthPendBreakdown?.visa_amount
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            data.kandora.lastMonthPendBreakdown?.bank_amount
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            data.kandora.lastMonthPendBreakdown?.cash_amount
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Current Month Payments */}
                <div
                  className="section-box"
                  style={{ marginTop: "6px", marginBottom: "12px" }}
                >
                  <div className="section-header">Current Month Payments</div>
                  <table>
                    <thead>
                      <tr>
                        <th>Visa</th>
                        <th>Bank</th>
                        <th>Cash</th>
                        <th>Total Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {formatCurrency(
                            data.kandora.currentMonthPayments?.visa_amount
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            data.kandora.currentMonthPayments?.bank_amount
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            data.kandora.currentMonthPayments?.cash_amount
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            data.kandora.currentMonthPayments
                              ?.total_paid_this_month
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ====== 2) Gents-Items Section ====== */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className="section-title">Gents-Items Section</div>
              <div className="section-split">
                {/* Left Column: Orders */}
                <div className="left-column">
                  <div className="section-box">
                    <div className="section-header">ORDERS (GENTS-ITEMS)</div>
                    <table>
                      <thead>
                        <tr>
                          <th>Sales Date</th>
                          <th>Invoice #</th>
                          <th>Product list</th>
                          <th>Qty</th>
                          <th>Unit Price</th>
                          <th>Visa</th>
                          <th>Bank</th>
                          <th>Cash</th>
                          <th>Paid</th>
                          <th>Total</th>
                          <th>Tax</th>
                          <th>Disc</th>
                          <th>Balance</th>
                          <th>Sales Person</th>
                          <th>Delivery Date</th>
                          <th>Status</th>
                          <th>Pay Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.gentsItems.orders.map((order) => {
                          const badgeClass =
                            order.order_payment_status === "completed"
                              ? "status-completed"
                              : order.order_payment_status === "partial"
                                ? "status-partial"
                                : "status-no-payment";
                          return (
                            <tr key={order.invoice_id}>
                              <td>{order.sales_date}</td>
                              <td>{order.invoice_id}</td>
                              <td>{order.product_name}</td>
                              <td>{order.qty}</td>
                              <td>{formatCurrency(order.unit_price)}</td>
                              <td>{formatCurrency(order.visa_amount)}</td>
                              <td>{formatCurrency(order.bank_amount)}</td>
                              <td>{formatCurrency(order.cash_amount)}</td>
                              <td>{formatCurrency(order.paid_amount)}</td>
                              <td>{formatCurrency(order.total_amount)}</td>
                              <td>{formatCurrency(order.tax_amount)}</td>
                              <td>{formatCurrency(order.disc_amount)}</td>
                              <td>{formatCurrency(order.balance_amount)}</td>
                              <td>{order.sales_person}</td>
                              <td>{order.delivery_date}</td>
                              <td>{order.order_status}</td>
                              <td>
                                <span className={`status-badge ${badgeClass}`}>
                                  {order.order_payment_status?.replace(
                                    "-",
                                    " "
                                  ) ?? ""}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="totals-row">
                          <td colSpan={5} style={{ fontSize: "0.8rem" }}>
                            Grand Totals
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.gentsItems.orders, "visa_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.gentsItems.orders, "bank_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.gentsItems.orders, "cash_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.gentsItems.orders, "paid_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.gentsItems.orders, "total_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.gentsItems.orders, "tax_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.gentsItems.orders, "disc_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.gentsItems.orders, "balance_amount")
                            )}
                          </td>
                          <td colSpan={3}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Right Column: Products Summary */}
                <div className="right-column">
                  <div className="section-box">
                    <div className="section-header">
                      CURRENT MONTH NUBRAS GENTS-ITEMS TOTAL PCS AND AMOUNT
                      SALES
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Monthly Qty</th>
                          <th>Sales Count</th>
                          <th>Daily Avg Sale</th>
                          <th>Total Amount (Monthly)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.gentsItems.monthlyProducts.map((dp, i) => (
                          <tr key={i}>
                            <td>{dp.product_name}</td>
                            <td>{dp.total_monthly_qty ?? 0}</td>
                            <td>
                              {(dp as NonKandoraDailyProduct)
                                .total_monthly_sales_count ?? 0}
                            </td>
                            <td>
                              {"avg_monthly_qty_sold" in dp
                                ? ((dp as NonKandoraDailyProduct)
                                    .avg_monthly_qty_sold ?? 0)
                                : 0}
                            </td>
                            <td>{formatCurrency(dp.total_monthly_amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="totals-row">
                          <td style={{ fontWeight: "700" }}>Grand Totals</td>
                          <td>
                            {data.gentsItems.monthlyOverall.total_monthly_qty ??
                              0}
                          </td>
                          <td></td>
                          <td></td>
                          <td>
                            {formatCurrency(
                              data.gentsItems.monthlyOverall
                                .total_monthly_amount
                            )}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* ====== 3) Junior-Kid Section ====== */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className="section-title">Junior-Kid Section</div>
              <div className="section-split">
                {/* Left Column: Orders */}
                <div className="left-column">
                  <div className="section-box">
                    <div className="section-header">ORDERS (JUNIOR-KID)</div>
                    <table>
                      <thead>
                        <tr>
                          <th>Sales Date</th>
                          <th>Invoice #</th>
                          <th>Product list</th>
                          <th>Qty</th>
                          <th>Unit Price</th>
                          <th>Visa</th>
                          <th>Bank</th>
                          <th>Cash</th>
                          <th>Paid</th>
                          <th>Total</th>
                          <th>Tax</th>
                          <th>Disc</th>
                          <th>Balance</th>
                          <th>Sales Person</th>
                          <th>Delivery Date</th>
                          <th>Status</th>
                          <th>Pay Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.juniorKid.orders.map((order) => {
                          const badgeClass =
                            order.order_payment_status === "completed"
                              ? "status-completed"
                              : order.order_payment_status === "partial"
                                ? "status-partial"
                                : "status-no-payment";

                          return (
                            <tr key={order.invoice_id}>
                              <td>{order.sales_date}</td>
                              <td>{order.invoice_id}</td>
                              <td>{order.product_name}</td>
                              <td>{order.qty}</td>
                              <td>{formatCurrency(order.unit_price)}</td>
                              <td>{formatCurrency(order.visa_amount)}</td>
                              <td>{formatCurrency(order.bank_amount)}</td>
                              <td>{formatCurrency(order.cash_amount)}</td>
                              <td>{formatCurrency(order.paid_amount)}</td>
                              <td>{formatCurrency(order.total_amount)}</td>
                              <td>{formatCurrency(order.tax_amount)}</td>
                              <td>{formatCurrency(order.disc_amount)}</td>
                              <td>{formatCurrency(order.balance_amount)}</td>
                              <td>{order.sales_person}</td>
                              <td>{order.delivery_date}</td>
                              <td>{order.order_status}</td>
                              <td>
                                <span className={`status-badge ${badgeClass}`}>
                                  {order.order_payment_status?.replace(
                                    "-",
                                    " "
                                  ) ?? ""}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="totals-row">
                          <td colSpan={5} style={{ fontSize: "0.8rem" }}>
                            Grand Totals
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.juniorKid.orders, "visa_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.juniorKid.orders, "bank_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.juniorKid.orders, "cash_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.juniorKid.orders, "paid_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.juniorKid.orders, "total_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.juniorKid.orders, "tax_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.juniorKid.orders, "disc_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.juniorKid.orders, "balance_amount")
                            )}
                          </td>
                          <td colSpan={3}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Right Column: Products Summary */}
                <div className="right-column">
                  <div className="section-box">
                    <div className="section-header">
                      CURRENT MONTH NUBRAS JUNIOR-KID TOTAL PCS AND AMOUNT SALES
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Monthly Qty</th>
                          <th>Sales Count</th>
                          <th>Daily Avg Sale</th>
                          <th>Total Amount (Monthly)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.juniorKid.monthlyProducts.map((dp, i) => (
                          <tr key={i}>
                            <td>{dp.product_name}</td>
                            <td>{dp.total_monthly_qty ?? 0}</td>
                            <td>
                              {(dp as NonKandoraDailyProduct)
                                .total_monthly_sales_count ?? 0}
                            </td>
                            <td>
                              {"avg_monthly_qty_sold" in dp
                                ? ((dp as NonKandoraDailyProduct)
                                    .avg_monthly_qty_sold ?? 0)
                                : 0}
                            </td>
                            <td>{formatCurrency(dp.total_monthly_amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="totals-row">
                          <td style={{ fontWeight: "700" }}>Grand Totals</td>
                          <td>
                            {data.juniorKid.monthlyOverall.total_monthly_qty ??
                              0}
                          </td>
                          <td></td>
                          <td></td>
                          <td>
                            {formatCurrency(
                              data.juniorKid.monthlyOverall.total_monthly_amount
                            )}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* ====== 4) Gents-Jacket Section ====== */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className="section-title">Gents-Jacket Section</div>
              <div className="section-split">
                {/* Left Column: Orders */}
                <div className="left-column">
                  <div className="section-box">
                    <div className="section-header">ORDERS (GENTS-JACKET)</div>
                    <table>
                      <thead>
                        <tr>
                          <th>Sales Date</th>
                          <th>Invoice #</th>
                          <th>Product list</th>
                          <th>Qty</th>
                          <th>Unit Price</th>
                          <th>Visa</th>
                          <th>Bank</th>
                          <th>Cash</th>
                          <th>Paid</th>
                          <th>Total</th>
                          <th>Tax</th>
                          <th>Disc</th>
                          <th>Balance</th>
                          <th>Sales Person</th>
                          <th>Delivery Date</th>
                          <th>Status</th>
                          <th>Pay Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.gentsJacket.orders.map((order) => {
                          const badgeClass =
                            order.order_payment_status === "completed"
                              ? "status-completed"
                              : order.order_payment_status === "partial"
                                ? "status-partial"
                                : "status-no-payment";
                          return (
                            <tr key={order.invoice_id}>
                              <td>{order.sales_date}</td>
                              <td>{order.invoice_id}</td>
                              <td>{order.product_name}</td>
                              <td>{order.qty}</td>
                              <td>{formatCurrency(order.unit_price)}</td>
                              <td>{formatCurrency(order.visa_amount)}</td>
                              <td>{formatCurrency(order.bank_amount)}</td>
                              <td>{formatCurrency(order.cash_amount)}</td>
                              <td>{formatCurrency(order.paid_amount)}</td>
                              <td>{formatCurrency(order.total_amount)}</td>
                              <td>{formatCurrency(order.tax_amount)}</td>
                              <td>{formatCurrency(order.disc_amount)}</td>
                              <td>{formatCurrency(order.balance_amount)}</td>
                              <td>{order.sales_person}</td>
                              <td>{order.delivery_date}</td>
                              <td>{order.order_status}</td>
                              <td>
                                <span className={`status-badge ${badgeClass}`}>
                                  {order.order_payment_status?.replace(
                                    "-",
                                    " "
                                  ) ?? ""}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="totals-row">
                          <td colSpan={5} style={{ fontSize: "0.8rem" }}>
                            Grand Totals
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.gentsJacket.orders, "visa_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.gentsJacket.orders, "bank_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.gentsJacket.orders, "cash_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.gentsJacket.orders, "paid_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.gentsJacket.orders, "total_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.gentsJacket.orders, "tax_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.gentsJacket.orders, "disc_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(
                                data.gentsJacket.orders,
                                "balance_amount"
                              )
                            )}
                          </td>
                          <td colSpan={3}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Right Column: Products Summary */}
                <div className="right-column">
                  <div className="section-box">
                    <div className="section-header">
                      CURRENT MONTH NUBRAS GENTS-JACKET TOTAL PCS AND AMOUNT
                      SALES
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Monthly Qty</th>
                          <th>Sales Count</th>
                          <th>Daily Avg Sale</th>
                          <th>Total Amount (Monthly)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.gentsJacket.monthlyProducts.map((dp, i) => (
                          <tr key={i}>
                            <td>{dp.product_name}</td>
                            <td>{dp.total_monthly_qty ?? 0}</td>
                            <td>
                              {(dp as NonKandoraDailyProduct)
                                .total_monthly_sales_count ?? 0}
                            </td>
                            <td>
                              {"avg_monthly_qty_sold" in dp
                                ? ((dp as NonKandoraDailyProduct)
                                    .avg_monthly_qty_sold ?? 0)
                                : 0}
                            </td>
                            <td>{formatCurrency(dp.total_monthly_amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="totals-row">
                          <td style={{ fontWeight: "700" }}>Grand Totals</td>
                          <td>
                            {data.gentsJacket.monthlyOverall
                              .total_monthly_qty ?? 0}
                          </td>
                          <td></td>
                          <td></td>
                          <td>
                            {formatCurrency(
                              data.gentsJacket.monthlyOverall
                                .total_monthly_amount
                            )}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* ====== 5) Footwear Section ====== */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div className="section-title">Footwear Section</div>
              <div className="section-split">
                {/* Left Column: Orders */}
                <div className="left-column">
                  <div className="section-box">
                    <div className="section-header">ORDERS (FOOTWEAR)</div>
                    <table>
                      <thead>
                        <tr>
                          <th>Sales Date</th>
                          <th>Invoice #</th>
                          <th>Product list</th>
                          <th>Qty</th>
                          <th>Unit Price</th>
                          <th>Visa</th>
                          <th>Bank</th>
                          <th>Cash</th>
                          <th>Paid</th>
                          <th>Total</th>
                          <th>Tax</th>
                          <th>Disc</th>
                          <th>Balance</th>
                          <th>Sales Person</th>
                          <th>Delivery Date</th>
                          <th>Status</th>
                          <th>Pay Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.footwear.orders.map((order) => {
                          const badgeClass =
                            order.order_payment_status === "completed"
                              ? "status-completed"
                              : order.order_payment_status === "partial"
                                ? "status-partial"
                                : "status-no-payment";
                          return (
                            <tr key={order.invoice_id}>
                              <td>{order.sales_date}</td>
                              <td>{order.invoice_id}</td>
                              <td>{order.product_name}</td>
                              <td>{order.qty}</td>
                              <td>{formatCurrency(order.unit_price)}</td>
                              <td>{formatCurrency(order.visa_amount)}</td>
                              <td>{formatCurrency(order.bank_amount)}</td>
                              <td>{formatCurrency(order.cash_amount)}</td>
                              <td>{formatCurrency(order.paid_amount)}</td>
                              <td>{formatCurrency(order.total_amount)}</td>
                              <td>{formatCurrency(order.tax_amount)}</td>
                              <td>{formatCurrency(order.disc_amount)}</td>
                              <td>{formatCurrency(order.balance_amount)}</td>
                              <td>{order.sales_person}</td>
                              <td>{order.delivery_date}</td>
                              <td>{order.order_status}</td>
                              <td>
                                <span className={`status-badge ${badgeClass}`}>
                                  {order.order_payment_status?.replace(
                                    "-",
                                    " "
                                  ) ?? ""}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="totals-row">
                          <td colSpan={5} style={{ fontSize: "0.8rem" }}>
                            Grand Totals
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.footwear.orders, "visa_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.footwear.orders, "bank_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.footwear.orders, "cash_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.footwear.orders, "paid_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.footwear.orders, "total_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.footwear.orders, "tax_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.footwear.orders, "disc_amount")
                            )}
                          </td>
                          <td>
                            {formatCurrency(
                              sumField(data.footwear.orders, "balance_amount")
                            )}
                          </td>
                          <td colSpan={3}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Right Column: Products Summary */}
                <div className="right-column">
                  <div className="section-box">
                    <div className="section-header">
                      CURRENT MONTH NUBRAS FOOTWEAR TOTAL PCS AND AMOUNT SALES
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Monthly Qty</th>
                          <th>Sales Count</th>
                          <th>Daily Avg Sale</th>
                          <th>Total Amount (Monthly)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.footwear.monthlyProducts.map((dp, i) => (
                          <tr key={i}>
                            <td>{dp.product_name}</td>
                            <td>{dp.total_monthly_qty ?? 0}</td>
                            <td>
                              {(dp as NonKandoraDailyProduct)
                                .total_monthly_sales_count ?? 0}
                            </td>
                            <td>
                              {"avg_monthly_qty_sold" in dp
                                ? ((dp as NonKandoraDailyProduct)
                                    .avg_monthly_qty_sold ?? 0)
                                : 0}
                            </td>
                            <td>{formatCurrency(dp.total_monthly_amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="totals-row">
                          <td style={{ fontWeight: "700" }}>Grand Totals</td>
                          <td>
                            {data.footwear.monthlyOverall.total_monthly_qty ??
                              0}
                          </td>
                          <td></td>
                          <td></td>
                          <td>
                            {formatCurrency(
                              data.footwear.monthlyOverall.total_monthly_amount
                            )}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* ====== 6) Overall Summaries ====== */}
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              {/* Left column: Last Month Balance & Received */}
              <div className="left-column">
                <div className="section-box">
                  <div className="section-header">Overall Summary (Today)</div>
                  <table>
                    <thead>
                      <tr>
                        <th>Section</th>
                        <th>Visa</th>
                        <th>Bank</th>
                        <th>Cash</th>
                        <th>Paid</th>
                        <th>Total</th>
                        <th>Tax</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.dailySectionSummary.map((s) => (
                        <tr key={s.section}>
                          <td>{s.section}</td>
                          <td>{formatCurrency(s.visa_amount)}</td>
                          <td>{formatCurrency(s.bank_amount)}</td>
                          <td>{formatCurrency(s.cash_amount)}</td>
                          <td>{formatCurrency(s.paid_amount)}</td>
                          <td>{formatCurrency(s.total_amount)}</td>
                          <td>{formatCurrency(s.tax_amount)}</td>
                          <td>{formatCurrency(s.balance_amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="totals-row">
                        <td style={{ fontWeight: "700" }}>Grand Totals</td>
                        <td>
                          {formatCurrency(
                            sumFieldArr(data.dailySectionSummary, "visa_amount")
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            sumFieldArr(data.dailySectionSummary, "bank_amount")
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            sumFieldArr(data.dailySectionSummary, "cash_amount")
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            sumFieldArr(data.dailySectionSummary, "paid_amount")
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            sumFieldArr(
                              data.dailySectionSummary,
                              "total_amount"
                            )
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            sumFieldArr(data.dailySectionSummary, "tax_amount")
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            sumFieldArr(
                              data.dailySectionSummary,
                              "balance_amount"
                            )
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* ====== Overall Summary By Section (This Month) ====== */}
                <div className="section-box" style={{ marginTop: "12px" }}>
                  <div className="section-header">
                    Overall Summary (Current Month)
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Section</th>
                        <th>Visa</th>
                        <th>Bank</th>
                        <th>Cash</th>
                        <th>Paid</th>
                        <th>Total</th>
                        <th>Tax</th>
                        <th>Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.monthlySectionSummary.map((s) => (
                        <tr key={s.section}>
                          <td>{s.section}</td>
                          <td>{formatCurrency(s.visa_amount)}</td>
                          <td>{formatCurrency(s.bank_amount)}</td>
                          <td>{formatCurrency(s.cash_amount)}</td>
                          <td>{formatCurrency(s.paid_amount)}</td>
                          <td>{formatCurrency(s.total_amount)}</td>
                          <td>{formatCurrency(s.tax_amount)}</td>
                          <td>{formatCurrency(s.balance_amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="totals-row">
                        <td style={{ fontWeight: "700" }}>Grand Totals</td>
                        <td>
                          {formatCurrency(
                            sumFieldArr(
                              data.monthlySectionSummary,
                              "visa_amount"
                            )
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            sumFieldArr(
                              data.monthlySectionSummary,
                              "bank_amount"
                            )
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            sumFieldArr(
                              data.monthlySectionSummary,
                              "cash_amount"
                            )
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            sumFieldArr(
                              data.monthlySectionSummary,
                              "paid_amount"
                            )
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            sumFieldArr(
                              data.monthlySectionSummary,
                              "total_amount"
                            )
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            sumFieldArr(
                              data.monthlySectionSummary,
                              "tax_amount"
                            )
                          )}
                        </td>
                        <td>
                          {formatCurrency(
                            sumFieldArr(
                              data.monthlySectionSummary,
                              "balance_amount"
                            )
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="section-box">
                  <div className="section-header">
                    Last Month Balance &amp; Received
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Last Month Pending</th>
                        <th>Old Received (This Month)</th>
                        <th>Visa</th>
                        <th>Bank</th>
                        <th>Cash</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {formatCurrency(
                            data.overallLastMonth.last_month_pending
                          )}
                        </td>
                        <td>
                          {formatCurrency(data.overallLastMonth.old_received)}
                        </td>
                        <td>
                          {formatCurrency(data.overallLastMonth.breakdown.visa)}
                        </td>
                        <td>
                          {formatCurrency(data.overallLastMonth.breakdown.bank)}
                        </td>
                        <td>
                          {formatCurrency(data.overallLastMonth.breakdown.cash)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right column: Total Received & Month Summary */}
              <div className="right-column">
                {/* Total Received */}
                <div className="section-box">
                  <div className="section-header">
                    Total Received (Old + Current)
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Old Balance Paid</th>
                        <th>Current Paid</th>
                        <th>Total Received</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {formatCurrency(
                            data.overallReceived.old_balance_paid
                          )}
                        </td>
                        <td>
                          {formatCurrency(data.overallReceived.current_paid)}
                        </td>
                        <td>
                          {formatCurrency(data.overallReceived.total_received)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* This Month Sales vs Pending */}
                <div className="section-box" style={{ marginTop: "6px" }}>
                  <div className="section-header">
                    This Month: Sales &amp; Pending
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Total Sales</th>
                        <th>Total Pending</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{formatCurrency(data.overallMonth.total_sales)}</td>
                        <td>
                          {formatCurrency(data.overallMonth.total_pending)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
