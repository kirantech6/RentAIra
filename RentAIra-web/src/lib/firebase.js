// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDLo5gtYvDsBXzhx8_HJFZ23xO3xSx7xNU",
    authDomain: "rentaira-a07bf.firebaseapp.com",
    projectId: "rentaira-a07bf",
    storageBucket: "rentaira-a07bf.firebasestorage.app",
    messagingSenderId: "905222131352",
    appId: "1:905222131352:web:e2ff9eafb7497423428aed",
    measurementId: "G-9VMRBJPRJ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
