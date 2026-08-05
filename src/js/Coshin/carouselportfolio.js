let currentSlide = 0;

function initCarousel() {
    const track = document.querySelector('.achievement-carousel .carousel-track');
    const slides = document.querySelectorAll('.achievement-carousel .carousel-slide');
    updateCarousel(track, slides.length);
}

function changeSlide(direction) {
    const track = document.querySelector('.achievement-carousel .carousel-track');
    const slides = document.querySelectorAll('.achievement-carousel .carousel-slide');
    const totalSlides = slides.length;

    currentSlide += direction;

    // loop around
    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }

    updateCarousel(track, totalSlides);
}

function updateCarousel(track, totalSlides) {
    const offset = -currentSlide * 100;
    track.style.transform = `translateX(${offset}%)`;
}

