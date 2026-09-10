# MediCare Full-Stack Deployment Guide for Render (render.com)

This repository is configured to be 100% production-ready for deployment on [Render](https://render.com). It deploys three components:
1. **Managed PostgreSQL Database** (`medicare-db`)
2. **Spring Boot 3.3.3 Backend API** (`medicare-backend`) running in an Alpine Docker container
3. **React 18 / Vite 5 Frontend** (`medicare-frontend`) running as a high-speed Static Site

---

## Method 1: Instant 1-Click Blueprint Deployment (Recommended)

Render provides Infrastructure as Code via `render.yaml`. This is the fastest and most foolproof method.

### Steps:
1. **Push your code to GitHub or GitLab**:
   ```bash
   git add .
   git commit -m "feat: configure cloud deployment for Render"
   git push origin main
   ```
2. Go to your [Render Dashboard](https://dashboard.render.com/).
3. Click the **"New +"** button at the top right and select **"Blueprint"**.
4. Connect your GitHub/GitLab repository.
5. Render will automatically detect `render.yaml` and configure:
   - PostgreSQL Database (`medicare-db`)
   - Docker Web Service (`medicare-backend`)
   - Static Site (`medicare-frontend`)
6. Click **"Apply"**.
7. Render will provision the database, build the container, build the frontend, and link the services together automatically!

---

## Method 2: Manual Step-by-Step Deployment

If you prefer to configure each service manually via the Render web UI:

### Step 1: Create the PostgreSQL Database
1. In Render Dashboard, click **New +** -> **PostgreSQL**.
2. Fill in the details:
   - **Name**: `medicare-db`
   - **Database**: `medicare_db`
   - **User**: `medicare_user`
   - **Region**: Select your preferred region (e.g. `Oregon (US West)` or `Frankfurt (EU Central)`).
   - **Plan**: `Free`.
3. Click **Create Database**.
4. Once created, copy the **Internal Database URL** (e.g., `postgres://medicare_user:password@dpg-xxxx-a:5432/medicare_db`).

---

### Step 2: Deploy the Spring Boot Backend Web Service
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Connect your repository.
3. Configure the settings:
   - **Name**: `medicare-backend`
   - **Region**: Same region as your database.
   - **Language / Runtime**: **Docker**
   - **Dockerfile Path**: `./backend/Dockerfile` (or `./Dockerfile`)
   - **Docker Context**: `./backend` (or `.` if using root Dockerfile)
   - **Instance Type / Plan**: `Free`
   - **Health Check Path**: `/api/hospitals`
4. Expand **Environment Variables** and add:
   | Key | Value | Description |
   |---|---|---|
   | `SPRING_PROFILES_ACTIVE` | `postgres` | Activates cloud PostgreSQL profile |
   | `DATABASE_URL` | *(Paste Internal Database URL from Step 1)* | Database connection string |
   | `CORS_ALLOWED_ORIGINS` | `https://medicare-frontend.onrender.com` | Allows your frontend to make API calls |
   | `APP_FRONTEND_URL` | `https://medicare-frontend.onrender.com` | Base URL used in verification emails |
   | `PORT` | `8080` | Dynamic port Render binds to |
5. Click **Create Web Service**.
6. Wait for the build to finish. Once live, note your backend URL (e.g. `https://medicare-backend.onrender.com`).

---

### Step 3: Deploy the React Frontend Static Site
1. In Render Dashboard, click **New +** -> **Static Site**.
2. Connect your repository.
3. Configure the settings:
   - **Name**: `medicare-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Expand **Redirects/Rewrites** and add an SPA Rewrite rule:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
   > *Note: This prevents 404 errors when refreshing routes like `/login`, `/dashboard`, `/appointments`.*
5. Expand **Environment Variables** and add:
   | Key | Value | Description |
   |---|---|---|
   | `VITE_API_BASE_URL` | `https://medicare-backend.onrender.com` | URL of your deployed backend service |
6. Click **Create Static Site**.

---

## Environment Variables Reference

### Backend Service (`medicare-backend`)
- `SPRING_PROFILES_ACTIVE`: Set to `postgres` to activate PostgreSQL schema and configuration.
- `DATABASE_URL`: Render internal connection string (`postgres://...`). The smart `DatabaseConfig` will parse and format this into standard JDBC.
- `PORT`: Automatically set by Render, with default fallback to `8080`.
- `CORS_ALLOWED_ORIGINS`: Comma-delimited origins (e.g. `https://medicare-frontend.onrender.com,https://yourcustomdomain.com`).
- `APP_FRONTEND_URL`: Public URL of your frontend.
- `JWT_SECRET`: (Optional) Custom 256-bit secret key.
- `SPRING_MAIL_USERNAME` & `SPRING_MAIL_PASSWORD`: (Optional) Gmail address and 16-character App Password to send verification emails to real inboxes.

### Frontend Site (`medicare-frontend`)
- `VITE_API_BASE_URL`: The URL of the deployed backend (e.g. `https://medicare-backend.onrender.com`). If not set, it defaults to `/api`.

---

## Pre-seeded Demo Accounts

When starting on a fresh PostgreSQL instance, the backend automatically seeds all hospital data, departments, doctors, and demo accounts:

| Role | Username | Password |
|---|---|---|
| **Patient** | `narkhade` | `Password123!` |
| **Patient** | `mansinarkhade` | `Password123!` |
| **Doctor** | `dr_collins` | `Password123!` |
| **Admin** | `admin_sarah` | `Password123!` |

---

## Free-Tier Cold Starts & Tips

1. **Free Tier Inactivity Sleep**:
   On Render''s Free Tier, web services spin down after 15 minutes of inactivity. When a request comes in, the backend will take ~30–50 seconds to wake up (cold start). Once awake, responses are instantaneous.
2. **PostgreSQL Expiration**:
   Render Free PostgreSQL databases are free for 30 days. For long-term production, you can upgrade to Render Starter ($7/mo) or point `DATABASE_URL` to Supabase / Neon / AWS RDS.
3. **Email Verification in Dev/Testing**:
   If Gmail SMTP credentials are not supplied, the backend will log verification links and 6-digit OTPs directly to the Render service log output. You can open **Logs** in the Render dashboard to view them!
