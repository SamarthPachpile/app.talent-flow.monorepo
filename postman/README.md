# TalentFlow Postman API Collection & Environment

This folder contains the complete exported files ready to be imported directly into **Postman** (or any compatible API client like Insomnia, Thunder Client, Bruno, or Hoppscotch).

---

## 📁 Exported Files in this Folder

| File                                                                                                                                                                       | Type                      | Description                                                                                                                                           |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**`TalentFlow_API.postman_collection.json`**](file:///home/samarthpachpile/CRM/app.talent-flow.monorepo/postman/TalentFlow_API.postman_collection.json)                   | Postman Collection (v2.1) | Contains all **35+ API requests** organized by feature modules with pre-configured headers, sample request bodies, and automated JWT capture scripts. |
| [**`TalentFlow_Environment.postman_environment.json`**](file:///home/samarthpachpile/CRM/app.talent-flow.monorepo/postman/TalentFlow_Environment.postman_environment.json) | Postman Environment       | Pre-configured environment variables (`baseUrl`, `jwtToken`, `candidateId`, `companyId`, `jobId`, `adminEmail`, `adminPassword`).                     |
| [**`openapi.json`**](file:///home/samarthpachpile/CRM/app.talent-flow.monorepo/postman/openapi.json)                                                                       | OpenAPI 3.0 Specification | Industry standard OpenAPI 3.0 spec for Swagger / Postman API definition import.                                                                       |
| [**`talentflow_api.http`**](file:///home/samarthpachpile/CRM/app.talent-flow.monorepo/postman/talentflow_api.http)                                                         | REST Client (.http)       | File for VS Code REST Client / Thunder Client extension.                                                                                              |

---

## 🚀 How to Import into Postman (3 Simple Steps)

### Step 1: Open Postman & Click Import

1. Open your Postman desktop app or web app.
2. Click the **Import** button in the top-left corner of your Postman workspace.

### Step 2: Select the Folder or Files

Choose one of the following methods:

- **Folder Import (Recommended)**: Drag and drop the entire `postman/` directory into the Postman Import window.
- **File Import**: Select `TalentFlow_API.postman_collection.json` and `TalentFlow_Environment.postman_environment.json`.

### Step 3: Select the Environment & Run

1. In the top-right environment selector of Postman, choose **`TalentFlow Local Dev Environment`**.
2. Run any request!

---

## ⚡ Automated JWT Token Extraction

When you execute any of the following requests:

- **`2. Authentication & JWT -> Sign In`**
- **`2. Authentication & JWT -> Sign Up - Quick Registration`**
- **`2. Authentication & JWT -> Sign Up - Full Onboarding Details`**
- **`2. Authentication & JWT -> Google Social Authentication`**

Postman automatically executes this test script to save the returned JWT token to your active environment variable `{{jwtToken}}`:

```javascript
const res = pm.response.json();
if (res.data && res.data.token) {
  pm.environment.set("jwtToken", res.data.token);
  pm.collectionVariables.set("jwtToken", res.data.token);
  console.log("JWT Token automatically saved to {{jwtToken}}");
}
```

All protected endpoints in the collection will immediately use this token automatically via the collection-level `Authorization: Bearer {{jwtToken}}` header.

---

## 📂 Included API Folders & Endpoints

1. **`1. System Health`**
   - System Health Status (`GET /api/health`)
   - Server Health Alias (`GET /api/system-health`)

2. **`2. Authentication & JWT`**
   - Sign In (`POST /api/auth/signin`) — _Extracts JWT_
   - Sign Up Quick (`POST /api/auth/signup`) — _Extracts JWT_
   - Sign Up Full Details (`POST /api/auth/signup-details`) — _Extracts JWT_
   - Google Social Auth (`POST /api/auth/google`) — _Extracts JWT_
   - Get Current User (`GET /api/auth/me`) — _Uses Bearer JWT_
   - Validate Session / Token (`GET /api/auth/session/validate`)
   - Send Verification Email (`POST /api/auth/verify-email`)
   - Check Email Verified (`GET /api/auth/check-verified`)
   - Update Email Address (`POST /api/auth/update-email`)
   - Send 6-Digit OTP (`POST /api/auth/otp/send`)
   - Verify 6-Digit OTP (`POST /api/auth/otp/verify`)
   - Google OAuth Client Config (`GET /api/auth/google/config`)
   - Sign Out & Invalidate Token (`POST /api/auth/signout`)

3. **`3. Platform Admin`**
   - Get Platform Statistics (`GET /api/admin/stats`)
   - Get Admin Settings (`GET /api/admin/settings`)
   - Update Admin Settings (`POST /api/admin/settings`)
   - Get Admin Health & Metrics (`GET /api/admin/health`)
   - Get Platform Audit Logs (`GET /api/admin/audit-logs`)
   - Clear Cache Keys (`POST /api/admin/cache/clear`)
   - Revoke User Session (`POST /api/admin/session/revoke`)

4. **`4. Candidate Portal`**
   - Get All Candidates (`GET /api/candidates`)
   - Save / Update Candidate Profile (`POST /api/candidates`)
   - Get Candidate by ID (`GET /api/candidates/:id`)
   - Search Candidate by Email (`GET /api/candidates/search/email`)
   - Link Company to Candidate (`POST /api/candidates/:id/add-company`)
   - Get Candidate Settings (`GET /api/candidates/:candidateId/settings`)
   - Save Candidate Settings (`POST /api/candidates/:candidateId/settings`)
   - Delete Candidate Profile (`DELETE /api/candidates/:id`)

5. **`5. Company Workspace`**
   - Get All Companies (`GET /api/companies`)
   - Save / Update Company Workspace (`POST /api/companies`)
   - Get Company by ID (`GET /api/companies/:id`)
   - Search Company by Email (`GET /api/companies/search/email`)
   - Enroll Candidate to Company (`POST /api/companies/:companyId/register-candidate`)
   - Get Company Settings (`GET /api/companies/:companyId/settings`)
   - Save Company Settings (`POST /api/companies/:companyId/settings`)
   - Schedule Credentials Email (`POST /api/companies/schedule-credentials-email`)

6. **`6. Job Postings & ATS`**
   - Get All Job Postings (`GET /api/jobs`)
   - Create New Job Opening (`POST /api/jobs`)
   - Get Job Postings by Company (`GET /api/jobs/company/:companyId`)
   - Get Job by ID (`GET /api/jobs/:id`)
   - Update Job Status (`PATCH /api/jobs/:id/status`)
   - Delete Job Posting (`DELETE /api/jobs/:id`)

7. **`7. Graviton Solutions`**
   - Graviton Ecosystem Health (`GET /api/graviton/health`)
   - Submit Consultation Lead (`POST /api/graviton/leads`)

8. **`8. Unified Settings`**
   - Get Admin Unified Settings (`GET /api/settings/admin`)
   - Update Admin Unified Settings (`POST /api/settings/admin`)
   - Get Company Unified Settings (`GET /api/settings/company/:companyId`)
   - Save Company Unified Settings (`POST /api/settings/company/:companyId`)
   - Get Candidate Unified Settings (`GET /api/settings/candidate/:candidateId`)
   - Save Candidate Unified Settings (`POST /api/settings/candidate/:candidateId`)
