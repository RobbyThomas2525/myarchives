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

function displayItems(list) {
  const container = document.getElementById("items");
  container.innerHTML = "";

  list.forEach(item => {
    const id = item.identifier;
    const title = item.title || id;
    const thumb = `https://archive.org/services/img/${id}`;
    const category = item.mediatype || "unknown";

    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <img loading="lazy" src="${thumb}" alt="${title}">
      <div class="info">
        <h3>${title}</h3>
        <p class="category">${category}</p>

        <a href="https://archive.org/details/${id}" target="_blank">View</a>

        <!-- ONLY link to download.html -->
        <a href="download.html?id=${id}" class="download" target="_blank">
          Download Options
        </a>
      </div>
    `;
    container.appendChild(div);
  });
}

/* -------- SORTING -------- */

function sortAZ() {
  displayItems([...items].sort((a, b) =>
    (a.title || a.identifier).localeCompare(b.title || b.identifier)
  ));
}

function sortZA() {
  displayItems([...items].sort((a, b) =>
    (b.title || b.identifier).localeCompare(a.title || a.identifier)
  ));
}

function sortNewest() {
  displayItems([...items].sort((a, b) =>
    new Date(b.publicdate || 0) - new Date(a.publicdate || 0)
  ));
}

function sortOldest() {
  displayItems([...items].sort((a, b) =>
    new Date(a.publicdate || 0) - new Date(b.publicdate || 0)
  ));
}

/* -------- CATEGORIES -------- */

function buildCategories(items) {
  const select = document.getElementById("categorySelect");
  const cats = new Set();

  items.forEach(item => cats.add(item.mediatype || "unknown"));

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
    displayItems(items.filter(i => (i.mediatype || "unknown") === cat));
  }
}
