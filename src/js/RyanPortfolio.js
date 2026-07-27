document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'light');

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    loadComponent('ryan-hero-slot', '../components/portfolio/Ryan/hero.html'),
    loadComponent('ryan-skills-slot', '../components/portfolio/Ryan/skills.html'),
    loadComponent('ryan-education-slot', '../components/portfolio/Ryan/education.html'),
    loadComponent('ryan-projects-slot', '../components/portfolio/Ryan/projects.html'),
  ]);

  await loadComponent('ryan-certs-slot', '../components/portfolio/Ryan/certifications.html');
  
  initCerts();
  observeAnimations();
});