const BASE_URL = "https://api.alnubras.co/api/v1"

export interface Category {
  id: number
  name: string
}

export const categoriesApi = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    const response = await fetch(`${BASE_URL}/products/list/categories`)
    if (!response.ok) throw new Error("Failed to fetch categories")
    return response.json()
  },

  // Create new category
  create: async (name: string): Promise<{ message: string }> => {
    const response = await fetch(`${BASE_URL}/products/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create category")
    }

    return response.json()
  },
}
