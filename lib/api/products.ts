const BASE_URL = "http://localhost:5005/api/v1";

export interface Product {
  id: number;
  type: "ready-made" | "custom" | "alteration" | "fabric" | "service";
  name: string;
  sku: string;
  barcode: string;
  itemId?: number;
  sellingPrice: string;
  image?: string;
  description?: string;
  enabled: boolean;
  categoryName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductListItem {
  id: number;
  name: string;
  image?: string;
  sku: string;
  category: string;
  price: number;
  stock?: number;
  type: string;
  status: "In stock" | "Out of stock";
  enabled: boolean;
}

export interface ProductDetail {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  image?: string;
  category: string;
  price: string;
  stock?: number;
  minQty?: number;
  inStock: boolean;
  type: string;
  status: string;
  enabled: boolean;
  recentOrders: Array<{
    orderId: number;
    orderedAt: Date;
    customerId: number;
    customerName: string;
    qty: number;
    unitPrice: string;
    itemTotal: string;
  }>;
  topCustomers: Array<{
    customerId: number;
    customerName: string;
    totalQty: number;
    orderCount: number;
  }>;
}

export interface CreateProductData {
  type: "ready-made" | "custom" | "alteration" | "fabric" | "service";
  name: string;
  sku: string;
  barcode: string;
  itemId?: number;
  sellingPrice: string;
  description?: string;
  categoryName: string;
}

export interface UpdateProductData {
  type?: "ready-made" | "custom" | "alteration" | "fabric" | "service";
  name?: string;
  sku?: string;
  barcode?: string;
  itemId?: number;
  sellingPrice?: string;
  description?: string;
  categoryName?: string;
}

export interface GroupedProduct {
  category: string;
  items: Array<{
    id: number;
    name: string;
    price: string;
    sku: string;
    image?: string;
  }>;
}

export const productsApi = {
  // Get all products
  getAll: async (): Promise<ProductListItem[]> => {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  // Get product by ID
  getById: async (id: number): Promise<ProductDetail> => {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return response.json();
  },

  // Create product with image
  create: async (
    data: CreateProductData,
    image: File
  ): Promise<{ message: string }> => {
    const formData = new FormData();
    formData.append("image", image);

    // Append all product data
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create product");
    }

    return response.json();
  },

  // Update product
  update: async (
    id: number,
    data: UpdateProductData
  ): Promise<{ message: string }> => {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update product");
    }

    return response.json();
  },

  // Disable & enable product
  disable: async (id: number): Promise<{ message: string }> => {
    const response = await fetch(`${BASE_URL}/products/${id}/disable`, {
      method: "PATCH",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to disable product");
    }

    return response.json();
  },

  enabled: async (id: number): Promise<{ message: string }> => {
    const response = await fetch(`${BASE_URL}/products/${id}/enable`, {
      method: "PATCH",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to enable product");
    }

    return response.json();
  },

  // Get active products grouped by category
  getActiveGrouped: async (): Promise<GroupedProduct[]> => {
    const response = await fetch(`${BASE_URL}/products/list/catalog`);
    if (!response.ok) throw new Error("Failed to fetch grouped products");
    return response.json();
  },

  // Get all active products
  getAllActive: async (): Promise<
    Array<{
      id: number;
      image?: string;
      name: string;
      price: string;
      category: string;
      sku: string;
    }>
  > => {
    const response = await fetch(`${BASE_URL}/products/list/products`);
    if (!response.ok) throw new Error("Failed to fetch active products");
    return response.json();
  },
};
