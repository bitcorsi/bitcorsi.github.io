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
    unifyWhatsAppFAB(); // ✅ Nuova: unione FAB ↔ icona fissa
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
 * Carica e mostra titolo, sottotitolo, promo natalizia (se attiva) e corsi da corsi.json
 */
function initCourses() {
    const container = document.getElementById('courses-container');
    const sectionHeader = document.querySelector('#corsi .section-header');
    const promoContainer = document.querySelector('#promo-natale-container'); // ← nuovo
    
    if (!container) return;

    fetch('corsi.json?' + Date.now())
        .then(response => {
            if (!response.ok) throw new Error('corsi.json non trovato');
            return response.json();
        })
        .then(data => {
            // ✅ Titolo/sottotitolo principali
            if (sectionHeader && data.titoloCorsi) {
                sectionHeader.innerHTML = `
                    <h2>${data.titoloCorsi}</h2>
                    <p class="section-subtitle">${data.sottotitoloCorsi || ''}</p>
                `;
            }

            // ✅ Promo Natale (se attiva)
            if (promoContainer && data.promoNatale && data.promoNatale.attiva) {
                const p = data.promoNatale;
                promoContainer.innerHTML = `
                    <div class="promo-natale-card">
                        <div class="promo-natale-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83M14 20a3 3 0 1 0-4 0M10 4a3 3 0 0 0 4 0"/>
                            </svg>
                        </div>
                        <div class="promo-natale-content">
                            <span class="promo-badge">CORSO SPECIALE</span>
                            <h3>${p.titolo}</h3>
                            <p class="promo-subtitle">${p.sottotitolo}</p>
                            <p>${p.descrizione}</p>
                            <div class="promo-meta">
                                <span><strong>Date:</strong> ${p.date}</span>
                                <span><strong>Età:</strong> ${p.eta}</span>
                                <span><strong>Prezzo:</strong> ${p.prezzo}</span>
                            </div>
                            <p class="promo-note">${p.posti}</p>
                            <a href="#contatti" class="btn-promo">${p.cta}</a>
                        </div>
                    </div>
                `;
                promoContainer.style.display = 'block';
            } else if (promoContainer) {
                promoContainer.style.display = 'none';
            }

            // ✅ Corsi (solo quelli normali)
            container.innerHTML = '';
            const corsiNormali = data.corsi?.filter(c => c.tipo !== 'promo') || [];
            if (corsiNormali.length > 0) {
                corsiNormali.forEach(corso => {
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
                                <div class="detail-row"><strong>Quando:</strong> ${corso.quando}</div>
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
            if (promoContainer) promoContainer.style.display = 'none';
            container.innerHTML = `
                <div class="alert-box" style="grid-column:1/-1;">
                    <strong>⚠️ Impossibile caricare i corsi</strong>
                    <p>Contattaci per info aggiornate.</p>
                </div>
            `;
        });
}

// ========================================
// NUOVA FUNZIONE: UNIFICAZIONE FAB WHATSAPP ↔ ICONA FISSIONE
// ========================================
function unifyWhatsAppFAB() {
    const fab = document.querySelector('.fab-whatsapp');
    const staticIcon = document.getElementById('whatsapp-static'); // ← deve avere id="whatsapp-static" in HTML
    
    if (!fab || !staticIcon) return;

    // Memorizza lo stile originale per il ripristino
    const originalStyle = {
        position: fab.style.position,
        left: fab.style.left,
        top: fab.style.top,
        transform: fab.style.transform,
        zIndex: fab.style.zIndex,
        pointerEvents: fab.style.pointerEvents
    };

    const updatePosition = () => {
        const rect = staticIcon.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            // Posiziona la FAB al centro dell'icona fissa
            const centerX = rect.left + window.scrollX + rect.width / 2;
            const centerY = rect.top + window.scrollY + rect.height / 2;
            
            fab.style.position = 'fixed';
            fab.style.left = (centerX - 28) + 'px'; // 28 = metà di 56px (larghezza FAB)
            fab.style.top = (centerY - 28) + 'px';
            fab.style.transform = 'scale(0.64)'; // 36/56 ≈ 0.64 → scala a 36px
            fab.style.zIndex = '10000';
            fab.style.pointerEvents = 'none'; // clic passa all'icona fissa
            fab.style.opacity = '1';
        } else {
            // Ripristina posizione originale (in basso a destra)
            Object.assign(fab.style, originalStyle);
            fab.style.opacity = '';
        }
    };

    // Avvia e aggiorna
    updatePosition();
    window.addEventListener('scroll', () => requestAnimationFrame(updatePosition));
    window.addEventListener('resize', updatePosition);
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
