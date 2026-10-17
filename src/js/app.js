import { ParticleVortex } from './swarm.js';
import { AIMLTerminal } from './terminal.js';
import { AIMLPlayground } from './playground.js';

// Audio Synthesizer using Web Audio API (Zero external assets needed)
class SoundFX {
  constructor() {
    this.enabled = false;
    this.audioCtx = null;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.init();
      this.playTone(520, 'sine', 0.1, 0.05);
    }
    return this.enabled;
  }

  playTone(freq, type = 'sine', duration = 0.08, volume = 0.03) {
    if (!this.enabled || !this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  hover() {
    this.playTone(380, 'triangle', 0.04, 0.015);
  }

  click() {
    this.playTone(660, 'sine', 0.09, 0.04);
  }

  success() {
    if (!this.enabled || !this.audioCtx) return;
    this.playTone(440, 'sine', 0.08, 0.03);
    setTimeout(() => this.playTone(880, 'sine', 0.12, 0.03), 90);
  }
}

// Project Details Database for Modals
const PROJECT_DETAILS = {
  finance: {
    title: 'AI-Powered Finance Learning Platform',
    category: 'AI · EdTech · Recommendation Systems',
    status: 'Flagship Project · Fully Functional',
    desc: 'An intelligent educational platform that demystifies financial concepts through personalized learning tracks, automated competency assessment, and an interactive algorithmic recommendation engine.',
    architecture: [
      'Frontend / Interface: Streamlit with custom CSS glassmorphism components & reactive session state.',
      'Core Engine: Python-based curriculum engine with modular chapter progression.',
      'Recommendation Algorithm: Cosine similarity matching between student quiz diagnostic scores and topic difficulty vectors.',
      'Analytics: Real-time progress mastery tracking & predictive concept deficiency alerts.'
    ],
    challenges: [
      'Formulating adaptive question difficulty without requiring thousands of labeled training samples.',
      'Optimizing multi-user session state caching in Streamlit to keep response latency below 120ms.',
      'Structuring financial terminology into a digestible, progressive pedagogical ontology.'
    ],
    metrics: [
      { label: 'Latency', value: '< 110ms' },
      { label: 'Modules', value: '25+ Courses' },
      { label: 'User Satisfaction', value: '92%' }
    ],
    tech: ['Python', 'Scikit-Learn', 'Streamlit', 'Pandas', 'NumPy'],
    github: 'https://github.com/Mithun375-rgb'
  },
  water: {
    title: 'Smart IoT Water Monitoring & Quality System',
    category: 'IoT · Embedded Systems · Predictive Telemetry',
    status: 'Hardware Prototype & Telemetry Dashboard',
    desc: 'An automated IoT telemetry system designed to eliminate water wastage in overhead tanks, actively monitor drinking water quality (pH & TDS metrics), and execute autonomous motor cutoffs.',
    architecture: [
      'Microcontroller: ESP32 / Arduino MCU executing bare-metal C control routines.',
      'Sensing Array: Ultrasonic distance sensor (water level), Analog TDS sensor (purity), pH electrode.',
      'Actuation Logic: Dual-relay safety circuit with hysteresis thresholding to prevent motor chatter.',
      'Telemetry: Serial/MQTT transmission to a Python telemetry dashboard for real-time charting.'
    ],
    challenges: [
      'Mitigating ultrasonic signal noise caused by vapor condensation inside sealed tank chambers.',
      'Designing hardware fail-safes ensuring motor shutdown during sensor disconnect or power anomalies.',
      'Calibrating analog TDS and pH sensor readings against temperature variations.'
    ],
    metrics: [
      { label: 'Water Waste Cut', value: '~38%' },
      { label: 'Sampling Rate', value: '2.5 Hz' },
      { label: 'Fail-Safe Latency', value: '< 200ms' }
    ],
    tech: ['Embedded C', 'IoT Sensors', 'Arduino/ESP32', 'Python Telemetry', 'Signal Filtering'],
    github: 'https://github.com/Mithun375-rgb'
  },
  stock: {
    title: 'Quantitative Stock Trend & Volatility Engine',
    category: 'Data Science · Quantitative Finance · Interactive Viz',
    status: 'Active Analytics Pipeline',
    desc: 'A quantitative analytics dashboard providing technical traders with live historical data feeds, volatility indicators, Bollinger bands, momentum oscillators, and multi-asset correlation matrices.',
    architecture: [
      'Data Ingestion: yFinance REST API fetching 10-year historical daily open/high/low/close/volume data.',
      'Mathematical Modeling: Exponential moving averages (EMA 20/50/200), Relative Strength Index (RSI 14), and Bollinger Band width computations via NumPy & Pandas.',
      'Visual Presentation: High-performance Plotly interactive charts with crosshairs, zoomable timelines, and volume subplots.',
      'Risk Metrics: Annualized Sharpe ratio, Maximum Drawdown (MDD), and beta calculation vs benchmark index.'
    ],
    challenges: [
      'Handling asynchronous API rate-limiting and market holiday data gaps.',
      'Vectorizing technical indicator computations in NumPy for zero-lag client-side recalculations.',
      'Ensuring responsive rendering on Plotly charts handling 5,000+ data points simultaneously.'
    ],
    metrics: [
      { label: 'Data Points Processed', value: '50k+ ticks' },
      { label: 'Render Latency', value: '< 300ms' },
      { label: 'Indicators', value: '8 Formulations' }
    ],
    tech: ['Python', 'Pandas', 'Plotly', 'yFinance', 'NumPy', 'Financial Modeling'],
    github: 'https://github.com/Mithun375-rgb'
  },
  neural: {
    title: 'Neural Vision & Diagnostic Classification Suite',
    category: 'Deep Learning · Computer Vision · PyTorch',
    status: 'Research & Model Development',
    desc: 'A convolutional neural network pipeline engineered for biomedical image classification and anomaly detection, featuring data augmentation pipelines and Grad-CAM interpretability heatmaps.',
    architecture: [
      'Architecture: Transfer learning with ResNet / EfficientNet backbone fine-tuned on target datasets.',
      'Data Augmentation: Albumentations pipeline including elastic transforms, affine rotations, and color jitter.',
      'Interpretability: Gradient-weighted Class Activation Mapping (Grad-CAM) highlighting diagnostic regions.',
      'Evaluation: Multi-class Confusion Matrix, Precision-Recall curves, and ROC-AUC benchmarking.'
    ],
    challenges: [
      'Countering severe class imbalance in medical imagery using focal loss and balanced sampling.',
      'Preventing overfitting on limited dataset sizes through aggressive regularization and dropout.',
      'Optimizing inference throughput on CPU deployments for portable accessibility.'
    ],
    metrics: [
      { label: 'Validation ROC-AUC', value: '0.942' },
      { label: 'Inference Speed', value: '45ms / img' },
      { label: 'Interpretability', value: 'Grad-CAM' }
    ],
    tech: ['Python', 'PyTorch / TensorFlow', 'OpenCV', 'Albumentations', 'Matplotlib', 'Scikit-Learn'],
    github: 'https://github.com/Mithun375-rgb'
  }
};

// Technical Blog Article Database
const ARTICLES = {
  plotly: {
    title: 'Why Plotly Beats Matplotlib for Production Data Storytelling',
    meta: 'Data Visualization · 5 Min Read · Published',
    content: `
      <h3>The Paradigm Shift in Modern Data Communication</h3>
      <p>When starting in data science, everyone begins with <code>matplotlib.pyplot</code>. It's the standard, dependable workhorse. But the moment you transition from static Jupyter notebook exploration to communicating findings with stakeholders or users, static charts reveal their core limitation: <strong>the user cannot interrogate the data.</strong></p>
      
      <h4>The Problem with Static PNGs</h4>
      <p>In quantitative analysis (like my Stock Trend Analyzer), a static 800x600 chart forces you to make painful trade-offs. Do you show 1 month of tick data to maintain granularity, or 5 years to convey macroeconomic context? With Matplotlib, you can't have both in a single frame without messy subplots.</p>

      <h4>Why Plotly Solves the Human Interaction Gap</h4>
      <ul>
        <li><strong>Dynamic Zoom & Pan:</strong> Stakeholders can inspect anomalies or flash crashes directly without needing the analyst to re-run scripts with new slice indices.</li>
        <li><strong>Multi-Dimensional Hover Tooltips:</strong> You can embed volume, RSI, moving averages, and timestamp metadata directly into the cursor tooltip, keeping the visual uncluttered.</li>
        <li><strong>WebGL Accelerated Rendering:</strong> Using <code>plotly.graph_objects.Scattergl</code>, you can smoothly render 100,000+ data points with 60 FPS client-side interactivity.</li>
      </ul>

      <h4>Key Takeaway</h4>
      <p>Matplotlib remains indispensable for academic publications and quick diagnostic scratchpads. But for dashboards, interactive web apps, and user-facing intelligence, Plotly is undeniably superior.</p>
    `
  },
  recommender: {
    title: 'Building a Recommendation Engine from Scratch Without Heavy Frameworks',
    meta: 'Machine Learning · 7 Min Read · Published',
    content: `
      <h3>Why Reinvent the Wheel?</h3>
      <p>When engineering the recommendation feature for my AI Finance Learning App, the instinctive route was to install bulky recommender packages. However, external black-box frameworks often introduce massive cold-start penalties and unnecessary deployment dependencies for lightweight educational tools.</p>

      <h4>The Algorithmic Strategy: Vector Space Mathematics</h4>
      <p>Instead of heavy matrix factorization libraries, I built the engine purely using Linear Algebra and NumPy:</p>
      <ol>
        <li><strong>Curriculum Topic Vectorization:</strong> Each module is encoded across competency dimensions: [Math Rigor, Conceptual Abstraction, Practical Application, Time Required].</li>
        <li><strong>Dynamic Student Mastery State:</strong> As a student attempts quizzes, an exponential moving average updates their mastery vector across these exact dimensions.</li>
        <li><strong>Cosine Similarity Calculation:</strong>
          <pre><code>similarity = dot(student_vector, topic_vector) / (norm(student_vector) * norm(topic_vector))</code></pre>
        </li>
        <li><strong>Deficiency Penalty Factor:</strong> We penalize topics where prerequisite mastery is below 65%, preventing students from jumping into advanced derivatives before mastering compound interest.</li>
      </ol>

      <h4>Results</h4>
      <p>The resulting engine runs in under 4 milliseconds on standard Python without requiring GPU resources, proving that clean mathematical formulations often beat framework bloat.</p>
    `
  },
  iot: {
    title: 'What I Wish I Knew Before Building My First IoT Project',
    meta: 'IoT & Embedded Systems · 6 Min Read · Published',
    content: `
      <h3>From Theory on Breadboards to Real-World Chaos</h3>
      <p>In classroom simulators, sensors produce clean linear voltage. In the real world, inside a resonant plastic water tank with humidity and motor vibration, physics will humble you very quickly.</p>

      <h4>Hard-Learned Lessons from the Smart Water Monitor:</h4>
      <ul>
        <li><strong>1. Acoustic Reflection & Condensation:</strong> Ultrasonic sensors bounce sound. When water droplets condense on the transducer membrane, false distance echoes trigger ghost readings. Solution: Moving median filter (window size = 7) coupled with rate-of-change clamping.</li>
        <li><strong>2. Relay Inductive Kickback:</strong> When an electric AC motor cuts off, the collapsing magnetic field sends a massive high-voltage inductive spike back through the power rail, resetting your microcontroller. Solution: Optical isolation and flyback snubber protection diodes.</li>
        <li><strong>3. Sensor Drift & Temperature Compensation:</strong> Water TDS readings vary drastically with temperature. Without an integrated thermistor calibration formula, your water quality reading will drift by up to 25% between morning and afternoon.</li>
      </ul>

      <h4>Conclusion</h4>
      <p>Building embedded IoT systems teaches you true full-stack resilience. Software bugs can be patched with hotfixes; hardware reliability requires disciplined physical design from day zero.</p>
    `
  }
};

// Main Portfolio Application Class
class PortfolioApp {
  constructor() {
    this.sound = new SoundFX();
    this.swarm = null;
    this.terminal = null;
    this.playground = null;

    this.init();
  }

  init() {
    // 1. Initialize Particle Swarm Background
    this.initSwarm();

    // 2. Initialize AIML Terminal
    this.initTerminal();

    // 3. Initialize AIML Playground
    this.initPlayground();

    // 4. Setup Custom Cyber Cursor
    this.initCursor();

    // 5. Setup Project Filtering & Modals
    this.initProjects();

    // 6. Setup Articles & Blog Modals
    this.initArticles();

    // 7. Setup Resume & Contact Form
    this.initContactAndResume();

    // 8. Setup Theme, Navigation & Audio Toggles
    this.initNavigationAndTheme();

    // 9. Setup 3D Card Tilt Effects
    this.initCardTilt();

    // 10. Setup Scroll Spy & Reveal Animations
    this.initScrollReveal();

    // 11. Setup Swarm Controller HUD
    this.initSwarmHUD();
  }

  initSwarm() {
    try {
      this.swarm = new ParticleVortex('hero-canvas-container');
    } catch (e) {
      console.error('Failed to initialize 3D Swarm Background:', e);
    }
  }

  initTerminal() {
    try {
      this.terminal = new AIMLTerminal('terminal-container');
    } catch (e) {
      console.error('Terminal init error:', e);
    }
  }

  initPlayground() {
    try {
      this.playground = new AIMLPlayground('ml-canvas', 'ml-controls');
    } catch (e) {
      console.error('Playground init error:', e);
    }
  }

  initCursor() {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    if (isTouch || !dot || !ring) {
      if (dot) dot.style.display = 'none';
      if (ring) ring.style.display = 'none';
      document.body.style.cursor = 'auto';
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const sparks = [];
    const SPARK_COUNT = 8;
    const sparkContainer = document.createElement('div');
    sparkContainer.id = 'cursor-sparks';
    document.body.appendChild(sparkContainer);

    for (let i = 0; i < SPARK_COUNT; i++) {
      const s = document.createElement('div');
      s.className = 'cursor-spark';
      sparkContainer.appendChild(s);
      sparks.push({ el: s, x: mouseX, y: mouseY });
    }

    const COLORS = ['#00E5FF', '#0070F3', '#10B981', '#38BDF8', '#06B6D4'];
    let lastSparkTime = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      const now = performance.now();
      if (now - lastSparkTime > 25) {
        lastSparkTime = now;
        const spark = sparks.shift();
        sparks.push(spark);
        spark.x = mouseX;
        spark.y = mouseY;
        spark.el.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        spark.el.style.opacity = '0.7';
        spark.el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
        setTimeout(() => {
          spark.el.style.opacity = '0';
        }, 200);
      }
    });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(animateRing);
    };
    animateRing();

    // Hover interactions
    const interactiveElements = 'a, button, input, select, textarea, .tilt-card, .tab-btn, .pill-btn, .interactive-el';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveElements)) {
        ring.classList.add('cursor-active');
        dot.classList.add('cursor-active');
        this.sound.hover();
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveElements)) {
        ring.classList.remove('cursor-active');
        dot.classList.remove('cursor-active');
      }
    });

    document.addEventListener('click', () => {
      this.sound.click();
      ring.classList.add('cursor-click');
      setTimeout(() => ring.classList.remove('cursor-click'), 150);
    });
  }

  initProjects() {
    // Project Category Filtering
    const filterBtns = document.querySelectorAll('.filter-pill');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        projectCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, 20);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px) scale(0.97)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });

    // Project Deep-Dive Modal
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('project-modal-body');
    const modalClose = document.getElementById('project-modal-close');

    const openProjectModal = (projKey) => {
      const p = PROJECT_DETAILS[projKey];
      if (!p || !modal || !modalBody) return;

      modalBody.innerHTML = `
        <div class="modal-eyebrow">${p.category}</div>
        <h2 class="modal-title">${p.title}</h2>
        <div class="modal-status-badge">● ${p.status}</div>
        
        <p class="modal-desc">${p.desc}</p>

        <div class="modal-metrics-grid">
          ${p.metrics.map(m => `
            <div class="modal-metric-card">
              <span class="m-val">${m.value}</span>
              <span class="m-lbl">${m.label}</span>
            </div>
          `).join('')}
        </div>

        <h3 class="modal-section-title">System Architecture & Pipeline</h3>
        <ul class="modal-arch-list">
          ${p.architecture.map(item => `<li><span class="bullet-dot"></span>${item}</li>`).join('')}
        </ul>

        <h3 class="modal-section-title">Engineering Challenges Solved</h3>
        <ul class="modal-arch-list">
          ${p.challenges.map(item => `<li><span class="bullet-dot warning"></span>${item}</li>`).join('')}
        </ul>

        <div class="modal-tech-stack">
          ${p.tech.map(t => `<span class="tech-chip">${t}</span>`).join('')}
        </div>

        <div class="modal-actions-row">
          <a href="${p.github}" target="_blank" class="btn-primary">
            <span>View Source on GitHub</span> ↗
          </a>
          <button class="btn-secondary" id="modal-close-action-btn">Close Inspection</button>
        </div>
      `;

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';

      const closeActionBtn = modalBody.querySelector('#modal-close-action-btn');
      if (closeActionBtn) {
        closeActionBtn.addEventListener('click', () => closeProjectModal());
      }
    };

    const closeProjectModal = () => {
      if (!modal) return;
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    if (modalClose) modalClose.addEventListener('click', closeProjectModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeProjectModal();
      });
    }

    document.querySelectorAll('[data-open-project]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projKey = btn.getAttribute('data-open-project');
        openProjectModal(projKey);
      });
    });
  }

  initArticles() {
    const articleModal = document.getElementById('article-modal');
    const articleBody = document.getElementById('article-modal-body');
    const articleClose = document.getElementById('article-modal-close');

    const openArticle = (key) => {
      const art = ARTICLES[key];
      if (!art || !articleModal || !articleBody) return;

      articleBody.innerHTML = `
        <div class="article-meta-badge">${art.meta}</div>
        <h2 class="article-header-title">${art.title}</h2>
        <div class="article-text-content">
          ${art.content}
        </div>
        <div class="modal-actions-row" style="margin-top:2.5rem">
          <button class="btn-primary" id="article-done-btn">Back to Portfolio</button>
        </div>
      `;

      articleModal.classList.add('open');
      document.body.style.overflow = 'hidden';

      const doneBtn = articleBody.querySelector('#article-done-btn');
      if (doneBtn) doneBtn.addEventListener('click', () => closeArticle());
    };

    const closeArticle = () => {
      if (!articleModal) return;
      articleModal.classList.remove('open');
      document.body.style.overflow = '';
    };

    if (articleClose) articleClose.addEventListener('click', closeArticle);
    if (articleModal) {
      articleModal.addEventListener('click', (e) => {
        if (e.target === articleModal) closeArticle();
      });
    }

    document.querySelectorAll('[data-open-article]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const key = btn.getAttribute('data-open-article');
        openArticle(key);
      });
    });
  }

  initContactAndResume() {
    // 1. One-Click Copy Email Button
    const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
    copyEmailBtns.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const email = 'mithun.t0375@gmail.com';
        try {
          await navigator.clipboard.writeText(email);
          this.sound.success();
          this.showToast('Copied to clipboard: mithun.t0375@gmail.com', 'success');
          const originalText = btn.innerHTML;
          btn.innerHTML = '<span>✓</span> Copied Email!';
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 2000);
        } catch (err) {
          this.showToast('Email: mithun.t0375@gmail.com', 'info');
        }
      });
    });

    // 2. Interactive Contact Form
    const contactForm = document.getElementById('portfolio-contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = contactForm.querySelector('#contact-name').value.trim();
        const email = contactForm.querySelector('#contact-email').value.trim();
        const subject = contactForm.querySelector('#contact-subject').value;
        const msg = contactForm.querySelector('#contact-msg').value.trim();

        if (!name || !email || !msg) {
          this.showToast('Please fill out all required fields.', 'error');
          return;
        }

        this.sound.success();
        this.showToast(`Thank you, ${name}! Preparing email client...`, 'success');

        // Formulate mailto URL
        const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} from ${name}`);
        const mailtoBody = encodeURIComponent(`Sender Name: ${name}\nSender Email: ${email}\nInquiry Type: ${subject}\n\nMessage:\n${msg}`);
        const mailtoUrl = `mailto:mithun.t0375@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

        setTimeout(() => {
          window.location.href = mailtoUrl;
          contactForm.reset();
        }, 600);
      });
    }

    // 3. Resume Modal
    const resumeModal = document.getElementById('resume-modal');
    const resumeClose = document.getElementById('resume-modal-close');
    const openResumeBtns = document.querySelectorAll('[data-open-resume]');

    openResumeBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (resumeModal) {
          resumeModal.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeResume = () => {
      if (resumeModal) {
        resumeModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    };

    if (resumeClose) resumeClose.addEventListener('click', closeResume);
    if (resumeModal) {
      resumeModal.addEventListener('click', (e) => {
        if (e.target === resumeModal) closeResume();
      });
    }
  }

  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    const icon = type === 'success' ? '✓' : type === 'error' ? '⚠' : 'ℹ';
    toast.innerHTML = `<span class="t-icon">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  initNavigationAndTheme() {
    // Theme Switcher
    const themeBtn = document.getElementById('theme-toggle-btn');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    if (savedTheme === 'light') {
      html.classList.add('light');
      if (themeBtn) themeBtn.innerHTML = '🌙';
      if (this.swarm) this.swarm.setTheme(true);
    }

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const isNowLight = html.classList.toggle('light');
        localStorage.setItem('portfolio-theme', isNowLight ? 'light' : 'dark');
        themeBtn.innerHTML = isNowLight ? '🌙' : '☀️';
        themeBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
          themeBtn.style.transform = '';
        }, 300);

        if (this.swarm) {
          this.swarm.setTheme(isNowLight);
        }
        this.sound.click();
      });
    }

    // Audio SFX Switcher
    const soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const active = this.sound.toggle();
        soundBtn.innerHTML = active ? '🔊' : '🔇';
        soundBtn.classList.toggle('sound-on', active);
        this.showToast(active ? 'Cyber SFX Activated' : 'Audio Muted', 'info');
      });
    }

    // Mobile Hamburger Navigation Drawer
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mobileDrawer.classList.toggle('open');
      });

      drawerLinks.forEach((link) => {
        link.addEventListener('click', () => {
          mobileToggle.classList.remove('active');
          mobileDrawer.classList.remove('open');
        });
      });
    }

    // Nav Shrink on Scroll
    const navBar = document.querySelector('nav');
    window.addEventListener('scroll', () => {
      if (navBar) {
        if (window.scrollY > 50) {
          navBar.classList.add('nav-scrolled');
        } else {
          navBar.classList.remove('nav-scrolled');
        }
      }
    }, { passive: true });
  }

  initCardTilt() {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        card.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  initScrollReveal() {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      revealObserver.observe(el);
    });

    // Scroll Spy for Nav Links
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 200;
      sections.forEach((sec) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { passive: true });
  }

  initSwarmHUD() {
    const hudContainer = document.getElementById('swarm-hud');
    if (!hudContainer || !this.swarm) return;

    hudContainer.innerHTML = `
      <div class="hud-toggle-bar" id="hud-toggle">
        <span class="hud-indicator-dot"></span>
        <span class="hud-label">Energy Core mk1</span>
        <span class="hud-expand-icon">⚙</span>
      </div>
      <div class="hud-body" id="hud-body">
        <div class="hud-title">ENERGY CORE MK1 CONTROLS</div>
        <div class="hud-param-row">
          <label>Loop Duration (Sec)</label>
          <input type="range" id="hud-loop" min="4" max="30" step="1" value="${this.swarm.params.loopSec}" />
          <span id="hud-loop-val">${this.swarm.params.loopSec}s</span>
        </div>
        <div class="hud-param-row">
          <label>Core Scale</label>
          <input type="range" id="hud-scale" min="0.4" max="1.8" step="0.05" value="${this.swarm.params.sc}" />
          <span id="hud-scale-val">${this.swarm.params.sc.toFixed(2)}</span>
        </div>
        <div class="hud-param-row">
          <label>Core Glow</label>
          <input type="range" id="hud-glow" min="0.2" max="1.5" step="0.02" value="${this.swarm.params.glow}" />
          <span id="hud-glow-val">${this.swarm.params.glow.toFixed(2)}</span>
        </div>
        <div class="hud-param-row">
          <label>Energy Beam Power</label>
          <input type="range" id="hud-beam" min="0" max="1.0" step="0.05" value="${this.swarm.params.beam}" />
          <span id="hud-beam-val">${this.swarm.params.beam.toFixed(2)}</span>
        </div>
        <div class="hud-param-row">
          <label>Core Hue Spectrum</label>
          <input type="range" id="hud-hue" min="0" max="1.0" step="0.02" value="${this.swarm.params.hue}" />
          <span id="hud-hue-val">${this.swarm.params.hue.toFixed(2)}</span>
        </div>
        <div class="hud-btn-row">
          <button id="hud-orbit-toggle" class="hud-btn">
            <span>🔄</span> Direct 3D Orbit Mode: OFF
          </button>
        </div>
      </div>
    `;

    const hudToggle = hudContainer.querySelector('#hud-toggle');
    const hudBody = hudContainer.querySelector('#hud-body');

    hudToggle.addEventListener('click', () => {
      hudContainer.classList.toggle('open');
    });

    const loopSlider = hudContainer.querySelector('#hud-loop');
    const loopVal = hudContainer.querySelector('#hud-loop-val');
    loopSlider.addEventListener('input', (e) => {
      this.swarm.params.loopSec = parseInt(e.target.value);
      loopVal.textContent = `${this.swarm.params.loopSec}s`;
    });

    const scaleSlider = hudContainer.querySelector('#hud-scale');
    const scaleVal = hudContainer.querySelector('#hud-scale-val');
    scaleSlider.addEventListener('input', (e) => {
      this.swarm.params.sc = parseFloat(e.target.value);
      scaleVal.textContent = this.swarm.params.sc.toFixed(2);
    });

    const glowSlider = hudContainer.querySelector('#hud-glow');
    const glowVal = hudContainer.querySelector('#hud-glow-val');
    glowSlider.addEventListener('input', (e) => {
      this.swarm.params.glow = parseFloat(e.target.value);
      glowVal.textContent = this.swarm.params.glow.toFixed(2);
    });

    const beamSlider = hudContainer.querySelector('#hud-beam');
    const beamVal = hudContainer.querySelector('#hud-beam-val');
    beamSlider.addEventListener('input', (e) => {
      this.swarm.params.beam = parseFloat(e.target.value);
      beamVal.textContent = this.swarm.params.beam.toFixed(2);
    });

    const hueSlider = hudContainer.querySelector('#hud-hue');
    const hueVal = hudContainer.querySelector('#hud-hue-val');
    hueSlider.addEventListener('input', (e) => {
      this.swarm.params.hue = parseFloat(e.target.value);
      hueVal.textContent = this.swarm.params.hue.toFixed(2);
    });

    const orbitBtn = hudContainer.querySelector('#hud-orbit-toggle');
    let isOrbit = false;
    orbitBtn.addEventListener('click', () => {
      isOrbit = !isOrbit;
      this.swarm.setInteractiveMode(isOrbit);
      orbitBtn.innerHTML = isOrbit
        ? '<span>✨</span> Direct 3D Orbit Mode: ON (Drag to inspect)'
        : '<span>🔄</span> Direct 3D Orbit Mode: OFF';
      orbitBtn.classList.toggle('active', isOrbit);
      this.showToast(isOrbit ? 'Direct 3D Camera Enabled (drag to rotate)' : 'Background Mode Restored', 'info');
    });
  }
}

// Bootstrap on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});
