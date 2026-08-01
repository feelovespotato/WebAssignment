const CART_STORAGE_KEY = "pokkaCart";

document.addEventListener("DOMContentLoaded", function () {
    setupCartClickEvents();
});


/* =================================
   CART STORAGE
================================= */

function getCart() {
    try {
        const savedCart =
            JSON.parse(localStorage.getItem(CART_STORAGE_KEY));

        return Array.isArray(savedCart) ? savedCart : [];
    } catch (error) {
        console.error("The saved cart could not be read:", error);
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
    );

    updateCartCount();
    renderCartPage();
}


/* =================================
   ADD PRODUCT
================================= */

function addToCart(product) {
    if (!product.id || !product.name || Number.isNaN(product.price)) {
        console.error("Invalid product information:", product);
        return;
    }

    const cart = getCart();

    const existingProduct = cart.find(function (item) {
        return item.id === product.id;
    });

    // Capture custom quantity passed from product page, default to 1
    const quantityToAdd = product.quantity ? Number(product.quantity) : 1;

    if (existingProduct) {
        existingProduct.quantity += quantityToAdd;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || "",
            quantity: quantityToAdd
        });
    }

    saveCart(cart);
    showCartNotification(`${product.name} added to cart`);
}


/* =================================
   REMOVE AND QUANTITY
================================= */

function removeFromCart(productId) {
    const cart = getCart().filter(function (item) {
        return item.id !== productId;
    });

    saveCart(cart);
}

function changeCartQuantity(productId, change) {
    const cart = getCart();

    const product = cart.find(function (item) {
        return item.id === productId;
    });

    if (!product) {
        return;
    }

    product.quantity += change;

    if (product.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart(cart);
}

function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);

    updateCartCount();
    renderCartPage();
}


/* =================================
   CART COUNT
================================= */

function updateCartCount() {
    const cartCount =
        document.getElementById("cartCount");

    if (!cartCount) {
        return;
    }

    const totalQuantity = getCart().reduce(
        function (total, item) {
            return total + item.quantity;
        },
        0
    );

    cartCount.textContent = totalQuantity;

    cartCount.style.display =
        totalQuantity > 0 ? "flex" : "none";
}

/* =================================
   CLICK EVENTS
================================= */

function setupCartClickEvents() {
    document.addEventListener("click", function (event) {
        const addButton =
            event.target.closest(".addToCartButton");

        if (addButton) {
            const product = {
                id: addButton.dataset.id,
                name: addButton.dataset.name,
                price: Number(addButton.dataset.price),
                image: addButton.dataset.image,
                quantity: Number(addButton.dataset.quantity) || 1
            };

            addToCart(product);
            return;
        }

        const quantityButton =
            event.target.closest(".quantityButton");

        if (quantityButton) {
            const productId =
                quantityButton.dataset.id;

            const action =
                quantityButton.dataset.action;

            changeCartQuantity(
                productId,
                action === "increase" ? 1 : -1
            );

            return;
        }

        const removeButton =
            event.target.closest(".removeCartItem");

        if (removeButton) {
            removeFromCart(removeButton.dataset.id);
            return;
        }

        if (event.target.closest("#clearCartButton")) {
            const confirmed =
                confirm("Remove all products from your cart?");

            if (confirmed) {
                clearCart();
            }

            return;
        }

        if (event.target.closest("#checkoutButton")) {
            const cart = getCart();

            if (cart.length === 0) {
                alert("Your cart is empty.");
                return;
            }

            alert(
                "Checkout is not connected yet. Your cart is ready!"
            );
        }
    });
}


/* =================================
   DISPLAY CART PAGE
================================= */

function renderCartPage() {
    const cartItemsContainer =
        document.getElementById("cartItems");

    if (!cartItemsContainer) {
        return;
    }

    const cart = getCart();

    const emptyCart =
        document.getElementById("emptyCart");

    const emptyCartSection =
        emptyCart ? emptyCart.closest("section") : null;

    const cartContent =
        document.getElementById("cartContent");

    if (cart.length === 0) {
        emptyCart.style.display = "flex";
        if (emptyCartSection) emptyCartSection.style.display = "block";
        cartContent.style.display = "none";

        updateCartSummary(cart);
        return;
    }

    emptyCart.style.display = "none";
    if (emptyCartSection) emptyCartSection.style.display = "none";
    cartContent.style.display = "flex";

    cartItemsContainer.innerHTML = "";

    cart.forEach(function (product) {
        const item = createCartItem(product);
        cartItemsContainer.appendChild(item);
    });

    updateCartSummary(cart);
}

