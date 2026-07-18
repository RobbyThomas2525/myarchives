const USER = "robbythomas2525";

const API = `https://archive.org/advancedsearch.php?q=uploader:${USER}&output=json&rows=200`;

fetch(API)
  .then(res => res.json())
  .then(data => {
    const items = data.response.docs;
    const container = document.getElementById("items");

    items.forEach(item => {
      const id = item.identifier;
      const title = item.title || id;
      const thumb = `https://archive.org/services/img/${id}`;

      const div = document.createElement("div");
      div.className = "item";

      div.innerHTML = `
        <img src="${thumb}" alt="${title}">
        <div class="info">
          <h3>${title}</h3>
          <a href="https://archive.org/details/${id}" target="_blank">View on Archive.org</a>
        </div>
      `;

      container.appendChild(div);
    });
  })
  .catch(err => {
    console.error("Error loading Archive.org items:", err);
  });
