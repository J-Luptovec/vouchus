# Vouchus — Product Review System

Angular frontend + Node.js/Express backend with PostgreSQL.

## Prerequisites

- Node.js 18+
- PostgreSQL running locally

## Setup

### 1. Install all dependencies

```bash
npm run install:all
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your PostgreSQL connection string and a strong JWT secret:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/vouchus_db"
JWT_SECRET="change-me-to-something-long-and-random"
PORT=3000
```

### 3. Run database migrations

```bash
cd backend
npm run db:migrate   # creates the database schema
npm run db:generate  # generates Prisma client
```

### 4. Seed sample products (optional)

```bash
cd backend
npm run db:seed
```

### 5. Start development servers

From the root:

```bash
npm run dev
```

This starts both:
- **Backend** at http://localhost:3000
- **Frontend** at http://localhost:4200

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | JWT | Current user |
| GET | `/api/products` | — | List products (`?page=1&limit=12`) |
| GET | `/api/products/:id` | — | Product + reviews |
| POST | `/api/products` | JWT | Create product |
| GET | `/api/products/:id/reviews` | — | Paginated reviews |
| POST | `/api/products/:id/reviews` | JWT | Submit review |
| DELETE | `/api/products/:id/reviews/:reviewId` | JWT | Delete own review |

## Project Structure

```
vouchus/
├── backend/           # Express + Prisma + PostgreSQL
│   ├── prisma/        # schema.prisma + seed
│   └── src/
│       ├── middleware/ # auth (JWT), errorHandler
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       └── validators/ # Zod schemas
└── frontend/          # Angular 21 + Angular Material
    └── src/app/
        ├── core/      # services, interceptor, guard
        ├── models/
        ├── pages/     # auth, products, reviews
        └── shared/    # navbar, star-rating
```
