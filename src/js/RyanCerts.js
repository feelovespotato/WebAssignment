function initCerts() {
 
    const certs = [
  { name: 'Certification 1', desc: 'Description here', pdf: '../assets/images/Ryan/Certificate.pdf' },
  { name: 'Certification 2', desc: 'Description here', pdf: '../assets/images/Ryan/Endorsement.pdf' },
  { name: 'Certification 3', desc: 'Description here', pdf: '../assets/images/Ryan/Prefect2023.pdf' },
  { name: 'Certification 4', desc: 'Description here', pdf: '../assets/images/Ryan/SunwayAce.pdf' },
  { name: 'Certification 5', desc: 'Description here', pdf: '../assets/images/Ryan/SunwayFIST.pdf' },
];

  let current = 0;

  const frame = document.getElementById('cert-frame');
  const name = document.getElementById('cert-name');
  const desc = document.getElementById('cert-desc');
  const dotsContainer = document.getElementById('cert-dots');

  // create dots
  certs.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'cert-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => { current = i; updateCert(); });
    dotsContainer.appendChild(dot);
  });

  function updateCert() {
    const cert = certs[current];
    frame.setAttribute('src', cert.pdf);
    name.textContent = cert.name;
    desc.textContent = cert.desc;

    document.querySelectorAll('.cert-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  document.getElementById('prevCert').addEventListener('click', () => {
    current = (current - 1 + certs.length) % certs.length;
    updateCert();
  });

  document.getElementById('nextCert').addEventListener('click', () => {
    current = (current + 1) % certs.length;
    updateCert();
  });

  updateCert();
}