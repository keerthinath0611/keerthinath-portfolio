/**
 * Keerthinath V — Academic & CSE Undergraduate Portfolio
 * Interactive Functionality & Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initMouseSpotlight();
  initAmbientParticles();
  initNavigation();
  initAcademicIdBadge();
  initSkillsTabs();
  initCertificateSlider();
  initAccoladesViewToggle();
  initContactModal();
  initLightbox();
  initBackToTop();
  initScrollAnimations();
});

/* ==========================================================================
   1. MOUSE SPOTLIGHT GLOW
   ========================================================================== */
function initMouseSpotlight() {
  const spotlight = document.getElementById('mouse-spotlight');
  if (!spotlight) return;

  // Only enable on pointer-capable devices
  if (window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      spotlight.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      spotlight.style.opacity = '0';
    });

    // Smooth lerp animation for buttery feel
    function animateSpotlight() {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      spotlight.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateSpotlight);
    }
    animateSpotlight();
  } else {
    spotlight.style.display = 'none';
  }
}

/* ==========================================================================
   1.5. SUBTLE HIGH-END BACKGROUND PARTICLES & SPARKLES
   ========================================================================== */
function initAmbientParticles() {
  const canvas = document.getElementById('ambient-particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let animationFrameId = null;
  let lastScrollY = window.pageYOffset;
  let scrollDelta = 0;

  // Particle count: rich cascading field
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 42 : 75;
  const particles = [];

  // Vibrant, crisp color palette: soft violet, neon purple, periwinkle, and diamond white
  const colors = [
    { r: 216, g: 180, b: 254 }, // Bright lavender/purple
    { r: 192, g: 132, b: 252 }, // Radiant neon purple
    { r: 168, g: 85,  b: 247 }, // Deep neon purple
    { r: 165, g: 180, b: 252 }, // Periwinkle indigo
    { r: 255, g: 255, b: 255 }  // Pure diamond white
  ];

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);
  }

  // Generate particle with size variation & 35%-45% opacity
  function createParticle(resetAtTop = false) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    // Clearly visible against dark purple: 35% to 45% base opacity
    const baseAlpha = 0.35 + Math.random() * 0.10;
    
    // Size variation across 3 tiers of depth
    const typeRand = Math.random();
    let radius, isSparkle;
    if (typeRand < 0.25) {
      // 25%: crisp 4-point diamond sparkle stars
      isSparkle = true;
      radius = 2.0 + Math.random() * 1.2;
    } else if (typeRand < 0.65) {
      // 40%: glowing circular stars
      isSparkle = false;
      radius = 1.4 + Math.random() * 0.9;
    } else {
      // 35%: subtle ambient glowing dots
      isSparkle = false;
      radius = 0.8 + Math.random() * 0.5;
    }

    return {
      x: Math.random() * width,
      y: resetAtTop ? -15 : Math.random() * height,
      radius: radius,
      color: color,
      baseAlpha: baseAlpha,
      alpha: baseAlpha,
      // Continuous smooth downward drift from top to bottom
      vy: 0.45 + Math.random() * 0.65,
      vx: (Math.random() - 0.5) * 0.2,
      swaySeed: Math.random() * 100,
      swaySpeed: 0.015 + Math.random() * 0.02,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.02 + Math.random() * 0.04,
      isSparkle: isSparkle
    };
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(false));
    }
  }

  // Scroll velocity tracker for natural parallax acceleration
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    const currentScrollY = window.pageYOffset;
    scrollDelta = Math.min(Math.max(currentScrollY - lastScrollY, -16), 16);
    lastScrollY = currentScrollY;

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      scrollDelta = 0;
    }, 100);
  }, { passive: true });

  window.addEventListener('resize', () => {
    resizeCanvas();
  });

  // Draw 4-point diamond sparkle cross with glowing aura
  function drawSparkle(x, y, radius, alpha, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha.toFixed(3)})`;
    ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${Math.min(alpha * 1.6, 0.85)})`;
    ctx.shadowBlur = radius * 3.5;

    ctx.beginPath();
    const len = radius * 2.3;
    const thickness = radius * 0.42;
    ctx.moveTo(0, -len);
    ctx.quadraticCurveTo(thickness, -thickness, len, 0);
    ctx.quadraticCurveTo(thickness, thickness, 0, len);
    ctx.quadraticCurveTo(-thickness, thickness, -len, 0);
    ctx.quadraticCurveTo(-thickness, -thickness, 0, -len);
    ctx.closePath();
    ctx.fill();

    // Subtle bright central core for extra radiance
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(alpha * 1.3, 0.95)})`;
    ctx.fill();

    ctx.restore();
  }

  // Draw soft glowing star circle
  function drawCircle(x, y, radius, alpha, color) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha.toFixed(3)})`;
    ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${Math.min(alpha * 1.5, 0.8)})`;
    ctx.shadowBlur = radius * 3.0;
    ctx.fill();
    ctx.restore();
  }

  let time = 0;
  function render() {
    animationFrameId = requestAnimationFrame(render);
    ctx.clearRect(0, 0, width, height);

    time += 1;
    const scrollEffect = Math.max(0, scrollDelta * 0.12);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Continuous downward drift from top to bottom
      p.y += p.vy + scrollEffect;
      p.x += p.vx + Math.sin(time * p.swaySpeed + p.swaySeed) * 0.22;

      // Gentle twinkle (alpha clearly visible between 0.32 and 0.45)
      p.twinklePhase += p.twinkleSpeed;
      p.alpha = p.baseAlpha * (0.8 + 0.2 * Math.sin(p.twinklePhase));

      // Reset when particle drifts off the bottom of the viewport
      if (p.y > height + 20) {
        p.y = -15;
        p.x = Math.random() * width;
        continue;
      }
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;

      // Render sparkle or glowing circle
      if (p.isSparkle) {
        drawSparkle(p.x, p.y, p.radius, p.alpha, p.color);
      } else {
        drawCircle(p.x, p.y, p.radius, p.alpha, p.color);
      }
    }
  }

  // Pause when tab is inactive to preserve CPU & battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    } else {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(render);
      }
    }
  });

  // Accessibility: respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    resizeCanvas();
    initParticles();
    for (const p of particles) {
      drawCircle(p.x, p.y, p.radius, p.baseAlpha, p.color);
    }
    return;
  }

  resizeCanvas();
  initParticles();
  render();
}

/* ==========================================================================
   2. STICKY NAVIGATION & ACTIVE SCROLL SPY
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header blur effect on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.innerHTML = isOpen 
        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>'
        : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    });

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
      });
    });
  }

  // Active link scroll spy
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navTarget = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (navTarget) navTarget.classList.add('active');
      }
    });
  }
}

/* ==========================================================================
   2.5. ACADEMIC ID PROFILE BADGE (3D PERSPECTIVE TILT)
   ========================================================================== */
function initAcademicIdBadge() {
  const badgeCard = document.getElementById('hero-academic-badge');
  if (!badgeCard) return;

  // Interactive 3D Perspective Tilt on Mouse Hover
  if (window.matchMedia('(pointer: fine)').matches) {
    const wrapper = badgeCard.parentElement;
    if (!wrapper) return;

    wrapper.addEventListener('mousemove', (e) => {
      const rect = badgeCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      badgeCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    wrapper.addEventListener('mouseleave', () => {
      badgeCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }
}

/* ==========================================================================
   3. TECHNICAL SKILLS INTERACTIVE CATEGORY TABS
   ========================================================================== */
function initSkillsTabs() {
  const tabBtns = document.querySelectorAll('.skill-tab-btn');
  const panels = document.querySelectorAll('.skills-content-panel');

  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetCategory = btn.getAttribute('data-tab');

      // Update button active state
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Switch panels with smooth fade
      panels.forEach(panel => {
        if (panel.id === `tab-${targetCategory}`) {
          panel.classList.add('active');
          // Animate progress meters inside the active panel
          const meters = panel.querySelectorAll('.skill-meter-fill');
          meters.forEach(m => {
            const width = m.getAttribute('data-width');
            m.style.width = '0%';
            setTimeout(() => { m.style.width = width; }, 50);
          });
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });

  // Trigger initial animation for active tab meters
  const initialMeters = document.querySelectorAll('.skills-content-panel.active .skill-meter-fill');
  initialMeters.forEach(m => {
    const width = m.getAttribute('data-width');
    m.style.width = width;
  });
}

/* ==========================================================================
   4. CERTIFICATES & ACCOLADES INTERACTIVE CAROUSEL SLIDER
   ========================================================================== */
function initCertificateSlider() {
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.slider-btn-prev');
  const nextBtn = document.querySelector('.slider-btn-next');
  const counterEl = document.querySelector('.slider-counter');
  const dotsContainer = document.querySelector('.slider-dots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoplayInterval;

  // Build dots
  dotsContainer.innerHTML = '';
  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.slider-dot');

  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update counter "01 / 05"
    if (counterEl) {
      const currentFormatted = String(currentIndex + 1).padStart(2, '0');
      const totalFormatted = String(totalSlides).padStart(2, '0');
      counterEl.textContent = `${currentFormatted} / ${totalFormatted}`;
    }

    // Update dots
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    updateSlider();
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 40;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
      resetAutoplay();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
      resetAutoplay();
    }
  }

  // Keyboard Navigation when slider section is focused/in view
  window.addEventListener('keydown', (e) => {
    const section = document.getElementById('certificates');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      if (e.key === 'ArrowRight') { nextSlide(); resetAutoplay(); }
      if (e.key === 'ArrowLeft') { prevSlide(); resetAutoplay(); }
    }
  });

  // Autoplay functionality
  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5500);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  // Pause on hover
  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    carouselContainer.addEventListener('mouseleave', () => startAutoplay());
  }

  startAutoplay();
  updateSlider();
}

/* ==========================================================================
   5. CONTACT MODAL & TACTILE 3D INTERACTIONS
   ========================================================================== */
function initContactModal() {
  const modalOverlay = document.getElementById('contact-modal');
  const openButtons = document.querySelectorAll('[data-open-contact]');
  const closeBtn = document.querySelector('.modal-close-btn');
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const directEmail = "keerthinath.v2026@vitstudent.ac.in";
  const contactForm = document.getElementById('quick-contact-form');

  if (!modalOverlay) return;

  function openModal() {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close on outside click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Close on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Direct 1-Click Copy Email
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(directEmail).then(() => {
        const badge = copyEmailBtn.querySelector('.action-card-badge');
        const originalText = badge.innerHTML;
        badge.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
        badge.style.color = '#34d399';
        showToast('Email address copied to clipboard!');

        setTimeout(() => {
          badge.innerHTML = originalText;
          badge.style.color = '';
        }, 3000);
      }).catch(err => {
        // Fallback for clipboard
        const input = document.createElement('input');
        input.value = directEmail;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast('Email address copied to clipboard!');
      });
    });
  }

  // Quick message submission simulation
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `<span>Sending...</span>`;
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = `<span>Message Prepared!</span>`;
        showToast('Thank you! Redirecting to your email client...');
        
        const name = document.getElementById('contact-name').value;
        const msg = document.getElementById('contact-message').value;
        const mailtoUri = `mailto:${directEmail}?subject=${encodeURIComponent(`Academic Contact from ${name}`)}&body=${encodeURIComponent(msg)}`;
        
        window.location.href = mailtoUri;

        setTimeout(() => {
          contactForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          closeModal();
        }, 1500);
      }, 800);
    });
  }
}

/* ==========================================================================
   6. LIGHTBOX MODAL FOR CERTIFICATES & IMAGES
   ========================================================================== */
function initLightbox() {
  const lightboxOverlay = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-target-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxSub = document.getElementById('lightbox-subtitle');
  const closeBtn = document.querySelector('.lightbox-close-btn');

  if (!lightboxOverlay || !lightboxImg) return;

  function openLightbox(src, title, subtitle) {
    lightboxImg.src = src;
    if (lightboxTitle) lightboxTitle.textContent = title || 'Certificate Distinction';
    if (lightboxSub) lightboxSub.textContent = subtitle || 'Keerthinath V • Academic Record';
    lightboxOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Bind to all certificate preview frames
  const certFrames = document.querySelectorAll('.cert-image-frame');
  certFrames.forEach(frame => {
    frame.addEventListener('click', () => {
      const img = frame.querySelector('img');
      const card = frame.closest('.carousel-slide, .accolade-photo-card');
      const title = card ? card.querySelector('h3').textContent : 'Academic Certificate';
      const sub = card ? card.querySelector('p').textContent : 'VIT Vellore CSE';
      if (img) openLightbox(img.src, title, sub);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) closeLightbox();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxOverlay.classList.contains('open')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   6B. ACCOLADES VIEW TOGGLE (PHOTO GRID VS SLIDER)
   ========================================================================== */
function initAccoladesViewToggle() {
  const viewBtns = document.querySelectorAll('.accolades-view-btn');
  const gridView = document.querySelector('.accolades-grid');
  const sliderView = document.querySelector('.slider-wrapper');

  if (!viewBtns.length || !gridView || !sliderView) return;

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (view === 'grid') {
        gridView.style.display = 'grid';
        sliderView.style.display = 'none';
      } else {
        gridView.style.display = 'none';
        sliderView.style.display = 'block';
      }
    });
  });
}

/* ==========================================================================
   7. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   8. TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message) {
  const container = document.querySelector('.toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    </span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger entrance
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Remove after delay
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 400);
  }, 3500);
}

/* ==========================================================================
   9. SCROLL REVEAL MICRO-ANIMATIONS (SMOOTH DROP-IN / FADE-IN)
   ========================================================================== */
function initScrollAnimations() {
  const revealTargets = document.querySelectorAll(
    '.status-badge, .hero-greeting, .hero-name, .hero-subtitle, .hero-tagline, .quote-card, .hero-actions, .hero-socials, .hero-id-badge-wrapper, ' +
    '.section-header, .about-narrative-card, .pillar-card, .honor-card, .skills-nav-tabs, .skill-item-card, .project-card, .accolades-view-controls, .accolade-photo-card, .carousel-container, .contact-card-banner'
  );

  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');

        // Animate skill meter fill when skill card enters view
        if (entry.target.classList.contains('skill-item-card')) {
          const fill = entry.target.querySelector('.skill-meter-fill');
          if (fill) {
            const targetWidth = fill.getAttribute('data-width') || '90%';
            fill.style.width = targetWidth;
          }
        }

        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealTargets.forEach(el => {
    el.classList.add('reveal-item');

    // Stagger delay within parent group for natural cascading drop-in
    const parent = el.parentElement;
    if (parent) {
      const idx = Array.from(parent.children).indexOf(el);
      if (idx >= 0) {
        el.style.transitionDelay = `${(idx % 6) * 0.08}s`;
      }
    }
    revealObserver.observe(el);
  });
}

/* ==========================================================================
   10. IMAGE FALLBACK ERROR HANDLER
   ========================================================================== */
window.handleImageError = function(imgElement) {
  // If the user hasn't supplied the image or the file is missing
  imgElement.style.display = 'none';
  const fallback = imgElement.nextElementSibling;
  if (fallback && fallback.classList.contains('profile-fallback')) {
    fallback.style.display = 'flex';
  }
};
