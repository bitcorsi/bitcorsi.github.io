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
        
        // Ottimizzazioni performance (principalmente lazy loading)
        this.optimizePerformance();
        
        // Gestione contatti rapidi
        this.handleQuickContacts();
    }

    handleHeaderScroll() {
        // Il CSS gestisce lo sticky header. Manteniamo il codice solo per abitudine, ma 
        // nel CSS il background è fisso, quindi questa funzione non è strettamente necessaria.
        let lastScrollY = window.scrollY;
        const header = document.querySelector('.header');
        
        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            
            // Logica semplificata, dato che il CSS stabilisce sfondo e blur.
            // Lasciato in caso di futuri cambiamenti dinamici dello stile.
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(12px)';
            
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
                        // Nota: il lazy loading fa il suo lavoro nativamente, qui viene solo
                        // rimosso il codice per la transizione di opacità che non è più necessario
                        // per le nuove immagini hero (che sono 'eager').
                        // Il 'loading="lazy"' nel markup HTML assicura il lazy loading.
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => {
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
