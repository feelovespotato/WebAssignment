document.addEventListener("DOMContentLoaded", async function () {
    try {
        await Promise.all([
            loadComponent(
                "navbarContainer",
                "../components/layout/navbar.html"
            ),

            loadComponent(
                "loginContainer",
                "../components/Signup&Login/LoginForm.html"
            ),

            loadComponent(
                "footerContainer",
                "../components/layout/footer.html"
            )
        ]);

        initialiseLoginPage();
        initialiseTheme();
        initialiseFooter();

        console.log("Login page loaded successfully.");
    } catch (error) {
        console.error("Login page loading error:", error);
    }
});


async function loadComponent(containerId, filePath) {
    const container = document.getElementById(containerId);

    if (!container) {
        throw new Error(
            `Container "${containerId}" was not found.`
        );
    }

    const response = await fetch(filePath);

    if (!response.ok) {
        throw new Error(
            `${filePath} failed to load. Status: ${response.status}`
        );
    }

    container.innerHTML = await response.text();

    console.log(`${filePath} loaded successfully.`);
}


/*Initialisation*/

function initialiseLoginPage() {
    setupPasswordToggle(
        "password",
        "togglePassword"
    );

    const loginForm =
        document.getElementById("loginFormElement");

    if (!loginForm) {
        console.error("Login form was not found.");
        return;
    }

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const pin =
            document.getElementById("pin").value;

        if (pin.length !== 4) {
            alert("Your PIN must contain exactly 4 digits.");
            return;
        }

        alert("Login successful!");
    });
}


/*Password Toggle*/

function setupPasswordToggle(inputId, toggleId) {
    const passwordInput =
        document.getElementById(inputId);

    const toggleIcon =
        document.getElementById(toggleId);

    if (!passwordInput || !toggleIcon) {
        console.error(
            `Password toggle was not found: ${toggleId}`
        );

        return;
    }

    toggleIcon.addEventListener("click", function () {
        const passwordIsHidden =
            passwordInput.type === "password";

        passwordInput.type =
            passwordIsHidden ? "text" : "password";

        toggleIcon.classList.toggle(
            "fa-eye",
            passwordIsHidden
        );

        toggleIcon.classList.toggle(
            "fa-eye-slash",
            !passwordIsHidden
        );
    });
}


/*Toggle between light and dark mode*/

function initialiseTheme() {
    const themeButton =
        document.getElementById("WebsiteTheme");

    if (!themeButton) {
        console.error("Theme button was not found.");
        return;
    }

    const savedTheme =
        localStorage.getItem("theme");

    const startingTheme =
        savedTheme === "dark" ? "dark" : "light";

    setTheme(startingTheme);

    themeButton.addEventListener("click", function () {
        const currentTheme =
            document.documentElement.dataset.theme;

        const nextTheme =
            currentTheme === "dark"
                ? "light"
                : "dark";

        setTheme(nextTheme);
    });
}


function setTheme(theme) {
    document.documentElement.setAttribute(
        "data-theme",
        theme
    );

    localStorage.setItem("theme", theme);

    const themeButton =
        document.getElementById("WebsiteTheme");

    if (themeButton) {
        themeButton.textContent =
            theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode";
    }
}


/*Footer*/

function initialiseFooter() {
    const footerYear =
        document.getElementById("footerYear");

    if (footerYear) {
        footerYear.textContent =
            new Date().getFullYear();
    }
}