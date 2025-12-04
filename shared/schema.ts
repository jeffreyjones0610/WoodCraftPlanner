import { z } from "zod";
import { pgTable, text, integer, numeric, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

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

// Status types for cut list items (progress tracking)
export const itemStatusTypes = [
  "not_started",
  "cut",
  "assembled",
  "finished"
] as const;

export type ItemStatus = typeof itemStatusTypes[number];

// Hardware types
export const hardwareTypes = [
  "Screw",
  "Nail",
  "Bolt",
  "Nut",
  "Washer",
  "Hinge",
  "Handle",
  "Knob",
  "Drawer Slide",
  "Bracket",
  "Hook",
  "Latch",
  "Lock",
  "Caster",
  "Dowel",
  "Biscuit",
  "Pocket Screw",
  "Wood Glue",
  "Finish",
  "Other"
] as const;

export type HardwareType = typeof hardwareTypes[number];

// ============ DRIZZLE TABLES ============

// Projects table
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Cut list items table
export const cutListItems = pgTable("cut_list_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  partName: text("part_name").notNull(),
  quantity: integer("quantity").notNull().default(1),
  length: numeric("length", { precision: 10, scale: 2 }).notNull(),
  width: numeric("width", { precision: 10, scale: 2 }).notNull(),
  thickness: numeric("thickness", { precision: 10, scale: 2 }).notNull(),
  material: text("material").notNull().default("Pine"),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull().default("0"),
  notes: text("notes"),
  status: text("status").notNull().default("not_started"),
});

// Hardware items table
export const hardwareItems = pgTable("hardware_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull().default("Screw"),
  size: text("size"),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull().default("0"),
  notes: text("notes"),
  url: text("url"),
});

// Inventory items table
export const inventoryItems = pgTable("inventory_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  material: text("material").notNull().default("Pine"),
  length: numeric("length", { precision: 10, scale: 2 }).notNull(),
  width: numeric("width", { precision: 10, scale: 2 }).notNull(),
  thickness: numeric("thickness", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(1),
  location: text("location"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Project notes table
export const projectNotes = pgTable("project_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============ RELATIONS ============

export const projectsRelations = relations(projects, ({ many }) => ({
  cutListItems: many(cutListItems),
  hardwareItems: many(hardwareItems),
  notes: many(projectNotes),
}));

export const cutListItemsRelations = relations(cutListItems, ({ one }) => ({
  project: one(projects, {
    fields: [cutListItems.projectId],
    references: [projects.id],
  }),
}));

export const hardwareItemsRelations = relations(hardwareItems, ({ one }) => ({
  project: one(projects, {
    fields: [hardwareItems.projectId],
    references: [projects.id],
  }),
}));

export const projectNotesRelations = relations(projectNotes, ({ one }) => ({
  project: one(projects, {
    fields: [projectNotes.projectId],
    references: [projects.id],
  }),
}));

// ============ INSERT SCHEMAS ============

export const insertProjectSchema = createInsertSchema(projects).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

export const insertCutListItemSchema = createInsertSchema(cutListItems).omit({ 
  id: true 
});

export const insertHardwareItemSchema = createInsertSchema(hardwareItems).omit({ 
  id: true 
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({ 
  id: true, 
  createdAt: true 
});

export const insertProjectNoteSchema = createInsertSchema(projectNotes).omit({ 
  id: true, 
  createdAt: true 
});

// ============ TYPES ============

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type CutListItem = typeof cutListItems.$inferSelect;
export type InsertCutListItem = z.infer<typeof insertCutListItemSchema>;

export type HardwareItem = typeof hardwareItems.$inferSelect;
export type InsertHardwareItem = z.infer<typeof insertHardwareItemSchema>;

export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;

export type ProjectNote = typeof projectNotes.$inferSelect;
export type InsertProjectNote = z.infer<typeof insertProjectNoteSchema>;

// ============ EXTENDED TYPES FOR API ============

// Full project with all related data
export interface ProjectWithDetails extends Project {
  cutList: CutListItem[];
  hardware: HardwareItem[];
  notes: ProjectNote[];
}

// Update schema (partial insert)
export const updateProjectSchema = insertProjectSchema.partial();
export type UpdateProject = z.infer<typeof updateProjectSchema>;

// ============ ZOD VALIDATION SCHEMAS ============

// Cut list item validation schema (for form validation)
export const cutListItemFormSchema = z.object({
  id: z.string().optional(),
  partName: z.string().min(1, "Part name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  length: z.number().min(0.1, "Length must be positive"),
  width: z.number().min(0.1, "Width must be positive"),
  thickness: z.number().min(0.1, "Thickness must be positive"),
  material: z.enum(materialTypes),
  unitPrice: z.number().min(0, "Price cannot be negative"),
  notes: z.string().optional(),
  status: z.enum(itemStatusTypes).optional(),
});

export type CutListItemForm = z.infer<typeof cutListItemFormSchema>;

// Hardware item validation schema
export const hardwareItemFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  type: z.enum(hardwareTypes),
  size: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Price cannot be negative"),
  notes: z.string().optional(),
  url: z.string().optional(),
});

export type HardwareItemForm = z.infer<typeof hardwareItemFormSchema>;

// Project form schema (for creating/editing projects)
export const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  cutList: z.array(cutListItemFormSchema).optional(),
  hardware: z.array(hardwareItemFormSchema).optional(),
});

export type ProjectForm = z.infer<typeof projectFormSchema>;

// ============ HELPER FUNCTIONS ============

// Helper function to calculate board feet
export function calculateBoardFeet(length: number, width: number, thickness: number, quantity: number): number {
  return (length * width * thickness * quantity) / 144;
}

// Helper function to calculate total cost for a cut list item
export function calculateItemTotal(item: { unitPrice: number | string; quantity: number }): number {
  const price = typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice;
  return price * item.quantity;
}

// Helper function to calculate total project cost
export function calculateProjectCost(cutList: Array<{ unitPrice: number | string; quantity: number }>): number {
  return cutList.reduce((total, item) => total + calculateItemTotal(item), 0);
}

// Helper function to calculate hardware cost
export function calculateHardwareCost(hardware: Array<{ unitPrice: number | string; quantity: number }>): number {
  return hardware.reduce((total, item) => total + calculateItemTotal(item), 0);
}

// Helper function to calculate total board feet for a project
export function calculateProjectBoardFeet(cutList: Array<{ length: number | string; width: number | string; thickness: number | string; quantity: number }>): number {
  return cutList.reduce((total, item) => {
    const length = typeof item.length === 'string' ? parseFloat(item.length) : item.length;
    const width = typeof item.width === 'string' ? parseFloat(item.width) : item.width;
    const thickness = typeof item.thickness === 'string' ? parseFloat(item.thickness) : item.thickness;
    return total + calculateBoardFeet(length, width, thickness, item.quantity);
  }, 0);
}

// Helper function to get total pieces in cut list
export function getTotalPieces(cutList: Array<{ quantity: number }>): number {
  return cutList.reduce((total, item) => total + item.quantity, 0);
}

// Unit conversion helpers
export const INCHES_TO_CM = 2.54;
export const CM_TO_INCHES = 1 / INCHES_TO_CM;

export function inchesToCm(inches: number): number {
  return inches * INCHES_TO_CM;
}

export function cmToInches(cm: number): number {
  return cm * CM_TO_INCHES;
}

export function formatMeasurement(value: number, useMetric: boolean): string {
  if (useMetric) {
    return `${inchesToCm(value).toFixed(1)} cm`;
  }
  return `${value.toFixed(2)}"`;
}
