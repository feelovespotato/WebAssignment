document.addEventListener(
    "DOMContentLoaded",
    async function () {
        await loadPortfolioComponents();

        initialisePortfolioYear();
        initialiseSmoothScrolling();
        initialiseMobileNavigation();
        initialiseActiveNavigation();
        initialiseScrollReveal();
        initialiseContactForm();

        console.log(
            "Portfolio initialisation completed."
        );
    }
);


/* =========================================
   COMPONENTS
========================================= */

async function loadPortfolioComponents() {
   const components = [
    {
        containerId: "headerContainer",
        filePath: "/src/components/portfolio/Pravineesh/header.html"
    },
    {
        containerId: "heroContainer",
        filePath: "/src/components/portfolio/Pravineesh/hero.html"
    },
    {
        containerId: "aboutMeContainer",
        filePath: "/src/components/portfolio/Pravineesh/aboutMe.html"
    },
    {
        containerId: "skillsContainer",
        filePath: "/src/components/portfolio/Pravineesh/skills.html"
    },
    {
        containerId: "projectsContainer",
        filePath: "/src/components/portfolio/Pravineesh/projects.html"
    },
    {
        containerId: "experienceContainer",
        filePath: "/src/components/portfolio/Pravineesh/experience.html"
    },
    {
        containerId: "educationContainer",
        filePath: "/src/components/portfolio/Pravineesh/education.html"
    },
    {
        containerId: "activitiesContainer",
        filePath: "/src/components/portfolio/Pravineesh/activities.html"
    },
    {
        containerId: "contactContainer",
        filePath: "/src/components/portfolio/Pravineesh/contact.html"
    },
    {
        containerId: "footerContainer",
        filePath: "/src/components/portfolio/Pravineesh/footer.html"
    }
];
    const results = await Promise.allSettled(
        components.map(function (component) {
            return loadPortfolioComponent(
                component.containerId,
                component.filePath
            );
        })
    );

    results.forEach(function (result, index) {
        if (result.status === "rejected") {
            console.error(
                `Could not load ${components[index].filePath}:`,
                result.reason
            );
        }
    });
}


async function loadPortfolioComponent(
    containerId,
    filePath
) {
    const container =
        document.getElementById(containerId);

    if (!container) {
        throw new Error(
            `Container "${containerId}" was not found.`
        );
    }

    const response = await fetch(filePath);

    if (!response.ok) {
        container.innerHTML = `
            <p style="
                padding: 20px;
                color: #e51938;
                text-align: center;
            ">
                Failed to load ${filePath}
            </p>
        `;

        throw new Error(
            `${filePath} failed to load. Status: ${response.status}`
        );
    }

    container.innerHTML =
        await response.text();

    console.log(
        `${filePath} loaded successfully.`
    );
}


/* =========================================
   FOOTER YEAR
========================================= */

function initialisePortfolioYear() {
    const portfolioYear =
        document.getElementById("portfolioYear");

    if (portfolioYear) {
        portfolioYear.textContent =
            new Date().getFullYear();
    }
}


/* =========================================
   SMOOTH SCROLLING
========================================= */

function initialiseSmoothScrolling() {
    document.addEventListener(
        "click",
        function (event) {
            const anchor =
                event.target.closest(
                    'a[href^="#"]'
                );

            if (!anchor) {
                return;
            }

            const targetId =
                anchor.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
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
        }
    );
}


/* =========================================
   MOBILE NAVIGATION
========================================= */

