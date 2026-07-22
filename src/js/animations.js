function observeAnimations() {
    // Target any unobserved fade elements
    const fadeEls = document.querySelectorAll('.animate-fade-up:not(.in-view)');

    if (!('IntersectionObserver' in window)) {
        fadeEls.forEach(el => el.classList.add('in-view'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    fadeEls.forEach(el => observer.observe(el));
}

//CHECKED