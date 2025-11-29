/* ===================================
   BOOKMARK NAVIGATION FUNCTIONALITY
   =================================== */

document.addEventListener('DOMContentLoaded', function () {
    const bookmarkNav = document.getElementById('bookmark-nav');
    const bookmarkToggle = document.getElementById('bookmark-toggle');
    const bookmarkLinks = document.querySelectorAll('.bookmark-list a');

    if (!bookmarkNav || !bookmarkToggle) {
        console.log('Bookmark navigation not found on this page');
        return;
    }

    // Toggle bookmark panel and update aria-expanded
    bookmarkToggle.addEventListener('click', function () {
        bookmarkNav.classList.toggle('active');
        const expanded = bookmarkNav.classList.contains('active');
        bookmarkToggle.setAttribute('aria-expanded', expanded);
    });

    // Close bookmarks when clicking outside
    document.addEventListener('click', function (event) {
        if (!bookmarkNav.contains(event.target)) {
            bookmarkNav.classList.remove('active');
            bookmarkToggle.setAttribute('aria-expanded', false);
        }
    });

    // Smooth scroll to sections
    bookmarkLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Close bookmark panel
                bookmarkNav.classList.remove('active');
                bookmarkToggle.setAttribute('aria-expanded', false);

                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update active link
                updateActiveLink(this);
            }
        });
    });

    // Update active link based on scroll position
    function updateActiveLink(activeLink) {
        bookmarkLinks.forEach(link => {
            link.classList.remove('active');
        });
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Detect which section is in view
    let observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const correspondingLink = document.querySelector(`.bookmark-list a[href="#${id}"]`);
                if (correspondingLink) {
                    updateActiveLink(correspondingLink);
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-20% 0px -20% 0px'
    });

    // Observe all sections with IDs
    bookmarkLinks.forEach(link => {
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            observer.observe(targetElement);
        }
    });

    console.log('Bookmark navigation initialized');
});