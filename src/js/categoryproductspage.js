
const categoryComponents = {
    breadcrumb: "../components/productpage/CategoryBreadcrumb.html",
    grid:       "../components/productpage/CategoryProductGrid.html",
    "search-component":     "../components/productpage/Searchcomponent.html",
};

async function initCategoryProductsPage() {
    await Promise.all(
        Object.entries(categoryComponents).map(([id, url]) => loadComponent(id, url))
    );

    initSearchBar();

    const category = new URLSearchParams(window.location.search).get("category");
    const products = productsData.filter((p) => p.category === category);

    if (!category || products.length === 0) {
        renderNotFound();
        return;
    }

    renderBreadcrumb(category);
    renderHeading(category);
    renderGrid(products);

    observeAnimations();
}
document.addEventListener("DOMContentLoaded", initCategoryProductsPage);

/*---------------------------------------------------------------*/
//CHECKED 
//breadcrumb + heading  after select category selection                                            */
//for the current directory  
function renderBreadcrumb(category) {
    const current = document.getElementById("category-breadcrumb-current");
    if (current) current.textContent = category;
}

/*for heading after select category */
function renderHeading(category) {
    const heading = document.getElementById("category-heading");
    const subtitle = document.getElementById("category-subtitle");
    if (heading) heading.textContent = category;
    if (subtitle) subtitle.textContent = `Browse our ${category.toLowerCase()} selection`;
}

/*---------------------------------------------------------------*/

//CHECKED
// use in category page after selection for showcase all product 
//each linking to that product's detail page                      

// this to ensure the product rendering wont break if found special words
function escapeHTML(str) {
    if (!str) return "";
    return String(str).replace(/[&<>'"]/g, 
        (tag) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

function renderGrid(products) {
    const grid = document.getElementById("category-products-grid");
    if (!grid) return;

    grid.innerHTML = products
        .map(
            (p) => `
            <a class="card card-transition" style="background-color:var(${escapeHTML(p.categoryBg)});"
               href="ProductDetailPage.html?id=${escapeHTML(p.id)}">
                <div class="img-wrapper">
                    <img src="${escapeHTML(p.images[0])}" alt="${escapeHTML(p.name)}" loading="lazy">
                </div>
                <div class="product-info">
                    <h2>${escapeHTML(p.name)}</h2>
                    <p class="halfvisibletext">${escapeHTML(p.price)}</p>
                </div>
            </a>`
        )
        .join("");
}

//CHECKED