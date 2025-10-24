document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initModals();
});

// Scroll fluido più veloce
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = target.offsetTop - 70;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });
}

// Correzione pop-up (modali)
function initModals() {
  const modals = document.querySelectorAll('.modal');
  const body = document.body;

  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal));
    }
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  function closeModal(modal) {
    modal.classList.remove('show');
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.9)';
    setTimeout(() => {
      modal.style.display = 'none';
      modal.style.transform = 'scale(1)';
      modal.style.opacity = '';
      body.style.overflow = '';
    }, 150);
  }
}
