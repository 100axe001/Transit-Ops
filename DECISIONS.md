# Design Decisions

## Auth: Custom JWT over NextAuth/BetterAuth
**Decision**: Rolled custom JWT auth using `jose` library.
**Rationale**: For an MVP, a lightweight custom implementation with httpOnly cookies gives full control without the configuration overhead of NextAuth's adapter system. The auth layer is simple (email+password, JWT session, role middleware) so a framework adds complexity without proportional benefit.

## Backend: Next.js Server Actions over separate Express service
**Decision**: All backend logic lives in Next.js via Server Actions + Route Handlers.
**Rationale**: The app is a monolith — no microservices needed. Server Actions provide type-safe RPC without API boilerplate. This reduces deployment complexity (one service, one Dockerfile).

## State transitions: Prisma $transaction
**Decision**: Trip dispatch/complete/cancel and maintenance open/close use `prisma.$transaction()` to atomically update multiple entities.
**Rationale**: Prevents inconsistent states (e.g., driver marked "On Trip" but trip still "Draft") if a mid-operation failure occurs.

## Domain layer: Functions over Classes
**Decision**: Domain rules are pure functions, not OOP entities with methods.
**Rationale**: Simpler to test, compose, and tree-shake. No `this` context issues. Works naturally with Next.js server/client boundaries.

## Validation: Shared Zod schemas
**Decision**: Single schema definition in `lib/validations/` used by both React Hook Form (client) and Server Actions (server).
**Rationale**: Eliminates the "form validates but server rejects" bug class. One change to a validation rule propagates to both sides automatically.

## Pagination: Server-side with URL params
**Decision**: Pagination state lives in URL search params, data fetched server-side.
**Rationale**: Shareable URLs, browser back/forward works, SEO-friendly, no client-side data caching complexity for an MVP.

## Dark mode: next-themes with class strategy
**Decision**: Using `next-themes` with Tailwind's `class` variant.
**Rationale**: Zero-flash dark mode that works with shadcn/ui's CSS variable theming out of the box.

## Charts: Recharts over Chart.js
**Decision**: Recharts for all data visualization.
**Rationale**: React-native composable API, works with SSR, good TypeScript support, minimal bundle size for the chart types we need (bar, line, pie).

## CSV Export: PapaParse client-side
**Decision**: CSV generation happens client-side using PapaParse.
**Rationale**: No server round-trip needed — data is already on the page. PapaParse handles edge cases (commas in values, Unicode) correctly.

## Assumptions Made

1. **Single-tenant**: No multi-org support. One organization per deployment.
2. **No real-time updates**: Dashboard refreshes on navigation, not via WebSocket.
3. **Simple RBAC**: Role-based, not attribute-based. All Fleet Managers see all vehicles.
4. **Odometer is self-reported**: No GPS/telematics integration — users enter values manually.
5. **Currency is USD**: No multi-currency support.
6. **Timezone handling**: Server timezone for all date operations (acceptable for single-region MVP).
