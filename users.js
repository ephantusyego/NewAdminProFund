async function loadUsers() {
  setTitle("Users");

  const res = await fetch(`${API}/admin/users`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await res.json();

  if (!Array.isArray(data)) {
    render("rightPanel", "<p>Error loading users</p>");
    return;
  }

  let html = "";

  data.forEach(u => {
    html += `
      <div class="card">
        <div><b>${u.username}</b></div>
        <div>Role: ${u.role}</div>
        <div>Status: ${u.is_active ? "🟢 Active" : "🔴 Disabled"}</div>

        <button 
          onclick="${
            u.is_active 
              ? `disableUser('${u.id}')` 
              : `enableUser('${u.id}')`
          }"
          style="
            background:${u.is_active ? '#ff4d4f' : '#28a745'};
            color:white;
            border:none;
            padding:6px 10px;
            cursor:pointer;
          "
        >
          ${u.is_active ? "Disable" : "Enable"}
        </button>
      </div>
    `;
  });

  render("rightPanel", html);
}

async function createUser() {
  const username = document.getElementById("newUser").value;
  const password = document.getElementById("newPass").value;
  const role = document.getElementById("newRole").value;

  const res = await fetch(
    `${API}/admin/create-user?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&role=${role}`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "admin": adminUser
      }
    }
  );

  const data = await res.json();
  alert(data.message || data.error);
}
window.loadUsers = loadUsers;
window.createUser = createUser;
async function disableUser(userId) {
  if (!confirm("Disable this user?")) return;

  const res = await fetch(`${API}/users/${userId}/disable`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();
  alert(data.message || "User disabled");

  loadUsers(); // refresh list
}

async function enableUser(userId) {
  const res = await fetch(`${API}/users/${userId}/enable`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();
  alert(data.message || "User enabled");

  loadUsers();
}

window.disableUser = disableUser;
window.enableUser = enableUser;
