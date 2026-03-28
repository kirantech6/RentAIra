import { User, Property, RiskLevel } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// MATCH SCORE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * calculateMatchScore
 * Scores a property from 0–100. Hard lifestyle conflicts clamp the ceiling.
 * Missing profile fields default to neutral (no penalty, no reward).
 */
export function calculateMatchScore(user: User, property: Property): number {
  // ── Hard-conflict ceiling clamps ─────────────────────────────────────────
  // Applied BEFORE scoring so the cap holds even if other signals are strong.
  let ceiling = 100;
  if (user.isBachelor === true && property.allowBachelors === false) ceiling = Math.min(ceiling, 30);
  if (user.hasPets === true && property.allowPets === false) ceiling = Math.min(ceiling, 30);
  if (user.foodPreference === "veg_non_veg" && property.allowNonVeg === false) ceiling = Math.min(ceiling, 40);

  let score = 0;

  // ── 1. Budget Fit (30 pts) ───────────────────────────────────────────────
  const budgetMin = user.budgetMin ?? 0;
  const budgetMax = user.budgetMax ?? Infinity;
  if (property.rent >= budgetMin && property.rent <= budgetMax) {
    score += 30;
  } else if (property.rent < budgetMin) {
    score += 15; // cheaper than expected is still acceptable
  } else {
    const overage = property.rent - budgetMax;
    if (overage <= budgetMax * 0.2) score += 10; // ≤20% over budget
  }

  // ── 2. City Fit (20 pts) ─────────────────────────────────────────────────
  const cities = (user.preferredCities ?? []).map((c) => c.toLowerCase());
  if (cities.length > 0 && cities.includes(property.city.toLowerCase())) {
    score += 20;
  }

  // ── 3. BHK Fit (15 pts) ──────────────────────────────────────────────────
  if (user.desiredBhkMin !== undefined && user.desiredBhkMax !== undefined) {
    if (property.bhk >= user.desiredBhkMin && property.bhk <= user.desiredBhkMax) {
      score += 15;
    } else if (Math.abs(property.bhk - user.desiredBhkMin) <= 1) {
      score += 7; // close to desired range
    }
  }

  // ── 4. Furnishing Match (10 pts) ─────────────────────────────────────────
  const desiredFurnishing = user.desiredFurnishing ?? "any";
  if (desiredFurnishing !== "any" && property.furnishing === desiredFurnishing) {
    score += 10;
  } else if (desiredFurnishing === "any") {
    score += 5; // neutral
  }

  // ── 5. Lifestyle Alignment Bonuses (up to +5) ────────────────────────────
  // (Only rewards when there's actually a match — no penalty here since ceiling already handles conflicts)
  if (property.allowBachelors && user.isBachelor) score += 2;
  if (property.allowNonVeg && user.foodPreference === "veg_non_veg") score += 2;
  if (property.allowPets && user.hasPets) score += 1;

  // ── 6. Verified property bonus (5 pts) ───────────────────────────────────
  if (property.isVerified) score += 5;

  // ── 7. Profile completeness bonus (+5 if ≥80%) ───────────────────────────
  const pct = user.profileCompletionPercent ?? computeTenantProfileCompletion(user);
  if (pct >= 80) score += 5;

  return Math.min(Math.max(Math.round(score), 0), ceiling);
}

/**
 * explainMatchScore
 * Returns 2–4 human-readable bullet points explaining the match result.
 * Used in the "Why this match?" tooltip on PropertyCard.
 */
