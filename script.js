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

// Throttle function per eventi ad alta frequenza
function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
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
  initHeaderScroll();
  initFAQAccordion();
  initFormValidation();
  initScrollToTop();
  initAnimations();
});

// ========================================
// SMOOTH SCROLL MIGLIORATO CON FIX COMPLETO
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
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
          closeModalForScroll(openModal);
        }
        
        // Aspetta che il modal si chiuda, poi scrolla
        setTimeout(() => {
          scrollToTarget(target);
        }, openModal ? 100 : 0);
      }
    });
  });
}

function scrollToTarget(target) {
  // Calcola dinamicamente l'altezza dell'header
  const header = document.querySelector('.header');
  const headerHeight = header ? header.offsetHeight : 0;
  
  // Aggiunge 20px di padding extra per sicurezza
  const extraPadding = 20;
  
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
  }, 500);
}

function closeModalForScroll(modal) {
  modal.classList.remove('show');
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
  document.querySelectorAll('.tool-card, .course-card, .highlight-item').forEach((card, index) => {
    // Aggiungi delay progressivo per effetto cascata
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
  let lastFocusedElement = null;
  
  // Apri modal al click sulla card
  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Previeni apertura se si clicca su un link interno
      if (e.target.tagName === 'A') return;
      
      const modalId = card.getAttribute('data-popup');
      const modal = document.getElementById(modalId);
      
      if (modal) {
        lastFocusedElement = document.activeElement;
        openModal(modal);
      }
    });
    
    // Accessibilità: apri con Enter o Space
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const modalId = card.getAttribute('data-popup');
        const modal = document.getElementById(modalId);
        if (modal) {
          lastFocusedElement = document.activeElement;
          openModal(modal);
        }
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
      const openModal = document.querySelector('.modal.show');
      if (openModal) closeModal(openModal);
    }
  });
  
  function openModal(modal) {
    modal.classList.add('show');
    modal.style.display = 'flex';
    body.style.overflow = 'hidden';
    
    // Annuncio per screen reader
    announceToScreenReader('Finestra modale aperta');
    
    // Focus sul primo elemento focusabile nel modal
    const firstFocusable = modal.querySelector('.close-btn');
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 100);
    }
    
    // Trap focus nel modal
    trapFocus(modal);
  }
  
  function closeModal(modal) {
    modal.classList.remove('show');
    // Aspetta la fine dell'animazione prima di nascondere
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
    body.style.overflow = '';
    
    // Annuncio per screen reader
    announceToScreenReader('Finestra modale chiusa');
    
    // Ritorna il focus all'elemento che ha aperto il modal
    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
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
  
  if (filterButtons.length === 0 || courseCards.length === 0) return;
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Rimuovi classe active da tutti i bottoni
      filterButtons.forEach(b => b.classList.remove('active'));
      
      // Aggiungi classe active al bottone cliccato
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      
      // Animazione smooth per i corsi
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
          // Fade in con delay progressivo
          setTimeout(() => {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          }, index * 50);
        } else {
          // Fade out
          card.style.opacity = '0';
          card.style.transform = 'translateY(-20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
      
      // Annuncio per screen reader
      setTimeout(() => {
        announceFilterChange(filter, courseCards);
      }, 500);
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
  
  // Aggiungi ARIA labels dinamici
  addDynamicAriaLabels();
}

function addSkipLink() {
  const skipLink = document.createElement('a');
  skipLink.href = '#home';
  skipLink.className = 'skip-link sr-only';
  skipLink.textContent = 'Vai al contenuto principale';
  skipLink.style.cssText = `
    position: fixed;
    top: -40px;
    left: 10px;
    background: var(--primary);
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    z-index: 10000;
    border-radius: 4px;
    font-weight: 600;
    transition: top 0.3s ease;
  `;
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '10px';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
  
  document.body.insertBefore(skipLink, document.body.firstChild);
}

function enhanceKeyboardNavigation() {
  // Aggiungi indicatori visivi per focus
  const style = document.createElement('style');
  style.textContent = `
    *:focus-visible {
      outline: 3px solid var(--primary) !important;
      outline-offset: 2px !important;
    }
  `;
  document.head.appendChild(style);
}

function createLiveRegion() {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.id = 'live-region';
  liveRegion.style.cssText = `
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  `;
  document.body.appendChild(liveRegion);
}

function announceToScreenReader(message) {
  const liveRegion = document.getElementById('live-region');
  if (!liveRegion) return;
  
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 100);
}

function announceFilterChange(filter, cards) {
  const visibleCount = Array.from(cards).filter(
    card => card.style.display !== 'none'
  ).length;
  
  const filterName = filter === 'all' ? 'tutti i corsi' : filter;
  announceToScreenReader(`Filtro applicato: ${filterName}. ${visibleCount} corsi visualizzati.`);
}

function addDynamicAriaLabels() {
  // Aggiungi labels ai bottoni FAB
  const fabButtons = document.querySelectorAll('.fab');
  fabButtons.forEach(fab => {
    if (!fab.getAttribute('aria-label')) {
      const tooltip = fab.querySelector('.fab-tooltip');
      if (tooltip) {
        fab.setAttribute('aria-label', tooltip.textContent);
      }
    }
  });
}

// ========================================
// GESTIONE SCROLL HEADER
// ========================================
function initHeaderScroll() {
  let lastScroll = 0;
  const header = document.querySelector('.header');
  
  if (!header) return;
  
  const handleScroll = throttle(() => {
    const currentScroll = window.pageYOffset;
    
    // Aggiungi/rimuovi shadow quando si scrolla
    if (currentScroll > 10) {
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.boxShadow = 'var(--shadow)';
    }
    
    // Header nascosto durante scroll down (opzionale)
    // Decommentare per abilitare
    /*
    if (currentScroll > lastScroll && currentScroll > 200) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    */
    
    lastScroll = currentScroll;
  }, 10);
  
  window.addEventListener('scroll', handleScroll, { passive: true });
}

