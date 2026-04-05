async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Enter username & password");
    return;
  }

  try {
    const res = await fetch(`${API}/admin/login?username=${username}&password=${password}`, {
      method: "POST"
    });

    const data = await res.json();

    if (data.token) {
      token = data.token;
      adminUser = data.username;
      adminRole = data.role;

      document.getElementById("loginPage").style.display = "none";
      document.getElementById("dashboard").style.display = "flex";

      applyRoleAccess();
      loadDashboard();
    } else {
      alert(data.error || "Login failed");
    }

  } catch (err) {
    console.error(err);
    alert("Login error");
  }
}

function loadDashboard() {
  if (adminRole === "inputter") {
    loadDrives();
  } else {
    loadPendingDrives();
  }
}

function applyRoleAccess() {
  const inputter = document.getElementById("inputterMenu");
  const authorizer = document.getElementById("authorizerMenu");

  if (adminRole === "inputter") {
    inputter.style.display = "block";
    authorizer.style.display = "none";
  } else {
    inputter.style.display = "none";
    authorizer.style.display = "block";
  }
}

function setTitle(title) {
  const el = document.getElementById("sectionTitle");

  if (!el) {
    console.warn("⚠️ sectionTitle not found");
    return;
  }

  el.innerText = title;
}

function render(containerId, html) {
  document.getElementById(containerId).innerHTML = html;
}

async function logout() {
  await fetch(`${API}/admin/logout`, {
    method: "POST",
    headers: { "admin": adminUser }
  });

  token = null;
  adminUser = null;
  adminRole = null;

  document.getElementById("dashboard").style.display = "none";
  document.getElementById("loginPage").style.display = "block";
}
