import type { CustomerMeasurement, CustomerGroup, CustomerDetail, Customer, CustomerStats } from "./types/customer"

const API_BASE_URL = "http://localhost:5005/api/v1"

// Helper function for fetch requests
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
     credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An unknown error occurred" }))
    throw new Error(error.message || `API error: ${response.status}`)
  }

  return response.json()
}

// Customer API functions
export const customerApi = {
  // Get all customer groups
  getAllCustomerGroups: async (): Promise<CustomerGroup[]> => {
    return fetchApi<CustomerGroup[]>("/customers")
  },

  // Get customer by ID
  getCustomerById: async (id: number): Promise<CustomerDetail> => {
    return fetchApi<CustomerDetail>(`/customers/${id}`)
  },

  // Get customer stats
  getCustomerStats: async (): Promise<CustomerStats> => {
    return fetchApi<CustomerStats>("/customers/stats")
  },

  // Create new customer
  createCustomer: async (customerData: {
    name: string
    phone: string
    email?: string
    status?: string
    measurement?: CustomerMeasurement
    preferences?: string[]
  }): Promise<{ message: string; newCustomer: Customer }> => {
    return fetchApi<{ message: string; newCustomer: Customer }>("/customers", {
      method: "POST",
      body: JSON.stringify(customerData),
    })
  },

  // Update customer
  updateCustomer: async (
    id: number,
    customerData: {
      name?: string
      phone?: string
      email?: string
      status?: string
      measurement?: CustomerMeasurement
      preferences?: string[]
    },
  ): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(`/customers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(customerData),
    })
  },

  // Delete customer
  deleteCustomer: async (id: number): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(`/customers/${id}`, {
      method: "DELETE",
    })
  },

  // Get customer list
  getCustomerList: async (): Promise<Customer[]> => {
    return fetchApi<Customer[]>("/customers/list")
  },
}
