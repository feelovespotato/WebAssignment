function scrollToRequestedSection() {
    const sectionId = decodeURIComponent(
        window.location.hash.substring(1)
    );

    if (!sectionId) {
        return;
    }

    const targetSection = document.getElementById(sectionId);

    if (!targetSection) {
        console.error("Section not found: " + sectionId);
        return;
    }

    let scrollTimer;

    function scheduleScroll() {
        clearTimeout(scrollTimer);

        scrollTimer = setTimeout(function () {
            targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 250);
    }

    /*
        Watch for dynamically loaded components.
        Every time content is inserted, wait briefly and scroll again.
    */
    const observer = new MutationObserver(function () {
        scheduleScroll();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    scheduleScroll();

    // Final scroll after all components should be loaded
    setTimeout(function () {
        observer.disconnect();

        targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, 3000);
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        scrollToRequestedSection
    );
} else {
    scrollToRequestedSection();
}

window.addEventListener(
    "hashchange",
    scrollToRequestedSection
);