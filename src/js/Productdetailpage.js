/*=====================================================================*/
/* ProductDetailPage.js                                                */
/*                                                                      */
/* Renders whichever product matches ?id=... in the URL, using the     */
/* shared productsData.js array. This is the one file/page that        */
/* handles every product in every category — add new products in      */
/* productsData.js, not by duplicating pages.                          */
/*=====================================================================*/

const detailComponents = {
    breadcrumb: "../components/productpage/Breadcrumb.html",
    gallery:    "../components/productpage/Productgallery.html",
    info:       "../components/productpage/Productinfo.html",
    related:    "../components/productpage/Relatedproducts.html",
};

/*data template search in the productsData for that exact item */
async function initProductDetailPage() {
    await Promise.all(
        Object.entries(detailComponents).map(([id, url]) => loadComponent(id, url))
    );

    //Find product data
    const productId = new URLSearchParams(window.location.search).get("id");
    const product = productsData.find((p) => p.id === productId);

    if (!product) {
        renderNotFound();
        return;
    }

    // Render content
    renderBreadcrumb(product);
    renderGallery(product);
    renderInfo(product);

    initGalleryThumbnails();
    initOptionPills(product);
    initQuantityStepper();

    observeAnimations();
}

document.addEventListener("DOMContentLoaded", initProductDetailPage);

/*---------------------------------------------------------------*/
/* breadcrumb                                                       */
/*---------------------------------------------------------------*/
function renderBreadcrumb(product) {
    const categoryLink = document.getElementById("breadcrumb-category");
    const current = document.getElementById("breadcrumb-current");

    if (categoryLink) {
        categoryLink.textContent = product.category;
        categoryLink.href = `../pages/ProductPage.html?category=${encodeURIComponent(product.category)}`;
    }
    if (current) current.textContent = product.name;
}

/*---------------------------------------------------------------*/
/* gallery                                                          */
/*---------------------------------------------------------------*/
function renderGallery(product) {
    const galleryEl = document.getElementById("detail-gallery");
    const mainImage = document.getElementById("main-product-image");
    const thumbRow = document.getElementById("thumbnail-row");

    if (galleryEl) galleryEl.style.backgroundColor = `var(${product.categoryBg})`;

    if (mainImage) {
        mainImage.src = product.images[0];
        mainImage.alt = product.name;
    }

    if (thumbRow) {
        thumbRow.innerHTML = product.images
            .map(
                (src, index) => `
                <div class="img-wrapper${index === 0 ? " active" : ""}">
                    <img src="${src}" alt="${product.name} view ${index + 1}" loading="lazy">
                </div>`
            )
            .join("");
    }
}

/*---------------------------------------------------------------*/
//info panel for each product details                                      
//CHECKED
function renderInfo(product) {
    setText("product-category-tag", product.category);
    setText("product-title", product.name);
    setText("product-description", product.description);
    setText("product-availability", product.availability);
    setText("product-delivery", product.delivery);

    renderPills("size-pills", product.sizes, product.defaultSize);
    renderPills("flavor-pills", product.flavors, product.defaultFlavor); 
    renderPills("pack-pills", product.packs, product.defaultPack);
    
    updatePriceForSelection(product);
}
// get the selected option by user
function getSelectedVariant(product) {
    if (!product.variants) {
        return { price: product.price};
    }

    const selectedSize = document.querySelector("#size-pills .option-pill.active")?.textContent;
    const selectedPack = document.querySelector("#pack-pills .option-pill.active")?.textContent;

    const match = product.variants.find(
        (v) => v.size === selectedSize && v.pack === selectedPack
    );

    return match || product.variants[0];
}
// for price update when select different size
function updatePriceForSelection(product) {
    const variant = getSelectedVariant(product);
    setText("product-price", variant.price);
}

// for the options button
function renderPills(containerId, options, defaultValue) {
    const container = document.getElementById(containerId);
    
    // Add the !options check here so products without flavors don't cause errors
    if (!container || !options) return; 

    container.innerHTML = options
        .map(
            (option) => `
            <button class="option-pill${option === defaultValue ? " active" : ""}">${option}</button>`
        )
        .join("");
}
// set text function for all elements
function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// for img selection below main img
function initGalleryThumbnails() {
    const mainImage = document.getElementById("main-product-image");
    const thumbs = document.querySelectorAll(".thumbnail-row .img-wrapper");

    thumbs.forEach((thumb) => {
        thumb.addEventListener("click", () => {
            thumbs.forEach((t) => t.classList.remove("active"));
            thumb.classList.add("active");

            const thumbImg = thumb.querySelector("img");
            if (mainImage && thumbImg) {
                mainImage.src = thumbImg.src;
                mainImage.alt = thumbImg.alt;
            }
        });
    });
}
// size / pack pills: single active selection per option group

function initOptionPills(product) {
    document.querySelectorAll(".option-group").forEach((group) => {
        const pills = group.querySelectorAll(".option-pill");
        pills.forEach((pill) => {
            pill.addEventListener("click", () => {
                pills.forEach((p) => p.classList.remove("active"));
                pill.classList.add("active");

                // only size + pack selections affect price — flavour
                // doesn't, so this only recalculates when relevant
                const isPriceAffecting = group.querySelector("#size-pills, #pack-pills");

                if (isPriceAffecting) {
                    updatePriceForSelection(product);
                }
            });
        });
    });
}

/*---------------------------------------------------------------*/
/* quantity stepper: min 1, no upper cap set here                  */
/*---------------------------------------------------------------*/
function initQuantityStepper() {
    const stepper = document.querySelector(".quantity-stepper");
    if (!stepper) return;

    const [decreaseBtn, increaseBtn] = stepper.querySelectorAll("button");
    const valueEl = stepper.querySelector(".quantity-value");

    let quantity = parseInt(valueEl.textContent, 10) || 1;

    decreaseBtn.addEventListener("click", () => {
        quantity = Math.max(1, quantity - 1);
        valueEl.textContent = quantity;
    });

    increaseBtn.addEventListener("click", () => {
        quantity += 1;
        valueEl.textContent = quantity;
    });
}

