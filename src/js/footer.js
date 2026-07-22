const footerContainer = document.getElementById("footer");

if (!footerContainer) {
    console.error('Missing <div id="footer"></div>');
} else {
    // Starts from /js/footer.js and finds /components/layout/footer.html
    const footerURL = new URL(
        "../components/layout/footer.html",
        document.currentScript.src
    );

    console.log("Loading footer from:", footerURL.href);

    fetch(footerURL.href)
        .then(response => {
            if (!response.ok) {
                throw new Error(
                    `Footer request failed: ${response.status} ${response.statusText}`
                );
            }

            return response.text();
        })
        .then(html => {
            footerContainer.innerHTML = html;

            const year = document.getElementById("footerYear");

            if (year) {
                year.textContent = new Date().getFullYear();
            }
        })
        .catch(error => {
            console.error("FOOTER ERROR:", error);

            // Makes the error visible directly on the page
            footerContainer.innerHTML = `
                <p style="padding:20px; color:red; font-weight:bold;">
                    Footer failed to load: ${error.message}
                </p>
            `;
        });
}