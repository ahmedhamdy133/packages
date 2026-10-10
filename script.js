/**
 * ==========================================================================
 * PORTFOLIO PACKAGES — CORE SCRIPT (PARTS 1, 2, 3 & 4)
 * Author: Senior Front-End Developer
 * Features:
 *   - Part 1: GSAP Letter Stagger, Shimmer Loop, Scroll Scrub Assembly, Canvas Particles
 *   - Part 2: 4-Card Responsive Grid, Base & Rush Delivery Config, Flip Price Counter
 *   - Part 3: Per-Card Motion & 3D Tilt, Custom Cursor Reactions, Reduced Motion
 *   - Part 4: "Get in Touch" Hub, Clipboard Copy Toasts, Dynamic WhatsApp Pre-fill
 * ==========================================================================
 */

'use strict';

/* ==========================================================================
   01. CONFIGURATION & SINGLE SOURCE OF TRUTH
   ========================================================================== */
const PACKAGES_CONFIG = {
  basic: {
    id: 'basic',
    name: 'Basic',
    basePrice: 500,
    rushDelta: 300,
    demoUrl: 'https://ahmedhamdy133.github.io/portfolio-basic/',
    cursorLabel: 'Select'
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    basePrice: 1000,
    rushDelta: 300,
    demoUrl: 'https://ahmedhamdy133.github.io/portfolio-professional/',
    cursorLabel: 'Select'
  },
  advanced: {
    id: 'advanced',
    name: 'Advanced',
    basePrice: 2000,
    rushDelta: 500,
    demoUrl: 'https://ahmedhamdy133.github.io/portfolio-ADVANCED/',
    cursorLabel: 'Best Choice'
  },
  custom: {
    id: 'custom',
    name: 'Custom',
    basePrice: 4000,
    rushDelta: 500,
    demoUrl: 'https://ahmedhamdy133.github.io/portfolio-custom1/',
    cursorLabel: 'Contact us'
  }
};

const CONTACT_INFO = {
  whatsappNumber: '01212585151',
  whatsappIntl: '201212585151',
  email: 'ahmedhamdy44vv@gmail.com'
};

// Global State
const appState = {
  rushStates: {
    basic: false,
    professional: false,
    advanced: false,
    custom: false
  },
  activeInquiry: null, // { packageId: 'advanced', rush: false }
  isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  isTouchDevice: ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
};

/* ==========================================================================
   02. DOM CONTENT LOADED INITIALIZER
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP plugins if available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Initialize Modules
  initScrollProgressBar();
  initCustomCursor();
  initAmbientParticles();
  initNavbarBehavior();
  initHeroAnimations();
  initBlueprintAssembly();
  initPackageCards();
  initGetInTouchSection();
});

/* ==========================================================================
   03. SCROLL PROGRESS BAR & ACTIVE NAV SYNC
   ========================================================================== */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress');
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  if (!progressBar) return;

  function updateProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', Math.round(progress));

    if (navbarWrapper) {
      if (scrollTop > 40) {
        navbarWrapper.classList.add('scrolled');
      } else {
        navbarWrapper.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ==========================================================================
   04. STICKY GLASS NAVBAR & MOBILE MENU
   ========================================================================== */
function initNavbarBehavior() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Mobile drawer toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileToggle.classList.toggle('is-active');
      navMenu.classList.toggle('is-open');
    });

    // Close on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.classList.remove('is-active');
        navMenu.classList.remove('is-open');
      });
    });
  }

  // Highlight active link on scroll
  const sections = document.querySelectorAll('section[id], article[id]');
  window.addEventListener('scroll', () => {
    let currentId = 'home';
    const scrollPosition = window.pageYOffset + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   05. CUSTOM CURSOR (DOT + RING + DYNAMIC LABELS)
   ========================================================================== */
function initCustomCursor() {
  if (appState.isTouchDevice) return; // Completely disabled on mobile/touch

  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const cursorText = document.getElementById('cursor-text');

  if (!cursorDot || !cursorRing) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Instant dot movement
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  }, { passive: true });

  // Smooth lerp for trailing ring
  function animateRing() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;

    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;

    requestAnimationFrame(animateRing);
  }
  requestAnimationFrame(animateRing);

  // Click bounce reaction
  window.addEventListener('mousedown', () => cursorRing.classList.add('is-clicking'));
  window.addEventListener('mouseup', () => cursorRing.classList.remove('is-clicking'));

  // Interactive element hover
  const hoverTargets = document.querySelectorAll('a, button, .package-card, [role="button"]');
  hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
      cursorRing.classList.add('is-hovering');
    });
    target.addEventListener('mouseleave', () => {
      cursorRing.classList.remove('is-hovering');
    });
  });

  // Package Card Dynamic Cursor Text ("Select", "Best Choice", "Contact us")
  const packageCards = document.querySelectorAll('.package-card');
  packageCards.forEach(card => {
    const label = card.getAttribute('data-cursor') || 'Select';

    card.addEventListener('mouseenter', () => {
      if (cursorText) cursorText.textContent = label;
      cursorRing.classList.add('has-label');
    });

    card.addEventListener('mouseleave', () => {
      cursorRing.classList.remove('has-label');
      if (cursorText) cursorText.textContent = '';
    });
  });
}

