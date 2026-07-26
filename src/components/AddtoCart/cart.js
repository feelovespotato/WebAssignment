const CART_STORAGE_KEY = "pokkaCart";


document.addEventListener("DOMContentLoaded", async function () {
    setupCartClickEvents();

    /*
        Only the cart page loads its own navbar and footer here.
        Other pages can continue using their existing JavaScript.
    */
    if (document.body.dataset.page === "cart") {
        try {
            await Promise.all([
                loadCartComponent(
                    "navbarContainer",
                    "../components/layout/navbar.html"
                ),

                loadCartComponent(
                    "footerContainer",
                    "../components/layout/footer.html"
                )
            ]);

            initialiseCartTheme();
            initialiseCartFooter();
        } catch (error) {
            console.error("Cart page component error:", error);
        }
    }

    updateCartCount();
    renderCartPage();
    watchForNavbar();
});


async function loadCartComponent(containerId, filePath) {
    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    const response = await fetch(filePath);

    if (!response.ok) {
        throw new Error(
            `${filePath} failed to load. Status: ${response.status}`
        );
    }

    container.innerHTML = await response.text();
}


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


/*
    The navbar is inserted using fetch(), so this watches
    for the cart counter to appear.
*/
function watchForNavbar() {
    const observer = new MutationObserver(function () {
        if (document.getElementById("cartCount")) {
            updateCartCount();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
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
                image: addButton.dataset.image
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

    const cartContent =
        document.getElementById("cartContent");

    if (cart.length === 0) {
        emptyCart.style.display = "flex";
        cartContent.style.display = "none";

        updateCartSummary(cart);
        return;
    }

    emptyCart.style.display = "none";
    cartContent.style.display = "grid";

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


    const image = document.createElement("img");
    image.className = "cartItemImage";
    image.src =
        product.image || "../assets/images/product-placeholder.png";
    image.alt = product.name;


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
        image,
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


/* =================================
   THEME
================================= */

function initialiseCartTheme() {
    const themeButton =
        document.getElementById("WebsiteTheme");

    if (!themeButton) {
        return;
    }

    const savedTheme =
        localStorage.getItem("theme") === "dark"
            ? "dark"
            : "light";

    setCartTheme(savedTheme);

    themeButton.addEventListener("click", function () {
        const currentTheme =
            document.documentElement.dataset.theme;

        const nextTheme =
            currentTheme === "dark"
                ? "light"
                : "dark";

        setCartTheme(nextTheme);
    });
}


function setCartTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);

    const themeButton =
        document.getElementById("WebsiteTheme");

    if (themeButton) {
        themeButton.textContent =
            theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode";
    }
}


/* =================================
   FOOTER YEAR
================================= */

function initialiseCartFooter() {
    const footerYear =
        document.getElementById("footerYear");

    if (footerYear) {
        footerYear.textContent =
            new Date().getFullYear();
    }
}