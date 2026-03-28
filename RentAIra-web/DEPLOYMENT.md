# RentAIra System Deployment & Setup

This document explains how to set up the robust infrastructure for **RentAIra**.

## 1. Firebase Setup (Backend)

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable these services in the console:
   - **Authentication**: Enable `Email/Password` and `Google Sign-in`.
   - **Firestore Database**: Create database in production mode. Apply the `firestore.rules` file found in the source directory.
   - **Storage**: Set up Firebase Storage. Apply the `storage.rules` file found in the source directory.
   - **Functions**: Upgrade to "Blaze" plan to deploy Node.js Cloud Functions if using PDF Generation.
3. Configure the app IDs: Register a Web App and, if needed, iOS/Android apps in Firebase project settings.

## 2. Deploying Cloud Functions (Agreement Generation)

We use Firebase Cloud Functions to generate rental agreement PDFs.

1. Navigate to the `functions` directory:
   ```bash
   cd RentAIra-web/functions
   npm install
   ```
2. Deploy the functions to your Firebase project:
   ```bash
   firebase deploy --only functions
   ```
3. To test the agreement generation from the web app:
   - Make sure you are logged in as a landlord.
   - Navigate to the Landlord Dashboard and select an application to approve, or create a new agreement with `status: "draft"`.
   - The `generateAgreementPdfOnCreate` or `generateAgreementPdfOnUpdate` function will trigger automatically.
   - Alternatively, you can wire a button to call the `generateAgreementPdfFn` HTTPS callable function with the `agreementId`. For example:
     ```javascript
     import { getFunctions, httpsCallable } from "firebase/functions";
     const functions = getFunctions();
     const generatePdf = httpsCallable(functions, 'generateAgreementPdfFn');
     await generatePdf({ agreementId: "YOUR_AGREEMENT_ID" });
     ```

## 3. Setting Up the Web App (`RentAIra-web`)

The web app is a React application built with Vite and Tailwind. It operates securely with Role-Based Routing.

### Key Routes Added
- **Tenant Dashboard** (`/tenant/dashboard`): AI Recommendations, Applications Status, Active Agreement, & Maintenance Tickets. 
- **Tenant Properties Filter** (`/tenant/properties`): Property discovery matching against preferences with integrated Risk scoring.
- **Landlord Dashboard** (`/landlord/dashboard`): Key stats, Application accepting/rejecting, and Agreement PDF triggers.
- **Landlord Properties Manager** (`/landlord/properties`): CRUD Properties interface complete with Fair Rent insights.
- **Landlord Tickets** (`/landlord/tickets`): Property Maintenance tracking.

### Installation
```bash
cd RentAIra-web
npm install
```

### Configuration
Create a `.env` file based on your Firebase configuration object:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Running Locally
```bash
npm run dev
```

### Deployment to Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

## 3. Setting Up the Mobile App (`RentAIra-mobile`)

We use Expo for React Native.

### Initialization & Run
If you haven't generated the mobile app yet, you can do so by running `npx create-expo-app RentAIra-mobile -t expo-template-blank-typescript` in the parent directory.

```bash
cd RentAIra-mobile
npm install
npx expo start
```
Use the **Expo Go** app on your iOS or Android device to scan the QR code to run locally.

### Configuration
Create a `.env` file in the Expo project folder mirroring your Firebase setup:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

*Note: The Expo app depends on `firebase` js SDK for MVP, connecting securely over HTTPS using the exact same backend as the web client.*

## 4. Pricing Model (Test-Only)

This application includes a preliminary pricing model structure to simulate platform revenue and feature monetization:

- **Priority Applications**: Tenants can opt to mark their applications as "Priority" for a ₹500 fee. This currently does not integrate with a real payment gateway. It simply logs `isPriority: true` and `applicationFee: 500` to Firestore for UX and modeling purposes. These priority applications are automatically highlighted and sorted to the top of the landlord's pending applications list.
- **Success-Based Platform Fees**: When a landlord accepts a tenant's application and generates a new rental agreement, the system automatically computes a 1% platform fee based on the first month's rent. The agreement document includes `platformFeePercent` of 1 and a computed `platformFeeAmount` to simulate the platform revenue model. Total theoretical fees are displayed on the landlord's dashboard.

