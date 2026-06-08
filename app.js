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
  const mobileCloseBtn = document.getElementById('mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileMenu = () => {
    mobileToggle.classList.add('open');
    mobileMenuOverlay.classList.add('open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileToggle.setAttribute('aria-label', 'Close Menu');
    mobileMenuOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    // Move focus into menu for accessibility
    if (mobileCloseBtn) mobileCloseBtn.focus();
  };

  const closeMobileMenu = () => {
    mobileToggle.classList.remove('open');
    mobileMenuOverlay.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-label', 'Open Menu');
    mobileMenuOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    mobileToggle.focus();
  };

  const syncActiveMobileLink = () => {
    const currentHash = window.location.hash || '#home';
    mobileLinks.forEach(link => {
      if (link.getAttribute('href') === currentHash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  if (mobileToggle && mobileMenuOverlay) {
    mobileToggle.addEventListener('click', () => {
      if (mobileMenuOverlay.classList.contains('open')) {
        closeMobileMenu();
      } else {
        syncActiveMobileLink();
        openMobileMenu();
      }
    });

    // Dedicated close button inside overlay
    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', closeMobileMenu);
    }

    // Close when clicking any mobile nav link
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenuOverlay.classList.contains('open')) {
          closeMobileMenu();
        }
      });
    });

    // Close when clicking the dark overlay backdrop
    mobileMenuOverlay.addEventListener('click', (e) => {
      if (e.target === mobileMenuOverlay) {
        closeMobileMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('open')) {
        closeMobileMenu();
      }
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
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  
  // Check for saved theme preference or default to dark
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-mode');
  }
  
  const applyThemeToggle = () => {
    // Add temporary class for smooth transitions
    document.body.classList.add('theme-transition');
    
    const isLight = document.documentElement.classList.toggle('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    
    // Clean up transition class
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 350);
  };
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', applyThemeToggle);
  }
  
  // Mobile theme toggle (inside overlay) stays in sync
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', applyThemeToggle);
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

  // ==========================================
  // 7. PROJECT CASE STUDY MODAL
  // ==========================================
  const caseStudyData = {
    'Eiieni': {
      title: 'Eiieni',
      badge: 'TypeScript',
      date: 'February 2026 — Present',
      heroImg: 'images/eiieni.png',
      problem: 'Visually impaired users struggle to interact with digital content that relies heavily on visual cues. Existing accessibility tools often feel bolted on and fail to provide a seamless, integrated experience that truly empowers users to navigate visual interfaces independently.',
      role: 'Lead Frontend Developer & UI/UX Designer — Responsible for architecting the frontend application, designing the user interface with accessibility-first principles, and integrating AI-powered visual description APIs into the product workflow.',
      solution: 'Built a TypeScript-based web application that uses computer vision APIs to analyze and describe visual content in real-time. The app features a clean, high-contrast interface with screen reader optimizations, keyboard navigation support, and customizable description verbosity levels.',
      process: 'I started by conducting accessibility audits of existing tools to identify pain points. Then I mapped out user flows for different impairment levels, created low-fidelity wireframes focused on simplicity, and iterated through 3 major design revisions based on user testing feedback. The color palette was chosen for maximum contrast ratios exceeding WCAG AAA standards.',
      processImages: ['images/eiieni.png', 'images/eiieni-process.png'],
      outcome: 'Delivered a fully functional MVP that processes images in under 2 seconds with 94% description accuracy. The application has received positive feedback from beta testers in the accessibility community and is actively being developed with planned mobile support.',
      githubUrl: 'https://github.com/festusandrew/Eiieni'
    },
    'HR Advisory': {
      title: 'HR Advisory',
      badge: 'TypeScript',
      date: 'May 2026',
      heroImg: 'images/hr-advisory.png',
      problem: 'HR teams were overwhelmed managing client inquiries through email and spreadsheets. There was no centralized system to track ticket status, assign tasks, or measure response times — leading to missed deadlines and poor client satisfaction.',
      role: 'Full-Stack Developer — Designed and built the entire application from database schema to frontend interface. Implemented the ticket lifecycle management system, real-time notifications, and the analytics dashboard.',
      solution: 'Developed a full-stack TypeScript application with a kanban-style task board where clients submit tickets and HR professionals manage them through configurable workflow stages. Features include real-time status updates, priority tagging, SLA tracking, and automated email notifications.',
      process: 'I began by interviewing HR professionals to understand their existing workflow bottlenecks. I mapped the ticket lifecycle (New → In Progress → Resolved → Closed) and designed the database schema around it. The frontend was built with a focus on information density — showing the right data at the right time without overwhelming the user.',
      processImages: ['images/hr-advisory.png', 'images/hr-advisory-process.png'],
      outcome: 'Successfully deployed to production on Vercel. The platform reduced average ticket resolution time by streamlining communication between clients and HR teams. Currently live at hr-advisory.vercel.app.',
      githubUrl: 'https://github.com/festusandrew/HR-Advisory'
    },
    'Care Management': {
      title: 'Care Management',
      badge: 'TypeScript',
      date: 'May 2026',
      heroImg: 'images/care-management.png',
      problem: 'Healthcare facilities needed a modern, digital-first approach to managing patient records, scheduling appointments, and tracking health metrics. Legacy paper-based systems were error-prone and made it difficult to share information across care teams.',
      role: 'Frontend Developer & System Architect — Led the frontend development, designed the component architecture, and built the patient dashboard with real-time health metrics visualization.',
      solution: 'Built a comprehensive care management platform using TypeScript with a modular component architecture. The system features patient record management, appointment scheduling, health metrics dashboards with visual charts, and role-based access controls for different care team members.',
      process: 'I researched healthcare UX best practices and HIPAA compliance requirements. The design process focused on reducing cognitive load for busy healthcare workers — using color-coded status indicators, progressive disclosure patterns, and a sidebar navigation that adapts based on user role. Each component was designed to be reusable across different care facility configurations.',
      processImages: ['images/care-management.png'],
      outcome: 'Delivered a functional healthcare management interface that centralizes patient data and improves care team coordination. The modular architecture allows easy customization for different facility types and regulatory requirements.',
      githubUrl: 'https://github.com/festusandrew/Care-Management'
    },
    'Locum': {
      title: 'Locum',
      badge: 'TypeScript',
      date: 'May 2026',
      heroImg: 'images/locum.png',
      problem: 'Healthcare professionals looking for temporary shift work (locum positions) had no efficient platform to discover, filter, and apply for available shifts. Facilities also struggled to fill last-minute openings quickly.',
      role: 'Full-Stack Developer — Built the shift listing system, application workflow, calendar integration, and the matching algorithm that connects professionals with relevant openings based on speciality and location.',
      solution: 'Created a shift marketplace platform where healthcare facilities post available shifts and professionals can browse, filter by speciality/location/time, and apply with a single click. The system includes a calendar view for scheduling, automated conflict detection, and application status tracking.',
      process: 'I started by analyzing job marketplace UX patterns from platforms like Indeed and LinkedIn, then adapted them for the healthcare context where speed of matching is critical. The UI was designed for mobile-first usage since many locum workers browse shifts on their phones between assignments. Filter controls were prioritized above the fold for quick discovery.',
      processImages: ['images/locum.png'],
      outcome: 'Built a complete shift booking MVP that streamlines the connection between healthcare facilities and temporary professionals. The platform reduces the time-to-fill for urgent shifts and gives professionals a centralized hub for managing their locum work.',
      githubUrl: 'https://github.com/festusandrew/Locum'
    },
    'Endyy': {
      title: 'Endyy',
      badge: 'TypeScript',
      date: 'January 2026 — Present',
      heroImg: 'images/endyy.png',
      problem: 'A local bakery business needed an online presence to showcase their products, accept custom cake orders, and manage their growing customer base. Their existing social media presence alone was insufficient for handling order details and customization requests.',
      role: 'Lead Developer & Designer — Designed the brand identity for the web platform, built the product showcase, and implemented the custom order form with detailed specification options for cake customization.',
      solution: 'Developed a visually rich e-commerce web application tailored for a bakery business. Features include a product gallery with high-quality imagery, a multi-step custom order form, pricing calculator, and an admin dashboard for order management. The design emphasizes warm, appetizing aesthetics with gold and brown tones.',
      process: 'I worked closely with the business owner to understand their product categories, pricing structure, and most common customization requests. The design process started with mood boards inspired by premium bakery brands, then moved into high-fidelity mockups that emphasized food photography. The order form was designed to progressively collect details (size → flavor → design → delivery) to avoid overwhelming customers.',
      processImages: ['images/endyy.png'],
      outcome: 'Launched a beautiful, functional bakery e-commerce platform that elevated the business\'s online presence. The custom order form significantly reduced back-and-forth communication about order specifications and helped streamline the fulfillment process.',
      githubUrl: 'https://github.com/festusandrew/Endyy'
    },
    'Aika Bot': {
      title: 'Aika Bot',
      badge: 'JavaScript',
      date: 'May 2026',
      heroImg: 'images/aika-bot.png',
      problem: 'Manual testing of conversational AI responses was time-consuming and inconsistent. There was a need for an automated testing bot that could simulate user interactions, validate responses, and report test results in a structured format.',
      role: 'Solo Developer — Designed the bot architecture, implemented the test scripting engine, and built the conversation simulation framework with configurable test scenarios.',
      solution: 'Built a JavaScript-based test automation bot that simulates user conversations, validates AI responses against expected outputs, and generates detailed test reports. Features include configurable test scenarios, response pattern matching, and automated regression testing capabilities.',
      process: 'I analyzed common patterns in conversational AI failures — misunderstood intents, incorrect entity extraction, and context loss. The bot was designed around a scenario-based testing framework where each test case defines an input, expected response pattern, and acceptance criteria. The architecture was kept lightweight using vanilla JavaScript to minimize dependencies.',
      processImages: ['images/aika-bot.png'],
      outcome: 'Delivered a functional test automation bot that can run predefined conversation scenarios and report pass/fail results. The tool reduced manual testing effort and improved the consistency of conversational AI quality assurance.',
      githubUrl: 'https://github.com/festusandrew/aika-test-bot'
    }
  };

  const overlay = document.getElementById('case-study-overlay');
  const modal = document.getElementById('case-study-modal');
  const closeBtn = document.getElementById('case-study-close');

  const openCaseStudy = (projectName) => {
    const data = caseStudyData[projectName];
    if (!data) return;

    // Populate modal
    document.getElementById('cs-hero-img').src = data.heroImg;
    document.getElementById('cs-hero-img').alt = data.title;
    document.getElementById('cs-badge').textContent = data.badge;
    document.getElementById('cs-title').textContent = data.title;
    document.getElementById('cs-date').textContent = data.date;
    document.getElementById('cs-problem').textContent = data.problem;
    document.getElementById('cs-role').textContent = data.role;
    document.getElementById('cs-solution').textContent = data.solution;
    document.getElementById('cs-process').textContent = data.process;
    document.getElementById('cs-outcome').textContent = data.outcome;
    document.getElementById('cs-github-link').href = data.githubUrl;

    // Populate process images
    const gallery = document.getElementById('cs-process-images');
    gallery.innerHTML = '';
    if (data.processImages && data.processImages.length > 0) {
      data.processImages.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = data.title + ' design process';
        img.loading = 'lazy';
        gallery.appendChild(img);
      });
    }

    // Show modal
    overlay.classList.add('active');
    document.body.classList.add('modal-open');
    
    // Scroll modal to top
    overlay.scrollTop = 0;
  };

  const closeCaseStudy = () => {
    overlay.classList.remove('active');
    document.body.classList.remove('modal-open');
  };

  // Attach click handlers to project cards
  projectCards.forEach(card => {
    const openCard = () => {
      // Prefer data-project attribute; fall back to .project-title text
      const projectName = card.dataset.project ||
        (card.querySelector('.project-title') ? card.querySelector('.project-title').textContent.trim() : '');
      if (projectName) {
        openCaseStudy(projectName);
      }
    };
    
    card.addEventListener('click', openCard);
    
    // Keyboard accessibility for div[role="button"]
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCard();
      }
    });
  });

  // Close handlers
  if (closeBtn) {
    closeBtn.addEventListener('click', closeCaseStudy);
  }
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeCaseStudy();
      }
    });
  }
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeCaseStudy();
    }
  });

});
