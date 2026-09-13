# TalentFlow API & JWT Complete Reference Guide

This document provides a comprehensive reference of all API endpoints and JSON Web Token (JWT) authentication mechanisms available in the TalentFlow platform.

---

## 1. Quick Start & Server Setup

### Start the API Server:

```sh
npm run dev --workspace=@talent-flow/api
# Or start from root:
npx tsx packages/api/src/server.ts
```

The server will start listening at: `http://localhost:5000`

---

## 2. JWT Authentication Architecture

TalentFlow uses signed HMAC-SHA256 (`HS256`) JSON Web Tokens for secure, stateless authentication with role-based authorization.

### JWT Properties:

- **Default Expiration**: `7d` (7 days)
- **Environment Variable**: `JWT_SECRET` (falls back to a default production-ready secret)
- **Token Transmission**: `Authorization: Bearer <TOKEN>` HTTP header
- **Roles Supported**:
  - `admin`: Full platform access (platform administrator)
  - `company`: Employer workspace access (jobs, candidates, company settings)
  - `candidate`: Job seeker and applicant profile access

### Decoded Payload Format:

```json
{
  "id": "cand-789012-alexsmith",
  "email": "alex.smith@example.com",
  "role": "candidate",
  "fullName": "Alex Smith",
  "candidateId": "cand-789012-alexsmith",
  "iat": 1773414800,
  "exp": 1774019600
}
```

---

## 3. Comprehensive List of All API Endpoints

### 🩺 System & Health Endpoints

| Method | Endpoint      | Aliases                                    | Description                                                    | Auth   |
| :----- | :------------ | :----------------------------------------- | :------------------------------------------------------------- | :----- |
| `GET`  | `/api/health` | `/api/system-health`, `/api/server-health` | Check health of server, MongoDB, Dragonfly DB, and Auth engine | Public |

---

### 🔐 Authentication & Session Management

Base router: `/api/auth` (Aliases: `/api/candidates-auth`, `/api/companies-auth`, `/api/admin-auth`, `/api/auth-portal`, `/api/auth-service`)

| Method | Endpoint                     | Description                                                   | Request Body / Query                                                                                                             | Header Required                                       |
| :----- | :--------------------------- | :------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------- |
| `POST` | `/api/auth/signup`           | Fast signup for Candidate or Company                          | `{"email": "...", "password": "...", "fullName": "...", "role": "candidate" \| "company"}`                                       | None                                                  |
| `POST` | `/api/auth/signup-details`   | Full multi-stage signup with detailed onboarding metadata     | `{"email": "...", "password": "...", "fullName": "...", "role": "...", "companyName": "...", "phone": "...", "industry": "..."}` | None                                                  |
| `POST` | `/api/auth/signin`           | Sign in for Candidate, Company, or Admin, returns JWT `token` | `{"email": "...", "password": "..."}`                                                                                            | None                                                  |
| `POST` | `/api/auth/google`           | Google Social Sign-In / OAuth verification                    | `{"email": "...", "fullName": "...", "googleId": "...", "avatarUrl": "...", "role": "..."}`                                      | None                                                  |
| `GET`  | `/api/auth/me`               | **Verify current JWT token and retrieve profile**             | None                                                                                                                             | `Authorization: Bearer <token>`                       |
| `POST` | `/api/auth/signout`          | Sign out and invalidate session in Dragonfly DB               | None                                                                                                                             | `Authorization: Bearer <token>`                       |
| `GET`  | `/api/auth/session/validate` | Check if session ID or JWT token is valid                     | None                                                                                                                             | `session-id: <id>` or `Authorization: Bearer <token>` |
| `POST` | `/api/auth/session/validate` | Check if session ID or JWT token is valid (POST)              | `{"sessionId": "...", "token": "..."}`                                                                                           | None                                                  |
| `POST` | `/api/auth/verify-email`     | Send email verification link to user                          | `{"email": "user@example.com"}`                                                                                                  | None                                                  |
| `GET`  | `/api/auth/check-verified`   | Check whether an email address is verified                    | Query: `?email=user@example.com`                                                                                                 | None                                                  |
| `POST` | `/api/auth/update-email`     | Change account email & resend verification                    | `{"currentEmail": "old@example.com", "newEmail": "new@example.com"}`                                                             | None                                                  |
| `POST` | `/api/auth/otp/send`         | Generate and dispatch 6-digit OTP code                        | `{"destination": "+1234567890" \| "email"}`                                                                                      | None                                                  |
| `POST` | `/api/auth/otp/verify`       | Validate user-entered OTP code                                | `{"userEnteredOtp": "123456", "expectedOtp": "123456"}`                                                                          | None                                                  |
| `GET`  | `/api/auth/google/config`    | Retrieve Google OAuth client ID status                        | None                                                                                                                             | None                                                  |
| `GET`  | `/api/auth/google/redirect`  | Passport Google OAuth Web flow                                | Query: `?role=candidate` or `?role=company`                                                                                      | None                                                  |
| `GET`  | `/api/auth/google/callback`  | Google OAuth redirect callback endpoint                       | Handled by Google OAuth                                                                                                          | None                                                  |

