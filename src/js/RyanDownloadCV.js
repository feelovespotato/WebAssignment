function downloadCV() {
  const link = document.createElement('a');
  link.href = '../assets/images/Ryan/Ryan_CV.pdf';
  link.download = 'Ryan_Gabriel_Stevens_CV.pdf';
  link.click();
}