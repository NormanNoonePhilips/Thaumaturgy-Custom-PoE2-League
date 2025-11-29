/* ===================================
   SCROLL ANIMATIONS
   =================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Check if scroll animations should be disabled (e.g., on index page with fade animations)
    if (window.disableScrollAnimations) {
        console.log('Scroll animations disabled on this page');
        return;
    }

    // Wait for GSAP and plugins to load
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP or ScrollTrigger not loaded');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Animate main sections only - children will follow
    gsap.utils.toArray('.intro-section, .feature-showcase, .npc-showcase').forEach((section) => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 30%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power2.out'
        });
    });

    // Animate nav-grid section and its cards together
    const navGrid = document.querySelector('.nav-grid');
    if (navGrid) {
        // First animate the entire grid container
        gsap.from(navGrid, {
            scrollTrigger: {
                trigger: navGrid,
                start: 'top 80%',
                end: 'top 30%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power2.out'
        });

        // Then stagger the cards within
        gsap.from('.nav-card', {
            scrollTrigger: {
                trigger: navGrid,
                start: 'top 70%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.3
        });
    }

    console.log('Scroll animations initialized');
});