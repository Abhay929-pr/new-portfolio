// =====================
// Abhay Jadli Portfolio - script.js
// =====================

// --- 1. Google Fonts Loader (for Inter) ---
(function() {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
})();

// --- 2. GSAP & Three.js CDN Loader ---
(function() {
  // GSAP
  const gsapScript = document.createElement('script');
  gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
  gsapScript.onload = () => {
    // ScrollTrigger for on-scroll animations
    const st = document.createElement('script');
    st.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
    document.head.appendChild(st);
  };
  document.head.appendChild(gsapScript);

  // Three.js
  const threeScript = document.createElement('script');
  threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
  document.head.appendChild(threeScript);
})();

// --- 3. Custom Cursor Implementation ---
const cursor = document.createElement('div');
cursor.id = 'custom-cursor';
document.body.appendChild(cursor);

const cursorStyle = document.createElement('style');
cursorStyle.innerHTML = `
#custom-cursor {
  position: fixed;
  top: 0; left: 0;
  width: 14px; height: 14px;
  background: var(--accent);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: width 0.18s cubic-bezier(.4,0,.2,1), height 0.18s cubic-bezier(.4,0,.2,1), background 0.18s;
  mix-blend-mode: lighten;
  box-shadow: 0 0 12px 2px var(--accent);
}
#custom-cursor.cursor-hover {
  width: 36px;
  height: 36px;
  background: rgba(0,174,239,0.18);
  box-shadow: 0 0 32px 8px var(--accent);
}
@media (max-width: 900px) {
  #custom-cursor { display: none !important; }
}
`;
document.head.appendChild(cursorStyle);

let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
let cursorX = mouseX, cursorY = mouseY;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.18;
  cursorY += (mouseY - cursorY) * 0.18;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Expand cursor on interactive elements
function setCursorHoverEvents() {
  const hoverables = document.querySelectorAll('a, button, .cursor-hoverable, .skill-icon, .project-card');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
  });
}
document.addEventListener('DOMContentLoaded', setCursorHoverEvents);
window.addEventListener('DOMContentLoaded', setCursorHoverEvents);

// --- 4. Sticky Navigation Bar ---
const nav = document.querySelector('nav');
function handleNavScroll() {
  if (window.scrollY > 60) {
    nav.classList.add('nav-solid');
  } else {
    nav.classList.remove('nav-solid');
  }
}
window.addEventListener('scroll', handleNavScroll);

// --- 5. Smooth Scroll for Nav Links & CTA ---
function smoothScrollTo(target) {
  const el = document.querySelector(target);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.pageYOffset - 60;
  window.scrollTo({ top: y, behavior: 'smooth' });
}
document.querySelectorAll('nav a[data-scroll], .cta-scroll').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.getAttribute('href');
    smoothScrollTo(target);
  });
});

// --- 6. Dynamic Typing Animation in Hero ---
const typingPhrases = [
  "A Data Engineer.",
  "A Python Developer.",
  "A Big Data Specialist."
];
let typingIndex = 0, charIndex = 0, isDeleting = false;
const typingEl = document.getElementById('typing-text');

function typeLoop() {
  if (!typingEl) return;
  const current = typingPhrases[typingIndex];
  if (isDeleting) {
    typingEl.textContent = current.substring(0, charIndex--);
    if (charIndex < 0) {
      isDeleting = false;
      typingIndex = (typingIndex + 1) % typingPhrases.length;
      setTimeout(typeLoop, 600);
      return;
    }
    setTimeout(typeLoop, 32);
  } else {
    typingEl.textContent = current.substring(0, charIndex++);
    if (charIndex > current.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1200);
      return;
    }
    setTimeout(typeLoop, 70);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  if (typingEl) typeLoop();
});

// --- 7. Three.js Hero Background (Constellation) ---
function initThreeHero() {
  if (!window.THREE) {
    setTimeout(initThreeHero, 100);
    return;
  }
  const canvas = document.getElementById('hero-bg');
  if (!canvas) return;
  const width = canvas.offsetWidth, height = canvas.offsetHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width/height, 1, 1000);
  camera.position.z = 180;

  // Particles
  const particles = 120, geometry = new THREE.BufferGeometry();
  const positions = [];
  for (let i = 0; i < particles; i++) {
    positions.push(
      (Math.random() - 0.5) * 320,
      (Math.random() - 0.5) * 180,
      (Math.random() - 0.5) * 120
    );
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0x00aeef, size: 2.2, transparent: true, opacity: 0.7 });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Animate
  let mouse = { x: 0, y: 0 };
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / width - 0.5) * 2;
    mouse.y = -((e.clientY - rect.top) / height - 0.5) * 2;
  });

  function animate() {
    points.rotation.y += 0.0008 + mouse.x * 0.002;
    points.rotation.x += 0.0005 + mouse.y * 0.001;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  // Responsive
  window.addEventListener('resize', () => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
  });
}
window.addEventListener('DOMContentLoaded', initThreeHero);

