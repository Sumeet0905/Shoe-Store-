// signup.js
// Located in: Assets/js/

// Firebase Imports
// Path is correctly set for files in the same Assets/js/ folder
import { auth, db } from "./firebase-config.js"; 
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


// --- THEME TOGGLE & UI HANDLERS (INTEGRATED FROM auth.js) ---
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    // Ensure auth-page class is present (as per original auth.js)
    if (!body.classList.contains('auth-page')) body.classList.add('auth-page');

    const toggle = document.getElementById('themeToggle');
    const iconSpan = document.getElementById('themeIcon');

    // Restore theme from localStorage
    const saved = localStorage.getItem('kiks-theme');
    const isDark = saved === 'dark';

    if (isDark) {
        body.classList.add('dark');
        if (iconSpan) iconSpan.textContent = 'dark_mode';
    } else {
        body.classList.remove('dark');
        if (iconSpan) iconSpan.textContent = 'light_mode';
    }

    // Add click listener for theme toggle
    if (toggle) {
        toggle.addEventListener('click', () => {
            body.classList.toggle('dark');
            const isNowDark = body.classList.contains('dark');
            localStorage.setItem('kiks-theme', isNowDark ? 'dark' : 'light');
            if (iconSpan) iconSpan.textContent = isNowDark ? 'dark_mode' : 'light_mode';
        });
    }

    // --- FIREBASE SIGNUP HANDLER (Original signup.js logic) ---
    const signupForm = document.getElementById("signup-form");

    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Collect user input
            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            // 🧩 Step 1: Basic validation
            if (!username) return alert("Please enter a username.");
            if (password !== confirmPassword) return alert("Passwords do not match.");
            if (password.length < 6)
                return alert("Password must be at least 6 characters long.");

            try {
                // 🧩 Step 2: Create user in Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                const user = userCredential.user;

                // 🧩 Step 3: Update Firebase Auth user profile
                await updateProfile(user, { displayName: username });

                // 🧩 Step 4: Store user info in Firestore
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    username,
                    email,
                    createdAt: serverTimestamp(),
                });

                // 🧩 Step 5: Redirect to home once signup completes
                signupForm.reset();
                // Directly send user to homepage after successful signup
                window.location.href = "index.html";
            } catch (error) {
                console.error("Signup error:", error);
                if (error.code === "auth/email-already-in-use") {
                    alert("Email already in use. Please login instead.");
                } else if (error.code === "auth/invalid-email") {
                    alert("Please enter a valid email address.");
                } else {
                    alert(error.message || "Signup failed. Try again.");
                }
            }
        });
    }
    // Removed the demo 'loginForm' handler as it doesn't belong on signup.html
});