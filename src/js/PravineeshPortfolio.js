document.addEventListener(
    "DOMContentLoaded",
    async function () {
        await loadPortfolioComponents();

        initialiseCertificationToggle();
        initialiseExperienceToggle();
        initialiseSkillBarReplay();
        initialiseHeroEntranceAnimation();
        initialiseAnimatedHeroText();
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

/*Components*/

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
        containerId: "certificationsContainer",
        filePath: "/src/components/portfolio/Pravineesh/certifications.html"
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

/*Footer Year*/

function initialisePortfolioYear() {
    const portfolioYear =
        document.getElementById("portfolioYear");

    if (portfolioYear) {
        portfolioYear.textContent =
            new Date().getFullYear();
    }
}

/*For smooth scrolling*/

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

/*Mobile Nav*/

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

/*Active Nav*/

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

/*Scroll Reveal*/

function initialiseScrollReveal() {
    const selectors = [
        ".sectionHeading",
        ".aboutText",
        ".aboutDetails",
        ".skillCategory",
        ".projectCard",
        ".timeline-item",
        ".cardEducation",
        ".certificationCard",
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

/*Contact Form*/

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

/*Page Entry Animation*/

function initialisePageEntry() {
    const body = document.body;

    RequestAnimationFrame(function () {
        body.classList.add(
            "portfolioLoaded"
        );
    });
}   

/* =========================================
   HERO ENTRANCE ANIMATION
========================================= */

function initialiseHeroEntranceAnimation() {
    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {
        return;
    }

    requestAnimationFrame(function () {
        const header =
            document.querySelector(".portfolioHeader");

        const welcomeText =
            document.querySelector(".introductionHero");

        const mainHeading =
            document.querySelector(".hero-content h1");

        /*const subtitle =
            document.querySelector(".hero-content h2");

        const description =
            document.querySelector(".descriptionHero");*/

        const buttons =
            document.querySelectorAll(
                ".buttonsHero a"
            );

        const socialIcons =
            document.querySelectorAll(
                ".socialsHero a"
            );

        const imageContainer =
            document.querySelector(
                ".imageHeroContainer"
            );


        animateElement(
            header,
            [
                {
                    opacity: 0,
                    transform: "translateY(-70px)"
                },
                {
                    opacity: 1,
                    transform: "translateY(0)"
                }
            ],
            700,
            0
        );


        animateElement(
            welcomeText,
            [
                {
                    opacity: 0,
                    transform: "translateY(-25px)",
                    letterSpacing: "8px"
                },
                {
                    opacity: 1,
                    transform: "translateY(0)",
                    letterSpacing: "normal"
                }
            ],
            700,
            200
        );


        animateElement(
            mainHeading,
            [
                {
                    opacity: 0,
                    transform:
                        "translateY(60px) scale(0.9)",
                    filter: "blur(12px)"
                },
                {
                    opacity: 1,
                    transform:
                        "translateY(-6px) scale(1.02)",
                    filter: "blur(0)"
                },
                {
                    opacity: 1,
                    transform:
                        "translateY(0) scale(1)",
                    filter: "blur(0)"
                }
            ],
            1000,
            350
        );


        /*animateElement(
            subtitle,
            [
                {
                    opacity: 0,
                    transform: "translateX(-60px)"
                },
                {
                    opacity: 1,
                    transform: "translateX(0)"
                }
            ],
            750,
            650
        );


        animateElement(
            description,
            [
                {
                    opacity: 0,
                    transform: "translateY(35px)"
                },
                {
                    opacity: 1,
                    transform: "translateY(0)"
                }
            ],
            750,
            850
        );*/


        buttons.forEach(function (button, index) {
            animateElement(
                button,
                [
                    {
                        opacity: 0,
                        transform:
                            "translateY(35px) scale(0.85)"
                    },
                    {
                        opacity: 1,
                        transform:
                            "translateY(0) scale(1)"
                    }
                ],
                650,
                1050 + index * 150,
                "cubic-bezier(0.34, 1.56, 0.64, 1)"
            );
        });


        socialIcons.forEach(function (icon, index) {
            animateElement(
                icon,
                [
                    {
                        opacity: 0,
                        transform:
                            "translateY(35px) scale(0.2) rotate(-25deg)"
                    },
                    {
                        opacity: 1,
                        transform:
                            "translateY(0) scale(1) rotate(0deg)"
                    }
                ],
                600,
                1350 + index * 130,
                "cubic-bezier(0.34, 1.56, 0.64, 1)"
            );
        });


        animateElement(
            imageContainer,
            [
                {
                    opacity: 0,
                    transform:
                        "translateX(100px) scale(0.7) rotate(8deg)",
                    filter: "blur(10px)"
                },
                {
                    opacity: 1,
                    transform:
                        "translateX(-8px) scale(1.03) rotate(-1deg)",
                    filter: "blur(0)"
                },
                {
                    opacity: 1,
                    transform:
                        "translateX(0) scale(1) rotate(0deg)",
                    filter: "blur(0)"
                }
            ],
            1100,
            450
        );
    });
}


function animateElement(
    element,
    keyframes,
    duration,
    delay,
    easing = "cubic-bezier(0.16, 1, 0.3, 1)"
) {
    if (!element) {
        return;
    }

    const animationSpeed= 2.5;

    element.animate(
        keyframes,
        {
            duration: duration * animationSpeed,
            delay: delay * animationSpeed,
            easing: easing,
            fill: "both"
        }
    );
}

/* =========================================
   CHARACTER AND WORD ANIMATION
========================================= */

function initialiseAnimatedHeroText() {
    const subtitle =
        document.querySelector(".hero-content h2");

    const description =
        document.querySelector(".descriptionHero");

    if (!subtitle || !description) {
        return;
    }

    if (
        subtitle.dataset.animated === "true" ||
        description.dataset.animated === "true"
    ) {
        return;
    }

    subtitle.dataset.animated = "true";
    description.dataset.animated = "true";


    /* Subtitle — word by word */

    const subtitleWords =
        subtitle.textContent
            .trim()
            .split(/\s+/);

    subtitle.textContent = "";

    subtitleWords.forEach(function (word, index) {
        const wordSpan =
            document.createElement("span");

        wordSpan.className =
            "subtitleRevealWord";

        wordSpan.textContent = word;

        wordSpan.style.animationDelay =
            `${700 + index * 250}ms`;

        subtitle.appendChild(wordSpan);

        subtitle.appendChild(
            document.createTextNode(" ")
        );
    });


    /* Paragraph — one smooth flow */

    const paragraphStartDelay =
        700 + subtitleWords.length * 250 + 300;

    description.classList.add(
        "paragraphFlowIn"
    );

    description.style.animationDelay =
        `${paragraphStartDelay}ms`;
}

function initialiseSkillBarReplay() {
    const skillCards =
        document.querySelectorAll("details.skillCategory");

    skillCards.forEach(function (card) {
        card.addEventListener("toggle", function () {
            if (!card.open) {
                return;
            }

            const progressBars =
                card.querySelectorAll(".skillBarFill");

            progressBars.forEach(function (bar) {
                /*
                    Temporarily removes the animation,
                    forces the browser to reset it,
                    and then starts it again.
                */
                bar.style.animation = "none";

                void bar.offsetWidth;

                bar.style.animation = "";
            });
        });
    });
}

function initialiseExperienceToggle() {
    const toggleButton =
        document.getElementById("experienceToggleButton");

    const extraExperiences =
        document.getElementById("extraExperiences");

    if (!toggleButton || !extraExperiences) {
        return;
    }

    const buttonText =
        toggleButton.querySelector(".experienceToggleText");

    toggleButton.addEventListener("click", function () {
        const isOpen =
            extraExperiences.classList.toggle("open");

        toggleButton.classList.toggle("open", isOpen);

        toggleButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        extraExperiences.setAttribute(
            "aria-hidden",
            String(!isOpen)
        );

        buttonText.textContent = isOpen
            ? "View Less"
            : "View More";

        if (!isOpen) {
            document
                .getElementById("experience")
                .scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
        }
    });
}

function initialiseCertificationToggle() {
    const toggleButton =
        document.getElementById("certificationToggleButton");

    const extraCertifications =
        document.getElementById("extraCertifications");

    if (!toggleButton || !extraCertifications) {
        return;
    }

    const buttonText =
        toggleButton.querySelector(".certificationToggleText");

    toggleButton.addEventListener("click", function () {
        const isOpen =
            extraCertifications.classList.toggle("open");

        toggleButton.classList.toggle("open", isOpen);

        toggleButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        extraCertifications.setAttribute(
            "aria-hidden",
            String(!isOpen)
        );

        buttonText.textContent = isOpen
            ? "View Fewer Certificates"
            : "View More Certificates";

        if (!isOpen) {
            document
                .getElementById("certifications")
                .scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
        }
    });
}