export function explainMatchScore(user: User, property: Property): string[] {
  const reasons: string[] = [];

  // Hard conflicts — always show if present
  if (user.isBachelor === true && property.allowBachelors === false) {
    reasons.push("⚠️ Bachelors not allowed by landlord");
  }
  if (user.hasPets === true && property.allowPets === false) {
    reasons.push("⚠️ Pets not allowed in this property");
  }
  if (user.foodPreference === "veg_non_veg" && property.allowNonVeg === false) {
    reasons.push("⚠️ Non-veg food not permitted here");
  }

  // Positive signals
  const budgetMin = user.budgetMin ?? 0;
  const budgetMax = user.budgetMax ?? Infinity;
  if (property.rent >= budgetMin && property.rent <= budgetMax) {
    reasons.push("✅ Within your budget range");
  } else if (property.rent > budgetMax) {
    reasons.push("⚠️ Slightly over your budget");
  }

  const cities = (user.preferredCities ?? []).map((c) => c.toLowerCase());
  if (cities.length > 0 && cities.includes(property.city.toLowerCase())) {
    reasons.push("✅ In one of your preferred cities");
  }

  if (user.desiredBhkMin !== undefined && user.desiredBhkMax !== undefined) {
    if (property.bhk >= user.desiredBhkMin && property.bhk <= user.desiredBhkMax) {
      reasons.push("✅ Matches your BHK preference");
    } else {
      reasons.push(`ℹ️ ${property.bhk} BHK (you prefer ${user.desiredBhkMin}–${user.desiredBhkMax})`);
    }
  }

  const desiredFurnishing = user.desiredFurnishing ?? "any";
  if (desiredFurnishing !== "any" && property.furnishing === desiredFurnishing) {
    reasons.push("✅ Furnishing matches your preference");
  }

  if (property.isVerified) reasons.push("✅ Verified property");

  // Return at most 4 bullets (prioritise warnings first, which are already at top)
  return reasons.slice(0, 4);
}

// ─────────────────────────────────────────────────────────────────────────────
// TRUST SCORE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * computeTenantTrustScore
 * Returns 0–100 based on profile completeness + rental history signals.
 */
export function computeTenantTrustScore(user: Partial<User>): number {
  const base = user.profileCompletionPercent ?? computeTenantProfileCompletion(user);
  let bonus = 0;
  if ((user.yearsRenting ?? 0) >= 2) bonus += 10;
  if (user.hasReferences === true) bonus += 5;
  if (user.employmentVerified === true) bonus += 5;
  return Math.min(base + bonus, 100);
}

/**
 * getTenantTrustLabel
 * Bucketed label for display in landlord-facing UI.
 */
export function getTenantTrustLabel(score: number): "Low" | "Medium" | "High" {
  if (score >= 80) return "High";
  if (score >= 50) return "Medium";
  return "Low";
}

// ─────────────────────────────────────────────────────────────────────────────
// RISK / RENT HELPERS (unchanged)
// ─────────────────────────────────────────────────────────────────────────────

export function computeRiskLevel(property: Property, reportsCount: number = 0): RiskLevel {
  const depositRatio = property.rent > 0 ? property.deposit / property.rent : 0;
  if (reportsCount > 0 || depositRatio > 5) return "high";
  if (!property.isVerified && depositRatio > 3) return "medium";
  return "low";
}

export function getFairRentRange(similarRentPrices: number[]): { min: number; max: number; avg: number } {
  if (!similarRentPrices || similarRentPrices.length === 0) return { min: 0, max: 0, avg: 0 };
  const min = Math.min(...similarRentPrices);
  const max = Math.max(...similarRentPrices);
  const avg = Math.round(similarRentPrices.reduce((a, b) => a + b, 0) / similarRentPrices.length);
  return { min, max, avg };
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE COMPLETION HELPERS (unchanged)
// ─────────────────────────────────────────────────────────────────────────────

export function computeTenantProfileCompletion(user: Partial<User>): number {
  const fields: (keyof User)[] = [
    "name", "phone", "currentCity", "occupation",
    "budgetMin", "budgetMax", "preferredCities",
    "desiredBhkMin", "desiredBhkMax", "desiredFurnishing",
    "isBachelor", "foodPreference", "hasPets",
  ];
  const filled = fields.filter((f) => {
    const v = user[f];
    if (v === undefined || v === null || v === "") return false;
    if (Array.isArray(v) && v.length === 0) return false;
    return true;
  }).length;
  return Math.round((filled / fields.length) * 100);
}

export function computeLandlordProfileCompletion(user: Partial<User>): number {
  const fields: (keyof User)[] = [
    "name", "phone", "primaryCity", "operatingCities",
    "typicalTenantType", "ruleAllowBachelors", "ruleAllowNonVeg", "ruleAllowPets",
    "preferredLeaseDurationMonths", "defaultRentDueDay", "panMasked",
  ];
  const filled = fields.filter((f) => {
    const v = user[f];
    if (v === undefined || v === null || v === "") return false;
    if (Array.isArray(v) && v.length === 0) return false;
    return true;
  }).length;
  return Math.round((filled / fields.length) * 100);
}
