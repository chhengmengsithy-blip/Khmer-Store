# Khmer Store

Cambodia's premier online marketplace. Buy and sell vehicles, property, electronics, jobs, services, and more.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + Shadcn UI |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (Email + Google OAuth) |
| Storage | Supabase Storage |
| State | Zustand |
| Animations | Framer Motion |

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

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/migrations/001_schema.sql`
3. This creates all tables, RLS policies, indexes, triggers, and seeds the default categories

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (Settings > API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key (Settings > API) |
| `NEXT_PUBLIC_SITE_URL` | Your app URL (`http://localhost:3000` for local dev) |

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Database Setup

Run the full migration file in Supabase SQL Editor:

```
supabase/migrations/001_schema.sql
```

This file includes:
- All table definitions (profiles, listings, categories, messages, favorites, reports)
- Row Level Security (RLS) policies for every table
- Performance indexes on frequently queried columns
- Admin-specific policies
- Trigger for automatic profile creation on sign-up
- Seed data for the 9 marketplace categories

### Storage Buckets

Create the following public buckets in Supabase Dashboard > Storage:
- `listings` - for listing images
- `avatars` - for user profile photos

### Google OAuth (Optional)

1. Go to Supabase Dashboard > Authentication > Providers
2. Enable Google and add your OAuth credentials from Google Cloud Console
3. Add `http://localhost:3000/auth/callback` to authorized redirect URIs

## Admin Setup

To grant admin access:

1. Sign up with a regular account
2. Open Supabase Dashboard > Table Editor > `profiles`
3. Find your user row and set the `role` column to `admin`
4. Refresh the app to access the admin panel at `/admin`

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── (auth)/           # Auth pages (sign-in, sign-up, reset-password)
│   ├── admin/            # Admin panel (users, listings, categories, reports)
│   ├── category/[slug]/  # Category browsing
│   ├── dashboard/        # User dashboard (overview, listings, favorites, settings)
│   ├── listing/[id]/     # Listing detail
│   ├── marketplace/      # All listings with search and filters
│   └── messages/         # User messaging
├── components/
│   ├── ui/               # Shadcn UI primitives
│   ├── layout/           # Header, Footer, Mobile Nav
│   ├── shared/           # Reusable components (Logo, ListingCard, etc.)
│   └── animations/       # Framer Motion wrappers
├── features/
│   ├── auth/             # Auth forms and server actions
│   ├── admin/            # Admin components and server actions
│   ├── listings/         # Listing CRUD, favorites, reports
│   └── messages/         # Messaging server actions
├── lib/supabase/         # Supabase client helpers (server + client)
├── stores/               # Zustand stores (auth state)
├── config/               # Site configuration
├── constants/            # Static data (categories)
├── hooks/                # Custom React hooks
└── types/                # TypeScript interfaces
```

## Features

### Marketplace
- Browse listings with search, category filters, and sorting
- 9 built-in categories with subcategories
- Responsive grid layout with listing cards
- Individual listing pages with image gallery and seller info

### User Dashboard
- Overview with personal statistics
- Manage your own listings (edit, delete)
- View and manage favorited listings
- Profile settings with avatar upload

### Authentication
- Email and password sign-up / sign-in
- Google OAuth login
- Password reset via email
- Email verification
- Protected routes with middleware

### Messaging
- Direct messaging between buyers and sellers
- Real-time message interface

### Admin Panel
- Platform-wide statistics dashboard
- User management (role assignment, deletion)
- Listing moderation (approve, reject, remove)
- Category management (add, edit, delete)
- Report management (resolve, dismiss)

## Deployment

### Vercel (Recommended)

1. Push your repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add the following environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (set to your production domain)
4. Deploy

Make sure to update the Supabase auth redirect URL to include your production domain.

## License

Private project. All rights reserved.
