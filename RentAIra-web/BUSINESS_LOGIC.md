# RentAIra — Business Logic & App Flow Reference

> This document explains the intended user journeys, how all core scores are computed, and where each score surfaces in the UI. It is the authoritative reference for product, engineering, and testing.

---

## 1. Tenant Journey

```
Sign Up (role = tenant)
    ↓ auto-redirect →
/tenant/profile  — complete Basic Info, Rental Preferences, Lifestyle
    ↓ profile ≥ 80% completion →
/tenant/properties  — discover properties sorted by Match Score
    ↓ click "Apply Now" (normal or Priority ₹500) →
Application submitted  →  isPriority stored, applicationFee stored
    ↓ landlord accepts →
Agreement created  →  platformFeePercent = 1, platformFeeAmount = rent × 0.01
    ↓
/tenant/dashboard  — manage agreement, rent status (MVP), and maintenance tickets
```

### Tenant Onboarding Rules
| Check | Behaviour |
|---|---|
| `profileCompletionPercent < 80` | Profile summary card shows amber CTA "Complete Profile" on dashboard |
| `preferredCities` empty OR `budgetMin/Max` = 0 | Apply button is blocked on `/tenant/properties` with a red banner |
| Profile complete ≥ 80% | Green profile card; `+5` bonus added to every Match Score |

---

## 2. Landlord Journey

```
Sign Up (role = landlord)
    ↓ auto-redirect →
/landlord/profile  — complete Basic Info, KYC, Policies
    ↓
/landlord/properties  — create and manage property listings
    ↓
/landlord/dashboard  — view applications (ranked by Priority + Trust Score)
    ↓ click "Accept" →
Application status → "accepted"
Agreement created  →  platformFeePercent = 1, platformFeeAmount = rent × 0.01
platformRevenues doc also logged for modeling
    ↓
Manage tenants, agreements, maintenance tickets
```

### Agreement Fields (always set on accept)
| Field | Value |
|---|---|
| `monthlyRent` | `property.rent` |
| `deposit` | `property.deposit` |
| `startDate` | today |
| `endDate` | today + 1 year |
| `platformFeePercent` | `1` (always exactly 1) |
| `platformFeeAmount` | `Math.round(monthlyRent * 0.01)` |
| `status` | `"draft"` (until PDF generated) |

---

## 3. Match Score  (`calculateMatchScore`)

**File:** `src/utils/businessLogic.ts`  
**Returns:** `0–100` integer  
**Purpose:** Ranks properties for a tenant based on profile compatibility.

### Scoring Breakdown
| Signal | Max pts |
|---|---|
| Budget fit (rent within `budgetMin`–`budgetMax`) | 30 |
| Preferred city match | 20 |
| BHK range fit | 15 |
| Furnishing preference match | 10 |
| Lifestyle alignment bonuses (bachelor/non-veg/pets welcome) | +5 |
| Property is verified | +5 |
| `profileCompletionPercent ≥ 80` | +5 |

### Hard-Conflict Ceiling Clamps  *(override all scoring)*
| Conflict | Score capped at |
|---|---|
| Tenant `isBachelor = true` + property/landlord disallows bachelors | **30** |
| Tenant `hasPets = true` + pets not allowed | **30** |
| Tenant `foodPreference = "veg_non_veg"` + non-veg not allowed | **40** |

### Where it appears
- `/tenant/dashboard` → "Recommended for You" cards  
- `/tenant/properties` → Every PropertyCard, with colour-coded badge (green ≥70, yellow ≥45, red <45)  
- `/landlord/dashboard` → Applications list (Match Score column — planned)

---

## 4. Match Explanation  (`explainMatchScore`)

**Returns:** `string[]` — 2–4 human-readable bullets  

Examples:
- `"✅ Within your budget range"`
- `"⚠️ Bachelors not allowed by landlord"`
- `"✅ Matches your BHK preference"`
- `"ℹ️ 3 BHK (you prefer 1–2)"`

**Where it appears:** The **"Why this match?"** collapsible panel on every `PropertyCard` in tenant view.

---

## 5. Tenant Trust Score  (`computeTenantTrustScore`)

**Returns:** `0–100` integer  
**Purpose:** Helps landlords quickly gauge a tenant's reliability before accepting.

### Computation
| Signal | Points |
|---|---|
| Base = `profileCompletionPercent` | 0–100 |
| `yearsRenting ≥ 2` | +10 |
| `hasReferences = true` | +5 |
| `employmentVerified = true` | +5 |
| **Maximum** | 100 |

### Labels  (`getTenantTrustLabel`)
| Score | Label | Badge colour |
|---|---|---|
| ≥ 80 | **High** | 🟢 Green |
| 50–79 | **Medium** | 🟡 Amber |
| < 50 | **Low** | 🔴 Red |

**Where it appears:** `/landlord/dashboard` → Pending Applications list, next to each tenant's name.  
*This is informational only and does not change permissions or Firestore rules.*

---

## 6. Property Risk Level  (`computeRiskLevel`)

**Returns:** `"low" | "medium" | "high"`  
**Purpose:** Flags potentially exploitative deposits or unverified listings.

### Computation
| Condition | Risk |
|---|---|
| `reportsCount > 0` OR `deposit/rent > 5` | **High** |
| Property not verified AND `deposit/rent > 3` | **Medium** |
| Otherwise | **Low** |

**Where it appears:** Risk badge on every `PropertyCard` (top-left corner), both in tenant and landlord views.

---

## 7. Priority Applications & Platform Fee  *(MVP modeling — no real payments)*

### Priority Application (Tenant opt-in)
- Checkbox in `PropertyCard` when applying: **"Priority Application (₹500 fee)"**
- Stored fields on the `applications` document:
  - `isPriority: true`
  - `applicationFee: 500`  (0 for normal applications)
- Priority applications are **sorted to the top** of the landlord's pending list
- Highlighted with a purple `⭐ Priority` badge

### Platform Fee (on agreement creation)
- Calculated server-side (client-side MVP) on landlord accepting an application
- Stored fields on `agreements` document:
  - `platformFeePercent: 1`  *(always exactly 1)*
  - `platformFeeAmount: Math.round(monthlyRent * 0.01)`
- A separate `platformRevenues` document is also created for tracking
- Displayed in `AgreementCard`: **"Platform Fee (1%): ₹X"**
- Aggregated on `/landlord/dashboard` as **"Platform Fees (Model)"** stat card

> ⚠️ **Important:** Neither the ₹500 priority fee nor the 1% platform fee are connected to a real payment gateway. They are stored for revenue model validation only.

---

## 8. Pure Function Guarantee

All business logic functions are **pure** — they take plain data objects and return computed values. They do **not**:
- Make Firestore calls
- Trigger navigation or UI changes
- Have side effects

This makes them trivially testable and safe to call anywhere in the app.

```typescript
// All exported from src/utils/businessLogic.ts:
calculateMatchScore(user: User, property: Property): number
explainMatchScore(user: User, property: Property): string[]
computeTenantTrustScore(user: Partial<User>): number
getTenantTrustLabel(score: number): "Low" | "Medium" | "High"
computeRiskLevel(property: Property, reportsCount?: number): RiskLevel
computeTenantProfileCompletion(user: Partial<User>): number
computeLandlordProfileCompletion(user: Partial<User>): number
getFairRentRange(prices: number[]): { min, max, avg }
```