/* ==========================================================================
   06. AMBIENT BACKGROUND PARTICLES (LIGHTWEIGHT CANVAS)
   ========================================================================== */
function initAmbientParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = appState.isTouchDevice ? 20 : 45;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 1.6 + 0.6;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.alpha = Math.random() * 0.45 + 0.15;
      this.color = Math.random() > 0.5 ? '0, 240, 255' : '139, 92, 246';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);

    if (!appState.isReducedMotion) {
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* ==========================================================================
   07. PART 1: HOME (HERO) SECTION ANIMATIONS
   ========================================================================== */
function initHeroAnimations() {
  const heroTitle = document.getElementById('hero-title');
  if (!heroTitle) return;

  // Split title into animated letter spans
  const words = ['Portfolio', 'Packages'];
  heroTitle.innerHTML = '';

  words.forEach((word, wIdx) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = `title-word word-${word.toLowerCase()}`;

    for (let char of word) {
      const letterSpan = document.createElement('span');
      letterSpan.className = 'hero-letter';
      letterSpan.textContent = char;
      wordSpan.appendChild(letterSpan);
    }

    heroTitle.appendChild(wordSpan);
    if (wIdx < words.length - 1) {
      const space = document.createTextNode(' ');
      heroTitle.appendChild(space);
    }
  });

  if (appState.isReducedMotion || typeof gsap === 'undefined') {
    // Instant visibility for reduced motion or GSAP fallback
    document.querySelectorAll('.hero-letter').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    heroTitle.classList.add('shimmer-active');
    return;
  }

  // GSAP Letter-by-letter Stagger Entrance
  const letters = document.querySelectorAll('.hero-letter');
  gsap.to(letters, {
    opacity: 1,
    y: 0,
    rotateX: 0,
    duration: 0.85,
    ease: 'power3.out',
    stagger: 0.045,
    onComplete: () => {
      heroTitle.classList.add('shimmer-active');
    }
  });

  // Stagger in subtitle, actions, and telemetry specs
  gsap.from('.hero-subtitle', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    delay: 0.6,
    ease: 'power2.out'
  });

  gsap.from('.hero-actions, .hero-specs', {
    opacity: 0,
    y: 24,
    duration: 0.8,
    delay: 0.8,
    ease: 'power2.out'
  });
}

/* ==========================================================================
   08. PART 1: BLUEPRINT / ASSEMBLY ANIMATION (PINNED SCRUB)
   ========================================================================== */
