/* ===================================
   THAUMATURGY - MAIN JAVASCRIPT
   =================================== */

// Wait for DOM to be fully loaded

document.addEventListener('DOMContentLoaded', function () {

    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Animate elements on scroll
    gsap.utils.toArray('.nav-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'top 20%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power2.out'
        });
    });

    // Animate feature items
    gsap.utils.toArray('.feature-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            x: -30,
            duration: 0.6,
            delay: index * 0.05,
            ease: 'power2.out'
        });
    });

    // Animate NPC cards
    gsap.utils.toArray('.npc-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: index * 0.2,
            ease: 'power2.out'
        });
    });

    // Initialize Tippy.js tooltips
    tippy('[data-tippy-content]', {
        theme: 'thaumaturgy',
        animation: 'fade',
        duration: [300, 200],
        arrow: true,
        placement: 'top'
    });

    // Add custom theme for Tippy
    const style = document.createElement('style');
    style.textContent = `
        .tippy-box[data-theme~='thaumaturgy'] {
            background-color: rgba(40, 30, 20, 0.95);
            border: 1px solid rgba(212, 175, 55, 0.3);
            color: #d4c5a0;
            font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
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

    // Add active state to home button on current page
    const homeButton = document.querySelector('.home-button');
    if (homeButton && window.location.pathname.includes('index.html')) {
        homeButton.style.borderColor = '#d4af37';
        homeButton.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.5)';
    }

    console.log('Thaumaturgy - League Mechanic Initialized');
});