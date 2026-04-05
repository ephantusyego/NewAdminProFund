async function loadAllContributions() {
  setTitle("All Contributions");

  const res = await fetch(`${API}/collections`);
  const data = await res.json();

  if (!Array.isArray(data)) {
    render("rightPanel", "<p>Error loading contributions</p>");
    return;
  }

  let html = "";

  data.forEach(c => {
    html += `
      <div class="card">
        <strong>${c.payer_name || "Anonymous"}</strong><br>
        ${c.phone || "-"}<br>
        KES ${c.amount}<br>
        <span class="badge ${c.status}">${c.status}</span>
      </div>
    `;
  });

  render("rightPanel", html || "<p>No contributions found</p>");
}

async function viewContributions(driveId) {
  setTitle("Contributions");

  const data = await apiRequest(`/fund-drives/${driveId}/contributions`);

  let html = `
    <div style="margin-bottom: 10px;">
      <button class="btn" onclick="loadDrives()">⬅ Close</button>
    </div>
  `;

  if (!Array.isArray(data)) {
    html += "<p>Error loading contributions</p>";
    render("rightPanel", html);
    return;
  }

  if (data.length === 0) {
    html += "<p>No contributions yet</p>";
    render("rightPanel", html);
    return;
  }

  data.forEach(c => {
    html += `
      <div class="card">
        <strong>${c.name || "Anonymous"}</strong><br>
        <small>KES ${c.amount}</small>
      </div>
    `;
  });

  render("rightPanel", html);
}

  let html = "";

  data.forEach(c => {
    html += `
      <div class="card">
        ${c.payer_name} | ${c.phone} | ${c.amount} | 
        <span class="badge ${c.status}">${c.status}</span>
      </div>
    `;
  });

  render("rightPanel", html);
}
