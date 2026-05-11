<h1 align="center">OTS Notion</h1>

<p align="center">
  <strong>A full-featured Notion-inspired workspace built with Next.js 14, Prisma, and PostgreSQL</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-000000?logo=next.js&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma&logoColor=white" alt="Prisma"/>
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License"/>
</p>

---

## Overview

**OTS Notion** is a productivity workspace application that replicates the core functionality of Notion. Built with the modern React/Next.js ecosystem, it features a rich block-based editor (Tiptap), nested page hierarchy, inline databases with multiple views, drag-and-drop reordering, full-text search, and a template gallery — all wrapped in a polished dark-mode interface.

---

## Features

- **Rich Block Editor** — Powered by Tiptap with 15+ extensions: headings, lists, code blocks (syntax-highlighted via Lowlight), tables, images, links, task lists, text alignment, color, highlights, and math (KaTeX)
- **Nested Pages** — Infinite page hierarchy with parent-child relationships and cascading deletes
- **Inline Databases** — Full database engine with custom properties, rows, cells, and multiple view types (table, board, etc.)
- **Drag & Drop** — Reorder pages and blocks via `@dnd-kit` with sortable containers
- **Full-Text Search** — Instant search across all pages with content preview
- **Template Gallery** — Pre-built templates organized by category for quick page creation
- **Favorites & Archive** — Star important pages and soft-delete with archive functionality
- **Responsive Sidebar** — Collapsible navigation with page tree, favorites, and quick actions
- **State Management** — Zustand for lightweight, reactive global state
- **Dark Mode** — Premium dark theme throughout the entire application

---

## Technologies

| Layer | Stack |
|-------|-------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5.6 |
| **UI** | React 18, TailwindCSS 3.4, Lucide React icons |
| **Editor** | Tiptap 2.10 (15+ extensions) |
| **Database** | PostgreSQL via Prisma ORM 5.22 |
| **State** | Zustand 5.0 |
| **DnD** | @dnd-kit (core + sortable) |
| **Utilities** | date-fns, html-to-text, turndown (HTML→Markdown), KaTeX |
| **Notifications** | react-hot-toast |

---

## Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+

### Setup

```bash
git clone https://github.com/yourusername/OTS_Notion.git
cd OTS_Notion

# One-command setup: install deps, generate Prisma client, push schema, seed data
npm run setup

# Or step by step:
npm install
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ots_notion?schema=public"
```

---

## Usage

1. Open `http://localhost:3000`
2. Create new pages via the sidebar or homepage quick actions
3. Use the rich editor to write content with blocks, headings, code, tables, and more
4. Organize pages into nested hierarchies by dragging in the sidebar
5. Create inline databases within pages
6. Search across all pages with `Ctrl+K`
7. Browse and use templates from the Template Gallery

---

## Project Structure

```
OTS_Notion/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Homepage — recent pages, quick actions
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles and design tokens
│   │   ├── [pageId]/          # Dynamic page routes
│   │   └── api/               # API routes (Next.js Route Handlers)
│   │
│   ├── components/
│   │   ├── editor/            # Tiptap editor with toolbar
│   │   ├── sidebar/           # Collapsible sidebar with page tree
│   │   ├── page/              # Page header, cover, icon
│   │   ├── database/          # Inline database views & controls
│   │   ├── search/            # Search modal
│   │   └── templates/         # Template gallery
│   │
│   ├── hooks/                 # Custom React hooks
│   └── lib/
│       └── store.ts           # Zustand global state
│
├── prisma/
│   ├── schema.prisma          # Database schema (6 models)
│   └── seed.ts                # Database seeder with sample data
│
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

---

## Database Schema

| Model | Description |
|-------|-------------|
| `Page` | Core entity — title, icon, cover, nested hierarchy, favorites, archive |
| `Block` | Content blocks within pages |
| `Database` | Inline databases linked to pages |
| `DatabaseProperty` | Column definitions (name, type, config) |
| `DatabaseRow` | Data rows |
| `DatabaseCell` | Individual cell values |
| `DatabaseView` | Saved view configurations (table, board, etc.) |

---

## Screenshots

| Homepage | Page Editor | Database View |
|:---:|:---:|:---:|
| ![Home](screenshots/home.png) | ![Editor](screenshots/editor.png) | ![Database](screenshots/database.png) |

---

## Future Improvements

- [ ] Real-time collaboration (WebSocket / CRDT)
- [ ] User authentication and multi-user workspaces
- [ ] File and image uploads
- [ ] Calendar and timeline database views
- [ ] Page version history and undo
- [ ] Export to PDF / Markdown
- [ ] Mobile-responsive layout
- [ ] API rate limiting and caching

---

## License

This project is licensed under the **MIT License**.

---

<p align="center"><sub>Built with Next.js, Prisma, and Tiptap</sub></p>
