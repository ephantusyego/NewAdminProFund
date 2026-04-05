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
        ${u.username} | ${u.role}
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
