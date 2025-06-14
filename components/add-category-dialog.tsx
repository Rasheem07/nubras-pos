"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { categoriesApi } from "@/lib/api/categories"
import { toast } from "sonner"

const addCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(50, "Category name must be less than 50 characters").trim(),
})

type AddCategoryFormData = z.infer<typeof addCategorySchema>

interface AddCategoryDialogProps {
  onCategoryAdded?: (categoryName: string) => void
}

export default function AddCategoryDialog({ onCategoryAdded }: AddCategoryDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<AddCategoryFormData>({
    //@ts-ignore
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      name: "",
    },
  })

  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => categoriesApi.create(name),
    onSuccess: (data, variables) => {
      toast.success(data.message)
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      // Call the callback to select the new category
      onCategoryAdded?.(variables)
      // Reset form and close dialog
      form.reset()
      setOpen(false)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const onSubmit = (data: AddCategoryFormData) => {
    createCategoryMutation.mutate(data.name)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="max-w-max justify-start">
          <Plus className="mr-1 h-4 w-4" />
          Add New Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>Create a new product category. This will be available for all products.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              placeholder="Enter category name"
              {...form.register("name")}
              disabled={createCategoryMutation.isPending}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset()
                setOpen(false)
              }}
              disabled={createCategoryMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createCategoryMutation.isPending}>
              {createCategoryMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Add Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
