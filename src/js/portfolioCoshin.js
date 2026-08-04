
// load all components first, THEN observe
async function init() {
    await loadComponent('herobar', '../components/portfolio/Coshin/herobar.html');
    await loadComponent('bio', '../components/portfolio/Coshin/bio.html');

    await Promise.all([
        loadComponent('skills', '../components/portfolio/Coshin/skills.html'),
        loadComponent('projects', '../components/portfolio/Coshin/projects.html'),
        loadComponent('achievements', '../components/portfolio/Coshin/achievements.html'),
    ]);

    observeAnimations();
    initCarousel();
}

document.addEventListener('DOMContentLoaded', init);
//CHECKED