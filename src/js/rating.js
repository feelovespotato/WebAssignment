

//define each state for star rating
function buildStarIcon(state) {
    if (state === 'half') {
        return `<span class="star-half"></span>`;
    }
    if (state === 'empty') {
        return `<span class="star-empty"></span>`;
    }
    return `<span class="star-full"></span>`;
}

// for the summary stars
function buildStarsProportional(avgNum) {
    const percent = Math.max(0, Math.min(100, (avgNum / 5) * 100));
    const emptyRow = Array(5).fill(`<span class="star-empty"></span>`).join('');
    const fullRow = Array(5).fill(`<span class="star-full"></span>`).join('');
    return `
        <span class="star-row star-row-empty">${emptyRow}</span>
        <span class="star-row star-row-full" style="width:${percent}%">${fullRow}</span>
    `;
}
// Rating List Component
class RatingList extends HTMLElement {
    constructor() {
        super();
        this._reviews = [
            { id: 1, name: "Alex Lau", rating: 5,
                comment: "This Green Tea is absolutely perfect! Just the right amount of sweetness and very refreshing after a hot afternoon walk. Best tea in the market!",
                date: "May 12, 2026"},
            { id: 2, name: "Benjamin Lim", rating: 4,
                comment: "Really delicious flavor, but I wish the jasmine aroma was just a little stronger. Still, a solid beverage from Pokka that I buy almost every week.",
                date: "Jun 04, 2026"},
            { id: 3, name: "Chloe Tan", rating: 5,
                comment: "Incredibly refreshing! Clean, crisp taste. It isn't overly sweetened like some of the other brands. Reminds me of the authentic tea in Japan.",
                date: "Jun 18, 2026"},
            { id: 4, name: "Zul bin Kassim", rating: 3,
                comment: "The taste is okay but it's a bit too sweet for my diet. If Pokka launches a zero-sugar version of this exact blend, it would be a 5-star easily.",
                date: "Jun 29, 2026"}
        ];
    }

    connectedCallback() { this.render(); }

    get reviews() { return this._reviews; }
    set reviews(val) { 
        this._reviews = val;
        this.updateList(); 
    }

    addReview(review) {
        this._reviews.unshift(review);
        this.updateList();
        this.dispatchEvent(new CustomEvent('reviews-updated', { bubbles: true, composed: true }));
    }

    render() {
        this.innerHTML = `
            <div class="rating-list-wrapper">
                <div class="comments-list" id="list-container"></div>
            </div>
        `;
        this.updateList();
    }

