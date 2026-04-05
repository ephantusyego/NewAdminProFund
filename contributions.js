window.loadAllContributions = async function () {
  setTitle("All Contributions");

  render("rightPanel", `<p>Loading contributions...</p>`);

  try {
    const res = await fetch(`${API}/collections`);
    const data = await res.json();

    if (!Array.isArray(data)) {
      render("rightPanel", "<p>Error loading contributions</p>");
      return;
    }

    // 🔢 Calculate totals
    const totalAmount = data.reduce((sum, c) => sum + (c.amount || 0), 0);
    const totalCount = data.length;

    let html = `
      <div class="summary">
        <div><strong>Total:</strong> KES ${totalAmount}</div>
        <div><strong>Entries:</strong> ${totalCount}</div>
      </div>

      <div class="grid">
    `;

    data.forEach(c => {
      html += `
        <div class="card">
          <div class="card-header">
            <strong>${c.payer_name || "Anonymous"}</strong>
            <span class="badge ${c.status}">${c.status}</span>
          </div>

          <div class="card-body">
            <div>${c.phone || "-"}</div>
            <div class="amount">KES ${c.amount}</div>
          </div>
        </div>
      `;
    });

    html += `</div>`;

    render("rightPanel", html || "<p>No contributions found</p>");

  } catch (err) {
    render("rightPanel", "<p>Failed to load contributions</p>");
    console.error(err);
  }
};
window.viewContributions = async function (driveId) {
  setTitle("Contributions");

  render("rightPanel", `<p>Loading...</p>`);

  try {
    const data = await apiRequest(`/fund-drives/${driveId}/contributions`);

    let html = `
      <div class="top-bar">
        <strong>Drive Contributions</strong>
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

    const total = data.reduce((sum, c) => sum + (c.amount || 0), 0);

    html += `
      <div class="summary">
        <div><strong>Total:</strong> KES ${total}</div>
        <div><strong>Entries:</strong> ${data.length}</div>
      </div>

      <div class="grid">
    `;

    data.forEach(c => {
      html += `
        <div class="card">
          <div class="card-header">
            <strong>${c.payer_name || "Anonymous"}</strong>
          </div>
          <div class="card-body">
            <div class="amount">KES ${c.amount}</div>
          </div>
        </div>
      `;
    });

    html += `</div>`;

    render("rightPanel", html);

  } catch (err) {
    render("rightPanel", "<p>Failed to load contributions</p>");
    console.error(err);
  }
};
