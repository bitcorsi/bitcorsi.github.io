// Smooth scroll per i link di navigazione (FIXED OFFSET per header sticky)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      window.scrollTo({
        // Offset aumentato a 95px per compensare l'altezza dell'header sticky
        top: target.offsetTop - 95,
        behavior: 'smooth'
      });
    }
  });
});

// LOGICA FILTRI CORSI (Usata nella pagina corsi.html)
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

// Apri popup al clic su una card (Usata nella pagina index.html)
document.querySelectorAll('.tool-card').forEach((card, index) => {
  const popups = ['popup-spike', 'popup-roberta', 'popup-arduino', 'popup-microbit'];
  if (popups[index]) {
    card.addEventListener('click', () => {
      document.getElementById(popups[index]).style.display = 'block';
    });
  }
});

// Chiudi QUALSIASI popup quando si clicca sulla X
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('close-btn')) {
    const modal = e.target.closest('.modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
});

// Chiudi popup se si clicca fuori dal contenuto
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
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
