// Measurement details for Arabic & Kuwaiti styles
export interface MeasurementDetails {
  frontLength: number
  backLength: number
  shoulder: number
  sleeves: number
  neck: number
  waist: number
  chest: number
  widthEnd: number
  notes?: string
}

// Top-level measurement class
export interface CustomerMeasurement {
  arabic: MeasurementDetails
  kuwaiti: MeasurementDetails
}

// Customer interface
export interface Customer {
  id: number
  grpId: number
  phone: string
  name: string
  email?: string
  status: string
  measurement?: CustomerMeasurement
  preferences?: string[]
  createdAt?: string
  updatedAt?: string
}

// Customer group interface (matches your service response)
export interface CustomerGroup {
  groupId: number
  name: string
  phone: string
  totalSpent: number
  customerCount: number
  customers: {
    id: number
    name: string
    status: string
    preferences?: string[]
    ordersCount?: number
    totalSpent?: number
    lastPurchaseDate?: string
  }[]
}

// Customer detail interface (matches your service findOne response)
export interface CustomerDetail {
  id: number
  name: string
  phone: string
  email?: string
  groupId: number
  groupCode: string
  joinedYear: number
  status: string
  totalSpent: number
  totalOrders: number
  averageOrderValue: number
  groupMembersCount: number
  groupMembers: {
    id: number
    name: string
    status: string
    totalSpent: number
  }[]
  preferences?: string[]
  measurement?: CustomerMeasurement
  orderHistory: {
    orderId: number
    orderDate: string
    itemCount: number
    totalAmount: number
    orderStatus: string
  }[]
}

// Customer stats interface (matches your service getStats response)
export interface CustomerStats {
  totalGroups: number
  groupsChange: number
  groupsPercentChange: number | null
  totalCustomers: number
  customersChange: number
  customersPercentChange: number | null
  totalVips: number
  vipsChange: number
  vipsPercentChange: number | null
  totalRevenue: number
  revenueChange: number
  revenuePercentChange: number | null
}

// Form data types
export interface CreateCustomerFormData {
  name: string
  phone: string
  email?: string
  status?: string
}

export interface UpdateCustomerFormData {
  name?: string
  phone?: string
  email?: string
  status?: string
}
