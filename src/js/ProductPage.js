
// load all components first, THEN observe
async function init() {
    await Promise.all([
        loadComponent('welcoming', '../components/productpage/Welcomingsection.html'),
        loadComponent('category', '../components/productpage/ProductCategory.html'),
        loadComponent('Search', '../components/productpage/Searchbar.html')
    ]);
    
    await loadComponent('search-component', '../components/productpage/Searchcomponent.html');

    initSearchBar();
    observeAnimations(); // runs after all components are in the DOM
   
}

document.addEventListener('DOMContentLoaded', init);
//CHECKED