// --- 8. GSAP Animations: On-Scroll Reveal ---
function gsapReveal() {
  if (!window.gsap || !window.ScrollTrigger) {
    setTimeout(gsapReveal, 100);
    return;
  }
  // About Section
  gsap.from('.about-content', {
    scrollTrigger: {
      trigger: '#about',
      start: 'top 80%',
    },
    y: 60,
    opacity: 0,
    duration: 1.1,
    ease: 'power3.out'
  });
  // Skills Section
  gsap.from('.skills-grid', {
    scrollTrigger: {
      trigger: '#skills',
      start: 'top 80%',
    },
    y: 60,
    opacity: 0,
    duration: 1.1,
    delay: 0.2,
    ease: 'power3.out'
  });
  // Projects Section
  gsap.from('.projects-grid', {
    scrollTrigger: {
      trigger: '#projects',
      start: 'top 80%',
    },
    y: 60,
    opacity: 0,
    duration: 1.1,
    delay: 0.3,
    ease: 'power3.out'
  });
  // Contact Section
  gsap.from('.contact-content', {
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 80%',
    },
    y: 60,
    opacity: 0,
    duration: 1.1,
    delay: 0.4,
    ease: 'power3.out'
  });
}
window.addEventListener('DOMContentLoaded', gsapReveal);

// --- 9. Skills Tooltip & Hover Animation ---
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.skill-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() {
      this.classList.add('active');
      const tooltip = this.querySelector('.skill-tooltip');
      if (tooltip) tooltip.style.opacity = 1;
    });
    icon.addEventListener('mouseleave', function() {
      this.classList.remove('active');
      const tooltip = this.querySelector('.skill-tooltip');
      if (tooltip) tooltip.style.opacity = 0;
    });
  });
});

// --- 10. Projects: 3D Tilt & Modal ---
function tiltCard(card) {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const cx = rect.width/2, cy = rect.height/2;
    const dx = (x - cx) / cx, dy = (y - cy) / cy;
    card.style.transform = `rotateY(${dx*10}deg) rotateX(${-dy*10}deg) scale(1.04)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
}
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.project-card').forEach(card => {
    tiltCard(card);
    card.addEventListener('click', function() {
      const modalId = this.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('open');
        document.body.classList.add('modal-open');
      }
    });
  });
  // Modal close
  document.querySelectorAll('.modal .modal-close').forEach(btn => {
    btn.addEventListener('click', function() {
      this.closest('.modal').classList.remove('open');
      document.body.classList.remove('modal-open');
    });
  });
  // Close modal on overlay click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.classList.remove('modal-open');
      }
    });
  });
});

// --- 11. Contact Icons Hover Animation ---
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.contact-icon-link').forEach(link => {
    link.addEventListener('mouseenter', () => link.classList.add('active'));
    link.addEventListener('mouseleave', () => link.classList.remove('active'));
  });
});

// --- 12. Responsive Nav Toggle (for mobile) ---
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
    document.querySelectorAll('#nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
      });
    });
  }
});

// --- 13. Accessibility: Trap focus in modal ---
function trapFocus(modal) {
  const focusable = modal.querySelectorAll('a, button, textarea, input, [tabindex]:not([tabindex="-1"])');
  if (!focusable.length) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  modal.addEventListener('keydown', function(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('transitionend', function() {
      if (modal.classList.contains('open')) {
        trapFocus(modal);
        const focusable = modal.querySelectorAll('a, button, textarea, input, [tabindex]:not([tabindex="-1"])');
        if (focusable.length) focusable[0].focus();
      }
    });
  });
});

// --- 14. Prevent body scroll when modal open ---
const styleModalOpen = document.createElement('style');
styleModalOpen.innerHTML = `
body.modal-open {
  overflow: hidden !important;
}
`;
document.head.appendChild(styleModalOpen);

// --- 15. Utility: Re-apply cursor events on DOM update (for SPA-like behavior) ---
const observer = new MutationObserver(setCursorHoverEvents);
observer.observe(document.body, { childList: true, subtree: true });

// =====================
// End of script.js
// =====================
