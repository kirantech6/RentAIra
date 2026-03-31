require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const PDFDocument = require('pdfkit');

// Initialize Firebase Admin (Requires process.env.FIREBASE_SERVICE_ACCOUNT_KEY JSON string set in Render)
if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
      storageBucket: 'rentaira-a07bf.firebasestorage.app'
    });
  } else {
    console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_KEY is missing. Firebase Admin will not connect properly.');
    // Fallback for local testing without key
    // admin.initializeApp();
  }
}

const db = admin.apps.length ? admin.firestore() : null;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
  res.send('RentAIra Backend Engine is running securely on Render!');
});

// Example PDF Generation Route (Migrated from Firebase Functions)
app.post('/api/generate-agreement-pdf', async (req, res) => {
  try {
    const { agreementId, landlordId, tenantId, propertyId, monthlyRent, deposit } = req.body;
    
    if (!agreementId) return res.status(400).json({ error: 'Missing agreementId' });
    
    // Basic PDF Generation Implementation using pdfkit
    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      let pdfData = Buffer.concat(buffers);
      // Normally, here you upload `pdfData` to Firebase Storage
      res.status(200).json({ success: true, message: 'PDF logic executed.', mockPdfSize: pdfData.length });
    });

    doc.fontSize(20).text('Rental Agreement', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`This agreement is between Landlord (${landlordId}) and Tenant (${tenantId}) for Property (${propertyId}).\n\nMonthly Rent: ₹${monthlyRent}\nDeposit: ₹${deposit}`);
    doc.end();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening reliably on port ${PORT}`);
});
