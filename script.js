const USER = "robbythomas2525";
const API = `https://archive.org/advancedsearch.php?q=uploader:${USER}&output=json&rows=500`;

let items = [];

fetch(API)
  .then(res => res.json())
  .then(data => {
    items = data.response.docs || [];
    buildCategories(items);
    displayItems(items);
  })
  .catch(err => console.error("Error loading Archive.org items:", err));

async function displayItems(list) {
  const container = document.getElementById("items");
  container.innerHTML = "";

  for (const item of list) {
    const id = item.identifier;
    const title = item.title || id;
    const thumb = `https://archive.org/services/img/${id}`;
    const category = item.mediatype || "unknown";

    // Fetch metadata to get file list
    const meta = await fetch(`https://archive.org/metadata/${id}`).then(r => r.json());
    const files = meta.files || [];

    // Pick the first real downloadable file
    const file = files.find(f =>
      !f.name.endsWith("_thumb.jpg") &&
      !f.name.endsWith("_thumb.png") &&
      !f.name.endsWith(".xml") &&
      !f.name.endsWith(".json")
    ) || files[0];

    const downloadUrl = file
      ? `https://archive.org/download/${id}/${file.name}`
      : null;

    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <img src="${thumb}" alt="${title}">
      <div class="info">
        <h3>${title}</h3>
        <p class="category">${category}</p>
        <a href="https://archive.org/details/${id}" target="_blank">View</a>
        ${downloadUrl ? `<a href="${downloadUrl}" class="download" target="_blank">Download</a>` : ""}
      </div>
    `;

    container.appendChild(div);
  }
}

/* -------- SORTING -------- */

function sortAZ() {
  const sorted = [...items].sort((a, b) =>
    (a.title || a.identifier).localeCompare(b.title || b.identifier)
  );
  displayItems(sorted);
}

function sortZA() {
  const sorted = [...items].sort((a, b) =>
    (b.title || b.identifier).localeCompare(a.title || a.identifier)
  );
  displayItems(sorted);
}

function sortNewest() {
  const sorted = [...items].sort((a, b) => {
    const da = new Date(a.publicdate || 0);
    const db = new Date(b.publicdate || 0);
    return db - da;
  });
  displayItems(sorted);
}

function sortOldest() {
  const sorted = [...items].sort((a, b) => {
    const da = new Date(a.publicdate || 0);
    const db = new Date(b.publicdate || 0);
    return da - db;
  });
  displayItems(sorted);
}

/* -------- CATEGORIES -------- */

function buildCategories(items) {
  const select = document.getElementById("categorySelect");
  const cats = new Set();

  items.forEach(item => {
    cats.add(item.mediatype || "unknown");
  });

  cats.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

function filterCategory() {
  const cat = document.getElementById("categorySelect").value;

  if (cat === "all") {
    displayItems(items);
  } else {
    const filtered = items.filter(i => (i.mediatype || "unknown") === cat);
    displayItems(filtered);
  }
}
