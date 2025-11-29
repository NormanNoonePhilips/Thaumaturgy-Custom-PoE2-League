/* ===================================
   HORIZONTAL SCROLL EFFECT
   =================================== */

document.addEventListener('DOMContentLoaded', function () {
    // Wait for GSAP and plugins to load
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP or ScrollTrigger not loaded');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Get all major content sections
    const sections = [
        document.querySelector('.intro-section'),
        document.querySelector('.feature-showcase'),
        document.querySelector('.npc-showcase'),
        document.querySelectorAll('.nav-grid')[0]
    ].filter(Boolean);

    if (sections.length === 0) return;

    // Set initial position for all sections (off-screen to the right)
    sections.forEach((section, index) => {
        if (index > 0) {
            gsap.set(section, {
                x: '100vw',
                opacity: 0
            });
        }
    });

    // Create horizontal scroll animations for each section
    sections.forEach((section, index) => {
        if (index === 0) {
            // First section: slide out to the left
            gsap.to(section, {
                x: '-100vw',
                opacity: 0,
                ease: 'power2.inOut',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: '+=100%',
                    scrub: 1,
                    pin: false
                }
            });
        } else {
            // Other sections: slide in from right, then slide out to left
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                    pin: false
                }
            });

            // Slide in from right
            timeline.fromTo(section,
                {
                    x: '100vw',
                    opacity: 0
                },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                }
            );

            // Slide out to left
            timeline.to(section,
                {
                    x: '-100vw',
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.in'
                },
                '+=0.5'
            );
        }
    });

    // Animate individual cards within sections
    gsap.utils.toArray('.nav-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'top 20%',
                toggleActions: 'play none none reverse'
            },
            x: 100,
            opacity: 0,
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
            x: 50,
            opacity: 0,
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
            x: index % 2 === 0 ? -100 : 100,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    console.log('Horizontal scroll animations initialized');
});