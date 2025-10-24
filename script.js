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
});

// ========================================
// SMOOTH SCROLL MIGLIORATO
// ========================================
function initSmoothScroll() {
  const headerHeight = document.querySelector('.header').offsetHeight;
  
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
        
        // Calcola posizione tenendo conto dell'header sticky
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerHeight - 20;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Focus management per accessibilità
        target.focus();
        if (document.activeElement !== target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      }
    });
  });
}

// ========================================
// INTERSECTION OBSERVER PER ANIMAZIONI
// ========================================
function initIntersectionObserver() {
  // Configurazione observer con migliori performance
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
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
  document.querySelectorAll('.tool-card, .course-card').forEach(card => {
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
    
    // Rendi le card focusabili
    card.setAttribute('tabindex', '0');
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
    const firstFocusable = modal.querySelector('button, a, [tabindex]');
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 100);
    }
    
    // Trap focus nel modal
    trapFocus(modal);
  }
  
  function closeModal(modal) {
    modal.style.display = 'none';
    body.style.overflow = '';
    
    // Ritorna il focus all'elemento che ha aperto il modal
    const openedBy = document.querySelector('.tool-card:focus');
    if (openedBy) openedBy.focus();
  }
  
  function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    modal.addEventListener('keydown', function(e) {
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
    });
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
      courseCards.forEach(card => {
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
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
      
      // Annuncio per screen reader
      announceFilterChange(filter, courseCards);
    });
  });
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
    top: -40px;
    left: 0;
    background: var(--primary);
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 10000;
  `;
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
  
  document.body.insertBefore(skipLink, document.body.firstChild);
}

function enhanceKeyboardNavigation() {
  // Evidenzia gli elementi quando sono in focus
  const focusableElements = document.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  focusableElements.forEach(el => {
    el.addEventListener('focus', () => {
      el.style.outline = '2px solid var(--primary)';
      el.style.outlineOffset = '2px';
    });
    
    el.addEventListener('blur', () => {
      el.style.outline = '';
      el.style.outlineOffset = '';
    });
  });
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

function announceFilterChange(filter, cards) {
  const liveRegion = document.querySelector('[aria-live]');
  if (!liveRegion) return;
  
  const visibleCount = Array.from(cards).filter(
    card => card.style.display !== 'none'
  ).length;
  
  const filterName = filter === 'all' ? 'tutti i corsi' : filter;
  liveRegion.textContent = `Filtro applicato: ${filterName}. ${visibleCount} corsi visualizzati.`;
}

// ========================================
// OTTIMIZZAZIONI PERFORMANCE
// ========================================

// Lazy loading per immagini (fallback per browser senza supporto nativo)
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Preload delle immagini critiche
function preloadCriticalImages() {
  const criticalImages = [
    'images/logo.png',
    'images/chi-siamo-hero.png'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Esegui preload
preloadCriticalImages();

// ========================================
// GESTIONE SCROLL HEADER
// ========================================
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', debounce(() => {
  const currentScroll = window.pageYOffset;
  
  // Aggiungi shadow quando si scrolla
  if (currentScroll > 10) {
    header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.06)';
  }
  
  lastScroll = currentScroll;
}, 10));

// ========================================
// ANIMAZIONE CSS KEYFRAMES
// ========================================
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// ========================================
// GESTIONE ERRORI IMMAGINI
// ========================================
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    this.style.display = 'none';
    console.warn(`Impossibile caricare l'immagine: ${this.src}`);
  });
});

// ========================================
// LOG VERSIONE
// ========================================
console.log('%c🤖 Bit Corsi - Website Ottimizzato v2.0', 
  'color: #FF6B35; font-size: 14px; font-weight: bold;');
console.log('%cPrestazioni migliorate ✓ | Accessibilità ✓ | UX ottimizzata ✓', 
  'color: #555; font-size: 12px;');
