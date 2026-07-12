# TransitOps

Modern Transport Operations Management Platform — a lightweight ERP for fleet, driver, trip, maintenance, fuel, and expense management.

## Quick Start

Everything runs in Docker — no local setup, no `.env` to configure.

```bash
docker compose up
```

This starts PostgreSQL, applies migrations, seeds demo data, and launches the app.
When it's ready, visit **http://localhost:3000**.

**Clean slate / something looks off?** Run `./fresh-start.sh` — it wipes old
containers and the database volume, rebuilds the image from scratch (no cache),
and boots a fully migrated + seeded app. Use this on a new machine, or any time
`docker compose up` seems to be running stale code or a half-set-up database.

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

## Billing & Compliance Layer

An India-first billing layer sitting on top of the fleet core — bilty (LR), challans,
e-way bills, party ledgers, the stuff a small transport office actually runs on. It's a
lot, so it ships in phases.

**✅ Phase 1 — done, usable now.** Add your parties (consignors/consignees), book a bilty
and watch the charges auto-calculate as you type (₹15/qtl labour + ₹30 GR + any
door/PF/tax — no editing the total by hand), get an auto bilty number (`BLT-YYMMDD-XXXX`,
sequential per day), record Cash/UPI/Bank payments against a party, and see it all on the
dashboard (biltys today, freight today, total outstanding). Link a bilty to a trip and its
total flows into the trip's revenue.

**🔜 Phase 2 — Challan + printing.** Turn a bilty into a driver challan, and make everything
printable: 2 copies for a bilty, 1 for a challan, with the company header + "Owner's Risk" +
E&OE disclaimer stamped on. Company master gets its own screen here too.

**🔜 Phase 3 — E-Way Bill.** Validity (1 day per 100 km), 🟢/🟡/🔴 status by how close it is
to expiring, and email nudges at 6h / 2h / expiry so nobody eats the ₹10,000 fine.

**🔜 Phase 4 — Fastag + Trip P&L.** Log tolls per truck, ping the owner when a Fastag drops
under ₹500, and compute real per-trip profit = freight − (fuel + toll + salary + other).

**🔜 Phase 5 — Reports + PDF.** Daily/monthly bilty reports, party outstanding, GST summary —
all exportable as PDF.

**Still on the to-do (being honest):** the alert plumbing is built around email but isn't
wired to a real SMTP provider yet, so alerts are stored, not actually sent — swapping in a
real mailer is basically a one-file change. The timed checks (EWB/Fastag/expiry) want a cron
job to run on a schedule; for now those statuses are worked out when you open the page. And
the PDF/print layouts aren't built yet (jsPDF is installed, just unused). Challan, E-Way
Bill, and Fastag screens are still to come.

See `prisma/schema.prisma` for the data model.

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
