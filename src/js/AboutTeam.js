// apply saved theme on page load
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

async function init() {
    
    await Promise.all([
        loadComponent('teamHeaderSlot', '../components/aboutteam/TeamHeader.html'),
        loadComponent('teamSectionSlot', '../components/aboutteam/TeamSection.html')
    ]);

    await Promise.all([
        loadComponent('teamLeaderCard', '../components/aboutteam/TeamCardCoshin.html'),
        loadComponent('teamAndreaCard', '../components/aboutteam/TeamCardAndrea.html'),
        loadComponent('teamRyanCard', '../components/aboutteam/TeamCardRyan.html'),
        loadComponent('teamPravineeshCard', '../components/aboutteam/TeamCardPravineesh.html'),
        loadComponent('teamCtaSlot', '../components/aboutteam/Teamcta.html')
    ]);

    observeAnimations();
}

document.addEventListener('DOMContentLoaded', init);