            // ============================================================
            // 1. RATING LIST WEB COMPONENT
            // ============================================================
            class RatingList extends HTMLElement {
                constructor() {
                    super();
                    this._reviews = [
                        { id: 1, name: "Alex Lau", rating: 5,
                            comment: "This Green Tea is absolutely perfect! Just the right amount of sweetness and very refreshing after a hot afternoon walk. Best tea in the market!",
                            date: "May 12, 2026", upvotes: 14, hasUpvoted: false },
                        { id: 2, name: "Benjamin Lim", rating: 4,
                            comment: "Really delicious flavor, but I wish the jasmine aroma was just a little stronger. Still, a solid beverage from Pokka that I buy almost every week.",
                            date: "Jun 04, 2026", upvotes: 8, hasUpvoted: false },
                        { id: 3, name: "Chloe Tan", rating: 5,
                            comment: "Incredibly refreshing! Clean, crisp taste. It isn't overly sweetened like some of the other brands. Reminds me of the authentic tea in Japan.",
                            date: "Jun 18, 2026", upvotes: 23, hasUpvoted: false },
                        { id: 4, name: "Zul bin Kassim", rating: 3,
                            comment: "The taste is okay but it's a bit too sweet for my diet. If Pokka launches a zero-sugar version of this exact blend, it would be a 5-star easily.",
                            date: "Jun 29, 2026", upvotes: 3, hasUpvoted: false }
                    ];
                    this._searchQuery = "";
                    this._sortBy = "helpful";
                    this._filterStar = 0;
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
                            <div class="reviews-controls">
                                <div class="search-bar-container">
                                    <svg class="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    <input class="input-control search-input" type="text" id="review-search" placeholder="Filter reviews by keyword...">
                                </div>
                                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                                    <select class="filter-sort-select" id="review-filter">
                                        <option value="0">All Stars</option>
                                        <option value="5">5 Stars only</option>
                                        <option value="4">4 Stars &amp; above</option>
                                        <option value="3">3 Stars &amp; below</option>
                                    </select>
                                    <select class="filter-sort-select" id="review-sort">
                                        <option value="helpful">Most Helpful</option>
                                        <option value="recent">Most Recent</option>
                                        <option value="high">Highest Rating</option>
                                        <option value="low">Lowest Rating</option>
                                    </select>
                                </div>
                            </div>
                            <div class="comments-list" id="list-container"></div>
                        </div>
                    `;
                    this.setupToolbarLogic();
                    this.updateList();
                }

                setupToolbarLogic() {
                    const searchInput = this.querySelector('#review-search');
                    const filterSelect = this.querySelector('#review-filter');
                    const sortSelect = this.querySelector('#review-sort');
                    searchInput.addEventListener('input', (e) => {
                        this._searchQuery = e.target.value.toLowerCase().trim();
                        this.updateList();
                    });
                    filterSelect.addEventListener('change', (e) => {
                        this._filterStar = parseInt(e.target.value);
                        this.updateList();
                    });
                    sortSelect.addEventListener('change', (e) => {
                        this._sortBy = e.target.value;
                        this.updateList();
                    });
                }

                updateList() {
                    const container = this.querySelector('#list-container');
                    if (!container) return;

                    let filtered = this._reviews.filter(review => {
                        const matchesSearch = review.comment.toLowerCase().includes(this._searchQuery) ||
                            review.name.toLowerCase().includes(this._searchQuery);
                        let matchesStar = true;
                        if (this._filterStar === 5) matchesStar = review.rating === 5;
                        else if (this._filterStar === 4) matchesStar = review.rating >= 4;
                        else if (this._filterStar === 3) matchesStar = review.rating <= 3;
                        return matchesSearch && matchesStar;
                    });

                    filtered.sort((a, b) => {
                        if (this._sortBy === "recent") return new Date(b.date) - new Date(a.date);
                        else if (this._sortBy === "high") return b.rating - a.rating;
                        else if (this._sortBy === "low") return a.rating - b.rating;
                        else return b.upvotes - a.upvotes;
                    });

                    if (filtered.length === 0) {
                        container.innerHTML = `
                            <div class="empty-reviews-state">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width: 48px; height: 48px; stroke: #ccc; margin-bottom: 0.75rem;">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="8" y1="12" x2="16" y2="12" />
                                </svg>
                                <h3>No reviews found</h3>
                                <p>Try adjusting your search keywords or filter criteria.</p>
                            </div>
                        `;
                        return;
                    }

                    container.innerHTML = "";
                    filtered.forEach(review => {
                        const card = document.createElement('div');
                        card.className = 'comment-card animate-fade-in';
                        card.id = `review-${review.id}`;

                        let highlightedComment = review.comment;
                        if (this._searchQuery !== "") {
                            const regex = new RegExp(`(${this.escapeRegExp(this._searchQuery)})`, 'gi');
                            highlightedComment = review.comment.replace(regex, '<mark>$1</mark>');
                        }

                        let starHtml = "";
                        for (let i = 1; i <= 5; i++) {
                            starHtml += `
                                <svg viewBox="0 0 24 24" fill="${i <= review.rating ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                            `;
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
                            <p class="comment-text">${highlightedComment}</p>
                            <div class="comment-actions">
                                <button class="comment-upvote-btn ${review.hasUpvoted ? 'voted' : ''}" data-id="${review.id}">
                                    <svg viewBox="0 0 24 24" fill="${review.hasUpvoted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                    </svg>
                                    <span class="count">${review.upvotes}</span> people found this helpful
                                </button>
                            </div>
                        `;

                        const upvoteBtn = card.querySelector('.comment-upvote-btn');
                        upvoteBtn.addEventListener('click', () => this.handleUpvote(review.id));
                        container.appendChild(card);
                    });
                }

                handleUpvote(id) {
                    const review = this._reviews.find(r => r.id === id);
                    if (!review) return;
                    review.hasUpvoted ? (review.upvotes--, review.hasUpvoted = false) : (review.upvotes++, review.hasUpvoted = true);
                    this.dispatchEvent(new CustomEvent('review-upvote', {
                        bubbles: true,
                        composed: true,
                        detail: { id, upvotes: review.upvotes, hasUpvoted: review.hasUpvoted }
                    }));
                    this.updateList();
                }

                escapeRegExp(string) {
                    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                }
            }

            customElements.define('rating-list', RatingList);

            // ============================================================
            // 2. APP LOGIC (Mounting, Summary Calc, and Form Submission)
            // ============================================================
            document.addEventListener('DOMContentLoaded', function() {
                
                // Initialize IntersectionObserver if the function exists (from animation.js)
                if(typeof observeAnimations === 'function') {
                    observeAnimations();
                }

                // Mount Rating List Component
                const container = document.getElementById('ratingListContainer');
                const ratingList = document.createElement('rating-list');
                ratingList.id = 'mainRatingList';
                container.appendChild(ratingList);

                // Summary Elements
                const reviewCountDisplay = document.getElementById('reviewCountDisplay');
                const avgRatingDisplay = document.getElementById('avgRatingDisplay');
                const bigStarContainer = document.getElementById('bigStarContainer');

                // Function to Update Top Summary Header
                function updateSummary() {
                    const reviews = ratingList.reviews || [];
                    const total = reviews.length;
                    reviewCountDisplay.textContent = `Based on ${total} reviews`;
                    if (total > 0) {
                        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
                        const avg = (sum / total).toFixed(1);
                        avgRatingDisplay.textContent = avg;
                        
                        const avgNum = parseFloat(avg);
                        bigStarContainer.innerHTML = '';
                        for (let i = 1; i <= 5; i++) {
                            const icon = document.createElement('i');
                            if (i <= Math.floor(avgNum)) {
                                icon.className = 'fas fa-star';
                            } else if (i === Math.ceil(avgNum) && avgNum % 1 >= 0.3) {
                                icon.className = 'fas fa-star-half-alt';
                            } else {
                                icon.className = 'far fa-star';
                            }
                            bigStarContainer.appendChild(icon);
                        }
                    }
                }

                // Summary Event Listeners
                ratingList.addEventListener('reviews-updated', updateSummary);
                ratingList.addEventListener('review-upvote', updateSummary);
                setTimeout(updateSummary, 50);

                // ============================================================
                // FORM LOGIC
                // ============================================================
                const starContainer = document.getElementById('starRatingInput');
                const stars = starContainer.querySelectorAll('.fa-star');
                const nameInput = document.getElementById('reviewerName');
                const feedbackInput = document.getElementById('reviewFeedback');
                const form = document.getElementById('reviewForm');
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
                        star.style.color = (idx + 1 <= display) ? '#f5b342' : '#e2e8f0';
                    });
                }

                function resetHover() { hoveredRating = 0; updateStars(); }

                stars.forEach(star => {
                    star.addEventListener('mouseenter', function() {
                        hoveredRating = parseInt(this.dataset.value);
                        updateStars();
                    });
                    star.addEventListener('click', function() {
                        const val = parseInt(this.dataset.value);
                        selectedRating = (selectedRating === val) ? 0 : val;
                        updateStars();
                        ratingError.style.display = 'none';
                    });
                    star.addEventListener('mouseleave', resetHover);
                });
                starContainer.addEventListener('mouseleave', resetHover);

                // Form Submit Handling
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    let hasError = false;

                    // Validate Rating
                    if (selectedRating === 0) {
                        ratingError.style.display = 'block';
                        hasError = true;
                    } else {
                        ratingError.style.display = 'none';
                    }

                    // Validate Name
                    const name = nameInput.value.trim();
                    if (name === '') {
                        nameError.style.display = 'block';
                        nameInput.style.borderColor = '#e53e3e';
                        hasError = true;
                    } else {
                        nameError.style.display = 'none';
                        nameInput.style.borderColor = '#e2e8f0';
                    }

                    // Validate Comment
                    const comment = feedbackInput.value.trim();
                    if (comment.length < 4) {
                        commentError.style.display = 'block';
                        feedbackInput.style.borderColor = '#e53e3e';
                        hasError = true;
                    } else {
                        commentError.style.display = 'none';
                        feedbackInput.style.borderColor = '#e2e8f0';
                    }

                    if (hasError) return;

                    // Build review data
                    const now = new Date();
                    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const reviewData = {
                        id: Date.now(),
                        name: name,
                        rating: selectedRating,
                        comment: comment,
                        date: dateStr,
                        upvotes: 0,
                        hasUpvoted: false
                    };

                    // Add review directly to the list below
                    ratingList.addReview(reviewData);

                    // Show success toast
                    toastText.textContent = `⭐ ${selectedRating} stars · Thank you, ${name}! Review published.`;
                    toast.classList.add('show');
                    setTimeout(() => toast.classList.remove('show'), 4000);

                    // Reset form
                    form.reset();
                    selectedRating = 0;
                    stars.forEach(s => s.style.color = '#e2e8f0');
                    nameInput.style.borderColor = '#e2e8f0';
                    feedbackInput.style.borderColor = '#e2e8f0';
                    ratingError.style.display = 'none';
                    nameError.style.display = 'none';
                    commentError.style.display = 'none';
                });

                // Real-time error clearing
                nameInput.addEventListener('input', function() {
                    if (this.value.trim() !== '') {
                        nameError.style.display = 'none';
                        this.style.borderColor = '#e2e8f0';
                    }
                });
                feedbackInput.addEventListener('input', function() {
                    if (this.value.trim().length >= 4) {
                        commentError.style.display = 'none';
                        this.style.borderColor = '#e2e8f0';
                    }
                });
            });