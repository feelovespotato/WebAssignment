document.addEventListener("DOMContentLoaded", async function () {
    try {
        await Promise.all([
            loadHTML("navbar", "navbar.html"),
            loadHTML("signupForm", "SignupForm.html"),
            loadHTML("footer", "footer.html")
        ]);

        // Run signup functions only after the form has been loaded
        initialiseSignupPage();

        console.log("Signup page components loaded successfully.");
    } catch (error) {
        console.error("Error loading signup page:", error);
    }
});


async function loadHTML(elementId, filePath) {
    const container = document.getElementById(elementId);

    if (!container) {
        throw new Error(`Element with ID "${elementId}" was not found.`);
    }

    const response = await fetch(filePath);

    if (!response.ok) {
        throw new Error(
            `Unable to load ${filePath}. HTTP status: ${response.status}`
        );
    }

    container.innerHTML = await response.text();
}


function initialiseSignupPage() {
    setupPasswordToggle("password", "passwordToggle");
    setupPasswordToggle("confirmPassword", "confirmPasswordToggle");

    const signupForm = document.getElementById("signupFormElement");

    if (!signupForm) {
        console.error("Signup form was not found.");
        return;
    }

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("The passwords do not match.");
            return;
        }

        alert("Your Pokka account has been created!");
    });
}


function setupPasswordToggle(inputId, buttonId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = document.getElementById(buttonId);

    if (!passwordInput || !toggleButton) {
        return;
    }

    toggleButton.addEventListener("click", function () {
        const icon = toggleButton.querySelector("i");

        if (passwordInput.type === "password") {
            passwordInput.type = "text";

            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");

            toggleButton.setAttribute("aria-label", "Hide password");
        } else {
            passwordInput.type = "password";

            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");

            toggleButton.setAttribute("aria-label", "Show password");
        }
    });
}