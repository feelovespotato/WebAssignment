const footerContainer = document.getElementById("footer");

if (!footerContainer) {
    console.error('Missing <div id="footer"></div>');
} else {
    // Starts from /js/footer.js and finds /components/layout/footer.html
    const footerURL = new URL(
        "../../components/layout/footer.html",
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

function scrollToLinkedSection() {
    const sectionId = window.location.hash.substring(1);

    if (!sectionId) {
        return;
    }

    function attemptScroll() {
        const section = document.getElementById(sectionId);

        if (section) {
            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            return true;
        }

        return false;
    }

    // Scroll immediately when the section already exists
    if (attemptScroll()) {
        return;
    }

    // Wait for dynamically loaded homepage sections
    const observer = new MutationObserver(function () {
        if (attemptScroll()) {
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Stop checking after five seconds
    setTimeout(function () {
        observer.disconnect();
    }, 5000);
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        scrollToLinkedSection
    );
} else {
    scrollToLinkedSection();
}

window.addEventListener("hashchange", scrollToLinkedSection);