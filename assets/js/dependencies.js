// CSS helper
function loadScript(src, async = false) {
    return new Promise(resolve => {
        const s = document.createElement("script");
        s.src = src;
        s.async = async;
        s.onload = resolve;
        document.head.appendChild(s);
    });
}

// JS helper
function loadCSS(href) {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
}

// CSS dependencies
loadCSS("lib/tippy.css");

// JS dependencies (in order)
(async () => {
    await loadScript("lib/gsap.min.js");
    await loadScript("lib/ScrollTrigger.min.js");
    await loadScript("lib/lenis.min.js");
    await loadScript("lib/popper.min.js");
    await loadScript("lib/tippy.umd.min.js");

    // Notify that all libs are loaded
    document.dispatchEvent(new Event("dependenciesLoaded"));
})();