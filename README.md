# Mini Support Desk

A full-stack web application for creating, viewing, and managing support tickets. Built with **React (TypeScript)**, **Express**, **PostgreSQL**, and **Prisma**.

---

## Repository & Live Application

- **Git repository:** [GitHub](https://github.com/nishant3005/mini-support-desk)
- **Live application:** [Mini Support Desk](https://mini-support-desk-eight.vercel.app/)

---

## Codebase Structure

The project is structured into **`/frontend`** and **`/backend`** directories:

```
Mini Support Desk/
├── frontend/          # React 18 + TypeScript + Vite + Tailwind + React Query
├── backend/           # Node.js + Express + Joi + PostgreSQL + Prisma
├── README.md          # This file
├── ARCHITECTURE.md    # Design decisions and project structure

```

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **PostgreSQL** 14+ (local install or use Supabase for cloud)
- **npm** (or yarn / pnpm)

---

## Local Execution Instructions

Follow these steps to run the application locally.

### 1. Clone the repository

```bash
git clone https://github.com/nishant3005/mini-support-desk.git
cd "Mini Support Desk"
```

### 2. Set up the database

Create a PostgreSQL database (e.g. `minisupportdesk`). If using **Supabase**, create a project and get connection string from **Project Settings → Database**.

### 3. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/minisupportdesk"
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

For Supabase, use your pooler URL for `DATABASE_URL`.

Run migrations and seed:

```bash
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
```

Start the backend:

```bash
npm run dev
```

The API runs at **http://localhost:3000**.

### 4. Frontend setup

Open a **new terminal** from the project root:

```bash
cd frontend
npm install
npm run dev
```

The app runs at **http://localhost:5173**. The Vite dev server proxies `/api` to the backend, so no extra env is needed for local dev.

### 5. Optional: run both from the root

From the repo root, after installing dependencies in both `backend` and `frontend`:

```bash
npm run dev
```

(This requires a root `package.json` with a script that runs both backend and frontend; see `package.json` in the root.)

---

## Seed Data

Sample tickets and comments are created via the **Prisma seed script**:

```bash
cd backend
npx prisma db seed
```

This creates 3 sample tickets and 5 comments. Run it once after migrations.

---

## Assumptions

- **No authentication** — Anyone can create tickets and add comments. The `authorName` field on comments is plain text (no login).
- **PostgreSQL** — The app uses PostgreSQL (e.g. local or Supabase). Connection strings are set via `DATABASE_URL` in the backend.
- **CORS** — The backend allows the frontend origin set in `CORS_ORIGIN` (e.g. `http://localhost:5173` for local, or your Vercel URL for production).
- **Run locally** — Backend default port is 3000, frontend dev server is 5173. Frontend proxies `/api` to the backend in development.

---

## API Overview

Base URL (local): `http://localhost:3000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tickets` | List tickets (query: `q`, `status`, `priority`, `sort`, `page`, `limit`) |
| POST | `/tickets` | Create ticket (body: `title`, `description`, `priority`) |
| GET | `/tickets/:id` | Get one ticket |
| PATCH | `/tickets/:id` | Update ticket (body: optional `title`, `description`, `status`, `priority`) |
| DELETE | `/tickets/:id` | Delete ticket (cascade deletes comments) |
| GET | `/tickets/:id/comments` | List comments (query: `page`, `limit`) |
| POST | `/tickets/:id/comments` | Add comment (body: `authorName`, `message`) |
| GET | `/health` | Health check |

Validation is done with **Joi**; see backend `validators/` and **ARCHITECTURE.md** for details.

---