function createCartItem(product) {
    const cartItem = document.createElement("article");
    cartItem.className = "cartItem";

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "img-wrapper ";

    const image = document.createElement("img");
    image.src =
        product.image || "../assets/images/product-placeholder.png";
    image.alt = product.name;

    imageWrapper.appendChild(image);

    const information = document.createElement("div");
    information.className = "cartItemInformation";

    const name = document.createElement("h2");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.className = "halfvisibletext";
    price.textContent = formatCurrency(product.price);

    const quantityControls = document.createElement("div");
    quantityControls.className = "quantityControls";

    const decreaseButton = document.createElement("button");
    decreaseButton.type = "button";
    decreaseButton.className = "quantityButton";
    decreaseButton.dataset.id = product.id;
    decreaseButton.dataset.action = "decrease";
    decreaseButton.setAttribute(
        "aria-label",
        `Decrease ${product.name} quantity`
    );
    decreaseButton.textContent = "−";

    const quantity = document.createElement("span");
    quantity.className = "quantityNumber";
    quantity.textContent = product.quantity;

    const increaseButton = document.createElement("button");
    increaseButton.type = "button";
    increaseButton.className = "quantityButton";
    increaseButton.dataset.id = product.id;
    increaseButton.dataset.action = "increase";
    increaseButton.setAttribute(
        "aria-label",
        `Increase ${product.name} quantity`
    );
    increaseButton.textContent = "+";

    quantityControls.append(
        decreaseButton,
        quantity,
        increaseButton
    );

    information.append(
        name,
        price,
        quantityControls
    );

    const actions = document.createElement("div");
    actions.className = "cartItemActions";

    const itemTotal = document.createElement("p");
    itemTotal.className = "cartItemTotal";
    itemTotal.textContent = formatCurrency(
        product.price * product.quantity
    );

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "removeCartItem";
    removeButton.dataset.id = product.id;
    removeButton.textContent = "Remove";

    actions.append(
        itemTotal,
        removeButton
    );

    cartItem.append(
        imageWrapper,
        information,
        actions
    );

    return cartItem;
}

function updateCartSummary(cart) {
    const itemCount =
        document.getElementById("summaryItemCount");

    const subtotalElement =
        document.getElementById("cartSubtotal");

    const totalElement =
        document.getElementById("cartTotal");

    const totalQuantity = cart.reduce(
        function (total, product) {
            return total + product.quantity;
        },
        0
    );

    const subtotal = cart.reduce(
        function (total, product) {
            return total +
                product.price * product.quantity;
        },
        0
    );

    if (itemCount) {
        itemCount.textContent = totalQuantity;
    }

    if (subtotalElement) {
        subtotalElement.textContent =
            formatCurrency(subtotal);
    }

    if (totalElement) {
        totalElement.textContent =
            formatCurrency(subtotal);
    }
}

function formatCurrency(amount) {
    return `RM${Number(amount).toFixed(2)}`;
}


/* =================================
   CART NOTIFICATION
================================= */

function showCartNotification(message) {
    let notification =
        document.querySelector(".cartNotification");

    if (!notification) {
        notification = document.createElement("div");
        notification.className = "cartNotification";

        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.classList.add("show");

    clearTimeout(notification.hideTimer);

    notification.hideTimer = setTimeout(function () {
        notification.classList.remove("show");
    }, 2000);
}


async function initCartPage() {
    await loadComponent("cartBreadcrumbSection", "../components/shared/breadcrumb.html");
    await loadComponent("cartHeader", "../components/AddtoCart/cartheader.html");

    setBreadcrumbCurrent("Cart");
    await loadComponent("emptyCartSection", "../components/AddtoCart/emptycart.html");
    await loadComponent("cartItemHeaderSection", "../components/AddtoCart/carditemheader.html");
    await loadComponent("cartSummarySection", "../components/AddtoCart/cartsummary.html");

    renderCartPage();
    observeAnimations();
}

// Execute the component loading on page load
document.addEventListener("DOMContentLoaded", initCartPage);