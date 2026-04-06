async function loadLogs() {
  setTitle("System Logs");

  const res = await fetch(`${API}/admin/logs`, {
    headers: { "Authorization": `Bearer ${token}` }
  });

  const data = await res.json();
  console.log("LOGS RESPONSE:", data);

  const logs = Array.isArray(data) ? data : data.logs;

  if (!Array.isArray(logs)) {
    render("rightPanel", "<p>Error loading logs</p>");
    return;
  }

  let html = "";

  logs.forEach(log => {
    const time = log.timestamp 
      ? new Date(log.timestamp).toLocaleString() 
      : "No time";

    html += `
      <div class="card">
        <div><b>👤 ${log.admin || "Unknown"}</b></div>
        <div>⚡ Action: ${log.action}</div>
        <div>🎯 Target: ${log.target_id || "-"}</div>
        <div>🕒 ${time}</div>
      </div>
    `;
  });

  render("rightPanel", html);
}

window.loadLogs = loadLogs;
