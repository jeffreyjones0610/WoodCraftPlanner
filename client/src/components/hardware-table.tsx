import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { type HardwareItemForm, hardwareTypes, calculateItemTotal } from "@shared/schema";

interface HardwareTableProps {
  items: HardwareItemForm[];
  onChange: (items: HardwareItemForm[]) => void;
  readOnly?: boolean;
}

export function HardwareTable({ items, onChange, readOnly = false }: HardwareTableProps) {
  const [newItem, setNewItem] = useState<Partial<HardwareItemForm>>({
    name: "",
    type: "Screw",
    size: "",
    quantity: 1,
    unitPrice: 0,
    notes: "",
    url: "",
  });

  const addItem = () => {
    if (!newItem.name?.trim()) return;
    
    const item: HardwareItemForm = {
      id: `temp-${Date.now()}`,
      name: newItem.name.trim(),
      type: (newItem.type as typeof hardwareTypes[number]) || "Screw",
      size: newItem.size,
      quantity: newItem.quantity || 1,
      unitPrice: newItem.unitPrice || 0,
      notes: newItem.notes,
      url: newItem.url,
    };
    
    onChange([...items, item]);
    setNewItem({
      name: "",
      type: "Screw",
      size: "",
      quantity: 1,
      unitPrice: 0,
      notes: "",
      url: "",
    });
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateItem = (index: number, field: keyof HardwareItemForm, value: any) => {
    const updated = items.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange(updated);
  };

  const totalCost = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const totalPieces = items.reduce((sum, item) => sum + item.quantity, 0);

  if (readOnly && items.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No hardware items added
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Name</TableHead>
              <TableHead className="min-w-[100px]">Type</TableHead>
              <TableHead className="min-w-[80px]">Size</TableHead>
              <TableHead className="w-[80px] text-right">Qty</TableHead>
              <TableHead className="w-[100px] text-right">Unit Price</TableHead>
              <TableHead className="w-[100px] text-right">Total</TableHead>
              {!readOnly && <TableHead className="w-[60px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id || index} data-testid={`row-hardware-${index}`}>
                <TableCell>
                  {readOnly ? (
                    <div className="flex items-center gap-2">
                      <span>{item.name}</span>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(index, "name", e.target.value)}
                      className="h-8"
                      data-testid={`input-hardware-name-${index}`}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {readOnly ? (
                    item.type
                  ) : (
                    <Select
                      value={item.type}
                      onValueChange={(value) => updateItem(index, "type", value)}
                    >
                      <SelectTrigger className="h-8" data-testid={`select-hardware-type-${index}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {hardwareTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
                <TableCell>
                  {readOnly ? (
                    item.size || "-"
                  ) : (
                    <Input
                      value={item.size || ""}
                      onChange={(e) => updateItem(index, "size", e.target.value)}
                      placeholder='e.g., #8 x 2"'
                      className="h-8"
                      data-testid={`input-hardware-size-${index}`}
                    />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {readOnly ? (
                    item.quantity
                  ) : (
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                      className="h-8 w-16 text-right"
                      data-testid={`input-hardware-qty-${index}`}
                    />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {readOnly ? (
                    `$${item.unitPrice.toFixed(2)}`
                  ) : (
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                      className="h-8 w-20 text-right"
                      data-testid={`input-hardware-price-${index}`}
                    />
                  )}
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${calculateItemTotal(item).toFixed(2)}
                </TableCell>
                {!readOnly && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeItem(index)}
                      data-testid={`button-remove-hardware-${index}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
            
            {!readOnly && (
              <TableRow className="bg-muted/30">
                <TableCell>
                  <Input
                    value={newItem.name || ""}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Item name"
                    className="h-8"
                    data-testid="input-new-hardware-name"
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={newItem.type || "Screw"}
                    onValueChange={(value) => setNewItem({ ...newItem, type: value as any })}
                  >
                    <SelectTrigger className="h-8" data-testid="select-new-hardware-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {hardwareTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    value={newItem.size || ""}
                    onChange={(e) => setNewItem({ ...newItem, size: e.target.value })}
                    placeholder="Size"
                    className="h-8"
                    data-testid="input-new-hardware-size"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={1}
                    value={newItem.quantity || 1}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                    className="h-8 w-16 text-right"
                    data-testid="input-new-hardware-qty"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={newItem.unitPrice || 0}
                    onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
                    className="h-8 w-20 text-right"
                    data-testid="input-new-hardware-price"
                  />
                </TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={addItem}
                    disabled={!newItem.name?.trim()}
                    data-testid="button-add-hardware"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )}
            
            {items.length > 0 && (
              <TableRow className="bg-muted/50 font-medium">
                <TableCell colSpan={3}>Totals</TableCell>
                <TableCell className="text-right">{totalPieces}</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">${totalCost.toFixed(2)}</TableCell>
                {!readOnly && <TableCell></TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