function initBlueprintAssembly() {
  const section = document.getElementById('blueprint-section');
  const stage = document.getElementById('blueprint-stage');
  const chassis = document.getElementById('assembly-chassis');
  const glowLayer = document.getElementById('chassis-glow-layer');
  const telemetryProgress = document.getElementById('telemetry-progress-val');

  if (!section || !stage || !chassis) return;

  if (appState.isReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    // Immediate assembly view for reduced motion
    chassis.classList.add('assembled');
    if (glowLayer) glowLayer.style.opacity = '1';
    if (telemetryProgress) telemetryProgress.textContent = 'ASSEMBLY: 100%';
    return;
  }

  // Wireframe pieces
  const pieceNav = document.getElementById('piece-navbar');
  const pieceHero = document.getElementById('piece-hero');
  const card1 = document.getElementById('piece-card-1');
  const card2 = document.getElementById('piece-card-2');
  const card3 = document.getElementById('piece-card-3');
  const card4 = document.getElementById('piece-card-4');
  const pieceFooter = document.getElementById('piece-footer');
  const bracketL = document.getElementById('piece-bracket-left');
  const bracketR = document.getElementById('piece-bracket-right');
  const chip1 = document.getElementById('piece-chip-1');
  const chip2 = document.getElementById('piece-chip-2');

  // GSAP Timeline pinned to scroll scrub
  const assemblyTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=180%',
      pin: true,
      scrub: 1.2,
      anticipatePin: 1,
      onUpdate: (self) => {
        const pct = Math.round(self.progress * 100);
        if (telemetryProgress) {
          telemetryProgress.textContent = `ASSEMBLY: ${pct}%`;
        }

        if (self.progress > 0.85) {
          chassis.classList.add('assembled');
          if (glowLayer) glowLayer.style.opacity = '1';
        } else {
          chassis.classList.remove('assembled');
          if (glowLayer) glowLayer.style.opacity = '0';
        }
      }
    }
  });

  // Set initial scattered positions (Exploded 3D wireframe state)
  gsap.set(pieceNav, { y: -160, x: -80, rotation: -12, opacity: 0.2 });
  gsap.set(pieceHero, { y: -90, x: 120, rotation: 8, opacity: 0.2 });
  gsap.set(card1, { y: 220, x: -180, rotation: -18, opacity: 0.15 });
  gsap.set(card2, { y: 250, x: -60, rotation: -8, opacity: 0.15 });
  gsap.set(card3, { y: 270, x: 60, rotation: 10, scale: 0.8, opacity: 0.15 });
  gsap.set(card4, { y: 240, x: 180, rotation: 16, opacity: 0.15 });
  gsap.set(pieceFooter, { y: 160, rotation: 6, opacity: 0.2 });
  gsap.set(bracketL, { x: -200, rotation: -45, opacity: 0 });
  gsap.set(bracketR, { x: 200, rotation: 45, opacity: 0 });
  gsap.set([chip1, chip2], { scale: 0.4, opacity: 0 });

  // Assembly Scrub Choreography: Fly in and snap into Lego slots
  assemblyTimeline
    // 1. Code Brackets and Telemetry Chips fly in
    .to([bracketL, bracketR], { x: 0, rotation: 0, opacity: 1, duration: 0.35 }, 0)
    .to([chip1, chip2], { scale: 1, opacity: 1, duration: 0.35 }, 0.1)

    // 2. Navbar lands & locks
    .to(pieceNav, { y: 0, x: 0, rotation: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }, 0.15)

    // 3. Hero section snaps
    .to(pieceHero, { y: 0, x: 0, rotation: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.25)

    // 4. Four cards cascade and snap into grid
    .to(card1, { y: 0, x: 0, rotation: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.2)' }, 0.38)
    .to(card2, { y: 0, x: 0, rotation: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.2)' }, 0.44)
    .to(card3, { y: 0, x: 0, rotation: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }, 0.50)
    .to(card4, { y: 0, x: 0, rotation: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.2)' }, 0.56)

    // 5. Footer snaps into place
    .to(pieceFooter, { y: 0, rotation: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.65)

    // 6. Complete Assembly: Chassis illuminates with circuit pulses
    .to(chassis, { scale: 1.02, duration: 0.25, ease: 'power1.inOut' }, 0.85)
    .to(glowLayer, { opacity: 1, duration: 0.25 }, 0.85);
}

/* ==========================================================================
   09. PARTS 2 & 3: PACKAGES SECTION (RUSH TOGGLES & PER-CARD MOTION)
   ========================================================================== */
function initPackageCards() {
  const cards = document.querySelectorAll('.package-card');

  cards.forEach(card => {
    const pkgId = card.getAttribute('data-package-id');
    const config = PACKAGES_CONFIG[pkgId];
    if (!config) return;

    const contactBtn = card.querySelector('.btn-card-contact');
    const rushBtn = card.querySelector('.btn-card-rush');
    const priceValueEl = card.querySelector('.price-value');

    // --- Rush Delivery Toggle Behavior ---
    if (rushBtn && priceValueEl) {
      rushBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleRushDelivery(pkgId, card, rushBtn, priceValueEl);
      });
    }

    // --- Contact Button Behavior ---
    if (contactBtn) {
      contactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        selectPackageForInquiry(pkgId);
      });
    }

    // --- Part 3 Per-Card Interactions & 3D Tilt ---
    setupCardInteractions(card, pkgId);
  });

  // Entrance reveals via ScrollTrigger or IntersectionObserver
  setupCardEntrances(cards);
}

