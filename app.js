// AIHS Digital Library — fixed frontend
// Backend URL is preconfigured so the librarian does not need to save it manually.
const BACKEND = "https://script.google.com/macros/s/AKfycbx2TIiEbBuAkNPZ-6wsyeuwGMb05kwE5HFgH9cdWaYCaMzroaYkU5Vw_IfNDBFaSHuBDA/exec";

const departments = [
  "Bachelor of Physiotherapy",
  "Master of Physiotherapy",
  "Bachelor of Medical Laboratory Technology",
  "Bachelor of Medical Imaging Technology",
  "Master of Hospital Administration",
  "ATOT"
];

let TOKEN = sessionStorage.getItem("aihs_token") || "";
let resources = [];

const $ = id => document.getElementById(id);

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

departments.forEach((d, i) => {
  ["dept","adept"].forEach(id => {
    const o = document.createElement("option");
    o.value = d; o.textContent = d;
    $(id).appendChild(o);
  });
  const c = document.createElement("div");
  c.className = "dept";
  c.innerHTML = `<b>0${i+1}</b><h3>${esc(d)}</h3>`;
  $("depts").appendChild(c);
});

$("yr").textContent = new Date().getFullYear();

function render() {
  const q = $("search").value.toLowerCase().trim();
  const d = $("dept").value, t = $("type").value, s = $("sem").value;

  const arr = resources.filter(r =>
    (!q || [r.title,r.type,r.department,r.semester,r.subject,r.year]
      .join(" ").toLowerCase().includes(q)) &&
    (!d || r.department === d) &&
    (!t || r.type === t) &&
    (!s || String(r.semester) === s)
  );

  $("grid").innerHTML = arr.map(r => `
    <article class="card">
      <span class="tag">${esc(r.type)}</span>
      <h3>${esc(r.title)}</h3>
      <div class="meta">${esc(r.department)}${r.semester ? " • Semester " + esc(r.semester) : ""}</div>
      <div class="meta">${esc(r.subject || "")}${r.year ? " • " + esc(r.year) : ""}</div>
      <div class="open"><a target="_blank" rel="noopener" href="${esc(r.url || "#")}">Open Resource →</a></div>
    </article>
  `).join("");

  $("empty").hidden = arr.length > 0;
}

["search","dept","type","sem"].forEach(id => $(id).addEventListener("input", render));

async function api(action, payload = {}) {
  const response = await fetch(BACKEND, {
    method: "POST",
    headers: {"Content-Type": "text/plain;charset=utf-8"},
    body: JSON.stringify({action, ...payload})
  });

  let data;
  try {
    data = await response.json();
  } catch (_) {
    throw new Error("Google Apps Script ಸರಿಯಾಗಿ Deploy ಆಗಿಲ್ಲ. Apps Scriptನಲ್ಲಿ doGet/doPost code ಮತ್ತು Web App deployment ಪರಿಶೀಲಿಸಿ.");
  }

  if (!data.ok) throw new Error(data.error || "ವಿನಂತಿ ವಿಫಲವಾಗಿದೆ.");
  return data;
}

async function load() {
  try {
    const data = await api("list");
    resources = data.resources || [];
    render();
  } catch (e) {
    resources = [];
    render();
    console.warn(e);
  }
}

async function login() {
  const msg = $("loginMsg");
  msg.textContent = "ಪ್ರವೇಶ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...";
  try {
    const d = await api("login", {
      username: $("user").value.trim(),
      password: $("pass").value
    });
    TOKEN = d.token;
    sessionStorage.setItem("aihs_token", TOKEN);
    $("loginArea").hidden = true;
    $("dash").hidden = false;
    msg.textContent = "";
    await adminList();
  } catch (e) {
    msg.textContent = e.message;
  }
}

async function adminList() {
  try {
    const d = await api("adminList", {token: TOKEN});
    $("adminList").innerHTML =
      "<h3>ಪ್ರಸ್ತುತ ಸಂಪನ್ಮೂಲಗಳು</h3>" +
      (d.resources || []).map(r => `
        <div class="adminitem">
          <b>${esc(r.title)}</b><br>
          <small>${esc(r.type)} • ${esc(r.department)} •
          <a target="_blank" href="${esc(r.url)}">ತೆರೆಯಿರಿ</a> •
          <button onclick="del('${esc(r.id)}')">Delete</button></small>
        </div>
      `).join("");
  } catch (e) {
    $("loginMsg").textContent = e.message;
  }
}

async function upload() {
  const f = $("file").files[0];
  if (!f) return $("uploadMsg").textContent = "ದಯವಿಟ್ಟು ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ.";
  if (f.size > 25 * 1024 * 1024)
    return $("uploadMsg").textContent = "25 MB ಗಿಂತ ದೊಡ್ಡ ಫೈಲ್ upload ಮಾಡಬೇಡಿ.";

  const b64 = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result.split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(f);
  });

  try {
    $("uploadMsg").textContent = "Upload ಆಗುತ್ತಿದೆ...";
    await api("add", {
      token: TOKEN,
      title: $("title").value.trim(),
      type: $("atype").value,
      department: $("adept").value,
      semester: $("asem").value.trim(),
      subject: $("subject").value.trim(),
      year: $("year").value.trim(),
      fileName: f.name,
      mimeType: f.type || "application/octet-stream",
      data: b64
    });

    $("uploadMsg").textContent = "✅ Resource ಯಶಸ್ವಿಯಾಗಿ upload ಆಯಿತು.";
    ["title","asem","subject","year","file"].forEach(id => $(id).value = "");
    await load();
    await adminList();
  } catch (e) {
    $("uploadMsg").textContent = "❌ " + e.message;
  }
}

async function del(id) {
  if (!confirm("ಈ resource ಅನ್ನು ಅಳಿಸಬೇಕೇ?")) return;
  try {
    await api("delete", {token: TOKEN, id});
    await load();
    await adminList();
  } catch (e) {
    alert(e.message);
  }
}

function logout() {
  TOKEN = "";
  sessionStorage.removeItem("aihs_token");
  $("dash").hidden = true;
  $("loginArea").hidden = false;
}

load();
