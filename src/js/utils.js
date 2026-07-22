async function loadComponent(containerId, url) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        container.innerHTML = await response.text();
    } catch (err) {
        console.error(`Failed to load ${url}:`, err);
    }
}

function renderNotFound(title, message) {
    const main = document.querySelector("main");
    if (main) {
        main.innerHTML = `
            <section style="text-align:center; padding-top: clamp(5rem, 8vw, 8rem);">
                <h1>${title}</h1>
                <p class="halfvisibletext">${message}</p>
                <a class="solidbutton" href="../pages/ProductPage.html">Back to Categories</a>
            </section>
        `;
    }
}