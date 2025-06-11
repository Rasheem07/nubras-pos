"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Package,
  Edit,
  XCircle,
  Loader2,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { productsApi, type ProductListItem } from "@/lib/api/products";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function CatalogPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "disable" | "enable";
    productId: number;
    productName: string;
  }>({
    open: false,
    type: "disable",
    productId: 0,
    productName: "",
  });

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: productsApi.getAll,
  });

  const disableProductMutation = useMutation({
    mutationFn: productsApi.disable,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
  const enableProductMutation = useMutation({
    mutationFn: productsApi.enabled,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (product) => !selectedCategory || product.category === selectedCategory
    );

  const getFilteredByTab = (products: ProductListItem[]) => {
    switch (activeTab) {
      case "ready-made":
        return products.filter((p) => p.type === "ready-made");
      case "custom":
        return products.filter((p) => p.type === "custom");
      case "services":
        return products.filter(
          (p) => p.type === "service" || p.type === "alteration"
        );
      case "fabrics":
        return products.filter((p) => p.type === "fabric");
      default:
        return products;
    }
  };

  const handleDisableProduct = (id: number, name: string) => {
    setConfirmDialog({
      open: true,
      type: "disable",
      productId: id,
      productName: name,
    });
  };

  const handleEnableProduct = (id: number, name: string) => {
    setConfirmDialog({
      open: true,
      type: "enable",
      productId: id,
      productName: name,
    });
  };

  const handleConfirmAction = () => {
    if (confirmDialog.type === "disable") {
      disableProductMutation.mutate(confirmDialog.productId);
    } else {
      enableProductMutation.mutate(confirmDialog.productId);
    }
    setConfirmDialog({
      open: false,
      type: "disable",
      productId: 0,
      productName: "",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In stock":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            In Stock
          </Badge>
        );
      case "Out of stock":
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">N/A</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Failed to load products</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Product Catalog</h1>
        <Button asChild>
          <Link href="/catalog/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, SKU, or barcode..."
            className="pl-8 w-full md:w-[300px] lg:w-[400px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select
          value={selectedCategory || "all"}
          onValueChange={(value) =>
            setSelectedCategory(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filter</span>
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="ready-made">Ready-made</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="fabrics">Fabrics</TabsTrigger>
        </TabsList>

        {["all", "ready-made", "custom", "services", "fabrics"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <ProductsTable
              products={getFilteredByTab(filteredProducts)}
              onDisable={handleDisableProduct}
              onEnable={handleEnableProduct}
              isDisabling={disableProductMutation.isPending}
            />
          </TabsContent>
        ))}
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {categories.length} categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter((p) => p.status === "In stock").length}
            </div>
            <p className="text-xs text-muted-foreground">Products available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter((p) => p.status === "Out of stock").length}
            </div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>
      </div>

      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.type === "disable"
                ? "Disable Product"
                : "Enable Product"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {confirmDialog.type} "
              {confirmDialog.productName}"?
              {confirmDialog.type === "disable"
                ? " This will make the product unavailable to customers."
                : " This will make the product available to customers again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={
                confirmDialog.type === "disable"
                  ? "bg-destructive hover:bg-destructive/90"
                  : ""
              }
            >
              {confirmDialog.type === "disable" ? "Disable" : "Enable"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface ProductsTableProps {
  products: ProductListItem[];
  onDisable: (id: number, name: string) => void;
  onEnable: (id: number, name: string) => void;
  isDisabling: boolean;
}

function ProductsTable({
  products,
  onDisable,
  onEnable,
  isDisabling,
}: ProductsTableProps) {
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In stock":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            In Stock
          </Badge>
        );
      case "Out of stock":
        return <Badge variant="destructive">Out of Stock</Badge>;
      case "Available":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Available
          </Badge>
        );
      case "Unavailable":
        return <Badge variant="destructive">Unavailable</Badge>;
      default:
        return <Badge variant="outline">N/A</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-6 text-muted-foreground"
              >
                <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2">No products found</p>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product, index) => (
              <TableRow
                key={`${product.sku}-${index}`}
                onClick={() => product.enabled ? router.push(`/catalog/${product.id}`) : onEnable(product.id, product.name)}
                className={`cursor-pointer relative ${!product.enabled && "bg-gray-100 text-gray-500 opacity-70"}`}
              >
                
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md overflow-hidden">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>AED {product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock ?? "N/A"}</TableCell>
                <TableCell>
                  {product.enabled ? (
                    getStatusBadge(product.status)
                  ) : (
                    <Badge variant="destructive">Disabled</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/catalog/${product.id}/edit`);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={`${product.enabled ? "text-destructive" : "text-green-600"}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (product.enabled) {
                            onDisable(product.id, product.name);
                          } else {
                            onEnable(product.id, product.name);
                          }
                        }}
                        disabled={isDisabling}
                      >
                        {product.enabled ? (
                          <>
                            <XCircle className="mr-2 h-4 w-4" /> Disable
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Enable
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
