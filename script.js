// ========================================
// OTTIMIZZAZIONE E PERFORMANCE
// ========================================

// Debounce function per ottimizzare eventi scroll/resize
function debounce(func, wait = 10) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ========================================
// INIZIALIZZAZIONE AL CARICAMENTO DOM
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initIntersectionObserver();
  initModals();
  initCourseFilters();
  initAccessibility();
  initScrollEffects();
  initFABBehavior();
  
  // Log caricamento completato
  console.log('%c🤖 Bit Corsi - Website Ottimizzato v3.0', 
    'color: #FF6B35; font-size: 16px; font-weight: bold; padding: 10px;');
  console.log('%c✓ Performance | ✓ UX Eccellente | ✓ Accessibilità | ✓ Mobile First', 
    'color: #10B981; font-size: 12px; padding: 5px;');
});

// ========================================
// SMOOTH SCROLL PERFEZIONATO
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Ignora link vuoti
      if (targetId === '#' || targetId === '#!') {
        e.preventDefault();
        return;
      }
      
      const target = document.querySelector(targetId);
      
      if (target) {
        e.preventDefault();
        
        // Chiudi eventuali modali aperti prima dello scroll
        const openModal = document.querySelector('.modal[style*="flex"]');
        if (openModal) {
          closeModalForScroll(openModal);
        }
        
        // Aspetta che il modal si chiuda, poi scrolla
        setTimeout(() => {
          scrollToTarget(target);
        }, openModal ? 150 : 0);
      }
    });
  });
}

function scrollToTarget(target) {
  // Calcola dinamicamente l'altezza dell'header
  const header = document.querySelector('.header');
  const headerHeight = header ? header.offsetHeight : 0;
  
  // Padding extra per sicurezza (più generoso per mobile)
  const isMobile = window.innerWidth < 768;
  const extraPadding = isMobile ? 25 : 20;
  
  // Calcola la posizione finale
  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = targetPosition - headerHeight - extraPadding;
  
  // Scrolla smooth
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
  
  // Focus management per accessibilità
  setTimeout(() => {
    target.focus();
    if (document.activeElement !== target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
    }
  }, 600);
}

function closeModalForScroll(modal) {
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// ========================================
// INTERSECTION OBSERVER PER ANIMAZIONI
// ========================================
function initIntersectionObserver() {
  // Configurazione observer con migliori performance
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        // Ottimizzazione: smetti di osservare dopo l'animazione
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Osserva tutte le sezioni
  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });
  
  // Osserva anche le card per animazioni progressive
  document.querySelectorAll('.tool-card, .course-card, .highlight-item').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(card);
  });
}

// ========================================
// GESTIONE MODALI MIGLIORATA
// ========================================
function initModals() {
  const modals = document.querySelectorAll('.modal');
  const body = document.body;
  
  // Apri modal al click sulla card
  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Previeni apertura se si clicca su un link interno
      if (e.target.tagName === 'A') return;
      
      const modalId = card.getAttribute('data-popup');
      const modal = document.getElementById(modalId);
      
      if (modal) {
        openModal(modal);
      }
    });
    
    // Accessibilità: apri con Enter o Space
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const modalId = card.getAttribute('data-popup');
        const modal = document.getElementById(modalId);
        if (modal) openModal(modal);
      }
    });
  });
  
  // Chiudi modal con click sul bottone close
  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal');
      if (modal) closeModal(modal);
    });
  });
  
  // Chiudi modal con click sullo sfondo
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });
  
  // Chiudi modal con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal[style*="flex"]');
      if (openModal) closeModal(openModal);
    }
  });
  
  function openModal(modal) {
    modal.style.display = 'flex';
    body.style.overflow = 'hidden';
    
    // Focus sul primo elemento focusabile nel modal
    const firstFocusable = modal.querySelector('button, a');
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 150);
    }
    
    // Trap focus nel modal
    trapFocus(modal);
  }
  
  function closeModal(modal) {
    modal.style.display = 'none';
    body.style.overflow = '';
  }
  
  function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };
    
    modal.addEventListener('keydown', handleTabKey);
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
      // Rimuovi classe active da tutti i bottoni
      filterButtons.forEach(b => b.classList.remove('active'));
      
      // Aggiungi classe active al bottone cliccato
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      
      // Animazione smooth per i corsi
      let visibleCount = 0;
      courseCards.forEach((card, index) => {
        const age = card.dataset.age;
        const tool = card.dataset.tool;
        
        // Logica filtro migliorata
        const shouldShow = 
          filter === 'all' || 
          age === filter || 
          age.includes(filter) || 
          tool === filter;
        
        if (shouldShow) {
          card.style.display = '';
          card.style.animation = `fadeIn 0.5s ease ${index * 0.1}s forwards`;
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });
      
      // Annuncio per screen reader
      announceFilterChange(filter, visibleCount);
    });
  });
}

