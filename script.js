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
  
  // Focus management per accessibilità (Ridotto a 150ms per percezione di velocità maggiore)
  setTimeout(() => {
    target.focus();
    if (document.activeElement !== target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
    }
  }, 150); // Modificato da 500ms a 150ms per velocizzare la percezione di fine scroll
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
    // Aspetta la fine dell'animazione prima di nascondere (300ms, in linea con la transizione CSS)
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
  
  // Funzione di utilità per screen reader
  function announceToScreenReader(message) {
    const announcer = document.getElementById('aria-announcer');
    if (announcer) {
      announcer.textContent = message;
    }
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
      let delay = 0;
      
      // Animazione smooth per i corsi
      courseCards.forEach((card, index) => {
        const age = card.dataset.age;
        const tool = card.dataset.tool;
        
        // Logica filtro migliorata
        const shouldShow = filter === 'all' || age === filter || age.includes(filter) || tool === filter;
        
        if (shouldShow) {
          // Fade in con delay progressivo
          setTimeout(() => {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          }, delay);
          delay += 50; // Aumento il delay per l'effetto cascata
        } else {
          // Fade out
          card.style.opacity = '0';
          card.style.transform = 'translateY(-20px)';
          
          // Nascondi dopo la transizione
          setTimeout(() => {
            card.style.display = 'none';
          }, 400); // 400ms per la transizione + un piccolo buffer
        }
      });
    });
  });
}

// ========================================
// ACCESSIBILITA'
// ========================================
function initAccessibility() {
  // Aggiungi focus visibile sui contenitori interattivi
  document.querySelectorAll('.tool-card, .course-card, .testimonial-card').forEach(card => {
    card.addEventListener('focus', () => {
      card.classList.add('focus-visible');
    });
    card.addEventListener('blur', () => {
      card.classList.remove('focus-visible');
    });
  });
}

// ========================================
// HEADER SCROLL E VISIBILITA'
// ========================================
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  let lastScrollTop = 0;
  
  const handleScroll = () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Nascondi/Mostra header su scroll down/up (non richiesto, ma utile per mobile UX)
    /*
    if (currentScroll > lastScrollTop && currentScroll > 200) {
      // Scroll Down
      header.style.transform = 'translateY(-100%)';
    } else {
      // Scroll Up
      header.style.transform = 'translateY(0)';
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    */
  };
  
  window.addEventListener('scroll', throttle(handleScroll, 100));
}

// ========================================
// ACCORDION FAQ
// ========================================
function initFAQAccordion() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const button = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      
      // Chiudi tutti gli altri
      document.querySelectorAll('.faq-item[data-expanded="true"]').forEach(openItem => {
        if (openItem !== item) {
          const openButton = openItem.querySelector('.faq-question');
          const openAnswer = openItem.querySelector('.faq-answer');
          
          openItem.setAttribute('data-expanded', 'false');
          openButton.setAttribute('aria-expanded', 'false');
          openAnswer.style.maxHeight = null;
          openAnswer.setAttribute('aria-hidden', 'true');
        }
      });
      
      // Apri/Chiudi l'elemento corrente
      if (isExpanded) {
        item.setAttribute('data-expanded', 'false');
        button.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
        answer.setAttribute('aria-hidden', 'true');
      } else {
        item.setAttribute('data-expanded', 'true');
        button.setAttribute('aria-expanded', 'true');
        // Imposta l'altezza per l'animazione smooth
        answer.style.maxHeight = answer.scrollHeight + "px";
        answer.setAttribute('aria-hidden', 'false');
      }
    });
  });
}

// ========================================
// VALIDAZIONE FORM CONTATTI
// ========================================
function initFormValidation() {
  const form = document.getElementById('contact-form');
  const messageElement = document.getElementById('form-message');
  
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simple validation
    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();
    const message = form.elements['message'].value.trim();
    
    if (name === '' || email === '' || message === '') {
      showMessage('Per favore, compila tutti i campi richiesti.', 'error');
      return;
    }
    
    // Simulate form submission
    console.log('Form data:', { name, email, message });
    
    // Simulazione di chiamata API di successo
    setTimeout(() => {
      showMessage('Messaggio inviato con successo! Ti risponderemo al più presto.', 'success');
      form.reset();
    }, 1000);
    
  });
  
  function showMessage(text, type) {
    messageElement.textContent = text;
    messageElement.classList.remove('success', 'error');
    messageElement.classList.add(type);
    
    // Rimuovi il messaggio dopo un po'
    setTimeout(() => {
      messageElement.textContent = '';
      messageElement.classList.remove(type);
    }, 5000);
  }
}

// ========================================
// SCROLL TO TOP BUTTON
// ========================================
function initScrollToTop() {
  const button = document.querySelector('.scroll-to-top');
  if (!button) return;
  
  const toggleVisibility = throttle(() => {
    if (window.pageYOffset > 400) {
      button.classList.add('visible');
    } else {
      button.classList.remove('visible');
    }
  }, 100);
  
  window.addEventListener('scroll', toggleVisibility);
  
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ========================================
// ANIMAZIONI AGGIUNTIVE
// ========================================
function initAnimations() {
  // Animazione per l'header logo (esempio di ridondanza che può essere rimosso se non ci sono animazioni specifiche)
  const logo = document.querySelector('.logo-img');
  if (logo) {
    logo.classList.add('fade-in');
  }
}

// ========================================
// PERFORMANCE MONITORAGGIO (Solo per debug)
// ========================================
// Funzione per monitorare i tempi di caricamento (Lasciato per utilità, ma potrebbe essere rimosso per massima pulizia)
function logPerformanceMetrics() {
  if (window.performance && window.performance.getEntriesByType) {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const paintData = window.performance.getEntriesByType('paint');

      console.groupCollapsed('Performance Metrics');
      console.log('DOM Content Loaded:', Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart), 'ms');
      console.log('Load Complete:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
      
      paintData.forEach(paint => {
        console.log(`${paint.name}:`, Math.round(paint.startTime), 'ms');
      });
      console.groupEnd();
    }, 0);
  }
}

document.addEventListener('load', logPerformanceMetrics); // Uso 'load' per assicurare che sia l'ultimo

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
  'color: #6B7280; font-size: 10px; padding: 4px;');
