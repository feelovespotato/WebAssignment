document.addEventListener("DOMContentLoaded", async function () {
    try {
        await Promise.all([
            loadComponent(
                "navbarContainer",
                "/src/components/layout/navbar.html"
            ),

            loadComponent(
                "contactFormContainer",
                "/src/components/SignUp&Login/ContactForm.html"
            ),

            loadComponent(
                "footerContainer",
                "/src/components/layout/footer.html"
            )
        ]);

        initialiseContactForm();

        if (typeof initialiseNavbar === "function") {
            initialiseNavbar();
        }

        if (typeof initialiseFooter === "function") {
            initialiseFooter();
        }
    } catch (error) {
        console.error("Contact page could not be loaded:", error);
    }
});

async function loadComponent(containerId, filePath) {
    const container = document.getElementById(containerId);

    if (!container) {
        throw new Error(containerId + " was not found.");
    }

    const response = await fetch(filePath);

    if (!response.ok) {
        throw new Error(
            filePath + " could not be loaded. Status: " + response.status
        );
    }

    container.innerHTML = await response.text();
}

function initialiseContactForm() {
    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("contactFormMessage");
    const submitButton = document.getElementById(
        "contactSubmitButton"
    );

    if (!contactForm || !formMessage || !submitButton) {
        console.error("The contact form elements were not found.");
        return;
    }

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        formMessage.textContent = "";
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        setTimeout(function () {
            formMessage.textContent =
                "Your message has been sent successfully!";

            contactForm.reset();

            submitButton.disabled = false;
            submitButton.innerHTML =
                'Send Message <i class="fa-solid fa-paper-plane"></i>';
        }, 1000);
    });
}