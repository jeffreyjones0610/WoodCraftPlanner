# WoodCraft Pro - DIY Woodworking Project Manager

## Overview
A web application for managing DIY woodworking projects with detailed cut lists, material tracking, cost estimates, and Home Depot integration. Built with React, Express, and TypeScript.

## Current State
- Full CRUD functionality for projects and cut lists
- Home Depot material pricing database with product links
- Image upload for project photos and blueprints
- Material optimization calculator to minimize waste
- Shopping list export (print/CSV)
- Project templates library with 8 pre-built templates
- Responsive design with dark/light mode support
- In-memory storage (no database persistence between restarts)

## Project Structure

```
client/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Shadcn UI components
│   │   ├── header.tsx     # Navigation header
│   │   ├── project-card.tsx    # Project gallery card
│   │   ├── cut-list-table.tsx  # Cut list editor/viewer
│   │   ├── material-lookup.tsx # Home Depot price lookup
│   │   ├── image-upload.tsx    # File upload component
│   │   ├── optimization-calculator.tsx  # Waste calculator
│   │   ├── shopping-list-export.tsx     # Export to print/CSV
│   │   ├── metric-card.tsx     # Dashboard metrics
│   │   ├── empty-state.tsx     # Empty state illustration
│   │   ├── delete-dialog.tsx   # Delete confirmation
│   │   ├── loading-skeleton.tsx # Loading states
│   │   ├── theme-provider.tsx  # Dark/light theme
│   │   └── theme-toggle.tsx    # Theme switcher
│   ├── pages/             # Route pages
│   │   ├── home.tsx       # Landing page with hero & metrics
│   │   ├── projects.tsx   # Project gallery with filters
│   │   ├── project-detail.tsx  # Single project view
│   │   ├── project-form.tsx    # Create/edit project form
│   │   └── templates.tsx       # Project templates library
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities
│   └── App.tsx            # Main app with routing
server/
├── routes.ts              # API endpoints (includes upload and materials)
├── storage.ts             # In-memory data storage
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
| GET | `/api/projects` | List all projects |
| GET | `/api/projects/:id` | Get project by ID |
| POST | `/api/projects` | Create new project |
| PATCH | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| GET | `/api/materials` | Get materials (filter: ?material=Pine) |
| POST | `/api/upload` | Upload image file |
| GET | `/uploads/:filename` | Serve uploaded files |

## Data Models

### Project
- `id`: UUID (auto-generated)
- `title`: string (required)
- `description`: string (optional)
- `imageUrl`: string (optional, supports upload or URL)
- `cutList`: array of CutListItem
- `createdAt`: ISO date string
- `updatedAt`: ISO date string

### CutListItem
- `id`: UUID (auto-generated)
- `partName`: string (required)
- `quantity`: number (min: 1)
- `length`: number in inches
- `width`: number in inches
- `thickness`: number in inches
- `material`: MaterialType enum
- `unitPrice`: number (price per piece)
- `notes`: string (optional)

### Material Types
Pine, Oak, Maple, Walnut, Cherry, Birch, Plywood, MDF, Cedar, Poplar, Mahogany, Ash, Hickory, Other

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

### Project Detail
- Full cut list table with totals
- Project summary card (pieces, board feet, cost)
- Material breakdown by type
- Material optimization calculator (boards needed, waste %, suggestions)
- Shopping list export (print-friendly, CSV download)
- Print-friendly view
- Edit and delete actions

### Project Form
- Title and description inputs
- Image upload (drag-and-drop or URL)
- Dynamic cut list editor
- Add/remove items
- Material selection with price lookup
- Automatic total calculations

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

## Future Enhancements
- [ ] PostgreSQL database for persistence
- [ ] User authentication
- [ ] Project sharing and collaboration
- [ ] PDF export for project plans
- [ ] Inventory tracking for materials on hand
