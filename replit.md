# WoodCraft Pro - DIY Woodworking Project Manager

## Overview
A web application for managing DIY woodworking projects with detailed cut lists, material tracking, cost estimates, and Home Depot integration. Built with React, Express, TypeScript, and PostgreSQL.

## Current State
- Full CRUD functionality for projects and cut lists
- PostgreSQL database persistence with Drizzle ORM
- Home Depot material pricing database with product links
- Image upload for project photos and blueprints
- AI-generated project images
- Material optimization calculator to minimize waste
- Shopping list export (print/CSV)
- Project templates library with 8 pre-built templates
- Project cloning functionality
- Hardware & fasteners tracking
- Inventory management for materials on hand
- Build progress tracking with status (not started/cut/assembled/finished)
- Project notes with timestamps
- Metric/Imperial unit conversion toggle
- Responsive design with dark/light mode support

## Project Structure

```
client/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Shadcn UI components
│   │   ├── header.tsx     # Navigation header
│   │   ├── project-card.tsx    # Project gallery card
│   │   ├── cut-list-table.tsx  # Cut list editor/viewer
│   │   ├── hardware-table.tsx  # Hardware/fasteners editor
│   │   ├── material-lookup.tsx # Home Depot price lookup
│   │   ├── image-upload.tsx    # File upload component
│   │   ├── optimization-calculator.tsx  # Waste calculator
│   │   ├── shopping-list-export.tsx     # Export to print/CSV
│   │   ├── project-notes.tsx   # Notes with timestamps
│   │   ├── unit-toggle.tsx     # Metric/imperial toggle
│   │   ├── metric-card.tsx     # Dashboard metrics
│   │   ├── empty-state.tsx     # Empty state illustration
│   │   ├── delete-dialog.tsx   # Delete confirmation
│   │   ├── loading-skeleton.tsx # Loading states
│   │   ├── theme-provider.tsx  # Dark/light theme
│   │   └── theme-toggle.tsx    # Theme switcher
│   ├── pages/             # Route pages
│   │   ├── home.tsx       # Landing page with hero & metrics
│   │   ├── projects.tsx   # Project gallery with filters
│   │   ├── project-detail.tsx  # Single project view with tabs
│   │   ├── project-form.tsx    # Create/edit project form
│   │   ├── inventory.tsx       # Inventory management page
│   │   └── templates.tsx       # Project templates library
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities
│   └── App.tsx            # Main app with routing
server/
├── db.ts                  # PostgreSQL database connection
├── routes.ts              # API endpoints (includes upload and materials)
├── storage.ts             # Database storage layer with Drizzle ORM
└── index.ts               # Express server setup
shared/
├── schema.ts              # TypeScript types & Zod schemas
├── materials-database.ts  # Home Depot product database
├── cut-optimizer.ts       # Bin packing optimization algorithm
└── project-templates.ts   # Pre-built project templates
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects with cut lists and hardware |
| GET | `/api/projects/:id` | Get project by ID with all details |
| POST | `/api/projects` | Create new project |
| PATCH | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/projects/:id/clone` | Clone/duplicate a project |
| GET | `/api/projects/:id/notes` | Get project notes |
| POST | `/api/projects/:id/notes` | Add project note |
| DELETE | `/api/notes/:id` | Delete project note |
| GET | `/api/inventory` | List inventory items |
| POST | `/api/inventory` | Add inventory item |
| PATCH | `/api/inventory/:id` | Update inventory item |
| DELETE | `/api/inventory/:id` | Delete inventory item |
| GET | `/api/materials` | Get materials (filter: ?material=Pine) |
| POST | `/api/upload` | Upload image file |
| GET | `/uploads/:filename` | Serve uploaded files |
| GET | `/generated_images/:filename` | Serve AI-generated images |

## Data Models

### Project
- `id`: UUID (auto-generated)
- `title`: string (required)
- `description`: string (optional)
- `imageUrl`: string (optional, supports upload, URL, or AI-generated)
- `cutList`: array of CutListItem
- `hardware`: array of HardwareItem
- `notes`: array of ProjectNote
- `createdAt`: ISO date string
- `updatedAt`: ISO date string

