# Ala Uddin Admin Panel

ALA UDDIN platform-এর জন্য নির্মিত একটি React + TypeScript ভিত্তিক Admin Dashboard।
এখানে Product, Category, Brand, Attribute, Banner, Role, Staff এবং Auth সম্পর্কিত panel operations রয়েছে।

## Tech Stack

- React 19
- TypeScript
- Vite 8
- Tailwind CSS 4
- React Router
- React Hook Form + Zod
- TanStack React Query
- Axios
- TipTap Editor
- Radix UI + custom UI components

## Prerequisites

লোকাল মেশিনে নিচের টুলস থাকলে ভালো:

- Node.js 20+
- npm 10+
- Backend API server (default: http://localhost:5000)

## Getting Started

1. Repository clone করুন

```bash
git clone <repo-url>
cd ala_uddin_admin
```

2. Dependencies install করুন

```bash
npm install
```

3. Development server চালু করুন

```bash
npm run dev
```

ডিফল্টভাবে app চলে: http://localhost:3000

## Available Scripts

```bash
npm run dev      # Vite dev server
npm run build    # TypeScript build + Vite production build
npm run preview  # Production build preview
npm run lint     # ESLint check
```

## API Configuration

Axios base URL বর্তমানে hardcoded আছে নিচের ফাইলে:

- src/api/base-api/base.api.ts

Current value:

```ts
baseURL: "http://localhost:5000/api/v1";
```

Backend URL change করতে চাইলে এই ফাইল update করুন।

## Project Structure (High-Level)

```text
src/
  api/                 # API layer (axios + resource-wise hooks)
  app/                 # app root, pages, route groups
  components/          # reusable and module-specific components
  context/             # auth context and global providers
  helper/              # utility hooks/helpers/constants
  hooks/               # shared custom hooks
  interface/           # common TS types
  layout/              # root/auth/admin layouts
  provider/            # query provider and other wrappers
  schema/              # form schema and form interface contracts
```

## Routing Overview

- /auth/\* : authentication pages
- protected admin area: PrivateRoute এর মাধ্যমে admin-only access
- modules: dashboard, website, staff, product routes

Main router config: src/app/router/base-route/base.route.tsx

## Authentication Flow

- Auth state maintained in: src/context/auth-context.tsx
- Initial admin check: GET /admin
- Login endpoint: POST /admin/login
- Logout endpoint: GET /admin/logout
- Axios requests run with credentials enabled

## Build & Deployment Notes

- `npm run build` সফল হলে `dist/` এ production assets তৈরি হবে
- Static hosting বা reverse proxy দিয়ে serve করা যাবে
- Backend API origin/credentials policy production environment অনুযায়ী সেট করুন

## Common Development Notes

- Path alias `@` -> src (configured in vite.config.ts)
- UI form handling mostly React Hook Form + controlled components
- Product module-এ variation generation, bulk update, image handling integrated

## Troubleshooting

- App open না হলে check করুন backend server running আছে কিনা
- CORS / cookie issue হলে backend credentials + allowed origin verify করুন
- UI তে stale data দেখালে hard refresh বা relevant query invalidation verify করুন

## License

This project is private/internal unless your organization specifies otherwise.
