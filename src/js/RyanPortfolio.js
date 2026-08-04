document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'light');

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    loadComponent('RyanHeroSlot', '../components/portfolio/Ryan/hero.html'),
    loadComponent('RyanSkillsSlot', '../components/portfolio/Ryan/skills.html'),
    loadComponent('RyanEducationSlot', '../components/portfolio/Ryan/education.html'),
    loadComponent('RyanProjectsSlot', '../components/portfolio/Ryan/projects.html'),
  ]);

  await loadComponent('RyanCertsSlot', '../components/portfolio/Ryan/certifications.html');
  await loadComponent('RyanContactSlot', '../components/portfolio/Ryan/contact.html');

  initCerts();
  observeAnimations();
});