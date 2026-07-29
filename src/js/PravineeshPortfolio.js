document.addEventListener("DOMContentLoaded", async function () {
    try {
        await loadPortfolioComponents();
        initialisePortfolioYear();
        initialiseSmoothScrolling();
        initialiseMobileNavigation();
        initialiseActiveNavigation();
        initialiseScrollReveal();
        initialiseContactForm();
        console.log("Portfolio loaded successfully.");
    } catch (error) {
        console.error("Portfolio loading error:", error);
    }
});

/*Component*/
async function loadPortfolioComponents() {
    const components = [
        {
            containerId: "headerContainer",
            filePath: "../components/portfolio/header.html"
        },
        {
            containerId: "heroContainer",
            filePath: "../components/portfolio/hero.html"
        },
        {
            containerId: "aboutMeContainer",
            filePath: "../components/portfolio/aboutMe.html"
        },
        {
            containerId: "skillsContainer",
            filePath: "../components/portfolio/skills.html"
        },
        {
            containerId: "projectsContainer",
            filePath: "../components/portfolio/projects.html"
        },
        {
            containerId: "experienceContainer",
            filePath: "../components/portfolio/experience.html"
        },
        {
            containerId: "educationContainer",
            filePath: "../components/portfolio/education.html"
        },
        {
            containerId: "activitiesContainer",
            filePath: "../components/portfolio/activities.html"
        },
        {
            containerId: "contactContainer",
            filePath: "../components/portfolio/contact.html"
        },
        {
            containerId: "footerContainer",
            filePath: "../components/portfolio/footer.html"
        }
    ];

    await Promise.all(
        components.map(function (component) {
            return loadPortfolioComponent(
                component.containerId,
                component.filePath
            );
        })
    );
}

async function loadPortfolioComponent(containerId, filePath) {
    const container = document.getElementById(containerId);

    if (!container) {
        console.warn(
            `Portfolio container "${containerId}" was not found.`
        );

        return;
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

/*Footer Year*/
function initialisePortfolioYear() {
    const portfolioYear =
        document.getElementById("portfolioYear");

    if (portfolioYear) {
        portfolioYear.textContent =
            new Date().getFullYear();
    }
}

/*Seamless scrolling*/
function initialiseSmoothScrolling() {
    document.addEventListener("click", function (event) {
        const anchor = event.target.closest('a[href^="#"]');

        if (!anchor) {
            return;
        }

        const targetId = anchor.getAttribute("href");

        if (!targetId || targetId === "#") {
            return;
        }

        const targetElement =
            document.querySelector(targetId);

        if (!targetElement) {
            return;
        }

        event.preventDefault();

        targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        closeMobileNavigation();
    });
}


/* Mobile Navigation*/

function initialiseMobileNavigation() {
    const header =
        document.querySelector(".headerPortfolio");

    const navigation =
        document.querySelector(".navPortfolio");

    if (!header || !navigation) {
        return;
    }

    let mobileMenuButton =
        document.querySelector(".mobileMenuButton");

    /*
        Creates the menu button automatically if it is not
        already written inside header.html.
    */
    if (!mobileMenuButton) {
        mobileMenuButton =
            document.createElement("button");

        mobileMenuButton.type = "button";
        mobileMenuButton.className = "mobileMenuButton";

        mobileMenuButton.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        mobileMenuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileMenuButton.innerHTML =
            '<i class="fa-solid fa-bars"></i>';

        header.appendChild(mobileMenuButton);
    }

    mobileMenuButton.addEventListener(
        "click",
        function () {
            const menuIsOpen =
                navigation.classList.toggle("open");

            mobileMenuButton.setAttribute(
                "aria-expanded",
                String(menuIsOpen)
            );

            mobileMenuButton.setAttribute(
                "aria-label",
                menuIsOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );

            mobileMenuButton.innerHTML =
                menuIsOpen
                    ? '<i class="fa-solid fa-xmark"></i>'
                    : '<i class="fa-solid fa-bars"></i>';
        }
    );

    window.addEventListener("resize", function () {
        if (window.innerWidth > 900) {
            closeMobileNavigation();
        }
    });
}


function closeMobileNavigation() {
    const navigation =
        document.querySelector(".navPortfolio");

    const mobileMenuButton =
        document.querySelector(".mobileMenuButton");

    if (navigation) {
        navigation.classList.remove("open");
    }

    if (mobileMenuButton) {
        mobileMenuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileMenuButton.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        mobileMenuButton.innerHTML =
            '<i class="fa-solid fa-bars"></i>';
    }
}

/*Active Navigation Link*/

function initialiseActiveNavigation() {
    const sections = Array.from(
        document.querySelectorAll("main section[id]")
    );

    const navigationLinks = Array.from(
        document.querySelectorAll(
            '.portfolioNav a[href^="#"]'
        )
    );

    if (
        sections.length === 0 ||
        navigationLinks.length === 0
    ) {
        return;
    }

    const sectionObserver = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                const activeSectionId =
                    `#${entry.target.id}`;

                navigationLinks.forEach(
                    function (navigationLink) {
                        navigationLink.classList.toggle(
                            "active",
                            navigationLink.getAttribute(
                                "href"
                            ) === activeSectionId
                        );
                    }
                );
            });
        },
        {
            root: null,
            rootMargin: "-35% 0px -55% 0px",
            threshold: 0
        }
    );

    sections.forEach(function (section) {
        sectionObserver.observe(section);
    });
}


