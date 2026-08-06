export type StageId =
  | "application"
  | "interview"
  | "offer"
  | "background_check"
  | "hardware_setup"
  | "credentials"
  | "day_one";

export type StageStatus = "completed" | "in_progress" | "pending" | "action_required";

export interface OnboardingStage {
  id: StageId;
  stepNumber: number;
  title: string;
  shortTitle: string;
  description: string;
  category: "Recruitment" | "Legal & Compliance" | "IT Equipment" | "Day 1 Orientation";
  status: StageStatus;
  estimatedTime: string;
  completedAt?: string;
  actionRequiredText?: string;
}

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  roleTitle: string;
  department: string;
  companyName: string;
  companyLogo: string;
  location: string;
  targetStartDate: string;
  currentStageId: StageId;
  recruiter: {
    name: string;
    role: string;
    email: string;
    avatarUrl: string;
    phone: string;
  };
  hiringManager: {
    name: string;
    role: string;
    email: string;
    avatarUrl: string;
  };
}

export interface ApplicationInfo {
  jobId: string;
  jobTitle: string;
  appliedDate: string;
  resumeFileName: string;
  resumeUrl: string;
  coverLetter?: string;
  experienceYears: number;
  portfolioUrl?: string;
  githubUrl?: string;
  statusHistory: Array<{
    status: string;
    date: string;
    note: string;
  }>;
}

export interface InterviewSlot {
  id: string;
  roundName: string;
  interviewerName: string;
  interviewerRole: string;
  interviewerAvatar: string;
  date: string;
  timeSlot: string;
  durationMinutes: number;
  type: "Technical Architecture" | "System Design" | "Culture & Values" | "Hiring Manager Sync";
  meetingUrl: string;
  status: "scheduled" | "completed" | "passed";
  notesForCandidate?: string;
}

export interface OfferDetails {
  offerId: string;
  positionTitle: string;
  department: string;
  baseSalaryYearly: number;
  signOnBonus: number;
  equityShares: number;
  equityVesting: string;
  healthInsurance: string;
  ptoDays: number;
  remoteStipend: number;
  pdfUrl: string;
  status: "pending" | "accepted" | "declined";
  signedAt?: string;
  signedName?: string;
  signatureDataUrl?: string;
}

export interface BackgroundCheck {
  id: string;
  provider: "Checkr Enterprise" | "Trulioo Identity Guard";
  status: "not_started" | "documents_pending" | "submitted" | "clear";
  submittedAt?: string;
  clearedAt?: string;
  documents: Array<{
    id: string;
    name: string;
    type: "Government ID" | "Tax W-4 / I-9" | "Education Certificate" | "Address Proof";
    status: "uploaded" | "verified" | "required";
    uploadedAt?: string;
  }>;
  ssnLast4: string;
  consentAccepted: boolean;
}

export interface LaptopOption {
  id: string;
  brand: "Apple" | "Dell" | "Lenovo";
  name: string;
  specs: string;
  storage: string;
  ram: string;
  chip: string;
  image: string;
  badge?: string;
}

export interface AccessoryOption {
  id: string;
  category: "Display" | "Input" | "Audio" | "Desk";
  name: string;
  description: string;
  image: string;
}

export interface HardwareSelection {
  selectedLaptopId: string;
  selectedAccessories: string[];
  shippingAddress: {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  deliveryInstructions?: string;
  carrier: "FedEx Express" | "UPS Next Day" | "DHL Worldwide";
  trackingNumber?: string;
  shipmentStatus:
    "not_ordered" | "order_placed" | "provisioning" | "shipped" | "out_for_delivery" | "delivered";
  estimatedDeliveryDate: string;
  itSetupCompleted: boolean;
  unboxingNotes: string[];
}

export interface SystemCredentials {
  corporateEmail: string;
  ssoUsername: string;
  slackInviteSent: boolean;
  googleWorkspaceActive: boolean;
  oktaProvisioned: boolean;
  twoFactorSetupCompleted: boolean;
  passwordCreated: boolean;
  temporaryPasswordExpiry: string;
}

export interface DayOneTask {
  id: string;
  title: string;
  category: "Orientation" | "HR Forms" | "IT Config" | "Team Introduction" | "Legal & Compliance";
  duration: string;
  completed: boolean;
}

export interface DayOneReadiness {
  buddy: {
    name: string;
    role: string;
    email: string;
    avatarUrl: string;
    slackHandle: string;
    welcomeNote: string;
  };
  firstDaySchedule: Array<{
    id: string;
    time: string;
    title: string;
    hostName: string;
    hostRole: string;
    meetingType: "Virtual Zoom" | "Google Meet" | "Calendar Block";
  }>;
  checklist: DayOneTask[];
  welcomeVideoUrl?: string;
}

export interface CandidatePortalState {
  candidate: CandidateProfile;
  stages: OnboardingStage[];
  application: ApplicationInfo;
  interviews: InterviewSlot[];
  offer: OfferDetails;
  backgroundCheck: BackgroundCheck;
  hardware: HardwareSelection;
  credentials: SystemCredentials;
  dayOne: DayOneReadiness;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    stageId: StageId;
  }>;
}
