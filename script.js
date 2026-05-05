// ========================================
// FUNZIONI GENERALI
// ========================================

function init() {
    initMobileMenu();
    initFAQ();
    initContactForm();
    initCourses();
    unifyWhatsAppFAB();
    initSummerCampPopup();
    initEnrollmentModal();  // ← AGGIUNTO
}

// ========================================
// MENU MOBILE
// ========================================
function initMobileMenu() {
    var menuToggle = document.querySelector('.menu-toggle');
    var navOverlay = document.querySelector('.nav-overlay');
    var body = document.body;

    if (!menuToggle || !navOverlay) return;

    function closeMenu() {
        navOverlay.classList.remove('active');
        menuToggle.classList.remove('open');
        body.style.overflow = '';
    }

    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (navOverlay.classList.contains('active')) {
            closeMenu();
        } else {
            navOverlay.classList.add('active');
            menuToggle.classList.add('open');
            body.style.overflow = 'hidden';
        }
    });

    navOverlay.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeMenu();
    });

    navOverlay.addEventListener('click', function(e) {
        if (e.target === navOverlay) closeMenu();
    });
}

// ========================================
// FAQ ACCORDION
// ========================================
function initFAQ() {
    var faqItems = document.querySelectorAll('.faq-list details');

    faqItems.forEach(function(item) {
        item.addEventListener('toggle', function() {
            if (this.open) {
                faqItems.forEach(function(otherItem) {
                    if (otherItem !== item && otherItem.open) {
                        otherItem.open = false;
                    }
                });
            }
        });
    });
}

// ========================================
// FORM ISCRIZIONE
// ========================================
function initContactForm() {
    var contactForm = document.getElementById('iscrizione-form');
    var messageEl = document.getElementById('form-message');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        var submitBtn = this.querySelector('.btn-submit');
        if (!submitBtn || submitBtn.disabled) return;

        var originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Invio…';

        if (messageEl) {
            messageEl.className = 'form-message';
            messageEl.textContent = '';
        }

        try {
            var response = await fetch(this.action.trim(), {
                method: 'POST',
                body: new FormData(this)
            });

            var success = false;
            var contentType = response.headers.get('content-type') || '';

            if (response.ok) {
                if (contentType.includes('application/json')) {
                    var data = await response.json();
                    success = !!data.success;
                } else {
                    var text = await response.text();
                    success = text.includes('success') || text.includes('Thank you');
                }
            }

            if (success) {
                this.reset();
                if (messageEl) {
                    messageEl.textContent = 'Iscrizione inviata con successo!';
                    messageEl.className = 'form-message success';
                    setTimeout(function() {
                        messageEl.className = 'form-message';
                        setTimeout(function() { messageEl.textContent = ''; }, 300);
                    }, 5000);
                }
            } else {
                throw new Error('FormSubmit: risposta non valida');
            }

        } catch (error) {
            console.error('Invio fallito:', error);
            if (messageEl) {
                messageEl.textContent = 'Errore: controlla i dati e riprova.';
                messageEl.className = 'form-message error';
            }
        } finally {
            setTimeout(function() {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            }, 600);
        }
    });
}

