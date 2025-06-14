const BASE_URL = "http://localhost:5005/api/v1"

export interface InventoryItem {
  id: number
  name: string
  sku: string
  category: string
  uom: string
  description?: string
  cost: string
  stock: number
  minStock: number
  reorderPoint: number
  barcode?: string
  supplierId?: number
  weight?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export const inventoryApi = {
  // Get all inventory items
  getAll: async (): Promise<InventoryItem[]> => {
    const response = await fetch(`${BASE_URL}/inventory`)
    if (!response.ok) throw new Error("Failed to fetch inventory items")
    return response.json()
  },

  // Get inventory item by ID
  getById: async (id: number): Promise<InventoryItem> => {
    const response = await fetch(`${BASE_URL}/inventory/${id}`)
    if (!response.ok) throw new Error("Failed to fetch inventory item")
    return response.json()
  },
}
