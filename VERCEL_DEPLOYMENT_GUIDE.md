# Deploying TalentFlow Monorepo to Vercel

This guide provides everything needed to deploy the complete TalentFlow Monorepo to **Vercel** with full multi-tenant portal routing, Serverless Express API, Dragonfly DB/Redis caching, and MongoDB Atlas database connection.

---

## 🏛️ Monorepo Deployment Options on Vercel

You can choose either of the two standard deployment approaches:

| Approach                                           | Description                                                                                                                                                      | Best For                                                                                                 |
| :------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| **Option A: All-in-One Single Deployment**         | Deploys the root repository once with `vercel.json` routing `/api/*` to the Serverless API function and serving the frontend from a single custom domain.        | Fastest setup, single domain.                                                                            |
| **Option B: Multi-Project Monorepo (Recommended)** | Deploys each portal (`admin-panel`, `candidate-portal`, `company-portal`, `graviton-it-solutions`, `api`) as a separate Vercel Project under one Git repository. | Production micro-frontends with dedicated subdomains (`admin.domain.com`, `candidate.domain.com`, etc.). |

---

## 🚀 Option A: All-in-One Deployment (Single Project on Vercel)

The repository includes a ready-to-use [`vercel.json`](file:///home/samarthpachpile/CRM/app.talent-flow.monorepo/vercel.json) and [`api/index.ts`](file:///home/samarthpachpile/CRM/app.talent-flow.monorepo/api/index.ts) serverless handler.

### Step 1: Import Repository to Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** ➡️ **"Project"**.
2. Select your repository: **`SamarthPachpile/app.talent-flow.monorepo`**.
3. Keep the **Root Directory** as `./` (the repository root).

### Step 2: Configure Build Settings

- **Framework Preset**: `Other` / `Vite`
- **Build Command**: `npm run build --workspaces` (or leave default if overridden by `vercel.json`)
- **Output Directory**: `packages/graviton-it-solutions/dist` (or the default landing portal)
- **Install Command**: `npm install`

### Step 3: Add Environment Variables (See Section below)

Add the required database, Dragonfly DB/Redis, JWT, and Google OAuth variables in the **Environment Variables** section.

### Step 4: Deploy

Click **Deploy**. Vercel will build all packages and host the Serverless API functions at `/api/*` and the static web assets.

---

## 🌐 Option B: Multi-Project Deployment (Recommended for Subdomains)

To host each portal on its own dedicated subdomain (`admin.<domain>`, `candidates.<domain>`, `companies.<domain>`, `<domain>`, and `api.<domain>`), create separate Projects in Vercel from this repository.

Each frontend application includes automatic dynamic routing:

- When accessed via its subdomain (e.g. `admin.yourdomain.com` or `candidates.yourdomain.com`), the root URL `/` serves the portal directly.
- When accessed via subpath routes (e.g. `/admin-panel`, `/candidates-portal`, `/companies`), the app also routes appropriately.

### Step-by-Step Multi-Project Setup

| Vercel Project       | Root Directory                   | Framework Preset | Build Command   | Output Directory | Recommended Subdomain                    |
| :------------------- | :------------------------------- | :--------------- | :-------------- | :--------------- | :--------------------------------------- |
| **Admin Portal**     | `packages/admin-panel`           | `Vite`           | `npm run build` | `dist`           | `admin.yourdomain.com`                   |
| **Candidate Portal** | `packages/candidate-portal`      | `Vite`           | `npm run build` | `dist`           | `candidates.yourdomain.com`              |
| **Company Portal**   | `packages/company-portal`        | `Vite`           | `npm run build` | `dist`           | `companies.yourdomain.com`               |
| **Landing Portal**   | `packages/graviton-it-solutions` | `Vite`           | `npm run build` | `dist`           | `yourdomain.com` / `www.yourdomain.com`  |
| **Serverless API**   | `./` (repo root)                 | `Other`          | `npm run build` | `dist`           | `api.yourdomain.com` (or route `/api/*`) |

---

### Project Configuration Details:

#### 1. Admin Portal

- **Project Name**: `talentflow-admin`
- **Root Directory**: `packages/admin-panel`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Domain Assignment**: `https://app-talent-flow-monorepo-admin-pane.vercel.app` (or custom subdomain `admin.yourdomain.com`)
- **Environment Variables**:
  - `VITE_API_URL`: `https://app-talent-flow-monorepo-api.vercel.app` (or your backend API URL)

#### 2. Candidate Portal

- **Project Name**: `talentflow-candidates`
- **Root Directory**: `packages/candidate-portal`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Domain Assignment**: `https://app-talent-flow-monorepo-candidate.vercel.app` (or custom subdomain `candidates.yourdomain.com`)
- **Environment Variables**:
  - `VITE_API_URL`: `https://app-talent-flow-monorepo-api.vercel.app`

#### 3. Company Portal

- **Project Name**: `talentflow-companies`
- **Root Directory**: `packages/company-portal`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Domain Assignment**: `https://app-talent-flow-monorepo-company-po.vercel.app` (or custom subdomain `companies.yourdomain.com`)
- **Environment Variables**:
  - `VITE_API_URL`: `https://app-talent-flow-monorepo-api.vercel.app`

#### 4. Landing / Main Site

- **Project Name**: `talentflow-landing`
- **Root Directory**: `packages/graviton-it-solutions`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Domain Assignment**: `https://app-talent-flow-monorepo-graviton-i.vercel.app` (or custom domain `yourdomain.com`)
- **Environment Variables**:
  - `VITE_API_URL`: `https://app-talent-flow-monorepo-api.vercel.app`

#### 5. Serverless API (Backend)

- **Project Name**: `talentflow-api`
- **Root Directory**: `./` (Root directory of monorepo so `api/index.ts` handler resolves workspaces)
- **Framework Preset**: `Other`
- **Build Command**: `npm run build`
- **Domain Assignment**: `api.yourdomain.com`
- **Environment Variables**:
  - `MONGODB_URI`, `DRAGONFLY_HOST`, `JWT_SECRET`, etc. (see below)

---

## 🔑 All Environment Variables Required on Vercel

Configure these in the **Environment Variables** tab of your Vercel Project settings (for Production, Preview, and Development):

### 1. Database & Cache (Required)

| Variable              | Example Value                                                                                 | Description                                 |
| :-------------------- | :-------------------------------------------------------------------------------------------- | :------------------------------------------ |
| `MONGODB_URI`         | `mongodb+srv://<user>:<password>@cluster0.mongodb.net/talentflow?retryWrites=true&w=majority` | MongoDB Atlas Connection String             |
| `MONGODB_DATABASE`    | `talentflow`                                                                                  | Target database name                        |
| `DRAGONFLY_URL`       | `rediss://default:your_password@h6upazt0j.dragonflydb.cloud:6385`                             | Dragonfly DB / Upstash Redis connection URL |
| `DRAGONFLY_CACHE_TTL` | `3600`                                                                                        | Default cache TTL in seconds (1 hour)       |

> [!TIP]
> On cloud platforms like Vercel, you can use **Upstash Redis** or a hosted **Dragonfly Cloud** instance. Both are 100% Redis wire-protocol compatible with TalentFlow's `DragonflyCacheService`. Port, host, and authentication are derived directly from `DRAGONFLY_URL`.

### 2. Authentication & JWT (Required)

| Variable         | Example Value                        | Description                                  |
| :--------------- | :----------------------------------- | :------------------------------------------- |
| `JWT_SECRET`     | `your_secure_256_bit_jwt_secret_key` | Secret key used for signing HS256 JWT tokens |
| `SESSION_SECRET` | `your_secure_session_secret`         | Secret key used for session encryption       |
| `ADMIN_EMAIL`    | `admin@talentflow.io`                | Default root platform administrator email    |
| `ADMIN_PASSWORD` | `Admin@1234`                         | Default platform administrator credentials   |

### 3. Google Social Auth (Optional)

| Variable                | Example Value                                         | Description                               |
| :---------------------- | :---------------------------------------------------- | :---------------------------------------- |
| `GOOGLE_CLIENT_ID`      | `123456789-abc.apps.googleusercontent.com`            | Google Cloud OAuth 2.0 Client ID          |
| `GOOGLE_CLIENT_SECRET`  | `GOCSPX-your_google_secret`                           | Google Cloud OAuth 2.0 Secret             |
| `GOOGLE_CALLBACK_URL`   | `https://api.yourdomain.com/api/auth/google/callback` | Google OAuth redirect callback URL        |
| `VITE_GOOGLE_CLIENT_ID` | `123456789-abc.apps.googleusercontent.com`            | Frontend Google Client ID exposed to Vite |

### 4. Portal Domain URLs (CORS & Navigation)

| Variable               | Example Value                                            | Description                                     |
| :--------------------- | :------------------------------------------------------- | :---------------------------------------------- |
| `LANDING_DOMAIN_URL`   | `https://app-talent-flow-monorepo-graviton-i.vercel.app` | Main Landing / Graviton site URL (CORS allowed) |
| `ADMIN_DOMAIN_URL`     | `https://app-talent-flow-monorepo-admin-pane.vercel.app` | Admin panel portal URL (CORS allowed)           |
| `COMPANY_DOMAIN_URL`   | `https://app-talent-flow-monorepo-company-po.vercel.app` | Company portal URL (CORS allowed)               |
| `CANDIDATE_DOMAIN_URL` | `https://app-talent-flow-monorepo-candidate.vercel.app`  | Candidate portal URL (CORS allowed)             |
| `VITE_API_URL`         | `https://app-talent-flow-monorepo-api.vercel.app`        | Base API URL configured across frontend portals |

---

## 🛠️ CLI Quick Deploy with Vercel CLI

If you prefer deploying directly from your terminal:

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to your Vercel account
vercel login

# 3. Deploy Preview
vercel

# 4. Deploy to Production
vercel --prod
```
