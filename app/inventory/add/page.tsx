"use client";

import type React from "react";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import {
  ArrowLeft,
  Save,
  Package,
  Upload,
  X,
  Plus,
  Trash2,
  Info,
  Loader2,
  PlusCircle,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AddCategoryDialog from "@/components/add-category-dialog";
import { categoriesApi } from "@/lib/api/categories";

// API functions
const inventoryApi = {
  create: async (formData: FormData) => {
    const response = await fetch("https://api.alnubras.co/api/v1/inventory", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create inventory item");
    }

    return response.json();
  },
};

const suppliersApi = {
  getAll: async () => {
    const response = await fetch("https://api.alnubras.co/api/v1/suppliers", {
      method: "GET",
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch suppliers");
    }
    return response.json();
  },
};

// Product type enum matching the DTO
enum ProductType {
  READY_MADE = "ready-made",
  CUSTOM = "custom",
  BOTH = "both",
}

// Schema for custom models
const customModelSchema = z.object({
  name: z.string().min(1, "Model name is required"),
  charge: z.string().min(1, "Charge amount is required"),
});

// Schema matching the CreateInventoryDto
const inventorySchema = z
  .object({
    // Inventory fields
    name: z
      .string()
      .min(1, "Name is required")
      .max(75, "Name must be 75 characters or less"),
    sku: z.string().optional(), // Made optional since it's auto-generated
    category: z
      .string()
      .min(1, "Category is required")
      .max(15, "Category must be 15 characters or less"),
    uom: z.string().max(20, "UOM must be 20 characters or less").optional(),
    description: z.string().optional(),
    cost: z.string().min(1, "Cost is required"),
    stock: z.number().int().nonnegative().optional().default(0),
    minStock: z.number().int().min(1).optional().default(1),
    reorderPoint: z.number().int().nonnegative(),
    supplierId: z.number().int().positive().optional(),
    barcode: z.string().optional(),
    weight: z
      .string()
      .max(12, "Weight must be 12 characters or less")
      .optional(),
    notes: z.string().optional(),

    // Catalog fields
    type: z.enum([
      ProductType.READY_MADE,
      ProductType.CUSTOM,
      ProductType.BOTH,
    ]),
    sellingPrice: z.string().min(1, "Selling price is required"),
    categoryName: z.string().min(1, "Category name is required"),
    enabled: z.boolean().default(true),

    // Custom models for custom/both types
    models: z.array(customModelSchema).optional(),
  })
  .refine(
    (data) => {
      // Ensure reorderPoint is greater than or equal to minStock if minStock is provided
      if (data.minStock !== undefined && data.reorderPoint < data.minStock) {
        return false;
      }
      return true;
    },
    {
      message: "Reorder point must be greater than or equal to minimum stock",
      path: ["reorderPoint"],
    }
  );

type InventoryFormValues = z.infer<typeof inventorySchema>;

interface Supplier {
  id: number;
  name: string;
  phone: string;
  location?: string;
  email?: string;
}

interface Category {
  id: number;
  name: string;
}

export default function AddInventoryItemPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCreateSubCategoryOpen, setIsCreateSubCategoryOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // React Query hooks
  const { data: suppliers = [], isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ["suppliers"],
    queryFn: suppliersApi.getAll,
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  });

  const inventoryMutation = useMutation({
    mutationFn: inventoryApi.create,
    onSuccess: (data) => {
      toast.success(data.message || "Inventory item added successfully!");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      router.push("/inventory");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create inventory item"
      );
    },
  });

  // Form setup with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: "",
      sku: undefined, // Auto-generated
      category: "product",
      uom: "pc",
      description: "",
      cost: "",
      stock: 0,
      minStock: 1,
      reorderPoint: 1,
      barcode: undefined,
      weight: "",
      notes: "",
      type: ProductType.READY_MADE, // Default to "product"
      sellingPrice: "",
      categoryName: "",
      enabled: true,
      models: [],
    },
  });

  // Setup field array for custom models
  const { fields, append, remove } = useFieldArray({
    control,
    name: "models",
  });

  // Watch form values for conditional rendering
  const watchedValues = watch();
  const productType = watch("type");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/image\/(jpeg|png|gif|webp)/)) {
        toast.error("Only image files are allowed (jpg, png, gif, webp)");
        return;
      }

      // Validate file size (20MB max)
      if (file.size > 20 * 1024 * 1024) {
        toast.error("Image size must be less than 20MB");
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addCustomModel = () => {
    append({ name: "", charge: "" });
  };

  const onSubmit = async (data: InventoryFormValues) => {
    // Create FormData for multipart/form-data submission (for file upload)
    const formData = new FormData();

    // Add the image file if selected
    if (selectedFile) {
      formData.append("image", selectedFile);
    } else {
      toast.error("Please upload an image for the product");
      return;
    }

    // Add all form data as JSON
    Object.entries(data).forEach(([key, value]) => {
      if (key === "models") {
        // Skip models, we'll add them separately
      } else {
        formData.append(key, String(value));
      }
    });

    // Add models as JSON string if present
    if (
      data.models &&
      data.models.length > 0 &&
      (data.type === "custom" || data.type === "both")
    ) {
      formData.append("models", JSON.stringify(data.models));
    }

    // Submit using React Query mutation
    inventoryMutation.mutate(formData);
  };

  const uoms = ["pc", "meter", "kg", "liter", "box", "roll", "pair"];

  return (
    <div className="flex flex-col gap-5 relative pb-16">
      {/* Sticky header with save button */}
      <div className="sticky top-0 z-10 bg-background py-4 border-b">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/inventory">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              Add Inventory Item
            </h1>
          </div>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={inventoryMutation.isPending}
          >
            {inventoryMutation.isPending ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </div>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Item
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Main form */}
          <div className="lg:col-span-8 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Item Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter item name (max 75 chars)"
                      {...register("name")}
                      className={errors.name ? "border-red-500" : ""}
                      maxLength={75}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU (Auto-generated)</Label>
                    <Input
                      id="sku"
                      placeholder="Auto-generated by system"
                      disabled
                      className="bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-muted-foreground">
                      SKU will be automatically generated by the system
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="category"
                      placeholder="Auto-generated by system"
                      disabled
                      value={watchedValues.category}
                      className="bg-gray-50 text-gray-500"
                    />
                    <p className="text-xs text-muted-foreground">
                      Only products can be added here. To add other items, use
                      the Inventory module.
                    </p>

                    {errors.category && (
                      <p className="text-red-500 text-sm">
                        {errors.category.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uom">Unit of Measurement</Label>
                    <Select
                      onValueChange={(value) => setValue("uom", value)}
                      defaultValue={watchedValues.uom}
                    >
                      <SelectTrigger
                        id="uom"
                        className={errors.uom ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select UOM" />
                      </SelectTrigger>
                      <SelectContent>
                        {uoms.map((uom) => (
                          <SelectItem key={uom} value={uom}>
                            {uom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.uom && (
                      <p className="text-red-500 text-sm">
                        {errors.uom.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input
                      id="barcode"
                      placeholder="Enter barcode or leave empty"
                      {...register("barcode")}
                    />
                    {errors.barcode && (
                      <p className="text-red-500 text-sm">
                        {errors.barcode.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      If left empty, system will generate a barcode
                      automatically.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter item description"
                    {...register("description")}
                    rows={2}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cost">
                      Cost Price (AED) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="cost"
                      type="text"
                      placeholder="0.00"
                      {...register("cost")}
                      className={errors.cost ? "border-red-500" : ""}
                    />
                    {errors.cost && (
                      <p className="text-red-500 text-sm">
                        {errors.cost.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellingPrice">
                      Selling Price (AED){" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="sellingPrice"
                      type="text"
                      placeholder="0.00"
                      {...register("sellingPrice")}
                      className={errors.sellingPrice ? "border-red-500" : ""}
                    />
                    {errors.sellingPrice && (
                      <p className="text-red-500 text-sm">
                        {errors.sellingPrice.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplierId">Preferred Supplier</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("supplierId", Number.parseInt(value))
                      }
                      defaultValue={watchedValues.supplierId?.toString()}
                    >
                      <SelectTrigger id="supplierId">
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingSuppliers ? (
                          <div className="p-2">
                            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                          </div>
                        ) : (
                          suppliers.map((supplier: Supplier) => (
                            <SelectItem
                              key={supplier.id}
                              value={supplier.id.toString()}
                            >
                              {supplier.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {errors.supplierId && (
                      <p className="text-red-500 text-sm">
                        {errors.supplierId.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Stock Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Current Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="0"
                      {...register("stock", { valueAsNumber: true })}
                      className={errors.stock ? "border-red-500" : ""}
                    />
                    {errors.stock && (
                      <p className="text-red-500 text-sm">
                        {errors.stock.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minStock">Minimum Stock</Label>
                    <Input
                      id="minStock"
                      type="number"
                      placeholder="1"
                      {...register("minStock", { valueAsNumber: true })}
                      className={errors.minStock ? "border-red-500" : ""}
                    />
                    {errors.minStock && (
                      <p className="text-red-500 text-sm">
                        {errors.minStock.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reorderPoint">
                      Reorder Point <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="reorderPoint"
                      type="number"
                      placeholder="0"
                      {...register("reorderPoint", { valueAsNumber: true })}
                      className={errors.reorderPoint ? "border-red-500" : ""}
                    />
                    {errors.reorderPoint && (
                      <p className="text-red-500 text-sm">
                        {errors.reorderPoint.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Must be greater than or equal to minimum stock.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Catalog Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Catalog Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base">
                        Product Type <span className="text-red-500">*</span>
                      </Label>
                      <RadioGroup
                        defaultValue={watchedValues.type}
                        className="grid grid-cols-2 gap-4 pt-2"
                        onValueChange={(value) =>
                          setValue("type", value as ProductType)
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={ProductType.READY_MADE}
                            id="ready-made"
                          />
                          <Label htmlFor="ready-made">Ready Made</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            disabled
                            value={ProductType.CUSTOM}
                            id="custom"
                            className="disabled:opacity-75 font-semibold text-gray-400"
                          />
                          <Label htmlFor="custom">Custom</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={ProductType.BOTH} id="both" />
                          <Label htmlFor="both">Both</Label>
                        </div>
                      </RadioGroup>
                      {errors.type && (
                        <p className="text-red-500 text-sm">
                          {errors.type.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="categoryName">
                          Sub Category <span className="text-red-500">*</span>
                        </Label>
                        <AddCategoryDialog />
                      </div>
                      <Select
                        onValueChange={(value) =>
                          setValue("categoryName", value)
                        }
                        defaultValue={watchedValues.categoryName}
                      >
                        <SelectTrigger
                          id="categoryName"
                          className={
                            errors.categoryName ? "border-red-500" : ""
                          }
                        >
                          <SelectValue placeholder="Select sub category" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingCategories ? (
                            <div className="p-2">
                              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                            </div>
                          ) : (
                            categories.map((category: Category) => (
                              <SelectItem
                                key={category.id}
                                value={category.name}
                              >
                                {category.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {errors.categoryName && (
                        <p className="text-red-500 text-sm">
                          {errors.categoryName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enabled"
                        checked={watchedValues.enabled}
                        onCheckedChange={(checked) =>
                          setValue("enabled", checked)
                        }
                      />
                      <Label htmlFor="enabled">Enable in catalog</Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight</Label>
                      <Input
                        id="weight"
                        placeholder="Enter weight"
                        {...register("weight")}
                        className={errors.weight ? "border-red-500" : ""}
                      />
                      {errors.weight && (
                        <p className="text-red-500 text-sm">
                          {errors.weight.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Enter additional notes"
                        {...register("notes")}
                        rows={2}
                      />
                      {errors.notes && (
                        <p className="text-red-500 text-sm">
                          {errors.notes.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Custom Models Section - Only show for custom or both types */}
                {(productType === ProductType.CUSTOM ||
                  productType === ProductType.BOTH) && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="text-base">Custom Models</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addCustomModel}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Model
                      </Button>
                    </div>

                    {fields.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No custom models added. Click "Add Model" to create
                        variations of this product.
                      </p>
                    )}

                    <div className="space-y-3">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border p-3 rounded-md"
                        >
                          <div className="space-y-2 md:col-span-5">
                            <Label htmlFor={`models.${index}.name`}>
                              Model Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id={`models.${index}.name`}
                              placeholder="Model name"
                              {...register(`models.${index}.name`)}
                              className={
                                errors.models?.[index]?.name
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            {errors.models?.[index]?.name && (
                              <p className="text-red-500 text-sm">
                                {errors.models[index].name?.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2 md:col-span-5">
                            <Label htmlFor={`models.${index}.charge`}>
                              Additional Charge{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id={`models.${index}.charge`}
                              placeholder="0.00"
                              {...register(`models.${index}.charge`)}
                              className={
                                errors.models?.[index]?.charge
                                  ? "border-red-500"
                                  : ""
                              }
                            />
                            {errors.models?.[index]?.charge && (
                              <p className="text-red-500 text-sm">
                                {errors.models[index].charge?.message}
                              </p>
                            )}
                          </div>
                          <div className="md:col-span-2 flex justify-end">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right column - Image upload and summary */}
          <div className="lg:col-span-4 space-y-6">
            {/* Item Image */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>
                  Item Image <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Item preview"
                      className="w-full h-auto rounded-md object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                    <Package className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop an image or click to browse
                    </p>
                    <Input
                      id="image"
                      type="file"
                      ref={fileInputRef}
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("image")?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Barcode Info */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                If barcode is left empty, the system will automatically generate
                a barcode. The barcode image will be available on the item
                details page.
              </AlertDescription>
            </Alert>

            {/* Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">
                    {watchedValues.name || "Not set"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU:</span>
                  <span className="font-medium">Auto-generated</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">
                    {watchedValues.category || "Not set"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cost Price:</span>
                  <span className="font-medium">
                    {watchedValues.cost
                      ? `AED ${watchedValues.cost}`
                      : "Not set"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Selling Price:</span>
                  <span className="font-medium">
                    {watchedValues.sellingPrice
                      ? `AED ${watchedValues.sellingPrice}`
                      : "Not set"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product Type:</span>
                  <span className="font-medium">
                    {watchedValues.type || "Not set"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Stock:</span>
                  <span className="font-medium">
                    {watchedValues.stock || "0"}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={handleSubmit(onSubmit)}
                  disabled={inventoryMutation.isPending}
                >
                  {inventoryMutation.isPending ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Item
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
