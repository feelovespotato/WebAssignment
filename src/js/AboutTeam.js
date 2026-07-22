document.addEventListener('DOMContentLoaded', async () => {
    const COMPONENTS_PATH = '../components/About%20Team';

    await loadComponent('teamHeaderSlot', `${COMPONENTS_PATH}/TeamHeader.html`);
    await loadComponent('teamSectionSlot', `${COMPONENTS_PATH}/TeamSection.html`);

    // Load each member's card
    await loadComponent('teamLeaderCard', `${COMPONENTS_PATH}/TeamCardCoshin.html`);
    await loadComponent('teamAndreaCard', `${COMPONENTS_PATH}/TeamCardAndrea.html`);
    await loadComponent('teamRyanCard', `${COMPONENTS_PATH}/TeamCardRyan.html`);
    await loadComponent('teamPravineeshCard', `${COMPONENTS_PATH}/TeamCardPravineesh.html`);

    // Load buttons with different CV paths
    const cvConfigs = [
        { slot: 'downloadButtonCoshin', cvPath: '../assets/images/Coshin/Coshin_CV.pdf' },
        { slot: 'downloadButtonAndrea', cvPath: '../assets/images/Andrea/Andrea_CV.pdf' },
        { slot: 'downloadButtonRyan', cvPath: '../assets/images/Ryan/Ryan_CV.pdf' },
        { slot: 'downloadButtonPravineesh', cvPath: '../assets/images/Pravineesh/Pravineesh_CV.pdf' }
    ];

    for (const config of cvConfigs) {
        await loadComponent(config.slot, `${COMPONENTS_PATH}/DownloadCvButton.html`);
        // After loading, set the href
        const button = document.getElementById(config.slot)?.querySelector('.btn-cv');
        if (button) {
            button.href = config.cvPath;
        }
    }
});