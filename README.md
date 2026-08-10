# Talent Flow Hub Monorepo

Talent Flow Hub is organized as a multi-package monorepo containing the main Startup Admin Panel, the multi-tenant Company Onboarding Portal, the Candidate Portal, and the shared API & Data Layer.

## Workspace Packages

This monorepo consists of four packages in the [`packages/`](file:///home/samarthpachpile/CRM/app.talent-flow.monorepo/packages) directory:

1. **[`packages/admin-panel`](file:///home/samarthpachpile/CRM/app.talent-flow.monorepo/packages/admin-panel)** (`@talent-flow/admin-panel`)
   - The central **Startup Admin Panel** used by the core team.
   - Comprehensive Recruitment CRM, ATS Pipeline, Interview Scheduler, Approval Engine, Offer Management, and IT Asset Management.

2. **[`packages/company-onboarding`](file:///home/samarthpachpile/CRM/app.talent-flow.monorepo/packages/company-onboarding)** (`@talent-flow/company-onboarding`)
   - The **Company Onboarding Portal** provided to external client companies.
   - Includes a 6-step guided Onboarding Wizard, Company Branding & Subdomain Customizer, Plan & Subscription Billing, Integration Hub (Google Workspace, Slack, Teams, SMTP), Team Member Invites, and a Live Interactive Portal Preview.

3. **[`packages/candidate-portal`](file:///home/samarthpachpile/CRM/app.talent-flow.monorepo/packages/candidate-portal)** (`@talent-flow/candidate-portal`)
   - The **Candidate Portal & Self-Service Experience** for job applicants and newly hired candidates.
   - Includes application tracking, multi-stage candidate onboarding flow (Application, Interview, Offer Signing, Background Check, Hardware Setup, Credentials, Day 1 Checklist), Notification Center, and Helpdesk.

4. **[`packages/api`](file:///home/samarthpachpile/CRM/app.talent-flow.monorepo/packages/api)** (`@talent-flow/api`)
   - The **Shared API & Data Layer** shared package used across front-end applications.
   - Firebase SDK configuration (Firestore, Auth, Storage, Analytics), core domain services (`AdminApiService`, `CompanyApiService`, `CandidateApiService`, `SettingsBackendService`, `FirebaseAuthService`), SMTP email service, and shared TypeScript types.

---

## Workspace Structure

```
talent-flow-hub/
├── package.json                   # Root monorepo workspace configuration
├── tsconfig.json                   # Base TypeScript config referencing packages
├── lerna.json                     # Lerna workspace configuration
├── README.md                      # Documentation
├── packages/
│   ├── admin-panel/               # Startup Admin Panel (Package 1)
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── src/
│   ├── company-onboarding/        # Company Onboarding Portal (Package 2)
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── src/
│   ├── candidate-portal/          # Candidate Portal (Package 3)
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── src/
│   └── api/                       # Shared API & Data Layer (Package 4)
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
```

---

## Getting Started & Development

### 1. Install Dependencies

Install workspace dependencies from the root:

```sh
npm install
```

### 2. Run Applications

> Note: `npm run dev` at the root is disabled. Use `npm run dev:all` or individual package scripts.

To run **all applications concurrently**:

```sh
npm run dev:all
```

To start individual packages:

```sh
npm run dev:admin-panel           # Start Admin Panel
npm run dev:candidate-portal      # Start Candidate Portal
npm run dev:company-onboarding    # Start Company Onboarding Portal
npm run dev:croton-it-solutions   # Start Croton IT Solutions
```

---

## Build Commands

> Note: `npm run build` at the root is disabled. Use `npm run build:all` or individual package scripts.

Build all packages for production:

```sh
npm run build:all
```

Build individual packages:

```sh
npm run build:admin-panel           # Build Admin Panel
npm run build:candidate-portal      # Build Candidate Portal
npm run build:company-onboarding    # Build Company Onboarding Portal
npm run build:croton-it-solutions   # Build Croton IT Solutions
npm run build:api                   # Build API package
```

---

## Lovable Integration

This project is connected to [Lovable](https://lovable.dev). Pushed commits sync back automatically.
