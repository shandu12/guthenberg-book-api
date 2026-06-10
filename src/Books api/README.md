# 📚 Belka - Digital Library

A modern digital library application built with Next.js and TypeScript. Browse books, manage your personal catalog, and review literature with a clean, responsive interface.

> **Technical Exercise** — Junior Frontend Developer Track

---

## ✨ Features

- 📖 **Browse Books Catalog** — Explore a comprehensive book database with multiple filtering options
- 👤 **Personal Library** — Create and manage your personal book collection
- ⭐ **Book Reviews** — Add ratings and comments to books you've read
- 💾 **Persistent State** — Redux with localStorage integration keeps your data across sessions
- 🎨 **Responsive Design** — Beautiful UI powered by Tailwind CSS v4
- 🔐 **JWT Authentication** — Secure API communication with token-based auth
- 🚀 **Type-Safe** — Full TypeScript support for reliability and developer experience

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16+ (App Router) |
| **Language** | TypeScript 6 |
| **Styling** | Tailwind CSS v4 + PostCSS |
| **State Management** | Redux Toolkit + redux-persist |
| **Backend** | Supabase (SSR-compatible client) |
| **Linting** | ESLint |

---

## 📋 Prerequisites

- Node.js 18+ (npm or yarn)
- Environment variables configured (see [Configuration](#-configuration))

---

##  Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env.local` file in the project root with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
src/
├── app/                              # Next.js App Router pages
│   ├── layout.tsx                    # Root layout with Redux Provider
│   ├── page.tsx                      # Home page
│   ├── globals.css                   # Tailwind global styles
│   ├── books/
│   │   ├── page.tsx                  # Books catalog & listing
│   │   └── [id]/
│   │       └── page.tsx              # Individual book detail page
│   └── user/
│       └── page.tsx                  # User profile & personal library
│
├── lib/
│   └── models.ts                     # TypeScript interfaces & types
│
├── store/                            # Redux state management
│   ├── store.ts                      # Redux store configuration + persist
│   ├── hooks.ts                      # Custom hooks (useAppDispatch, useAppSelector)
│   ├── StoreProvider.tsx             # Client-side Redux provider wrapper
│   └── slices/
│       ├── booksSlice.ts             # Books state & actions
│       ├── usersSlice.ts             # User state & actions
│       └── reviewsSlice.ts           # Reviews state & actions
│
└── utils/                            # Utility functions
    ├── apiClient.ts                  # Supabase HTTP client setup
    ├── apiFunctions.ts               # API helper methods
    ├── filtersForm.ts                # Form validation for filters
    ├── jwt.ts                        # JWT token utilities
    ├── types.ts                      # Shared utility types
    ├── validation.ts                 # Input validation schemas
    └── exampleBookResponse.json       # Mock data for development
```

---

## 📊 Data Models

### Book
```typescript
{
  id: string
  title: string
  authors: Author[]
  languages: string[]
  downloadCount: number
  imageUrl: string
  issued: string
  readingEaseScore: number
}
```

### Author
```typescript
{
  id: string
  name: string
}
```

### User
```typescript
{
  name: string
  catalogue: Book[]
  reviews?: Review[]
}
```

### Review
```typescript
{
  user: User
  book: Book
  comment?: string
  grade?: number
}
```

### Subject
```typescript
{
  name: string
}
```

---

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |

---

## ⚙️ Configuration

### Environment Variables
Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```
---

## 📦 State Management

The application uses **Redux Toolkit** with **redux-persist** to maintain application state:

- **Users State** — Current user profile and authentication

State persists to localStorage automatically, so user data survives page refreshes.

---

## 🔐 Authentication

JWT tokens are handled via the `jwt.ts` utility module. Tokens are:
- Stored securely (localStorage via redux-persist)
- Automatically attached to API requests
- Refreshed on expiration (if configured)

---

## 🎨 Styling

The project uses **Tailwind CSS v4** with PostCSS for processing. Key files:
- `globals.css` — Tailwind directives and global styles
- `tailwind.config.js` — Tailwind customization (if needed)
- `postcss.config.mjs` — PostCSS plugin configuration

---

## 📚 API Integration

API calls are managed through:
- `apiClient.ts` — Supabase client initialization
- `apiFunctions.ts` — Reusable API methods for books, users, reviews

---
