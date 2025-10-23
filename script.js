// Ottimizzazioni per prestazioni e UX
document.addEventListener('DOMContentLoaded', function() {
  // Intersection Observer per animazioni lazy
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Animazione elementi al scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.tool-card, .course-card, .collaborazione-card');
    
    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  };

  // Gestione modali
  const initModals = () => {
    const modalTriggers = document.querySelectorAll('[data-popup]');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-btn');

    const openModal = (modalId) => {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        modal.setAttribute('aria-hidden', 'false');
        
        // Focus management per accessibilità
        const focusableElements = modal.querySelectorAll('button, a, input, textarea');
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    };

    const closeModal = (modal) => {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
      modal.setAttribute('aria-hidden', 'true');
    };

    // Apertura modali
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-popup');
        openModal(modalId);
      });

      // Supporto per tastiera
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const modalId = trigger.getAttribute('data-popup');
          openModal(modalId);
        }
      });
    });

    // Chiusura modali
    closeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeModal(modal);
      });
    });

    // Chiusura click outside
    modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    });

    // Chiusura con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        modals.forEach(modal => {
          if (modal.style.display === 'block') {
            closeModal(modal);
          }
        });
      }
    });
  };

  // Filtri corsi
  const initCourseFilters = () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');

    const filterCourses = (filter) => {
      courseCards.forEach(card => {
        const age = card.getAttribute('data-age');
        const tool = card.getAttribute('data-tool');
        
        if (filter === 'all' || 
            filter === age || 
            filter === tool ||
            (filter === '7-10' && age === '7-10') ||
            (filter === '11-16' && age === '11-16')) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    };

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Rimuovi classe active da tutti i bottoni
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Aggiungi classe active al bottone cliccato
        button.classList.add('active');
        // Filtra i corsi
        const filter = button.getAttribute('data-filter');
        filterCourses(filter);
      });
    });
  };

  // Smooth scroll per anchor links
  const initSmoothScroll = () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL senza refresh
          history.pushState(null, null, targetId);
        }
      });
    });
  };

  // Gestione FAQ
  const initFAQ = () => {
    const faqItems = document.querySelectorAll('.faq details');
    
    faqItems.forEach(item => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          // Chiudi altri items aperti (comportamento accordion)
          faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.open) {
              otherItem.open = false;
            }
          });
        }
      });
    });
  };

  // Preload immagini critiche
  const preloadCriticalImages = () => {
    const criticalImages = [
      'images/logo.png',
      'images/chi-siamo-hero.png'
    ];
    
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  };

  // Lazy loading per immagini non critiche
  const initLazyLoading = () => {
    if ('IntersectionObserver' in window) {
      const lazyImageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.remove('lazy');
            lazyImageObserver.unobserve(lazyImage);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        lazyImageObserver.observe(img);
      });
    }
  };

  // Gestione performance scroll
  let scrollTimeout;
  const handleScroll = () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(() => {
      // Eventuali animazioni durante lo scroll
    });
  };

  // Inizializzazione
  const init = () => {
    preloadCriticalImages();
    initModals();
    initCourseFilters();
    initSmoothScroll();
    initFAQ();
    initLazyLoading();
    animateOnScroll();
    
    // Aggiungi listener per scroll ottimizzato
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Gestione errori immagini
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', function() {
        this.style.display = 'none';
      });
    });

    // Performance metrics
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.timing;
          const loadTime = perfData.loadEventEnd - perfData.navigationStart;
          console.log(`Tempo di caricamento pagina: ${loadTime}ms`);
        }, 0);
      });
    }
  };

  // Avvia l'inizializzazione
  init();
});

// Service Worker per caching (opzionale)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Gestione viewport per dispositivi mobili
const setViewport = () => {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    // Previene zoom su focus per iOS
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
  }
};

// Inizializza viewport
setViewport();
