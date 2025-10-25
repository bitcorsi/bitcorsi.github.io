// script.js - Miglioramenti UX Mobile per Bit Corsi

document.addEventListener('DOMContentLoaded', function() {
  
  // ===== MENU MOBILE TOGGLE =====
  const menuToggle = document.createElement('button');
  menuToggle.className = 'menu-toggle';
  menuToggle.setAttribute('aria-label', 'Apri/chiudi menu');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.innerHTML = '<span></span><span></span><span></span>';
  
  const nav = document.querySelector('.nav');
  const headerRight = document.querySelector('.header-right');
  
  // Inserisce il button menu prima della navigazione
  if (headerRight && nav) {
    headerRight.insertBefore(menuToggle, nav);
    
    menuToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.classList.toggle('active');
      nav.classList.toggle('active');
      this.setAttribute('aria-expanded', !isExpanded);
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
    
    // Chiudi menu quando si clicca su un link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
    
    // Chiudi menu quando si clicca fuori
    document.addEventListener('click', function(e) {
      if (nav.classList.contains('active') && 
          !nav.contains(e.target) && 
          !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ===== HEADER SCROLL EFFECT =====
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
    
    // Applica stato iniziale
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    }
  }

  // ===== ANIMAZIONE CARDS AL TAP =====
  document.querySelectorAll('.tool-card, .course-card, .contact-card').forEach(card => {
    card.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.98)';
      this.style.transition = 'transform 0.1s ease';
    });
    
    card.addEventListener('touchend', function() {
      this.style.transform = '';
      this.style.transition = 'transform 0.3s ease';
    });
    
    // Per mouse (desktop)
    card.addEventListener('mousedown', function() {
      this.style.transform = 'scale(0.98)';
      this.style.transition = 'transform 0.1s ease';
    });
    
    card.addEventListener('mouseup', function() {
      this.style.transform = '';
      this.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.transition = 'transform 0.3s ease';
    });
  });

  // ===== SMOOTH SCROLL PER ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      
      // Ignora link vuoti
      if (targetId === '#' || !targetId) return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== GESTIONE TELEFONO E WHATSAPP =====
  document.querySelectorAll('a[href^="tel:"], a[href^="https://wa.me/"]').forEach(link => {
    link.addEventListener('click', function(e) {
      // Logica di tracciamento (puoi aggiungere Google Analytics qui)
      console.log('Click su:', this.href);
      
      // Per WhatsApp, apri in nuova finestra
      if (this.href.includes('wa.me')) {
        e.preventDefault();
        window.open(this.href, '_blank', 'noopener,noreferrer');
      }
    });
  });

  // ===== PREVENZIONE ZOOM SU INPUT (iOS) =====
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function(e) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });

  // ===== OTTIMIZZAZIONE PERFORMANCE SCROLL =====
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        // Eventuali animazioni durante lo scroll
        ticking = false;
      });
      ticking = true;
    }
  });

  // ===== LAZY LOADING MIGLIORATO =====
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ===== GESTIONE FAB (FLOATING ACTION BUTTON) =====
  const fabContainer = document.querySelector('.fab-container');
  if (fabContainer) {
    let fabTimeout;
    
    fabContainer.addEventListener('touchstart', function() {
      clearTimeout(fabTimeout);
      this.style.transform = 'scale(0.95)';
    });
    
    fabContainer.addEventListener('touchend', function() {
      this.style.transform = '';
      fabTimeout = setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  }

  // ===== GESTIONE STATO CORSI =====
  const courseCards = document.querySelectorAll('.course-card');
  courseCards.forEach(card => {
    const badge = card.querySelector('.course-badge');
    const button = card.querySelector('.btn-course');
    
    if (badage && badge.classList.contains('badge-closed')) {
      // Aggiungi attributi ARIA per accessibilità
      card.setAttribute('aria-disabled', 'true');
      if (button) {
        button.setAttribute('aria-disabled', 'true');
      }
    }
  });

  // ===== ANIMAZIONE HERO AL CARICAMENTO =====
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    // Aggiungi classe di animazione dopo il caricamento
    setTimeout(() => {
      heroSection.classList.add('loaded');
    }, 300);
  }

  // ===== GESTIONE FAQ INTERATTIVE =====
  const faqDetails = document.querySelectorAll('.faq details');
  faqDetails.forEach(detail => {
    detail.addEventListener('toggle', function() {
      if (this.open) {
        // Chiudi altri details aperti
        faqDetails.forEach(otherDetail => {
          if (otherDetail !== this && otherDetail.open) {
            otherDetail.open = false;
          }
        });
      }
    });
  });

  // ===== RILEVAMENTO DISPOSITIVO MOBILE =====
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768);
  }

  // ===== OTTIMIZZAZIONI SPECIFICHE PER MOBILE =====
  if (isMobileDevice()) {
    // Aggiungi classe mobile al body
    document.body.classList.add('mobile-device');
    
    // Ottimizza le immagini per mobile
    const heroImage = document.querySelector('.chi-siamo-hero-image img');
    if (heroImage && window.innerWidth < 768) {
      // Potresti caricare una versione più leggera per mobile
      heroImage.loading = 'eager'; // Priorità al caricamento
    }
  }

  // ===== GESTIONE OFFLINE =====
  window.addEventListener('online', function() {
    // Mostra notifica di connessione ripristinata
    console.log('Connessione ripristinata');
  });

  window.addEventListener('offline', function() {
    // Mostra notifica di assenza di connessione
    console.log('Connessione persa');
  });

  // ===== PULIZIA EVENT LISTENER =====
  window.addEventListener('beforeunload', function() {
    // Pulizia degli event listener se necessario
    menuToggle.removeEventListener('click', arguments.callee);
  });

  console.log('Bit Corsi - UX Mobile ottimizzata ✅');
});

// ===== SERVICE WORKER PER PWA (OPZIONALE) =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registrato con successo: ', registration.scope);
      })
      .catch(function(error) {
        console.log('Registrazione ServiceWorker fallita: ', error);
      });
  });
}

// ===== GESTIONE ECCEZIONI =====
window.addEventListener('error', function(e) {
  console.error('Errore JavaScript:', e.error);
});

// ===== OTTIMIZZAZIONI PERFORMANCE =====
// Riduci il consumo di memoria durante lo scroll
let scrollTimeout;
window.addEventListener('scroll', function() {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(function() {
    // Pulizia temporanea durante pause dello scroll
    if (typeof gc === 'function') {
      gc();
    }
  }, 1000);
});
