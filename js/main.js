/* ═══════════════════════════════════════════
   TRUHEAT — Main JavaScript
   Interactions, animations, form handling
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──
  const navbar = document.querySelector('.navbar');

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // ── Mobile hamburger menu ──
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // ── Active nav link on scroll ──
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navAnchors.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
      }
    });
  }

  // ── Intersection Observer for reveal animations ──
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Animated counter ──
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(update);
  }

  // ── Floating particles in hero ──
  const particleContainer = document.querySelector('.hero-particles');
  if (particleContainer) {
    for (let i = 0; i < 25; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      const size = Math.random() * 4 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      particleContainer.appendChild(particle);
    }
  }

  // ── Product card click → navigate to product page ──
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking a link inside (let the link handle it)
      if (e.target.closest('a')) return;

      // Navigate to the product page
      const link = card.querySelector('.learn-more');
      if (link && link.href) {
        window.location.href = link.href;
      }
    });
  });

  // ── Product Modal ──
  const modalOverlay = document.getElementById('productModal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  // Product data store
  const productData = {
    'single-stage': {
      title: 'Transformer Oil Filter — Single Stage',
      content: `
        <p>As is well known, the Transformer plays an important role in the generation, transmission and distribution of electrical energy. Under load, the transformer dissipates heat and the insulating oil acts as a coolant as well as an effective dielectric. Due to the highly hygroscopic nature of the transformer oil, it absorbs moisture from windings, which leads to gradual deterioration of dielectric strength.</p>
        <p><strong>TRUHEAT oil purifier</strong> is the most efficient and economical purification system.</p>
        <h3>Components of Plant</h3>
        <ul>
          <li><strong>Filter Unit</strong> — Coarse strainer with wire mesh filter element for retaining solid particles and a powerful magnet for retaining magnetic particles. Also includes round type filter paper discs held under spring compression.</li>
          <li><strong>Indirect Oil Heating</strong> — Specially designed heaters with low watt density heat the auxiliary heating oil at 70–80°C. This indirect method completely prevents localized overheating.</li>
          <li><strong>Vacuum Dehydration / Degasification Unit</strong> — Cylindrical external pressure vessel fitted with shallow drip trays and a specially designed spray pipe to increase interfacial surface area.</li>
          <li><strong>Condenser &amp; Condensate Receiver</strong> — For condensing the vapour from the dehydration chamber, with welded M.S. construction.</li>
          <li><strong>Feed &amp; Delivery Pump</strong> — Rotary gear type coupled directly with motors. Vacuum pump with adequate capacity.</li>
          <li><strong>Water Separator</strong> — Collects water produced by the condenser for periodic draining.</li>
          <li><strong>Control Panel</strong> — Centralized panel with thermostat, thermometers, pressure/vacuum gauges, flow control indicator, electronic float control, and electrical overload protection.</li>
        </ul>
      `
    },
    'multi-stage': {
      title: 'Transformer Oil Filter — Multi Stage',
      content: `
        <p>For cases where a higher state of vacuum is required to maintain low value of dissolved gases and moisture, we offer double or three stage vacuum filter systems.</p>
        <p>Added advantage includes improving quality of filtered oil to a higher level under single pass at approximately 60°C.</p>
        <h3>Special Features</h3>
        <ul>
          <li>Alarm Annunciators</li>
          <li>Moisture Content Meter</li>
          <li>Gas Content Meter</li>
          <li>Digital Electronic Measuring Instruments</li>
          <li>Oil Flow Meter</li>
          <li>Transformer Evacuation System</li>
        </ul>
        <h3>Ionic Reaction Column</h3>
        <p>For cases requiring decreased acid content, an ionic reaction column is provided complete with high grade neutralizing chemicals and stainless steel wire mesh supporting media.</p>
      `
    },
    'oil-test': {
      title: 'Oil Test Set',
      content: `
        <p>Our Oil Test Sets are ideal for speedy and accurate testing of dielectric strength of transformer and circuit breaker oils as per IS:6792-1972.</p>
        <h3>Output</h3>
        <p>Continuously variable output from 0–50KV, 0–60KV, 0–75KV, 0–100KV, or 0–120KV. Sets are available in manual or motor operated variants.</p>
        <h3>Controls</h3>
        <ul>
          <li>Continuously variable auto-transformer for smooth voltage variation</li>
          <li>Automatic tripping mechanism for H.T. transformer protection</li>
          <li>Voltmeter calibrated in KV on L.T. side</li>
          <li>Zero-start interlocking device</li>
          <li>Memory device to display breakdown voltage after trip</li>
        </ul>
        <h3>Test Vessel</h3>
        <p>Fitted with two brass spheres (Ø 12.7mm) placed at 2.5mm gap distance, adjustable, made from non-absorbent insulating material.</p>
      `
    },
    'hv-test': {
      title: 'AC/DC High Voltage Test Set',
      content: `
        <h3>AC High Voltage Test Set</h3>
        <p>Ideal for testing electrical strength of different insulating materials, motor windings, transformers, ceramic HV insulators, cables and other electrical components.</p>
        <p><strong>Input:</strong> 230V or 415V</p>
        <h3>DC High Voltage Test Set</h3>
        <p>Ideal for speedy and accurate testing of high voltage cable insulation, high voltage capacitance insulation, motors and switchgear.</p>
      `
    },
    'relay-test': {
      title: 'Relay Test Set',
      content: `
        <p>These Relay Test Sets are ideal for testing protective relays, over-current relays, earth fault relays, and circuit breakers.</p>
        <h3>Output Specifications</h3>
        <ul>
          <li><strong>Current Output:</strong> 0–1/2/5/10 Amps (Open Circuit Voltage: 25V)</li>
          <li><strong>High Current:</strong> 0–50/100 Amps (Open Circuit Voltage: 5V)</li>
          <li><strong>AC Voltage Output:</strong> 0–250V, Capacity: 2 Amp</li>
          <li><strong>DC Voltage Output:</strong> 0–250V, Capacity: 1 Amp</li>
          <li><strong>Timer:</strong> 4-Digit Time Interval Meter (9.999 or 99.99 seconds)</li>
        </ul>
        <p><strong>Input:</strong> 240V</p>
      `
    },
    'overvoltage-test': {
      title: 'Induced Over Voltage Test Set',
      content: `
        <p>These sets are suitable for testing Induced Over Voltage of Distribution Transformers, Power Transformers, various Step-Down and Step-Up Transformers, and motors whose rated voltage is below 600V.</p>
      `
    }
  };

  // Open modal
  document.querySelectorAll('[data-product]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const key = trigger.dataset.product;
      const data = productData[key];
      if (data) {
        modalTitle.textContent = data.title;
        modalBody.innerHTML = data.content;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close modal
  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ── Spec tabs ──
  const specTabs = document.querySelectorAll('.spec-tab');
  const specPanels = document.querySelectorAll('.spec-panel');

  specTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      specTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      specPanels.forEach(p => {
        p.classList.remove('active');
        if (p.id === target) p.classList.add('active');
      });
    });
  });

  // ── Contact form — Web3Forms submission ──
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.querySelector('.form-success');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear previous errors
      contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

      // Validate name
      const name = contactForm.querySelector('#formName');
      if (!name.value.trim()) {
        name.closest('.form-group').classList.add('error');
        isValid = false;
      }

      // Validate email
      const email = contactForm.querySelector('#formEmail');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        email.closest('.form-group').classList.add('error');
        isValid = false;
      }

      // Validate phone
      const phone = contactForm.querySelector('#formPhone');
      if (phone.value.trim().length < 8) {
        phone.closest('.form-group').classList.add('error');
        isValid = false;
      }

      // Validate message
      const message = contactForm.querySelector('#formMessage');
      if (!message.value.trim()) {
        message.closest('.form-group').classList.add('error');
        isValid = false;
      }

      if (isValid) {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
          const formData = new FormData(contactForm);
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
          });

          const result = await response.json();

          if (result.success) {
            contactForm.style.display = 'none';
            formSuccess.classList.add('active');
            contactForm.reset();
          } else {
            alert('Something went wrong. Please try again or contact us directly at nishaoilfilter@gmail.com');
          }
        } catch (error) {
          alert('Network error. Please check your connection and try again.');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Enquiry →';
        }
      }
    });
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      e.preventDefault();
      const target = document.querySelector(id);
      if (target) {
        const offset = 80;
        const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: position, behavior: 'smooth' });
      }
    });
  });

});

/* ── Image Lightbox ── */
function openLightbox(src, title, rotate = false) {
  const lightbox  = document.getElementById('imageLightbox');
  const img       = document.getElementById('lightboxImg');
  const canvas    = document.getElementById('lightboxCanvas');
  const titleEl   = document.getElementById('lightboxTitle');

  titleEl.textContent = title;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';

  if (rotate) {
    // Draw the image rotated -90° onto a canvas so layout dimensions
    // are actually landscape — this allows proper scrolling.
    img.style.display = 'none';
    canvas.style.display = 'block';

    const tempImg = new Image();
    tempImg.onload = function () {
      // Canvas gets landscape dimensions (w and h swapped)
      canvas.width  = tempImg.naturalHeight;
      canvas.height = tempImg.naturalWidth;

      const ctx = canvas.getContext('2d');
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.drawImage(tempImg, -tempImg.naturalWidth / 2, -tempImg.naturalHeight / 2);

      // Apply sharpening filter via CSS on the canvas
      canvas.style.filter = 'contrast(1.08) brightness(0.97)';
      canvas.style.borderRadius = '8px';
      canvas.style.boxShadow = '0 25px 80px rgba(0,0,0,0.5)';
      canvas.style.maxWidth = '100%';
      canvas.style.height = 'auto';
    };
    tempImg.src = src;

  } else {
    canvas.style.display = 'none';
    img.style.display = 'block';
    img.src = src;
    img.alt = title;
    img.classList.remove('rotate-landscape');
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('imageLightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// Close lightbox on click outside image or Escape key
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('imageLightbox');
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-body')) {
        closeLightbox();
      }
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
});
