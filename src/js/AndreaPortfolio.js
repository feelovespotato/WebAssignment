document.addEventListener('DOMContentLoaded', async () => {
    await loadAllComponents();
    initPage();
});

/* Fetch every section's HTML into its placeholder */
async function loadAllComponents() {
    const components = [
        ['site-header', '../components/portfolio/Andrea/header.html'],
        ['site-hero', '../components/portfolio/Andrea/hero.html'],
        ['site-bio', '../components/portfolio/Andrea/bio.html'],
        ['site-experience', '../components/portfolio/Andrea/experience.html'],
        ['site-education', '../components/portfolio/Andrea/education.html'],
        ['site-activities', '../components/portfolio/Andrea/activities.html'],
        ['site-certifications', '../components/portfolio/Andrea/certifications.html'],
        ['site-skills', '../components/portfolio/Andrea/skills.html'],
        ['site-projects', '../components/portfolio/Andrea/projects.html'],
        ['site-contact', '../components/portfolio/Andrea/contact.html'],
        ['site-footer', '../components/portfolio/Andrea/footer.html'],
    ];

    try {
        await Promise.all(components.map(([id, file]) => loadComponent(id, file)));
    } catch (err) {
        console.error('One or more components failed to load:', err);
    }
}

function initPage() {

    /* Theme toggle */
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }

    /* Mobile menu */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        icon.className = navMenu.classList.contains('active')
            ? 'fa-solid fa-xmark'
            : 'fa-solid fa-bars';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.querySelector('i').className = 'fa-solid fa-bars';
        });
    });

    /* Typewriter */
    const typewriterElement = document.getElementById('typewrite-text');
    const roles = ["Software Engineer Student"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIndex];
        typewriterElement.textContent = isDeleting
            ? currentRole.substring(0, charIndex - 1)
            : currentRole.substring(0, charIndex + 1);
        charIndex += isDeleting ? -1 : 1;

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1000);

    /* Navigation active-link tracking */
    const sections = document.querySelectorAll('section');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.3 });

    sections.forEach(section => navObserver.observe(section));

    observeAnimations();

    /* Skill proficiency bars */
    const proficiencyItems = document.querySelectorAll('.proficiency-item');
    const barObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    proficiencyItems.forEach(item => barObserver.observe(item));

    /* Mock contact form submission */
    const contactForm = document.getElementById('contact-form');
    const formAlert = document.getElementById('form-alert');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (name && email && message) {
            formAlert.style.display = 'block';
            formAlert.className = 'form-alert success';
            formAlert.innerText = `Thank you for your message, ${name}! I will get back to you soon.`;
            contactForm.reset();

            setTimeout(() => {
                formAlert.style.display = 'none';
            }, 5000);
        }
    });
}