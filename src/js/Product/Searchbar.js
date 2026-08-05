
/*limit drop down */
const MAX_SUGGESTIONS = 8;

function initSearchBar() {
    const input = document.getElementById("search-input");
    const suggestionsBox = document.getElementById("search-suggestions");
    const searchButton = document.getElementById("search-button");

    // fall back
    if (!input || !suggestionsBox || !searchButton) return;

    //track users selection of suggestion 
    let activeIndex = -1;  
    let currentResults = [];

    
    // just incase for any special characters
    function escapeHTML(str) {
        if (!str) return "";
        return String(str).replace(/[&<>'"]/g,
            (tag) => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "'": "&#39;",
                '"': "&quot;"
            }[tag] || tag)
        );
    }

    // images[] entries can be plain strings OR objects like { src, flavor/size, cartImage }
    function getThumbSrc(product) {
        const first = product.images && product.images[0];
        if (!first) return "";
        if (typeof first === "string") return first;
        // prefer an image explicitly marked as the cart/thumbnail image if present
        const cartImg = product.images.find((img) => img && typeof img === "object" && img.cartImage);
        if (cartImg) return cartImg.src;
        return first.src || "";
    }

    // pulls every searchable text out into one string
    function productHaystack(product) {
        return [
            product.name,
            product.category,
            ...(product.flavors || []),
            ...(product.sizes || [])
        ]
            .join(" ")
            .toLowerCase();
    }

    //the matching percentage 
    function scoreProduct(product, query) {
        const name = product.name.toLowerCase();
        const category = product.category.toLowerCase();
        const flavors = (product.flavors || []).join(" ").toLowerCase();
        const q = query.toLowerCase().trim();

        if (!q) return 0;

        if (name === q) return 100; //exactly same
        if (name.startsWith(q)) return 85; //name starts with
        if (name.includes(q)) return 70; // name include query anywhere
        if (category.startsWith(q)) return 55; //category start with
        if (category.includes(q)) return 45; // category include anywhere
        if (flavors.includes(q)) return 35; //flavor include the query

        // if category and name has same result (fallback)
        const words = q.split(/\s+/).filter(Boolean);
        if (words.length > 1) {
            const haystack = productHaystack(product);
            const allWordsFound = words.every((w) => haystack.includes(w));
            if (allWordsFound) return 25;
        }

        const nameNoSpaces = name.replace(/\s+/g, "");
        const qNoSpaces = q.replace(/\s+/g, "");
        
        if (nameNoSpaces.includes(qNoSpaces)) return 20;

        return 0; 
    }

    // take the score and filter out any product with 0 points and sorts from highest to lowerst
    function getMatches(query) {
        return productsData
            .map((p) => ({ product: p, score: scoreProduct(p, query) }))
            .filter((entry) => entry.score > 0)
            .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
            .slice(0, MAX_SUGGESTIONS)
            .map((entry) => entry.product);
    }

    // highlight the matching alphabelt and part mark it with <mark>
    function highlightMatch(name, query) {
        const q = query.trim();
        if (!q) return escapeHTML(name);

        const lower = name.toLowerCase();
        const idx = lower.indexOf(q.toLowerCase());
        if (idx === -1) return escapeHTML(name);

        const before = escapeHTML(name.slice(0, idx));
        const match = escapeHTML(name.slice(idx, idx + q.length));
        const after = escapeHTML(name.slice(idx + q.length));
        return `${before}<mark>${match}</mark>${after}`;
    }

    // clear dropdown box remove .open css and reset the activeIndex
    function closeSuggestions() {
        suggestionsBox.innerHTML = "";
        suggestionsBox.classList.remove("open");
        input.setAttribute("aria-expanded", "false");
        activeIndex = -1;
        currentResults = [];
    }

    // build the drop down , input empty = close box , no match - render message , match - generate <a> tag
    function renderSuggestions(query) {
        const results = getMatches(query);
        currentResults = results;
        activeIndex = -1;

        if (!query.trim()) {
            closeSuggestions();
            return;
        }

        if (results.length === 0) {
            suggestionsBox.innerHTML = `<div class="suggestion-empty halfvisibletext">No drinks found for "${escapeHTML(query)}"</div>`;
            suggestionsBox.classList.add("open");
            input.setAttribute("aria-expanded", "true");
            return;
        }

        suggestionsBox.innerHTML = results
            .map(
                (p, i) => `
                <a class="suggestion-item hover-pink-highlight"
                   id="suggestion-${i}"
                   role="option"
                   href="ProductDetailPage.html?id=${escapeHTML(p.id)}">
                    <div class="suggestion-thumb">
                        <img src="${escapeHTML(getThumbSrc(p))}" alt="${escapeHTML(p.name)}" loading="lazy">
                    </div>
                    <div class="suggestion-info">
                        <span class="suggestion-name">${highlightMatch(p.name, query)}</span>
                        <span class="halfvisibletext">${escapeHTML(p.category)}</span>
                    </div>
                </a>`
            )
            .join("");

        suggestionsBox.classList.add("open"); // add open class 
        input.setAttribute("aria-expanded", "true");
    }

    // handle keyboard navigation
    function setActive(index) {
        const items = suggestionsBox.querySelectorAll(".suggestion-item");
        if (!items.length) return;

        items.forEach((el) => el.classList.remove("active"));

        // wrap around in both directions
        activeIndex = (index + items.length) % items.length;
        const activeEl = items[activeIndex];
        activeEl.classList.add("active");
        activeEl.scrollIntoView({ block: "nearest" });
        input.setAttribute("aria-activedescendant", activeEl.id);
    }

    // redirect the browser to detail product page
    function goToProduct(product) {
        if (!product) return;
        window.location.href = `ProductDetailPage.html?id=${encodeURIComponent(product.id)}`;
    }

    // run when enter key is click or search button
    function submitSearch() {
        const query = input.value.trim();
        if (!query) return;

        // prefer whichever suggestion is currently highlighted...
        if (activeIndex >= 0 && currentResults[activeIndex]) {
            goToProduct(currentResults[activeIndex]);
            return;
        }

        // ...otherwise go straight to the best match
        const matches = getMatches(query);
        if (matches.length > 0) {
            goToProduct(matches[0]);
        } else {
            input.classList.add("shake");
            setTimeout(() => input.classList.remove("shake"), 400);
        }
    }

    //set timer for input , reset if user type another letter before time finish
    let debounceTimer;
    input.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => renderSuggestions(input.value), 120);
    });

    //key board anvigation control
    input.addEventListener("keydown", (e) => {
        const items = suggestionsBox.querySelectorAll(".suggestion-item");

        if (e.key === "ArrowDown") {
            if (!items.length) return;
            e.preventDefault();
            setActive(activeIndex + 1);
        } else if (e.key === "ArrowUp") {
            if (!items.length) return;
            e.preventDefault();
            setActive(activeIndex - 1);
        } else if (e.key === "Enter") {
            e.preventDefault();
            submitSearch();
        } else if (e.key === "Escape") {
            closeSuggestions();
            input.blur();
        }
    });

    searchButton.addEventListener("click", submitSearch);

    // close dropdown when clicking anywhere on the page
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-input-wrapper")) {
            closeSuggestions();
        }
    });

    // re-open suggestions if user reclick on the search bar that still has text
    input.addEventListener("focus", () => {
        if (input.value.trim()) renderSuggestions(input.value);
    });
}