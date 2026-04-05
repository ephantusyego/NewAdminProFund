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

    allContributions = data;

    const totalAmount = data.reduce((sum, c) => sum + (c.amount || 0), 0);

    let html = `
      <div class="summary">
        <div><strong>Total:</strong> KES ${formatKES(totalAmount)}</div>
        <div><strong>Entries:</strong> ${data.length}</div>
      </div>

      <input type="date" id="startDate">
      <input type="date" id="endDate">
      <button class="btn green" onclick="exportCSV()">Export CSV</button>

      <!-- ✅ THIS is where cards go -->
      <div id="contributionsContainer"></div>
    `;

    render("rightPanel", html);

    // ✅ NOW use your correct renderer
    renderContributions(data);

  } catch (err) {
    render("rightPanel", "<p>Failed to load contributions</p>");
    console.error(err);
  }
};
window.viewContributions = async function (driveId) {
  setTitle("Contributions");

  render("rightPanel", `<p>Loading...</p>`);

  try { 
    const data = await apiRequest(`/collections?drive_id=${driveId}`);

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
  }
};
function formatKES(amount) {
  return Number(amount || 0).toLocaleString("en-KE");
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function renderContributions(data) {
  const container = document.getElementById("contributionsContainer");
  if (!container) return;

  let html = `<div class="grid">`;

  data.forEach(c => {
    html += `
      <div class="card">
        <div class="card-header">
          <strong>${c.payer_name || "Anonymous"}</strong>
          <span class="badge ${c.status}">${c.status}</span>
        </div>

        <div class="card-body">
          <div><strong>Phone:</strong> ${c.phone || "-"}</div>
          <div><strong>Drive:</strong> ${c.drive_name || "-"}</div>
          <div><strong>Drive:</strong> ${c.drive_id || c.drive?.title || "-"}</div>
          <div><strong>Date:</strong> ${formatDate(c.created_at)}</div>
          <div class="amount">KES ${formatKES(c.amount)}</div>
        </div>
      </div>
    `;
  });

  html += `</div>`;

  container.innerHTML = html;
}
window.exportCSV = function () {
  if (!allContributions.length) return;
const headers = ["Name", "Phone", "Drive", "Amount", "Status", "Date"];

const rows = allContributions.map(c => [
  c.payer_name || "Anonymous",
  c.phone || "-",
  c.drive_name || "-",
  c.amount,
  c.status,
  formatDate(c.created_at)
]);

  let csv = headers.join(",") + "\n";
  rows.forEach(r => {
    csv += r.join(",") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "contributions.csv";
  a.click();
};
window.applyFilters = function () {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const status = document.getElementById("statusFilter").value;
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;

  const filtered = allContributions.filter(c => {
    // 🔍 Search filter
    const matchesSearch =
      !search ||
      (c.phone && c.phone.includes(search)) ||
      (c.payer_name && c.payer_name.toLowerCase().includes(search));

    // 📊 Status filter
    const matchesStatus = !status || c.status === status;

    // 📅 Date filter
    const date = new Date(c.created_at);
    const matchesDate =
      (!start || date >= new Date(start)) &&
      (!end || date <= new Date(end));

    return matchesSearch && matchesStatus && matchesDate;
  });

  renderContributions(filtered);
};
