window.loadAllContributions = async function () {
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
};
window.viewContributions = async function (driveId) {
  setTitle("Contributions");

  const data = await apiRequest(`/fund-drives/${driveId}/contributions`);

  let html = `
    <div class="card-row" style="margin-bottom:10px;">
      <strong>Contributions</strong>
      <button class="btn red" onclick="loadDrives()">✖ Close</button>
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
        <strong>${c.payer_name || "Anonymous"}</strong><br>
        <small>KES ${c.amount}</small>
      </div>
    `;
  });

  render("rightPanel", html);
};
