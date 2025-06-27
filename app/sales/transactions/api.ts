import type { Transaction, Order, CreateTransactionDto, UpdateTransactionDto } from "./types"

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`

// Generic fetch wrapper with error handling
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint}`

  const response = await fetch(url, {
     credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Network error" }))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Transaction API functions
export const transactionApi = {
  // Get all transactions
  getAll: (): Promise<Transaction[]> => apiRequest("/transactions"),

  // Get transaction by ID
  getById: (id: number): Promise<Transaction> => apiRequest(`/transactions/${id}`),

  // Create new transaction
  create: (data: CreateTransactionDto): Promise<{ message: string }> =>
    apiRequest("/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update transaction
  update: (id: number, data: UpdateTransactionDto): Promise<{ message: string }> =>
    apiRequest(`/transactions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
}

// Sales API functions
export const salesApi = {
  // Get all orders
  getAll: (): Promise<Order[]> => apiRequest("/sales"),

  // Get order payment details
  getPaymentDetails: (id: number): Promise<Order> => apiRequest(`/sales/${id}/payment`),
}
