// public/js/auth.js
const GOOGLE_CLIENT_ID = "327542881890-ale1t4ni01jl2c9mgfe00gtr7f4rvc3a.apps.googleusercontent.com";

function initGoogleLogin() {
  console.log("[Auth] Initializing Google Login...");
  const container = document.getElementById("google-auth-container");
  if (!container) {
    console.warn("[Auth] Container #google-auth-container not found.");
    return;
  }

  if (typeof google === 'undefined' || !google.accounts) {
    console.log("[Auth] Google SDK not loaded yet, retrying in 500ms...");
    setTimeout(initGoogleLogin, 500);
    return;
  }

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
    auto_select: false,
    cancel_on_tap_outside: false,
  });

  google.accounts.id.renderButton(container, {
    theme: "outline",
    size: "medium",
    shape: "pill",
    text: "signin_with",
  });
  
  console.log("[Auth] Google Button rendered.");
}

function handleCredentialResponse(response) {
  console.log("[Auth] Credential received.");
  const idToken = response.credential;
  localStorage.setItem("google_id_token", idToken);
  
  // 尝试后端验证
  verifyToken(idToken)
    .then(user => {
      console.log("[Auth] Backend verification success:", user);
      localStorage.setItem("google_user", JSON.stringify(user));
      updateUI(user);
    })
    .catch(err => {
      console.warn("[Auth] Backend verify failed, falling back to local decode. (Normal for static sites like GitHub Pages)");
      // 静态环境降级：本地解码 JWT (注意：这仅用于 UI 展示，不应用于安全性敏感操作)
      try {
        const base64Url = idToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        const user = {
          name: payload.name,
          email: payload.email,
          picture: payload.picture
        };
        localStorage.setItem("google_user", JSON.stringify(user));
        updateUI(user);
      } catch (e) {
        console.error("[Auth] Local decode failed:", e);
      }
    });
}

async function verifyToken(idToken) {
  const resp = await fetch("/api/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!resp.ok) throw new Error("Backend verification failed");
  return await resp.json();
}

function updateUI(user) {
  const container = document.getElementById("google-auth-container");
  if (!container) return;
    const basePath = window.location.pathname.includes('/archlab2.github.io/') ? '/archlab2.github.io' : '';
    const profileUrl = `${basePath}/profile/`;
    
    container.innerHTML = `
    <div class="google-user-card">
      <a href="${profileUrl}" class="google-user-link">
        <img src="${user.picture}" alt="avatar" class="google-user-avatar" />
        <span class="google-user-name hidden md:inline">${user.name}</span>
      </a>
      <button id="google-signout-btn" class="google-signout-btn">退出</button>
    </div>`;
  
  const btn = document.getElementById("google-signout-btn");
  if (btn) btn.onclick = signOut;
}

function signOut() {
  localStorage.removeItem("google_id_token");
  localStorage.removeItem("google_user");
  location.reload(); // 刷新以重置状态
}

// 启动逻辑
(function() {
  const checkState = () => {
    const storedUser = localStorage.getItem("google_user");
    if (storedUser) {
      console.log("[Auth] User found in storage.");
      updateUI(JSON.parse(storedUser));
    } else {
      initGoogleLogin();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkState);
  } else {
    checkState();
  }
})();

