const auditItems = [
  {
    title: "Private chat",
    desc: "Periksa Chat Lock dan chat yang kamu kunci langsung di WhatsApp.",
    link: "https://faq.whatsapp.com/",
    action: "Buka panduan WhatsApp"
  },
  {
    title: "Online & last seen",
    desc: "Tinjau siapa yang bisa melihat status online dan terakhir dilihat.",
    link: "https://www.whatsapp.com/privacy",
    action: "Lihat fitur privasi"
  },
  {
    title: "View Once",
    desc: "Pelajari batas akses media sekali lihat dan cara kerjanya.",
    link: "https://faq.whatsapp.com/",
    action: "Buka pusat bantuan"
  },
  {
    title: "Panggilan tak dikenal",
    desc: "Periksa fitur Silence Unknown Callers di pengaturan privasi.",
    link: "https://www.whatsapp.com/privacy",
    action: "Lihat fitur privasi"
  },
  {
    title: "Keamanan akun",
    desc: "Periksa perangkat tertaut, verifikasi dua langkah, dan passkey jika tersedia.",
    link: "https://faq.whatsapp.com/",
    action: "Buka pusat bantuan"
  }
];

const storageKey = "juumao-wa-audit-v1";
const statuses = [
  ["pending", "Belum diperiksa"],
  ["ok", "Sudah diperiksa"],
  ["review", "Perlu ditinjau"]
];

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

let state = loadState();

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function render() {
  const root = document.getElementById("checks");
  root.replaceChildren();

  auditItems.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "item";

    const top = document.createElement("div");
    top.className = "item-top";

    const number = document.createElement("span");
    number.className = "number";
    number.textContent = String(index + 1).padStart(2, "0");

    const content = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = item.title;

    const desc = document.createElement("p");
    desc.textContent = item.desc;

    const link = document.createElement("a");
    link.href = item.link;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = item.action;

    content.append(title, desc, link);
    top.append(number, content);

    const row = document.createElement("div");
    row.className = "status";

    const label = document.createElement("label");
    label.textContent = "Status pemeriksaan";
    label.htmlFor = `status-${index}`;

    const select = document.createElement("select");
    select.id = `status-${index}`;

    statuses.forEach(([value, text]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = text;
      select.append(option);
    });

    select.value = state[index] || "pending";
    select.addEventListener("change", () => {
      state[index] = select.value;
      saveState();
      updateProgress();
    });

    row.append(label, select);
    card.append(top, row);
    root.append(card);
  });

  updateProgress();
}

function updateProgress() {
  const completed = auditItems.filter(
    (_, index) => state[index] === "ok"
  ).length;

  const percent = Math.round(completed / auditItems.length * 100);

  document.getElementById("progress").textContent = `${percent}%`;
  document.getElementById("bar").style.width = `${percent}%`;
  document.getElementById("progressText").textContent =
    `${completed} dari ${auditItems.length} pemeriksaan selesai`;
}

document.getElementById("openWA").addEventListener("click", () => {
  window.location.href = "whatsapp://";
});

document.getElementById("openSettings").addEventListener("click", () => {
  window.location.href =
    "intent://settings#Intent;scheme=android-app;end";
});

document.getElementById("reset").addEventListener("click", () => {
  if (!confirm("Hapus semua status checklist?")) return;
  state = {};
  saveState();
  render();
});

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

render();
