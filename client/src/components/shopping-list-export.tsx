import { useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { type CutListItem, type Project } from "@shared/schema";
import { optimizeCutList } from "@shared/cut-optimizer";
import { 
  ShoppingCart, 
  Printer, 
  Download, 
  ExternalLink,
  Package,
  MapPin,
  CheckSquare
} from "lucide-react";

interface ShoppingListExportProps {
  project: Project;
}

interface ShoppingItem {
  name: string;
  material: string;
  quantity: number;
  dimensions: string;
  unitPrice: number;
  totalPrice: number;
  homeDepotUrl?: string;
  sku?: string;
}

export function ShoppingListExport({ project }: ShoppingListExportProps) {
  const printRef = useRef<HTMLDivElement>(null);
  
  const { shoppingList, totalCost, optimizationResult } = useMemo(() => {
    const result = optimizeCutList(project.cutList);
    
    const items: ShoppingItem[] = result.boardUsage.map(usage => ({
      name: usage.product.name,
      material: usage.product.material,
      quantity: usage.boardsNeeded,
      dimensions: `${usage.product.dimensions.length}" × ${usage.product.dimensions.width}" × ${usage.product.dimensions.thickness}"`,
      unitPrice: usage.product.price,
      totalPrice: usage.product.price * usage.boardsNeeded,
      homeDepotUrl: usage.product.homeDepotUrl,
      sku: usage.product.homeDepotSku
    }));
    
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
    
    return { 
      shoppingList: items, 
      totalCost: total,
      optimizationResult: result
    };
  }, [project.cutList]);
  
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Shopping List - ${project.title}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            h1 { font-size: 24px; margin-bottom: 8px; }
            h2 { font-size: 18px; margin-top: 24px; margin-bottom: 12px; }
            .subtitle { color: #666; margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background: #f5f5f5; font-weight: 600; }
            .text-right { text-align: right; }
            .total-row { font-weight: bold; background: #f5f5f5; }
            .checkbox { width: 20px; height: 20px; border: 2px solid #333; margin-right: 8px; display: inline-block; }
            .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <h1>Shopping List: ${project.title}</h1>
          <p class="subtitle">Generated on ${new Date().toLocaleDateString()}</p>
          
          <h2>Materials to Purchase</h2>
          <table>
            <thead>
              <tr>
                <th style="width: 40px;"></th>
                <th>Item</th>
                <th class="text-right" style="width: 60px;">Qty</th>
                <th class="text-right" style="width: 80px;">Unit Price</th>
                <th class="text-right" style="width: 80px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${shoppingList.map(item => `
                <tr>
                  <td><span class="checkbox"></span></td>
                  <td>
                    <strong>${item.name}</strong><br>
                    <small style="color: #666;">${item.dimensions}${item.sku ? ` • SKU: ${item.sku}` : ""}</small>
                  </td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">$${item.unitPrice.toFixed(2)}</td>
                  <td class="text-right">$${item.totalPrice.toFixed(2)}</td>
                </tr>
              `).join("")}
              <tr class="total-row">
                <td colspan="4" class="text-right">Estimated Total:</td>
                <td class="text-right">$${totalCost.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          <h2>Cut List Reference</h2>
          <table>
            <thead>
              <tr>
                <th>Part Name</th>
                <th class="text-right">Qty</th>
                <th>Dimensions</th>
                <th>Material</th>
              </tr>
            </thead>
            <tbody>
              ${project.cutList.map(item => `
                <tr>
                  <td>${item.partName}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td>${item.length}" × ${item.width}" × ${item.thickness}"</td>
                  <td>${item.material}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Prices are estimates based on typical Home Depot pricing. Actual prices may vary by location.</p>
            <p>Visit homedepot.com for current availability and pricing.</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };
  
  const handleDownloadCSV = () => {
    const headers = ["Item", "Material", "Dimensions", "Quantity", "Unit Price", "Total", "SKU", "Home Depot URL"];
    const rows = shoppingList.map(item => [
      item.name,
      item.material,
      item.dimensions,
      item.quantity.toString(),
      item.unitPrice.toFixed(2),
      item.totalPrice.toFixed(2),
      item.sku || "",
      item.homeDepotUrl || ""
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.title.replace(/[^a-z0-9]/gi, "_")}_shopping_list.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" data-testid="button-shopping-list">
          <ShoppingCart className="h-4 w-4" />
          Shopping List
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping List
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2" ref={printRef}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>{optimizationResult.totalBoards} board{optimizationResult.totalBoards !== 1 ? "s" : ""} needed</span>
            <span>•</span>
            <span>Estimated total: <strong className="text-foreground">${totalCost.toFixed(2)}</strong></span>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            {shoppingList.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Add items to your cut list to generate a shopping list.
              </p>
            ) : (
              shoppingList.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-md border"
                  data-testid={`shopping-item-${index}`}
                >
                  <CheckSquare className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.dimensions}
                          {item.sku && <span className="ml-2">SKU: {item.sku}</span>}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant="secondary">{item.quantity}×</Badge>
                        <p className="font-semibold mt-1">${item.totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                    {item.homeDepotUrl && (
                      <a
                        href={item.homeDepotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View at Home Depot
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {shoppingList.length > 0 && (
            <>
              <Separator />
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                <span className="font-semibold">Estimated Total</span>
                <span className="text-xl font-bold">${totalCost.toFixed(2)}</span>
              </div>
            </>
          )}
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>Prices may vary by store location. Check availability before visiting.</span>
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleDownloadCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
