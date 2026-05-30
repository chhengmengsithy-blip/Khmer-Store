# Khmer Store V3

Cambodia's premier online marketplace. Buy and sell vehicles, property, electronics, jobs, and more.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + Shadcn UI
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (Email + Google OAuth)
- **Storage:** Supabase Storage
- **State:** Zustand
- **Animations:** Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- A [Supabase](https://supabase.com) account

### 1. Clone and Install

```bash
git clone https://github.com/chhengmengsithy-blip/Khmer-Store.git
cd Khmer-Store
pnpm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/migrations/001_schema.sql`
3. This creates all tables, RLS policies, triggers, and seeds 9 categories

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL (Settings > API)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key (Settings > API)
- `NEXT_PUBLIC_SITE_URL` - Your app URL (http://localhost:3000 for local dev)

### 4. Enable Google OAuth (Optional)

1. Go to Supabase Dashboard > Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials (Client ID and Secret from Google Cloud Console)
4. Add `http://localhost:3000/auth/callback` to authorized redirect URIs

### 5. Create Storage Buckets

In Supabase Dashboard > Storage:
1. Create a bucket called `listings` (public)
2. Create a bucket called `avatars` (public)

### 6. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

### User Features
- Browse marketplace with search, category filters, and sorting
- Post listings with image uploads
- User dashboard with stats, listings management, and favorites
- Real-time messaging between buyers and sellers
- Profile settings with avatar upload

### Authentication
- Email + Password sign up/sign in
- Google OAuth login
- Password reset via email
- Email verification
- Protected routes with automatic redirect

### Admin Panel (/admin)
- Dashboard with platform statistics
- User management (roles, deletion)
- Listing moderation (approve, reject, remove)
- Category management (CRUD, reorder)
- Report management (resolve, dismiss)

To access the admin panel, set your user's `role` to `'admin'` in the `profiles` table.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── (auth)/       # Auth pages (sign-in, sign-up, verify, etc.)
│   ├── admin/        # Admin panel
│   ├── dashboard/    # User dashboard
│   └── ...           # Public pages
├── components/
│   ├── ui/           # Shadcn UI primitives
│   ├── layout/       # Header, Footer, Mobile Nav
│   ├── providers/    # Auth provider
│   └── shared/       # Reusable components
├── features/
│   ├── auth/         # Auth forms and actions
│   ├── admin/        # Admin components and actions
│   ├── listings/     # Listing actions
│   └── messages/     # Message actions
├── lib/supabase/     # Supabase client helpers
├── stores/           # Zustand stores
├── types/            # TypeScript types
└── constants/        # Static data (categories)
```

## License

Private project.
