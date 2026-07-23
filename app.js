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
      
      const formData = {
        name: document.getElementById('form-name').value,
        email: document.getElementById('form-email').value,
        subject: document.getElementById('form-subject').value,
        message: document.getElementById('form-message').value
      };
      
      // Post to FormSubmit AJAX endpoint
      fetch('https://formsubmit.co/ajax/festusandrew23@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Fade out form and display success card
        contactForm.style.opacity = '0';
        setTimeout(() => {
          contactForm.style.display = 'none';
          successAlert.classList.add('show');
        }, 300);
      })
      .catch(error => {
        // Fallback or alert on error
        submitBtn.textContent = 'Error! Try Again';
        submitBtn.disabled = false;
        setTimeout(() => {
          submitBtn.textContent = originalText;
        }, 3000);
      });
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
      problem: 'Visually impaired users face severe accessibility barriers when interacting with modern web applications that rely heavily on complex visual cues, unlabelled imagery, dynamic visual charts, and icon-only navigation. Standard screen readers frequently fail to interpret visual context, leading to incomplete information access, frustration, and digital exclusion.',
      role: 'Lead Frontend Developer & UI/UX Designer — Architected the accessible web application layout, defined screen reader interaction patterns, conducted accessibility research with target users, and integrated computer vision APIs.',
      solution: 'Engineered an accessible, high-performance web platform powered by advanced computer vision AI that analyzes visual elements on-the-fly and generates context-aware audio and descriptive text representations. Built with flexible verbosity settings, high-contrast visual modes, screen reader ARIA live region support, and full custom keyboard navigation shortcuts.',
      process: [
        'Audited top digital news portals and SaaS dashboards using NVDA and VoiceOver screen readers to document critical visual information gaps.',
        'Engineered dynamic TypeScript API wrapper components capable of streaming live image frame analysis under 2 seconds without UI thread blocking.',
        'Designed an accessible design system compliant with WCAG 2.1 AAA guidelines, incorporating custom high-contrast color palettes, elevated focus rings, and scalable text typography.',
        'Executed iterative user testing sessions with visually impaired beta testers to refine gesture shortcuts, prompt verbosity levels, and auditory feedback cues.',
        'Implemented comprehensive ARIA landmarks, alt fallback generators, and live region announcements to maintain continuous screen reader feedback.'
      ],
      processImages: ['images/eiieni.png', 'images/eiieni-process.png'],
      outcome: 'Delivered an MVP with 94% visual recognition accuracy and sub-2-second response latency. Beta testers reported a 65% improvement in navigating visual web content independently, establishing a strong foundation for ongoing mobile and browser extension expansions.',
      projectUrl: 'https://github.com/festusandrew/Eiieni',
      btnText: 'View on GitHub'
    },
    'HR Advisory': {
      title: 'HR Advisory',
      badge: 'TypeScript',
      date: 'May 2026',
      heroImg: 'images/hr-advisory.png',
      problem: 'Growing HR departments struggled with chaotic client support operations managed across disparate email threads, chat apps, and manual spreadsheets. The lack of central tracking resulted in lost support tickets, unmonitored SLA breaches, ambiguous task ownership, and zero visibility into operational performance metrics.',
      role: 'Full-Stack Developer — Designed normalized relational database schemas, built full-stack TypeScript Kanban workflows, implemented state machine ticket lifecycles, and built real-time SLA notification systems.',
      solution: 'Developed an enterprise HR advisory platform featuring Kanban-style drag-and-drop workflow boards, automated SLA milestone timers, priority-based request queueing, client portal ticket submission forms, and interactive analytics dashboards summarizing resolution metrics.',
      process: [
        'Mapped complex HR advisory lifecycles across multiple service tiers (Intake → Verification → In Review → Escalated → Resolved → Closed).',
        'Built a robust TypeScript architecture enforcing strict type contracts between backend REST API endpoints and frontend state containers.',
        'Designed an information-dense, low-clutter admin dashboard prioritizing actionable ticket data, SLA countdown visual indicators, and quick-filter controls.',
        'Integrated automated email and webhook notifications to keep both internal HR specialists and external clients synchronized on ticket progress.',
        'Developed interactive reporting charts visualizing ticket resolution velocity, agent workload distribution, and recurring inquiry categories.'
      ],
      processImages: ['images/hr-advisory.png', 'images/hr-advisory-process.png'],
      outcome: 'Successfully deployed a scalable platform that reduced average ticket resolution time by 40%, eliminated lost tickets entirely, and boosted client satisfaction scores by providing real-time visibility into support request progress.',
      projectUrl: 'https://github.com/festusandrew/HR-Advisory',
      btnText: 'View on GitHub'
    },
    'Care Management': {
      title: 'Care Management',
      badge: 'TypeScript',
      date: 'May 2026',
      heroImg: 'images/care-management-mockup.png',
      problem: 'Healthcare organizations and care facilities faced significant operational overhead due to fragmented patient data records, manual shift scheduling, and disconnected communication between nurses, doctors, and facility administrators. Paper-based systems increased the risk of medical errors and delayed critical patient updates.',
      role: 'Frontend Developer & System Architect — Led component architecture design, engineered health metrics visualization charts, established role-based access control flows, and ensured HIPAA-aligned UI data masking.',
      solution: 'Built a unified digital care management application providing centralized patient health records, real-time vital sign metric visualizers, interactive appointment calendars, automated shift handoff logs, and role-restricted dashboard views.',
      process: [
        'Researched clinical workflow patterns and HIPAA data privacy regulations to structure secure patient record interfaces.',
        'Developed reusable, modular TypeScript frontend components for interactive vitals charts, medication schedules, and patient intake forms.',
        'Implemented progressive disclosure UX patterns to prevent cognitive overload during fast-paced clinical shift handoffs.',
        'Designed role-based view controls customized for physicians, nursing staff, and administrative managers.',
        'Optimized data rendering performance to display real-time telemetry and vital sign streams across desktop and tablet interfaces.'
      ],
      processImages: ['images/care-management-mockup.png', 'images/care-management.png', 'images/care-management-process.png'],
      outcome: 'Centralized patient health tracking into a single digital interface, streamlining care team handoffs, accelerating patient intake processing, and enhancing care coordination accuracy across clinical teams.',
      projectUrl: 'https://care-management-eight.vercel.app/',
      btnText: 'Launch Live Application'
    },
    'Locum': {
      title: 'Locum',
      badge: 'TypeScript',
      date: 'May 2026',
      heroImg: 'images/locum-mockup.png',
      problem: 'Hospitals and medical clinics faced frequent acute staffing shortages, relying on slow, expensive traditional recruitment agencies to fill urgent shift vacancies. Meanwhile, freelance healthcare professionals lacked a transparent tool to quickly browse, compare pay rates, and book temporary shifts.',
      role: 'Full-Stack Developer — Built the shift marketplace search engine, applicant tracking pipelines, instant booking state machine, and interactive calendar synchronization logic.',
      solution: 'Designed an on-demand healthcare shift marketplace connecting medical facilities directly with qualified locum professionals. Features include multi-parameter shift filtering (by location, speciality, hourly rate, and shift duration), instant application submission, conflict-free calendar booking, and status updates.',
      process: [
        'Analyzed high-volume gig economy and job discovery platforms to adopt proven friction-reducing marketplace UX patterns for healthcare.',
        'Crafted a mobile-first responsive layout tailored for healthcare workers browsing shift openings on mobile devices during shift breaks.',
        'Engineered multi-criteria search filters with instant reactive updates using TypeScript state management.',
        'Implemented automated schedule collision algorithms to prevent double-booking across overlapping facility shifts.',
        'Designed facility management portals for post-creation, application reviews, and instant shift assignments.'
      ],
      processImages: ['images/locum-mockup.png', 'images/locum.png', 'images/locum-process.png'],
      outcome: 'Dramatically compressed shift fill turnaround times from 3-5 days down to under 2 hours, offering temp staff flexible work opportunities while saving healthcare facilities up to 35% in recruiter markup costs.',
      projectUrl: 'https://locum-beige.vercel.app/',
      btnText: 'Launch Live Application'
    },
    'Endyy': {
      title: 'Endyy',
      badge: 'TypeScript',
      date: 'January 2026 — Present',
      heroImg: 'images/endyy.png',
      problem: 'A boutique bakery relying strictly on manual Instagram direct messages lost high-value custom cake orders due to chaotic order details, unclear pricing estimations, missing design specifications, and inefficient customer communication.',
      role: 'Lead Developer & Designer — Designed brand identity and visual theme, built high-resolution product showcases, and engineered the multi-step custom cake ordering engine.',
      solution: 'Created an e-commerce platform custom-tailored for custom bakeries, featuring high-resolution product galleries, interactive cake builders with dynamic pricing calculations, multi-step specification builders, and an administrative order management dashboard.',
      process: [
        'Conducted discovery workshops with the bakery owner to define cake sizing matrices, flavor combinations, dietary preferences, and add-on pricing rules.',
        'Established a warm, luxurious visual brand identity featuring rich gold and chocolate tones paired with high-definition food photography showcase blocks.',
        'Engineered a seamless multi-step order wizard (Size → Tier → Flavor → Custom Theme → Pickup Date) that calculates estimates in real-time.',
        'Built an admin dashboard allowing bakery managers to review custom specifications, approve orders, and update fulfillment milestones.',
        'Ensured mobile responsiveness for customers submitting custom cake orders on smartphones.'
      ],
      processImages: ['images/endyy.png'],
      outcome: 'Elevated the bakery\'s digital brand presence, reduced customer inquiry back-and-forth by 60%, and increased completed custom order conversions by giving customers clear self-serve customization tools.',
      projectUrl: 'https://github.com/festusandrew/Endyy',
      btnText: 'View on GitHub'
    },
    'Aika Bot': {
      title: 'Aika Bot',
      badge: 'JavaScript',
      date: 'May 2026',
      heroImg: 'images/aika-bot.png',
      problem: 'AI development teams spending excessive manual hours testing chatbot conversational flows, intent classification accuracy, and fallback responses frequently missed subtle conversational regressions before production releases, compromising AI user trust.',
      role: 'Solo Developer — Architected the test framework, developed conversation script parsers, built multi-turn simulation engines, and designed execution report generators.',
      solution: 'Built an automated test execution bot tailored for conversational AI models that executes multi-turn conversational test scripts, validates AI response accuracy against expected patterns, measures response latency, and outputs structured test reports.',
      process: [
        'Cataloged recurring failure modes in conversational AI agents, including intent drift, loss of context over multi-turn conversations, and entity misclassification.',
        'Engineered a lightweight JavaScript scenario parser supporting pattern matching, regex validations, fuzzy matching, and negative assertion criteria.',
        'Created a CLI runner and HTML report generator to provide visual diffs of expected vs actual AI responses.',
        'Optimized the execution harness for zero external heavy dependencies, allowing instant execution within standard CI/CD deployment pipelines.'
      ],
      processImages: ['images/aika-bot.png'],
      outcome: 'Cut manual conversational QA testing effort by over 75%, enabled continuous automated regression testing before every bot update, and ensured consistent conversational response quality.',
      projectUrl: 'https://github.com/festusandrew/aika-test-bot',
      btnText: 'View on GitHub'
    },
    'Pay4Me App': {
      title: 'Pay4Me App',
      badge: 'Figma',
      date: 'July 2026',
      heroImg: 'https://res.cloudinary.com/dqfmlehav/image/upload/v1783629848/Landing_page_askxi7.png',
      problem: 'International students studying abroad face stressful, expensive, and opaque procedures when paying tuition, SEVIS fees, and university deposits across borders. Traditional bank wires suffer from high FX markups, multi-day delays, and zero real-time payment status tracking.',
      role: 'Lead UI/UX Designer — Conducted user interviews, defined persona journeys, created high-fidelity interactive component libraries, and designed the 3-step payment onboarding experience.',
      solution: 'Designed an intuitive, trust-inspiring web application and landing page layout that simplifies cross-border tuition payments into a streamlined 3-step onboarding flow: app download, identity verification, and fast payment execution with transparent currency conversion rates.',
      process: [
        'Mapped end-to-end user journeys for international students and sponsor parents to identify friction points around fee transparency and payment verification.',
        'Established a vibrant green color palette and modern typography system designed to evoke trust, financial security, and speed.',
        'Structured clear wizard-style step-by-step indicators that guide users seamlessly through complex document uploads and payment selections.',
        'Designed high-fidelity interactive prototypes in Figma, complete with micro-interactions, responsive mobile views, and modal dialogs.',
        'Validated usability through interactive testing sessions to ensure form inputs and FX rate calculators felt immediate and effortless.'
      ],
      processImages: [
        { src: 'https://res.cloudinary.com/dqfmlehav/image/upload/v1783629848/Landing_page_askxi7.png', style: 'object-position: top;' },
        { src: 'https://res.cloudinary.com/dqfmlehav/image/upload/v1783629848/Landing_page_askxi7.png', style: 'object-position: bottom;' }
      ],
      outcome: 'Delivered an executive-level Figma prototype and high-converting landing page structure that successfully demonstrated a simplified 3-step payment flow, reducing payment completion time from days to minutes.',
      projectUrl: 'https://www.figma.com/proto/Wpm73HjQ0kdWdlCWB8qrMK/pay4me.app?node-id=65-435&t=EtYMFMbH98YBnXIC-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1',
      btnText: 'View Figma Prototype'
    }
  };

  const overlay = document.getElementById('case-study-overlay');
  const modal = document.getElementById('case-study-modal');
  const closeBtn = document.getElementById('case-study-close');

  const openCaseStudy = (projectName) => {
    const data = caseStudyData[projectName];
    if (!data) return;

    // Populate modal
    const heroImgEl = document.getElementById('cs-hero-img');
    heroImgEl.src = data.heroImg;
    heroImgEl.alt = data.title;
    if (projectName === 'Pay4Me App') {
      heroImgEl.style.objectPosition = 'top';
    } else {
      heroImgEl.style.objectPosition = '';
    }
    document.getElementById('cs-badge').textContent = data.badge;
    document.getElementById('cs-title').textContent = data.title;
    document.getElementById('cs-date').textContent = data.date;
    document.getElementById('cs-problem').textContent = data.problem;
    document.getElementById('cs-role').textContent = data.role;
    document.getElementById('cs-solution').textContent = data.solution;
    // Populate process bullet points
    const processContainer = document.getElementById('cs-process');
    if (Array.isArray(data.process)) {
      const ul = document.createElement('ul');
      ul.className = 'cs-process-list';
      data.process.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
      processContainer.innerHTML = '';
      processContainer.appendChild(ul);
    } else {
      processContainer.textContent = data.process;
    }
    document.getElementById('cs-outcome').textContent = data.outcome;
    
    // Dynamically set up CTA action link
    const actionBtn = document.getElementById('cs-action-link');
    actionBtn.href = data.projectUrl;
    const isGitHub = data.projectUrl.includes('github.com');
    const isFigma = data.projectUrl.includes('figma.com');
    const iconSvg = isGitHub 
      ? `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
         </svg>`
      : isFigma
        ? `<svg viewBox="0 0 384 512" fill="currentColor" width="18" height="18" style="vertical-align: middle; margin-right: 4px;">
            <path d="M128 0C75 0 32 43 32 96c0 40.5 25.2 75.1 60.7 89.3C60.4 197.8 32 231.5 32 272c0 40.5 25.2 75.1 60.7 89.3C60.4 373.8 32 407.5 32 448c0 53 43 96 96 96c53 0 96-43 96-96l0-176 64 0c53 0 96-43 96-96c0-40.5-25.2-75.1-60.7-89.3C323.6 138.2 352 104.5 352 64c0-53-43-96-96-96L128 0zM128 96c0-17.7 14.3-32 32-32l32 0 0 64-32 0c-17.7 0-32-14.3-32-32zm0 176c0-17.7 14.3-32 32-32l32 0 0 64-32 0c-17.7 0-32-14.3-32-32zM224 448c0 17.7-14.3 32-32 32c-17.7 0-32-14.3-32-32c0-17.7 14.3-32 32-32l32 0 0 32zm0-240l0 64-32 0c-17.7 0-32-14.3-32-32c0-17.7 14.3-32 32-32l32 0zM256 64c17.7 0 32 14.3 32 32c0 17.7-14.3 32-32 32l-32 0 0-64 32 0z"/>
           </svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
           </svg>`;
    actionBtn.innerHTML = `${iconSvg} <span>${data.btnText}</span>`;

    // Populate process images
    const gallery = document.getElementById('cs-process-images');
    gallery.innerHTML = '';
    if (data.processImages && data.processImages.length > 0) {
      data.processImages.forEach(item => {
        const img = document.createElement('img');
        const src = typeof item === 'object' ? item.src : item;
        const styleText = typeof item === 'object' ? item.style : '';
        
        img.src = src;
        img.alt = data.title + ' design process';
        img.loading = 'lazy';
        if (styleText) {
          img.style.cssText = styleText;
        }
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
    if (e.key === 'Escape') {
      if (lightboxOverlay && lightboxOverlay.classList.contains('active')) {
        closeLightbox();
      } else if (overlay && overlay.classList.contains('active')) {
        closeCaseStudy();
      }
    }
  });

  // ==========================================
  // 8. IMAGE LIGHTBOX / ZOOM FUNCTIONALITY
  // ==========================================
  const lightboxOverlay = document.getElementById('image-lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCloseBtn = document.getElementById('lightbox-close');
  const lightboxCaption = document.getElementById('lightbox-caption');

  const openLightbox = (src, altText = '') => {
    if (!lightboxOverlay || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = altText;
    if (lightboxCaption) {
      lightboxCaption.textContent = altText;
    }
    lightboxOverlay.classList.add('active');
  };

  const closeLightbox = () => {
    if (!lightboxOverlay) return;
    lightboxOverlay.classList.remove('active');
  };

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay || e.target === lightboxImg || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });
  }

  // Delegate click on hero image or gallery images inside case study modal
  const heroImgEl = document.getElementById('cs-hero-img');
  if (heroImgEl) {
    heroImgEl.style.cursor = 'zoom-in';
    heroImgEl.title = 'Click to zoom in';
    heroImgEl.addEventListener('click', () => {
      if (heroImgEl.src) {
        const titleText = document.getElementById('cs-title') ? document.getElementById('cs-title').textContent : '';
        openLightbox(heroImgEl.src, titleText);
      }
    });
  }

  const processGallery = document.getElementById('cs-process-images');
  if (processGallery) {
    processGallery.addEventListener('click', (e) => {
      if (e.target && e.target.tagName === 'IMG') {
        openLightbox(e.target.src, e.target.alt || 'Design Process Visual');
      }
    });
  }

});
