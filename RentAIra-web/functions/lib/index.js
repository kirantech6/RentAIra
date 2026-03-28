"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAgreementPdfFn = exports.generateAgreementPdfOnUpdate = exports.generateAgreementPdfOnCreate = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const pdfkit_1 = __importDefault(require("pdfkit"));
admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();
/**
 * Cloud Function to listen to new agreements with status "draft" and no pdfUrl.
 * Generates a PDF and updates the agreement doc.
 */
exports.generateAgreementPdfOnCreate = functions.firestore
    .document("agreements/{agreementId}")
    .onCreate(async (snap, context) => {
    const data = snap.data();
    if (data.status === "draft" && !data.pdfUrl) {
        await generateAndSavePdf(snap.id, data);
    }
});
/**
 * Triggered on update. Generates PDF if status turns to "draft".
 */
exports.generateAgreementPdfOnUpdate = functions.firestore
    .document("agreements/{agreementId}")
    .onUpdate(async (change, context) => {
    const after = change.after.data();
    // In case the document was just marked draft and missing pdf
    if (after.status === "draft" && !after.pdfUrl && !after.termsSummary) {
        await generateAndSavePdf(change.after.id, after);
    }
});
/**
 * Callable Function to manually trigger PDF Generation for a specific agreement.
 */
exports.generateAgreementPdfFn = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Only authenticated users can call this function.");
    }
    const { agreementId } = data;
    if (!agreementId) {
        throw new functions.https.HttpsError("invalid-argument", "The function must be called with one argument 'agreementId'.");
    }
    const docRef = db.collection("agreements").doc(agreementId);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
        throw new functions.https.HttpsError("not-found", "Agreement not found.");
    }
    const agreementData = docSnap.data();
    if (!agreementData) {
        throw new functions.https.HttpsError("not-found", "Agreement data is empty.");
    }
    // Verify the caller is the landlord
    if (agreementData.landlordId !== context.auth.uid) {
        throw new functions.https.HttpsError("permission-denied", "Only the landlord of this agreement can trigger PDF generation.");
    }
    // Always regenerate if called explicitly via this function
    await generateAndSavePdf(agreementId, agreementData);
    return { success: true, message: "PDF generation started or completed." };
});
async function generateAndSavePdf(agreementId, agreementData) {
    const { propertyId, landlordId, tenantId, monthlyRent, deposit, startDate, endDate } = agreementData;
    // Placeholder for user and property details fetching
    // e.g. await db.collection('users').doc(landlordId).get()
    const docRef = db.collection("agreements").doc(agreementId);
    const file = storage.bucket().file(`agreements/${propertyId}/${agreementId}.pdf`);
    return new Promise((resolve, reject) => {
        const doc = new pdfkit_1.default();
        // Create write stream to Firebase Storage
        const stream = file.createWriteStream({
            metadata: {
                contentType: "application/pdf",
                metadata: {
                    agreementId: agreementId,
                    propertyId: propertyId,
                    landlordId: landlordId,
                    tenantId: tenantId
                }
            }
        });
        doc.pipe(stream);
        // Build the standardized terms summary text
        const termsSummaryText = `
RENTAL AGREEMENT

This agreement is made between Landlord (ID: ${landlordId}) and Tenant (ID: ${tenantId}) for Property (ID: ${propertyId}).

Term: ${startDate ? new Date(startDate.seconds ? startDate.toDate() : startDate).toLocaleDateString() : 'N/A'} to ${endDate ? new Date(endDate.seconds ? endDate.toDate() : endDate).toLocaleDateString() : 'N/A'}
Monthly Rent: ₹${monthlyRent || 0}
Security Deposit: ₹${deposit || 0}

Standard terms apply...
    `;
        doc.fontSize(20).text("Rental Agreement", { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(termsSummaryText);
        doc.end();
        stream.on("finish", async () => {
            // Make the file publicly accessible but we will use signed URLs or Firebase typical access 
            // Actually per rules, we can just save a standard storage GS URL or download URL.
            // Easiest is to save the Firebase Storage reference path or a signed URL
            await file.makePublic(); // NOTE: making it public temporarily to get a simple URL, for high security we can use getSignedUrl
            const publicUrl = `https://storage.googleapis.com/${storage.bucket().name}/${file.name}`;
            await docRef.update({
                termsSummary: termsSummaryText.trim(),
                pdfUrl: publicUrl, // or store the gs:// path and let the client fetch the download URL
                status: agreementData.status // Keep existing or change
            });
            resolve();
        });
        stream.on("error", (err) => {
            console.error("Error creating PDF:", err);
            reject(err);
        });
    });
}
//# sourceMappingURL=index.js.map