function announceFilterChange(filter, count) {
  const liveRegion = document.querySelector('[aria-live]');
  if (!liveRegion) return;
  
  const filterName = filter === 'all' ? 'tutti i corsi' : filter;
  liveRegion.textContent = `Filtro applicato: ${filterName}. ${count} corsi visualizzati.`;
}

// ========================================
// ACCESSIBILITÀ
// ========================================
function initAccessibility() {
  // Aggiungi skip link per navigazione da tastiera
  addSkipLink();
  
  // Migliora la navigazione da tastiera
  enhanceKeyboardNavigation();
  
  // Gestisci gli annunci per screen reader
  createLiveRegion();
}

function addSkipLink() {
  const skipLink = document.createElement('a');
  skipLink.href = '#home';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Vai al contenuto principale';
  skipLink.style.cssText = `
    position: absolute;
    top: -60px;
    left: 20px;
    background: var(--primary);
    color: white;
    padding: 12px 24px;
    text-decoration: none;
    font-weight: 600;
    border-radius: 8px;
    z-index: 100000;
    transition: top 0.3s;
  `;
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '20px';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-60px';
  });
  
  document.body.insertBefore(skipLink, document.body.firstChild);
}

function enhanceKeyboardNavigation() {
  // Evidenzia gli elementi quando sono in focus
  const style = document.createElement('style');
  style.textContent = `
    *:focus-visible {
      outline: 3px solid var(--primary);
      outline-offset: 3px;
      border-radius: 4px;
    }
  `;
  document.head.appendChild(style);
}

function createLiveRegion() {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.style.cssText = `
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  `;
  document.body.appendChild(liveRegion);
}

// ========================================
// EFFETTI SCROLL HEADER
// ========================================
function initScrollEffects() {
  const header = document.querySelector('.header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', debounce(() => {
    const currentScroll = window.pageYOffset;
    
    // Aggiungi/rimuovi shadow basato sullo scroll
    if (currentScroll > 20) {
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.12)';
    } else {
      header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
    }
    
    lastScroll = currentScroll;
  }, 10));
}

// ========================================
// COMPORTAMENTO FAB (FLOATING ACTION BUTTONS)
// ========================================
function initFABBehavior() {
  const fabContainer = document.querySelector('.fab-container');
  if (!fabContainer) return;
  
  let fabTimeout;
  
  // Nascondi FAB quando si scrolla in basso, mostra quando si scrolla in alto
  let lastScrollY = window.pageYOffset;
  
  window.addEventListener('scroll', debounce(() => {
    const currentScrollY = window.pageYOffset;
    
    // Nascondi se scrolliamo giù, mostra se scrolliamo su
    if (currentScrollY > lastScrollY && currentScrollY > 300) {
      fabContainer.style.transform = 'translateX(150px)';
    } else {
      fabContainer.style.transform = 'translateX(0)';
    }
    
    lastScrollY = currentScrollY;
  }, 10));
  
  // Aggiungi transizione smooth
  fabContainer.style.transition = 'transform 0.3s ease';
}

// ========================================
// GESTIONE ERRORI IMMAGINI
// ========================================
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    this.style.opacity = '0';
    this.style.height = '0';
    console.warn(`Impossibile caricare: ${this.src}`);
  });
});

// ========================================
// ANIMAZIONI CSS AGGIUNTIVE
// ========================================
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
  
  /* Smooth scroll per tutti i link interni */
  html {
    scroll-behavior: smooth;
  }
  
  /* Loading state per immagini */
  img {
    transition: opacity 0.3s ease;
  }
  
  img[loading="lazy"] {
    opacity: 0;
  }
  
  img[loading="lazy"].loaded {
    opacity: 1;
  }
`;
document.head.appendChild(style);

// ========================================
// LAZY LOADING ENHANCEMENT
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

// ========================================
// PERFORMANCE MONITORING (DEV ONLY)
// ========================================
if (window.performance && window.performance.timing) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`📊 Tempo di caricamento: ${pageLoadTime}ms`);
    }, 0);
  });
}

// ========================================
// UTILITY: SMOOTH REVEAL ON SCROLL
// ========================================
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  
  reveals.forEach(element => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    
    if (elementTop < windowHeight - elementVisible) {
      element.classList.add('active');
    }
  });
}

window.addEventListener('scroll', debounce(revealOnScroll, 10));

// ========================================
// INIT: ACTIVE NAV LINK HIGHLIGHTING
// ========================================
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (window.pageYOffset >= sectionTop - 150) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', debounce(updateActiveNavLink, 10));

// ========================================
// FORM VALIDATION (se aggiungerai form in futuro)
// ========================================
function initFormValidation() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });
}

// Esegui al caricamento
initFormValidation();
