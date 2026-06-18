
// load all components first, THEN observe
async function init() {
    await loadComponent('welcoming', '../components/productpage/Welcomingsection.html');
    await loadComponent('category', '../components/productpage/ProductCategory.html');
    await loadComponent('Search', '../components/productpage/Searchbar.html');
    await loadComponent("carousel", "../components/productpage/carouselproduct.html")
    
    observeAnimations(); // runs after all components are in the DOM
    initCarousel();
}

init();