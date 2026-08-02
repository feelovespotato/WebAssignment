function initCerts() {

   const certs = [
  { name: 'Certification 1: School Leaving Certificate from BeaconHouse Sri Murni', 
    desc: 'This certifications shows my leadership roles during my time at BeaconHouse Sri Murni ', 
    image: '../assets/images/Ryan/Certificate.png', pdf: '../assets/images/Ryan/Certificate.pdf' },

  { name: 'Certification 2: Endorsement from School', 
    desc: 'This is an endorsement from my school for my role as the head prefect and my contributions to the school community', 
    image: '../assets/images/Ryan/Endorsement.png', pdf: '../assets/images/Ryan/Endorsement.pdf' },

  { name: 'Certification 3: Prefect Award 2023', 
    desc: 'This is one of several certifications I received for my role as a prefect in BeaconHouse Sri Murni, recognizing my dedication to maintaining discipline and contributing to the school community', 
    image: '../assets/images/Ryan/Prefect2023.png', pdf: '../assets/images/Ryan/Prefect2023.pdf' },

  { name: 'Certification 4: Sunway Ace Award', 
    desc: 'This is an award I received for scoring a high GPA in my foundation program at Sunway Collage, granting me a scholarship for my undergraduate studies', 
    image: '../assets/images/Ryan/SunwayAce.png', pdf: '../assets/images/Ryan/SunwayAce.pdf' },

  { name: 'Certification 5: Sunway FIST+ Certificate', 
    desc: 'This is a certificate for completing the Sunway FIST+ program, demonstrating my introduction to Sunway University & College and its assignments, as well as my adaptability.', 
    image: '../assets/images/Ryan/SunwayFIST+.png', pdf: '../assets/images/Ryan/SunwayFIST.pdf' },
];
  let current = 0;

  const frame = document.getElementById('cert-frame');
  const name = document.getElementById('cert-name');
  const desc = document.getElementById('cert-desc');
  const pdfLink = document.getElementById('cert-pdf-link');
  const dotsContainer = document.getElementById('cert-dots');

  certs.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'cert-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => { current = i; updateCert(); });
    dotsContainer.appendChild(dot);
  });

  function updateCert() {
    const cert = certs[current];
    const display = document.getElementById('cert-display');

    display.classList.add('fading');

    setTimeout(() => {
      frame.setAttribute('src', cert.image);
      name.textContent = cert.name;
      desc.textContent = cert.desc;
      pdfLink.setAttribute('href', cert.pdf);

      document.querySelectorAll('.cert-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });

      display.classList.remove('fading');
    }, 250);
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