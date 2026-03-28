export type Role = "tenant" | "landlord" | "admin";

export interface User {
  id?: string;
  role: Role;
  name: string;
  email: string;
  phone: string;
  // Common
  kycStatus: "not_submitted" | "pending" | "verified" | "rejected";
  isVerified: boolean;
  profileCompletionPercent?: number;
  lastProfileUpdatedAt?: Date | any;

  // ── Tenant-specific ──────────────────────────────────────────────
  preferredCities?: string[];
  budgetMin?: number;
  budgetMax?: number;
  currentCity?: string;
  ageRange?: string; // e.g. "18-24", "25-34"
  desiredBhkMin?: number;
  desiredBhkMax?: number;
  desiredFurnishing?: "unfurnished" | "semi_furnished" | "fully_furnished" | "any";
  moveInDatePreference?: string; // "flexible" or date string
  occupation?: "student" | "working_professional" | "self_employed" | "other";
  isBachelor?: boolean;
  foodPreference?: "veg_only" | "veg_non_veg";
  hasPets?: boolean;
  smokes?: boolean;
  guestPolicyPreference?: "open" | "limited" | "strict";
  yearsRenting?: number;
  lastRentedCity?: string;
  hasReferences?: boolean;
  employmentVerified?: boolean;

  // ── Landlord-specific ─────────────────────────────────────────────
  businessName?: string;
  primaryCity?: string;
  operatingCities?: string[];
  panMasked?: string;
  aadhaarLast4?: string;
  ownershipDocsUploaded?: boolean;
  kycDocuments?: string[];
  typicalTenantType?: "families" | "students" | "working_professionals" | "mixed";
  ruleAllowBachelors?: boolean;
  ruleAllowNonVeg?: boolean;
  ruleAllowPets?: boolean;
  preferredLeaseDurationMonths?: number;
  defaultRentDueDay?: number; // 1–28
}

export type RiskLevel = "low" | "medium" | "high";

export interface Property {
  id?: string;
  landlordId: string;
  title: string;
  description: string;
  city: string;
  locality: string;
  pincode: string;
  bhk: number;
  rent: number;
  deposit: number;
  furnishing: "unfurnished" | "semi_furnished" | "fully_furnished";
  amenities: string[];
  allowBachelors: boolean;
  allowNonVeg: boolean;
  allowPets: boolean;
  isActive: boolean;
  isVerified: boolean;
  riskLevel: RiskLevel;
  createdAt: Date | any;
}

export interface Application {
  id?: string;
  propertyId: string;
  tenantId: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  isPriority?: boolean;
  applicationFee?: number;
  createdAt: Date | any;
}

export interface Agreement {
  id?: string;
  propertyId: string;
  landlordId: string;
  tenantId: string;
  startDate: Date | any;
  endDate: Date | any;
  monthlyRent: number;
  deposit: number;
  termsSummary: string;
  pdfUrl: string;
  status: "draft" | "active" | "terminated";
  platformFeePercent?: number;
  platformFeeAmount?: number;
  createdAt: Date | any;
}

export interface Ticket {
  id?: string;
  propertyId: string;
  tenantId: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "closed";
  createdAt: Date | any;
  updatedAt: Date | any;
}

export interface Payment {
  id?: string;
  propertyId: string;
  tenantId: string;
  month: number;
  year: number;
  amount: number;
  sharePercent: number;
  status: "pending" | "paid" | "overdue";
  createdAt: Date | any;
}

export interface Report {
  id?: string;
  propertyId: string;
  reportedByUserId: string;
  reason: string;
  details: string;
  createdAt: Date | any;
}