/**
 * Toggles Rush Delivery for a specific card with flip animation & recalculates price
 */
function toggleRushDelivery(pkgId, cardEl, rushBtn, priceValueEl) {
  const config = PACKAGES_CONFIG[pkgId];
  if (!config) return;

  // Toggle boolean state per card in global state
  appState.rushStates[pkgId] = !appState.rushStates[pkgId];
  const isRush = appState.rushStates[pkgId];

  // Recalculate price from single JS config object
  const newPrice = isRush ? (config.basePrice + config.rushDelta) : config.basePrice;

  // Update button label, aria-pressed, and visual state
  if (isRush) {
    rushBtn.textContent = 'Rush Delivery ✓';
    rushBtn.classList.add('is-rush-active');
    rushBtn.setAttribute('aria-pressed', 'true');
    rushBtn.setAttribute('aria-label', `Rush delivery active for ${config.name} (${newPrice} dollars)`);
  } else {
    rushBtn.textContent = `+ Rush ($${config.rushDelta})`;
    rushBtn.classList.remove('is-rush-active');
    rushBtn.setAttribute('aria-pressed', 'false');
    rushBtn.setAttribute('aria-label', `Toggle Rush Delivery for ${config.name} (adds ${config.rushDelta} dollars)`);
  }

  // Animated Flip / Swap Counter on Price
  animatePriceFlip(priceValueEl, newPrice);

  // If this package is currently selected in Get in Touch, refresh contact message
  if (appState.activeInquiry && appState.activeInquiry.packageId === pkgId) {
    updateInquiryBanner(pkgId);
  }
}

/**
 * GSAP Flip / Counter Animation for Price Display
 */
function animatePriceFlip(priceEl, targetPrice) {
  if (appState.isReducedMotion || typeof gsap === 'undefined') {
    priceEl.textContent = targetPrice;
    return;
  }

  const currentPrice = parseInt(priceEl.textContent.replace(/\D/g, ''), 10) || 0;

  // Quick 3D flip out
  gsap.to(priceEl, {
    rotateX: 70,
    opacity: 0,
    duration: 0.16,
    ease: 'power2.in',
    onComplete: () => {
      priceEl.textContent = targetPrice;
      // Flip back in with fresh number
      gsap.to(priceEl, {
        rotateX: 0,
        opacity: 1,
        duration: 0.28,
        ease: 'back.out(1.8)'
      });
    }
  });
}

/**
 * Sets up per-card distinct hover behaviors and 3D tilts (Part 3)
 */