// ========================================
// CORSI DINAMICI DA corsi.json
// ========================================
function initCourses() {
    var container = document.getElementById('courses-container');
    var sectionHeader = document.querySelector('#corsi .section-header');
    var promoContainer = document.querySelector('#promo-natale-container');

    if (!container) return;

    fetch('corsi.json?' + Date.now())
        .then(function(response) {
            if (!response.ok) throw new Error('corsi.json non trovato');
            return response.json();
        })
        .then(function(data) {

            if (sectionHeader && data.titoloCorsi) {
                sectionHeader.innerHTML =
                    '<h2>' + data.titoloCorsi + '</h2>' +
                    '<p class="section-subtitle">' + (data.sottotitoloCorsi || '') + '</p>';
            }

            if (promoContainer && data.promoNatale && data.promoNatale.attiva) {
                var p = data.promoNatale;
                promoContainer.innerHTML =
                    '<div class="promo-natale-card">' +
                        '<div class="promo-natale-icon">' +
                            '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor">' +
                                '<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83M14 20a3 3 0 1 0-4 0M10 4a3 3 0 0 0 4 0"/>' +
                            '</svg>' +
                        '</div>' +
                        '<div class="promo-natale-content">' +
                            '<span class="promo-badge">EDIZIONE SPECIALE</span>' +
                            '<h3>' + p.titolo + '</h3>' +
                            '<p class="promo-subtitle">' + p.sottotitolo + '</p>' +
                            '<p>' + p.descrizione + '</p>' +
                            '<div class="promo-meta">' +
                                '<span><strong>Date:</strong> ' + p.date + '</span>' +
                                '<span><strong>Eta:</strong> ' + p.eta + '</span>' +
                                '<span><strong>Prezzo:</strong> ' + p.prezzo + '</span>' +
                            '</div>' +
                            '<p class="promo-note">' + p.posti + '</p>' +
                            '<a href="#contatti" class="btn-promo">' + p.cta + '</a>' +
                        '</div>' +
                    '</div>';
                promoContainer.style.display = 'block';
            } else if (promoContainer) {
                promoContainer.style.display = 'none';
            }

            container.innerHTML = '';
            var corsiNormali = (data.corsi || []).filter(function(c) {
                return c.tipo !== 'promo';
            });

            if (corsiNormali.length > 0) {
                corsiNormali.forEach(function(corso) {
                    var isActive = corso.stato === 'aperto';
                    var badgeClass = isActive ? 'badge-available' : 'badge-closed';
                    var btn;

                    if (!isActive) {
                        btn = '<button class="btn-course btn-disabled" disabled>Corso in svolgimento</button>';
                    } else if (corso.link) {
                        btn = '<a href="' + corso.link + '" class="btn-course" target="_blank" rel="noopener">' +
                                (corso.linkTesto || 'Scopri di piu') +
                              '</a>';
                    } else {
                        btn = '<a href="#contatti" class="btn-course">Iscriviti ora</a>';
                    }

                    var extraClass = corso.id === 'summercamp' ? ' course-card-summer' : '';
                    var card =
                        '<div class="course-card' + extraClass + '">' +
                            '<div class="course-badge ' + badgeClass + '">' + corso.badge + '</div>' +
                            '<h3>' + corso.nome + '</h3>' +
                            '<div class="course-meta">' +
                                '<span class="meta-item">' + corso.eta + '</span>' +
                                '<span class="meta-item">' + corso.incontri + '</span>' +
                                '<span class="meta-item meta-price">' + corso.prezzo + '</span>' +
                            '</div>' +
                            '<div class="course-details">' +
                                '<div class="detail-row"><strong>Quando:</strong> ' + corso.quando + '</div>' +
                            '</div>' +
                            '<p class="course-description">' + corso.descrizione + '</p>' +
                            btn +
                        '</div>';

                    container.innerHTML += card;
                });
            } else {
                container.innerHTML = '<div class="alert-box" style="grid-column:1/-1;"><p>Nessun corso attivo al momento.</p></div>';
            }
        })
        .catch(function(err) {
            console.error('Errore caricamento corsi:', err);
            if (sectionHeader) {
                sectionHeader.innerHTML =
                    '<h2>Corsi e Laboratori</h2>' +
                    '<p class="section-subtitle">Informazioni temporaneamente non disponibili</p>';
            }
            if (promoContainer) promoContainer.style.display = 'none';
            container.innerHTML =
                '<div class="alert-box" style="grid-column:1/-1;">' +
                    '<strong>Impossibile caricare i corsi</strong>' +
                    '<p>Contattaci per info aggiornate.</p>' +
                '</div>';
        });
}

// ========================================
// POPUP SUMMER CAMP
// ========================================
function initSummerCampPopup() {
    var SESSION_KEY = 'sc_popup_shown';

    if (sessionStorage.getItem(SESSION_KEY)) return;

    var overlay = document.getElementById('sc-popup-overlay');
    if (!overlay) return;

    function closePopup() {
        overlay.classList.remove('sc-open');
        setTimeout(function() {
            overlay.style.display = 'none';
        }, 280);
    }

    var closeBtn = document.getElementById('sc-popup-close');
    var skipBtn = document.getElementById('sc-popup-skip');

    if (closeBtn) closeBtn.addEventListener('click', closePopup);
    if (skipBtn) skipBtn.addEventListener('click', closePopup);

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closePopup();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closePopup();
    });

    setTimeout(function() {
        sessionStorage.setItem(SESSION_KEY, '1');
        overlay.style.display = 'flex';
        requestAnimationFrame(function() {
            overlay.classList.add('sc-open');
        });
    }, 3000);
}

