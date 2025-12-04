import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  projectFormSchema,
  insertInventoryItemSchema,
  insertProjectNoteSchema,
  itemStatusTypes,
} from "@shared/schema";
import { getProductsByMaterial, getAllProducts } from "@shared/materials-database";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for image uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Serve uploaded files
  app.use("/uploads", (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=31536000");
    next();
  });
  app.use("/uploads", express.static(uploadDir));

  // Materials API
  app.get("/api/materials", async (req, res) => {
    try {
      const material = req.query.material as string;
      if (material) {
        const products = getProductsByMaterial(material);
        res.json(products);
      } else {
        const allProducts = getAllProducts();
        res.json(allProducts);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
      res.status(500).json({ error: "Failed to fetch materials" });
    }
  });

  // Image upload API
  app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ url: imageUrl, filename: req.file.filename });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });
  
  // ============ PROJECTS API ============
  
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validated = projectFormSchema.parse(req.body);
      const project = await storage.createProject(
        {
          title: validated.title,
          description: validated.description,
          imageUrl: validated.imageUrl,
        },
        validated.cutList,
        validated.hardware
      );
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const validated = projectFormSchema.partial().parse(req.body);
      const project = await storage.updateProject(
        req.params.id, 
        {
          title: validated.title,
          description: validated.description,
          imageUrl: validated.imageUrl,
        },
        validated.cutList,
        validated.hardware
      );
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Clone project
  app.post("/api/projects/:id/clone", async (req, res) => {
    try {
      const newTitle = req.body.title as string | undefined;
      const cloned = await storage.cloneProject(req.params.id, newTitle);
      if (!cloned) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.status(201).json(cloned);
    } catch (error) {
      console.error("Error cloning project:", error);
      res.status(500).json({ error: "Failed to clone project" });
    }
  });

  // ============ CUT LIST ITEMS API ============
  
  // Update cut list item status (for progress tracking)
  app.patch("/api/cut-list-items/:id/status", async (req, res) => {
    try {
      const status = req.body.status as string;
      if (!itemStatusTypes.includes(status as any)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      const updated = await storage.updateCutListItemStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ error: "Cut list item not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating cut list item status:", error);
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  // ============ INVENTORY API ============
  
  app.get("/api/inventory", async (req, res) => {
    try {
      const items = await storage.getInventoryItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ error: "Failed to fetch inventory" });
    }
  });

  app.get("/api/inventory/:id", async (req, res) => {
    try {
      const item = await storage.getInventoryItem(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Inventory item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching inventory item:", error);
      res.status(500).json({ error: "Failed to fetch inventory item" });
    }
  });

  app.post("/api/inventory", async (req, res) => {
    try {
      const validated = insertInventoryItemSchema.parse(req.body);
      const item = await storage.createInventoryItem(validated);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      console.error("Error creating inventory item:", error);
      res.status(500).json({ error: "Failed to create inventory item" });
    }
  });

  app.patch("/api/inventory/:id", async (req, res) => {
    try {
      const validated = insertInventoryItemSchema.partial().parse(req.body);
      const item = await storage.updateInventoryItem(req.params.id, validated);
      if (!item) {
        return res.status(404).json({ error: "Inventory item not found" });
      }
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      console.error("Error updating inventory item:", error);
      res.status(500).json({ error: "Failed to update inventory item" });
    }
  });

  app.delete("/api/inventory/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteInventoryItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Inventory item not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      res.status(500).json({ error: "Failed to delete inventory item" });
    }
  });

  // ============ PROJECT NOTES API ============
  
  app.get("/api/projects/:projectId/notes", async (req, res) => {
    try {
      const notes = await storage.getProjectNotes(req.params.projectId);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching project notes:", error);
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  app.post("/api/projects/:projectId/notes", async (req, res) => {
    try {
      const validated = insertProjectNoteSchema.parse({
        ...req.body,
        projectId: req.params.projectId,
      });
      const note = await storage.createProjectNote(validated);
      res.status(201).json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      }
      console.error("Error creating project note:", error);
      res.status(500).json({ error: "Failed to create note" });
    }
  });

  app.delete("/api/notes/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProjectNote(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Note not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project note:", error);
      res.status(500).json({ error: "Failed to delete note" });
    }
  });

  return httpServer;
}
