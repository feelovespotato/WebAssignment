
// load all components first, THEN observe
async function init() {
    await Promise.all([
        loadComponent('herobar', '../components/portfolio/Coshin/herobar.html'),
        loadComponent('bio', '../components/portfolio/Coshin/bio.html'),
        loadComponent('skills', '../components/portfolio/Coshin/skills.html'),
        loadComponent('projects', '../components/portfolio/Coshin/projects.html'),
        loadComponent('achievements', '../components/portfolio/Coshin/achievements.html'),
    //await loadComponent('cv', '../components/portfolio/')
    ]);
    
    observeAnimations(); // runs after all components are in the DOM
    initCarousel();
}

document.addEventListener('DOMContentLoaded', init);
//CHECKED