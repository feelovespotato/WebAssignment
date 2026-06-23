
// load all components first, THEN observe
async function init() {
    await loadComponent('herobar', '../components/portfolio/Coshin/herobar.html');
    //await loadComponent('skills', '../components/productpage/ProductCategory.html');
    //await loadComponent('achievements', '../components/productpage/Searchbar.html');
    //await loadComponent('cv', '../components/portfolio/')
    
    
    observeAnimations(); // runs after all components are in the DOM
    
}

init();