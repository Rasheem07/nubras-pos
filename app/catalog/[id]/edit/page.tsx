// Complete Frontend Code for Product Update with Optional Image Upload (React + React Hook Form)

"use client";
import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { updateProductSchema, type UpdateProductFormData } from "@/lib/schemas/product";
import { toast } from "sonner";

export default function ProductUpdatePage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const productId = Number.parseInt(params.id as string);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const res = await fetch(`https://api.alnubras.co/api/v1/products/${productId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch product");
      return res.json();
    },
  });

  const form = useForm<UpdateProductFormData>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: undefined,
  });

  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        sku: product.sku,
        barcode: product.barcode,
        sellingPrice: product.price,
        categoryName: product.category,
        description: product.description || "",
      });
    }
  }, [product, form]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key !== "image") {
          formData.append(key, value as string);
        }
      });

      const imageFile = imageInputRef.current?.files?.[0];
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch(`https://api.alnubras.co/api/v1/products/${productId}`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      router.push(`/catalog/${productId}`);
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-destructive">Product not found</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/catalog/${productId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Edit Product</h1>
        <Button
          onClick={form.handleSubmit((data) => mutation.mutate(data))}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save
        </Button>
      </div>

      <form className="space-y-6" onSubmit={form.handleSubmit((data) => mutation.mutate(data))}>
        <Card>
          <CardHeader>
            <CardTitle>Basic Info</CardTitle>
            <CardDescription>Details about the product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...form.register("name")} />
            </div>
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" {...form.register("sku")} />
            </div>
            <div>
              <Label htmlFor="barcode">Barcode</Label>
              <Input id="barcode" {...form.register("barcode")} />
            </div>
            <div>
              <Label htmlFor="price">Selling Price (AED)</Label>
              <Input id="price" type="number" step="0.01" {...form.register("sellingPrice")} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...form.register("description")} className="min-h-[100px]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Image</CardTitle>
            <CardDescription>Optional. Current image shown below</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <div className="w-24 h-24 bg-muted rounded-md overflow-hidden">
              <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <Input type="file" accept="image/*" ref={imageInputRef} />
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
