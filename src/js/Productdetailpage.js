
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

    initGalleryThumbnails(product);
    initOptionPills(product);
    initQuantityStepper();
    initAddToCart(product);

    observeAnimations();
}

document.addEventListener("DOMContentLoaded", initProductDetailPage);

// for breadcrumb (back to the previous category fromm the detail product page)
function renderBreadcrumb(product) {
    const categoryLink = document.getElementById("breadcrumb-category");
    const current = document.getElementById("breadcrumb-current");

    if (categoryLink) {
        categoryLink.textContent = product.category;
        
        categoryLink.href = `../pages/CategoryProductsPage.html?category=${encodeURIComponent(product.category)}`;
    }
    if (current) current.textContent = product.name;
}

// for rendering the product img - main detail, main product , thumbnail
function renderGallery(product) {
    const galleryEl = document.getElementById("detail-gallery");
    const mainImage = document.getElementById("main-product-image");
    const thumbRow = document.getElementById("thumbnail-row");

    if (galleryEl) galleryEl.style.backgroundColor = `var(${product.categoryBg})`;

    if (mainImage) {
        mainImage.src = getImageSrc(product.images[0]);
        mainImage.alt = product.name;
    }

    if (thumbRow) {
        thumbRow.innerHTML = product.images
            .map((image, index) => {
                const src = getImageSrc(image);
                const flavor = typeof image === "object" ? image.flavor : null;
                const size = typeof image === "object" ? image.size : null;
                const pack = typeof image === "object" ? image.pack : null;

                const dataAttrs = [
                    flavor ? ` data-flavor="${flavor}"` : "",
                    size ? ` data-size="${size}"` : "",
                    pack ? ` data-pack="${pack}"` : "",
                ].join("");

                return `
                <div class="img-wrapper${index === 0 ? " active" : ""}"${dataAttrs}>
                    <img src="${src}" alt="${product.name} view ${index + 1}" loading="lazy">
                </div>`;
            })
            .join("");
    }
}

//---------------------------------------------------------------------------------------
//info panel for each product details                                      
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
function initGalleryThumbnails(product) {
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

            // Sync whichever pill groups this photo is tagged for —
            // untagged groups (photo not tied to that option) are left alone
            setActivePillFromValue("flavor-pills", thumb.dataset.flavor);
            setActivePillFromValue("size-pills", thumb.dataset.size);
            setActivePillFromValue("pack-pills", thumb.dataset.pack);

            updatePriceForSelection(product);
        });
    });
}

// activates the pill in containerId whose text matches value, if value was
// provided — used when a thumbnail click should carry its option tag over
function setActivePillFromValue(containerId, value) {
    if (!value) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    container.querySelectorAll(".option-pill").forEach((pill) => {
        pill.classList.toggle("active", pill.textContent === value);
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

                syncThumbnailToSelectedOptions();
            });
        });
    });
}

// After a pill click, find a thumbnail tagged to match the current
function syncThumbnailToSelectedOptions() {
    const selectedFlavor = document.querySelector("#flavor-pills .option-pill.active")?.textContent;
    const selectedSize = document.querySelector("#size-pills .option-pill.active")?.textContent;
    const selectedPack = document.querySelector("#pack-pills .option-pill.active")?.textContent;

    const thumbs = document.querySelectorAll(".thumbnail-row .img-wrapper");
    const mainImage = document.getElementById("main-product-image");

    const match = Array.from(thumbs).find((thumb) => {
        const isTagged = thumb.dataset.flavor || thumb.dataset.size || thumb.dataset.pack;
        if (!isTagged) return false;

        const flavorOk = !thumb.dataset.flavor || thumb.dataset.flavor === selectedFlavor;
        const sizeOk = !thumb.dataset.size || thumb.dataset.size === selectedSize;
        const packOk = !thumb.dataset.pack || thumb.dataset.pack === selectedPack;

        return flavorOk && sizeOk && packOk;
    });

    if (!match) return;

    thumbs.forEach((t) => t.classList.remove("active"));
    match.classList.add("active");

    const matchImg = match.querySelector("img");
    if (mainImage && matchImg) {
        mainImage.src = matchImg.src;
        mainImage.alt = matchImg.alt;
    }
}

// quantity stepper for the number text
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

// avoid the some inappropriate product img insert into the product page
function getCartImage(product) {
    const selectedFlavor = document.querySelector("#flavor-pills .option-pill.active")?.textContent;
    const selectedSize = document.querySelector("#size-pills .option-pill.active")?.textContent;
    const selectedPack = document.querySelector("#pack-pills .option-pill.active")?.textContent;
 
    const frontMatch = product.images.find((image) => {
        if (typeof image !== "object" || !image.cartImage) return false;
 
        const flavorOk = !image.flavor || image.flavor === selectedFlavor;
        const sizeOk = !image.size || image.size === selectedSize;
        const packOk = !image.pack || image.pack === selectedPack;
 
        return flavorOk && sizeOk && packOk;
    });
 
    if (frontMatch) return getImageSrc(frontMatch);
 
    const mainImage = document.getElementById("main-product-image");
    return mainImage && mainImage.src ? mainImage.src : getImageSrc(product.images[0]);
}

// Handles gathering product data and sending it to cart.js
function initAddToCart(product) {
    const addToCartBtn = document.getElementById("add-to-cart-btn") || document.querySelector(".purchase-row .solidbutton");
    
    if (!addToCartBtn) return;

    addToCartBtn.addEventListener("click", () => {
        // 1. Get the current quantity from the stepper
        const quantityEl = document.querySelector(".quantity-value");
        const quantity = parseInt(quantityEl.textContent, 10) || 1;

        // 2. Get the active variant price and convert it to a number 
        // cart.js requires the price to be a valid Number to calculate totals
        const variant = getSelectedVariant(product);
        const priceNumber = parseFloat(String(variant.price).replace(/[^0-9.]/g, ""));

        // 3. Grab the active text from the pills (Size, Flavor, Pack)
        const selectedSize = document.querySelector("#size-pills .option-pill.active")?.textContent;
        const selectedFlavor = document.querySelector("#flavor-pills .option-pill.active")?.textContent;
        const selectedPack = document.querySelector("#pack-pills .option-pill.active")?.textContent;

        // Join selected options
        const options = [selectedFlavor, selectedSize, selectedPack].filter(Boolean).join(" - ");
        const displayName = options ? `${product.name} (${options})` : product.name;
        
        // Create a unique ID so different flavors/sizes don't merge into the same cart item
        const uniqueId = options ? `${product.id}-${options.replace(/\s+/g, '-')}` : product.id;
        
       const selectedImage = getCartImage(product);

        // 4. Construct the object exactly as cart.js expects it
        const cartProduct = {
            id: uniqueId, 
            name: displayName,
            price: priceNumber,
            image: selectedImage,
            quantity: quantity
        };

        // 5. Send it to the addToCart function in cart.js
        if (typeof addToCart === "function") {
            addToCart(cartProduct);
        } else {
            console.error("addToCart function not found. Make sure cart.js is linked in your HTML.");
        }
    });
}