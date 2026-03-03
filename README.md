# TestQuest AI

A gamified SDET learning platform built with Next.js, TypeScript, and Supabase. Learn automation testing, Playwright, Python, and CI/CD through daily missions.

## Features

- 📚 **Multiple Learning Tracks**: Python, JavaScript, TypeScript, Playwright, Git, Jenkins, CI/CD
- 🎯 **Daily Missions**: Personalized daily tasks based on your level and goals
- 🎮 **Gamification**: XP, levels, streaks, and badges to keep you motivated
- ⚡ **Instant Feedback**: Get immediate evaluation and detailed explanations
- 📊 **Progress Tracking**: Track your learning journey with detailed analytics
- 🆓 **Free Forever**: Completely free for all QA learners

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [Supabase Postgres](https://supabase.com/)
- **Auth**: [Supabase Auth](https://supabase.com/auth)
- **ORM**: [Prisma](https://prisma.io/)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Supabase account (free tier works fine)

### 1. Clone and Install

```bash
git clone <repository-url>
cd testquest-ai
npm install
```

### 2. Setup Supabase

1. Create a new project on [Supabase](https://supabase.com/)
2. Get your project URL and anon key from Project Settings > API
3. Get your database connection string from Project Settings > Database

### 3. Environment Variables

Create a `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# App
NEXT_PUBLIC_APP_NAME="TestQuest AI"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database with sample content
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
testquest-ai/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (auth)/        # Auth routes (login, register)
│   │   ├── (main)/        # Main app routes (dashboard, mission, etc.)
│   │   ├── (admin)/       # Admin panel routes
│   │   └── api/           # API routes
│   ├── components/
│   │   ├── ui/            # shadcn/ui components
│   │   ├── layout/        # Layout components
│   │   ├── gamification/  # XP, streak, badge components
│   │   └── tasks/         # Task-related components
│   ├── lib/
│   │   ├── prisma.ts      # Prisma client
│   │   ├── supabase/      # Supabase clients
│   │   ├── utils.ts       # Utility functions
│   │   └── constants.ts   # App constants
│   ├── services/
│   │   ├── mission-generator.ts
│   │   ├── evaluation-engine.ts
│   │   └── gamification-engine.ts
│   └── types/             # TypeScript types
└── tests/
    └── e2e/               # Playwright tests
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type check
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed the database
- `npm run test:e2e` - Run Playwright tests

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com/)
3. Add environment variables in Vercel settings
4. Deploy!

### Environment Variables for Production

Make sure to set these in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`

## Contributing

This project is built for QA learners. Feel free to:

- Report issues
- Suggest new features
- Add more learning content
- Improve documentation

## License

MIT License - Free for all QA learners.

## Support

For questions or support, please open an issue on GitHub.

---

Built with ❤️ for the QA community.