    updateList() {
        const container = this.querySelector('#list-container');
        if (!container) return;

        container.innerHTML = "";
        this._reviews.forEach(review => {
            const card = document.createElement('div');
            card.className = 'comment-card animate-fade-in';
            card.id = `review-${review.id}`;

            let starHtml = "";
            for (let i = 1; i <= 5; i++) {
                starHtml += buildStarIcon(i <= review.rating ? 'full' : 'empty');
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
    }
}

customElements.define('rating-list', RatingList);

// Mounting, summary calculation & form submission
function initRatingPage() {
    if (window.__ratingPageInitialized) return;
    window.__ratingPageInitialized = true;

    if (typeof window.observeAnimations === 'function') {
        window.observeAnimations();
    }

    // Mount rating list component 
    const container = document.getElementById('ratingListContainer');
    let ratingList = null;
    if (container) {
        ratingList = document.createElement('rating-list');
        ratingList.id = 'mainRatingList';
        container.appendChild(ratingList);
    } else {
        ratingList = document.getElementById('mainRatingList') || document.querySelector('rating-list');
    }

    // Summary elements
    const reviewCountDisplay = document.getElementById('reviewCountDisplay');
    const avgRatingDisplay = document.getElementById('avgRatingDisplay');
    const bigStarContainer = document.getElementById('bigStarContainer');

    // Function to update summary 
    function updateSummary() {
        if (!ratingList || !reviewCountDisplay || !avgRatingDisplay || !bigStarContainer) return;
        // review count
        const reviews = ratingList.reviews || [];
        const total = reviews.length;
        reviewCountDisplay.textContent = `Based on ${total} reviews`;
        // total average and the stars to render
        if (total > 0) {
            const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
            const avg = (sum / total).toFixed(1);
            avgRatingDisplay.textContent = avg;

            const avgNum = parseFloat(avg);
           
            bigStarContainer.innerHTML = buildStarsProportional(avgNum);
        }
    }

    if (ratingList) {
        ratingList.addEventListener('reviews-updated', updateSummary);
        setTimeout(updateSummary, 50);
    }

    // Form logic
    const starContainer = document.getElementById('starRatingInput');
    const form = document.getElementById('reviewForm');

    if (starContainer) {
        const stars = starContainer.querySelectorAll('[data-value]');
        const nameInput = document.getElementById('reviewerName');
        const feedbackInput = document.getElementById('reviewFeedback');
        const toast = document.getElementById('publishToast');
        const toastText = document.getElementById('toastText');
        const ratingError = document.getElementById('ratingError');
        const nameError = document.getElementById('nameError');
        const commentError = document.getElementById('commentError');

        let selectedRating = 0;
        let hoveredRating = 0;

        
        function updateStars() {
        const display = hoveredRating || selectedRating || 0;
        stars.forEach((star, idx) => {
        // css star colors
        if (idx + 1 <= display) {
            star.className = 'star star-full';
        } else {
            star.className = 'star star-empty';
        }
    });
}

        function resetHover() { hoveredRating = 0; updateStars(); }

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

        // Form submit handling 
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                let hasError = false;

                if (selectedRating === 0) {
                    if (ratingError) ratingError.style.display = 'block';
                    hasError = true;
                } else if (ratingError) {
                    ratingError.style.display = 'none';
                }

                const name = nameInput ? nameInput.value.trim() : '';
                if (name === '') {
                    if (nameError) nameError.style.display = 'block';
                    if (nameInput) nameInput.style.borderColor = '#e53e3e';
                    hasError = true;
                } else {
                    if (nameError) nameError.style.display = 'none';
                    if (nameInput) nameInput.style.borderColor = '#e2e8f0';
                }

                const comment = feedbackInput ? feedbackInput.value.trim() : '';
                if (comment.length < 4) {
                    if (commentError) commentError.style.display = 'block';
                    if (feedbackInput) feedbackInput.style.borderColor = '#e53e3e';
                    hasError = true;
                } else {
                    if (commentError) commentError.style.display = 'none';
                    if (feedbackInput) feedbackInput.style.borderColor = '#e2e8f0';
                }

                if (hasError) return;

                const now = new Date();
                const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const reviewData = {
                    id: Date.now(),
                    name: name,
                    rating: selectedRating,
                    comment: comment,
                    date: dateStr,
                    
                };

                if (ratingList && typeof ratingList.addReview === 'function') {
                    ratingList.addReview(reviewData);
                }

                if (toastText) toastText.textContent = `⭐ ${selectedRating} stars · Thank you, ${name}! Review published.`;
                if (toast) {
                    toast.classList.add('show');
                    setTimeout(() => toast.classList.remove('show'), 4000);
                }

                form.reset();
                selectedRating = 0;
                hoveredRating = 0;
                updateStars();
                if (nameInput) nameInput.style.borderColor = '#e2e8f0';
                if (feedbackInput) feedbackInput.style.borderColor = '#e2e8f0';
            });
        }

        if (nameInput) {
            nameInput.addEventListener('input', function() {
                if (this.value.trim() !== '') {
                    if (nameError) nameError.style.display = 'none';
                    this.style.borderColor = '#e2e8f0';
                }
            });
        }
        if (feedbackInput) {
            feedbackInput.addEventListener('input', function() {
                if (this.value.trim().length >= 4) {
                    if (commentError) commentError.style.display = 'none';
                    this.style.borderColor = '#e2e8f0';
                }
            });
        }
    }
}

window.initRatingPage = initRatingPage;

// Fetches the rating components
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load the main page-level slots first
    await Promise.all([
        loadComponent('ratingListSlot', '../components/rating/RatingList.html'),
        loadComponent('addReviewFormSlot', '../components/rating/AddReviewForm.html'),
        loadComponent('Summary', '../components/rating/Ratingaverage.html')
    ]);
    
    // 2. NOW that the form exists in the DOM, load the stars wrapper into it
    await loadComponent('ratingStarsContainer', '../components/rating/RatingStars.html');
    
    // 3. NOW that the stars wrapper exists, fetch the shared interactive icons
    const response = await fetch('../components/rating/Stars.html');
    const starsHtml = await response.text();

    const inputContainer = document.getElementById('starRatingInput');
    if (inputContainer) {
        inputContainer.innerHTML = starsHtml;
    }

    // 4. Boot up the interactive logic
    initRatingPage();
});