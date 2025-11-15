// ========================================
// FUNZIONI GENERALI
// ========================================

/**
 * Inizializza tutte le funzionalità del sito
 */
function init() {
    initMobileMenu();
    initFAQ();
    initContactForm();
    initCourses(); // ✅ Gestione corsi dinamici
    initFabHiding(); // ✅ Nasconde il FAB nelle sezioni contatto e footer
}
}

/**
 * Gestione menu mobile
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navOverlay = document.querySelector('.nav-overlay');
    const body = document.body;

    if (!menuToggle || !navOverlay) return;

    menuToggle.addEventListener('click', function() {
        const isOpen = navOverlay.classList.contains('active');
        
        if (isOpen) {
            navOverlay.classList.remove('active');
            menuToggle.classList.remove('open');
            body.style.overflow = '';
        } else {
            navOverlay.classList.add('active');
            menuToggle.classList.add('open');
            body.style.overflow = 'hidden';
        }
    });

    // Chiudi menu quando si clicca su un link
    const navLinks = navOverlay.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navOverlay.classList.remove('active');
            menuToggle.classList.remove('open');
            body.style.overflow = '';
        });
    });

    // Chiudi menu quando si preme ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navOverlay.classList.contains('active')) {
            navOverlay.classList.remove('active');
            menuToggle.classList.remove('open');
            body.style.overflow = '';
        }
    });
}

/**
 * Gestione FAQ (accordion)
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-list details');
    
    faqItems.forEach(item => {
        item.addEventListener('toggle', function() {
            if (this.open) {
                // Chiudi altri elementi aperti
                faqItems.forEach(otherItem => {
                    if (otherItem !== this && otherItem.open) {
                        otherItem.open = false;
                    }
                });
            }
        });
    });
}

/**
 * Gestione form iscrizione con conferma inline (FormSubmit)
 */
function initContactForm() {
    const contactForm = document.getElementById('iscrizione-form');
    const messageEl = document.getElementById('form-message');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = this.querySelector('.btn-submit');
        if (!submitBtn || submitBtn.disabled) return;

        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Invio…';

        // Reset messaggio precedente
        if (messageEl) {
            messageEl.className = 'form-message';
            messageEl.textContent = '';
        }

        try {
            const response = await fetch(this.action.trim(), {
                method: 'POST',
                body: new FormData(this)
            });

            let success = false;
            const contentType = response.headers.get('content-type') || '';

            if (response.ok) {
                if (contentType.includes('application/json')) {
                    const data = await response.json();
                    success = !!data.success;
                } else {
                    const text = await response.text();
                    success = text.includes('success') || text.includes('Thank you');
                }
            }

            if (success) {
                this.reset();
                if (messageEl) {
                    messageEl.textContent = '✅ Iscrizione inviata con successo!';
                    messageEl.className = 'form-message success';
                    setTimeout(() => {
                        messageEl.className = 'form-message';
                        setTimeout(() => messageEl.textContent = '', 300);
                    }, 5000);
                }
            } else {
                throw new Error('FormSubmit: risposta non valida');
            }

        } catch (error) {
            console.error('❌ Invio fallito:', error);
            if (messageEl) {
                messageEl.textContent = '❌ Errore: controlla i dati e riprova.';
                messageEl.className = 'form-message error';
            }
        } finally {
            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            }, 600);
        }
    });
}
/**
 * Gestione visibilità del Floating Action Button (FAB).
 * Nasconde il FAB quando l'utente entra nelle sezioni Contatti o nel Footer.
 */
function initFabHiding() {
    const fab = document.querySelector('.fab-container');
    // Le sezioni che faranno nascondere il FAB
    const targetSections = document.querySelectorAll('#contatti, #contatti-info, #footer'); 

    if (!fab || targetSections.length === 0) return;

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        // L'osservatore reagisce quando anche solo 1 pixel dell'elemento è visibile (threshold: 0)
        threshold: 0 
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Se una delle sezioni Contatti/Footer è visibile
                fab.classList.add('hidden');
            } else {
                // Se la sezione Contatti/Footer sta uscendo dalla viewport, 
                // e nessuna delle altre è nel viewport, il FAB deve riapparire.
                
                // Verifichiamo se *tutte* le sezioni target sono uscite
                const isAnyTargetVisible = Array.from(targetSections).some(section => {
                    const rect = section.getBoundingClientRect();
                    // Controlla se l'elemento è completamente fuori dalla viewport
                    return rect.top < window.innerHeight && rect.bottom > 0;
                });

                if (!isAnyTargetVisible) {
                    fab.classList.remove('hidden');
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Osserva tutte le sezioni target
    targetSections.forEach(section => observer.observe(section));
}
/**
 * Carica e mostra titolo, sottotitolo e corsi da corsi.json
 */
function initCourses() {
    const container = document.getElementById('courses-container');
    const sectionHeader = document.querySelector('#corsi .section-header');
    
    if (!container) return;

    fetch('corsi.json?' + Date.now())
        .then(response => {
            if (!response.ok) throw new Error('corsi.json non trovato');
            return response.json();
        })
        .then(data => {
            // ✅ Aggiorna titolo e sottotitolo
            if (sectionHeader && data.titoloCorsi) {
                sectionHeader.innerHTML = `
                    <h2>${data.titoloCorsi}</h2>
                    <p class="section-subtitle">${data.sottotitoloCorsi || ''}</p>
                `;
            }

            // ✅ Aggiorna corsi
            container.innerHTML = '';
            if (data.corsi && data.corsi.length > 0) {
                data.corsi.forEach(corso => {
                    const isActive = corso.stato === 'aperto';
                    const badgeClass = isActive ? 'badge-available' : 'badge-closed';
                    const btn = isActive 
                        ? `<a href="#contatti" class="btn-course">Iscriviti ora</a>`
                        : `<button class="btn-course btn-disabled" disabled>Iscrizioni chiuse</button>`;

                    const card = `
                        <div class="course-card">
                            <div class="course-badge ${badgeClass}">${corso.badge}</div>
                            <h3>${corso.nome}</h3>
                            <div class="course-meta">
                                <span class="meta-item">${corso.eta}</span>
                                <span class="meta-item">${corso.incontri}</span>
                                <span class="meta-item meta-price">${corso.prezzo}</span>
                            </div>
                            <div class="course-details">
                                <div class="detail-row">
                                    <span><strong>Quando:</strong> ${corso.quando}</span>
                                </div>
                            </div>
                            <p class="course-description">${corso.descrizione}</p>
                            ${btn}
                        </div>
                    `;
                    container.innerHTML += card;
                });
            } else {
                container.innerHTML = `<div class="alert-box" style="grid-column:1/-1;"><p>Nessun corso attivo al momento.</p></div>`;
            }
        })
        .catch(err => {
            console.error('❌ Errore caricamento corsi:', err);
            if (sectionHeader) {
                sectionHeader.innerHTML = `
                    <h2>Corsi e Laboratori</h2>
                    <p class="section-subtitle">Informazioni temporaneamente non disponibili</p>
                `;
            }
            container.innerHTML = `
                <div class="alert-box" style="grid-column:1/-1;">
                    <strong>⚠️ Impossibile caricare i corsi</strong>
                    <p>Contattaci per info aggiornate.</p>
                </div>
            `;
        });
}

// ========================================
// INIZIALIZZAZIONE
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    init();
});

// ========================================
// GESTIONE ERRORI
// ========================================
window.addEventListener('error', function(e) {
    console.error('Errore JavaScript:', e.error);
});
