# TransitOps

Modern Transport Operations Management Platform — a lightweight ERP for fleet, driver, trip, maintenance, fuel, and expense management.

## Quick Start

Everything runs in Docker — no local setup, no `.env` to configure.

```bash
docker compose up
```

This starts PostgreSQL, applies migrations, seeds demo data, and launches the app.
When it's ready, visit **http://localhost:3000**.

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
- **Fuel Tracking**: Log consumption, calculate efficiency (km/L), per-vehicle filter
- **Expense Tracking**: Categorized expenses (toll, repair, insurance, parking)
- **Reports & Analytics**: Summary KPIs, fleet utilization, fuel efficiency, vehicle ROI, trip trends, top costliest vehicles
- **CSV Export**: Download any report as CSV
- **Dashboard**: 7 KPI cards, filters (vehicle type / status / region), vehicle-status bars, cost overview, and alerts for expiring licenses and active maintenance
- **Authentication & RBAC**: JWT sessions with **server-side enforced** role-based access — every server action is permission-gated, nav and pages are filtered per role (4 roles)
- **Settings**: Profile, appearance, general preferences, and a live RBAC access matrix
- **Onboarding**: First-time welcome tour
- **Theme**: Light / Dark / System toggle
- **Localization**: Indian conventions throughout — ₹ currency with lakh/crore grouping (`en-IN`), kilometers, and liters
- **Responsive**: Works on desktop and mobile

## Business Rules Enforced

- Vehicle registration numbers must be unique
- Retired/In-Shop vehicles cannot be dispatched
- Expired/Suspended drivers cannot be assigned
- Cargo weight must not exceed vehicle capacity
- Dispatching atomically marks vehicle + driver as "On Trip"
- Completing a trip atomically restores vehicle + driver to "Available"
- Opening maintenance moves vehicle to "In Shop"
- Closing maintenance moves vehicle to "Available" (unless retired)

All rules are enforced in the service layer inside atomic transactions, so an API
call cannot bypass them. Authorization is likewise enforced server-side, not just in the UI.

## Billing & Compliance Layer (in progress)

An India-focused transport billing layer is being added on top of the fleet core:

- **Phase 1 (foundation landed)**: Company & Party masters, Bilty (LR) booking with
  auto-calculated charges (₹15/quintal labour + ₹30 GR + door/PF/tax), sequential
  bilty numbering, party ledger with payments (Cash/UPI/Bank), and `Bilty.total → Trip.revenue` sync.
- **Planned**: Challan, E-Way Bill validity & expiry tracking, Fastag toll balances,
  trip P&L, GST summaries, PDF documents, and email expiry/compliance alerts.

See `prisma/schema.prisma` (billing section) for the data model.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Custom JWT (jose)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Deployment**: Docker + Docker Compose

## Database Schema

Core fleet entities: Vehicle, Driver, Trip, Maintenance, FuelLog, Expense — plus User (authentication).

Billing layer (Phase 1): Company, Party, Bilty, Payment, Invoice, and a Counter for
sequential document numbering.

See `prisma/schema.prisma` for the full schema.

## Seed Data

The seed script generates: 25 vehicles, 40 drivers, 50 trips, 15 maintenance records, 120 fuel logs, 100 expenses, and 4 users (one per role).

## Future Improvements

- Real-time updates via WebSocket
- GPS/telematics integration
- Global search across modules
- Audit logs and activity timeline
- Multi-tenant support
- Fleet map visualization
- AI-powered maintenance prediction
- PWA support

(Billing-layer items — E-Way Bill, Fastag, PDF documents, and email expiry alerts — are tracked in the Billing & Compliance section above.)
