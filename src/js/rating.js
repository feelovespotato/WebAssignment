function buildStarIcon(state) {
    if (state === 'half') return `<span class="star-half"></span>`;
    if (state === 'empty') return `<span class="star-empty"></span>`;
    return `<span class="star-full"></span>`;
}

function buildStarsProportional(avgNum) {
    const percent = Math.max(0, Math.min(100, (avgNum / 5) * 100));
    const emptyRow = Array(5).fill(`<span class="star-empty"></span>`).join('');
    const fullRow = Array(5).fill(`<span class="star-full"></span>`).join('');
    return `
        <span class="star-row star-row-empty">${emptyRow}</span>
        <span class="star-row star-row-full" style="width:${percent}%">${fullRow}</span>
    `;
}

const reviews = [
    { id: 1, name: "Alex Lau", rating: 5, comment: "This Green Tea is absolutely perfect! Just the right amount of sweetness and very refreshing after a hot afternoon walk. Best tea in the market!", date: "May 12, 2026" },
    { id: 2, name: "Benjamin Lim", rating: 4, comment: "Really delicious flavor, but I wish the jasmine aroma was just a little stronger. Still, a solid beverage from Pokka that I buy almost every week.", date: "Jun 04, 2026" },
    { id: 3, name: "Chloe Tan", rating: 5, comment: "Incredibly refreshing! Clean, crisp taste. It isn't overly sweetened like some of the other brands. Reminds me of the authentic tea in Japan.", date: "Jun 18, 2026" },
    { id: 4, name: "Zul bin Kassim", rating: 3, comment: "The taste is okay but it's a bit too sweet for my diet. If Pokka launches a zero-sugar version of this exact blend, it would be a 5-star easily.", date: "Jun 29, 2026" }
];

function renderReviews() {
    const container = document.getElementById("ratingListContainer");
    if (!container) return;

    container.innerHTML = "";

    reviews.forEach(review => {
        const card = document.createElement("div");
        card.className = "comment-card animate-fade-up";

        let starHtml = "";
        for (let i = 1; i <= 5; i++) {
            starHtml += buildStarIcon(i <= review.rating ? "full" : "empty");
        }

        card.innerHTML = `
            <div class="comment-card-header">
                <div class="comment-user-info">
                    <div class="comment-user-avatar">${review.name.charAt(0).toUpperCase()}</div>
                    <div class="comment-user-meta">
                        <h4>${review.name}</h4>
                        <div class="comment-date">${review.date}</div>
                    </div>
                </div>
                <div class="comment-stars">${starHtml}</div>
            </div>
            <p class="comment-text">${review.comment}</p>
        `;

        container.appendChild(card);
    });

    if (typeof window.observeAnimations === 'function') {
        window.observeAnimations();
    }
}

function updateSummary() {
    const reviewCountDisplay = document.getElementById('reviewCountDisplay');
    const avgRatingDisplay = document.getElementById('avgRatingDisplay');
    const bigStarContainer = document.getElementById('bigStarContainer');

    if (!reviewCountDisplay || !avgRatingDisplay || !bigStarContainer) return;

    const total = reviews.length;
    reviewCountDisplay.textContent = `Based on ${total} reviews`;

    if (total > 0) {
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        const avg = (sum / total).toFixed(1);
        avgRatingDisplay.textContent = avg;
        bigStarContainer.innerHTML = buildStarsProportional(parseFloat(avg));
    }
}

function addReview(review) {
    reviews.unshift(review);
    renderReviews();
    updateSummary();
}

function getLoggedInUserName() {
    return sessionStorage.getItem("userName") || "Guest";
}

function initRatingPage() {
    if (window.__ratingPageInitialized) return;
    window.__ratingPageInitialized = true;

    renderReviews();   // now calls observeAnimations() internally, no need to call it separately here
    updateSummary();

    const starContainer = document.getElementById('starRatingInput');
    const form = document.getElementById('reviewForm');

    if (starContainer) {
        const stars = starContainer.querySelectorAll('[data-value]');
        const feedbackInput = document.getElementById('reviewFeedback');
        const toast = document.getElementById('publishToast');
        const ratingError = document.getElementById('ratingError');

        let selectedRating = 0;
        let hoveredRating = 0;

        function updateStars() {
            const display = hoveredRating || selectedRating || 0;
            stars.forEach((star, idx) => {
                star.className = idx + 1 <= display ? 'star star-full' : 'star star-empty';
            });
        }

        function resetHover() { hoveredRating = 0; updateStars(); }

        updateStars();

        stars.forEach(star => {
            star.addEventListener('pointerenter', function() {
                hoveredRating = parseInt(this.dataset.value) || 0;
                updateStars();
            });
            star.addEventListener('click', function() {
                const val = parseInt(this.dataset.value) || 0;
                selectedRating = (selectedRating === val) ? 0 : val;
                updateStars();
                if (ratingError) ratingError.style.display = 'none';
            });
            star.addEventListener('pointerleave', resetHover);
        });
        starContainer.addEventListener('mouseleave', resetHover);

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                if (selectedRating === 0) {
                    if (ratingError) ratingError.style.display = 'block';
                    return;
                } else if (ratingError) {
                    ratingError.style.display = 'none';
                }

                const name = getLoggedInUserName();
                const comment = feedbackInput.value.trim();
                const now = new Date();
                const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                addReview({
                    id: Date.now(),
                    name: name,
                    rating: selectedRating,
                    comment: comment,
                    date: dateStr,
                });

                if (toast) {
                    toast.classList.add('show');
                    setTimeout(() => toast.classList.remove('show'), 4000);
                }

                form.reset();
                selectedRating = 0;
                hoveredRating = 0;
                updateStars();
            });
        }
    }
}

window.initRatingPage = initRatingPage;

document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        loadComponent('ratingListSlot', '../components/rating/RatingList.html'),
        loadComponent('addReviewFormSlot', '../components/rating/AddReviewForm.html'),
        loadComponent('Summary', '../components/rating/Ratingaverage.html')
    ]);

    await loadComponent('starRatingInput', '../components/rating/Stars.html');

    initRatingPage();
});