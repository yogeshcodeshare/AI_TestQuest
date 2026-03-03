# TestQuest AI - Agent Documentation

This document provides essential information for AI coding agents working on the TestQuest AI project.

## Project Overview

**TestQuest AI** is a gamified SDET (Software Development Engineer in Test) learning platform built with Next.js, TypeScript, and Supabase. The platform helps QA professionals learn automation testing, Playwright, Python, JavaScript, TypeScript, Git, Jenkins, and CI/CD through daily gamified missions.

### Key Features
- Multiple learning tracks (Python, JavaScript, TypeScript, Playwright, Git, Jenkins, CI/CD)
- Personalized daily missions based on user level and goals
- Gamification with XP, levels, streaks, and badges
- Instant feedback and detailed explanations
- Progress tracking with weak area detection

## Technology Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.3+ |
| Styling | Tailwind CSS 3.4+ |
| UI Components | shadcn/ui + Radix UI primitives |
| Database | Supabase Postgres |
| ORM | Prisma 5.7+ |
| Authentication | Supabase Auth (magic links) |
| Testing | Playwright (E2E), Vitest (unit) |
| State Management | Zustand |
| Validation | Zod |
| Charts | Recharts |
| Icons | Lucide React |

## Project Structure

```
testquest-ai/
├── prisma/                    # Database schema and seeding
│   ├── schema.prisma         # Prisma schema with all models
│   └── seed.ts               # Database seed script with sample content
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (admin)/          # Admin panel route group
│   │   │   ├── admin/        # Admin dashboard
│   │   │   ├── admin/tasks/  # Task management
│   │   │   └── admin/tracks/ # Track management
│   │   ├── (auth)/           # Authentication route group
│   │   │   ├── login/        # Login page (magic link)
│   │   │   └── register/     # Registration page
│   │   ├── (main)/           # Main app route group (protected)
│   │   │   ├── achievements/ # User achievements page
│   │   │   ├── dashboard/    # Main dashboard
│   │   │   ├── mission/      # Daily mission interface
│   │   │   ├── onboarding/   # New user onboarding flow
│   │   │   ├── profile/      # User profile
│   │   │   ├── progress/     # Learning progress
│   │   │   └── roadmap/      # Learning track roadmap
│   │   ├── api/              # API routes
│   │   │   ├── admin/        # Admin API endpoints
│   │   │   ├── auth/         # Auth callback handler
│   │   │   ├── onboarding/   # Onboarding submission
│   │   │   └── submissions/  # Task submission API
│   │   ├── auth/callback/    # OAuth callback route
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   ├── components/
│   │   ├── ui/               # shadcn/ui components (Button, Card, etc.)
│   │   ├── layout/           # Layout components (Navbar, Sidebar)
│   │   ├── gamification/     # XP, Streak, Level, Badge components
│   │   └── tasks/            # Task-related components
│   ├── lib/
│   │   ├── prisma.ts         # Prisma client singleton
│   │   ├── supabase/         # Supabase clients
│   │   │   ├── client.ts     # Browser client
│   │   │   ├── server.ts     # Server client
│   │   │   └── middleware.ts # Auth middleware
│   │   ├── mock/             # Mock data for development
│   │   ├── constants.ts      # App constants (XP values, badges, etc.)
│   │   └── utils.ts          # Utility functions (cn, formatters, etc.)
│   ├── services/
│   │   ├── mission-generator.ts   # Daily mission generation logic
│   │   ├── evaluation-engine.ts   # Task evaluation logic
│   │   └── gamification-engine.ts # XP, streak, badge logic
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── styles/
│   │   └── globals.css       # Global styles + Tailwind
│   └── middleware.ts         # Next.js middleware for auth
├── tests/
│   └── e2e/                  # Playwright E2E tests
├── docs/                     # Documentation
└── .github/workflows/        # CI/CD configuration
```

## Build and Development Commands

```bash
# Development
npm run dev                    # Start development server (localhost:3000)

# Build
npm run build                  # Build for production (includes prisma generate)
npm run start                  # Start production server

# Code Quality
npm run lint                   # Run ESLint
npm run typecheck              # Run TypeScript type check (tsc --noEmit)

# Database
npm run db:generate            # Generate Prisma client
npm run db:migrate             # Run database migrations
npm run db:studio              # Open Prisma Studio
npm run db:seed                # Seed database with sample content
npm run db:reset               # Reset database and reseed

# Testing
npm run test                   # Run Vitest unit tests
npm run test:e2e               # Run Playwright E2E tests
npm run test:e2e:ui            # Run Playwright tests with UI
```

## Environment Variables

Create `.env.local` file with these variables:

```env
# Supabase Configuration (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database (required)
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# App Configuration (optional, has defaults)
NEXT_PUBLIC_APP_NAME="TestQuest AI"
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Admin Configuration
ADMIN_EMAILS=admin@example.com
```

## Database Schema

The database uses Prisma ORM with PostgreSQL. Key models:

### User & Auth
- `User` - Core user entity with email, role
- `UserProfile` - Extended profile (goal, level, daily minutes, XP, level)
- `UserPreferences` - Selected tracks, notification settings