// ========================================
// FAB WHATSAPP — unificazione con icona fissa
// ========================================
function unifyWhatsAppFAB() {
    var fab = document.querySelector('.fab-whatsapp');
    var staticIcon = document.getElementById('whatsapp-static');

    if (!fab || !staticIcon) return;

    var originalStyle = {
        position: fab.style.position,
        left: fab.style.left,
        top: fab.style.top,
        transform: fab.style.transform,
        zIndex: fab.style.zIndex,
        pointerEvents: fab.style.pointerEvents
    };

    function updatePosition() {
        var rect = staticIcon.getBoundingClientRect();
        var isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            var centerX = rect.left + window.scrollX + rect.width / 2;
            var centerY = rect.top + window.scrollY + rect.height / 2;
            fab.style.position = 'fixed';
            fab.style.left = (centerX - 28) + 'px';
            fab.style.top = (centerY - 28) + 'px';
            fab.style.transform = 'scale(0.64)';
            fab.style.zIndex = '10000';
            fab.style.pointerEvents = 'none';
            fab.style.opacity = '1';
        } else {
            Object.assign(fab.style, originalStyle);
            fab.style.opacity = '';
        }
    }

    updatePosition();
    window.addEventListener('scroll', function() { requestAnimationFrame(updatePosition); });
    window.addEventListener('resize', updatePosition);
}

// ========================================
// CORSI DISPONIBILI (USATI NEL MODAL)
// ========================================
var ENROLLMENT_COURSES = {
    'lego-spike': { name: 'Lego Spike Prime', age: '8–13 anni', max: 10 },
    'arduino': { name: 'Arduino', age: '12–16 anni', max: 10 },
    'open-roberta': { name: 'Open Roberta', age: '8–13 anni', max: 10 },
    'microbit': { name: 'micro:bit BBC', age: '8–13 anni', max: 10 },
    'mattine-coding': { name: 'Mattine di coding', age: '8–13 anni', max: 12 },
};

// ========================================
// MODAL ISCRIZIONI
// ========================================
function initEnrollmentModal() {
    var enrollmentModal = document.getElementById('enrollmentModal');
    var closeEnrollmentModalBtn = document.getElementById('closeEnrollmentModal');
    
    if (!enrollmentModal) {
        console.log('⚠️ Modal iscrizioni non trovato nel DOM');
        return;
    }

    // Apri modal quando clicchi su "Contattaci subito"
    document.querySelectorAll('[href="#contatti-info"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            enrollmentModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Popola i corsi la prima volta
            var coursesGrid = document.getElementById('enrollmentCoursesGrid');
            if (coursesGrid && coursesGrid.children.length === 0) {
                populateEnrollmentCourses();
            }
        });
    });

    // Chiudi modal
    function closeEnrollmentModal() {
        enrollmentModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (closeEnrollmentModalBtn) {
        closeEnrollmentModalBtn.addEventListener('click', closeEnrollmentModal);
    }

    // Chiudi cliccando fuori (su overlay)
    var overlay = document.querySelector('.enrollment-modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeEnrollmentModal);
    }

    // Chiudi con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && enrollmentModal.classList.contains('active')) {
            closeEnrollmentModal();
        }
    });

    // Submit form
    var enrollmentForm = document.getElementById('enrollmentForm');
    if (enrollmentForm) {
        enrollmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleEnrollmentSubmit();
        });
    }
}

