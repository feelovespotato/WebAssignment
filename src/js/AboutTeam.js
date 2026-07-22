document.addEventListener('DOMContentLoaded', async () => {
    const COMPONENTS_PATH = '../components/About%20Team';

    const cvConfigs = [
        { slot: 'downloadButtonCoshin', cvPath: '../assets/images/Coshin/Coshin_CV.pdf' },
        { slot: 'downloadButtonAndrea', cvPath: '../assets/images/Andrea/Andrea_CV.pdf' },
        { slot: 'downloadButtonRyan', cvPath: '../assets/images/Ryan/Ryan_CV.pdf' },
        { slot: 'downloadButtonPravineesh', cvPath: '../assets/images/Pravineesh/Pravineesh_CV.pdf' },
        { slot: 'downloadButtonAndreaBio', cvPath: '../assets/images/Andrea/Andrea_CV.pdf' }
    ];

    async function loadComponent(elementId, filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = html;
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Failed to load component ${filePath}:`, error);
            return false;
        }
    }

    async function renderCvButton(slotId, cvPath) {
        const slot = document.getElementById(slotId);
        if (!slot) return;

        const loaded = await loadComponent(slotId, `${COMPONENTS_PATH}/DownloadCvButton.html`);
        if (!loaded) return;

        const button = slot.querySelector('.btn-cv');
        if (button) {
            button.href = cvPath;
            button.setAttribute('data-cv-path', cvPath);
            button.setAttribute('download', 'CV.pdf');
        }
    }

    const teamPageSlots = [
        ['teamHeaderSlot', `${COMPONENTS_PATH}/TeamHeader.html`],
        ['teamSectionSlot', `${COMPONENTS_PATH}/TeamSection.html`],
        ['teamLeaderCard', `${COMPONENTS_PATH}/TeamCardCoshin.html`],
        ['teamAndreaCard', `${COMPONENTS_PATH}/TeamCardAndrea.html`],
        ['teamRyanCard', `${COMPONENTS_PATH}/TeamCardRyan.html`],
        ['teamPravineeshCard', `${COMPONENTS_PATH}/TeamCardPravineesh.html`]
    ];

    for (const [slotId, filePath] of teamPageSlots) {
        await loadComponent(slotId, filePath);
    }

    for (const config of cvConfigs) {
        await renderCvButton(config.slot, config.cvPath);
    }
});