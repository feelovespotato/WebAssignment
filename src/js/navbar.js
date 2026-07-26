fetch("../components/layout/navbar.html")
    .then(response => response.text())
    .then(data => {

        document.getElementById("navbar").innerHTML = data;

        const toggleBtn = document.getElementById("WebsiteTheme");
        const root = document.documentElement;

        const savedTheme = localStorage.getItem("theme") || "light";

        root.setAttribute("data-theme", savedTheme);

        updateButtonText(savedTheme);

        toggleBtn.addEventListener("click", () => {

            const current = root.getAttribute("data-theme");

            const next = current === "dark"
                ? "light"
                : "dark";

            root.setAttribute("data-theme", next);

            localStorage.setItem("theme", next);

            updateButtonText(next);

        });

        function updateButtonText(theme) {

            toggleBtn.textContent =
                theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode";

        }

    });