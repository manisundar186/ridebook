// script.js

/* ============================================
   HEADER SCROLL BEHAVIOR
   ============================================ */
(function initHeaderScroll() {
    const header = document.getElementById('mainHeader');
    const scrollThreshold = 100;
    
    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('header-scrolled');
            header.classList.remove('header-transparent');
        } else {
            header.classList.remove('header-scrolled');
            header.classList.add('header-transparent');
        }
    }
    
    // Initial check
    handleScroll();
    
    // Throttled scroll listener for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
})();

/* ============================================
   PROVIDER ICONS ANIMATION
   ============================================ */
(function initProviderAnimation() {
    const providerIcons = document.querySelectorAll('.provider-icon');
    let currentIndex = 0;
    
    function animateBestProvider() {
        // Remove active class from all
        providerIcons.forEach(icon => icon.classList.remove('active'));
        
        // Add to current
        if (providerIcons[currentIndex]) {
            providerIcons[currentIndex].classList.add('active');
        }
        
        // Move to next
        currentIndex = (currentIndex + 1) % providerIcons.length;
    }
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion && providerIcons.length > 0) {
        // Start animation
        animateBestProvider();
        setInterval(animateBestProvider, 2000);
    }
})();

/* ============================================
   INFINITE PARTNER SCROLL
   ============================================ */
(function initPartnerScroll() {
    const scrollTrack = document.getElementById('partnerScroll');
    
    if (!scrollTrack) return;
    
    // Pause animation on focus within for accessibility
    scrollTrack.addEventListener('focusin', function() {
        scrollTrack.style.animationPlayState = 'paused';
    });
    
    scrollTrack.addEventListener('focusout', function() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReducedMotion) {
            scrollTrack.style.animationPlayState = 'running';
        }
    });
    
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        scrollTrack.style.animation = 'none';
    }
})();

/* ============================================
   REVIEWS SCROLL BEHAVIOR
   ============================================ */
(function initReviewsScroll() {
    const reviewRows = document.querySelectorAll('.review-row');
    
    if (reviewRows.length === 0) return;
    
    // Duplicate review cards for seamless loop
    reviewRows.forEach(row => {
        const cards = Array.from(row.children);
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            row.appendChild(clone);
        });
    });
    
    // Pause on focus for accessibility
    reviewRows.forEach(row => {
        row.addEventListener('focusin', function() {
            row.style.animationPlayState = 'paused';
        });
        
        row.addEventListener('focusout', function() {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!prefersReducedMotion) {
                row.style.animationPlayState = 'running';
            }
        });
    });
    
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        reviewRows.forEach(row => {
            row.style.animation = 'none';
        });
    }
})();

/* ============================================
   REVIEW CARD FULL TEXT TOGGLE
   ============================================ */
(function initReviewCardInteraction() {
    const reviewCards = document.querySelectorAll('.review-card');
    
    reviewCards.forEach(card => {
        const fullText = card.querySelector('.review-full');
        
        if (!fullText) return;
        
        // Keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-expanded', 'false');
        
        function toggleReview() {
            const isExpanded = card.getAttribute('aria-expanded') === 'true';
            card.setAttribute('aria-expanded', !isExpanded);
            fullText.hidden = isExpanded;
        }
        
        card.addEventListener('click', toggleReview);
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleReview();
            }
        });
    });
})();

/* ============================================
   MOBILE MENU TOGGLE
   ============================================ */
(function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', function() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.style.display = isExpanded ? 'none' : 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.background = 'var(--color-primary)';
        navMenu.style.padding = '1rem';
        navMenu.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    });
})();

/* ============================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================ */
(function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.getElementById('mainHeader').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
})();

/* ============================================
   LAZY LOAD OPTIMIZATION (Optional Enhancement)
   ============================================ */
(function initLazyLoad() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => imageObserver.observe(img));
    }
})();

/* ============================================
   PERFORMANCE MONITORING
   ============================================ */
console.log('FareCompare website loaded successfully');
console.log('Accessibility features enabled: keyboard navigation, reduced motion support, ARIA labels');
