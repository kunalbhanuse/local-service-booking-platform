# KB · Local Service Booking Platform

A marketplace for booking vetted local tradespeople — plumbers, electricians, cleaners, carpenters and painters.

- **Customers** browse approved providers, book a time slot, and track the booking to completion.
- **Providers** apply, get approved by an admin, list services, and confirm/complete bookings.
- **Admins** review provider applications and see platform-wide stats and bookings.

## Stack

| Layer    | Tech                                                                   |
| -------- | ---------------------------------------------------------------------- |
| Backend  | Node 20+, Express 5, Prisma 6, PostgreSQL 16, Zod, JWT, Helmet, rate limiting |
| Frontend | React 19, Vite, TypeScript, Tailwind 4, shadcn/Radix, react-hook-form  |

## Getting started

### 1. Database

```bash
cd backend
docker compose up -d          # Postgres on localhost:5432
```

### 2. Backend

```bash
cd backend
cp .env.example .env          # then fill in secrets (see below)
npm install
npm run db:migrate            # applies prisma/migrations
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=change-me-now npm run db:seed
npm run dev                   # http://localhost:8000
```

Add `SEED_DEMO=true` to the seed command to also create a demo approved provider with services and a demo customer (both `password123`). Dev only.

### 3. Frontend

```bash
cd frontend
cp .env.example .env          # VITE_API_URL, defaults to http://localhost:8000/api
npm install
npm run dev                   # http://localhost:5173
```

## Environment

`backend/.env` — see `backend/.env.example`:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET` | Long random strings; rotate if ever exposed |
| `ACCESS_TOKEN_EXPIRES`, `REFRESH_TOKEN_EXPIRES` | e.g. `15m`, `7d` |
| `SMTP_USER`, `SMTP_PASS` | Password-reset email sender |
| `TRUST_PROXY` | Set to `1` behind a reverse proxy so rate limiting sees real IPs |
| `PORT` | Defaults to 8000 |

## Scripts

**backend**: `dev`, `start`, `db:migrate` (deploy migrations), `db:seed`, `studio` (Prisma Studio)
**frontend**: `dev`, `build` (typecheck + bundle), `lint`, `preview`

## API overview

All routes are under `/api`. Auth is a Bearer access token; the refresh token lives in an httpOnly cookie and is rotated via `POST /auth/rotateToken`.

| Area | Endpoints |
| --- | --- |
| Auth | `POST /auth/signup` · `POST /auth/login` · `POST /auth/logout` · `GET /auth/profile` · `POST /auth/forgetPassword` · `POST /auth/resetPassword` |
| Public catalogue | `GET /service/public?q&category&city&page` · `GET /service/public/meta` · `GET /service/public/:id` |
| Provider | `POST /provider/apply` · `GET /provider/me` · `PATCH /provider/availability` · `GET /service/mine` · `POST /service/register` · `PATCH /service/update/:id` · `DELETE /service/delete/:id` |
| Bookings | `POST /booking/create` · `GET /booking/my` · `GET /booking/provider` · `GET /booking/:id` · `PATCH /booking/:id/status` |
| Admin | `GET /admin/stats` · `GET /admin/providers?status` · `GET /admin/provider/:id` · `POST /admin/provider/:id/update` · `GET /booking/all` |

Booking status transitions: customers can **cancel** pending/confirmed bookings; providers can **confirm** or **decline** requests and **complete** or **cancel** confirmed jobs. Slots are 1 hour; a provider cannot be double-booked within that window.

## Production checklist

- Never commit `backend/.env`; generate fresh JWT secrets and rotate any SMTP credential that was ever committed.
- Set `CORS` origin in `backend/src/app.js` to the deployed frontend URL and set `secure: true` on the refresh-token cookie once served over HTTPS.
- Run `npm run db:migrate` on deploy; `npm run build` for the frontend and serve `frontend/dist` from any static host.
- `GET /health` is available for load-balancer checks.