function setupCardInteractions(card, pkgId) {
  // Mobile / Touch skips heavy tilt & pointer listeners
  if (appState.isTouchDevice || appState.isReducedMotion) return;

  // CARD 3: ADVANCED 3D TILT WITH SPECULAR LIGHT
  if (pkgId === 'advanced') {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  }

  // CARD 4: CUSTOM DYNAMIC CURSOR BACKDROP
  if (pkgId === 'custom') {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  }
}

/**
 * Schedule per-card entrance animations:
 * - Basic: Calm fade-in-up
 * - Professional: Unfold / slide & scale
 * - Advanced: Pop entrance with spring, 200ms after others
 * - Custom: Glassmorphism entrance fade/blur
 */
function setupCardEntrances(cards) {
  if (appState.isReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  const grid = document.getElementById('packages-grid');
  if (!grid) return;

  const basicCard = document.getElementById('basic');
  const proCard = document.getElementById('professional');
  const advCard = document.getElementById('advanced');
  const customCard = document.getElementById('custom');

  // Master entrance timeline triggered once on scroll
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: grid,
      start: 'top 80%',
      once: true
    }
  });

  // 1. Basic: calm fade-in-up
  if (basicCard) {
    tl.from(basicCard, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power2.out'
    }, 0);
  }

  // 2. Professional: unfold/slide & scale
  if (proCard) {
    tl.from(proCard, {
      opacity: 0,
      y: 50,
      scale: 0.94,
      duration: 0.85,
      ease: 'power3.out'
    }, 0.1);
  }

  // 3. Custom: glassmorphism fade & blur
  if (customCard) {
    tl.from(customCard, {
      opacity: 0,
      y: 50,
      filter: 'blur(10px)',
      duration: 0.9,
      ease: 'power2.out'
    }, 0.15);
  }

  // 4. Advanced: permanent emphasis, 200ms after others with spring pop
  if (advCard) {
    tl.from(advCard, {
      opacity: 0,
      y: 60,
      scale: 0.88,
      duration: 1,
      ease: 'back.out(1.8)'
    }, 0.35); // 200ms offset after initial wave
  }
}

/* ==========================================================================
   10. PART 4: "GET IN TOUCH" SECTION & DYNAMIC WHATSAPP SCOPING
   ========================================================================== */
function initGetInTouchSection() {
  const waLinkBtn = document.getElementById('whatsapp-link-btn');
  const gmailLinkBtn = document.getElementById('gmail-link-btn');
  const clearInquiryBtn = document.getElementById('btn-clear-inquiry');
  const copyButtons = document.querySelectorAll('.btn-copy');

  // Copy to Clipboard buttons with Toast feedback
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetText = btn.getAttribute('data-copy-target');
      const label = btn.getAttribute('data-label') || 'Text';
      copyToClipboard(targetText, label, btn);
    });
  });

  // Reset active inquiry button
  if (clearInquiryBtn) {
    clearInquiryBtn.addEventListener('click', () => {
      resetInquiry();
    });
  }

  // WhatsApp click handler ensures window.open in new tab with latest encoded message
  if (waLinkBtn) {
    waLinkBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = waLinkBtn.getAttribute('href');
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  // Initial banner update
  refreshWhatsAppMessage();
}

/**
 * Invoked when user clicks "Contact" on any of the 4 package cards
 */
function selectPackageForInquiry(pkgId) {
  const config = PACKAGES_CONFIG[pkgId];
  if (!config) return;

  appState.activeInquiry = {
    packageId: pkgId
  };

  updateInquiryBanner(pkgId);

  // Smooth scroll to Get in Touch section
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });

    // Focus WhatsApp CTA for keyboard accessibility
    setTimeout(() => {
      const waBtn = document.getElementById('whatsapp-link-btn');
      if (waBtn) waBtn.focus();
    }, 600);
  }
}

/**
 * Updates the Get in Touch inquiry banner & pre-fills WhatsApp URL
 */