/*Scroll reveal animation*/

function initialiseScrollReveal() {
    const revealSelectors = [
        ".aboutText",
        ".aboutDetails",
        ".skillCategory",
        ".projectCard",
        ".timeline-item",
        ".cardEducation",
        ".cardActivities",
        ".itemContact",
        ".formContact"
    ];

    const revealElements =
        document.querySelectorAll(
            revealSelectors.join(",")
        );

    if (revealElements.length === 0) {
        return;
    }

    revealElements.forEach(function (element) {
        element.classList.add("revealElement");
    });

    const revealObserver = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -50px 0px"
        }
    );

    revealElements.forEach(function (element) {
        revealObserver.observe(element);
    });
}

/*Contact Form*/

function initialiseContactForm() {
    const formContact =
        document.getElementById("formContact");

    if (!formContact) {
        return;
    }

    formContact.addEventListener(
        "submit",
        function (event) {
            event.preventDefault();

            const nameInput =
                document.getElementById("contactName");

            const emailInput =
                document.getElementById("contactEmail");

            const subjectInput =
                document.getElementById("contactSubject");

            const messageInput =
                document.getElementById("contactMessage");

            if (
                !nameInput ||
                !emailInput ||
                !subjectInput ||
                !messageInput
            );

            }

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectInput.value.trim();
            const message = messageInput.value.trim();

            if (
                name === "" ||
                email === "" ||
                subject === "" ||
                message === ""
            ) {
                showContactStatus(
                    contactStatus,
                    "Please complete all fields.",
                    "error"
                );

                return;
            }

            if (!emailInput.checkValidity()) {
                showContactStatus(
                    contactStatus,
                    "Please enter a valid email address.",
                    "error"
                );

                emailInput.focus();
                return;
            }

            const submitButton =
                contactForm.querySelector(
                    'button[type="submit"]'
                );

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";
            }

            /*
                Demonstration delay. This does not actually send
                an email because a backend or email service is
                required.
            */
            setTimeout(function () {
                showContactStatus(
                    contactStatus,
                    `Thank you, ${name}. Your message form was submitted successfully.`,
                    "success"
                );

                contactForm.reset();

                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent =
                        "Send Message";
                }
            }, 700);
        }
    );
}


function showContactStatus(element, message, type) {
    element.textContent = message;

    element.classList.remove(
        "success",
        "error"
    );

    element.classList.add(type);
}