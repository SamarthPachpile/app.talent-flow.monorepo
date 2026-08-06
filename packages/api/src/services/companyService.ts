import { doc, getDoc, setDoc, deleteDoc, getDocs, collection, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { sendMemberCredentialsSmtp } from "./smtpService";
import type {
  CompanySettings,
  EmailTemplate,
  AutomationRule,
  TeamMember,
  ApiResponse,
} from "../types";

export interface CompanyDocument {
  id: string;
  name: string;
  subdomain: string;
  domain: string;
  industry: string;
  size: string;
  brandColor: string;
  headquarters: string;
  logoUrl?: string;
  coverImageUrl?: string;
  legalName?: string;
  gstNumber?: string;
  panNumber?: string;
  cinNumber?: string;
  registrationNumber?: string;
  website?: string;
  linkedin?: string;
  about?: string;
  yearFounded?: string;
  employeeCount?: string;
  headOfficeAddress?: string;
  state?: string;
  city?: string;
  pincode?: string;
  timezone?: string;
  businessHours?: string;
  admin: {
    fullName: string;
    workEmail: string;
    phone?: string;
    jobTitle?: string;
    billingEmail?: string;
    uid?: string;
  };
  plan?: {
    id: string;
    name: string;
    priceMonthly: number;
    billingCycle: string;
  };
  modules?: Record<string, unknown>;
  integrations?: Record<string, unknown>;
  teamInvites?: Array<{
    id: string;
    email: string;
    role: string;
    department: string;
    status: string;
  }>;
  officeLocations?: Record<string, unknown>;
  hrTeam?: Array<Record<string, unknown>>;
  departments?: string[];
  jobTitles?: string[];
  recruitmentWorkflow?: Array<Record<string, unknown>>;
  candidateDocuments?: Record<string, unknown>;
  interviewSettings?: Record<string, unknown>;
  emailConfig?: Record<string, unknown>;
  careerPortal?: Record<string, unknown>;
  candidateExperience?: Record<string, unknown>;
  itSetup?: Record<string, unknown>;
  notificationPreferences?: Record<string, unknown>;
  approvalMatrix?: Record<string, unknown>;
  systemMetadata?: Record<string, unknown>;
  fullOnboardingState?: Record<string, unknown>;
  country?: string;
  referralSource?: string;
  termsAccepted?: boolean;
  captchaVerified?: boolean;
  emailVerified?: boolean;
  registeredCandidates?: Array<{
    id: string;
    fullName: string;
    email: string;
    registeredAt: string;
    stage?: string;
  }>;
  candidateIds?: string[];
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY_COMPANY_SETTINGS = "talentflow_company_settings";

const defaultCompanySettings: CompanySettings = {
  profile: {
    companyName: "Acme Corporation",
    subdomain: "acme",
    domain: "acmecorp.com",
    industry: "Technology & Software",
    size: "51-200 Employees",
    logoUrl: "",
    brandColor: "#6366f1",
    headquarters: "San Francisco, CA",
    senderAddress: "talent@acmecorp.com",
    emailSignature:
      "Acme Corporation · 100 Market St, San Francisco, CA\nQuestions? Reply directly to this email.",
  },
  hiringDefaults: {
    defaultInterviewDuration: "45",
    workingHours: "9-18",
    offerExpiryDays: "7",
    stageSlaWarningHours: "48",
  },
  notifications: {
    stageChangeDigest: true,
    blockedCandidateAlerts: true,
    interviewFeedbackChase: true,
    offerActivityAlerts: true,
  },
  compliance: {
    duplicateDetection: true,
    anonymousScreening: false,
    dataRetentionMonths: "12",
  },
  templates: [],
  automations: [],
  team: [],
};

export function normalizeCompanyDoc(raw: any): CompanyDocument {
  if (!raw) return raw;
  const cleanId = (raw.id || raw.subdomain || raw.name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  const logoUrl =
    raw.logoUrl ||
    raw.logo ||
    raw.profile?.logoUrl ||
    raw.profile?.logo ||
    raw.fullOnboardingState?.profile?.logoUrl ||
    raw.fullOnboardingState?.profile?.logo ||
    "";

  const coverImageUrl =
    raw.coverImageUrl ||
    raw.coverImage ||
    raw.profile?.coverImageUrl ||
    raw.profile?.coverImage ||
    raw.fullOnboardingState?.profile?.coverImageUrl ||
    raw.fullOnboardingState?.profile?.coverImage ||
    "";

  const brandColor =
    raw.brandColor ||
    raw.profile?.brandColor ||
    raw.fullOnboardingState?.profile?.brandColor ||
    "#6366f1";

  const industry =
    raw.industry ||
    raw.profile?.industry ||
    raw.fullOnboardingState?.profile?.industry ||
    "Technology & Software";

  const headquarters =
    raw.headquarters ||
    raw.profile?.headquarters ||
    raw.fullOnboardingState?.profile?.headquarters ||
    "Remote";

  const about =
    raw.about ||
    raw.profile?.about ||
    raw.fullOnboardingState?.profile?.about ||
    "";

  return {
    ...raw,
    id: cleanId || raw.id,
    name: raw.name || raw.profile?.name || cleanId || "Company",
    subdomain: (raw.subdomain || cleanId).toLowerCase().replace(/[^a-z0-9]/g, ""),
    logoUrl,
    coverImageUrl,
    brandColor,
    industry,
    headquarters,
    about,
  };
}

export class CompanyApiService {
  /**
   * Save or update company document in Firestore 'companies' collection
   */
  static async saveCompanyToFirestore(
    company: CompanyDocument,
  ): Promise<ApiResponse<CompanyDocument>> {
    try {
      const cleanDocId = (company.id || company.subdomain || company.name)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      company.id = cleanDocId || `company${Date.now()}`;
      if (company.subdomain) {
        company.subdomain = company.subdomain.toLowerCase().replace(/[^a-z0-9]/g, "");
      }
      const normalized = normalizeCompanyDoc(company);
      const companyRef = doc(db, "companies", company.id);
      const payload = {
        ...normalized,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(companyRef, payload, { merge: true });

      // Also cache locally
      if (typeof window !== "undefined") {
        localStorage.setItem(`talentflow_company_${company.id}`, JSON.stringify(payload));
        localStorage.setItem("talentflow_active_company_id", company.id);
      }

      return {
        success: true,
        data: payload,
        message: "Company stored in Firestore 'companies' collection successfully",
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      console.warn("Firestore saveCompany error (using local cache fallback):", err);
      const normalized = normalizeCompanyDoc(company);
      if (typeof window !== "undefined") {
        localStorage.setItem(`talentflow_company_${company.id}`, JSON.stringify(normalized));
        localStorage.setItem("talentflow_active_company_id", company.id);
      }
      return {
        success: true,
        data: normalized,
        message: "Company saved locally",
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Fetch single company document from Firestore 'companies' collection
   */
  static async getCompanyFromFirestore(companyId: string): Promise<CompanyDocument | null> {
    try {
      const companyRef = doc(db, "companies", companyId);
      const docSnap = await getDoc(companyRef);
      if (docSnap.exists()) {
        return normalizeCompanyDoc(docSnap.data());
      }
    } catch (err) {
      console.warn("Firestore getCompany error:", err);
    }
    // Check local fallback
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(`talentflow_company_${companyId}`);
      if (cached) {
        try {
          return normalizeCompanyDoc(JSON.parse(cached));
        } catch {
          // Ignore invalid JSON in cache
        }
      }
    }
    return null;
  }

  /**
   * Fetch all companies from Firestore 'companies' collection
   */
  static async getAllCompaniesFromFirestore(): Promise<CompanyDocument[]> {
    try {
      const colRef = collection(db, "companies");
      const snap = await getDocs(colRef);
      const list: CompanyDocument[] = [];
      snap.forEach((docSnap) => {
        list.push(normalizeCompanyDoc(docSnap.data()));
      });
      if (list.length > 0) return list;
    } catch (err) {
      console.warn("Firestore getAllCompanies error:", err);
    }
    return [];
  }

  /**
   * Search and fetch company document by admin work email or UID from Firestore 'companies' collection
   */
  static async getCompanyByEmailOrUid(
    email: string,
    uid?: string,
  ): Promise<CompanyDocument | null> {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const companies = await this.getAllCompaniesFromFirestore();
      const match = companies.find((comp) => {
        const adminEmail = comp.admin?.workEmail?.trim().toLowerCase();
        const adminUid = comp.admin?.uid;
        return (
          (adminEmail && adminEmail === cleanEmail) ||
          (uid && adminUid === uid) ||
          (comp.domain && cleanEmail.endsWith("@" + comp.domain.toLowerCase()))
        );
      });

      if (match) return match;
    } catch (err) {
      console.warn("Firestore getCompanyByEmailOrUid error:", err);
    }

    // Local Storage Search Fallback
    if (typeof window !== "undefined") {
      const activeProf = localStorage.getItem("talentflow_company_profile");
      if (activeProf) {
        try {
          const parsed = JSON.parse(activeProf);
          const parsedEmail = (parsed.admin?.workEmail || parsed.email || "").trim().toLowerCase();
          const parsedUid = parsed.admin?.uid || parsed.uid;
          if ((parsedEmail && parsedEmail === cleanEmail) || (uid && parsedUid === uid)) {
            return parsed;
          }
        } catch {
          // Ignore invalid JSON in localStorage
        }
      }

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("talentflow_company_")) {
          try {
            const item = JSON.parse(localStorage.getItem(key) || "");
            const itemEmail = (item.admin?.workEmail || item.email || "").trim().toLowerCase();
            const itemUid = item.admin?.uid || item.uid;
            if ((itemEmail && itemEmail === cleanEmail) || (uid && itemUid === cleanEmail)) {
              return item;
            }
          } catch {
            // Ignore invalid JSON in localStorage
          }
        }
      }
    }

    return null;
  }

  /**
   * Fetch company document from Firestore 'companies' collection by document ID, subdomain, or company name
   */
  static async getCompanyByNameOrDocId(companyNameOrId: string): Promise<CompanyDocument | null> {
    if (!companyNameOrId) return null;
    const cleanParam = decodeURIComponent(companyNameOrId).trim();
    const cleanLower = cleanParam.toLowerCase();
    const cleanSlug = cleanLower.replace(/[^a-z0-9]/g, "-");
    const cleanAlpha = cleanLower.replace(/[^a-z0-9]/g, "");

    // 1. Try fetching exact document ID from Firestore 'companies' collection
    try {
      const exactDoc = await this.getCompanyFromFirestore(cleanParam);
      if (exactDoc) return exactDoc;
      if (cleanSlug !== cleanParam) {
        const slugDoc = await this.getCompanyFromFirestore(cleanSlug);
        if (slugDoc) return slugDoc;
      }
    } catch {
      // Continue to list search
    }

    // 2. Fetch all companies from Firestore 'companies' collection and match by doc id, subdomain, name, or slug
    try {
      const allCompanies = await this.getAllCompaniesFromFirestore();
      const matched = allCompanies.find((comp) => {
        const cId = (comp.id || "").toLowerCase();
        const cSub = (comp.subdomain || "").toLowerCase();
        const cName = (comp.name || "").toLowerCase();
        const cSlug = cName.replace(/[^a-z0-9]/g, "-");
        const cAlpha = cName.replace(/[^a-z0-9]/g, "");

        return (
          cId === cleanLower ||
          cId === cleanSlug ||
          cSub === cleanLower ||
          cSub === cleanAlpha ||
          cName === cleanLower ||
          cSlug === cleanSlug ||
          cAlpha === cleanAlpha
        );
      });

      if (matched) return matched;
    } catch (err) {
      console.warn("Firestore search error in getCompanyByNameOrDocId:", err);
    }

    // 3. Search local storage cache for company matching document name / ID
    if (typeof window !== "undefined") {
      const activeProf = localStorage.getItem("talentflow_company_profile");
      if (activeProf) {
        try {
          const parsed = JSON.parse(activeProf);
          const pId = (parsed.id || "").toLowerCase();
          const pSub = (parsed.subdomain || "").toLowerCase();
          const pName = (parsed.name || "").toLowerCase();
          const pSlug = pName.replace(/[^a-z0-9]/g, "-");
          if (
            pId === cleanLower ||
            pId === cleanSlug ||
            pSub === cleanLower ||
            pName === cleanLower ||
            pSlug === cleanSlug
          ) {
            return parsed;
          }
        } catch {
          // ignore
        }
      }

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("talentflow_company_")) {
          try {
            const item = JSON.parse(localStorage.getItem(key) || "");
            const iId = (item.id || "").toLowerCase();
            const iSub = (item.subdomain || "").toLowerCase();
            const iName = (item.name || "").toLowerCase();
            const iSlug = iName.replace(/[^a-z0-9]/g, "-");
            if (
              iId === cleanLower ||
              iId === cleanSlug ||
              iSub === cleanLower ||
              iName === cleanLower ||
              iSlug === cleanSlug
            ) {
              return item;
            }
          } catch {
            // ignore
          }
        }
      }
    }

    return null;
  }

  static getSettings(): CompanySettings {
    if (typeof window === "undefined") return defaultCompanySettings;
    const stored = localStorage.getItem(STORAGE_KEY_COMPANY_SETTINGS);
    if (!stored) return defaultCompanySettings;
    try {
      return { ...defaultCompanySettings, ...JSON.parse(stored) };
    } catch {
      // Ignore invalid JSON in localStorage
      return defaultCompanySettings;
    }
  }

  static updateSettings(partialSettings: Partial<CompanySettings>): ApiResponse<CompanySettings> {
    const current = this.getSettings();
    const updated: CompanySettings = {
      ...current,
      ...partialSettings,
      profile: { ...current.profile, ...(partialSettings.profile || {}) },
      hiringDefaults: { ...current.hiringDefaults, ...(partialSettings.hiringDefaults || {}) },
      notifications: { ...current.notifications, ...(partialSettings.notifications || {}) },
      compliance: { ...current.compliance, ...(partialSettings.compliance || {}) },
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_COMPANY_SETTINGS, JSON.stringify(updated));
    }
    return {
      success: true,
      data: updated,
      message: "Company settings saved successfully",
      timestamp: new Date().toISOString(),
    };
  }

  static updateTemplates(templates: EmailTemplate[]): ApiResponse<EmailTemplate[]> {
    const current = this.getSettings();
    const updatedSettings: CompanySettings = { ...current, templates };
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_COMPANY_SETTINGS, JSON.stringify(updatedSettings));
    }
    return {
      success: true,
      data: templates,
      message: "Email templates updated",
      timestamp: new Date().toISOString(),
    };
  }

  static updateAutomations(automations: AutomationRule[]): ApiResponse<AutomationRule[]> {
    const current = this.getSettings();
    const updatedSettings: CompanySettings = { ...current, automations };
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_COMPANY_SETTINGS, JSON.stringify(updatedSettings));
    }
    return {
      success: true,
      data: automations,
      message: "Stage automations updated",
      timestamp: new Date().toISOString(),
    };
  }

  static updateTeam(team: TeamMember[]): ApiResponse<TeamMember[]> {
    const current = this.getSettings();
    const updatedSettings: CompanySettings = { ...current, team };
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_COMPANY_SETTINGS, JSON.stringify(updatedSettings));
    }
    return {
      success: true,
      data: team,
      message: "Team members updated",
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Schedules & dispatches dashboard access emails to all added HR team members & invites
   * after the setup wizard is completely submitted.
   */
  static async scheduleDashboardAccessEmailsCron(
    companySlug: string,
    teamMembers: Array<{ name: string; email: string; role: string }>,
  ): Promise<{
    success: boolean;
    jobId: string;
    dispatchedCount: number;
    recipients: string[];
    message: string;
  }> {
    const jobId = `cron-email-${Date.now()}`;
    const recipients = Array.from(new Set(teamMembers.map((m) => m.email).filter(Boolean)));
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const dashboardUrl = `${origin}/companies/${companySlug}/dashboard`;

    console.log(
      `[Cron Job ${jobId}] Scheduled dashboard access email dispatch for company '${companySlug}' to:`,
      recipients,
    );

    if (typeof window !== "undefined") {
      const existingLogs = JSON.parse(localStorage.getItem("talentflow_email_cron_logs") || "[]");
      existingLogs.push({
        jobId,
        companySlug,
        dashboardUrl,
        recipients,
        timestamp: new Date().toISOString(),
        status: "Completed",
      });
      localStorage.setItem("talentflow_email_cron_logs", JSON.stringify(existingLogs));
    }

    for (const member of teamMembers) {
      if (member.email) {
        await sendMemberCredentialsSmtp({
          member: {
            name: member.name || member.email.split("@")[0],
            email: member.email,
            role: member.role || "Recruiter",
          },
          companyName: companySlug,
          companySlug,
        });
      }
    }

    return {
      success: true,
      jobId,
      dispatchedCount: recipients.length,
      recipients,
      message: `Cron job triggered: Sent dashboard access emails to ${recipients.length} team members via SMTP for /companies/${companySlug}/dashboard`,
    };
  }

  /**
   * Delete company document from Firestore 'companies' collection and purge local storage cache
   */
  static async deleteCompanyFromFirestore(companyIdOrSlug: string): Promise<ApiResponse<null>> {
    if (!companyIdOrSlug) {
      return {
        success: false,
        data: null,
        message: "No company ID specified for deletion",
        timestamp: new Date().toISOString(),
      };
    }

    const cleanDocId = companyIdOrSlug.toLowerCase().replace(/[^a-z0-9]/g, "");

    // 1. Delete from Firestore collection 'companies'
    try {
      const companyRef = doc(db, "companies", cleanDocId);
      await deleteDoc(companyRef);
      if (companyIdOrSlug !== cleanDocId) {
        try {
          await deleteDoc(doc(db, "companies", companyIdOrSlug));
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.warn("Firestore deleteCompany error:", err);
    }

    // 2. Clean up local storage cache to prevent resurrecting deleted documents
    if (typeof window !== "undefined") {
      localStorage.removeItem(`talentflow_company_${cleanDocId}`);
      localStorage.removeItem(`talentflow_company_${companyIdOrSlug}`);

      const activeProf = localStorage.getItem("talentflow_company_profile");
      if (activeProf) {
        try {
          const parsed = JSON.parse(activeProf);
          const pId = (parsed.id || parsed.subdomain || parsed.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
          if (pId === cleanDocId || (parsed.id || "").toLowerCase() === companyIdOrSlug.toLowerCase()) {
            localStorage.removeItem("talentflow_company_profile");
            localStorage.removeItem("talentflow_active_company_id");
          }
        } catch {
          localStorage.removeItem("talentflow_company_profile");
        }
      }

      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith("talentflow_company_")) {
          try {
            const item = JSON.parse(localStorage.getItem(key) || "");
            const itemId = (item.id || item.subdomain || item.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
            if (itemId === cleanDocId || (item.id || "").toLowerCase() === companyIdOrSlug.toLowerCase()) {
              localStorage.removeItem(key);
            }
          } catch {
            // ignore
          }
        }
      }
    }

    return {
      success: true,
      data: null,
      message: `Company '${companyIdOrSlug}' deleted from Firestore and local cache purged`,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Realtime Listener for Firestore 'companies' collection updates & deletions
   */
  static subscribeToAvailableCompanies(
    onUpdate: (companies: CompanyDocument[]) => void,
    onError?: (err: Error) => void,
  ): () => void {
    try {
      const colRef = collection(db, "companies");
      const unsubscribe = onSnapshot(
        colRef,
        (snapshot) => {
          const remoteDocIds = new Set<string>();
          const list: CompanyDocument[] = [];

          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const normalized = normalizeCompanyDoc(data);
            if (normalized.id) {
              list.push(normalized);
              remoteDocIds.add(normalized.id);
            }
          });

          // Purge stale local storage entries for companies that were deleted in Firestore
          if (typeof window !== "undefined") {
            for (let i = localStorage.length - 1; i >= 0; i--) {
              const key = localStorage.key(i);
              if (key && key.startsWith("talentflow_company_")) {
                try {
                  const item = JSON.parse(localStorage.getItem(key) || "");
                  const cleanId = (item.id || item.subdomain || item.name || "")
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "");
                  if (cleanId && !remoteDocIds.has(cleanId)) {
                    localStorage.removeItem(key);
                  }
                } catch {
                  // ignore
                }
              }
            }

            const activeProf = localStorage.getItem("talentflow_company_profile");
            if (activeProf) {
              try {
                const parsed = JSON.parse(activeProf);
                const cleanId = (parsed.id || parsed.subdomain || parsed.name || "")
                  .toLowerCase()
                  .replace(/[^a-z0-9]/g, "");
                if (cleanId && !remoteDocIds.has(cleanId)) {
                  localStorage.removeItem("talentflow_company_profile");
                }
              } catch {
                // ignore
              }
            }
          }

          onUpdate(list);
        },
        (err) => {
          console.warn("Realtime Firestore companies snapshot error:", err);
          if (onError) onError(err);
          // Fallback to one-time query/local cache
          this.getAvailableCompanies().then(onUpdate);
        },
      );

      return unsubscribe;
    } catch (err) {
      console.warn("Failed to subscribe to Firestore companies:", err);
      // Fallback
      this.getAvailableCompanies().then(onUpdate);
      return () => {};
    }
  }

  /**
   * Fetch all companies with candidate portals enabled from database (Firestore 'companies' collection + local cache cleanup)
   */
  static async getAvailableCompanies(): Promise<CompanyDocument[]> {
    const map = new Map<string, CompanyDocument>();
    let firestoreConnected = false;
    const remoteDocIds = new Set<string>();

    // 1. Fetch from Firestore database 'companies' collection
    try {
      const remoteCompanies = await this.getAllCompaniesFromFirestore();
      firestoreConnected = true;
      remoteCompanies.forEach((rc) => {
        const cleanId = (rc.id || rc.subdomain || rc.name).toLowerCase().replace(/[^a-z0-9]/g, "");
        if (cleanId) {
          map.set(cleanId, { ...rc, id: cleanId });
          remoteDocIds.add(cleanId);
        }
      });
    } catch (err) {
      console.warn("Firestore error in getAvailableCompanies:", err);
    }

    // 2. Fetch from local storage (only retain items if not deleted remotely)
    if (typeof window !== "undefined") {
      const activeProf = localStorage.getItem("talentflow_company_profile");
      if (activeProf) {
        try {
          const parsed = JSON.parse(activeProf);
          if (parsed.id || parsed.name) {
            const cleanId = (parsed.id || parsed.subdomain || parsed.name)
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "");
            if (firestoreConnected && remoteDocIds.size > 0 && !remoteDocIds.has(cleanId)) {
              // Deleted in Firestore! Remove from local storage
              localStorage.removeItem("talentflow_company_profile");
              localStorage.removeItem(`talentflow_company_${cleanId}`);
            } else if (!firestoreConnected || !remoteDocIds.size) {
              map.set(cleanId, { ...parsed, id: cleanId });
            }
          }
        } catch {
          // ignore
        }
      }

      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith("talentflow_company_")) {
          try {
            const item = JSON.parse(localStorage.getItem(key) || "");
            if (item && (item.id || item.name)) {
              const cleanId = (item.id || item.subdomain || item.name)
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "");
              if (firestoreConnected && remoteDocIds.size > 0 && !remoteDocIds.has(cleanId)) {
                // Deleted in Firestore! Purge stale local cache
                localStorage.removeItem(key);
              } else if (!firestoreConnected || !remoteDocIds.size) {
                map.set(cleanId, { ...item, id: cleanId });
              }
            }
          } catch {
            // ignore
          }
        }
      }
    }

    return Array.from(map.values());
  }

  /**
   * Register candidate ID & summary into the specific company document in Firestore 'companies' collection
   */
  static async registerCandidateToCompany(
    companyIdOrSlug: string,
    candidate: { id?: string; fullName?: string; email?: string; currentStageId?: string },
  ): Promise<ApiResponse<CompanyDocument>> {
    if (!companyIdOrSlug || !candidate) {
      return {
        success: false,
        data: null as unknown as CompanyDocument,
        message: "Company ID or Candidate payload missing",
        timestamp: new Date().toISOString(),
      };
    }

    try {
      let company = await this.getCompanyByNameOrDocId(companyIdOrSlug);
      const cleanCompId = companyIdOrSlug.toLowerCase().replace(/[^a-z0-9]/g, "");

      if (!company) {
        // If company record is not created yet, initialize shell company doc
        company = {
          id: cleanCompId || `company${Date.now()}`,
          name: companyIdOrSlug,
          subdomain: cleanCompId,
          domain: `${cleanCompId}.com`,
          industry: "Technology",
          size: "51-200 Employees",
          brandColor: "#6366f1",
          headquarters: "Remote",
          admin: { fullName: "Company Admin", workEmail: `admin@${cleanCompId}.com` },
          isCompleted: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      const candId = (candidate.id || candidate.email || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const existingCandidates = (company.registeredCandidates as Array<{
        id: string;
        fullName: string;
        email: string;
        registeredAt: string;
        stage?: string;
      }>) || [];
      const existingIds = (company.candidateIds as string[]) || [];

      const filteredList = existingCandidates.filter(
        (c) => c.id !== candId && c.email?.toLowerCase() !== candidate.email?.toLowerCase(),
      );

      const newSummary = {
        id: candId,
        fullName: candidate.fullName || candidate.email || "Registered Candidate",
        email: candidate.email || "",
        registeredAt: new Date().toISOString(),
        stage: candidate.currentStageId || "application",
      };

      const updatedCandidates = [newSummary, ...filteredList];
      const updatedIds = Array.from(new Set([candId, ...existingIds]));

      const updatedCompany: CompanyDocument = {
        ...company,
        registeredCandidates: updatedCandidates,
        candidateIds: updatedIds,
        updatedAt: new Date().toISOString(),
      };

      await this.saveCompanyToFirestore(updatedCompany);

      return {
        success: true,
        data: updatedCompany,
        message: `Registered candidate ${candId} into company ${company.name} in Firestore 'companies' collection`,
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      console.warn("registerCandidateToCompany error:", err);
      return {
        success: false,
        data: null as unknown as CompanyDocument,
        message: "Failed to register candidate to company",
        timestamp: new Date().toISOString(),
      };
    }
  }
}

