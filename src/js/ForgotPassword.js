const USER_STORAGE_KEY = "pokkaUsers";

let validatedAccountEmail = "";

document.addEventListener("DOMContentLoaded", async function () {
    try {
        await Promise.all([

            loadComponent(
                "forgotContainer",
                "../components/Signup&Login/ForgotPasswordForm.html"
            ),

            
        ]);

        createDemoAccount();

        initialiseForgotPasswordPage();
        observeAnimations();

        console.log("Forgot password page loaded successfully.");
    } catch (error) {
        console.error(
            "Forgot password page loading error:",
            error
        );
    }
});

async function loadComponent(containerId, filePath) {
    const container =
        document.getElementById(containerId);

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

 /*Demo Test*/
function createDemoAccount() {
    const users = getStoredUsers();

    const demoAccountExists = users.some(function (user) {
        return user.email === "demo@pokka.com";
    });

    if (!demoAccountExists) {
        users.push({
            email: "demo@pokka.com",
            password: "Pokka123"
        });

        saveStoredUsers(users);
    }
}


function getStoredUsers() {
    try {
        const users = JSON.parse(
            localStorage.getItem(USER_STORAGE_KEY)
        );

        return Array.isArray(users) ? users : [];
    } catch (error) {
        console.error(
            "Stored users could not be read:",
            error
        );

        return [];
    }
}


function saveStoredUsers(users) {
    localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(users)
    );
}



function initialiseForgotPasswordPage() {
    const emailForm =
        document.getElementById("emailValidationForm");

    const passwordForm =
        document.getElementById("passwordResetForm");

    const backToEmailButton =
        document.getElementById("backToEmailButton");

    if (!emailForm || !passwordForm) {
        console.error(
            "Forgot password forms were not found."
        );

        return;
    }

    emailForm.addEventListener(
        "submit",
        validateAccountEmail
    );

    passwordForm.addEventListener(
        "submit",
        resetAccountPassword
    );

    if (backToEmailButton) {
        backToEmailButton.addEventListener(
            "click",
            returnToEmailStep
        );
    }

    setupPasswordToggle(
        "newPassword",
        "toggleNewPassword"
    );

    setupPasswordToggle(
        "confirmNewPassword",
        "toggleConfirmNewPassword"
    );
}



function validateAccountEmail(event) {
    event.preventDefault();

    const emailInput =
        document.getElementById("emailReset");

    const emailMessage =
        document.getElementById("emailMessage");

    clearMessage(emailMessage);

    const email = emailInput.value
        .trim()
        .toLowerCase();

    if (!emailInput.checkValidity()) {
        showMessage(
            emailMessage,
            "Please enter a valid email address.",
            "error"
        );

        return;
    }

    const users = getStoredUsers();

    const accountExists = users.some(function (user) {
        return user.email.toLowerCase() === email;
    });

    if (!accountExists) {
        showMessage(
            emailMessage,
            "No Pokka account was found with this email.",
            "error"
        );

        return;
    }

    validatedAccountEmail = email;

    showPasswordStep(email);
}


function showPasswordStep(email) {
    const emailStep =
        document.getElementById("emailstep");

    const passwordStep =
        document.getElementById("passwordstep");

    const validatedEmail =
        document.getElementById("validatedEmail");

    emailStep.classList.add("hidden");
    passwordStep.classList.remove("hidden");

    validatedEmail.textContent = email;

    document
        .getElementById("newPassword")
        .focus();
}


function resetAccountPassword(event) {
    event.preventDefault();

    const newPasswordInput =
        document.getElementById("newPassword");

    const confirmPasswordInput =
        document.getElementById(
            "confirmNewPassword"
        );

    const passwordMessage =
        document.getElementById("passwordMessage");

    clearMessage(passwordMessage);

    const newPassword =
        newPasswordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;

    if (!isStrongPassword(newPassword)) {
        showMessage(
            passwordMessage,
            "Password must contain at least 8 characters, an uppercase letter, a lowercase letter and a number.",
            "error"
        );

        return;
    }

    if (newPassword !== confirmPassword) {
        showMessage(
            passwordMessage,
            "The passwords do not match.",
            "error"
        );

        return;
    }

    const users = getStoredUsers();

    const accountIndex = users.findIndex(
        function (user) {
            return (
                user.email.toLowerCase() ===
                validatedAccountEmail
            );
        }
    );

    if (accountIndex === -1) {
        showMessage(
            passwordMessage,
            "The account could not be found. Please validate your email again.",
            "error"
        );

        return;
    }

    users[accountIndex].password = newPassword;

    saveStoredUsers(users);

    showSuccessStep();
}


function isStrongPassword(password) {
    const hasMinimumLength =
        password.length >= 8;

    const hasUppercase =
        /[A-Z]/.test(password);

    const hasLowercase =
        /[a-z]/.test(password);

    const hasNumber =
        /[0-9]/.test(password);

    return (
        hasMinimumLength &&
        hasUppercase &&
        hasLowercase &&
        hasNumber
    );
}


function returnToEmailStep() {
    const emailStep =
        document.getElementById("emailstep");

    const passwordStep =
        document.getElementById("passwordstep");

    const passwordForm =
        document.getElementById("passwordResetForm");

    passwordStep.classList.add("hidden");
    emailStep.classList.remove("hidden");

    passwordForm.reset();

    validatedAccountEmail = "";

    document
        .getElementById("emailReset")
        .focus();
}


function showSuccessStep() {
    const passwordStep =
        document.getElementById("passwordstep");

    const successStep =
        document.getElementById("successStep");

    passwordStep.classList.add("hidden");
    successStep.classList.remove("hidden");
}


function setupPasswordToggle(inputId, buttonId) {
    const passwordInput =
        document.getElementById(inputId);

    const toggleButton =
        document.getElementById(buttonId);

    if (!passwordInput || !toggleButton) {
        return;
    }

    toggleButton.addEventListener(
        "click",
        function () {
            const passwordIsHidden =
                passwordInput.type === "password";

            passwordInput.type =
                passwordIsHidden
                    ? "text"
                    : "password";

            const icon =
                toggleButton.querySelector("i");

            if (icon) {
                icon.classList.toggle(
                    "fa-eye",
                    passwordIsHidden
                );

                icon.classList.toggle(
                    "fa-eye-slash",
                    !passwordIsHidden
                );
            }

            toggleButton.setAttribute(
                "aria-label",
                passwordIsHidden
                    ? "Hide password"
                    : "Show password"
            );
        }
    );
}


function showMessage(element, message, type) {
    if (!element) {
        return;
    }

    element.textContent = message;

    element.classList.remove(
        "error",
        "success"
    );

    element.classList.add(type);
}


function clearMessage(element) {
    if (!element) {
        return;
    }

    element.textContent = "";

    element.classList.remove(
        "error",
        "success"
    );
}

