---
layout: default
title: Robby’s Archive
---

<h1>Robby’s Archive</h1>
<p>This page automatically loads your Archive.org uploads and lists.</p>

<h2>My Archive.org Lists</h2>
<div id="listsContainer">Loading lists…</div>

<h2>All Uploads</h2>
<div id="uploadsContainer">Loading uploads…</div>

<script>
const uploadsURL = "https://archive.org/advancedsearch.php?q=uploader:robbythomas2525&output=json&rows=1000";
const listsURL   = "https://archive.org/advancedsearch.php?q=list_creator:robbythomas2525&output=json&rows=1000";

// Load uploads
fetch(uploadsURL)
  .then(r => r.json())
  .then(data => {
    const docs = data.response.docs;
    const uploadsDiv = document.getElementById("uploadsContainer");
    uploadsDiv.innerHTML = "";

    docs.forEach(item => {
      const id = item.identifier;
      const title = item.title || id;
      const date = item.publicdate?.substring(0, 10) || "Unknown";

      uploadsDiv.innerHTML += `
        <div class="card">
          <strong>${title}</strong><br>
          <small>Uploaded: ${date}</small><br>
          <a href="https://archive.org/details/${id}" target="_blank">View</a>
        </div>
      `;
    });
  });

// Load lists
fetch(listsURL)
  .then(r => r.json())
  .then(data => {
    const lists = data.response.docs;
    const listsDiv = document.getElementById("listsContainer");
    listsDiv.innerHTML = "";

    lists.forEach(list => {
      const listId = list.identifier;
      const listTitle = list.title || listId;

      listsDiv.innerHTML += `
        <div class="card">
          <strong>${listTitle}</strong><br>
          <a href="https://archive.org/details/${listId}" target="_blank">Open List</a>
        </div>
      `;
    });
  });
</script>
