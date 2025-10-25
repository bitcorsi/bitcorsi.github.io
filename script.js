// script.js - Codice ottimizzato per performance mobile

class BitCorsiApp {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 Bit Corsi - Robotica Educativa');
        
        // Gestione scroll header
        this.handleHeaderScroll();
        
        // Gestione FAQ
        this.handleFAQ();
        
        // Ottimizzazioni performance
        this.optimizePerformance();
        
        // Gestione contatti rapidi
        this.handleQuickContacts();
    }

    handleHeaderScroll() {
        let lastScrollY = window.scrollY;
        const header = document.querySelector('.header');
        
        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.backdropFilter = 'blur(12px)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.backdropFilter = 'blur(12px)';
            }
            
            lastScrollY = currentScrollY;
        };

        // Throttle per performance
        let ticking = false;
        const throttledUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateHeader();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledUpdate, { passive: true });
    }

    handleFAQ() {
        const faqItems = document.querySelectorAll('details');
        
        faqItems.forEach(item => {
            item.addEventListener('toggle', (e) => {
                if (item.open) {
                    // Chiudi altri elementi aperti (opzionale)
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.open) {
                            otherItem.open = false;
                        }
                    });
                }
            });
        });
    }

    optimizePerformance() {
        // Lazy loading per immagini non critiche
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }

        // Preload per font critici
        const preloadLinks = document.createElement('link');
        preloadLinks.rel = 'preload';
        preloadLinks.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap';
        preloadLinks.as = 'style';
        document.head.appendChild(preloadLinks);
    }

    handleQuickContacts() {
        // Tracking per contatti (opzionale, per analytics)
        const contactLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="tel:"], a[href*="mailto:"]');
        
        contactLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const type = link.href.includes('wa.me') ? 'whatsapp' : 
                            link.href.includes('tel:') ? 'phone' : 'email';
                
                console.log(`📞 Contatto via ${type}`);
                // Qui puoi aggiungere Google Analytics o altro tracking
            });
        });
    }
}

// Inizializzazione quando il DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new BitCorsiApp();
    });
} else {
    new BitCorsiApp();
}

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
