# Talent Flow Hub Monorepo

Talent Flow Hub is organized as a multi-package monorepo containing the main Startup Admin Panel and the multi-tenant Company Onboarding Portal.

## Workspace Packages

This monorepo consists of two packages in the [`packages/`](file:///home/samarthpachpile/CRM/talent-flow-hub/packages) directory:

1. **[`packages/admin-panel`](file:///home/samarthpachpile/CRM/talent-flow-hub/packages/admin-panel)** (`@talent-flow/admin-panel`)
   - The central **Startup Admin Panel** used by the core team.
   - Comprehensive Recruitment CRM, ATS Pipeline, Interview Scheduler, Approval Engine, Offer Management, and IT Asset Management.

2. **[`packages/company-onboarding`](file:///home/samarthpachpile/CRM/talent-flow-hub/packages/company-onboarding)** (`@talent-flow/company-onboarding`)
   - The **Company Onboarding Portal** provided to external client companies.
   - Includes a 6-step guided Onboarding Wizard, Company Branding & Subdomain Customizer, Plan & Subscription Billing, Integration Hub (Google Workspace, Slack, Teams, SMTP), Team Member Invites, and a Live Interactive Portal Preview.

---

## Workspace Structure

```
talent-flow-hub/
├── package.json                   # Root monorepo workspace configuration
├── tsconfig.json                   # Base TypeScript config referencing packages
├── README.md                      # Documentation
├── packages/
│   ├── admin-panel/               # Startup Admin Panel (Package 1)
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── src/
│   └── company-onboarding/        # Company Onboarding Portal (Package 2)
│       ├── package.json
│       ├── vite.config.ts
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

To start the **Startup Admin Panel**:

```sh
npm run dev:admin
```

_(Runs at `http://localhost:3000`)_

To start the **Company Onboarding Portal**:

```sh
npm run dev:onboarding
```

_(Runs at `http://localhost:3001`)_

To run **both applications concurrently**:

```sh
npm run dev:all
```

---

## Build Commands

Build both packages for production:

```sh
npm run build
```

Build individual packages:

```sh
npm run build:admin        # Build Admin Panel
npm run build:onboarding   # Build Company Onboarding Portal
```

---

## Lovable Integration

This project is connected to [Lovable](https://lovable.dev). Pushed commits sync back automatically.
