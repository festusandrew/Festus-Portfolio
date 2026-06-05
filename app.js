document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. CUSTOM CURSOR TRACKER (Desktop Only)
  // ==========================================
  const cursor = document.getElementById('custom-cursor');
  const cursorGlow = document.getElementById('custom-cursor-glow');
  
  // Detect touch capability
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  if (!isTouchDevice && cursor && cursorGlow) {
    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;
    
    // Set initial position out of view
    cursor.style.opacity = '0';
    cursorGlow.style.opacity = '0';
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Make cursor visible when mouse moves
      if (cursor.style.opacity === '0') {
        cursor.style.opacity = '1';
        cursorGlow.style.opacity = '1';
      }
      
      // Move central dot instantly
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });
    
    // Smooth trailing effect for the glow circle (lerp animation)
    const animateGlow = () => {
      // Linear interpolation: current position + (target position - current position) * damping factor
      glowX += (mouseX - glowX) * 0.15;
      glowY += (mouseY - glowY) * 0.15;
      
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
      
      requestAnimationFrame(animateGlow);
    };
    animateGlow();
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorGlow.style.opacity = '0';
    });
    
    // Hover States
    const interactiveElements = document.querySelectorAll(
      'a, button, select, input, textarea, .project-card, .blog-card, .tool-card, .brand-avatar'
    );
    
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
        cursorGlow.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovering');
        cursorGlow.classList.remove('hovering');
      });
    });
  } else {
    // Hide cursors on mobile/touch screens
    if (cursor) cursor.style.display = 'none';
    if (cursorGlow) cursorGlow.style.display = 'none';
  }

  // ==========================================
  // 2. MOBILE NAVIGATION OVERLAY MENU
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  
  const toggleMobileMenu = () => {
    mobileToggle.classList.toggle('open');
    mobileMenuOverlay.classList.toggle('open');
    document.body.classList.toggle('no-scroll'); // Optional: prevent scrolling when menu is open
  };
  
  if (mobileToggle && mobileMenuOverlay) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking any overlay link
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenuOverlay.classList.contains('open')) {
          toggleMobileMenu();
        }
      });
    });
  }

  // ==========================================
  // 3. SCROLL SPY & ACTIVE NAV LINK
  // ==========================================
  const sections = document.querySelectorAll('main, section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const scrollSpy = () => {
    let currentActive = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      // Target active section slightly before it reaches the center viewport
      if (window.scrollY >= sectionTop - 150) {
        currentActive = section.getAttribute('id') || '';
      }
    });
    
    // Fallback if at top of page
    if (window.scrollY < 100) {
      currentActive = 'home';
    }
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentActive}`) {
        link.classList.add('active');
      }
    });
  };
  
  window.addEventListener('scroll', scrollSpy);
  scrollSpy(); // Initial call

  // ==========================================
  // 4. CONTACT FORM ACTION & SUCCESS ALERT
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const successAlert = document.getElementById('form-success-alert');
  
  if (contactForm && successAlert) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('btn-submit');
      const originalText = submitBtn.textContent;
      
      // Show submitting state
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // Simulate AJAX request
      setTimeout(() => {
        // Fade out form and display success card
        contactForm.style.opacity = '0';
        setTimeout(() => {
          contactForm.style.display = 'none';
          successAlert.classList.add('show');
        }, 300);
      }, 1500);
    });
  }

  // ==========================================
  // 5. THEME TOGGLE (Light / Dark Mode)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Check for saved theme preference or default to dark
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-mode');
  }
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      // Add temporary class for smooth transitions
      document.body.classList.add('theme-transition');
      
      const isLight = document.documentElement.classList.toggle('light-mode');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      
      // Clean up transition class
      setTimeout(() => {
        document.body.classList.remove('theme-transition');
      }, 350);
    });
  }

  // ==========================================
  // 6. PROJECTS PAGINATION
  // ==========================================
  const projectsPerPage = 3;
  const projectCards = Array.from(document.querySelectorAll('.projects-grid .project-card'));
  const prevBtn = document.getElementById('project-prev');
  const nextBtn = document.getElementById('project-next');
  const pageNumbersContainer = document.getElementById('project-page-numbers');
  
  let currentProjectPage = 1;
  const totalProjectPages = Math.ceil(projectCards.length / projectsPerPage);
  
  const showProjectPage = (page) => {
    currentProjectPage = page;
    
    // Show/hide cards
    const startIdx = (page - 1) * projectsPerPage;
    const endIdx = startIdx + projectsPerPage;
    
    projectCards.forEach((card, idx) => {
      if (idx >= startIdx && idx < endIdx) {
        card.style.display = 'flex';
        // Trigger entry transition
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease, box-shadow 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      } else {
        card.style.display = 'none';
      }
    });
    
    // Update button states
    if (prevBtn) prevBtn.disabled = page === 1;
    if (nextBtn) nextBtn.disabled = page === totalProjectPages;
    
    // Update active page numbers
    if (pageNumbersContainer) {
      const pageButtons = pageNumbersContainer.querySelectorAll('.page-num-btn');
      pageButtons.forEach((btn, idx) => {
        if (idx + 1 === page) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  };
  
  // Render page numbers
  if (pageNumbersContainer && totalProjectPages > 1) {
    pageNumbersContainer.innerHTML = '';
    for (let i = 1; i <= totalProjectPages; i++) {
      const btn = document.createElement('button');
      btn.className = `page-num-btn ${i === 1 ? 'active' : ''}`;
      btn.textContent = i;
      btn.setAttribute('aria-label', `Go to page ${i}`);
      btn.addEventListener('click', () => {
        showProjectPage(i);
        const sec = document.getElementById('projects');
        if (sec) {
          // Adjust scroll offset slightly above the projects title
          const offsetTop = sec.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      });
      pageNumbersContainer.appendChild(btn);
    }
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentProjectPage > 1) {
        showProjectPage(currentProjectPage - 1);
        const sec = document.getElementById('projects');
        if (sec) {
          const offsetTop = sec.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentProjectPage < totalProjectPages) {
        showProjectPage(currentProjectPage + 1);
        const sec = document.getElementById('projects');
        if (sec) {
          const offsetTop = sec.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      }
    });
  }
  
  // Initial render
  if (projectCards.length > 0) {
    showProjectPage(1);
  }

});
