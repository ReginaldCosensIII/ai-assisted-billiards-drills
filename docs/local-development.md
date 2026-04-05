# Local Development Guide

This document outlines the steps required to set up and run the `ai-assisted-billiards-drills` project locally.

## Prerequisite Software
- **Node.js**: v18+ (LTS)
- **pnpm**: v8+
- **Docker Desktop**: Required for the PostgreSQL database.
- **Git**: For version control.

## Initial Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/ReginaldCosensIII/ai-assisted-billiards-drills.git
    cd ai-assisted-billiards-drills
    ```
2.  **Install Dependencies**:
    ```bash
    pnpm install
    ```
3.  **Environment Variables**:
    Ensure the `backend/.env` file is present (see `backend/.env.example` if available) and contains the correct `DATABASE_URL` targeting port **5433**.

## Database Development

We use **Prisma** as our ORM and **PostgreSQL** running in Docker.

### 1. Boot the Database
From the root of the project:
```bash
cd backend
docker compose up -d
```
> [!NOTE]
> The database is mapped to **port 5433** on your host to avoid conflicts with native Windows PostgreSQL installations.

### 2. Synchronize Prisma Schema
After the container is healthy:
```bash
cd backend
npx prisma db push
```

### 3. Seed Mock Data
To populate the database with initial drills:
```bash
cd backend
npx prisma db seed
```

## Running the Application

### Start the Backend
```bash
pnpm --filter backend dev
```

### Start the Control UI (Frontend)
```bash
pnpm --filter app dev
```

## Troubleshooting

### P1000: Authentication Failed
If you receive a `P1000` error during `prisma db push`, it usually means the Docker volumes or credentials have drifted. Follow these steps for a clean wipe:

1.  Stop the containers and remove volumes:
    ```bash
    cd backend
    docker compose down -v
    ```
2.  Ensure your `backend/.env` `DATABASE_URL` password matches the `POSTGRES_PASSWORD` in `docker-compose.yml`.
3.  Restart the database:
    ```bash
    docker compose up -d
    ```

### Port 5432 Conflicts
If you cannot connect to the database, double-check that you are using port **5433** in your connection string. If you have a native Postgres service running on 5432, it will interfere with the default Docker mapping.
