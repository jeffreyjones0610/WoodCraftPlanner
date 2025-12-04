import { 
  projects,
  cutListItems,
  hardwareItems,
  inventoryItems,
  projectNotes,
  type Project,
  type InsertProject,
  type UpdateProject,
  type CutListItem,
  type InsertCutListItem,
  type HardwareItem,
  type InsertHardwareItem,
  type InventoryItem,
  type InsertInventoryItem,
  type ProjectNote,
  type InsertProjectNote,
  type ProjectWithDetails,
  type CutListItemForm,
  type HardwareItemForm,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Projects
  getProjects(): Promise<ProjectWithDetails[]>;
  getProject(id: string): Promise<ProjectWithDetails | undefined>;
  createProject(project: InsertProject, cutList?: CutListItemForm[], hardware?: HardwareItemForm[]): Promise<ProjectWithDetails>;
  updateProject(id: string, project: UpdateProject, cutList?: CutListItemForm[], hardware?: HardwareItemForm[]): Promise<ProjectWithDetails | undefined>;
  deleteProject(id: string): Promise<boolean>;
  cloneProject(id: string, newTitle?: string): Promise<ProjectWithDetails | undefined>;
  
  // Cut List Items
  updateCutListItemStatus(id: string, status: string): Promise<CutListItem | undefined>;
  
  // Hardware Items
  getHardwareItems(projectId: string): Promise<HardwareItem[]>;
  
  // Inventory
  getInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItem(id: string): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: string, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined>;
  deleteInventoryItem(id: string): Promise<boolean>;
  
  // Project Notes
  getProjectNotes(projectId: string): Promise<ProjectNote[]>;
  createProjectNote(note: InsertProjectNote): Promise<ProjectNote>;
  deleteProjectNote(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // ============ PROJECTS ============
  
  async getProjects(): Promise<ProjectWithDetails[]> {
    const allProjects = await db.select().from(projects).orderBy(desc(projects.createdAt));
    
    const projectsWithDetails: ProjectWithDetails[] = await Promise.all(
      allProjects.map(async (project) => {
        const cutList = await db.select().from(cutListItems).where(eq(cutListItems.projectId, project.id));
        const hardware = await db.select().from(hardwareItems).where(eq(hardwareItems.projectId, project.id));
        const notes = await db.select().from(projectNotes).where(eq(projectNotes.projectId, project.id)).orderBy(desc(projectNotes.createdAt));
        
        return {
          ...project,
          cutList: cutList.map(this.normalizeCutListItem),
          hardware: hardware.map(this.normalizeHardwareItem),
          notes,
        };
      })
    );
    
    return projectsWithDetails;
  }

  async getProject(id: string): Promise<ProjectWithDetails | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    if (!project) return undefined;
    
    const cutList = await db.select().from(cutListItems).where(eq(cutListItems.projectId, id));
    const hardware = await db.select().from(hardwareItems).where(eq(hardwareItems.projectId, id));
    const notes = await db.select().from(projectNotes).where(eq(projectNotes.projectId, id)).orderBy(desc(projectNotes.createdAt));
    
    return {
      ...project,
      cutList: cutList.map(this.normalizeCutListItem),
      hardware: hardware.map(this.normalizeHardwareItem),
      notes,
    };
  }

  async createProject(
    insertProject: InsertProject, 
    cutList?: CutListItemForm[], 
    hardware?: HardwareItemForm[]
  ): Promise<ProjectWithDetails> {
    const [project] = await db.insert(projects).values({
      title: insertProject.title,
      description: insertProject.description,
      imageUrl: insertProject.imageUrl,
    }).returning();
    
    let createdCutList: CutListItem[] = [];
    let createdHardware: HardwareItem[] = [];
    
    if (cutList && cutList.length > 0) {
      const cutListData = cutList.map(item => ({
        projectId: project.id,
        partName: item.partName,
        quantity: item.quantity,
        length: item.length.toString(),
        width: item.width.toString(),
        thickness: item.thickness.toString(),
        material: item.material,
        unitPrice: item.unitPrice.toString(),
        notes: item.notes,
        status: item.status || "not_started",
      }));
      
      createdCutList = (await db.insert(cutListItems).values(cutListData).returning()).map(this.normalizeCutListItem);
    }
    
    if (hardware && hardware.length > 0) {
      const hardwareData = hardware.map(item => ({
        projectId: project.id,
        name: item.name,
        type: item.type,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
        notes: item.notes,
        url: item.url,
      }));
      
      createdHardware = (await db.insert(hardwareItems).values(hardwareData).returning()).map(this.normalizeHardwareItem);
    }
    
    return {
      ...project,
      cutList: createdCutList,
      hardware: createdHardware,
      notes: [],
    };
  }

  async updateProject(
    id: string, 
    updateData: UpdateProject, 
    cutList?: CutListItemForm[], 
    hardware?: HardwareItemForm[]
  ): Promise<ProjectWithDetails | undefined> {
    const existing = await this.getProject(id);
    if (!existing) return undefined;
    
    const [updated] = await db.update(projects)
      .set({
        title: updateData.title ?? existing.title,
        description: updateData.description ?? existing.description,
        imageUrl: updateData.imageUrl ?? existing.imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();
    
    let updatedCutList = existing.cutList;
    let updatedHardware = existing.hardware;
    
    if (cutList !== undefined) {
      await db.delete(cutListItems).where(eq(cutListItems.projectId, id));
      
      if (cutList.length > 0) {
        const cutListData = cutList.map(item => ({
          projectId: id,
          partName: item.partName,
          quantity: item.quantity,
          length: item.length.toString(),
          width: item.width.toString(),
          thickness: item.thickness.toString(),
          material: item.material,
          unitPrice: item.unitPrice.toString(),
          notes: item.notes,
          status: item.status || "not_started",
        }));
        
        updatedCutList = (await db.insert(cutListItems).values(cutListData).returning()).map(this.normalizeCutListItem);
      } else {
        updatedCutList = [];
      }
    }
    
    if (hardware !== undefined) {
      await db.delete(hardwareItems).where(eq(hardwareItems.projectId, id));
      
      if (hardware.length > 0) {
        const hardwareData = hardware.map(item => ({
          projectId: id,
          name: item.name,
          type: item.type,
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toString(),
          notes: item.notes,
          url: item.url,
        }));
        
        updatedHardware = (await db.insert(hardwareItems).values(hardwareData).returning()).map(this.normalizeHardwareItem);
      } else {
        updatedHardware = [];
      }
    }
    
    const notes = await db.select().from(projectNotes).where(eq(projectNotes.projectId, id)).orderBy(desc(projectNotes.createdAt));
    
    return {
      ...updated,
      cutList: updatedCutList,
      hardware: updatedHardware,
      notes,
    };
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }

  async cloneProject(id: string, newTitle?: string): Promise<ProjectWithDetails | undefined> {
    const existing = await this.getProject(id);
    if (!existing) return undefined;
    
    const clonedTitle = newTitle || `${existing.title} (Copy)`;
    
    const cutListForms: CutListItemForm[] = existing.cutList.map(item => ({
      partName: item.partName,
      quantity: item.quantity,
      length: typeof item.length === 'string' ? parseFloat(item.length) : item.length,
      width: typeof item.width === 'string' ? parseFloat(item.width) : item.width,
      thickness: typeof item.thickness === 'string' ? parseFloat(item.thickness) : item.thickness,
      material: item.material as any,
      unitPrice: typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice,
      notes: item.notes || undefined,
      status: "not_started" as const,
    }));
    
    const hardwareForms: HardwareItemForm[] = existing.hardware.map(item => ({
      name: item.name,
      type: item.type as any,
      size: item.size || undefined,
      quantity: item.quantity,
      unitPrice: typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice,
      notes: item.notes || undefined,
      url: item.url || undefined,
    }));
    
    return this.createProject(
      {
        title: clonedTitle,
        description: existing.description,
        imageUrl: existing.imageUrl,
      },
      cutListForms,
      hardwareForms
    );
  }

  // ============ CUT LIST ITEMS ============
  
  async updateCutListItemStatus(id: string, status: string): Promise<CutListItem | undefined> {
    const [updated] = await db.update(cutListItems)
      .set({ status })
      .where(eq(cutListItems.id, id))
      .returning();
    
    return updated ? this.normalizeCutListItem(updated) : undefined;
  }

  // ============ HARDWARE ITEMS ============
  
  async getHardwareItems(projectId: string): Promise<HardwareItem[]> {
    const items = await db.select().from(hardwareItems).where(eq(hardwareItems.projectId, projectId));
    return items.map(this.normalizeHardwareItem);
  }

  // ============ INVENTORY ============
  
  async getInventoryItems(): Promise<InventoryItem[]> {
    const items = await db.select().from(inventoryItems).orderBy(desc(inventoryItems.createdAt));
    return items.map(this.normalizeInventoryItem);
  }

  async getInventoryItem(id: string): Promise<InventoryItem | undefined> {
    const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id));
    return item ? this.normalizeInventoryItem(item) : undefined;
  }

  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const [created] = await db.insert(inventoryItems).values({
      name: item.name,
      material: item.material,
      length: item.length?.toString() || "0",
      width: item.width?.toString() || "0",
      thickness: item.thickness?.toString() || "0",
      quantity: item.quantity || 1,
      location: item.location,
      notes: item.notes,
    }).returning();
    
    return this.normalizeInventoryItem(created);
  }

  async updateInventoryItem(id: string, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const existing = await this.getInventoryItem(id);
    if (!existing) return undefined;
    
    const [updated] = await db.update(inventoryItems)
      .set({
        name: item.name ?? existing.name,
        material: item.material ?? existing.material,
        length: item.length?.toString() ?? existing.length.toString(),
        width: item.width?.toString() ?? existing.width.toString(),
        thickness: item.thickness?.toString() ?? existing.thickness.toString(),
        quantity: item.quantity ?? existing.quantity,
        location: item.location ?? existing.location,
        notes: item.notes ?? existing.notes,
      })
      .where(eq(inventoryItems.id, id))
      .returning();
    
    return updated ? this.normalizeInventoryItem(updated) : undefined;
  }

  async deleteInventoryItem(id: string): Promise<boolean> {
    const result = await db.delete(inventoryItems).where(eq(inventoryItems.id, id)).returning();
    return result.length > 0;
  }

  // ============ PROJECT NOTES ============
  
  async getProjectNotes(projectId: string): Promise<ProjectNote[]> {
    return db.select().from(projectNotes).where(eq(projectNotes.projectId, projectId)).orderBy(desc(projectNotes.createdAt));
  }

  async createProjectNote(note: InsertProjectNote): Promise<ProjectNote> {
    const [created] = await db.insert(projectNotes).values({
      projectId: note.projectId,
      content: note.content,
      imageUrl: note.imageUrl,
    }).returning();
    
    return created;
  }

  async deleteProjectNote(id: string): Promise<boolean> {
    const result = await db.delete(projectNotes).where(eq(projectNotes.id, id)).returning();
    return result.length > 0;
  }

  // ============ HELPERS ============
  
  private normalizeCutListItem(item: any): CutListItem {
    return {
      ...item,
      length: typeof item.length === 'string' ? parseFloat(item.length) : item.length,
      width: typeof item.width === 'string' ? parseFloat(item.width) : item.width,
      thickness: typeof item.thickness === 'string' ? parseFloat(item.thickness) : item.thickness,
      unitPrice: typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice,
    };
  }

  private normalizeHardwareItem(item: any): HardwareItem {
    return {
      ...item,
      unitPrice: typeof item.unitPrice === 'string' ? parseFloat(item.unitPrice) : item.unitPrice,
    };
  }

  private normalizeInventoryItem(item: any): InventoryItem {
    return {
      ...item,
      length: typeof item.length === 'string' ? parseFloat(item.length) : item.length,
      width: typeof item.width === 'string' ? parseFloat(item.width) : item.width,
      thickness: typeof item.thickness === 'string' ? parseFloat(item.thickness) : item.thickness,
    };
  }
}

export const storage = new DatabaseStorage();
