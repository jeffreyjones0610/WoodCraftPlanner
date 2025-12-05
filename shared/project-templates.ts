import { type InsertCutListItem } from "./schema";

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: "furniture" | "storage" | "outdoor" | "workshop" | "decor";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  imageUrl?: string;
  cutList: InsertCutListItem[];
}

export const projectTemplates: ProjectTemplate[] = [
  {
    id: "simple-bookshelf",
    name: "Simple Bookshelf",
    description: "A classic 4-shelf bookshelf perfect for beginners. Uses basic joinery and can be customized to fit your space.",
    category: "furniture",
    difficulty: "beginner",
    estimatedTime: "4-6 hours",
    imageUrl: "/generated_images/simple_pine_bookshelf.png",
    cutList: [
      { partName: "Side Panel", quantity: 2, length: 72, width: 11.25, thickness: 0.75, material: "Pine", unitPrice: 25.98, notes: "Left and right sides" },
      { partName: "Shelf", quantity: 4, length: 30, width: 11.25, thickness: 0.75, material: "Pine", unitPrice: 12.98, notes: "Adjustable shelves" },
      { partName: "Top", quantity: 1, length: 31.5, width: 11.25, thickness: 0.75, material: "Pine", unitPrice: 14.98, notes: "Fixed top" },
      { partName: "Back Panel", quantity: 1, length: 72, width: 30, thickness: 0.25, material: "Plywood", unitPrice: 15.98, notes: "1/4 inch plywood backing" },
    ]
  },
  {
    id: "adirondack-chair",
    name: "Adirondack Chair",
    description: "Classic outdoor chair design with wide armrests and a slanted seat. Perfect for patios and decks.",
    category: "outdoor",
    difficulty: "intermediate",
    estimatedTime: "8-10 hours",
    imageUrl: "/generated_images/cedar_adirondack_chair.png",
    cutList: [
      { partName: "Back Slat - Wide", quantity: 3, length: 36, width: 5.5, thickness: 0.75, material: "Cedar", unitPrice: 8.98, notes: "Center back slats" },
      { partName: "Back Slat - Narrow", quantity: 2, length: 34, width: 3.5, thickness: 0.75, material: "Cedar", unitPrice: 6.48, notes: "Outer back slats" },
      { partName: "Seat Slat", quantity: 5, length: 22, width: 5.5, thickness: 0.75, material: "Cedar", unitPrice: 5.98, notes: "Seat surface" },
      { partName: "Front Leg", quantity: 2, length: 22, width: 5.5, thickness: 1.5, material: "Cedar", unitPrice: 12.98, notes: "2x6 cedar" },
      { partName: "Back Leg", quantity: 2, length: 36, width: 5.5, thickness: 1.5, material: "Cedar", unitPrice: 18.98, notes: "Angled cut required" },
      { partName: "Arm", quantity: 2, length: 28, width: 5.5, thickness: 0.75, material: "Cedar", unitPrice: 7.98, notes: "Curved front" },
      { partName: "Arm Support", quantity: 2, length: 10, width: 3.5, thickness: 0.75, material: "Cedar", unitPrice: 3.48, notes: "" },
    ]
  },
  {
    id: "floating-nightstand",
    name: "Floating Nightstand",
    description: "Modern wall-mounted nightstand with a drawer. Clean lines and hidden hardware.",
    category: "furniture",
    difficulty: "intermediate",
    estimatedTime: "6-8 hours",
    imageUrl: "/generated_images/floating_walnut_nightstand.png",
    cutList: [
      { partName: "Top", quantity: 1, length: 18, width: 12, thickness: 0.75, material: "Walnut", unitPrice: 32.98, notes: "Hardwood top" },
      { partName: "Side", quantity: 2, length: 12, width: 6, thickness: 0.75, material: "Walnut", unitPrice: 18.98, notes: "Left and right sides" },
      { partName: "Bottom", quantity: 1, length: 16.5, width: 11.25, thickness: 0.75, material: "Walnut", unitPrice: 24.98, notes: "Inside bottom panel" },
      { partName: "Back", quantity: 1, length: 16.5, width: 5.25, thickness: 0.5, material: "Plywood", unitPrice: 8.98, notes: "1/2 inch plywood" },
      { partName: "Drawer Front", quantity: 1, length: 16.5, width: 4, thickness: 0.75, material: "Walnut", unitPrice: 14.98, notes: "Matching drawer face" },
      { partName: "Drawer Side", quantity: 2, length: 10.5, width: 3.5, thickness: 0.5, material: "Plywood", unitPrice: 4.98, notes: "Drawer box" },
      { partName: "Drawer Back", quantity: 1, length: 14.5, width: 3.5, thickness: 0.5, material: "Plywood", unitPrice: 4.48, notes: "Drawer box" },
      { partName: "Drawer Bottom", quantity: 1, length: 14.5, width: 10.5, thickness: 0.25, material: "Plywood", unitPrice: 3.98, notes: "1/4 inch ply" },
    ]
  },
  {
    id: "workbench",
    name: "Heavy-Duty Workbench",
    description: "Sturdy workshop workbench with a thick laminated top and lower shelf for storage.",
    category: "workshop",
    difficulty: "intermediate",
    estimatedTime: "10-14 hours",
    imageUrl: "/generated_images/heavy-duty_workbench.png",
    cutList: [
      { partName: "Top Laminate", quantity: 3, length: 72, width: 11.25, thickness: 1.5, material: "Pine", unitPrice: 22.98, notes: "2x12 for thick top" },
      { partName: "Leg", quantity: 4, length: 34, width: 3.5, thickness: 3.5, material: "Pine", unitPrice: 12.98, notes: "4x4 posts" },
      { partName: "Long Stretcher", quantity: 2, length: 66, width: 3.5, thickness: 1.5, material: "Pine", unitPrice: 8.98, notes: "Front and back" },
      { partName: "Short Stretcher", quantity: 2, length: 21, width: 3.5, thickness: 1.5, material: "Pine", unitPrice: 4.48, notes: "Sides" },
      { partName: "Shelf Board", quantity: 3, length: 66, width: 11.25, thickness: 0.75, material: "Pine", unitPrice: 14.98, notes: "Lower shelf" },
    ]
  },
  {
    id: "picture-frame",
    name: "Picture Frame Set",
    description: "Set of three matching picture frames with mitered corners. Great for practicing precision cuts.",
    category: "decor",
    difficulty: "beginner",
    estimatedTime: "2-3 hours",
    imageUrl: "/generated_images/oak_picture_frame_set.png",
    cutList: [
      { partName: "Large Frame Rail", quantity: 4, length: 14, width: 2, thickness: 0.75, material: "Oak", unitPrice: 4.98, notes: "8x10 frame" },
      { partName: "Medium Frame Rail", quantity: 4, length: 10, width: 2, thickness: 0.75, material: "Oak", unitPrice: 3.98, notes: "5x7 frame" },
      { partName: "Small Frame Rail", quantity: 4, length: 8, width: 2, thickness: 0.75, material: "Oak", unitPrice: 2.98, notes: "4x6 frame" },
      { partName: "Large Back", quantity: 1, length: 10, width: 8, thickness: 0.125, material: "Plywood", unitPrice: 2.48, notes: "1/8 inch backing" },
      { partName: "Medium Back", quantity: 1, length: 7, width: 5, thickness: 0.125, material: "Plywood", unitPrice: 1.98, notes: "1/8 inch backing" },
      { partName: "Small Back", quantity: 1, length: 6, width: 4, thickness: 0.125, material: "Plywood", unitPrice: 1.48, notes: "1/8 inch backing" },
    ]
  },
  {
    id: "storage-ottoman",
    name: "Storage Ottoman",
    description: "Upholstered storage ottoman with a lift-off top. Provides hidden storage and extra seating.",
    category: "storage",
    difficulty: "intermediate",
    estimatedTime: "8-10 hours",
    imageUrl: "/generated_images/storage_ottoman.png",
    cutList: [
      { partName: "Side Panel", quantity: 4, length: 18, width: 16, thickness: 0.75, material: "Plywood", unitPrice: 12.98, notes: "3/4 inch plywood" },
      { partName: "Bottom", quantity: 1, length: 16.5, width: 16.5, thickness: 0.75, material: "Plywood", unitPrice: 8.98, notes: "Base" },
      { partName: "Lid Frame", quantity: 4, length: 18, width: 2.5, thickness: 0.75, material: "Poplar", unitPrice: 4.98, notes: "Lid structure" },
      { partName: "Lid Panel", quantity: 1, length: 17, width: 17, thickness: 0.5, material: "Plywood", unitPrice: 6.98, notes: "Under upholstery" },
      { partName: "Corner Block", quantity: 4, length: 3, width: 3, thickness: 3, material: "Pine", unitPrice: 1.98, notes: "For casters" },
    ]
  },
  {
    id: "planter-box",
    name: "Cedar Planter Box",
    description: "Weather-resistant raised planter box perfect for vegetables or flowers. Natural cedar finish.",
    category: "outdoor",
    difficulty: "beginner",
    estimatedTime: "3-4 hours",
    imageUrl: "/generated_images/cedar_planter_box.png",
    cutList: [
      { partName: "Long Side", quantity: 2, length: 36, width: 11.25, thickness: 0.75, material: "Cedar", unitPrice: 18.98, notes: "1x12 cedar" },
      { partName: "Short Side", quantity: 2, length: 18, width: 11.25, thickness: 0.75, material: "Cedar", unitPrice: 9.98, notes: "1x12 cedar" },
      { partName: "Bottom Slat", quantity: 4, length: 34.5, width: 5.5, thickness: 0.75, material: "Cedar", unitPrice: 7.48, notes: "Drainage gaps" },
      { partName: "Corner Post", quantity: 4, length: 12, width: 1.5, thickness: 1.5, material: "Cedar", unitPrice: 3.98, notes: "2x2 cedar" },
      { partName: "Trim Cap", quantity: 2, length: 38, width: 3.5, thickness: 0.75, material: "Cedar", unitPrice: 5.98, notes: "Top trim" },
      { partName: "Trim Cap Short", quantity: 2, length: 21, width: 3.5, thickness: 0.75, material: "Cedar", unitPrice: 3.98, notes: "Top trim" },
    ]
  },
  {
    id: "tool-storage-cabinet",
    name: "Wall Tool Cabinet",
    description: "Compact wall-mounted cabinet for organizing hand tools. Features pegboard back and small drawers.",
    category: "workshop",
    difficulty: "advanced",
    estimatedTime: "12-16 hours",
    imageUrl: "/generated_images/wall_tool_cabinet.png",
    cutList: [
      { partName: "Side", quantity: 2, length: 36, width: 8, thickness: 0.75, material: "Birch", unitPrice: 18.98, notes: "Birch plywood sides" },
      { partName: "Top/Bottom", quantity: 2, length: 24, width: 8, thickness: 0.75, material: "Birch", unitPrice: 14.98, notes: "Birch plywood" },
      { partName: "Door", quantity: 2, length: 34.5, width: 11.5, thickness: 0.75, material: "Birch", unitPrice: 22.98, notes: "Cabinet doors" },
      { partName: "Back", quantity: 1, length: 34.5, width: 22.5, thickness: 0.25, material: "Plywood", unitPrice: 8.98, notes: "Pegboard option" },
      { partName: "Shelf", quantity: 3, length: 22.5, width: 7, thickness: 0.75, material: "Birch", unitPrice: 8.48, notes: "Adjustable" },
      { partName: "Drawer Front", quantity: 4, length: 10.5, width: 3, thickness: 0.5, material: "Birch", unitPrice: 4.98, notes: "Small drawers" },
      { partName: "Drawer Side", quantity: 8, length: 6, width: 2.5, thickness: 0.5, material: "Plywood", unitPrice: 2.48, notes: "" },
      { partName: "Drawer Bottom", quantity: 4, length: 10, width: 5.5, thickness: 0.25, material: "Plywood", unitPrice: 2.98, notes: "" },
    ]
  },
];

export function getTemplateById(id: string): ProjectTemplate | undefined {
  return projectTemplates.find(t => t.id === id);
}

export function getTemplatesByCategory(category: ProjectTemplate["category"]): ProjectTemplate[] {
  return projectTemplates.filter(t => t.category === category);
}

export function getTemplatesByDifficulty(difficulty: ProjectTemplate["difficulty"]): ProjectTemplate[] {
  return projectTemplates.filter(t => t.difficulty === difficulty);
}
