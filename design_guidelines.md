# DIY Woodworking Project Manager - Design Guidelines

## Design Approach

**System-Based Approach** inspired by productivity tools (Notion, Linear) with woodworking aesthetic accents.

**Rationale:** This is a utility-focused, information-dense application requiring efficient data entry, clear hierarchy, and consistent patterns for managing structured content (dimensions, costs, materials).

## Core Design Principles

1. **Clarity Over Decoration** - Data-first interface with strong visual hierarchy
2. **Efficient Data Entry** - Streamlined forms optimized for repetitive input
3. **Scannable Information** - Tables and cards designed for quick comprehension
4. **Woodworking Context** - Warm, natural aesthetic without compromising functionality

## Typography System

**Font Families:**
- Primary: Inter (body text, UI elements, data tables)
- Accent: Playfair Display (project titles, hero headings only)

**Hierarchy:**
- Hero/Page Titles: text-4xl to text-5xl, font-bold (Playfair)
- Section Headers: text-2xl, font-semibold (Inter)
- Card Titles: text-xl, font-semibold
- Body/Labels: text-base, font-medium
- Data/Metrics: text-sm to text-base, font-normal
- Captions: text-sm, font-normal

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section spacing: space-y-6 to space-y-8
- Card gaps: gap-4 to gap-6
- Form field spacing: space-y-4

**Grid Structure:**
- Main container: max-w-7xl mx-auto
- Two-column layouts: grid-cols-1 lg:grid-cols-2 with gap-8
- Project gallery: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 with gap-6
- Dashboard metrics: grid-cols-2 md:grid-cols-4

## Component Library

**Navigation**
- Top navbar with logo, navigation links, and "New Project" CTA button
- Sticky positioning for persistent access
- Mobile hamburger menu

**Project Cards**
- Image preview at top (blueprint/project photo)
- Project title, description preview
- Quick stats badges (materials count, total cost, cut pieces)
- Action buttons (View, Edit, Delete) in footer

**Forms & Data Entry**
- Organized sections with clear labels
- Inline validation messaging
- Multi-step forms for project creation
- Input groups for dimensions (length × width × thickness)
- Dropdown selects for material types (Pine, Oak, Plywood, MDF, etc.)

**Cut List Table**
- Compact table design with alternating row backgrounds
- Columns: Part Name, Quantity, Dimensions, Material, Unit Cost, Total
- Inline editing capability
- Running total footer row
- Add row button prominently placed

**Material Summary Dashboard**
- Metric cards showing: Total Projects, Total Board Feet, Estimated Cost
- Material breakdown chart/list
- Recent projects list with thumbnails

**Data Displays**
- Read-only detail views with clear label-value pairs
- Collapsible sections for cut lists on project detail pages
- Cost breakdown with itemized view

**Modals**
- Confirmation dialogs for destructive actions (delete)
- Full-screen or large modals for project creation/editing
- Overlay backdrop with blur effect

## Images

**Hero Section Image:**
Yes - Include a warm, inviting hero image showing woodworking tools on workbench or finished wooden projects. Image should be 40-50vh height with subtle overlay for text legibility.

**Project Gallery Images:**
Each project card displays user-uploaded blueprint sketch, finished project photo, or material layout visualization. Aspect ratio 4:3 or 16:9, consistent across cards.

**Empty States:**
Illustrated empty state for no projects yet - simple line drawing of woodworking tools with encouraging copy.

**Placement:**
- Hero: Full-width background image with centered content overlay
- Cards: Top-aligned thumbnails in consistent containers
- Detail pages: Large featured image with gallery thumbnail strip below

## Interactions

**Minimal Animations:**
- Smooth page transitions (200ms ease)
- Card hover lift effect (subtle shadow increase)
- Button press feedback only
- No scroll-triggered or complex animations

## Layout Specifications

**Dashboard/Home Page:**
- Hero section with welcome message and "Create New Project" CTA (buttons on hero use backdrop-blur-md with semi-transparent background)
- Metrics overview cards (4-column grid on desktop)
- Recent projects grid (3 columns desktop, 2 tablet, 1 mobile)

**Project Creation Form:**
- Step 1: Project Details (title, description, image upload)
- Step 2: Cut List Builder (dynamic table with add/remove rows)
- Step 3: Material Costs (pricing input per item or manual total)
- Progress indicator at top
- Sticky bottom navigation (Previous/Next/Save buttons)

**Project Detail View:**
- Full-width featured image
- Two-column layout: Left (cut list table), Right (project info, material summary, cost breakdown)
- Edit/Delete action buttons in header
- Print-friendly view option

**Project Gallery:**
- Filter/sort controls (by date, cost, material type)
- Search bar
- Masonry or standard grid layout
- Pagination or infinite scroll

This design creates a professional, purposeful woodworking project management tool that balances warm, crafted aesthetics with efficient, data-focused functionality.