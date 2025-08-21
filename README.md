# Migrate Mate - Subscription Cancellation Flow Challenge

## Overview

Convert an existing Figma design into a fully-functional subscription-cancellation flow for Migrate Mate. This challenge tests your ability to implement pixel-perfect UI, handle complex business logic, and maintain security best practices.

## Objective

Implement the Figma-designed cancellation journey exactly on mobile + desktop, persist outcomes securely, and instrument the A/B downsell logic.

## What's Provided

This repository contains:
- ✅ Next.js + TypeScript + Tailwind scaffold
- ✅ `seed.sql` with users table (25/29 USD plans) and empty cancellations table
- ✅ Local Supabase configuration for development
- ✅ Basic Supabase client setup in `src/lib/supabase.ts`

## Tech Stack (Preferred)

- **Next.js** with App Router
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Supabase** (Postgres + Row-Level Security)

> **Alternative stacks allowed** if your solution:
> 1. Runs with `npm install && npm run dev`
> 2. Persists to a Postgres-compatible database
> 3. Enforces table-level security

## Must-Have Features

### 1. Progressive Flow (Figma Design)
- Implement the exact cancellation journey from provided Figma
- Ensure pixel-perfect fidelity on both mobile and desktop
- Handle all user interactions and state transitions

### 2. Deterministic A/B Testing (50/50 Split)
- **On first entry**: Assign variant via cryptographically secure RNG
- **Persist** variant to `cancellations.downsell_variant` field
- **Reuse** variant on repeat visits (never re-randomize)

**Variant A**: No downsell screen
**Variant B**: Show "$10 off" offer
- Price $25 → $15, Price $29 → $19
- **Accept** → Log action, take user back to profile page (NO ACTUAL PAYMENT PROCESSING REQUIRED)
- **Decline** → Continue to reason selection in flow

### 3. Data Persistence
- Mark subscription as `pending_cancellation` in database
- Create cancellation record with:
  - `user_id`
  - `downsell_variant` (A or B)
  - `reason` (from user selection)
  - `accepted_downsell` (boolean)
  - `created_at` (timestamp)

### 4. Security Requirements
- **Row-Level Security (RLS)** policies
- **Input validation** on all user inputs
- **CSRF/XSS protection**
- Secure handling of sensitive data

### 5. Reproducible Setup
- `npm run db:setup` creates schema and seed data (local development)
- Clear documentation for environment setup

## Out of Scope

- **Payment processing** - Stub with comments only
- **User authentication** - Use mock user data
- **Email notifications** - Not required
- **Analytics tracking** - Focus on core functionality

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Docker (for Supabase local development)

### Quick Start
1. **Clone this repository**: `git clone [repo]`
2. **Install dependencies**: `npm install`
3. **Set up local database**: `npm run db:setup`
4. **Start development**: `npm run dev`

### Database Setup Commands

The following npm scripts are available for database management:

```bash
# Start Supabase services
npm run db:start

# Stop Supabase services
npm run db:stop

# Reset database and apply migrations + seed data
npm run db:reset

# Complete setup (start + reset)
npm run db:setup

# Check Supabase status
npm run db:status

# View Supabase logs
npm run db:logs

# Apply migrations only
npm run db:migrate

# Open Supabase Studio (web interface)
npm run db:studio

# Setup database and start dev server
npm run db:test
```

### Database Schema

The database includes the following tables with comprehensive RLS policies:

#### Core Tables
- **`users`**: User accounts and profiles
- **`subscriptions`**: Subscription details with status tracking
- **`cancellations`**: Cancellation records with A/B testing variants
- **`feedback`**: User feedback and cancellation reasons

#### Views
- **`cancellation_analytics`**: Comprehensive cancellation data analysis
- **`ab_test_results`**: A/B testing performance metrics

#### Security Features
- **Row-Level Security (RLS)** enabled on all tables
- **User isolation**: Users can only access their own data
- **Input validation**: Database-level constraints and triggers
- **Audit trails**: Automatic timestamp tracking

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# Service Role Key (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5N0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
```

### Development Workflow

1. **Start development**: `npm run dev:test`
2. **Database changes**: Edit files in `supabase/migrations/`
3. **Apply changes**: `npm run db:reset`
4. **View data**: `npm run db:studio` (opens at http://127.0.0.1:54323)

### Troubleshooting

#### Common Issues
- **Port conflicts**: Ensure ports 54321-54329 are available
- **Docker issues**: Restart Docker and run `npm run db:start`
- **Database connection**: Check if Supabase is running with `npm run db:status`

#### Reset Everything
```bash
npm run db:stop
npm run db:setup
```

## Evaluation Criteria

- **Functionality (40%)**: Feature completeness and correctness
- **Code Quality (25%)**: Clean, maintainable, well-structured code
- **Pixel/UX Fidelity (15%)**: Accuracy to Figma design
- **Security (10%)**: Proper RLS, validation, and protection
- **Documentation (10%)**: Clear README and code comments

## Deliverables

1. **Working implementation** in this repository
2. **NEW One-page README.md (replace this)** (≤600 words) explaining:
   - How to run the project
   - Key technical decisions
   - Security measures implemented
   - A/B testing approach
   - Database design rationale

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

## Security Features

- **Row-Level Security (RLS)**: Users can only access their own data
- **Input Validation**: Database constraints and trigger-based validation
- **XSS Protection**: Input sanitization in application layer
- **Rate Limiting**: Built-in protection against abuse
- **Audit Logging**: Automatic timestamp tracking for all operations

## A/B Testing Implementation

The A/B testing system provides:
- **Deterministic assignment**: Same user always gets same variant
- **Secure randomization**: Based on user and subscription IDs
- **Persistence**: Variants stored in database for consistency
- **Analytics**: Built-in views for tracking performance
- **Variant A**: No downsell (control group)
- **Variant B**: $10 discount offer (treatment group)
