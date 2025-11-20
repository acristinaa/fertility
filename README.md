# Fertility Care Platform

A comprehensive fertility coaching and medical practice management platform built with Next.js, TypeScript, and Supabase.

## Features

- **Multi-Role Support**: Client, Coach, Doctor, and Admin portals
- **Session Management**: Schedule and manage appointments with providers
- **Programs**: Create and track personalized fertility programs
- **Goals Tracking**: Set and monitor fertility journey milestones
- **Action Items**: Task management with due dates and status tracking
- **Client Management**: Provider dashboard for managing client relationships
- **Profile Management**: Customizable user profiles with timezone and locale support

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Database Schema

The application supports the following main tables:

- `profiles` - User information for clients, coaches, doctors, and admins
- `sessions` - Appointment scheduling and management
- `programs` - Fertility programs linking clients with providers
- `goals` - Client goal tracking
- `action_items` - Task management from sessions and programs
- `session_notes` - Private and client-visible notes from sessions
- `client_coach_links` - Client-coach relationships
- `client_doctor_links` - Client-doctor relationships

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd fertility
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up your Supabase database:
   - Run the SQL schema provided in your Supabase SQL editor
   - Ensure Row Level Security (RLS) policies are configured appropriately

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
fertility/
├── app/
│   ├── action-items/    # Action items management
│   ├── clients/         # Client list for providers
│   ├── dashboard/       # Main dashboard
│   ├── goals/           # Goals tracking
│   ├── profile/         # User profile settings
│   ├── programs/        # Programs management
│   ├── sessions/        # Session scheduling and viewing
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── components/
│   └── navigation.tsx   # Sidebar navigation component
├── lib/
│   ├── database.types.ts # TypeScript types for database
│   └── supabase.ts      # Supabase client configuration
└── public/              # Static assets
```

## Key Pages

- `/` - Landing page with feature overview
- `/dashboard` - Role-specific dashboard with stats and upcoming sessions
- `/sessions` - View and manage all sessions
- `/programs` - Manage fertility programs
- `/goals` - Track fertility goals
- `/action-items` - Task management
- `/clients` - Client management (providers only)
- `/profile` - User profile settings

## Authentication

This demo currently uses placeholder user IDs. To implement authentication:

1. Set up Supabase Auth in your project
2. Replace `demo-user-id` and `demo-provider-id` with actual authenticated user IDs
3. Use `supabase.auth.getUser()` to get the current user
4. Implement RLS policies to secure data access

## Database Security

Recommended RLS policies:

```sql
-- Example: Clients can only view their own data
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Example: Providers can view linked clients
CREATE POLICY "Providers can view linked clients"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM client_coach_links
      WHERE client_id = profiles.id
        AND coach_id = auth.uid()
        AND status = 'active'
    )
  );
```

## Customization

### Changing User Role

To test different user roles, update the `userRole` constant in the layout files:

```typescript
// In app/dashboard/layout.tsx, app/sessions/layout.tsx, etc.
const userRole = 'coach' as 'client' | 'coach' | 'doctor' | 'admin'
```

### Adding New Features

1. Create new pages in the `app/` directory
2. Add navigation links in `components/navigation.tsx`
3. Update database types in `lib/database.types.ts` if adding new tables
4. Implement the UI using existing patterns from other pages

## Build for Production

```bash
npm run build
npm start
```

## Deployment

This app can be deployed to:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Any platform supporting Node.js**

Make sure to set environment variables in your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions, please open an issue in the GitHub repository.
