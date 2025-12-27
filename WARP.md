# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Next.js 15 SaaS application for appointment scheduling and service management, built with TypeScript, Prisma ORM (PostgreSQL), NextAuth.js v5, and shadcn/ui components. The application supports multi-tenant clinics/professionals managing services, appointments, reminders, and subscription plans.

## Development Commands

### Running the Application
```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Build production bundle
npm run start        # Start production server
```

### Database Management
```bash
npx prisma generate      # Generate Prisma Client (outputs to generated/prisma)
npx prisma migrate dev   # Create and apply migrations in development
npx prisma migrate deploy # Apply migrations in production
npx prisma studio        # Open Prisma Studio GUI
npx prisma db push       # Push schema changes without migrations (dev only)
npx prisma db seed       # Run seed script if defined
```

### Component Generation (shadcn/ui)
```bash
npx shadcn@latest add [component-name]  # Add new shadcn/ui component
```

## Architecture

### Route Group Organization

The app uses Next.js route groups to separate public and authenticated sections:

- **`(public)`** - Unauthenticated routes (landing page, login)
  - Public homepage at `/`
  - Authentication handled via NextAuth GitHub provider

- **`(panel)`** - Protected routes under `/dashboard`
  - Dashboard overview
  - `/dashboard/profile` - User profile management
  - `/dashboard/services` - Service CRUD operations
  - `/dashboard/plans` - Subscription plan management

### Folder Conventions

The codebase follows a co-location pattern with naming conventions:

- **`_components/`** - Private components scoped to a route (not exposed as routes)
- **`_actions/`** - Server Actions for mutations
- **`_data-access/`** - Data fetching functions (read operations)

These underscore-prefixed folders are ignored by Next.js routing.

### Database Architecture

**Prisma Schema Key Points:**
- Custom Prisma Client output: `generated/prisma` (not the default location)
- PostgreSQL database with `DATABASE_URL` env variable
- NextAuth v5 adapter integration for authentication tables

**Core Models:**
- **User** - Clinic/professional accounts with subscription, services, appointments, reminders
  - Includes Stripe integration via `stripe_customer_id`
  - Supports timezone and custom availability times
- **Subscription** - BASIC/PROFESSIONAL plans with Stripe price IDs
- **Service** - Services offered by users (name, price, duration, status)
- **Appointment** - Bookings linked to services and users
- **Reminder** - User-specific reminder notes

### Authentication

- NextAuth v5 (beta) with GitHub OAuth provider
- Prisma adapter for session/account storage
- Auth configuration: `src/lib/auth.ts`
- API route handler: `src/app/api/auth/[...nextauth]/route.ts`
- Session helper: `getSession()` from `@/lib/getSession`

### Prisma Client Usage

Import Prisma from the custom location:
```typescript
import prisma from '@/lib/prisma'
```

The Prisma instance is singleton-managed to prevent connection exhaustion in development.

### Styling

- Tailwind CSS v4 with shadcn/ui (New York style)
- Global styles: `src/app/globals.css`
- Path alias: `@/*` maps to `src/*`
- Component library: shadcn/ui with Radix UI primitives and Lucide icons

### Environment Variables Required

Create a `.env` file with:
```
DATABASE_URL="postgresql://..."       # PostgreSQL connection string
AUTH_GITHUB_ID="..."                  # GitHub OAuth App ID
AUTH_GITHUB_SECRET="..."              # GitHub OAuth App Secret
AUTH_SECRET="..."                     # NextAuth secret (generate with `openssl rand -base64 32`)
```

## Key Technical Details

- **TypeScript**: Strict mode enabled, ES2017 target
- **React**: Version 19 with Server Components by default
- **Form handling**: react-hook-form with Zod validation
- **UI Components**: shadcn/ui components located in `src/components/ui/`
- **Authentication Flow**: Server-side session checks with redirects to `/` for unauthorized access
