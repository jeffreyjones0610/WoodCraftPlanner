import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, Package, Loader2 } from "lucide-react";
import { type InventoryItem, materialTypes } from "@shared/schema";
import { useUnits } from "@/components/unit-toggle";

export default function Inventory() {
  const { toast } = useToast();
  const { formatDimensions } = useUnits();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    material: "Pine" as typeof materialTypes[number],
    length: 96,
    width: 6,
    thickness: 0.75,
    quantity: 1,
    location: "",
    notes: "",
  });

  const { data: items, isLoading } = useQuery<InventoryItem[]>({
    queryKey: ["/api/inventory"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/inventory", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      setIsAddOpen(false);
      resetForm();
      toast({
        title: "Item added",
        description: "Inventory item has been added.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const response = await apiRequest("PATCH", `/api/inventory/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      setEditItem(null);
      resetForm();
      toast({
        title: "Item updated",
        description: "Inventory item has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/inventory/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      toast({
        title: "Item deleted",
        description: "Inventory item has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      material: "Pine",
      length: 96,
      width: 6,
      thickness: 0.75,
      quantity: 1,
      location: "",
      notes: "",
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    if (editItem) {
      updateMutation.mutate({ id: editItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openEdit = (item: InventoryItem) => {
    setEditItem(item);
    setFormData({
      name: item.name,
      material: item.material as typeof materialTypes[number],
      length: typeof item.length === 'string' ? parseFloat(item.length) : item.length,
      width: typeof item.width === 'string' ? parseFloat(item.width) : item.width,
      thickness: typeof item.thickness === 'string' ? parseFloat(item.thickness) : item.thickness,
      quantity: item.quantity,
      location: item.location || "",
      notes: item.notes || "",
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const totalPieces = items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const materialCounts = items?.reduce((acc, item) => {
    acc[item.material] = (acc[item.material] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight" data-testid="text-inventory-title">
              Material Inventory
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your lumber and materials on hand
            </p>
          </div>
          
          <Dialog open={isAddOpen || !!editItem} onOpenChange={(open) => {
            if (!open) {
              setIsAddOpen(false);
              setEditItem(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => setIsAddOpen(true)} data-testid="button-add-inventory">
                <Plus className="h-4 w-4" />
                Add Material
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editItem ? "Edit Material" : "Add Material"}</DialogTitle>
                <DialogDescription>
                  {editItem ? "Update the material details" : "Add lumber or material to your inventory"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Pine 2x4x8"
                    data-testid="input-inventory-name"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="material">Material Type</Label>
                  <Select
                    value={formData.material}
                    onValueChange={(value) => setFormData({ ...formData, material: value as any })}
                  >
                    <SelectTrigger data-testid="select-inventory-material">
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
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="length">Length (in)</Label>
                    <Input
                      id="length"
                      type="number"
                      min={0.1}
                      step={0.25}
                      value={formData.length}
                      onChange={(e) => setFormData({ ...formData, length: parseFloat(e.target.value) || 0 })}
                      data-testid="input-inventory-length"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="width">Width (in)</Label>
                    <Input
                      id="width"
                      type="number"
                      min={0.1}
                      step={0.25}
                      value={formData.width}
                      onChange={(e) => setFormData({ ...formData, width: parseFloat(e.target.value) || 0 })}
                      data-testid="input-inventory-width"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="thickness">Thickness (in)</Label>
                    <Input
                      id="thickness"
                      type="number"
                      min={0.1}
                      step={0.25}
                      value={formData.thickness}
                      onChange={(e) => setFormData({ ...formData, thickness: parseFloat(e.target.value) || 0 })}
                      data-testid="input-inventory-thickness"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min={1}
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                      data-testid="input-inventory-quantity"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Garage shelf"
                      data-testid="input-inventory-location"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional notes..."
                    data-testid="input-inventory-notes"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditItem(null);
                    resetForm();
                  }}
                  data-testid="button-cancel-inventory"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.name.trim() || isPending}
                  className="gap-2"
                  data-testid="button-save-inventory"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editItem ? "Update" : "Add Material"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pieces</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-pieces">
                {totalPieces}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Material Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-material-types">
                {Object.keys(materialCounts).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items in Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-items-count">
                {items?.length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : items && items.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead>Dimensions</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => {
                      const length = typeof item.length === 'string' ? parseFloat(item.length) : item.length;
                      const width = typeof item.width === 'string' ? parseFloat(item.width) : item.width;
                      const thickness = typeof item.thickness === 'string' ? parseFloat(item.thickness) : item.thickness;
                      
                      return (
                        <TableRow key={item.id} data-testid={`row-inventory-${item.id}`}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.material}</TableCell>
                          <TableCell>{formatDimensions(length, width, thickness)}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-muted-foreground">{item.location || "-"}</TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => openEdit(item)}
                                data-testid={`button-edit-inventory-${item.id}`}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => deleteMutation.mutate(item.id)}
                                disabled={deleteMutation.isPending}
                                data-testid={`button-delete-inventory-${item.id}`}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold text-lg mb-2">No materials in inventory</h3>
              <p className="text-muted-foreground mb-4">
                Start tracking your lumber and materials
              </p>
              <Button onClick={() => setIsAddOpen(true)} className="gap-2" data-testid="button-add-first-inventory">
                <Plus className="h-4 w-4" />
                Add Your First Material
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
