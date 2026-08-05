document.addEventListener("DOMContentLoaded", async function () {
    try {
        if (document.getElementById("signupContainer")) {
            await loadComponent(
                "signupContainer",
                "../components/Signup&Login/SignupForm.html"
            );

            initialiseSignupPage();
        } else if (document.getElementById("loginContainer")) {
            await loadComponent(
                "loginContainer",
                "../components/Signup&Login/LoginForm.html"
            );

            initialiseLoginPage();
        } else {
            console.error(
                "Neither #signupContainer nor #loginContainer was found on this page."
            );
            return;
        }

        observeAnimations();

        console.log("Auth page loaded successfully.");
    } catch (error) {
        console.error("Auth page loading error:", error);
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
   LOGIN FORM
========================= */

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