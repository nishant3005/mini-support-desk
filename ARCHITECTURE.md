# Mini Support Desk — Architecture & System Design

This document covers the design decisions, project structure, scalability, reliability, and tradeoffs for the Mini Support Desk application, as required by the assignment.

---

## 1. High-Level Architecture

### How the frontend talks to the backend

- The **frontend** is a single-page application (SPA) built with **React 18**, **TypeScript**, and **Vite**. It runs in the browser and communicates with the backend over **HTTP (REST)**.
- The frontend uses **Axios** to send requests to the backend API. In local development, the Vite dev server proxies `/api` to the backend (e.g. `http://localhost:3000`), so the app uses relative URLs. In production, the frontend is configured with **VITE_API_URL** pointing to the deployed backend base URL including `/api`.
- **CORS** is enabled on the backend so the browser allows requests from the deployed frontend origin (e.g. Vercel). The allowed origin is set via **CORS_ORIGIN** in the backend environment.

### Backend layers and modules

The backend is organized in a simple layered structure:

- **Routes** (`src/routes/`) — Express routers that define HTTP endpoints. They parse params, query, and body, call services, and return JSON. Validation is applied via middleware (Joi) before the route handler runs.
- **Services** (`src/services/`) — Business logic and orchestration. They use the **Prisma** client to read and write data. No HTTP or validation details here; they throw or return and let the route/error handler deal with status codes.
- **Prisma** — Data access layer. The Prisma client is instantiated once (`src/lib/prisma.ts`) and used by services. Schema and migrations live in `prisma/`. There is no separate “repository” layer; Prisma fills that role.
- **Validators** (`src/validators/`) — Joi schemas for request body, query, and params. Used by the `validate` middleware so invalid requests are rejected with 400 and a list of messages.
- **Middleware** (`src/middleware/`) — Request logging, CORS, JSON body parsing, and a central error handler that maps Joi errors, Prisma errors (e.g. P2025 not found), and unknown errors to consistent JSON responses and status codes.

Flow for a typical request: **HTTP → Route → Validate (Joi) → Service → Prisma → DB → Response**.

---

## 2. Data Model Decisions

- **Ticket** — Central entity with `id` (UUID), `title`, `description`, `status` (OPEN | IN_PROGRESS | RESOLVED), `priority` (LOW | MEDIUM | HIGH), and timestamps. This matches the assignment and supports filtering, sorting, and pagination on the list endpoint.
- **Comment** — Belongs to a ticket (`ticketId`), has `authorName`, `message`, and `createdAt`. No `updatedAt` (comments are immutable). Length limits (e.g. message 1–500 chars) are enforced in Joi and reflected in the Prisma schema.
- **Relations** — One ticket has many comments. Delete of a ticket cascades to comments (Prisma `onDelete: Cascade`) so there are no orphaned rows.
- **Enums** — Status and priority are PostgreSQL enums via Prisma for type safety and clear allowed values in the API.

---

## 3. Scalability Considerations

- **List endpoint** — `GET /tickets` supports `q` (search on title/description), `status`, `priority`, `sort` (e.g. `createdAt:desc`), `page`, and `limit`. Search uses `contains` with case-insensitive mode (ILIKE-style). For very large datasets, a dedicated search index (e.g. PostgreSQL full-text search) or read replicas could be added.
- **Pagination** — Both tickets and comments are paginated (page/limit). The frontend uses the same params so the list does not load the full set at once.
- **Search choice** — Search is **server-side** (via `q` on the list endpoint). This keeps the backend as the single source of truth and scales better than loading all tickets and filtering in the browser.
- **Database** — PostgreSQL and Prisma scale with connection pooling (e.g. PgBouncer) and proper indexing. The schema has an index on `comments.ticketId` for comment-by-ticket queries.

---

## 4. Reliability

- **Validation** — All API inputs are validated with **Joi** (lengths, enums, required fields). Invalid requests get 400 with an `error` message and optional `details` array.
- **Not found** — Missing ticket (or ticket for comments) returns 404 with a consistent JSON body. Prisma’s P2025 is mapped to 404 in the error handler.
- **Server errors** — Unhandled errors result in 500 and a generic message; details can be logged server-side without exposing internals.
- **Frontend** — React Query surfaces loading and error states; the UI shows messages and retry where appropriate (e.g. list and detail pages). Form validation mirrors backend rules where needed.

---

## 5. State Management Choice (Frontend)

- **React Query (TanStack Query)** is used for all **server state** (ticket list, single ticket, comments). Rationale: the app is mostly “fetch from API, show, refetch after mutations.” React Query provides caching, loading/error states, refetch on focus, and cache invalidation after mutations (e.g. invalidate ticket list after creating a ticket, invalidate comments after adding a comment). Alternatives considered: **Context** would require manual caching and invalidation; **Redux** would add boilerplate without solving server-state concerns. For this scope, React Query keeps the code smaller and aligns with the assignment’s “choose and explain” requirement.
- **UI state** (form inputs, modals, filter/sort/page) is kept in local component state (useState). No global client store.

---

## 6. Tradeoffs (What We Intentionally Skipped and Why)

- **Authentication** — No login/signup. Keeps the scope small and the assignment focused on CRUD and structure. Can be added later (e.g. JWT + middleware).
- **Soft delete** — Tickets use hard DELETE with cascade on comments. Soft delete could be added with a `deletedAt` column and filtering in queries.
- **Real-time updates** — No WebSockets. Refetch after mutations (and React Query’s invalidation) is sufficient for this app; real-time could be added later.
- **API documentation** — README lists endpoints and main query/body params.

---

## 7. Summary

The application uses a clear separation: frontend (React + TypeScript + Tailwind + React Query) and backend (Express + Joi + Prisma + PostgreSQL), with a thin service layer and Prisma as the data layer. The data model, validation, and error handling are designed to be predictable and easy to extend (e.g. auth, soft delete) without large refactors.
