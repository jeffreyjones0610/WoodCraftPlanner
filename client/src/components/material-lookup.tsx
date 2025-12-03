import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ExternalLink, DollarSign, Ruler, Package } from "lucide-react";
import { materialTypes } from "@shared/schema";

interface MaterialProduct {
  id: string;
  name: string;
  material: string;
  dimensions: {
    length: number;
    width: number;
    thickness: number;
  };
  price: number;
  priceUnit: string;
  homeDepotSku?: string;
  homeDepotUrl?: string;
  description?: string;
  inStock?: boolean;
}

interface MaterialLookupProps {
  onSelectPrice: (price: number) => void;
  currentMaterial?: string;
}

export function MaterialLookup({ onSelectPrice, currentMaterial }: MaterialLookupProps) {
  const [open, setOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(currentMaterial || "Pine");

  const { data: products, isLoading } = useQuery<MaterialProduct[]>({
    queryKey: ["/api/materials", selectedMaterial],
    queryFn: async () => {
      const response = await fetch(`/api/materials?material=${encodeURIComponent(selectedMaterial)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch materials");
      }
      return response.json();
    },
    enabled: open,
  });

  const handleSelectProduct = (product: MaterialProduct) => {
    onSelectPrice(product.price);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="button-lookup-price">
          <Search className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Home Depot Material Prices
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
            <SelectTrigger data-testid="select-lookup-material">
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              {materialTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </>
          ) : products && products.length > 0 ? (
            products.map((product) => (
              <Card
                key={product.id}
                className="hover-elevate cursor-pointer"
                onClick={() => handleSelectProduct(product)}
                data-testid={`card-product-${product.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm line-clamp-1">
                        {product.name}
                      </h4>
                      {product.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {product.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Ruler className="h-3 w-3" />
                          {product.dimensions.length}" × {product.dimensions.width}" × {product.dimensions.thickness}"
                        </Badge>
                        {product.inStock && (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                            In Stock
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-lg font-bold">
                        <DollarSign className="h-4 w-4" />
                        {product.price.toFixed(2)}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        per {product.priceUnit.replace("_", " ")}
                      </span>
                      {product.homeDepotUrl && (
                        <a
                          href={product.homeDepotUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View at Home Depot
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No products found for {selectedMaterial}</p>
              <p className="text-sm mt-1">Try selecting a different material type</p>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
          <p>Prices are estimates and may vary by location. Click a product to use its price.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
