// Utility to defer non-critical initialization
const deferInit = (callback) => {
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(callback);
    } else {
        setTimeout(callback, 1);
    }
};

// Optimized Main Logic
document.addEventListener('DOMContentLoaded', function () {
    const loadingScreen = document.getElementById('loadingScreen');
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const backToTop = document.getElementById('backToTop');

    // 1. Critical UI Interaction (Instant)
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'visible';
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Navbar Scroll & Back-to-Top (Passive)
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const isScrolled = lastScrollY > 100;
                navbar?.classList.toggle('scrolled', isScrolled);
                backToTop?.classList.toggle('visible', isScrolled);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // 2. Deferred Non-Critical Initialization
    deferInit(() => {
        // Smooth scroll without offsetTop lookup on load
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (target) {
                    // One-time lookup on click is acceptable
                    const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top, behavior: 'smooth' });
                    navMenu?.classList.remove('active');
                    navToggle?.classList.remove('active');
                }
            });
        });

        // Initialize components
        initInteractions();
        initStats();
        initGallery();
        initTestimonials();
        initAOS();
    });
});

// Highly Optimized AOS replacement using IntersectionObserver
function initAOS() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target); // Performance: stop observing once animated
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
}

// Stats counter with pre-parsed values to avoid per-frame regex/parseInt
function initStats() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                startCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const startCounter = (el) => {
        const targetStr = el.getAttribute('data-count');
        const target = parseInt(targetStr.replace(/[^\d]/g, ''));
        const suffix = targetStr.replace(/[\d]/g, '');
        const duration = 2000;
        const startTime = performance.now();

        const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuad = t => t * (2 - t);
            const current = Math.floor(easeOutQuad(progress) * target);

            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = targetStr;
            }
        };
        requestAnimationFrame(update);
    };

    counters.forEach(c => observer.observe(c));
}

// Gallery Lightbox Optimization
function initGallery() {
    const gallery = document.querySelector('.gallery-grid');
    if (!gallery) return;

    gallery.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (!item) return;

        const img = item.querySelector('img');
        if (!img) return;

        importGalleryLightbox(img.src, img.alt);
    });
}

async function importGalleryLightbox(src, alt) {
    // Dynamic lightbox implementation only when needed
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `<div class="lightbox-content"><img src="${src}" alt="${alt}"><button class="lightbox-close">&times;</button></div>`;

    overlay.addEventListener('click', (e) => {
        if (e.target.classList.contains('lightbox-overlay') || e.target.classList.contains('lightbox-close')) {
            overlay.remove();
        }
    });

    document.body.appendChild(overlay);
}

// Testimonials Carousel (simplified)
class Testimonials {
    constructor() {
        this.slides = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.dot');
        this.current = 0;
        if (this.slides.length < 2) return;

        document.getElementById('prevBtn')?.addEventListener('click', () => this.move(-1));
        document.getElementById('nextBtn')?.addEventListener('click', () => this.move(1));
        this.dots.forEach((dot, i) => dot.addEventListener('click', () => this.go(i)));

        setInterval(() => this.move(1), 5000);
    }

    move(dir) {
        this.go((this.current + dir + this.slides.length) % this.slides.length);
    }

    go(index) {
        this.slides[this.current].classList.remove('active');
        this.dots[this.current].classList.remove('active');
        this.current = index;
        this.slides[this.current].classList.add('active');
        this.dots[this.current].classList.add('active');
    }
}

function initTestimonials() {
    new Testimonials();
}

function initInteractions() {
    // Passive Parallax
    const heroBg = document.querySelector('.hero-background');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = `translate3d(0, ${scrolled * 0.3}px, 0)`;
            }
        }, { passive: true });
    }
}

function enhanceWhatsAppIntegration() {
    // Implemented via CSS transition where possible to avoid JS overhead
}
