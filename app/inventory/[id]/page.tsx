"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  ArrowUpRight,
  Building,
  Tag,
  Download,
} from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import QRCode from "react-qr-code";
import QRCodeGenerator from "qrcode";

// API functions
const inventoryApi = {
  getById: async (id: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/inventory/${id}`, { credentials: "include" }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch item details");
    }
    return response.json();
  },

  deleteById: async (id: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/inventory/${id}`,
      {
        method: "DELETE",
         credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete item");
    }
    return response.json();
  },
};

const supplierApi = {
  getById: async (id: number) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/suppliers/${id}`,
      { credentials: "include"}
    );
    if (!response.ok) {
      throw new Error("Failed to fetch supplier details");
    }
    return response.json();
  },
};

interface CustomModel {
  id: number;
  productId: number;
  name: string;
  charge: string;
  createdAt: string;
  updatedAt: string;
}

interface Catalog {
  id: number;
  type: "ready-made" | "custom" | "both" | "product";
  name: string;
  sku: string;
  barcode?: string;
  itemId: number;
  sellingPrice: string;
  image?: string;
  description?: string;
  enabled: boolean;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

interface Restock {
  id: number;
  itemId: number;
  qty: number;
  cost: string;
  total: string;
  supplierId: number;
  invNo?: string;
  restockDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category: string;
  uom: string;
  description?: string;
  cost: string;
  stock: number;
  minStock: number;
  reorderPoint: number;
  barcode?: string;
  barcodeImageUrl?: string;
  supplierId?: number;
  weight?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  catalog: Catalog;
  models: CustomModel[];
  restocks: Restock[];
}

interface Supplier {
  id: number;
  name: string;
  phone: string;
  location?: string;
  email?: string;
}

export default function InventoryItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProductImage, setIsProductImage] = useState(false);
  const itemId = params.id as string;

  // React Query hooks
  const {
    data: item,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["inventory", itemId],
    queryFn: () => inventoryApi.getById(itemId),
  });

  const { data: supplier } = useQuery({
    queryKey: ["supplier", item?.supplierId],
    queryFn: () =>
      item?.supplierId ? supplierApi.getById(item.supplierId) : null,
    enabled: !!item?.supplierId,
  });

  const deleteMutation = useMutation({
    mutationFn: () => inventoryApi.deleteById(itemId),
    onSuccess: (data) => {
      toast.success(data.message || "Item deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      router.push("/inventory");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete item"
      );
    },
    onSettled: () => {
      setIsDeleteDialogOpen(false);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const getStockStatus = (stock: number, reorderPoint: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stock <= reorderPoint) {
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
          Low Stock
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          In Stock
        </Badge>
      );
    }
  };

  const getProductTypeLabel = (type: string) => {
    switch (type) {
      case "ready-made":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Ready Made
          </Badge>
        );
      case "custom":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
            Custom
          </Badge>
        );
      case "both":
        return (
          <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">
            Ready Made & Custom
          </Badge>
        );
      case "product":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Product
          </Badge>
        );
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const downloadBarcode = () => {
    if (!item.barcodeImageUrl) return;

    try {
      // 1) Extract the S3 object key (everything after the bucket host):
      //    URL: https://nubras-erp.s3.us-east-1.amazonaws.com/barcodes/foo.png
      //    pathname: "/barcodes/foo.png"
      const { pathname } = new URL(item.barcodeImageUrl);
      const key = pathname.split("/")[2]; // removes leading '/'

      console.log(key);

      // 2) Build your proxy URL
      const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/inventory/barcodes/${encodeURIComponent(key)}`;

      // 3) Trigger the download
      const link = document.createElement("a");
      link.target = "_blank";
      link.href = downloadUrl;
      link.download = `barcode-${item.sku || item.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download barcode:", err);
      toast.error("Could not download barcode");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/inventory">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Skeleton className="h-9 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
                <CardDescription>
                  Basic information about the inventory item
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Catalog Information</CardTitle>
                <CardDescription>
                  Product details as shown in the catalog
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Restock History</CardTitle>
                <CardDescription>
                  Complete record of all restocks for this item
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Product Image</CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Stock Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
                <Separator />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-2">Error Loading Item</h2>
        <p className="text-muted-foreground mb-4">
          {error instanceof Error
            ? error.message
            : "Failed to load inventory item"}
        </p>
        <Button asChild>
          <Link href="/inventory">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Inventory
          </Link>
        </Button>
      </div>
    );
  }

  // Not found state
  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-2">Item Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The inventory item you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link href="/inventory">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Inventory
          </Link>
        </Button>
      </div>
    );
  }

  // Calculate statistics
  const totalRestockQty = item.restocks.reduce(
    (sum: number, restock: any) => sum + restock.qty,
    0
  );
  const totalRestockValue = item.restocks.reduce(
    (sum: number, restock: any) => sum + Number.parseFloat(restock.total),
    0
  );
  const avgCostPrice =
    totalRestockQty > 0
      ? totalRestockValue / totalRestockQty
      : Number.parseFloat(item.cost);

  const productUrl = `${window.location.origin}/inventory/${item?.id}`;

  // Download QR as PNG
  const downloadQr = async () => {
    try {
      const dataUrl = await QRCodeGenerator.toDataURL(productUrl);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `qr-${item?.sku || item?.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("QR download failed", err);
      toast.error("Could not download QR code");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/inventory">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{item.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/inventory/${itemId}/restock`}>
              <Package className="mr-2 h-4 w-4" />
              Restock
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/inventory/${itemId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
              <CardDescription>
                Basic information about the inventory item
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      SKU
                    </h3>
                    <p>{item.sku}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Category
                    </h3>
                    <p>{item.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Unit of Measure
                    </h3>
                    <p>{item.uom}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Barcode
                    </h3>
                    <p>{item.barcode || "Auto-generated"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Supplier
                    </h3>
                    {supplier ? (
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <Link
                          href={`/inventory/suppliers/${supplier.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {supplier.name}
                        </Link>
                      </div>
                    ) : (
                      <p>Not set</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Weight
                    </h3>
                    <p>{item.weight || "Not set"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Created
                    </h3>
                    <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </h3>
                    <p>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'Not updated'}</p>
                  </div>
                </div>
                {item.barcodeImageUrl && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Barcode</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-md border mb-3 w-full flex justify-center">
                  <img
                    src={item.barcodeImageUrl || "/placeholder.svg"}
                    alt={`Barcode for ${item.sku || item.name}`}
                    className="max-h-20"
                  />
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={downloadBarcode}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Barcode
                </Button>
              </CardContent>
            </Card>
          )}
           <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Save and access this page instantly</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {/* QR Code */}
              {item && (
                <div className="bg-white p-4 rounded-md border mb-3">
                  <QRCode value={productUrl} size={128} />
                </div>
              )}

              {/* Download Button */}
              <Button variant="outline" onClick={downloadQr}>
                <Download className="mr-2 h-4 w-4" />
                Download QR
              </Button>
            </CardContent>
          </Card>
              </div>

              {item.description && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Description
                    </h3>
                    <p>{item.description}</p>
                  </div>
                </>
              )}

              {item.notes && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Notes
                    </h3>
                    <p>{item.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Catalog Information */}
          <Card>
            <CardHeader>
              <CardTitle>Catalog Information</CardTitle>
              <CardDescription>
                Product details as shown in the catalog
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Product Type
                    </h3>
                    <div className="mt-1">
                      {getProductTypeLabel(item.catalog.type)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Sub Category
                    </h3>
                    <p>{item.catalog.category_name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Selling Price
                    </h3>
                    <p className="font-medium">
                      AED{" "}
                      {Number.parseFloat(item.catalog.selling_price).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Status
                    </h3>
                    <Badge
                      className={
                        item.catalog.enabled
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {item.catalog.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  {item.catalog.image && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Product Image
                      </h3>
                      <Dialog>
                        <DialogTrigger>
                          <img
                            src={item.catalog.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-32 h-32 object-contain rounded-md border cursor-pointer"
                          />
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <img
                            src={item.catalog.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-contain max-h-[85vh] rounded-md border cursor-pointer"
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Models - Only show if product type is custom or both */}
              {(item.catalog.type === "custom" ||
                item.catalog.type === "both") &&
                item.models.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h3 className="text-base font-medium mb-3">
                        Custom Models
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {item.models.map((model: CustomModel) => (
                          <div
                            key={model.id}
                            className="flex items-center justify-between p-3 border rounded-md"
                          >
                            <div className="flex items-center">
                              <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{model.name}</span>
                            </div>
                            <Badge variant="outline">
                              +AED {Number.parseFloat(model.charge).toFixed(2)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Restock History</CardTitle>
              <CardDescription>
                Complete record of all restocks for this item
              </CardDescription>
            </CardHeader>
            <CardContent>
              {item.restocks && item.restocks.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {item.restocks.map((restock: Restock) => (
                      <TableRow key={restock.id}>
                        <TableCell>
                          {new Date(restock.restockDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <ArrowUpRight className="mr-1 h-4 w-4 text-green-600" />
                            {restock.qty} {item.uom}
                          </div>
                        </TableCell>
                        <TableCell>
                          AED {Number.parseFloat(restock.cost).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          AED {Number.parseFloat(restock.total).toFixed(2)}
                        </TableCell>
                        <TableCell>{restock.invNo || "-"}</TableCell>
                        <TableCell>{restock.notes || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2">No restock history found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Barcode Quick Access */}
          


          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Stock Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Stock:</span>
                <div className="flex items-center">
                  <span className="font-medium text-lg">
                    {item.stock} {item.uom}
                  </span>
                  {item.stock <= item.minStock && item.stock > 0 && (
                    <AlertTriangle className="ml-2 h-4 w-4 text-amber-500" />
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Minimum Stock:</span>
                <span className="font-medium">
                  {item.minStock} {item.uom}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Reorder Point:</span>
                <span className="font-medium">
                  {item.reorderPoint} {item.uom}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <div>{getStockStatus(item.stock, item.reorderPoint)}</div>
              </div>
              <Separator />
              <Button className="w-full" asChild>
                <Link href={`/inventory/${itemId}/restock`}>
                  <Package className="mr-2 h-4 w-4" />
                  Restock Item
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Pricing & Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Cost:</span>
                <span className="font-medium">
                  AED {Number.parseFloat(item.cost).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Selling Price:</span>
                <span className="font-medium">
                  AED {Number.parseFloat(item.catalog.sellingPrice).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Profit Margin:</span>
                <span className="font-medium">
                  {(() => {
                    const cost = Number.parseFloat(item.cost);
                    const price = Number.parseFloat(item.catalog.sellingPrice);
                    const margin = ((price - cost) / price) * 100;
                    return `${margin.toFixed(1)}%`;
                  })()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Average Cost:</span>
                <span className="font-medium">
                  AED {avgCostPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Value:</span>
                <span className="font-medium">
                  AED {(item.stock * Number.parseFloat(item.cost)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Restocks:</span>
                <span className="font-medium">{item.restocks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Restocked:</span>
                <span className="font-medium">
                  {totalRestockQty} {item.uom}
                </span>
              </div>
            </CardContent>
          </Card>

         
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href={`/inventory/${itemId}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Item
                </Link>
              </Button>
              {supplier && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={`/inventory/suppliers/${supplier.id}`}>
                    <Building className="mr-2 h-4 w-4" />
                    View Supplier
                  </Link>
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href={`/catalog/products/${item.catalog.id}`}>
                  <Package className="mr-2 h-4 w-4" />
                  View in Catalog
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. This will permanently delete the
              inventory item.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
