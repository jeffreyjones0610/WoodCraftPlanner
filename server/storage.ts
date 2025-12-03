import { 
  type Project, 
  type InsertProject, 
  type UpdateProject,
  type CutListItem,
  type InsertCutListItem 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: UpdateProject): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private projects: Map<string, Project>;

  constructor() {
    this.projects = new Map();
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const now = new Date().toISOString();
    
    const cutList: CutListItem[] = (insertProject.cutList || []).map((item) => ({
      id: randomUUID(),
      partName: item.partName,
      quantity: item.quantity,
      length: item.length,
      width: item.width,
      thickness: item.thickness,
      material: item.material,
      unitPrice: item.unitPrice,
      notes: item.notes,
    }));

    const project: Project = {
      id,
      title: insertProject.title,
      description: insertProject.description,
      imageUrl: insertProject.imageUrl,
      cutList,
      createdAt: now,
      updatedAt: now,
    };

    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updateData: UpdateProject): Promise<Project | undefined> {
    const existing = this.projects.get(id);
    if (!existing) {
      return undefined;
    }

    const cutList: CutListItem[] = updateData.cutList 
      ? updateData.cutList.map((item) => ({
          id: randomUUID(),
          partName: item.partName,
          quantity: item.quantity,
          length: item.length,
          width: item.width,
          thickness: item.thickness,
          material: item.material,
          unitPrice: item.unitPrice,
          notes: item.notes,
        }))
      : existing.cutList;

    const updated: Project = {
      ...existing,
      title: updateData.title ?? existing.title,
      description: updateData.description ?? existing.description,
      imageUrl: updateData.imageUrl ?? existing.imageUrl,
      cutList,
      updatedAt: new Date().toISOString(),
    };

    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }
}

export const storage = new MemStorage();