// ============================================
// POPOLA CORSI NEL MODAL (CON FIREBASE)
// ============================================
function populateEnrollmentCourses() {
    var coursesGrid = document.getElementById('enrollmentCoursesGrid');
    if (!coursesGrid) return;
    
    coursesGrid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#999;">Caricamento corsi...</p>';
    
    var coursePromises = [];
    
    for (var courseId in ENROLLMENT_COURSES) {
        coursePromises.push(
            getCourseAvailability(courseId)
                .then(function(data) {
                    return {
                        courseId: data.courseId,
                        confirmed: data.confirmed,
                        available: data.available,
                        isFull: data.isFull
                    };
                })
                .catch(function(err) {
                    console.warn('Errore corso ' + courseId + ':', err);
                    // Se Firebase non è configurato, mostra tutti i posti disponibili
                    var info = ENROLLMENT_COURSES[courseId];
                    return {
                        courseId: courseId,
                        confirmed: 0,
                        available: info.max,
                        isFull: false
                    };
                })
        );
    }
    
    Promise.all(coursePromises).then(function(results) {
        coursesGrid.innerHTML = ''; // Pulisci il "caricamento..."
        
        results.forEach(function(data) {
            var courseInfo = ENROLLMENT_COURSES[data.courseId];
            var courseId = data.courseId;
            var available = data.available;
            var isFull = data.isFull;
            
            var courseHTML = 
                '<div class="enrollment-course-option">' +
                    '<input type="radio" id="enrollment-course-' + courseId + '" name="courseId" value="' + courseId + '" ' + (isFull ? 'disabled' : '') + '>' +
                    '<label for="enrollment-course-' + courseId + '" class="enrollment-course-label">' +
                        '<strong>' + courseInfo.name + '</strong>' +
                        '<small>' + courseInfo.age + '</small>' +
                        '<div class="enrollment-course-availability ' + (isFull ? 'full' : available <= 2 ? 'limited' : 'available') + '">' +
                            (isFull ? '❌ Corso Pieno' : '✓ ' + available + ' posti liberi') +
                        '</div>' +
                    '</label>' +
                '</div>';
            
            coursesGrid.innerHTML += courseHTML;
        });
    });
}

// ============================================
// CONTA POSTI DISPONIBILI (FIREBASE)
// ============================================
function getCourseAvailability(courseId) {
    return new Promise(function(resolve, reject) {
        // Controlla se Firebase è configurato
        if (typeof firebase === 'undefined' || !firebase.firestore) {
            console.warn('Firebase non configurato, usi valori di default');
            var info = ENROLLMENT_COURSES[courseId];
            resolve({
                courseId: courseId,
                confirmed: 0,
                available: info.max,
                isFull: false
            });
            return;
        }

        var db = firebase.firestore();
        var courseInfo = ENROLLMENT_COURSES[courseId];

        db.collection('enrollments')
            .where('courseId', '==', courseId)
            .where('status', '==', 'confermato')
            .get()
            .then(function(snapshot) {
                var confirmed = snapshot.size;
                var available = Math.max(0, courseInfo.max - confirmed);
                var isFull = available === 0;

                resolve({
                    courseId: courseId,
                    confirmed: confirmed,
                    available: available,
                    isFull: isFull
                });
            })
            .catch(function(error) {
                console.error('Errore Firebase per ' + courseId + ':', error);
                reject(error);
            });
    });
}

