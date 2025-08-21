# Database Setup Guide

This guide will walk you through setting up the complete database infrastructure for the subscription cancellation flow.

## Prerequisites

- **Node.js 18+** and npm
- **Docker** (for Supabase local development)
- **Git** (for cloning the repository)

## Quick Setup

### 1. Clone and Install
```bash
git clone [repository-url]
cd cancel-flow-task-main
npm install
```

### 2. Environment Configuration
```bash
# Copy the example environment file
cp env.example .env.local

# The .env.local file should contain:
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5N0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
```

### 3. Database Setup
```bash
# Complete database setup (start services + apply migrations + seed data)
npm run db:setup
```

### 4. Start Development
```bash
npm run dev
```

## Available Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:start` | Start Supabase services |
| `npm run db:stop` | Stop Supabase services |
| `npm run db:reset` | Reset database and apply migrations + seed data |
| `npm run db:setup` | Complete setup (start + reset) |
| `npm run db:status` | Check Supabase status |
| `npm run db:logs` | View Supabase logs |
| `npm run db:migrate` | Apply migrations only |
| `npm run db:studio` | Open Supabase Studio (web interface) |
| `npm run db:test` | Setup database and start dev server |

## Database Architecture

### Tables Created

1. **`users`** - User accounts and profiles
2. **`subscriptions`** - Subscription details with status tracking
3. **`cancellations`** - Cancellation records with A/B testing variants
4. **`feedback`** - User feedback and cancellation reasons

### Views Created

1. **`cancellation_analytics`** - Comprehensive cancellation data analysis
2. **`ab_test_results`** - A/B testing performance metrics

### Security Features

- **Row-Level Security (RLS)** enabled on all tables
- **User isolation**: Users can only access their own data
- **Input validation**: Database constraints and trigger-based validation
- **Audit trails**: Automatic timestamp tracking for all operations

## Development Workflow

### 1. Making Database Changes
```bash
# Edit migration files in supabase/migrations/
# Edit seed data in supabase/seed.sql
```

### 2. Applying Changes
```bash
# Apply migrations and reset data
npm run db:reset

# Or just apply migrations
npm run db:migrate
```

### 3. Viewing Data
```bash
# Access Supabase Studio (web interface)
# After running npm run db:start, open in your browser:
# http://127.0.0.1:54323

# Or use the npm script (shows the URL):
npm run db:studio
```

## Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check if ports are in use
lsof -i :54321
lsof -i :54322
lsof -i :54323

# Kill processes if needed
kill -9 [PID]
```

#### Docker Issues
```bash
# Restart Docker
docker system prune -a
npm run db:start
```

#### Database Connection Issues
```bash
# Check Supabase status
npm run db:status

# View logs
npm run db:logs

# Reset everything
npm run db:stop
npm run db:setup
```

### Reset Everything
```bash
# Complete reset
npm run db:stop
docker system prune -a
npm run db:setup
```

## Database Schema Details

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  monthly_price INTEGER NOT NULL, -- Price in USD cents
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending_cancellation', 'cancelled')),
  is_trial BOOLEAN DEFAULT FALSE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Cancellations Table
```sql
CREATE TABLE cancellations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  downsell_variant TEXT NOT NULL CHECK (downsell_variant IN ('A', 'B')),
  reason TEXT,
  accepted_downsell BOOLEAN DEFAULT FALSE,
  feedback TEXT,
  price_input TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Feedback Table
```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  cancellation_id UUID REFERENCES cancellations(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL,
  feedback_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## A/B Testing Implementation

The A/B testing system provides:
- **Deterministic assignment**: Same user always gets same variant
- **Secure randomization**: Based on user and subscription IDs
- **Persistence**: Variants stored in database for consistency
- **Analytics**: Built-in views for tracking performance
- **Variant A**: No downsell (control group)
- **Variant B**: $10 discount offer (treatment group)

## Testing the Setup

### 1. Verify Database Connection
```bash
# Check if tables exist
npm run db:studio
# Navigate to Table Editor and verify all tables are present
```

### 2. Test A/B Testing
```bash
# Start the application
npm run dev

# Navigate to the cancellation flow
# Check browser console for A/B test variant assignment
```

### 3. Verify Data Persistence
```bash
# Complete a cancellation flow
# Check Supabase Studio to verify data is being stored
# Access at: http://127.0.0.1:54323
```

## Next Steps

After successful setup:
1. **Review the database schema** in Supabase Studio
2. **Test the A/B testing flow** in the application
3. **Verify data persistence** for cancellations
4. **Check security policies** are working correctly
5. **Begin implementing the Figma design** with confidence in the backend

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Supabase logs: `npm run db:logs`
3. Check Supabase status: `npm run db:status`
4. Reset the database: `npm run db:reset`

The database is now fully configured and ready for development!
