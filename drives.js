/* =========================
   LOAD ALL DRIVES
========================= */
async function loadDrives() {
  setTitle("All Drives");

  try {
    const data = await apiRequest("/fund-drives");
    if (!data) return;

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
              <button onclick="viewContributions('${d.id}')">VIEW</button>
              <button onclick="editDrive('${d.id}')">EDIT</button>
              ${
                d.status !== "active"
                  ? `<button class="btn red" onclick="deleteDrive('${d.id}')">DELETE</button>`
                  : ""
              }
            </div>
          </div>
        </div>
      `;
    });

    render("rightPanel", html || "<p>No drives found</p>");
  } catch (err) {
    console.error(err);
    render("rightPanel", "<p>Failed to load drives</p>");
  }
}

/* =========================
   PENDING DRIVES
========================= */
async function loadPendingDrives() {
  setTitle("Pending Drives");

  try {
    const data = await apiRequest("/fund-drives");
    if (!Array.isArray(data)) {
      render("rightPanel", "<p>Error loading drives</p>");
      return;
    }

    const pending = data.filter(d => d.status === "pending");

    let html = "";

    pending.forEach(d => {
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
  } catch (err) {
    console.error(err);
    render("rightPanel", "<p>Failed to load pending drives</p>");
  }
}

/* =========================
   APPROVE / REJECT
========================= */
async function approveDrive(id) {
  try {
    const res = await fetch(`${API}/fund-drives/${id}/approve`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "admin": adminUser
      }
    });

    if (!res.ok) throw new Error("Approve failed");

    loadPendingDrives();
  } catch (err) {
    console.error(err);
    alert("Failed to approve drive");
  }
}

async function rejectDrive(id) {
  try {
    const res = await fetch(`${API}/fund-drives/${id}/reject`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "admin": adminUser
      }
    });

    if (!res.ok) throw new Error("Reject failed");

    loadPendingDrives();
  } catch (err) {
    console.error(err);
    alert("Failed to reject drive");
  }
}

/* =========================
   CREATE DRIVE
========================= */
async function createDrive() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const accessType = document.getElementById("accessType").value;
  const pin = document.getElementById("drivePin").value;

  if (!title || !description) {
    alert("Fill all fields");
    return;
  }

  if (accessType === "locked" && !pin) {
    alert("PIN required");
    return;
  }

  try {
    const res = await fetch(
      `${API}/fund-drives?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&access_type=${accessType}&pin=${pin}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "admin": adminUser
        }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Failed to create drive");
      return;
    }

    alert("Drive submitted for approval");
    loadDrives();

  } catch (err) {
    console.error(err);
    alert("Error creating drive");
  }
}

/* =========================
   DELETE DRIVE
========================= */
async function deleteDrive(id) {
  const confirmDelete = confirm("Are you sure you want to delete this drive?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${API}/fund-drives/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "admin": adminUser
      }
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(data.detail || "Failed to delete drive");
      return;
    }

    alert("Drive deleted successfully");
    loadDrives();

  } catch (err) {
    console.error(err);
    alert("Error deleting drive");
  }
}

/* =========================
   EDIT PLACEHOLDER (FIXED)
========================= */
function editDrive(id) {
  alert("Edit UI not implemented yet for drive: " + id);
}

/* =========================
   EXPORTS
========================= */
window.loadDrives = loadDrives;
window.loadPendingDrives = loadPendingDrives;
window.deleteDrive = deleteDrive;
window.approveDrive = approveDrive;
window.rejectDrive = rejectDrive;
window.createDrive = createDrive;
window.editDrive = editDrive;
