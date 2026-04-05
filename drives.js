async function loadDrives() {
  setTitle("All Drives");

  const res = await fetch(`${API}/fund-drives`);
  const data = await res.json();

  if (!Array.isArray(data)) {
    render("rightPanel", "<p>Error loading drives</p>");
    return;
  }

  let html = "";

  data.forEach(d => {
    html += `
      <div class="card">
        <div class="card-row">
          <div>
            <strong>${d.title}</strong><br>
            <small>${d.description}</small><br>
            <span class="badge ${d.status}">${d.status}</span>
          </div>

          <div>
            <button onclick="viewContributions('${d.id}')">👁</button>
          </div>
        </div>
      </div>
    `;
  });

  render("rightPanel", html || "<p>No drives found</p>");
}

/* =========================
   PENDING (AUTHORIZER)
========================= */
async function loadPendingDrives() {
  setTitle("Pending Drives");

  const res = await fetch(`${API}/fund-drives`);
  const data = await res.json();

  if (!Array.isArray(data)) {
    render("rightPanel", "<p>Error loading drives</p>");
    return;
  }

  let html = "";

  data
    .filter(d => d.status === "pending")
    .forEach(d => {
      html += `
        <div class="card">
          <div class="card-row">
            <div>
              <strong>${d.title}</strong><br>
              <small>${d.description}</small><br>
              <span class="badge pending">pending</span>
            </div>

            <div>
              <button class="btn green" onclick="approveDrive('${d.id}')">Approve</button>
              <button class="btn red" onclick="rejectDrive('${d.id}')">Reject</button>
            </div>
          </div>
        </div>
      `;
    });

  render("rightPanel", html || "<p>No pending drives</p>");
}

async function approveDrive(id) {
  await fetch(`${API}/fund-drives/${id}/approve`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "admin": adminUser
    }
  });

  loadPendingDrives();
}

async function rejectDrive(id) {
  await fetch(`${API}/fund-drives/${id}/reject`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "admin": adminUser
    }
  });

  loadPendingDrives();
}
