"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  updateProductSchema,
  type UpdateProductFormData,
} from "@/lib/schemas/product";
import { productsApi } from "@/lib/api/products";
import { toast } from "sonner";
import { categoriesApi } from "@/lib/api/categories";
import { AddCategoryDialog } from "../../add/_components/add-category-dialog";

const categories = [
  "Kandura",
  "Abaya",
  "Accessories",
  "Custom Kandura",
  "Custom Abaya",
  "Alterations",
  "Fabrics",
  "Services",
];

const productTypes = [
  { value: "ready-made", label: "Ready-made" },
  { value: "custom", label: "Custom" },
  { value: "alteration", label: "Alteration" },
  { value: "fabric", label: "Fabric" },
  { value: "service", label: "Service" },
];

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const productId = Number.parseInt(params.id as string);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productsApi.getById(productId),
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
  });

  const form = useForm<UpdateProductFormData>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: product
      ? {
          name: product.name,
          sku: product.sku,
          barcode: product.barcode,
          sellingPrice: product.price,
          categoryName: product.category,
        }
      : undefined,
  });

  const updateProductMutation = useMutation({
    mutationFn: (data: UpdateProductFormData) =>
      productsApi.update(productId, data),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push(`/catalog/${productId}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: UpdateProductFormData) => {
    updateProductMutation.mutate(data);
  };

  const getProductTypeBadge = (type: string) => {
    switch (type) {
      case "ready-made":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Ready-made
          </Badge>
        );
      case "custom":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Custom
          </Badge>
        );
      case "alteration":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            Alteration
          </Badge>
        );
      case "fabric":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Fabric
          </Badge>
        );
      case "service":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Service
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Product not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/catalog/${productId}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to product</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
            <p className="text-muted-foreground">Update product information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/catalog/${productId}`}>Cancel</Link>
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={updateProductMutation.isPending}
          >
            {updateProductMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update the basic details about the product
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={form.watch("categoryName")}
                  onValueChange={(value) =>
                    form.setValue("categoryName", value)
                  }
                  disabled={isLoadingCategories}
                >
                  <SelectTrigger id="category">
                    <SelectValue
                      placeholder={
                        isLoadingCategories
                          ? "Loading categories..."
                          : "Select category"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingCategories ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="ml-2 text-sm">Loading...</span>
                      </div>
                    ) : (
                      <>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                        <div className="border-t mt-1 pt-1">
                          <AddCategoryDialog
                            onCategoryAdded={(categoryName: string) => {
                              form.setValue("categoryName", categoryName);
                            }}
                          />
                        </div>
                      </>
                    )}
                  </SelectContent>
                </Select>
                {form.formState.errors.categoryName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.categoryName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  placeholder="Enter SKU"
                  {...form.register("sku")}
                />
                {form.formState.errors.sku && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.sku.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  placeholder="Enter barcode"
                  {...form.register("barcode")}
                />
                {form.formState.errors.barcode && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.barcode.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>
              Set the selling price for this product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Selling Price (AED)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...form.register("sellingPrice")}
                />
                {form.formState.errors.sellingPrice && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.sellingPrice.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media & Description */}
        <Card>
          <CardHeader>
            <CardTitle>Media & Description</CardTitle>
            <CardDescription>
              Update product image and description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-md overflow-hidden bg-muted">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button variant="outline" size="sm" type="button">
                  <Upload className="mr-2 h-4 w-4" />
                  Change Image
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter product description"
                className="min-h-[100px]"
                {...form.register("description")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Category:</span>
                <p className="font-medium">{form.watch("categoryName")}</p>
              </div>
              <div>
                <span className="text-muted-foreground">SKU:</span>
                <p className="font-medium">{form.watch("sku")}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Price:</span>
                <p className="font-medium">
                  AED{" "}
                  {form.watch("sellingPrice")
                    ? Number.parseFloat(form.watch("sellingPrice")!).toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
