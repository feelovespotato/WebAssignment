const CART_STORAGE_KEY = "pokkaCart";

document.addEventListener("DOMContentLoaded", async function () {
    setupCartClickEvents();
    watchForNavbar();

    if (document.body.dataset.page === "cart") {
        await initialiseCartPage();
    } else {
        updateCartCount();
    }
});

async function initialiseCartPage() {
    const cartContainer = document.getElementById("cartContainer");

    try {
        await Promise.all([
            loadCartComponent(
                "navbar",
                "/src/components/layout/navbar.html"
            ),

            loadCartComponent(
                "cartContainer",
                "/src/components/AddtoCart/cart.html"
            ),

            loadCartComponent(
                "footer",
                "/src/components/layout/footer.html"
            )
        ]);

        initialiseCartTheme();
        initialiseCartFooter();

        updateCartCount();
        renderCartPage();
    } catch (error) {
        console.error("Cart page loading error:", error);

        if (cartContainer) {
            cartContainer.innerHTML = `
                <div class="emptyCart">
                    <div class="emptyCartIcon">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>

                    <h2>The cart could not be loaded</h2>

                    <p>
                        ${error.message}
                    </p>

                    
                        href="/src/pages/ProductPage.html"
                        class="continueShoppingButton"
                    >
                        Return to Products
                    </a>
                </div>
            `;
        }
    }
}

async function loadCartComponent(containerId, filePath) {
    const container = document.getElementById(containerId);

    if (!container) {
        throw new Error(
            containerId + " does not exist in CartPage.html."
        );
    }

    const response = await fetch(filePath);

    if (!response.ok) {
        throw new Error(
            filePath + " returned error " + response.status + "."
        );
    }

    container.innerHTML = await response.text();
}

/* Cart storage */

function getCart() {
    try {
        const savedCart = JSON.parse(
            localStorage.getItem(CART_STORAGE_KEY)
        );

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

/* Add products */

function addToCart(product) {
    if (
        !product.id ||
        !product.name ||
        !Number.isFinite(product.price)
    ) {
        console.error("Invalid product information:", product);
        return;
    }

    const cart = getCart();

    const existingProduct = cart.find(function (item) {
        return item.id === product.id;
    });

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || "",
            quantity: 1
        });
    }

    saveCart(cart);

    showCartNotification(
        product.name + " was added to your cart."
    );
}

/* Remove and change quantity */

function removeFromCart(productId) {
    const updatedCart = getCart().filter(function (item) {
        return item.id !== productId;
    });

    saveCart(updatedCart);
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

/* Cart counter */

function updateCartCount() {
    const cartCount = document.getElementById("cartCount");

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

function watchForNavbar() {
    if (document.getElementById("cartCount")) {
        updateCartCount();
        return;
    }

    const observer = new MutationObserver(function () {
        if (document.getElementById("cartCount")) {
            updateCartCount();
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(function () {
        observer.disconnect();
    }, 5000);
}

/* Click events */

function setupCartClickEvents() {
    document.addEventListener("click", function (event) {
        const addButton = event.target.closest(
            ".addToCartButton"
        );

        if (addButton) {
            const product = {
                id: addButton.dataset.id,
                name: addButton.dataset.name,
                price: Number(addButton.dataset.price),
                image: addButton.dataset.image || ""
            };

            addToCart(product);
            return;
        }

        const quantityButton = event.target.closest(
            ".quantityButton"
        );

        if (quantityButton) {
            const productId = quantityButton.dataset.id;
            const action = quantityButton.dataset.action;

            changeCartQuantity(
                productId,
                action === "increase" ? 1 : -1
            );

            return;
        }

        const removeButton = event.target.closest(
            ".removeCartItem"
        );

        if (removeButton) {
            removeFromCart(removeButton.dataset.id);
            return;
        }

        if (event.target.closest("#clearCartButton")) {
            const confirmed = window.confirm(
                "Remove all products from your cart?"
            );

            if (confirmed) {
                clearCart();
            }

            return;
        }

        if (event.target.closest("#checkoutButton")) {
            const cart = getCart();

            if (cart.length === 0) {
                window.alert("Your cart is empty.");
                return;
            }

            window.alert(
                "Checkout is not connected yet, but your cart is ready!"
            );
        }
    });
}

/* Display cart */

function renderCartPage() {
    const cartItemsContainer =
        document.getElementById("cartItems");

    const emptyCart =
        document.getElementById("emptyCart");

    const cartContent =
        document.getElementById("cartContent");

    if (
        !cartItemsContainer ||
        !emptyCart ||
        !cartContent
    ) {
        return;
    }

    const cart = getCart();

    if (cart.length === 0) {
        emptyCart.style.display = "flex";
        cartContent.style.display = "none";

        cartItemsContainer.innerHTML = "";

        updateCartSummary(cart);
        return;
    }

    emptyCart.style.display = "none";
    cartContent.style.display = "grid";

    cartItemsContainer.innerHTML = "";

    cart.forEach(function (product) {
        const cartItem = createCartItem(product);
        cartItemsContainer.appendChild(cartItem);
    });

    updateCartSummary(cart);
}

function createCartItem(product) {
    const cartItem = document.createElement("article");
    cartItem.className = "cartItem";

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "cartItemImageWrapper";

    if (product.image) {
        const image = document.createElement("img");

        image.className = "cartItemImage";
        image.src = product.image;
        image.alt = product.name;

        image.addEventListener("error", function () {
            imageWrapper.innerHTML =
                '<i class="fa-solid fa-bottle-water"></i>';
        });

        imageWrapper.appendChild(image);
    } else {
        imageWrapper.innerHTML =
            '<i class="fa-solid fa-bottle-water"></i>';
    }

    const information = document.createElement("div");
    information.className = "cartItemInformation";

    const name = document.createElement("h3");
    name.className = "cartItemName";
    name.textContent = product.name;

    const price = document.createElement("p");
    price.className = "cartItemPrice";
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
        "Decrease " + product.name + " quantity"
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
        "Increase " + product.name + " quantity"
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
    return "RM" + Number(amount).toFixed(2);
}

/* Notification */

function showCartNotification(message) {
    let notification = document.querySelector(
        ".cartNotification"
    );

    if (!notification) {
        notification = document.createElement("div");
        notification.className = "cartNotification";

        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.classList.add("show");

    window.clearTimeout(notification.hideTimer);

    notification.hideTimer = window.setTimeout(
        function () {
            notification.classList.remove("show");
        },
        2000
    );
}

/* Theme */

function initialiseCartTheme() {
    const themeButton =
        document.getElementById("WebsiteTheme");

    const root = document.documentElement;

    const savedTheme =
        localStorage.getItem("theme") === "dark"
            ? "dark"
            : "light";

    root.setAttribute("data-theme", savedTheme);

    if (!themeButton) {
        return;
    }

    updateThemeButtonText(themeButton, savedTheme);

    themeButton.addEventListener("click", function () {
        const currentTheme =
            root.getAttribute("data-theme");

        const nextTheme =
            currentTheme === "dark"
                ? "light"
                : "dark";

        root.setAttribute("data-theme", nextTheme);
        localStorage.setItem("theme", nextTheme);

        updateThemeButtonText(themeButton, nextTheme);
    });
}

function updateThemeButtonText(button, theme) {
    button.textContent =
        theme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode";
}

/* Footer */

function initialiseCartFooter() {
    const footerYear =
        document.getElementById("footerYear");

    if (footerYear) {
        footerYear.textContent =
            new Date().getFullYear();
    }
}