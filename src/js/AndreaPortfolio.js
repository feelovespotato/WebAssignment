document.addEventListener('DOMContentLoaded', async () => {
    await loadAllComponents();
    initPage();
});

/* Fetch every component's HTML*/
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

async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Failed to load component ${filePath}:`, error);
        return false;
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
    
    // Intersection Observer
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { 
        root: null, 
        rootMargin: '-100px 0px -100px 0px',
        threshold: 0.1
    });

    sections.forEach(section => navObserver.observe(section));

    // Scroll-based fallback
    let scrollTimeout;
    function updateActiveLink() {
        let currentSection = '';
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        if (currentSection) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
            });
        }
    }

    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveLink, 50);
    });

    // Run on load
    setTimeout(updateActiveLink, 100);

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

function observeAnimations() {
    const animateElements = document.querySelectorAll('.animate-fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}