import { z } from "zod";

// Material types available for woodworking projects
export const materialTypes = [
  "Pine",
  "Oak",
  "Maple",
  "Walnut",
  "Cherry",
  "Birch",
  "Plywood",
  "MDF",
  "Cedar",
  "Poplar",
  "Mahogany",
  "Ash",
  "Hickory",
  "Other"
] as const;

export type MaterialType = typeof materialTypes[number];

// Cut list item schema
export const cutListItemSchema = z.object({
  id: z.string(),
  partName: z.string().min(1, "Part name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  length: z.number().min(0.1, "Length must be positive"),
  width: z.number().min(0.1, "Width must be positive"),
  thickness: z.number().min(0.1, "Thickness must be positive"),
  material: z.enum(materialTypes),
  unitPrice: z.number().min(0, "Price cannot be negative"),
  notes: z.string().optional(),
});

export type CutListItem = z.infer<typeof cutListItemSchema>;

export const insertCutListItemSchema = cutListItemSchema.omit({ id: true });
export type InsertCutListItem = z.infer<typeof insertCutListItemSchema>;

// Project schema
export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  cutList: z.array(cutListItemSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Project = z.infer<typeof projectSchema>;

export const insertProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  cutList: z.array(insertCutListItemSchema).optional(),
});

export type InsertProject = z.infer<typeof insertProjectSchema>;

export const updateProjectSchema = insertProjectSchema.partial();
export type UpdateProject = z.infer<typeof updateProjectSchema>;

// Helper function to calculate board feet
export function calculateBoardFeet(length: number, width: number, thickness: number, quantity: number): number {
  // Board feet = (Length × Width × Thickness) / 144 × Quantity
  return (length * width * thickness * quantity) / 144;
}

// Helper function to calculate total cost for a cut list item
export function calculateItemTotal(item: CutListItem): number {
  return item.unitPrice * item.quantity;
}

// Helper function to calculate total project cost
export function calculateProjectCost(cutList: CutListItem[]): number {
  return cutList.reduce((total, item) => total + calculateItemTotal(item), 0);
}

// Helper function to calculate total board feet for a project
export function calculateProjectBoardFeet(cutList: CutListItem[]): number {
  return cutList.reduce((total, item) => 
    total + calculateBoardFeet(item.length, item.width, item.thickness, item.quantity), 0);
}

// Helper function to get total pieces in cut list
export function getTotalPieces(cutList: CutListItem[]): number {
  return cutList.reduce((total, item) => total + item.quantity, 0);
}
