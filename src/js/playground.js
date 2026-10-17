export class AIMLPlayground {
  constructor(canvasId, controlsId) {
    this.canvas = document.getElementById(canvasId);
    this.controls = document.getElementById(controlsId);
    if (!this.canvas || !this.controls) return;

    this.ctx = this.canvas.getContext('2d');
    this.degree = 3;
    this.noise = 0.25;
    this.numPoints = 24;
    this.points = [];

    this.initControls();
    this.generateData();
    this.fitAndDraw();
    this.initResize();
  }

  initControls() {
    this.controls.innerHTML = `
      <div class="ml-controls-grid">
        <div class="ml-control-item">
          <div class="ml-label-row">
            <label for="poly-deg">Model Complexity (Polynomial Degree)</label>
            <span id="poly-deg-val" class="ml-val-badge">Degree 3</span>
          </div>
          <input type="range" id="poly-deg" min="1" max="7" value="3" step="1" />
          <div class="ml-subtext">1: Underfit | 3-4: Optimal | 6-7: Overfit</div>
        </div>

        <div class="ml-control-item">
          <div class="ml-label-row">
            <label for="noise-lvl">Dataset Noise Variance</label>
            <span id="noise-lvl-val" class="ml-val-badge">0.25σ</span>
          </div>
          <input type="range" id="noise-lvl" min="0.05" max="0.6" value="0.25" step="0.05" />
        </div>

        <div class="ml-actions-row">
          <button id="regen-data-btn" class="btn-micro">
            <span>⟳</span> Regenerate Synthetic Samples
          </button>
          <div class="ml-diagnostics">
            <div class="diag-item">
              <span class="diag-label">Train MSE:</span>
              <span id="diag-mse" class="diag-val text-mint">0.041</span>
            </div>
            <div class="diag-item">
              <span class="diag-label">R² Score:</span>
              <span id="diag-r2" class="diag-val text-cyan">0.93</span>
            </div>
            <div class="diag-item">
              <span id="diag-status" class="diag-badge badge-optimal">Optimal Generalization</span>
            </div>
          </div>
        </div>
      </div>
    `;

    const degSlider = this.controls.querySelector('#poly-deg');
    const degVal = this.controls.querySelector('#poly-deg-val');
    degSlider.addEventListener('input', (e) => {
      this.degree = parseInt(e.target.value);
      degVal.textContent = `Degree ${this.degree}`;
      this.fitAndDraw();
    });

    const noiseSlider = this.controls.querySelector('#noise-lvl');
    const noiseVal = this.controls.querySelector('#noise-lvl-val');
    noiseSlider.addEventListener('input', (e) => {
      this.noise = parseFloat(e.target.value);
      noiseVal.textContent = `${this.noise.toFixed(2)}σ`;
      this.generateData();
      this.fitAndDraw();
    });

    const regenBtn = this.controls.querySelector('#regen-data-btn');
    regenBtn.addEventListener('click', () => {
      this.generateData();
      this.fitAndDraw();
    });
  }

  initResize() {
    const handleResize = () => {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = rect.width * dpr;
      this.canvas.height = 280 * dpr;
      this.ctx.scale(dpr, dpr);
      this.canvasWidth = rect.width;
      this.canvasHeight = 280;
      this.fitAndDraw();
    };
    handleResize();
    window.addEventListener('resize', handleResize);
  }

  generateData() {
    this.points = [];
    for (let i = 0; i < this.numPoints; i++) {
      // Input domain x in [-1, 1]
      const x = -0.95 + (1.9 * (i / (this.numPoints - 1)));
      // Ground truth true underlying function: y = sin(x * PI) + 0.3 * x^2
      const trueY = Math.sin(x * Math.PI) + 0.25 * x * x;
      // Add Gaussian/Box-Muller noise
      const u1 = Math.random() || 0.001;
      const u2 = Math.random();
      const randNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      const y = trueY + (randNormal * this.noise);
      this.points.push({ x, y, trueY });
    }
  }

  solvePolynomialRegression(points, degree) {
    const m = degree + 1;
    const A = Array.from({ length: m }, () => new Float64Array(m));
    const B = new Float64Array(m);

    // Build normal equations: (X^T X) w = X^T y
    for (const p of points) {
      const powers = new Float64Array(2 * m);
      powers[0] = 1;
      for (let k = 1; k < 2 * m; k++) powers[k] = powers[k - 1] * p.x;

      for (let row = 0; row < m; row++) {
        for (let col = 0; col < m; col++) {
          A[row][col] += powers[row + col];
        }
        B[row] += powers[row] * p.y;
      }
    }

    // Regularization (Ridge) to ensure numerical stability at higher degrees
    const lambda = 0.0001;
    for (let i = 0; i < m; i++) A[i][i] += lambda;

    // Gaussian elimination with partial pivoting
    for (let i = 0; i < m; i++) {
      let maxRow = i;
      for (let k = i + 1; k < m; k++) {
        if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
      }
      [A[i], A[maxRow]] = [A[maxRow], A[i]];
      [B[i], B[maxRow]] = [B[maxRow], B[i]];

      for (let k = i + 1; k < m; k++) {
        const factor = A[k][i] / (A[i][i] || 1e-12);
        for (let j = i; j < m; j++) {
          A[k][j] -= factor * A[i][j];
        }
        B[k] -= factor * B[i];
      }
    }

    const weights = new Float64Array(m);
    for (let i = m - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < m; j++) sum += A[i][j] * weights[j];
      weights[i] = (B[i] - sum) / (A[i][i] || 1e-12);
    }

    return weights;
  }

  predict(x, weights) {
    let y = 0;
    let xPow = 1;
    for (let i = 0; i < weights.length; i++) {
      y += weights[i] * xPow;
      xPow *= x;
    }
    return y;
  }

  fitAndDraw() {
    if (!this.canvasWidth || !this.canvasHeight) {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.canvasWidth = rect.width;
      this.canvasHeight = 280;
    }

    const ctx = this.ctx;
    const W = this.canvasWidth;
    const H = this.canvasHeight;
    ctx.clearRect(0, 0, W, H);

    // Coordinate mapping
    const padX = 40;
    const padY = 30;
    const toScreenX = (x) => padX + ((x + 1) / 2) * (W - padX * 2);
    const toScreenY = (y) => H / 2 - (y / 2.2) * (H / 2 - padY);

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.12)';
    ctx.lineWidth = 1;
    for (let x = -1; x <= 1; x += 0.5) {
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, padY);
      ctx.lineTo(sx, H - padY);
      ctx.stroke();
    }
    for (let y = -1.5; y <= 1.5; y += 0.75) {
      const sy = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(padX, sy);
      ctx.lineTo(W - padX, sy);
      ctx.stroke();
    }

    // Solve regression
    const weights = this.solvePolynomialRegression(this.points, this.degree);

    // Calculate MSE and R^2
    let sse = 0;
    let sst = 0;
    let meanY = this.points.reduce((acc, p) => acc + p.y, 0) / this.points.length;

    for (const p of this.points) {
      const pred = this.predict(p.x, weights);
      sse += (p.y - pred) ** 2;
      sst += (p.y - meanY) ** 2;
    }
    const mse = sse / this.points.length;
    const r2 = Math.max(0, 1 - (sse / (sst || 1)));

    // Update Diagnostics
    const mseEl = this.controls.querySelector('#diag-mse');
    const r2El = this.controls.querySelector('#diag-r2');
    const statusEl = this.controls.querySelector('#diag-status');

    if (mseEl) mseEl.textContent = mse.toFixed(4);
    if (r2El) r2El.textContent = r2.toFixed(3);

    if (statusEl) {
      if (this.degree === 1) {
        statusEl.className = 'diag-badge badge-underfit';
        statusEl.textContent = 'Underfitting (High Bias)';
      } else if (this.degree >= 6) {
        statusEl.className = 'diag-badge badge-overfit';
        statusEl.textContent = 'Overfitting (High Variance)';
      } else {
        statusEl.className = 'diag-badge badge-optimal';
        statusEl.textContent = 'Optimal Generalization';
      }
    }

    // 1. Draw True Underlying Function (Dashed Slate)
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i <= 100; i++) {
      const x = -1 + (2 * i) / 100;
      const y = Math.sin(x * Math.PI) + 0.25 * x * x;
      const sx = toScreenX(x);
      const sy = toScreenY(y);
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 2. Draw Model Prediction Curve (Electric Blue / Cyan / Mint Gradient)
    ctx.beginPath();
    const grad = ctx.createLinearGradient(padX, 0, W - padX, 0);
    grad.addColorStop(0, '#0070F3');
    grad.addColorStop(0.5, '#00E5FF');
    grad.addColorStop(1, '#10B981');

    ctx.strokeStyle = grad;
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(0, 229, 255, 0.6)';
    ctx.shadowBlur = 10;

    for (let i = 0; i <= 150; i++) {
      const x = -1 + (2 * i) / 150;
      const y = this.predict(x, weights);
      const sx = toScreenX(x);
      const sy = toScreenY(y);
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 3. Draw Training Data Points
    for (const p of this.points) {
      const sx = toScreenX(p.x);
      const sy = toScreenY(p.y);

      // Residual error line to curve
      const predY = this.predict(p.x, weights);
      const predSy = toScreenY(predY);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx, predSy);
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Point circle
      ctx.beginPath();
      ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#00E5FF';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
}
