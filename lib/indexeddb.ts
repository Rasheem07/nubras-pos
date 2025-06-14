// IndexedDB utilities for held orders
export interface HeldOrder {
  id: string
  customerName: string
  customerPhone: string
  items: any[]
  subtotal: number
  taxAmount: number
  discountAmount: number
  totalAmount: number
  paymentMethod: string
  paymentTerms: string
  deliveryDate?: Date
  notes: string
  priority: string
  createdAt: Date
}

class IndexedDBManager {
  private dbName = "nubras-pos"
  private version = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create held orders store
        if (!db.objectStoreNames.contains("heldOrders")) {
          const store = db.createObjectStore("heldOrders", { keyPath: "id" })
          store.createIndex("createdAt", "createdAt", { unique: false })
        }
      }
    })
  }

  async saveHeldOrder(order: HeldOrder): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["heldOrders"], "readwrite")
      const store = transaction.objectStore("heldOrders")
      const request = store.put(order)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getHeldOrders(): Promise<HeldOrder[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["heldOrders"], "readonly")
      const store = transaction.objectStore("heldOrders")
      const request = store.getAll()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  async deleteHeldOrder(id: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["heldOrders"], "readwrite")
      const store = transaction.objectStore("heldOrders")
      const request = store.delete(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
}

export const indexedDBManager = new IndexedDBManager()
