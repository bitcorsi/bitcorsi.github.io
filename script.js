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
  initScrollToTop();
  initAnimations();
});

// ========================================
// SMOOTH SCROLL MIGLIORATO CON FIX COMPLETO (Miglioramento UX/Fluidità)
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

  // MODIFICA: Unico timeout ridotto per maggiore reattività (UX)
  setTimeout(() => {
    if (target.tabIndex < 0) target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }, 400); 

  /* Rimosso l'ulteriore timeout di 1000ms che causava problemi di focus multipli */
}

function closeModalForScroll(modal) {
  modal.classList.remove('show');
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// ========================================
// INTERSECTION OBSERVER PER ANIMAZIONI FLUIDE (Semplificazione)
// ========================================
function initIntersectionObserver() {
  const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -80px 0px' 
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  /* MODIFICA: Rimosso il delay progressivo JS. L'animazione è ora gestita unicamente dal CSS 'animate-in' in modo uniforme e più veloce. */
  document.querySelectorAll('.section, .tool-card, .course-card, .highlight-item').forEach(element => {
    /* element.style.transitionDelay = `${index * 0.05}s`; <- Rimosso */
    observer.observe(element);
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
// FILTRI CORSI (Semplificazione animazioni per maggiore fluidità)
// ========================================
function initCourseFilters() {
  const filterButtons = document.querySelectorAll('.filters button');
  const courseCards = document.querySelectorAll('.course-card');
  if (filterButtons.length === 0 || courseCards.length === 0) return;

  // Assicurati che al caricamento tutte le card siano visibili
  courseCards.forEach(card => {
    // Rimuove eventuali classi di nascondimento da caricamenti precedenti
    card.classList.remove('is-hidden'); 
    card.style.display = ''; // Assicura che sia visibile
  });

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      
      let visibleCount = 0;
      courseCards.forEach((card) => {
        const age = card.dataset.age;
        const tool = card.dataset.tool;
        const shouldShow = filter === 'all' || age === filter || age.includes(filter) || tool === filter;

        /* MODIFICA: Semplificata la logica. Tutto è gestito dalla classe CSS 'is-hidden' per animazioni veloci. */
        if (shouldShow) {
          card.classList.remove('is-hidden');
          card.style.display = ''; // Ripristina il display dopo l'animazione
          visibleCount++;
        } else {
          card.classList.add('is-hidden');
          // Rimosso il setTimeout di 300ms che nascondeva 'display: none' in JS,
          // l'animazione `max-height: 0` e `opacity: 0` in CSS è più pulita.
        }
      });
      
      // Funzione per l'accessibilità
      setTimeout(() => { announceFilterChange(filter, courseCards); }, 500); 
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
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Vai al contenuto principale';
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector('#home');
    if (target) scrollToTarget(target);
  });
  document.body.insertBefore(skipLink, document.body.firstChild);
}

function enhanceKeyboardNavigation() {
  document.querySelectorAll('.tool-card').forEach(card => {
    if (!card.hasAttribute('tabindex')) {
      card.setAttribute('tabindex', '0');
    }
  });
}

function createLiveRegion() {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.id = 'live-region';
  liveRegion.style.cssText = 'position: absolute; width: 1px; height: 1px; margin: -1px; border: 0; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap;';
  document.body.appendChild(liveRegion);
}

function announceToScreenReader(message) {
  const liveRegion = document.getElementById('live-region');
  if (liveRegion) {
    liveRegion.textContent = message;
    setTimeout(() => { liveRegion.textContent = ''; }, 1000);
  }
}

function announceFilterChange(filter, cards) {
  const visibleCards = Array.from(cards).filter(card => !card.classList.contains('is-hidden'));
  const count = visibleCards.length;
  let message;
  
  if (filter === 'all') {
    message = `${count} corsi totali visualizzati.`;
  } else {
    message = `${count} corsi filtrati per ${filter} visualizzati.`;
  }
  announceToScreenReader(message);
}

function addDynamicAriaLabels() {
  document.querySelectorAll('.btn-header').forEach(btn => {
    btn.setAttribute('aria-label', 'Iscriviti ai corsi');
  });
}

// ========================================
// HEADER SCROLL E VISIBILITÀ
// ========================================
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', throttle(handleScroll));
  handleScroll(); 
}

// ========================================
// FAQ ACCORDION
// ========================================
function initFAQAccordion() {
  const faqs = document.querySelectorAll('.faq-item');
  faqs.forEach(faq => {
    const header = faq.querySelector('.faq-header');
    const content = faq.querySelector('.faq-content');
    const icon = faq.querySelector('.faq-icon');
    
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      
      if (isExpanded) {
        content.style.maxHeight = '0';
        header.setAttribute('aria-expanded', 'false');
        icon.style.transform = 'rotate(0deg)';
      } else {
        // Chiudi tutti gli altri
        faqs.forEach(otherFaq => {
          const otherHeader = otherFaq.querySelector('.faq-header');
          const otherContent = otherFaq.querySelector('.faq-content');
          const otherIcon = otherFaq.querySelector('.faq-icon');
          if (otherHeader !== header && otherHeader.getAttribute('aria-expanded') === 'true') {
            otherContent.style.maxHeight = '0';
            otherHeader.setAttribute('aria-expanded', 'false');
            otherIcon.style.transform = 'rotate(0deg)';
          }
        });
        
        content.style.maxHeight = content.scrollHeight + 'px';
        header.setAttribute('aria-expanded', 'true');
        icon.style.transform = 'rotate(45deg)';
      }
    });
  });
}

// ========================================
// VALIDAZIONE FORM (Placeholder)
// ========================================
function initFormValidation() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    
    form.querySelectorAll('[required]').forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('is-invalid');
        isValid = false;
      } else {
        input.classList.remove('is-invalid');
      }
    });
    
    if (isValid) {
      alert('Modulo inviato con successo! (Simulazione)');
      form.reset();
    } else {
      alert('Per favore, compila tutti i campi richiesti.');
    }
  });

  form.querySelectorAll('[required]').forEach(input => {
    input.addEventListener('input', () => {
      if (input.value.trim()) {
        input.classList.remove('is-invalid');
      }
    });
  });
}

// ========================================
// SCROLL TO TOP
// ========================================
function initScrollToTop() {
  const scrollToTopButton = document.querySelector('.scroll-to-top');
  if (!scrollToTopButton) return;
  
  const handleScroll = () => {
    if (window.scrollY > 300) {
      scrollToTopButton.classList.add('show');
    } else {
      scrollToTopButton.classList.remove('show');
    }
  };
  
  scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  window.addEventListener('scroll', throttle(handleScroll));
}

// ========================================
// FUNZIONI DI OTTIMIZZAZIONE
// ========================================

function initAnimations() {
  const animations = document.querySelectorAll('.animate');
  animations.forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

function preloadCriticalImages() {
  const criticalImages = [
    'images/logo.png',
    'images/chi-siamo-hero.png',
    'images/lego-spike-prime.svg',
    'images/open-roberta.svg',
    'images/arduino.svg',
    'images/microbit.svg'
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
  'color: #FF6B35; font-size: 1.2em; font-weight: bold; padding: 5px 10px; border-radius: 5px; background: #FFF3E0;');
