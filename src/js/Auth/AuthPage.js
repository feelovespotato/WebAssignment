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


//SIGNUP FORM (3-step wizard: Personal -> Account -> Security)

function initialiseSignupPage() {
    setupPasswordToggle("password", "togglePassword");
    setupPasswordToggle("confirmPassword", "toggleConfirmPassword");

    const signupForm = document.getElementById("signupFormElement");

    if (!signupForm) {
        console.error("Signup form was not found.");
        return;
    }

    const steps = Array.from(signupForm.querySelectorAll(".form-step"));
    const indicators = Array.from(
        document.querySelectorAll(".stepper .progress-step")
    );

    // moves the wizard to the given step number, updating the panel that's
    // shown, the progress indicator, and where keyboard focus lands
    function showStep(stepNumber) {
        steps.forEach(function (stepEl) {
            const isTarget = Number(stepEl.dataset.step) === stepNumber;
            stepEl.classList.toggle("hidden", !isTarget);
            stepEl.setAttribute("aria-hidden", String(!isTarget));
        });

        indicators.forEach(function (indicatorEl) {
            const stepNum = Number(indicatorEl.dataset.step);
            indicatorEl.classList.toggle("active", stepNum === stepNumber);
            indicatorEl.classList.toggle("completed", stepNum < stepNumber);

            if (stepNum === stepNumber) {
                indicatorEl.setAttribute("aria-current", "step");
            } else {
                indicatorEl.removeAttribute("aria-current");
            }
        });

        const activeStep = steps.find(function (stepEl) {
            return Number(stepEl.dataset.step) === stepNumber;
        });

        const firstField = activeStep && activeStep.querySelector("input");
        if (firstField) firstField.focus();
    }

    // STEP 1: first name, last name, mobile number
    function validateStep1() {
        const firstName = document.getElementById("firstName");
        const lastName = document.getElementById("lastName");
        const mobileNumber = document.getElementById("mobileNumber");
        const message = document.getElementById("step1Message");

        clearMessage(message);

        if (!firstName.checkValidity() || !lastName.checkValidity()) {
            showMessage(message, "Please enter your first and last name.", "error");
            return false;
        }

        if (!mobileNumber.checkValidity()) {
            showMessage(message, "Please enter a valid mobile number.", "error");
            return false;
        }

        return true;
    }

    // STEP 2: email, password, confirm password
    function validateStep2() {
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        const confirmPassword = document.getElementById("confirmPassword");
        const message = document.getElementById("step2Message");

        clearMessage(message);

        if (!email.checkValidity()) {
            showMessage(message, "Please enter a valid email address.", "error");
            return false;
        }

        if (!password.checkValidity()) {
            showMessage(message, "Password must be at least 6 characters long.", "error");
            return false;
        }

        if (password.value !== confirmPassword.value) {
            showMessage(message, "The passwords do not match.", "error");
            return false;
        }

        return true;
    }

    // STEP 3: 4-digit PIN
    function validateStep3() {
        const pin = document.getElementById("pin");
        const message = document.getElementById("step3Message");

        clearMessage(message);

        if (!/^[0-9]{4}$/.test(pin.value)) {
            showMessage(message, "Your PIN must contain exactly 4 digits.", "error");
            return false;
        }

        return true;
    }

    document.getElementById("toStep2").addEventListener("click", function () {
        if (validateStep1()) showStep(2);
    });

    document.getElementById("backToStep1").addEventListener("click", function () {
        showStep(1);
    });

    document.getElementById("toStep3").addEventListener("click", function () {
        if (validateStep2()) showStep(3);
    });

    document.getElementById("backToStep2").addEventListener("click", function () {
        showStep(2);
    });

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // re-check every step at submit time too, in case a user reached step 3
        // then used the back buttons and changed an earlier answer
        if (!validateStep1() || !validateStep2()) {
            showStep(!validateStep1() ? 1 : 2);
            return;
        }

        if (!validateStep3()) {
            return;
        }

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const pin = document.getElementById("pin").value;

        const USER_STORAGE_KEY = "pokkaUsers";
        let users = [];
        try {
            const stored = localStorage.getItem(USER_STORAGE_KEY);
            if (stored) {
                users = JSON.parse(stored);
            }
        } catch (error) {
            console.error("Stored users could not be read:", error);
        }

        const accountExists = users.some(function (user) {
            return user.email.toLowerCase() === email.toLowerCase();
        });

        if (accountExists) {
            showMessage(
                document.getElementById("step2Message"),
                "An account with this email already exists.",
                "error"
            );
            showStep(2);
            return;
        }

        users.push({
            email: email,
            password: password,
            pin: pin
        });
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));

        alert("Your Pokka account has been created!");

        // Redirect to the Product Page
        window.location.href = "ProductPage.html";
    });

    showStep(1);
}

//LOGIN FORM


function initialiseLoginPage() {
    setupPasswordToggle("password", "togglePassword");

    const loginForm = document.getElementById("loginFormElement");

    if (!loginForm) {
        console.error("Login form was not found.");
        return;
    }

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const pin = document.getElementById("pin").value;

        if (pin.length !== 4) {
            alert("Your PIN must contain exactly 4 digits.");
            return;
        }

        // Look up the account and check the password actually matches
        const USER_STORAGE_KEY = "pokkaUsers";
        let users = [];
        try {
            const stored = localStorage.getItem(USER_STORAGE_KEY);
            if (stored) {
                users = JSON.parse(stored);
            }
        } catch (error) {
            console.error("Stored users could not be read:", error);
        }

        const matchedUser = users.find(function (user) {
            return user.email.toLowerCase() === email;
        });

        if (!matchedUser || matchedUser.password !== password) {
            alert("Incorrect email or password.");
            return;
        }

        alert("Login successful!");

        // Redirect to the Product Page upon successful login
        window.location.href = "ProductPage.html";
    });
}


//PASSWORD TOGGLE


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


//STEP MESSAGE HELPERS (mirrors the pattern used in ForgotPassword.js)

function showMessage(element, message, type) {
    if (!element) {
        return;
    }

    element.textContent = message;

    element.classList.remove("error", "success");
    element.classList.add(type);
}

function clearMessage(element) {
    if (!element) {
        return;
    }

    element.textContent = "";

    element.classList.remove("error", "success");
}