---

### 👑 Platform Admin Endpoints

Base router: `/api/admin` (Aliases: `/api/admin-portal`, `/api/admin-panel`)

| Method | Endpoint                    | Description                                                       | Request Body                | Auth         |
| :----- | :-------------------------- | :---------------------------------------------------------------- | :-------------------------- | :----------- |
| `GET`  | `/api/admin/stats`          | Platform statistics (total companies, candidates, jobs)           | None                        | Optional JWT |
| `GET`  | `/api/admin/settings`       | Get global admin & system configuration                           | None                        | Optional JWT |
| `POST` | `/api/admin/settings`       | Update global admin & system configuration                        | System settings JSON        | Optional JWT |
| `GET`  | `/api/admin/health`         | Operational backend status and metrics                            | None                        | Optional JWT |
| `GET`  | `/api/admin/audit-logs`     | Platform audit trail and events                                   | None                        | Optional JWT |
| `POST` | `/api/admin/cache/clear`    | Flush Dragonfly DB cache keys                                     | `{"pattern": "*"}`          | Admin JWT    |
| `POST` | `/api/admin/session/revoke` | Revoke a user's active session                                    | `{"sessionId": "sess_..."}` | Admin JWT    |
| `GET`  | `/api/admin/sync/status`    | Get status of Dragonfly-to-Mongo write-behind sync queue          | None                        | Admin JWT    |
| `POST` | `/api/admin/sync/trigger`   | Trigger immediate manual drain of write-behind queue into MongoDB | None                        | Admin JWT    |

---

### 👤 Candidate Portal Endpoints

Base router: `/api/candidates` (Aliases: `/api/candidates-portal`, `/api/candidates-profile`, `/api/candidates-data`)

| Method   | Endpoint                                | Description                              | Request / Params                             | Auth         |
| :------- | :-------------------------------------- | :--------------------------------------- | :------------------------------------------- | :----------- |
| `GET`    | `/api/candidates`                       | List all candidate profiles              | None                                         | Optional JWT |
| `POST`   | `/api/candidates`                       | Save / update candidate profile data     | Candidate profile JSON                       | Optional JWT |
| `GET`    | `/api/candidates/:id`                   | Get candidate profile by Candidate ID    | `:id` (e.g. `cand-123456-alex`)              | Optional JWT |
| `GET`    | `/api/candidates/search/email`          | Search candidate profile by email or UID | `?email=...` or `?uid=...`                   | Optional JWT |
| `POST`   | `/api/candidates/:id/add-company`       | Associate a company with candidate       | `{"companyId": "...", "companyName": "..."}` | Optional JWT |
| `GET`    | `/api/candidates/:candidateId/settings` | Get candidate settings & preferences     | `:candidateId`                               | Optional JWT |
| `POST`   | `/api/candidates/:candidateId/settings` | Update candidate settings & preferences  | Settings JSON                                | Optional JWT |
| `DELETE` | `/api/candidates/:id`                   | Delete candidate profile                 | `:id`                                        | Optional JWT |

---

### 🏢 Company Workspace Endpoints

Base router: `/api/companies` (Aliases: `/api/companies-portal`, `/api/companies-workspace`, `/api/companies-profile`)

