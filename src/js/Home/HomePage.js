/* loads up the video and the other components on the homepage, and sets up the event listeners for the video and animations */
loadComponent('MainDisplay', '../components/homepage/MainDisplay.html').then(() => {
  const video = document.getElementById('MainVideo');
  observeAnimations(); /*  checks for animations */
  video.addEventListener('loadedmetadata', () => {
    video.addEventListener('timeupdate', () => {
      if (video.currentTime >= video.duration - 1) {
        video.pause(); /*  freeze frame the video before it ends */ 
      }
    });
  });
});

loadComponent('DrinkCategories', '../components/homepage/DrinkCategories.html').then(() => {
  initCarousel();  /*  initializes the drink category carousel */ 
  observeAnimations();  /*  checks for animations */ 
});

loadComponent('CustomerReviews', '../components/homepage/CustomerReviews.html').then(() => {
  initHomeRatings(); /*  initializes the home ratings */ 
  observeAnimations(); /*  checks for animations */ 
});