import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus } from "lucide-react";
// Product Card Component with image preview on hover
export default function ProductCard({
  product,
  onAdd,
  onCustomAdd,
  disabled = false,
}: {
  product: any;
  onAdd: () => void;
  onCustomAdd?: () => void;
  disabled?: boolean;
}) {
  const [showPreview, setShowPreview] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (product.image) {
      timeoutRef.current = setTimeout(() => {
        setShowPreview(true);
      }, 300); // Slightly longer delay for better UX
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShowPreview(false);
  };

  const handleClick = () => {
    if (disabled) {
      toast.error("Please select a customer first");
      return;
    }

    if (product.type === "both") {
      // For "both" type, show a dialog to choose between ready-made and custom
      onCustomAdd && onCustomAdd();
    } else if (product.type === "custom") {
      // For custom type, show model selection
      onCustomAdd && onCustomAdd();
    } else {
      // For ready-made type, add directly to cart
      onAdd();
    }
  };

  const hasModels = product.models && product.models.length > 0;
  const isCustom = product.type === "custom" || product.type === "both";

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card
        className={`cursor-pointer transition-all duration-300 group touch-manipulation h-24 ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-gray-50"
            : "hover:shadow-xl hover:shadow-primary/10 bg-white border border-gray-200 hover:border-primary/60 transform hover:-translate-y-0.5"
        }`}
        onClick={handleClick}
      >
        <CardContent className="p-4 h-full flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="font-semibold text-base text-gray-900 line-clamp-2 mb-2 leading-tight">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-primary">AED</span>
                <span className="text-lg font-bold text-gray-900">
                  {Number(product.price).toFixed(2)}
                </span>
              </div>
              {isCustom && (
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-1 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 text-purple-700"
                >
                  {product.type === "both" ? "Custom/Ready" : "Custom"}
                </Badge>
              )}
              {hasModels && (
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-1 bg-blue-50 border-blue-200 text-blue-700"
                >
                  {product.models.length}{" "}
                  {product.models.length === 1 ? "model" : "models"}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              className={`w-9 h-9 p-0 rounded-full border-2 transition-all duration-300 ${
                disabled
                  ? "opacity-0"
                  : "opacity-60 group-hover:opacity-100 hover:bg-primary hover:text-white hover:border-primary hover:scale-110 hover:shadow-lg"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (!disabled) handleClick();
              }}
              disabled={disabled}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Image Preview Popover - Right Position for Grid Layout */}
      {showPreview && product.image && (
        <div
          className="absolute z-50 left-full ml-3 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-2xl border-2 border-gray-100 overflow-hidden"
          style={{ width: "240px" }}
        >
          {/* Popover Arrow - Left pointing */}
          <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-6 border-b-6 border-r-6 border-t-transparent border-b-transparent border-r-white"></div>

          {/* Image Container */}
          <div className="relative">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
                if (!target.src.includes("placeholder")) {
                  target.style.display = "none";
                }
              }}
            />

            {/* Gradient Overlay with Product Name */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-3">
              <p className="text-white font-medium text-sm line-clamp-2">
                {product.name}
              </p>
            </div>
          </div>

          {/* Product Details */}
          <div className="p-3 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">
                AED {Number(product.price).toFixed(2)}
              </span>
              {product.category && (
                <span className="text-xs text-gray-500 capitalize bg-gray-200 px-2 py-1 rounded-full">
                  {product.category}
                </span>
              )}
            </div>
            {product.sku && (
              <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
