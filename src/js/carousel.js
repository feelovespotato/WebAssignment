// carousel.js
function initCarousel() {
  // Selectors MUST be inside the function so they search the DOM after it loads
  const track = document.querySelector('.carousel-track');
  const cards = document.querySelectorAll('.carousel-track .card');
  const prevBtn = document.querySelector('.carousel-btn-prev');
  const nextBtn = document.querySelector('.carousel-btn-next');

  // Guard clause to catch missing elements
 
  let currentIndex = 1; 

  function updateCarousel() {
    cards.forEach(c => c.classList.remove('active'));
    cards[currentIndex].classList.add('active');

    const cardWidth = cards[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const moveAmount = cardWidth + gap;

    track.style.transform = `translateX(-${currentIndex * moveAmount}px)`;
  }

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % cards.length; 
    updateCarousel();
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex === 0) ? cards.length - 1 : currentIndex - 1;
    updateCarousel();
  });

  window.addEventListener('resize', updateCarousel);
  updateCarousel();
}