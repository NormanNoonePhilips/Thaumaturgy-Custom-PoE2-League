/* ===================================
   THAUMATURGY - MAIN JAVASCRIPT
   =================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Signal that JS is running; CSS uses `html.js` to apply initial hidden animation state
    document.documentElement.classList.add('js');
    console.log('Thaumaturgy - Initializing...');

    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2
    });

    // Use GSAP ticker to drive Lenis for consistent frame timing with GSAP/ScrollTrigger
    // Avoid double-calling lenis.raf by using the GSAP ticker only.
    if (typeof gsap !== 'undefined') {
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
    } else {
        // Fallback: if GSAP isn't loaded yet, call Lenis via requestAnimationFrame
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // Initialize GSAP ScrollTrigger (only if not disabled)
    if (!window.disableScrollAnimations && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Sync Lenis with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        // Integrate Lenis and ScrollTrigger via scrollerProxy so ScrollTrigger uses Lenis' scroll values
        const scrollerElement = document.scrollingElement || document.documentElement;
        ScrollTrigger.scrollerProxy(scrollerElement, {
            scrollTop(value) {
                if (arguments.length) {
                    // scrollTo accepts coordinates; using immediate flag if available prevents smooth animation
                    if (typeof lenis.scrollTo === 'function') {
                        // lenis.scrollTo(value, { immediate: true }); // some Lenis versions accept options
                        lenis.scrollTo(value);
                    } else {
                        window.scrollTo(0, value);
                    }
                }
                // Return the current position from Lenis if available; fall back to native scroll
                return typeof lenis.scroll === 'number' ? lenis.scroll : window.scrollY || document.documentElement.scrollTop;
            },
            getBoundingClientRect() {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            },
            // pinType should be 'transform' if the container uses transforms (Lenis uses transforms by default), otherwise 'fixed'
            pinType: scrollerElement.style.transform ? 'transform' : 'fixed'
        });

        // Ensure ScrollTrigger recalculates sizes and positions after the proxy has been set
        ScrollTrigger.addEventListener('refresh', () => lenis.update && lenis.update());
        ScrollTrigger.refresh();

        // (Lenis is already driven above via the GSAP ticker)

        gsap.ticker.lagSmoothing(0);

        // Animate elements on scroll
        const animatedCards = gsap.utils.toArray('.nav-card');
        animatedCards.forEach((card, index) => {
            // Make sure this element is part of our JS animation flow
            card.classList.add('animate-init');
            gsap.to(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    end: 'top 20%',
                    toggleActions: 'play none none reverse'
                    ,
                    invalidateOnRefresh: true
                },
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: index * 0.1,
                ease: 'power2.out'
                ,
                immediateRender: false,
                force3D: true
            });
        });

        // Failsafe: if some animated elements remain invisible due to trigger issues, reveal them after a short timeout
        setTimeout(() => {
            animatedCards.forEach(el => {
                if (window.getComputedStyle(el).opacity === '0') {
                    el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translate3d(0,0,0)';
                }
            });
        }, 450);

        // Animate feature items
        const animatedFeatures = gsap.utils.toArray('.feature-item');
        animatedFeatures.forEach((item, index) => {
            item.classList.add('animate-init');
            gsap.to(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                    ,
                    invalidateOnRefresh: true
                },
                opacity: 1,
                x: 0,
                duration: 0.6,
                delay: index * 0.05,
                ease: 'power2.out'
                ,
                immediateRender: false,
                force3D: true
            });
        });

        setTimeout(() => {
            animatedFeatures.forEach(el => {
                if (window.getComputedStyle(el).opacity === '0') {
                    el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translate3d(0,0,0)';
                }
            });
        }, 450);

        // Animate NPC cards
        const animatedNpcs = gsap.utils.toArray('.npc-card');
        animatedNpcs.forEach((card, index) => {
            card.classList.add('animate-init');
            gsap.to(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                    ,
                    invalidateOnRefresh: true
                },
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: index * 0.2,
                ease: 'power2.out'
                ,
                immediateRender: false,
                force3D: true
            });
        });

        setTimeout(() => {
            animatedNpcs.forEach(el => {
                if (window.getComputedStyle(el).opacity === '0') {
                    el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translate3d(0,0,0)';
                }
            });
        }, 450);

        // Parallax effect for header
        if (document.querySelector('header')) {
            gsap.to('header', {
                scrollTrigger: {
                    trigger: 'header',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                },
                opacity: 0.3,
                y: -100
            });
        }
    }

    // Initialize Tippy.js tooltips
    initializeTooltips();

    // Add active state to home button on current page
    const homeButton = document.querySelector('.home-button');
    if (homeButton && window.location.pathname.includes('index.html')) {
        homeButton.style.borderColor = '#d4af37';
        homeButton.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.5)';
    }

    console.log('Thaumaturgy - League Mechanic Initialized');
});

// Tooltip initialization function
function initializeTooltips() {
    if (typeof tippy === 'undefined') {
        console.warn('Tippy.js not loaded');
        return;
    }

    // Add custom theme style
    const style = document.createElement('style');
    style.textContent = `
        .tippy-box[data-theme~='thaumaturgy'] {
            background-color: rgba(40, 30, 20, 0.95);
            border: 1px solid rgba(212, 175, 55, 0.3);
            color: #d4c5a0;
            font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
            font-size: 14px;
            padding: 8px 12px;
        }
        .tippy-box[data-theme~='thaumaturgy'][data-placement^='top'] > .tippy-arrow::before {
            border-top-color: rgba(40, 30, 20, 0.95);
        }
        .tippy-box[data-theme~='thaumaturgy'][data-placement^='bottom'] > .tippy-arrow::before {
            border-bottom-color: rgba(40, 30, 20, 0.95);
        }
        .tippy-box[data-theme~='thaumaturgy'][data-placement^='left'] > .tippy-arrow::before {
            border-left-color: rgba(40, 30, 20, 0.95);
        }
        .tippy-box[data-theme~='thaumaturgy'][data-placement^='right'] > .tippy-arrow::before {
            border-right-color: rgba(40, 30, 20, 0.95);
        }
    `;
    document.head.appendChild(style);

    // Initialize tooltips for elements with data-tippy-content
    const elementsWithTooltips = document.querySelectorAll('[data-tippy-content]');
    if (elementsWithTooltips.length > 0) {
        tippy('[data-tippy-content]', {
            theme: 'thaumaturgy',
            animation: 'fade',
            duration: [300, 200],
            arrow: true,
            placement: 'top'
        });
        console.log(`Initialized ${elementsWithTooltips.length} tooltips`);
    }

    // Add tooltips to nav cards (title only); keep 'Coming Soon' tooltip for disabled nav-cards
    const navCards = document.querySelectorAll('.nav-card');
    navCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent;
        if (title && !card.classList.contains('disabled')) {
            tippy(card, {
                content: `<strong>${title}</strong>`,
                allowHTML: true,
                theme: 'thaumaturgy',
                animation: 'fade',
                duration: [300, 200],
                arrow: true,
                placement: 'top'
            });
        } else if (card.classList.contains('disabled')) {
            tippy(card, {
                content: 'Coming Soon',
                theme: 'thaumaturgy',
                animation: 'fade',
                duration: [300, 200],
                arrow: true,
                placement: 'top'
            });
        }
    });
    
    // Add tooltips to feature items on index page
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        const title = item.querySelector('h4')?.textContent;
        if (title) {
            tippy(item, {
                content: `<strong>${title}</strong><br><small>Hover for more details</small>`,
                allowHTML: true,
                theme: 'thaumaturgy',
                animation: 'fade',
                duration: [300, 200],
                arrow: true,
                placement: 'top',
                trigger: 'mouseenter focus'
            });
        }
    });

    // Add tooltips to NPC cards
    const npcCards = document.querySelectorAll('.npc-card');
    npcCards.forEach(card => {
        const name = card.querySelector('.npc-name')?.textContent;
        const title = card.querySelector('.npc-title')?.textContent;
        if (name) {
            tippy(card, {
                content: `<strong>${name}</strong><br><small>${title || 'Read more about this character'}</small>`,
                allowHTML: true,
                theme: 'thaumaturgy',
                animation: 'fade',
                duration: [300, 200],
                arrow: true,
                placement: 'top'
            });
        }
    });

    console.log('Tooltips initialized for all interactive elements');
}