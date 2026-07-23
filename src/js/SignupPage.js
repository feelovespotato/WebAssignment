document.addEventListener("DOMContentLoaded", async function () {
    try {
        await Promise.all([
            loadComponent(
                "navbarContainer",
                "../components/layout/navbar.html"
            ),

            loadComponent(
                "signupContainer",
                "../components/Signup&Login/SignupForm.html"
            ),

            loadComponent(
                "footerContainer",
                "../components/layout/footer.html"
            )
        ]);

        initialiseSignupPage();
        initialiseTheme();
        initialiseFooter();

        console.log("All components loaded successfully.");
    } catch (error) {
        console.error("Signup page loading error:", error);
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


/* =========================
   SIGNUP FORM
========================= */

function initialiseSignupPage() {
    setupPasswordToggle(
        "password",
        "togglePassword"
    );

    setupPasswordToggle(
        "confirmPassword",
        "toggleConfirmPassword"
    );

    const signupForm =
        document.getElementById("signupFormElement");

    if (!signupForm) {
        console.error("Signup form was not found.");
        return;
    }

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const pin =
            document.getElementById("pin").value;

        if (password !== confirmPassword) {
            alert("The passwords do not match.");
            return;
        }

        if (pin.length !== 4) {
            alert("Your PIN must contain exactly 4 digits.");
            return;
        }

        alert("Your Pokka account has been created!");
    });
}


/* =========================
   PASSWORD TOGGLE
========================= */

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


/* =========================
   LIGHT AND DARK MODE
========================= */

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


/* =========================
   FOOTER
========================= */

function initialiseFooter() {
    const footerYear =
        document.getElementById("footerYear");

    if (footerYear) {
        footerYear.textContent =
            new Date().getFullYear();
    }
}