// Types matching your backend schema
export interface Transaction {
  id: number
  orderId: number
  paymentMethod: "visa" | "bank_transfer" | "cash"
  amount: string
  createdAt: string
  updatedAt: string
}

export interface Order {
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
  paymentStatus: "no-payment" | "partial" | "completed"
  notes?: string
  priority: string
  paymentTerms: string
  dueDate: string
  deliveryDate?: string
  completedDate?: string
  quoteId?: number
  amountPaid: string
  amountPending: string
  paymentCompletedDate?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTransactionDto {
  orderId: number
  paymentMethod: "visa" | "bank_transfer" | "cash"
  amount: string
}

export interface UpdateTransactionDto {
  paymentMethod?: "visa" | "bank_transfer" | "cash"
  amount?: string
}

export interface ApiResponse<T> {
  message: string
  data?: T
}

export interface PaymentDetails {
    orderPaymentStatus: string;
    pendingAmount: string;
    paidAmount: string;
    totalAmount: string;
}