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
  setTitle("Drive Contributions");

  const res = await fetch(`${API}/collections/${driveId}`);
  const data = await res.json();

  if (!Array.isArray(data)) {
    render("rightPanel", "<p>No contributions</p>");
    return;
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