// ========================================
// FAQ ACCORDION
// ========================================
function initFAQAccordion() {
  const faqDetails = document.querySelectorAll('.faq details');
  
  faqDetails.forEach(detail => {
    detail.addEventListener('toggle', function() {
      if (this.open) {
        // Chiudi altri accordion aperti (comportamento accordion singolo)
        // Commentare se si vuole permettere apertura multipla
        faqDetails.forEach(otherDetail => {
          if (otherDetail !== this && otherDetail.open) {
            otherDetail.open = false;
          }
        });
        
        // Annuncio per screen reader
        const summary = this.querySelector('summary');
        if (summary) {
          announceToScreenReader(`Domanda espansa: ${summary.textContent}`);
        }
      }
    });
  });
}

// ========================================
// VALIDAZIONE FORM (se presente)
// ========================================
function initFormValidation() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      let isValid = true;
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('error');
          input.setAttribute('aria-invalid', 'true');
        } else {
          input.classList.remove('error');
          input.removeAttribute('aria-invalid');
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        announceToScreenReader('Alcuni campi richiesti non sono stati compilati');
      }
    });
  });
}

// ========================================
// SCROLL TO TOP BUTTON
// ========================================
function initScrollToTop() {
  // Crea bottone scroll to top
  const scrollBtn = document.createElement('button');
  scrollBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  `;
  scrollBtn.className = 'scroll-to-top';
  scrollBtn.setAttribute('aria-label', 'Torna su');
  scrollBtn.style.cssText = `
    position: fixed;
    bottom: 110px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--gray-800);
    color: white;
    border: none;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-xl);
    transition: var(--transition);
    z-index: 999;
    opacity: 0;
    transform: scale(0.8);
  `;
  
  document.body.appendChild(scrollBtn);
  
  // Mostra/nascondi bottone
  window.addEventListener('scroll', debounce(() => {
    if (window.pageYOffset > 500) {
      scrollBtn.style.display = 'flex';
      requestAnimationFrame(() => {
        scrollBtn.style.opacity = '1';
        scrollBtn.style.transform = 'scale(1)';
      });
    } else {
      scrollBtn.style.opacity = '0';
      scrollBtn.style.transform = 'scale(0.8)';
      setTimeout(() => {
        scrollBtn.style.display = 'none';
      }, 300);
    }
  }, 100), { passive: true });
  
  // Click handler
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  scrollBtn.addEventListener('mouseenter', () => {
    scrollBtn.style.background = 'var(--primary)';
    scrollBtn.style.transform = 'scale(1.1)';
  });
  
  scrollBtn.addEventListener('mouseleave', () => {
    scrollBtn.style.background = 'var(--gray-800)';
    scrollBtn.style.transform = 'scale(1)';
  });
}

// ========================================
// ANIMAZIONI AGGIUNTIVE
// ========================================
function initAnimations() {
  // Aggiungi animazioni hover alle card
  const cards = document.querySelectorAll('.tool-card, .course-card, .contact-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    });
  });
  
  // Animazione contatore per numeri (se presenti)
  animateCounters();
}

function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    // Inizia animazione quando l'elemento è visibile
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(counter);
  });
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
          img.classList.add('loaded');
        }
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px'
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
// GESTIONE ERRORI IMMAGINI
// ========================================
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    // Sostituisci con immagine placeholder
    this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif"%3EImmagine non disponibile%3C/text%3E%3C/svg%3E';
    this.alt = 'Immagine non disponibile';
    console.warn(`Impossibile caricare l'immagine: ${this.dataset.originalSrc || 'unknown'}`);
  });
  
  // Salva src originale
  img.dataset.originalSrc = img.src;
});

// ========================================
// DETECTION DISPOSITIVO E OTTIMIZZAZIONI
// ========================================
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (isMobile || isTouch) {
  document.body.classList.add('touch-device');
  
  // Disabilita hover effects su touch devices
  const style = document.createElement('style');
  style.textContent = `
    .touch-device *:hover {
      /* Mantieni solo le transizioni essenziali */
    }
  `;
  document.head.appendChild(style);
}

// ========================================
// PERFORMANCE MONITORING (Development)
// ========================================
if (window.performance && console.table) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      const paintData = performance.getEntriesByType('paint');
      
      console.group('📊 Performance Metrics');
      console.log('DOM Content Loaded:', Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart), 'ms');
      console.log('Load Complete:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
      
      paintData.forEach(paint => {
        console.log(`${paint.name}:`, Math.round(paint.startTime), 'ms');
      });
      console.groupEnd();
    }, 0);
  });
}

// ========================================
// SERVICE WORKER REGISTRATION (opzionale)
// ========================================
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('✓ Service Worker registered'))
      .catch(err => console.log('✗ Service Worker registration failed:', err));
  });
}

// ========================================
// LOG VERSIONE E CREDITS
// ========================================
console.log('%c🤖 Bit Corsi - Website Ottimizzato v2.0', 
  'color: #FF6B35; font-size: 16px; font-weight: bold; padding: 8px;');
console.log('%cPrestazioni ✓ | Accessibilità ✓ | UX ✓ | SEO ✓', 
  'color: #10B981; font-size: 12px; padding: 4px;');
console.log('%cDevelopment by Bit Team - 2025', 
  'color: #6B7280; font-size: 10px; font-style: italic;');

// ========================================
// EXPORT PER TESTING (opzionale)
// ========================================
window.BitCorsi = {
  scrollToTarget,
  announceToScreenReader,
  version: '2.0.0'
};
