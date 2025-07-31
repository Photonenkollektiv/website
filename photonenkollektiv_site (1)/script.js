// Simple JavaScript to handle the contact form submission.
// As there is no backend connected, the form submission is
// intercepted and a friendly alert is shown instead.

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', evt => {
      evt.preventDefault();
      const name = document.getElementById('name').value;
      alert(`Vielen Dank, ${name || 'Freund/in'}! Wir werden uns bald bei dir melden.`);
      contactForm.reset();
    });
  }

  // Gallery modal functionality
  const modal = document.getElementById('img-modal');
  const modalImg = document.getElementById('modal-image');
  const modalClose = modal ? modal.querySelector('.close') : null;
  const galleryImages = document.querySelectorAll('#gallery .gallery-grid img');

  galleryImages.forEach(img => {
    img.addEventListener('click', () => {
      if (modal && modalImg) {
        modalImg.src = img.src;
        modal.style.display = 'flex';
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  // Close modal when clicking outside the image
  if (modal) {
    modal.addEventListener('click', event => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
});