function initialiseMobileNavigation() {
    const header =
        document.querySelector(
            ".portfolioHeader"
        );

    const navigation =
        document.querySelector(
            ".portfolioNav"
        );

    if (!header || !navigation) {
        console.warn(
            "Portfolio header or navigation was not found."
        );

        return;
    }

    let mobileMenuButton =
        document.querySelector(
            ".mobileMenuButton"
        );

    if (!mobileMenuButton) {
        mobileMenuButton =
            document.createElement("button");

        mobileMenuButton.type = "button";

        mobileMenuButton.className =
            "mobileMenuButton";

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

        header.appendChild(
            mobileMenuButton
        );
    }

    mobileMenuButton.addEventListener(
        "click",
        function () {
            const menuIsOpen =
                navigation.classList.toggle(
                    "open"
                );

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

    window.addEventListener(
        "resize",
        function () {
            if (window.innerWidth > 900) {
                closeMobileNavigation();
            }
        }
    );
}


function closeMobileNavigation() {
    const navigation =
        document.querySelector(
            ".portfolioNav"
        );

    const mobileMenuButton =
        document.querySelector(
            ".mobileMenuButton"
        );

    if (navigation) {
        navigation.classList.remove(
            "open"
        );
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


/* =========================================
   ACTIVE NAVIGATION
========================================= */

function initialiseActiveNavigation() {
    const sections = Array.from(
        document.querySelectorAll(
            "main section[id]"
        )
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

    const sectionObserver =
        new IntersectionObserver(
            function (entries) {
                entries.forEach(
                    function (entry) {
                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        const activeId =
                            `#${entry.target.id}`;

                        navigationLinks.forEach(
                            function (link) {
                                link.classList.toggle(
                                    "active",
                                    link.getAttribute(
                                        "href"
                                    ) === activeId
                                );
                            }
                        );
                    }
                );
            },
            {
                root: null,
                rootMargin:
                    "-35% 0px -55% 0px",
                threshold: 0
            }
        );

    sections.forEach(function (section) {
        sectionObserver.observe(section);
    });
}


/* =========================================
   SCROLL REVEAL
========================================= */

function initialiseScrollReveal() {
    const selectors = [
        ".sectionHeading",
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

    const elements =
        document.querySelectorAll(
            selectors.join(",")
        );

    if (elements.length === 0) {
        return;
    }

    elements.forEach(function (element) {
        element.classList.add(
            "revealElement"
        );
    });

    const revealObserver =
        new IntersectionObserver(
            function (
                entries,
                observer
            ) {
                entries.forEach(
                    function (entry) {
                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );
                    }
                );
            },
            {
                threshold: 0.12,
                rootMargin:
                    "0px 0px -50px 0px"
            }
        );

    elements.forEach(function (element) {
        revealObserver.observe(element);
    });
}


/* =========================================
   CONTACT FORM
========================================= */

function initialiseContactForm() {
    const formContact =
        document.getElementById(
            "formContact"
        ) ||
        document.querySelector(
            ".formContact"
        );

    if (!formContact) {
        console.warn(
            "Contact form was not found."
        );

        return;
    }

    let contactStatus =
        formContact.querySelector(
            ".contactStatus"
        );

    if (!contactStatus) {
        contactStatus =
            document.createElement("p");

        contactStatus.className =
            "contactStatus";

        contactStatus.setAttribute(
            "aria-live",
            "polite"
        );

        formContact.appendChild(
            contactStatus
        );
    }

    formContact.addEventListener(
        "submit",
        function (event) {
            event.preventDefault();

            const nameInput =
                document.getElementById(
                    "contactName"
                );

            const emailInput =
                document.getElementById(
                    "contactEmail"
                );

            const subjectInput =
                document.getElementById(
                    "contactSubject"
                );

            const messageInput =
                document.getElementById(
                    "contactMessage"
                );

            if (
                !nameInput ||
                !emailInput ||
                !subjectInput ||
                !messageInput
            ) {
                showContactStatus(
                    contactStatus,
                    "The contact form is missing one or more fields.",
                    "error"
                );

                return;
            }

            const name =
                nameInput.value.trim();

            const email =
                emailInput.value.trim();

            const subject =
                subjectInput.value.trim();

            const message =
                messageInput.value.trim();

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

            if (
                !emailInput.checkValidity()
            ) {
                showContactStatus(
                    contactStatus,
                    "Please enter a valid email address.",
                    "error"
                );

                emailInput.focus();
                return;
            }

            const submitButton =
                formContact.querySelector(
                    'button[type="submit"]'
                );

            if (submitButton) {
                submitButton.disabled = true;

                submitButton.textContent =
                    "Sending...";
            }

            setTimeout(function () {
                showContactStatus(
                    contactStatus,
                    `Thank you, ${name}. Your form was submitted successfully.`,
                    "success"
                );

                formContact.reset();

                if (submitButton) {
                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Send Message";
                }
            }, 700);
        }
    );
}


function showContactStatus(
    element,
    message,
    type
) {
    if (!element) {
        return;
    }

    element.textContent = message;

    element.classList.remove(
        "success",
        "error"
    );

    element.classList.add(type);
}