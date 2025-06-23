"use client"

import { useCallback } from "react"

const DB_NAME = "POSTerminal"
const DB_VERSION = 1
const STORE_NAME = "heldOrders"

export function useIndexedDB() {
  const openDB = useCallback((): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" })
        }
      }
    })
  }, [])

  const saveOrder = useCallback(
    async (order: any) => {
      const db = await openDB()
      const transaction = db.transaction([STORE_NAME], "readwrite")
      const store = transaction.objectStore(STORE_NAME)
      await store.put(order)
    },
    [openDB],
  )

  const getHeldOrders = useCallback(async () => {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], "readonly")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()

    return new Promise<any[]>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }, [openDB])

  const removeHeldOrder = useCallback(
    async (orderId: string) => {
      const db = await openDB()
      const transaction = db.transaction([STORE_NAME], "readwrite")
      const store = transaction.objectStore(STORE_NAME)
      await store.delete(orderId)
    },
    [openDB],
  )

  return {
    saveOrder,
    getHeldOrders,
    removeHeldOrder,
  }
}
