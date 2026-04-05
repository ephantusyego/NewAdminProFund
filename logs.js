async function loadLogs() {
  setTitle("System Logs");

  const res = await fetch(`${API}/admin/logs`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await res.json();

  if (!Array.isArray(data)) {
    render("rightPanel", "<p>Error loading logs</p>");
    return;
  }

  let html = "";

  data.forEach(log => {
    html += `
      <div class="card">
        ${log.admin} → ${log.action} → ${log.target_id}
      </div>
    `;
  });

  render("rightPanel", html);
}
