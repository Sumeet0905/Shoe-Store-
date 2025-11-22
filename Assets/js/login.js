// login.js
// Located in: Assets/js/

// Firebase Imports
// Path is correctly set to load config file from the same Assets/js/ directory
import { auth } from "./firebase-config.js"; 
import {
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// --- THEME TOGGLE & UI HANDLERS (INTEGRATED FROM auth.js) ---
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    // Ensure auth-page class is present
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

    // --- FIREBASE LOGIN HANDLER ---
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Collect user input
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            try {
                // Sign in user with Firebase Authentication
                await signInWithEmailAndPassword(auth, email, password);

                // Redirect immediately on successful login
                loginForm.reset();
                window.location.href = "index.html"; // Redirect to the main page
            } catch (error) {
                console.error("Login error:", error);
                
                // Handle common Firebase authentication errors
                if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
                    alert("Invalid email or password. Please try again.");
                } else if (error.code === "auth/invalid-email") {
                    alert("Please enter a valid email address.");
                } else {
                    alert(error.message || "Login failed. Try again.");
                }
            }
        });
    }
});