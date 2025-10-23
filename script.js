// Smooth scroll per i link di navigazione
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 95,
        behavior: 'smooth'
      });
    }
  });
});

// LOGICA FILTRI CORSI
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.filters button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      document.querySelectorAll('.course-card').forEach(card => {
        if (filter === 'all' || 
            card.dataset.age === filter || 
            card.dataset.tool === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});

// Apri popup al clic su una card
document.querySelectorAll('.tool-card').forEach(card => {
  const popupId = card.dataset.popup;
  if (popupId) {
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', () => {
      const modal = document.getElementById(popupId);
      modal.style.display = 'flex';
      setTimeout(() => modal.classList.add('active'), 10);
      modal.querySelector('.close-btn').focus();
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  }
});

// Chiudi QUALSIASI popup quando si clicca sulla X
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('close-btn')) {
    const modal = e.target.closest('.modal');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => modal.style.display = 'none', 300);
    }
  }
});

// Chiudi popup se si clicca fuori dal contenuto
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
    setTimeout(() => e.target.style.display = 'none', 300);
  }
});

// Chiudi popup con il tasto Esc
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach(modal => {
      modal.classList.remove('active');
      setTimeout(() => modal.style.display = 'none', 300);
    });
  }
});

// Animazione al caricamento e scroll
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });
});
