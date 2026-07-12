# TransitOps

Modern Transport Operations Management Platform — a lightweight ERP for fleet, driver, trip, maintenance, fuel, and expense management.

## Quick Start

### Docker (recommended)

```bash
docker compose up
```

This starts PostgreSQL + the app. Visit http://localhost:3000.

### Local Development

```bash
# Start PostgreSQL (via Docker or locally)
docker compose up db -d

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed demo data
npm run db:seed

# Start dev server
npm run dev
```

Visit http://localhost:3000

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Fleet Manager | fleet@transitops.com | password123 |
| Dispatcher | dispatch@transitops.com | password123 |
| Safety Officer | safety@transitops.com | password123 |
| Financial Analyst | finance@transitops.com | password123 |

## Architecture

TransitOps follows Clean Architecture with four layers:

- **Domain** (`lib/domain/`): Pure business rules, zero dependencies
- **Application** (`lib/services/`, `actions/`): Use-case orchestration
- **Infrastructure** (`lib/repositories/`, `lib/prisma.ts`): Data access
- **Presentation** (`app/`, `components/`): UI layer

See [ARCHITECTURE.md](./ARCHITECTURE.md) for details.

## Features

- **Fleet Management**: Full CRUD for vehicles with type, capacity, status tracking
- **Driver Management**: License monitoring, safety scores, availability tracking
- **Trip Dispatch**: Create, Dispatch, Complete/Cancel with automatic status transitions
- **Maintenance**: Open/close records that automatically move vehicles in/out of shop
- **Fuel Tracking**: Log consumption, calculate efficiency (km/L)
- **Expense Tracking**: Categorized expenses (toll, repair, insurance, parking)
- **Reports & Analytics**: Fleet utilization, fuel efficiency, vehicle ROI, trip trends
- **CSV Export**: Download any report as CSV
- **Dashboard**: KPI cards, charts, alerts for expiring licenses and active maintenance
- **Authentication**: JWT sessions, role-based access control (4 roles)
- **Dark Mode**: System-aware theme switching
- **Responsive**: Works on desktop and mobile

## Business Rules Enforced

- Retired/In-Shop vehicles cannot be dispatched
- Expired/Suspended drivers cannot be assigned
- Cargo weight must not exceed vehicle capacity
- Dispatching atomically marks vehicle + driver as "On Trip"
- Completing a trip atomically restores vehicle + driver to "Available"
- Opening maintenance moves vehicle to "In Shop"
- Closing maintenance moves vehicle to "Available" (unless retired)

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Custom JWT (jose)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Deployment**: Docker + Docker Compose

## Database Schema

6 core entities: Vehicle, Driver, Trip, Maintenance, FuelLog, Expense
Plus: User (authentication)

See `prisma/schema.prisma` for the full schema.

## Seed Data

The seed script generates: 25 vehicles, 40 drivers, 50 trips, 15 maintenance records, 120 fuel logs, 100 expenses, and 4 users (one per role).

## Future Improvements

- Real-time updates via WebSocket
- GPS/telematics integration
- Document uploads (insurance, registration)
- Email notifications for license expiry
- Advanced filtering and global search
- Audit logs and activity timeline
- Multi-tenant support
- Fleet map visualization
- AI-powered maintenance prediction
- PWA support
