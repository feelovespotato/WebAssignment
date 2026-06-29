
// load all components first, THEN observe
async function init() {
    await loadComponent('herobar', '../components/portfolio/Coshin/herobar.html');
    await loadComponent('skills', '../components/portfolio/Coshin/skills.html');
    await loadComponent('achievements', '../components/portfolio/Coshin/achievements.html');
    //await loadComponent('cv', '../components/portfolio/')
    
    
    observeAnimations(); // runs after all components are in the DOM
    
}

init();