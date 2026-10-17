export class AIMLTerminal {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.history = [];
    this.historyIndex = -1;
    this.commands = {
      help: () => this.cmdHelp(),
      about: () => this.cmdAbout(),
      skills: () => this.cmdSkills(),
      projects: () => this.cmdProjects(),
      aiml: () => this.cmdAiml(),
      metrics: () => this.cmdMetrics(),
      contact: () => this.cmdContact(),
      clear: () => this.cmdClear(),
      matrix: () => this.cmdMatrix(),
      whoami: () => `<div class="term-line success"><span class="text-mint">guest@mithun-os:~$</span> Role: curious explorer. Permissions: read-only access granted. Ready to collaborate!</div>`
    };

    this.render();
    this.initEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="term-window">
        <div class="term-header">
          <div class="term-buttons">
            <span class="tb tb-red"></span>
            <span class="tb tb-yellow"></span>
            <span class="tb tb-green"></span>
          </div>
          <div class="term-title">mithun@aiml-neural-core: ~ (zsh)</div>
          <div class="term-badge">● ONLINE v2.5</div>
        </div>
        <div class="term-body" id="term-output">
          <div class="term-system-banner">
            <div class="ts-line"><span class="text-cyan font-bold">[SYSTEM ONLINE]</span> <span class="text-white font-bold">Mithun T. // CS (AIML) Neural Workstation</span></div>
            <div class="ts-line text-dim">KERNEL: Neural-OS 6.8.0-aiml &nbsp;|&nbsp; ARCH: x86_64 WebGL Swarm &nbsp;|&nbsp; MEM: 64GB</div>
            <div class="ts-line text-mint">● 14,000 Convergence Nodes Active &nbsp;|&nbsp; Telemetry: Optimal</div>
          </div>
          <div class="term-instruction">
            Type <span class="cmd-chip" data-cmd="help">help</span> for commands, or click any quick action below:
          </div>
          <div class="term-shortcuts">
            <button class="t-btn" data-cmd="skills">⚡ skills</button>
            <button class="t-btn" data-cmd="projects">🚀 projects</button>
            <button class="t-btn" data-cmd="aiml">🧠 aiml</button>
            <button class="t-btn" data-cmd="metrics">📊 metrics</button>
            <button class="t-btn" data-cmd="contact">📬 contact</button>
            <button class="t-btn" data-cmd="clear">🧹 clear</button>
          </div>
        </div>
        <div class="term-input-row">
          <span class="term-prompt">guest@mithun-os:~$</span>
          <input type="text" id="term-input" autocomplete="off" spellcheck="false" placeholder="type 'help' or command and press Enter..." />
          <button id="term-run-btn" class="term-run-btn">Execute ↵</button>
        </div>
      </div>
    `;

    this.output = this.container.querySelector('#term-output');
    this.input = this.container.querySelector('#term-input');
  }

  initEvents() {
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = this.input.value.trim().toLowerCase();
        if (val) {
          this.execute(val);
          this.history.push(val);
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      } else if (e.key === 'ArrowUp') {
        if (this.history.length > 0 && this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      }
    });

    const runBtn = this.container.querySelector('#term-run-btn');
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        const val = this.input.value.trim().toLowerCase();
        if (val) {
          this.execute(val);
          this.history.push(val);
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      });
    }

    // Click on command shortcuts
    this.container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cmd]');
      if (btn) {
        const cmd = btn.getAttribute('data-cmd');
        this.execute(cmd);
      }
    });
  }

  execute(cmd) {
    this.appendLine(`<div class="term-line user-echo"><span class="text-cyan font-semibold">guest@mithun-os:~$</span> <span class="text-white">${this.escapeHtml(cmd)}</span></div>`);

    const commandFunc = this.commands[cmd];
    if (commandFunc) {
      const result = commandFunc();
      if (result) {
        this.appendLine(result);
      }
    } else {
      this.appendLine(`<div class="term-line text-pink">Command not recognized: "${this.escapeHtml(cmd)}". Type <span class="cmd-chip" data-cmd="help">help</span> for available commands.</div>`);
    }

    this.output.scrollTop = this.output.scrollHeight;
  }

  appendLine(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    this.output.appendChild(div);
  }

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  cmdHelp() {
    return `
      <div class="term-result">
        <div class="term-line font-bold text-cyan">AVAILABLE WORKSTATION COMMANDS:</div>
        <div class="term-grid">
          <div><span class="text-cyan font-mono font-semibold">about</span>    - Executive background & educational track</div>
          <div><span class="text-cyan font-mono font-semibold">skills</span>   - Machine Learning, Data Science & Systems toolset</div>
          <div><span class="text-cyan font-mono font-semibold">projects</span> - Flagship applications & architectures</div>
          <div><span class="text-cyan font-mono font-semibold">aiml</span>     - Recommendation engines, vision CNNs & telemetry</div>
          <div><span class="text-cyan font-mono font-semibold">metrics</span>  - System stats: GPA, latency, test metrics</div>
          <div><span class="text-cyan font-mono font-semibold">contact</span>  - Connect directly via Email or GitHub</div>
          <div><span class="text-cyan font-mono font-semibold">clear</span>    - Flush terminal console buffer</div>
          <div><span class="text-cyan font-mono font-semibold">matrix</span>   - Quantum neural stream pulse</div>
        </div>
      </div>
    `;
  }

  cmdAbout() {
    return `
      <div class="term-result">
        <div class="term-line text-cyan font-bold">Mithun T. — Computer Science (AIML Specialization)</div>
        <div class="term-line">Degree: B.Tech in Computer Science & Engineering</div>
        <div class="term-line">Specialization: Artificial Intelligence & Machine Learning</div>
        <div class="term-line text-muted">Core Philosophy: "Synthesizing vector math, statistical rigor, and low-latency systems engineering into reliable, real-world software."</div>
      </div>
    `;
  }

  cmdSkills() {
    return `
      <div class="term-result">
        <div class="term-line text-mint font-bold">TECH ARSENAL & PROFICIENCIES:</div>
        <div class="term-line"><span class="text-cyan font-semibold">Languages:</span> Python, C, JavaScript (ES6+), Modern HTML/CSS</div>
        <div class="term-line"><span class="text-cyan font-semibold">AIML & Math:</span> Scikit-Learn, Pandas, NumPy, Recommendation Algorithms, Linear Algebra, Optimization</div>
        <div class="term-line"><span class="text-cyan font-semibold">Data Science:</span> Plotly, Matplotlib, Interactive Telemetry Dashboards, yFinance API</div>
        <div class="term-line"><span class="text-cyan font-semibold">Core CS:</span> Data Structures, Algorithms, Dynamic Memory, DBMS, Operating Systems, Computer Networks</div>
        <div class="term-line"><span class="text-mint font-semibold">Tools & DevOps:</span> Git, GitHub, VS Code, Jupyter, Streamlit, Google Colab, Linux</div>
      </div>
    `;
  }

  cmdProjects() {
    return `
      <div class="term-result">
        <div class="term-line text-cyan font-bold">FLAGSHIP ARCHITECTURES:</div>
        <div class="term-line">1. <span class="text-white font-semibold">AI Finance Learning Platform</span> — Personalized learning tracks, diagnostic quiz evaluation, custom math-based recommendation engine (Python, Streamlit).</div>
        <div class="term-line">2. <span class="text-cyan font-semibold">Smart IoT Water Monitoring</span> — Ultrasonic level telemetry, automated motor actuation, real-time quality sensing (Embedded C, Sensors).</div>
        <div class="term-line">3. <span class="text-mint font-semibold">Quantitative Stock Trend Analyzer</span> — Live historical financial pipeline (yFinance), technical indicators (RSI, Bollinger, SMA), Plotly interactive graphs.</div>
        <div class="term-line">4. <span class="text-amber font-semibold">Neural Diagnostic Vision Engine</span> — CNN-based classification pipeline with augmentation and ROC-AUC curve evaluation.</div>
      </div>
    `;
  }

  cmdAiml() {
    return `
      <div class="term-result">
        <div class="term-line text-cyan font-bold">🧠 AIML SPECIALIZATION HIGHLIGHTS:</div>
        <div class="term-line">● <span class="text-mint font-semibold">Custom Recommendation Engine:</span> Engineered a personalized pedagogical recommender using cosine similarity vectors and mastery tracking without heavy black-box dependencies.</div>
        <div class="term-line">● <span class="text-cyan font-semibold">Time-Series & Financial Signal Processing:</span> Feature engineering on multi-stock daily tick data, calculating volatility, exponential moving averages, and support/resistance zones.</div>
        <div class="term-line">● <span class="text-amber font-semibold">Sensor Anomaly Detection:</span> Moving median statistical outlier filtering for ultrasonic and TDS probes in real-time embedded environments.</div>
      </div>
    `;
  }

  cmdMetrics() {
    return `
      <div class="term-result">
        <div class="term-line text-cyan font-bold">TELEMETRY & SYSTEM METRICS:</div>
        <div class="term-line">► Academic Standing: <span class="text-mint font-semibold">High First Class / B.Tech CSE (AIML)</span></div>
        <div class="term-line">► WebGL Particle Swarm: <span class="text-cyan font-semibold">14,000 active 3D particles @ 60 FPS</span></div>
        <div class="term-line">► Water Waste Cut: <span class="text-mint font-semibold">~38% in continuous prototype tests</span></div>
        <div class="term-line">► Analytics Query Latency: <span class="text-amber font-semibold">&lt; 300ms historical render</span></div>
        <div class="term-line">► Code Base Integrity: <span class="text-cyan font-semibold">100% modular, documented, lint-clean</span></div>
      </div>
    `;
  }

  cmdContact() {
    return `
      <div class="term-result">
        <div class="term-line text-mint font-bold">COMMUNICATION CHANNELS:</div>
        <div class="term-line">📧 Email: <a href="mailto:mithun.t0375@gmail.com" class="term-link">mithun.t0375@gmail.com</a></div>
        <div class="term-line">💻 GitHub: <a href="https://github.com/Mithun375-rgb" target="_blank" class="term-link">github.com/Mithun375-rgb</a></div>
        <div class="term-line">⚡ Status: Open for Software Engineering & AIML Opportunities.</div>
      </div>
    `;
  }

  cmdClear() {
    this.output.innerHTML = `
      <div class="term-line text-dim">Console cleared. Type <span class="cmd-chip" data-cmd="help">help</span> for command directory.</div>
    `;
    return null;
  }

  cmdMatrix() {
    const originalBg = document.body.style.filter;
    document.body.style.filter = 'hue-rotate(180deg) contrast(1.15)';
    setTimeout(() => {
      document.body.style.filter = originalBg;
    }, 1500);
    return `<div class="term-line text-mint font-bold">⚡ Quantum wave impulse propagated through WebGL vortex. System stable.</div>`;
  }
}
