export interface Product {
  name: string
  qty: number
  unit_price: number
  total: number
}

export interface Order {
  invoice_id: number
  sales_date: string
  products: Product[]
  visa_amount: number
  bank_amount: number
  cash_amount: number
  paid_amount: number
  total_amount: number
  tax_amount: number
  disc_amount: number
  balance_amount: number
  sales_person: string
  delivery_date: string
  order_status: "confirmed" | "draft" | "cancelled" | "delivered"
  order_payment_status: "paid" | "unpaid" | "partial"
}

export interface DailyProduct {
  product_name: string
  total_daily_qty: number
  total_daily_amount: number
}

export interface DailyOverall {
  total_daily_qty: number
  total_daily_amount: number
}

export interface MonthlyProduct {
  product_name: string
  total_monthly_qty: number
  total_monthly_amount: number
}

export interface MonthlyOverall {
  total_monthly_qty: number
  total_monthly_amount: number
}

export interface PaymentSummary {
  visa_amount: number
  bank_amount: number
  cash_amount: number
  total_paid: number
}

export interface OldPayment {
  paid_date: string
  paid_invoice_id: number
  visa_amount: number
  bank_amount: number
  cash_amount: number
  total_amount: number
}

export interface OldPaymentsSum {
  visa_amount: number
  bank_amount: number
  cash_amount: number
  total_amount: number
}

export interface LastMonthPayments {
  month_year: string
  visa_amount: number
  bank_amount: number
  cash_amount: number
  total_amount: number
}

export interface LastMonthPending {
  last_month_pending: number
}

export interface LastMonthPendBreakdown {
  visa_amount: number
  bank_amount: number
  cash_amount: number
}

export interface CurrentMonthPayments {
  visa_amount: number
  bank_amount: number
  cash_amount: number
  total_paid_this_month: number
}

export interface KandoraReportData {
  orders: Order[]
  dailyProducts: DailyProduct[]
  dailyOverall: DailyOverall
  monthlyProducts: MonthlyProduct[]
  monthlyOverall: MonthlyOverall
  paymentToday: PaymentSummary
  paymentMonth: PaymentSummary
  oldPayments: OldPayment[]
  oldPaymentsSum: OldPaymentsSum
  lastMonthPayments: LastMonthPayments
  lastMonthPending: LastMonthPending
  lastMonthPendBreakdown: LastMonthPendBreakdown
  currentMonthPayments: CurrentMonthPayments
}