function updateInquiryBanner(pkgId) {
  const config = PACKAGES_CONFIG[pkgId];
  const isRush = appState.rushStates[pkgId];
  const finalPrice = isRush ? (config.basePrice + config.rushDelta) : config.basePrice;

  const banner = document.getElementById('inquiry-context-banner');
  const nameEl = document.getElementById('inquiry-package-name');
  const priceEl = document.getElementById('inquiry-price-tag');
  const rushTag = document.getElementById('inquiry-rush-tag');
  const waLabel = document.getElementById('wa-btn-label');

  if (banner) banner.classList.add('has-active-package');
  if (nameEl) nameEl.textContent = `${config.name} Package`;
  if (priceEl) priceEl.textContent = `$${finalPrice.toLocaleString()}`;

  if (rushTag) {
    if (isRush) {
      rushTag.classList.remove('hidden');
    } else {
      rushTag.classList.add('hidden');
    }
  }

  if (waLabel) {
    waLabel.textContent = `Inquire about ${config.name} on WhatsApp`;
  }

  refreshWhatsAppMessage();
}

/**
 * Resets inquiry to general consultation
 */
function resetInquiry() {
  appState.activeInquiry = null;

  const banner = document.getElementById('inquiry-context-banner');
  const nameEl = document.getElementById('inquiry-package-name');
  const priceEl = document.getElementById('inquiry-price-tag');
  const rushTag = document.getElementById('inquiry-rush-tag');
  const waLabel = document.getElementById('wa-btn-label');

  if (banner) banner.classList.remove('has-active-package');
  if (nameEl) nameEl.textContent = 'General Inquiry';
  if (priceEl) priceEl.textContent = 'Custom Quote';
  if (rushTag) rushTag.classList.add('hidden');
  if (waLabel) waLabel.textContent = 'Message on WhatsApp';

  refreshWhatsAppMessage();
  showToast('Inquiry reset to General Consultation');
}

/**
 * Generates and encodes pre-filled WhatsApp message
 * Example: "Hi Ahmed, I'm interested in the Advanced package with Rush Delivery"
 */
function refreshWhatsAppMessage() {
  const waLinkBtn = document.getElementById('whatsapp-link-btn');
  if (!waLinkBtn) return;

  let messageText = 'Hi Ahmed, I would like to inquire about your web development services.';

  if (appState.activeInquiry) {
    const pkgId = appState.activeInquiry.packageId;
    const config = PACKAGES_CONFIG[pkgId];
    const isRush = appState.rushStates[pkgId];

    if (config) {
      if (isRush) {
        messageText = `Hi Ahmed, I'm interested in the ${config.name} package with Rush Delivery.`;
      } else {
        messageText = `Hi Ahmed, I'm interested in the ${config.name} package.`;
      }
    }
  }

  const encodedMessage = encodeURIComponent(messageText);
  const fullUrl = `https://wa.me/${CONTACT_INFO.whatsappIntl}?text=${encodedMessage}`;

  waLinkBtn.setAttribute('href', fullUrl);
}

/**
 * Accessible Clipboard Copy Function with Visual & Toast Feedback
 */
function copyToClipboard(text, label, triggerBtn) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => handleCopySuccess(label, triggerBtn))
      .catch(() => fallbackCopy(text, label, triggerBtn));
  } else {
    fallbackCopy(text, label, triggerBtn);
  }
}

function fallbackCopy(text, label, triggerBtn) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.top = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
    handleCopySuccess(label, triggerBtn);
  } catch (err) {
    showToast(`Could not copy ${label}. Please copy manually.`);
  }

  document.body.removeChild(textArea);
}

function handleCopySuccess(label, triggerBtn) {
  if (triggerBtn) {
    const originalText = triggerBtn.innerHTML;
    triggerBtn.classList.add('copied');
    triggerBtn.innerHTML = `<span>Copied!</span>`;

    setTimeout(() => {
      triggerBtn.classList.remove('copied');
      triggerBtn.innerHTML = originalText;
    }, 2000);
  }

  showToast(`Copied ${label} to clipboard!`);
}

/**
 * Toast Notification Popup
 */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">✓</span>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto remove after 3.2 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 350);
  }, 3200);
}
