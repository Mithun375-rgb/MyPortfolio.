# Mithun T. — Portfolio Website
> **Computer Science & Engineering (AIML)** · *Intelligent Systems, Data Visualizations & High-Performance Software*

A futuristic cyber-glassmorphism portfolio engineered with modern WebGL, Vanilla CSS, and modular ES6 JavaScript. Features the responsive 3D Energy Core particle swarm background from `mk1.jsx`, an interactive AIML terminal console, a real-time machine learning lab simulator, deep-dive project modals, and sound synthesis.

---

## 🌟 Key Features

1. **3D WebGL Energy Core Swarm (`mk1.jsx` integration)**:
   - 20,000 crystalline tetrahedron particles forming an energetic ring-shaped power core, coil spirals, outer corona, and a vertical energy beam.
   - Cinematic post-processing with `UnrealBloomPass` for a neon volumetric glow.
   - Real-time **HUD Controller** in the corner allowing visitors to adjust Loop Duration, Core Scale, Core Glow, Energy Beam Power, Core Hue, and Direct 3D Orbit Camera.
   - Performance-optimized with flat typed arrays (`Float32Array`) and dynamic device scaling.

2. **Interactive AIML Workstation Terminal**:
   - Retro-futuristic command-line console where visitors and recruiters can run commands: `help`, `about`, `skills`, `projects`, `aiml`, `metrics`, `contact`, `clear`, `matrix`.
   - Includes quick-action chips and up/down arrow command history.

3. **Bias-Variance Tradeoff Simulator (Interactive AI Lab)**:
   - Live polynomial regression visualizer right on the page.
   - Adjust model complexity (Degrees 1 to 7) and sample noise to observe underfitting versus overfitting in real time with live MSE and $R^2$ scores.

4. **Curated Flagship Architectures**:
   - **AI-Powered Finance Learning Platform**: Custom math-based recommendation engine, personalized curriculum paths, Streamlit GUI.
   - **Smart IoT Water Monitoring & Quality System**: Ultrasonic water level telemetry, pH/TDS sensor array, automated relay actuation, ~38% water waste reduction.
   - **Quantitative Stock Trend & Volatility Engine**: Live 10-year market data feeds via yFinance, vectorized technical indicators (EMA, RSI, Bollinger Bands), Plotly charts.
   - **Neural Vision & Diagnostic Suite**: Deep learning CNN transfer learning pipeline with Grad-CAM interpretability heatmaps.
   - Each project includes an **"Inspect Architecture"** modal with metrics, pipeline diagrams, and challenges solved.

5. **Technical Insights & Writing**:
   - Deep-dive technical articles with formatted reading modals covering Plotly vs Matplotlib, Building Recommenders from scratch, and real-world IoT lessons.

6. **Interactive Collaboration Hub**:
   - Contact form with validation and mailto launcher.
   - One-click "Copy Email" with instant toast notifications.
   - Web Audio API synthetic cyber audio blips (with mute/unmute toggle).
   - Light and Dark mode switcher with seamless WebGL swarm color adaptation.

---

## 🚀 Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```
Generates an optimized, minified production bundle in the `dist/` directory ready for deployment.

---

## 🌐 Deployment Instructions

### Deploy to Netlify (Recommended)
Your previous website was hosted on Netlify (`https://mithun-t-portfolio.netlify.app/`). Deploying the updated build is simple:

1. **Option A: Drag & Drop (Instant)**
   - Run `npm run build`
   - Log in to your [Netlify Dashboard](https://app.netlify.com/)
   - Drag and drop the `dist/` folder into the Netlify Deploys area.

2. **Option B: GitHub Continuous Deployment**
   - Push your code to your GitHub repository:
     ```bash
     git add .
     git commit -m "feat: complete modern AIML portfolio with 3D WebGL swarm"
     git push origin main
     ```
   - Connect the repository on Netlify.
   - Set **Build command**: `npm run build`
   - Set **Publish directory**: `dist`

---

## 📂 Project Structure

```text
Portfolio/
├── index.html              # Semantic HTML5 entry page with SEO metadata
├── package.json            # Project dependencies (Three.js, Vite)
├── point_code.jsx          # Original particle swarm reference
├── README.md               # Documentation and deployment guide
└── src/
    ├── css/
    │   └── style.css       # Full cyber-glassmorphism design system & responsive rules
    └── js/
        ├── app.js          # Master application controller, modals, sound FX, contact form
        ├── playground.js   # Interactive live polynomial regression visualizer
        ├── swarm.js        # Three.js 3D WebGL particle vortex with UnrealBloomPass & HUD
        └── terminal.js     # Interactive AIML workstation terminal console
```

---

## 🛠️ Customization

- **Background Swarm Parameters**: Open `src/js/swarm.js` to tweak default speed, chaos, particle count, or color gradients.
- **Projects & Modals**: Open `src/js/app.js` and modify the `PROJECT_DETAILS` dictionary to update links, metrics, or add new projects.
- **Articles**: Open `src/js/app.js` and edit the `ARTICLES` object to update technical blog posts.
- **Contact Details**: Update your email in `index.html` and `src/js/app.js`.

---

© 2026 Mithun T. Built with Three.js WebGL & Vanilla CSS.
