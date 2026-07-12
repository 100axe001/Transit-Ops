# TransitOps Architecture

## Overview

TransitOps follows a **Clean Architecture** pattern with four distinct layers, ensuring business logic is decoupled from frameworks and infrastructure.

## Layers

```
┌─────────────────────────────────────────────┐
│         Presentation Layer                   │
│    (app/, components/, hooks/, store/)        │
├─────────────────────────────────────────────┤
│         Application Layer                    │
│    (actions/, lib/services/)                 │
├─────────────────────────────────────────────┤
│         Domain Layer                         │
│    (lib/domain/, lib/validations/)           │
├─────────────────────────────────────────────┤
│         Infrastructure Layer                 │
│    (lib/prisma.ts, lib/repositories/)        │
└─────────────────────────────────────────────┘
```

### Domain Layer (`lib/domain/`)
Pure business rules with zero external dependencies. Contains:
- **Vehicle rules**: dispatch eligibility, capacity validation, status transitions, ROI calculation
- **Driver rules**: dispatch eligibility, license expiry checks, status transitions
- **Trip rules**: lifecycle validations (dispatch/complete/cancel), fuel efficiency calculations
- **Maintenance rules**: open/close validations, vehicle status impacts

These functions are pure — they take data in and return verdicts. No database calls, no framework imports.

### Application Layer (`lib/services/`, `actions/`)
Use-case orchestration that coordinates between domain and infrastructure:
- **Services** (`lib/services/`): Business operations like `tripService.dispatch()`, `maintenanceService.close()`. They call domain functions for rule validation, then repositories for persistence.
- **Server Actions** (`actions/`): Thin Next.js bridges that call services and handle revalidation. No business logic here.

### Infrastructure Layer (`lib/repositories/`, `lib/prisma.ts`)
Data access abstraction:
- **Repositories**: Prisma-backed data access with filtering, pagination, and aggregation
- **Prisma client**: Singleton with connection pooling

### Presentation Layer (`app/`, `components/`)
- **Server Components**: Data fetching via services, passing data to client components
- **Client Components**: Interactive UI with React Hook Form + Zod validation
- **Shared schemas**: `lib/validations/` contains Zod schemas used by both client forms and server actions

## Data Flow

```
User Action → Client Component → Server Action → Service → Domain (validate) → Repository → Database
```

## Key Design Decisions

1. **Shared Zod Schemas**: One schema defined in `lib/validations/`, enforced on both client (form) and server (action).
2. **Transactional State Transitions**: Trip dispatch/complete/cancel uses Prisma transactions to atomically update vehicle + driver + trip status.
3. **Domain as Single Source of Truth**: Rules like "retired vehicles can't dispatch" live in exactly one place (`lib/domain/vehicle.ts`).
4. **No Direct Prisma in Components**: All data access goes through repositories, called by services.

## Authentication

- JWT-based sessions stored in httpOnly cookies
- Middleware validates tokens on every request
- RBAC via `lib/permissions/` mapping roles to capabilities

## Module Structure

Each feature module follows the same pattern:
- `app/(app)/<module>/page.tsx` — Server Component fetching data
- `components/<module>/<module>-client.tsx` — Client wrapper with state
- `components/<module>/<module>-table.tsx` — Data table
- `components/<module>/<module>-dialog.tsx` — Create/Edit form dialog
