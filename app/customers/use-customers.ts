import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { customerApi } from "./api-client"
import { toast } from "sonner"
import type { Customer } from "./types/customer"

// Hook for fetching all customer groups
export function useCustomerGroups() {
  return useQuery({
    queryKey: ["customerGroups"],
    queryFn: customerApi.getAllCustomerGroups,
  })
}

// Hook for fetching customer stats
export function useCustomerStats() {
  return useQuery({
    queryKey: ["customerStats"],
    queryFn: customerApi.getCustomerStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for fetching a single customer by ID
export function useCustomer(id: number) {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => customerApi.getCustomerById(id),
    enabled: !!id,
  })
}

// Hook for fetching customer list
export function useCustomerList() {
  return useQuery({
    queryKey: ["customerList"],
    queryFn: customerApi.getCustomerList,
  })
}

// Hook for creating a new customer
export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: customerApi.createCustomer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["customerGroups"] })
      queryClient.invalidateQueries({ queryKey: ["customerList"] })
      queryClient.invalidateQueries({ queryKey: ["customerStats"] })
      toast.success("Customer created successfully")
      return data
    },
    onError: (error: any) => {
      toast.error(`Failed to create customer: ${error.message}`)
    },
  })
}

// Hook for updating a customer
export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Customer> }) => customerApi.updateCustomer(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customer", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["customerGroups"] })
      queryClient.invalidateQueries({ queryKey: ["customerList"] })
      queryClient.invalidateQueries({ queryKey: ["customerStats"] })
      toast.success("Customer updated successfully")
      return data
    },
    onError: (error: any) => {
      toast.error(`Failed to update customer: ${error.message}`)
    },
  })
}

// Hook for deleting a customer
export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: customerApi.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerGroups"] })
      queryClient.invalidateQueries({ queryKey: ["customerList"] })
      queryClient.invalidateQueries({ queryKey: ["customerStats"] })
      toast.success("Customer deleted successfully")
    },
    onError: (error: any) => {
      toast.error(`Failed to delete customer: ${error.message}`)
    },
  })
}
