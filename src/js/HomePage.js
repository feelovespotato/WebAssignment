loadComponent('navbar', '../components/layout/navbar.html').then(() => {
  const toggleBtn = document.getElementById('WebsiteTheme');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'light';
  root.setAttribute('data-theme', savedTheme);
  toggleBtn.textContent = savedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  toggleBtn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    toggleBtn.textContent = next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  });
});

loadComponent('footer', '../components/layout/footer.html');

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

loadComponent('DrinkCategories', '../components/homepage/DrinkCategories.html').then(() => {
  initCarousel();
  observeAnimations();
});

loadComponent('CustomerReviews', '../components/homepage/CustomerReviews.html').then(() => {
  initHomeRatings();
  observeAnimations();
});