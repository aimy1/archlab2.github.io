// js/auth.js
// Google Sign‑In With Google (Google Identity Services)
// This script is loaded after the GSI SDK script (see layout.tsx).

// Replace with your actual Google OAuth client ID
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

// UI element IDs – ensure they exist in the page.
const LOGIN_BTN_ID = "google-login-btn";
const USER_INFO_ID = "google-user-info";

// Initialize the GSI button after the SDK loads
function initGoogleLogin() {
  // Create a container for the button if not present
  let container = document.getElementById("google-auth-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "google-auth-container";
    container.className = "google-auth-container";
    document.body.appendChild(container);
  }

  // Render the Google button using the GSI library
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
    auto_select: false,
    cancel_on_tap_outside: false,
  });

  google.accounts.id.renderButton(
    container,
    {
      theme: "outline",
      size: "large",
      width: 200,
    }
  );

  // Add a sign‑out button (hidden initially)
  const signOutBtn = document.createElement("button");
  signOutBtn.id = "google-signout-btn";
  signOutBtn.className = "google-signout-btn";
  signOutBtn.textContent = "登出";
  signOutBtn.style.display = "none";
  signOutBtn.onclick = signOut;
  container.appendChild(signOutBtn);
}

// Callback when Google returns an ID token
function handleCredentialResponse(response) {
  const idToken = response.credential;
  // Store token locally (you may want to encrypt / use httpOnly cookies in production)
  localStorage.setItem("google_id_token", idToken);
  // Verify token with backend
  verifyToken(idToken)
    .then(user => {
      // Save user info for UI
      localStorage.setItem("google_user", JSON.stringify(user));
      updateUI(user);
    })
    .catch(err => {
      console.error("Google token verification failed", err);
    });
}

// Call backend API to verify token
async function verifyToken(idToken) {
  const resp = await fetch("/api/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!resp.ok) throw new Error("Token verification failed");
  return await resp.json(); // Expected { email, name, picture }
}

// Update UI after successful login
function updateUI(user) {
  const container = document.getElementById("google-auth-container");
  if (!container) return;
  // Hide login button, show user card + signout
  container.innerHTML = `
    <div class="google-user-card">
      <img src="${user.picture}" alt="avatar" class="google-user-avatar" />
      <div class="google-user-details">
        <span class="google-user-name">${user.name}</span>
        <span class="google-user-email">${user.email}</span>
      </div>
      <button id="google-signout-btn" class="google-signout-btn">登出</button>
    </div>`;
  document.getElementById("google-signout-btn").onclick = signOut;
}

// Sign‑out implementation
function signOut() {
  localStorage.removeItem("google_id_token");
  localStorage.removeItem("google_user");
  // Re‑initialize login UI
  const container = document.getElementById("google-auth-container");
  if (container) container.innerHTML = "";
  initGoogleLogin();
}

// On page load – check login state
window.addEventListener("DOMContentLoaded", () => {
  const storedUser = localStorage.getItem("google_user");
  if (storedUser) {
    updateUI(JSON.parse(storedUser));
  } else {
    initGoogleLogin();
  }
});

// Export for potential module usage (optional)
export { initGoogleLogin, handleCredentialResponse, signOut, verifyToken };