| Method | Endpoint                                       | Description                                | Request / Params                               | Auth         |
| :----- | :--------------------------------------------- | :----------------------------------------- | :--------------------------------------------- | :----------- |
| `GET`  | `/api/companies`                               | List all onboarded employer workspaces     | None                                           | Optional JWT |
| `POST` | `/api/companies`                               | Save or update company workspace           | Company profile JSON                           | Optional JWT |
| `GET`  | `/api/companies/:id`                           | Get company by ID or subdomain slug        | `:id` (e.g. `comp-acme-corp`)                  | Optional JWT |
| `GET`  | `/api/companies/search/email`                  | Search company by work email or UID        | `?email=hr@acme.com`                           | Optional JWT |
| `POST` | `/api/companies/:companyId/register-candidate` | Enroll candidate into company talent pool  | `{"candidate": {"id": "...", "email": "..."}}` | Optional JWT |
| `GET`  | `/api/companies/:companyId/settings`           | Get company workspace settings & branding  | `:companyId`                                   | Optional JWT |
| `POST` | `/api/companies/:companyId/settings`           | Update company workspace settings          | Settings JSON                                  | Optional JWT |
| `POST` | `/api/companies/schedule-credentials-email`    | Schedule credentials/invite email dispatch | `{"companySlug": "...", "recipients": [...]}`  | Optional JWT |

---

### 💼 Job Postings & ATS Endpoints

Base router: `/api/jobs` (Aliases: `/api/job-postings`, `/api/job-listings`, `/api/jobs-portal`)

| Method   | Endpoint                       | Description                                        | Request / Params          | Auth                |
| :------- | :----------------------------- | :------------------------------------------------- | :------------------------ | :------------------ |
| `GET`    | `/api/jobs`                    | Retrieve all job listings                          | None                      | Public              |
| `POST`   | `/api/jobs`                    | Create a new job opening                           | Job posting JSON          | Company / Admin JWT |
| `GET`    | `/api/jobs/company/:companyId` | Retrieve jobs posted by a company                  | `:companyId`              | Public              |
| `GET`    | `/api/jobs/:id`                | Get job details by ID                              | `:id`                     | Public              |
| `PATCH`  | `/api/jobs/:id/status`         | Update job status (`draft`, `published`, `closed`) | `{"status": "published"}` | Company / Admin JWT |
| `DELETE` | `/api/jobs/:id`                | Delete a job posting                               | `:id`                     | Company / Admin JWT |

---

### 🌐 Graviton Solutions Endpoints

Base router: `/api/graviton` (Aliases: `/api/graviton-services`)

| Method | Endpoint               | Description                                  | Request Body                                                                | Auth   |
| :----- | :--------------------- | :------------------------------------------- | :-------------------------------------------------------------------------- | :----- |
| `GET`  | `/api/graviton/health` | Check Graviton ecosystem status              | None                                                                        | Public |
| `POST` | `/api/graviton/leads`  | Capture prospective client consultation lead | `{"name": "...", "email": "...", "company": "...", "serviceNeeded": "..."}` | Public |

---

### ⚙️ System Settings Endpoints

Base router: `/api/settings` (Aliases: `/api/system-settings`, `/api/app-settings`)

| Method | Endpoint                               | Description                              | Auth      |
| :----- | :------------------------------------- | :--------------------------------------- | :-------- |
| `GET`  | `/api/settings/admin`                  | Retrieve platform administrator settings | Admin     |
| `POST` | `/api/settings/admin`                  | Update platform administrator settings   | Admin     |
| `GET`  | `/api/settings/company/:companyId`     | Retrieve company settings                | Company   |
| `POST` | `/api/settings/company/:companyId`     | Update company settings                  | Company   |
| `GET`  | `/api/settings/candidate/:candidateId` | Retrieve candidate user settings         | Candidate |
| `POST` | `/api/settings/candidate/:candidateId` | Update candidate user settings           | Candidate |

---

## 4. How to Test the API & JWT (Hands-On Guide)

### Complete cURL Testing Flow

#### 1. Test Server Health

```bash
curl -i http://localhost:5000/api/health
```

#### 2. Register a New Candidate Account

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.candidate@talentflow.io",
    "password": "Password123!",
    "fullName": "Test Candidate",
    "role": "candidate"
  }'