### CutListItem
- `id`: UUID (auto-generated)
- `projectId`: UUID (foreign key)
- `partName`: string (required)
- `quantity`: number (min: 1)
- `length`: number in inches
- `width`: number in inches
- `thickness`: number in inches
- `material`: MaterialType enum
- `unitPrice`: number (price per piece)
- `notes`: string (optional)
- `status`: ItemStatus enum (not_started/cut/assembled/finished)

### HardwareItem
- `id`: UUID (auto-generated)
- `projectId`: UUID (foreign key)
- `name`: string (required)
- `type`: HardwareType enum
- `size`: string (optional)
- `quantity`: number (min: 1)
- `unitPrice`: number
- `notes`: string (optional)
- `url`: string (optional, product link)

### InventoryItem
- `id`: UUID (auto-generated)
- `name`: string (required)
- `material`: MaterialType enum
- `length`, `width`, `thickness`: dimensions in inches
- `quantity`: number
- `location`: string (optional)
- `notes`: string (optional)

### ProjectNote
- `id`: UUID (auto-generated)
- `projectId`: UUID (foreign key)
- `content`: string (required)
- `imageUrl`: string (optional)
- `createdAt`: ISO date string

### Material Types
Pine, Oak, Maple, Walnut, Cherry, Birch, Plywood, MDF, Cedar, Poplar, Mahogany, Ash, Hickory, Other

### Hardware Types
Screw, Nail, Bolt, Hinge, Handle, Knob, Bracket, Dowel, Glue, Finish, Other

## Features

### Home Page
- Hero section with CTA
- Workshop overview metrics (projects, board feet, cost, pieces)
- Recent projects grid

### Projects Gallery
- Search by title/description
- Filter by material type
- Sort by date, cost, or name
- Delete with confirmation
- AI-generated project images

### Project Detail
- Full cut list table with status tracking
- Hardware/fasteners table (tabbed interface)
- Project summary card (pieces, board feet, cost)
- Material breakdown by type
- Material optimization calculator (boards needed, waste %, suggestions)
- Shopping list export (print-friendly, CSV download)
- Project notes timeline
- Clone project functionality
- Print-friendly view
- Edit and delete actions

### Project Form
- Title and description inputs
- Image upload (drag-and-drop or URL)
- Dynamic cut list editor with status tracking
- Hardware/fasteners editor
- Add/remove items
- Material selection with price lookup
- Automatic total calculations

### Inventory Management
- Track materials on hand
- Add/edit/delete inventory items
- Material type categorization
- Location tracking
- Notes for each item

### Home Depot Integration
- Curated database of lumber products with pricing
- Price lookup directly from cut list table
- Product links to Home Depot website
- SKU information for easy store lookup

### Material Optimization
- First-fit decreasing bin packing algorithm
- Groups cuts by material and thickness
- Calculates boards needed and waste percentage
- Provides optimization suggestions

### Shopping List Export
- Printable shopping list with checkboxes
- CSV export for spreadsheets
- Home Depot product links
- Estimated totals

### Project Templates
- 8 pre-built woodworking projects
- Categories: Furniture, Storage, Outdoor, Workshop, Decor
- Difficulty levels: Beginner, Intermediate, Advanced
- One-click project creation from template

## Design System
- Font: Inter (body), Playfair Display (headings)
- Color theme: Warm brown/wood tones
- Dark mode support
- Responsive design (mobile-first)

## Running the Application
```bash
npm run dev
```
Server runs on port 5000.

## Database
PostgreSQL database with Drizzle ORM. Tables:
- projects
- cut_list_items
- hardware_items
- inventory_items
- project_notes

## Future Enhancements
- [ ] User authentication
- [ ] Project sharing and collaboration
- [ ] Advanced PDF export for project plans
- [ ] Smart inventory deduction from shopping lists
