// Apply saved theme immediately, before anything else loads.
const root = document.documentElement;
let savedTheme = "light";

try {
    savedTheme = localStorage.getItem("theme") || "light";
} catch (error) {
    console.warn("localStorage unavailable, defaulting to light mode.");
}
root.setAttribute("data-theme", savedTheme);

function updateButtonText(theme) {
    const toggleBtn = document.getElementById("WebsiteTheme");
    if (!toggleBtn) return;
    toggleBtn.textContent =
        theme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode";
}

function closeMenu() {
    const navMenu = document.getElementById("navMenu");
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    if (navMenu) navMenu.classList.remove("active");
    if (hamburgerBtn) {
        hamburgerBtn.classList.remove("active");
        hamburgerBtn.setAttribute("aria-expanded", "false");
    }
}

// Attached immediately, independent of whether navbar.html has
// finished (or ever will finish) loading. 
document.addEventListener("click", (e) => {

    // 1. Dark Mode Toggle
    const themeBtn = e.target.closest("#WebsiteTheme");
    if (themeBtn) {
        const current = root.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        
        try {
            localStorage.setItem("theme", next);
        } catch (error) {
            console.warn("Could not save theme to localStorage.");
        }
        
        updateButtonText(next);
        return;
    }

    // 2. Hamburger Menu Toggle
    const hamburgerBtn = e.target.closest("#hamburgerBtn");
    if (hamburgerBtn) {
        const navMenu = document.getElementById("navMenu");
        if (!navMenu) return;
        const isActive = navMenu.classList.toggle("active");
        hamburgerBtn.classList.toggle("active", isActive);
        hamburgerBtn.setAttribute("aria-expanded", isActive);
        return;
    }

    // 3. Close menu when a link is clicked
    const navLink = e.target.closest("#navMenu a");
    if (navLink) {
        closeMenu();
    }
});

// Close menu on desktop resize
window.addEventListener("resize", () => {
    if (window.innerWidth > 1200) {
        closeMenu();
    }
});

// Fetch and load the navbar HTML
const navbarContainer = document.getElementById("navbar");

if (!navbarContainer) {
    console.error('Missing <div id="navbar"></div>');
} else {
    const navbarURL = new URL(
        "../components/layout/navbar.html",
        document.currentScript.src
    );

    console.log("Loading navbar from:", navbarURL.href);

    fetch(navbarURL.href)
        .then(response => {
            if (!response.ok) {
                throw new Error(
                    `Navbar request failed: ${response.status} ${response.statusText}`
                );
            }
            return response.text();
        })
        .then(data => {
            navbarContainer.innerHTML = data;
            updateButtonText(root.getAttribute("data-theme"));
        })
        .catch(error => {
            console.error("NAVBAR ERROR:", error);
            navbarContainer.innerHTML = `
                <p">
                    Navbar failed to load: ${error.message}
                </p>
            `;
        });
}

