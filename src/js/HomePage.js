loadComponent('MainDisplay', '../components/homepage/MainDisplay.html').then(() => {
  const video = document.getElementById('MainVideo');
  
  observeAnimations();

  video.addEventListener('loadedmetadata', () => {
    video.addEventListener('timeupdate', () => {
      if (video.currentTime >= video.duration - 1) {
        video.pause();
      }
    });
  });
});

loadComponent('DrinkCategories', '../components/homepage/DrinkCategories.html');
loadComponent('CustomerReviews', '../components/homepage/CustomerReviews.html');