```

#### 3. Sign In & Extract JWT Token

```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.candidate@talentflow.io",
    "password": "Password123!"
  }'
```

#### 4. Verify JWT Identity & Current Profile (`GET /api/auth/me`)

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <INSERT_TOKEN_FROM_STEP_3>"
```

#### 5. Sign In as Admin

```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@talentflow.io",
    "password": "Admin@1234"
  }'
```

#### 6. Create a New Job Opening

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <INSERT_TOKEN>" \
  -d '{
    "title": "Staff Backend Engineer",
    "companyId": "comp-100",
    "companyName": "TalentFlow Inc",
    "department": "Engineering",
    "location": "Remote",
    "type": "Full-Time",
    "salary": "$150,000 - $190,000",
    "status": "published",
    "description": "Building high scale distributed systems"
  }'
```

#### 7. Fetch All Jobs

```bash
curl -X GET http://localhost:5000/api/jobs
```

#### 8. Sign Out

```bash
curl -X POST http://localhost:5000/api/auth/signout \
  -H "Authorization: Bearer <INSERT_TOKEN>"
```

---

## 5. Dragonfly DB-First & MongoDB Write-Behind Cron Sync Architecture

TalentFlow uses a high-performance **Dragonfly DB-First** caching and **Write-Behind Cron Sync** architecture:

```
                  ┌────────────────────────┐
                  │      Client / API      │
                  └───────────┬────────────┘
                              │
             ┌────────────────┴────────────────┐
             │ Reads                           │ Writes (Mutations)
             ▼                                 ▼
┌────────────────────────┐        ┌────────────────────────┐
│  Dragonfly DB (Cache)  │        │  Dragonfly DB (Write)  │
└────────────┬───────────┘        └────────────┬───────────┘
             │ (Cache Miss)                    │
             ▼                                 │ Enqueue Mutation
┌────────────────────────┐                     ▼
│  MongoDB Atlas (Read)  │        ┌────────────────────────┐
└────────────┬───────────┘        │ Write-Behind Queue     │
             │                            (tf:df:write_queue:pending)
             │ Hydrate Cache                   │
             └───────────►                     │ Background Cron (3000ms)
                                               ▼
                                  ┌────────────────────────┐
                                  │  MongoDB Atlas (Write) │
                                  └────────────────────────┘
```

### Key Principles:

1. **Strict Dragonfly DB Read-Through**:
   - All queries (candidate profiles, company records, job openings, settings, auth lookups) check **Dragonfly DB** first via Redis keys (e.g. `tf:df:candidate:id:<id>`, `tf:df:candidate:email:<email>`, `tf:df:job:<id>`).
   - If the key exists in Dragonfly, it is returned immediately with sub-millisecond latency.
   - If the key is not in Dragonfly DB (cache miss), the data is queried from **MongoDB Atlas**, stored back into Dragonfly DB with a standard TTL (e.g., 1800s - 3600s), and returned.

2. **Strict Dragonfly DB Write-First & Cron Write-Behind**:
   - All writes, creations, and updates (candidates, companies, jobs, settings) are written directly to **Dragonfly DB** in real time.
   - Simultaneously, a mutation task is pushed onto Dragonfly DB's persistent sync queue (`tf:df:write_queue:pending`).
   - The user receives an instant sub-millisecond response without waiting for MongoDB disk I/O.

3. **Automated Background Cron Worker**:
   - On server startup (`server.ts`), `initializeDragonflyMongoCronSync(3000)` launches an asynchronous background Cron timer (defaulting to every 3,000ms / 3 seconds).
   - Every 3 seconds, the worker dequeues pending mutations in batches of up to 50 items and persists them into the respective MongoDB Atlas collections (`Candidate`, `Company`, `Job`, `Settings`).
   - Automatic retry tracking (up to 5 attempts) and in-memory queue fallback ensure zero data loss during network hiccups.

4. **Live Monitoring & Manual Sync APIs**:
   - `GET /api/admin/sync/status`: Inspect live queue size, interval, worker state, and recent batch audit history.
   - `POST /api/admin/sync/trigger`: Trigger an on-demand flush of the write-behind queue to MongoDB.
