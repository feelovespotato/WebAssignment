document.addEventListener("DOMContentLoaded", function () {
    loadAboutUsPage();
});

async function loadAboutUsPage() {
    try {
        await Promise.all([
            loadComponent(
                "navbar",
                "/src/components/layout/navbar.html"
            ),

            loadComponent(
                "about",
                "/src/components/SignUp&Login/AboutUsForm.html"
            ),

            loadComponent(
                "footer",
                "/src/components/layout/footer.html"
            )
        ]);

        if (typeof initialiseNavbar === "function") {
            initialiseNavbar();
        }

        if (typeof initialiseFooter === "function") {
            initialiseFooter();
        }
    } catch (error) {
        console.error(error);

        const container = document.getElementById("about");

        if (container) {
            container.innerHTML = `
                <h2 style="padding: 50px; text-align: center;">
                    About Us content could not be loaded.
                </h2>
            `;
        }
    }
}

async function loadComponent(containerId, filePath) {
    const container = document.getElementById(containerId);

    if (!container) {
        throw new Error(containerId + " was not found.");
    }

    const response = await fetch(filePath);

    if (!response.ok) {
        throw new Error(
            filePath + " returned error " + response.status
        );
    }

    container.innerHTML = await response.text();
}