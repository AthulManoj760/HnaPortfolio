document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Header scroll state ---------- */
const header = document.getElementById('siteHeader');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 8);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- Mobile nav toggle ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- Custom cursor dot base (desktop only) ---------- */
const cursorDot = document.getElementById('cursorDot');
const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (supportsHover && cursorDot) {
  window.addEventListener('mousemove', (e) => {
    cursorDot.style.opacity = '1';
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
  });

  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
  });
}

/* ---------- Load Components ---------- */
async function loadComponents() {
  const components = [
    { id: 'about', url: 'components/about.html' },
    { id: 'skills', url: 'components/skills.html' },
    { id: 'experience', url: 'components/experience.html' },
    { id: 'projects', url: 'components/projects.html' },
    { id: 'certifications', url: 'components/certifications.html' },
    { id: 'contact', url: 'components/contact.html' }
  ];

  await Promise.all(components.map(async (comp) => {
    const el = document.getElementById(comp.id);
    if (el) {
      try {
        const url = `${comp.url}?v=${Date.now()}`;
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const text = await res.text();
          el.innerHTML = text;
        }
      } catch (e) {
        console.error(`Failed to load ${comp.url}`, e);
      }
    }
  }));

  // Initialize scripts that depend on the newly loaded DOM
  initDynamicScripts();
}

/* ---------- Initialize Dynamic Scripts ---------- */
function initDynamicScripts() {
  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    '.about-copy, .about-stats, .skill-card, .exp-card, .project-row, .cert-card, .extra-row, .contact-frame'
  );
  revealTargets.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ---------- Skill bar fill on view ---------- */
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach((card) => {
    card.querySelectorAll('.bar span').forEach((bar) => {
      bar.style.setProperty('--target-width', bar.style.width);
      bar.style.width = '0';
    });
  });

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );
  skillCards.forEach((card) => skillObserver.observe(card));

  /* ---------- Interactive cursor elements ---------- */
  if (supportsHover && cursorDot) {
    const interactiveEls = document.querySelectorAll('a, button, .skill-tags li, .project-row');
    interactiveEls.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorDot.style.width = '34px';
        cursorDot.style.height = '34px';
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.style.width = '7px';
        cursorDot.style.height = '7px';
      });
    });
  }

  /* ---------- Modal Logic ---------- */
  const openModalBtn = document.getElementById('openInternshipModal');
  const modal = document.getElementById('internshipModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');

  if (openModalBtn && modal && modalOverlay && modalClose) {
    const openModal = () => {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    openModalBtn.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    if (typeof supportsHover !== 'undefined' && supportsHover && typeof cursorDot !== 'undefined' && cursorDot) {
      [openModalBtn, modalClose].forEach((el) => {
        el.addEventListener('mouseenter', () => {
          cursorDot.style.width = '34px';
          cursorDot.style.height = '34px';
        });
        el.addEventListener('mouseleave', () => {
          cursorDot.style.width = '7px';
          cursorDot.style.height = '7px';
        });
      });
    }
  }

  /* ---------- Cert Modal Logic ---------- */
  const certModal = document.getElementById('certModal');
  const certModalOverlay = document.getElementById('certModalOverlay');
  const certModalClose = document.getElementById('certModalClose');
  const certModalTitle = document.getElementById('certModalTitle');
  const certModalDesc = document.getElementById('certModalDesc');
  const certModalImages = document.getElementById('certModalImages');
  const openCertBtns = document.querySelectorAll('.open-cert-modal');

  if (certModal && certModalOverlay && certModalClose) {
    const closeCertModal = () => {
      certModal.classList.remove('open');
      document.body.style.overflow = '';
    };

    certModalClose.addEventListener('click', closeCertModal);
    certModalOverlay.addEventListener('click', closeCertModal);

    openCertBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        certModalTitle.textContent = btn.getAttribute('data-title');
        certModalDesc.textContent = btn.getAttribute('data-desc');
        
        certModalImages.innerHTML = '';
        const images = btn.getAttribute('data-images');
        if (images) {
          images.split(',').forEach(src => {
            if (src.trim()) {
              const img = document.createElement('img');
              img.src = src.trim();
              img.className = 'modal-cert';
              img.alt = 'Certificate';
              certModalImages.appendChild(img);
            }
          });
        }
        
        certModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });

      if (typeof supportsHover !== 'undefined' && supportsHover && typeof cursorDot !== 'undefined' && cursorDot) {
        btn.addEventListener('mouseenter', () => {
          cursorDot.style.width = '34px';
          cursorDot.style.height = '34px';
        });
        btn.addEventListener('mouseleave', () => {
          cursorDot.style.width = '7px';
          cursorDot.style.height = '7px';
        });
      }
    });

    if (typeof supportsHover !== 'undefined' && supportsHover && typeof cursorDot !== 'undefined' && cursorDot) {
      certModalClose.addEventListener('mouseenter', () => {
        cursorDot.style.width = '34px';
        cursorDot.style.height = '34px';
      });
      certModalClose.addEventListener('mouseleave', () => {
        cursorDot.style.width = '7px';
        cursorDot.style.height = '7px';
      });
    }
  }

  /* ---------- CV download fallback notice ---------- */
  const downloadLinks = document.querySelectorAll('a[download]');
  downloadLinks.forEach((link) => {
    link.addEventListener('click', async (e) => {
      try {
        const res = await fetch(link.getAttribute('href'), { method: 'HEAD' });
        if (!res.ok) throw new Error('missing');
      } catch (err) {
        e.preventDefault();
        alert('The CV file has not been added yet. Place your PDF at assets/Harinandan_A_Resume.pdf to enable this download.');
      }
    });
  });
}

// Start loading
loadComponents();
