document.addEventListener('DOMContentLoaded', () => {

  // Smooth scroll migliorato (sottrae altezza header sticky)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        // -95px è stato calcolato per compensare l'altezza dell'header sticky
        window.scrollTo({
          top: target.offsetTop - 95, 
          behavior: 'smooth'
        });
      }
    });
  });

  // Animazione al caricamento
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

  // Apri popup (CORREZIONE DEL BUG)
  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', () => {
      // Prendo direttamente l'ID corretto (es. 'spike')
      const popupId = card.getAttribute('data-popup'); 
      const modal = document.getElementById(popupId);
      if (modal) {
        modal.style.display = 'flex';
      }
    });
  });

  // Chiudi popup
  document.addEventListener('click', e => {
    // Chiudi se clicchi sulla "X"
    if (e.target.classList.contains('close-btn')) {
      e.target.closest('.modal').style.display = 'none';
    }
    // Chiudi se clicchi all'esterno (sullo sfondo del modal)
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  });

  // Filtri corsi
  document.querySelectorAll('.filters button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      document.querySelectorAll('.course-card').forEach(card => {
        // Logica migliorata: mostra se il filtro è 'all' O se l'età/strumento corrisponde
        const isAgeMatch = card.dataset.age.includes(filter);
        const isToolMatch = card.dataset.tool === filter;

        if (filter === 'all' || isAgeMatch || isToolMatch) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

});
