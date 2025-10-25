// ========================================
// INIZIALIZZAZIONE OTTIMIZZATA
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initModals();
  initCourseFilters();
  initScrollEffects();
});

// ========================================
// MENU MOBILE SEMPLIFICATO
// ========================================
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav');
  const header = document.querySelector('.header');

  if (!menuBtn || !nav) return;

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });

  // Chiudi menu al click sui link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ========================================
// SMOOTH SCROLL OTTIMIZZATO
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#' || targetId === '#!') {
        e.preventDefault();
        return;
      }
      
      const target = document.querySelector(targetId);
      
      if (target) {
        e.preventDefault();
        
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerHeight - 20;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ========================================
// GESTIONE MODALI SEMPLIFICATA
// ========================================
function initModals() {
  // Apri modal
  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') return;
      
      const modalId = card.getAttribute('data-popup');
      const modal = document.getElementById(modalId);
      
      if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Chiudi modal
  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal');
      closeModal(modal);
    });
  });

  // Chiudi con click sfondo o ESC
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal[style*="flex"]');
      if (openModal) closeModal(openModal);
    }
  });

  function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// ========================================
// FILTRI CORSI OTTIMIZZATI
// ========================================
function initCourseFilters() {
  const filterButtons = document.querySelectorAll('.filters button');
  const courseCards = document.querySelectorAll('.course-card');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      let visibleCount = 0;
      
      courseCards.forEach(card => {
        const age = card.dataset.age;
        const tool = card.dataset.tool;
        
        const shouldShow = filter === 'all' || age === filter || tool === filter;
        
        if (shouldShow) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ========================================
// EFFETTI SCROLL OTTIMIZZATI
// ========================================
function initScrollEffects() {
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Header compatto
    if (currentScroll > 100) {
      header.classList.add('compact');
    } else {
      header.classList.remove('compact');
    }
    
    // Ombra header
    if (currentScroll > 20) {
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.12)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
}

// ========================================
// LAZY LOADING SEMPLIFICATO
// ========================================
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
  });
}
