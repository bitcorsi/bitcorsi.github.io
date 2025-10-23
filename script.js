// Smooth scroll
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

// Animazione al caricamento
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

// Apri popup
document.querySelectorAll('.tool-card').forEach(card => {
  card.addEventListener('click', () => {
    const popupName = card.getAttribute('data-popup');
    document.getElementById('popup-' + popupName).style.display = 'flex';
  });
});

// Chiudi popup
document.addEventListener('click', e => {
  if (e.target.classList.contains('close-btn')) {
    e.target.closest('.modal').style.display = 'none';
  }
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});

// Filtri corsi
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