## Security, Architecture, & Firestore Indices Notes
- We rely heavily on **Firestore rules** and **Storage rules** to validate permissions. Check `firestore.rules` and `storage.rules` to ensure they are up to date!
- AI implementations for "Fair Match Score" and "Fair Rent Range" operate identically across both platforms by utilizing the typescript `src/utils/businessLogic.ts` file.

## 5. Profiles & Matching

### Tenant Profile Fields (used for recommendations)
| Field | Purpose |
|---|---|
| `currentCity`, `preferredCities` | Location matching |
| `budgetMin`, `budgetMax` | Budget window check |
| `desiredBhkMin`, `desiredBhkMax` | BHK range rewards |
| `desiredFurnishing` | Furnishing type bonus |
| `isBachelor`, `foodPreference`, `hasPets` | Lifestyle constraint penalties |
| `occupation`, `ageRange`, `guestPolicyPreference` | Stored for landlord context |

### Landlord Policy Fields (stored on users collection)
| Field | Purpose |
|---|---|
| `ruleAllowBachelors`, `ruleAllowNonVeg`, `ruleAllowPets` | Directly used in match penalty logic |
| `typicalTenantType` | Helps tenants understand suitability |
| `preferredLeaseDurationMonths` | Validation: must be > 0 |
| `defaultRentDueDay` | Validation: 1–28 |
| `primaryCity`, `operatingCities` | Portfolio geography |
| `panMasked`, `aadhaarLast4`, `ownershipDocsUploaded` | KYC status markers (masked for security) |

### Profile Completeness & Match Score
- **`profileCompletionPercent`** is computed client-side on save and stored to Firestore (0–100). Tenants with < 80% see a "Complete Profile" CTA on their dashboard.
- `calculateMatchScore` returns 0–100. Scoring breakdown:
  | Signal | Max pts |
  |---|---|
  | Budget fit | 30 |
  | Preferred city | 20 |
  | BHK range | 15 |
  | Furnishing match | 10 |
  | Lifestyle alignment bonuses | +5 |
  | Verified property | +5 |
  | Profile completeness ≥ 80% | +5 |
- **Hard-conflict ceiling clamps** — these override everything else:
  - Tenant is bachelor + landlord disallows bachelors → max score **30**
  - Tenant has pets + pets disallowed → max score **30**
  - Tenant eats non-veg + non-veg disallowed → max score **40**
- `explainMatchScore(user, property)` returns 2–4 human-readable bullets shown in the "Why this match?" collapsible panel on `PropertyCard`.

### Tenant Trust Score
`computeTenantTrustScore(user)` returns 0–100:
| Signal | Pts |
|---|---|
| Base = `profileCompletionPercent` | 0–100 |
| `yearsRenting` ≥ 2 | +10 |
| `hasReferences == true` | +5 |
| `employmentVerified == true` | +5 |
| Maximum | 100 |

`getTenantTrustLabel(score)` → **Low** (< 50) / **Medium** (50–79) / **High** (≥ 80).
Displayed with colour badges (red / amber / green) in the landlord's pending-applications list. This is informational only and does not alter permissions or Firestore rules.


### Required Firestore Compound Indexes
To ensure the multi-field queries run properly (such as searching for applications or calculating fair rent), Firebase requires building standard composite indexes. They are defined inside `firestore.indexes.json`.

To deploy them to your project via the CLI, simply run:
```bash
firebase deploy --only firestore:indexes
```

**How to confirm they are active:**
1. Navigate to the **Firestore Database** section in your Firebase Console.
2. Select the **Indexes** tab (next to Data and Rules).
3. Look under "Composite" indexes to verify they have fully built (it may take a few minutes for their status to change from "Building").

## UI & Styling Requirements (Tailwind CSS)
This application employs a modern, cohesive UI utilizing **Tailwind CSS**. 
Because it uses Vite, all Tailwind build processes are handled seamlessly via PostCSS under the hood `npx run dev` and `npx run build`.

- **Shared Components Design**: Reusable items like `PropertyCard` and `AgreementCard` are uniformly integrated using Tailwind’s utility classes ensuring consistent spacing, hover states, empty states, and standard breakpoints (`md:`, `lg:`). Loader states are provided globally to prevent broken UI during async Firebase calls.
