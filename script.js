async function loadArchiveLists() {
    const username = "robbythomas2525";  
    const container = document.getElementById("listsContainer");

    try {
        // Step 1: Get user metadata (contains list IDs)
        const metaUrl = `https://archive.org/metadata/@${username}`;
        const metaRes = await fetch(metaUrl);
        const metaData = await metaRes.json();

        if (!metaData.lists || metaData.lists.length === 0) {
            container.innerHTML = "No lists found.";
            return;
        }

        // Step 2: Build HTML for each list
        let html = "";
        for (const list of metaData.lists) {
            const listId = list.identifier;
            const listTitle = list.title || listId;

            html += `
                <div class="archive-list">
                    <h3>${listTitle}</h3>
                    <a href="https://archive.org/details/${listId}" target="_blank">
                        View on Archive.org
                    </a>
                </div>
            `;
        }

        container.innerHTML = html;

    } catch (err) {
        console.error(err);
        container.innerHTML = "Failed to load lists.";
    }
}

loadArchiveLists();