### Learning Content
- `Track` - Learning paths (Python, Playwright, etc.)
- `Module` - Sections within tracks
- `Task` - Individual learning tasks/questions
- `TaskOption` - MCQ options for tasks

### Daily Missions
- `DailyMission` - User's daily mission
- `DailyTask` - Individual tasks within a mission

### Submissions & Evaluation
- `Submission` - User's answer to a task
- Evaluation results stored with score, feedback, XP earned

### Gamification
- `Streak` - User's current and longest streak
- `StreakDay` - Daily streak history
- `XpLog` - XP transaction log
- `Badge` - Achievable badges
- `UserBadge` - User's unlocked badges
- `UserProgress` - Progress by topic/track/module
- `UserTrackProgress` - Track completion progress

## Key Architectural Patterns

### 1. Route Groups
The app uses Next.js route groups for organization:
- `(auth)` - Authentication pages with shared layout
- `(main)` - Protected app pages with sidebar layout
- `(admin)` - Admin panel with admin layout

### 2. Server Components by Default
Most pages are Server Components that directly query the database using Prisma. Client components are used for interactivity.

### 3. Authentication Flow
- Supabase Auth with magic links (passwordless)
- Middleware (`src/middleware.ts`) handles session refresh
- Protected routes redirect to `/login` if unauthenticated

### 4. Path Aliases
TypeScript path aliases defined in `tsconfig.json`:
- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/lib/*` → `./src/lib/*`
- `@/types/*` → `./src/types/*`
- `@/hooks/*` → `./src/hooks/*`
- `@/actions/*` → `./src/actions/*`
- `@/services/*` → `./src/services/*`

## Code Style Guidelines

### TypeScript
- Strict mode enabled
- Use explicit return types for public functions
- Prefer `interface` over `type` for object shapes
- Use enums from `@prisma/client` for database enums

### React Components
- Use function components with explicit return types
- Props interfaces named `{ComponentName}Props`
- Use `cn()` utility for conditional class names
- shadcn/ui components follow the `class-variance-authority` pattern

### Styling
- Tailwind CSS for all styling
- Use CSS variables for theming (defined in `globals.css`)
- Custom gamification colors: `xp`, `streak`, `level`, `success`, `warning`
- Animation utilities: `animate-pulse-glow`, `animate-slide-in`, `animate-bounce-xp`

### Imports Order
1. React/Next.js imports
2. Third-party libraries
3. `@/` aliases (internal modules)
4. Relative imports

## Testing Strategy

### E2E Tests (Playwright)
Located in `tests/e2e/`. Tests cover:
- Authentication flows
- Landing page functionality
- Protected route redirection

Playwright config includes tests for:
- Desktop: Chrome, Firefox, Safari
- Mobile: Pixel 5, iPhone 12

### Running Tests
```bash
# E2E tests
npm run test:e2e

# E2E with UI
npm run test:e2e:ui

# Unit tests
npm run test
```

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`):

1. **lint-and-typecheck**: Runs ESLint and TypeScript checks
2. **build**: Builds the Next.js application
3. **e2e** (commented out): Can be enabled for full E2E testing

Triggered on:
- Push to `main` or `develop`
- Pull requests to `main`

## Gamification System

### XP System
```typescript
XP.TASK_CORRECT_EASY = 10
XP.TASK_CORRECT_MEDIUM = 20
XP.TASK_CORRECT_HARD = 30
XP.TASK_PARTIAL_MULTIPLIER = 0.5
XP.STREAK_BONUS_BASE = 5
XP.DAILY_BONUS = 50
XP.PERFECT_DAY_BONUS = 100
```

### Level Formula
Level = cumulative XP threshold (Level 1: 0-100, Level 2: 100-300, Level 3: 300-600, etc.)
Each level requires `level * 100` XP.

### Streak Rules
- Minimum 1 task completed to maintain streak
- 48-hour window to restore a broken streak

## Development Workflow

1. **First-time setup**:
   ```bash
   npm install
   cp .env.example .env.local
   # Configure environment variables
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

2. **Before committing**:
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```

3. **Database changes**:
   - Modify `prisma/schema.prisma`
   - Run `npm run db:migrate`
   - Update seed data if needed
   - Regenerate client with `npm run db:generate`

## Security Considerations

1. **Authentication**: All API routes and pages check for authenticated users
2. **Authorization**: Admin routes check `ADMIN_EMAILS` env variable
3. **Database**: Use Prisma ORM to prevent SQL injection
4. **Environment Variables**: Never commit `.env.local` or `.env.*.local`
5. **Service Role Key**: Only use on server-side, never expose to client

## Common Tasks

### Adding a New Track
1. Add track slug to `TRACK_SLUGS` in `src/lib/constants.ts`
2. Create track seed function in `prisma/seed.ts`
3. Run `npm run db:seed`

### Adding a New UI Component
```bash
npx shadcn add <component-name>
```

### Creating a New API Route
Create file in `src/app/api/<route>/route.ts` following Next.js App Router conventions.

### Adding a New Gamification Badge
1. Add badge definition in `prisma/seed.ts` `createBadges()`
2. Add badge check logic in `src/services/gamification-engine.ts`
3. Re-seed database

## Useful Resources

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Playwright](https://playwright.dev/)
