// firebase-config.js
// Located in: Assets/js/

// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Your Firebase configuration (Ensure your actual keys are here)
const firebaseConfig = {
  apiKey: "AIzaSyByIwkUygaxysfueK5GbXVQsX0uVDUis-s",
  authDomain: "shoe-store-72335.firebaseapp.com",
  projectId: "shoe-store-72335",
  storageBucket: "shoe-store-72335.appspot.com",
  messagingSenderId: "1061141119620",
  appId: "1:1061141119620:web:f9078d3d29421acb1538d1",
  measurementId: "G-QGYLGVSQEK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app); // Exports the Authentication service
export const db = getFirestore(app); // Exports the Firestore service