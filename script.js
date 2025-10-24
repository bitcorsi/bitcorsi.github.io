// ========================================
// OTTIMIZZAZIONE E PERFORMANCE
// ========================================

// Debounce function per ottimizzare eventi scroll/resize
function debounce(func, wait = 16) {
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
  initAnimations();
});

// ========================================
// SMOOTH SCROLL MIGLIORATO CON FIX COMPLETO
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
        
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
          closeModalForScroll(openModal);
        }
        
        setTimeout(() => {
          scrollToTarget(target);
        }, openModal ? 100 : 0);
      }
    });
  });
}

function scrollToTarget(target) {
  const header = document.querySelector('.header');
  const headerHeight = header ? header.offsetHeight : 0;
  const extraPadding = 20;

  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = targetPosition - headerHeight - extraPadding;

  // Usa SOLO window.scrollTo (niente scrollIntoView)
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });

  // Focus per accessibilità
  setTimeout(() => {
    if (target.tabIndex < 0) target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }, 800);


  // Focus per accessibilità
  setTimeout(() => {
    target.focus();
    if (document.activeElement !== target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
    }
  }, 1000);
}

function closeModalForScroll(modal) {
  modal.classList.remove('show');
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// ========================================
// INTERSECTION OBSERVER PER ANIMAZIONI FLUIDE
// ========================================
function initIntersectionObserver() {
  const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -80px 0px' // margine più ampio per anticipare le animazioni
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Osserva sezioni principali
  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });
  
  // Osserva card con delay progressivo
  document.querySelectorAll('.tool-card, .course-card, .highlight-item').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.05}s`;
    observer.observe(card);
  });
}

// ========================================
// GESTIONE MODALI
// ========================================
function initModals() {
  const modals = document.querySelectorAll('.modal');
  const body = document.body;
  let lastFocusedElement = null;
  
  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') return;
      
      const modalId = card.getAttribute('data-popup');
      const modal = document.getElementById(modalId);
      
      if (modal) {
        lastFocusedElement = document.activeElement;
        openModal(modal);
      }
    });
    
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
  
  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal');
      if (modal) closeModal(modal);
    });
  });
  
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });
  
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
    announceToScreenReader('Finestra modale aperta');
    
    const firstFocusable = modal.querySelector('.close-btn');
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 100);
    }
    
    trapFocus(modal);
  }
  
  function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 400);
    body.style.overflow = '';
    announceToScreenReader('Finestra modale chiusa');
    
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
// FILTRI CORSI
// ========================================
function initCourseFilters() {
  const filterButtons = document.querySelectorAll('.filters button');
  const courseCards = document.querySelectorAll('.course-card');
  
  if (filterButtons.length === 0 || courseCards.length === 0) return;
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      
      courseCards.forEach((card, index) => {
        const age = card.dataset.age;
        const tool = card.dataset.tool;
        
        const shouldShow = 
          filter === 'all' || 
          age === filter || 
          age.includes(filter) || 
          tool === filter;
        
        if (shouldShow) {
          setTimeout(() => {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          }, index * 40);
        } else {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '0';
          card.style.transform = 'translateY(-10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
      
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
  addSkipLink();
  enhanceKeyboardNavigation();
  createLiveRegion();
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
    
    if (currentScroll > 10) {
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.boxShadow = 'var(--shadow)';
    }
    
    lastScroll = currentScroll;
  }, 16);
  
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
        faqDetails.forEach(otherDetail => {
          if (otherDetail !== this && otherDetail.open) {
            otherDetail.open = false;
          }
        });
        const summary = this.querySelector('summary');
        if (summary) {
          announceToScreenReader(`Domanda espansa: ${summary.textContent}`);
        }
      }
    });
  });
}

// ========================================
// VALIDAZIONE FORM
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
// ANIMAZIONI AGGIUNTIVE
// ========================================
function initAnimations() {
  const cards = document.querySelectorAll('.tool-card, .course-card, .contact-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'transform 0.35s ease, box-shadow 0.35s ease';
    });
  });
  
  animateCounters();
}

function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  
  counters.forEach(counter => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(counter.getAttribute('data-count'));
          const duration = 1500;
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

preloadCriticalImages();

document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif"%3EImmagine non disponibile%3C/text%3E%3C/svg%3E';
    this.alt = 'Immagine non disponibile';
  });
  
  img.dataset.originalSrc = img.src;
});

// ========================================
// DETECTION DISPOSITIVO MOBILE
// ========================================
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (isMobile || isTouch) {
  document.body.classList.add('touch-device');
}

// ========================================
// LOG VERSIONE
// ========================================
console.log('%c🤖 Bit Corsi - Website Ottimizzato v2.1', 
  'color: #FF6B35; font-size: 16px; font-weight: bold; padding: 8px;');
console.log('%cPrestazioni ✓ | Accessibilità ✓ | UX Fluida ✓', 
  'color: #10B981; font-size: 12px; padding: 4px;');

// ========================================
// EXPORT PER TESTING
// ========================================
window.BitCorsi = {
  scrollToTarget,
  announceToScreenReader,
  version: '2.1.0'
};
