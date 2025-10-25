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
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.style.opacity = '1';
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                imageObserver.observe(img);
            });
        }
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