// ============================================
// SUBMIT FORM ISCRIZIONI (CON FIREBASE)
// ============================================
function handleEnrollmentSubmit() {
    var enrollmentForm = document.getElementById('enrollmentForm');
    var successMessage = document.getElementById('enrollmentSuccessMessage');
    var errorMessage = document.getElementById('enrollmentErrorMessage');
    var waitlistMessage = document.getElementById('enrollmentWaitlistMessage');
    var submitBtn = document.querySelector('.enrollment-submit-btn');
    
    if (!enrollmentForm || !submitBtn) return;

    // Nascondi messaggi precedenti
    if (successMessage) successMessage.classList.remove('show');
    if (errorMessage) errorMessage.classList.remove('show');
    if (waitlistMessage) waitlistMessage.classList.remove('show');

    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Elaborazione...';

    try {
        var courseId = document.querySelector('input[name="courseId"]:checked');
        if (!courseId) {
            throw new Error('Seleziona un corso');
        }

        var formData = {
            studentName: document.getElementById('studentName').value,
            studentAge: document.getElementById('studentAge').value,
            parentName: document.getElementById('parentName').value,
            parentEmail: document.getElementById('parentEmail').value,
            parentPhone: document.getElementById('parentPhone').value,
            schoolName: document.getElementById('schoolName').value,
            courseId: courseId.value,
            referral: document.getElementById('referral').value,
            notes: document.getElementById('notes').value,
        };
        
        if (!formData.studentName || !formData.studentAge || !formData.parentEmail || !formData.courseId) {
            throw new Error('Completa tutti i campi obbligatori');
        }

        // Se Firebase è configurato, salva i dati
        if (typeof firebase !== 'undefined' && firebase.firestore) {
            saveEnrollmentToFirebase(formData, successMessage, waitlistMessage, enrollmentForm, submitBtn);
        } else {
            // Altrimenti mostra il messaggio di successo senza Firebase
            console.log('✅ Dati form (Firebase non configurato):', formData);
            
            if (successMessage) {
                document.getElementById('enrollmentSuccessText').innerText = 
                    'Iscrizione ricevuta! Ti contatteremo presto a ' + formData.parentEmail;
                successMessage.classList.add('show');
            }
            
            setTimeout(function() {
                enrollmentForm.reset();
                var coursesGrid = document.getElementById('enrollmentCoursesGrid');
                if (coursesGrid) coursesGrid.innerHTML = '';
                
                setTimeout(function() {
                    var enrollmentModal = document.getElementById('enrollmentModal');
                    if (enrollmentModal) {
                        enrollmentModal.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                }, 1000);
            }, 2000);

            submitBtn.disabled = false;
            submitBtn.innerHTML = '✨ Iscriviti Subito!';
        }

    } catch (error) {
        console.error('❌ Errore:', error);
        if (errorMessage) {
            document.getElementById('enrollmentErrorText').innerText = error.message || 'Errore durante l\'iscrizione. Riprova.';
            errorMessage.classList.add('show');
        }
        submitBtn.disabled = false;
        submitBtn.innerHTML = '✨ Iscriviti Subito!';
    }
}

// ============================================
// SALVA SU FIREBASE
// ============================================
function saveEnrollmentToFirebase(formData, successMessage, waitlistMessage, enrollmentForm, submitBtn) {
    var db = firebase.firestore();
    var courseInfo = ENROLLMENT_COURSES[formData.courseId];

    // Conta iscritti confermati per questo corso
    db.collection('enrollments')
        .where('courseId', '==', formData.courseId)
        .where('status', '==', 'confermato')
        .get()
        .then(function(snapshot) {
            var confirmed = snapshot.size;
            var status = 'confermato';
            var waitlistPosition = null;

            // Se corso pieno, metti in lista d'attesa
            if (confirmed >= courseInfo.max) {
                status = 'in_attesa';
                waitlistPosition = confirmed - courseInfo.max + 1;
            }

            // Salva l'iscrizione
            return db.collection('enrollments').add({
                studentName: formData.studentName,
                studentAge: parseInt(formData.studentAge),
                parentName: formData.parentName,
                parentEmail: formData.parentEmail,
                parentPhone: formData.parentPhone,
                schoolName: formData.schoolName,
                courseId: formData.courseId,
                courseName: courseInfo.name,
                status: status,
                waitlistPosition: waitlistPosition,
                paid: false,
                referral: formData.referral,
                notes: formData.notes,
                enrollmentDate: new Date(),
            }).then(function() {
                console.log('✅ Iscrizione salvata su Firebase');

                // Mostra messaggio appropriato
                if (status === 'in_attesa') {
                    if (waitlistMessage) {
                        document.getElementById('enrollmentWaitlistText').innerText = 
                            'Sei in lista d\'attesa (posizione ' + waitlistPosition + '). Ti contatteremo se si libera un posto!';
                        waitlistMessage.classList.add('show');
                    }
                } else {
                    if (successMessage) {
                        document.getElementById('enrollmentSuccessText').innerText = 
                            'Iscrizione confermata! Riceverai email di conferma a ' + formData.parentEmail;
                        successMessage.classList.add('show');
                    }
                }

                // Resetta il form dopo 2 secondi
                setTimeout(function() {
                    enrollmentForm.reset();
                    var coursesGrid = document.getElementById('enrollmentCoursesGrid');
                    if (coursesGrid) coursesGrid.innerHTML = '';
                    
                    // Chiudi il modal dopo 3 secondi
                    setTimeout(function() {
                        var enrollmentModal = document.getElementById('enrollmentModal');
                        if (enrollmentModal) {
                            enrollmentModal.classList.remove('active');
                            document.body.style.overflow = 'auto';
                        }
                    }, 1000);
                }, 2000);

                submitBtn.disabled = false;
                submitBtn.innerHTML = '✨ Iscriviti Subito!';
            });
        })
        .catch(function(error) {
            console.error('❌ Errore Firebase:', error);
            var errorMessage = document.getElementById('enrollmentErrorMessage');
            if (errorMessage) {
                document.getElementById('enrollmentErrorText').innerText = 'Errore di connessione. Riprova.';
                errorMessage.classList.add('show');
            }
            submitBtn.disabled = false;
            submitBtn.innerHTML = '✨ Iscriviti Subito!';
        });
}

// ========================================
// INIZIALIZZAZIONE
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    init();
});

window.addEventListener('error', function(e) {
    console.error('Errore JavaScript:', e.error);
});
