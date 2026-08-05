function initHomeRatings() { /* this is the initialization that */ 

  const previewReviews = [ /* dummy data for preview reviews */ 
    { name: "Alex Lau", rating: 5, comment: "This Green Tea is absolutely perfect! Just the right amount of sweetness and very refreshing after a hot afternoon walk.", date: "May 12, 2026" },
    { name: "Benjamin Lim", rating: 4, comment: "Really delicious flavor, but I wish the jasmine aroma was just a little stronger. Still, a solid beverage I buy almost every week.", date: "Jun 04, 2026" },
    { name: "Chloe Tan", rating: 5, comment: "Incredibly refreshing! Clean, crisp taste. It isn't overly sweetened like some of the other brands.", date: "Jun 18, 2026" }
  ];

  /*preparing the container for the preview reviews and setting its styles */
  const container = document.getElementById('preview-reviews'); 
  container.style.display = 'flex';
  container.style.gap = '24px';
  container.style.marginBottom = '32px';

  
  /*preparing the star function */
  previewReviews.forEach(review => {
    const stars = Array(5).fill(0).map((_, i) =>
      `<span style="color: ${i < review.rating ? '#F39A1E' : '#ccc'}">★</span>`
    ).join('');


     /*calling the container and setting the styles for the comment cards */
    const card = document.createElement('div');
    card.className = 'comment-card animate-fade-up';
    card.style.flex = '1';
    card.innerHTML = `
      <div class="comment-card-header">
        <div class="comment-user-info">
          <div class="comment-user-meta">
            <h4>${review.name}</h4>
            <div class="comment-date">${review.date}</div>
          </div>
        </div>
        <div class="comment-stars">${stars}</div>
      </div>
      <p class="comment-text">${review.comment}</p>
    `;
    container.appendChild(card);
  });

  observeAnimations();
}