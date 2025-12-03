import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MaterialLookup } from "@/components/material-lookup";
import { type CutListItem, type InsertCutListItem, materialTypes, calculateItemTotal } from "@shared/schema";
import { Plus, Trash2, GripVertical, ExternalLink } from "lucide-react";

interface CutListTableProps {
  items: CutListItem[];
  onChange: (items: CutListItem[]) => void;
  readOnly?: boolean;
}

export function CutListTable({ items, onChange, readOnly = false }: CutListTableProps) {
  const addItem = () => {
    const newItem: CutListItem = {
      id: crypto.randomUUID(),
      partName: "",
      quantity: 1,
      length: 0,
      width: 0,
      thickness: 0.75,
      material: "Pine",
      unitPrice: 0,
      notes: "",
    };
    onChange([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof InsertCutListItem, value: string | number) => {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const totalCost = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  if (readOnly) {
    return (
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Part Name</TableHead>
              <TableHead className="font-semibold text-center w-20">Qty</TableHead>
              <TableHead className="font-semibold">Dimensions (L x W x T)</TableHead>
              <TableHead className="font-semibold">Material</TableHead>
              <TableHead className="font-semibold text-right w-24">Unit Price</TableHead>
              <TableHead className="font-semibold text-right w-24">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No items in cut list
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow 
                  key={item.id} 
                  className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}
                  data-testid={`row-cutlist-${item.id}`}
                >
                  <TableCell className="font-medium" data-testid={`text-partname-${item.id}`}>
                    {item.partName}
                  </TableCell>
                  <TableCell className="text-center" data-testid={`text-qty-${item.id}`}>
                    {item.quantity}
                  </TableCell>
                  <TableCell data-testid={`text-dimensions-${item.id}`}>
                    {item.length}" × {item.width}" × {item.thickness}"
                  </TableCell>
                  <TableCell data-testid={`text-material-${item.id}`}>
                    {item.material}
                  </TableCell>
                  <TableCell className="text-right" data-testid={`text-unitprice-${item.id}`}>
                    ${item.unitPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-medium" data-testid={`text-total-${item.id}`}>
                    ${calculateItemTotal(item).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {items.length > 0 && (
            <TableFooter>
              <TableRow className="bg-primary/5">
                <TableCell colSpan={5} className="text-right font-semibold">
                  Total Cost:
                </TableCell>
                <TableCell className="text-right font-bold text-lg" data-testid="text-total-cost">
                  ${totalCost.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-10"></TableHead>
              <TableHead className="font-semibold min-w-[140px]">Part Name</TableHead>
              <TableHead className="font-semibold text-center w-20">Qty</TableHead>
              <TableHead className="font-semibold w-24">Length</TableHead>
              <TableHead className="font-semibold w-24">Width</TableHead>
              <TableHead className="font-semibold w-24">Thickness</TableHead>
              <TableHead className="font-semibold min-w-[120px]">Material</TableHead>
              <TableHead className="font-semibold w-32">Unit Price</TableHead>
              <TableHead className="font-semibold text-right w-24">Total</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                  No items yet. Click "Add Item" to get started.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow 
                  key={item.id}
                  className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}
                  data-testid={`row-edit-cutlist-${item.id}`}
                >
                  <TableCell className="text-muted-foreground">
                    <GripVertical className="h-4 w-4" />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.partName}
                      onChange={(e) => updateItem(item.id, "partName", e.target.value)}
                      placeholder="Part name"
                      className="min-w-[120px]"
                      data-testid={`input-partname-${item.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                      className="w-16 text-center"
                      data-testid={`input-qty-${item.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min={0}
                        step={0.125}
                        value={item.length}
                        onChange={(e) => updateItem(item.id, "length", parseFloat(e.target.value) || 0)}
                        className="w-20"
                        data-testid={`input-length-${item.id}`}
                      />
                      <span className="text-muted-foreground text-sm">"</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min={0}
                        step={0.125}
                        value={item.width}
                        onChange={(e) => updateItem(item.id, "width", parseFloat(e.target.value) || 0)}
                        className="w-20"
                        data-testid={`input-width-${item.id}`}
                      />
                      <span className="text-muted-foreground text-sm">"</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min={0}
                        step={0.125}
                        value={item.thickness}
                        onChange={(e) => updateItem(item.id, "thickness", parseFloat(e.target.value) || 0)}
                        className="w-20"
                        data-testid={`input-thickness-${item.id}`}
                      />
                      <span className="text-muted-foreground text-sm">"</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={item.material}
                      onValueChange={(value) => updateItem(item.id, "material", value)}
                    >
                      <SelectTrigger className="min-w-[100px]" data-testid={`select-material-${item.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {materialTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground text-sm">$</span>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                        className="w-20"
                        data-testid={`input-price-${item.id}`}
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <MaterialLookup
                              currentMaterial={item.material}
                              onSelectPrice={(price) => updateItem(item.id, "unitPrice", price)}
                            />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Lookup Home Depot prices</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${calculateItemTotal(item).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      data-testid={`button-remove-item-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          {items.length > 0 && (
            <TableFooter>
              <TableRow className="bg-primary/5">
                <TableCell colSpan={8} className="text-right font-semibold">
                  Total Cost:
                </TableCell>
                <TableCell className="text-right font-bold text-lg">
                  ${totalCost.toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
      
      <Button onClick={addItem} variant="outline" className="gap-2" data-testid="button-add-item">
        <Plus className="h-4 w-4" />
        Add Item
      </Button>
    </div>
  );
}
