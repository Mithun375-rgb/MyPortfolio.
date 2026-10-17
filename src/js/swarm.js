import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class EnergyCoreSwarm {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) return;

    // Detect device performance capability
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
    this.count = isMobile ? 10000 : 20000;

    // Parameters matching mk1.jsx (Energy Core)
    this.params = {
      loopSec: 25,
      turns: 2,
      sc: 0.9,
      glow: 0.32,
      hue: 1.0,
      beam: 0.53,
      bloomStrength: 0.9,
      bloomRadius: 0.4,
      bloomThreshold: 0.05,
      autoRotate: true,
      autoRotateSpeed: 0.35,
      interactiveControls: false,
      isLightMode: document.documentElement.classList.contains('light')
    };

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollY = 0;
    this.clock = new THREE.Clock();

    this.initScene();
    this.initParticles();
    this.initPostProcessing();
    this.initControls();
    this.initEvents();
    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();
    const bgCol = this.params.isLightMode ? 0xf0f4ff : 0x050811;
    this.scene.background = new THREE.Color(bgCol);
    this.scene.fog = new THREE.FogExp2(bgCol, this.params.isLightMode ? 0.007 : 0.008);

    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 100);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);
  }

  initParticles() {
    // mk1 Tetrahedron geometry for sleek crystalline energy particles
    this.geometry = new THREE.TetrahedronGeometry(0.25);

    // High performance shader material for crisp glow and metallic shading
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uIsLight: { value: this.params.isLightMode ? 1.0 : 0.0 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vColor;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vColor = instanceColor;
          gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vColor;
        uniform float uIsLight;
        void main() {
          vec3 viewDir = vec3(0.0, 0.0, 1.0);
          float metallic = dot(vNormal, viewDir) * 0.4 + 0.6;
          metallic = pow(metallic, 2.0);
          
          vec3 baseColor = vColor;
          if (uIsLight > 0.5) {
            baseColor = mix(vColor * 0.8, vec3(0.05, 0.12, 0.25), 0.15);
          }
          vec3 col = baseColor * metallic + baseColor * 0.35;
          gl_FragColor = vec4(col, 1.0);
        }
      `
    });

    this.instMesh = new THREE.InstancedMesh(this.geometry, this.material, this.count);
    this.instMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Precomputed sequence arrays for mk1 mathematics
    this.aArray = new Float32Array(this.count);
    this.bArray = new Float32Array(this.count);
    this.cArray = new Float32Array(this.count);
    this.uArray = new Float32Array(this.count);
    this.kArray = new Uint8Array(this.count);

    // Dynamic position buffers for smooth lerping
    this.curX = new Float32Array(this.count);
    this.curY = new Float32Array(this.count);
    this.curZ = new Float32Array(this.count);

    for (let i = 0; i < this.count; i++) {
      this.uArray[i] = i / this.count;
      this.aArray[i] = (i * 0.6180339887) % 1;
      this.bArray[i] = (i * 0.7548776662) % 1;
      this.cArray[i] = (i * 0.3819660113) % 1;
      this.kArray[i] = i % 10;

      // Initial spread
      this.curX[i] = (Math.random() - 0.5) * 100;
      this.curY[i] = (Math.random() - 0.5) * 100;
      this.curZ[i] = (Math.random() - 0.5) * 100;
    }

    const colors = new Float32Array(this.count * 3);
    this.instMesh.instanceColor = new THREE.InstancedBufferAttribute(colors, 3);
    this.instMesh.instanceColor.setUsage(THREE.DynamicDrawUsage);

    this.dummy = new THREE.Object3D();
    this.tempColor = new THREE.Color();

    this.scene.add(this.instMesh);
  }

  initPostProcessing() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      this.params.bloomStrength,
      this.params.bloomRadius,
      this.params.bloomThreshold
    );
    this.composer.addPass(this.bloomPass);

    this.outputPass = new OutputPass();
    this.composer.addPass(this.outputPass);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.autoRotate = this.params.autoRotate;
    this.controls.autoRotateSpeed = this.params.autoRotateSpeed;
    this.controls.enableZoom = false;
    this.controls.maxDistance = 220;
    this.controls.minDistance = 25;
    this.controls.enabled = false;
  }

  initEvents() {
    window.addEventListener('resize', () => this.onWindowResize());

    window.addEventListener('mousemove', (e) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      this.mouse.targetX = (e.clientX - halfW) / halfW;
      this.mouse.targetY = (e.clientY - halfH) / halfH;
    });

    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
    }, { passive: true });
  }

  onWindowResize() {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
    this.bloomPass.resolution.set(width, height);
  }

  setTheme(isLight) {
    this.params.isLightMode = isLight;
    const bgCol = isLight ? 0xf0f4ff : 0x050811;
    this.scene.background.set(bgCol);
    this.scene.fog.color.set(bgCol);
    this.scene.fog.density = isLight ? 0.007 : 0.008;

    if (this.material && this.material.uniforms && this.material.uniforms.uIsLight) {
      this.material.uniforms.uIsLight.value = isLight ? 1.0 : 0.0;
    }

    this.bloomPass.strength = isLight ? 0.45 : this.params.bloomStrength;
  }

  setInteractiveMode(enabled) {
    this.params.interactiveControls = enabled;
    this.controls.enabled = enabled;
    this.controls.enableZoom = enabled;
    this.container.style.pointerEvents = enabled ? 'auto' : 'none';
  }

  updateEnergyCore(time) {
    const loopSec = Math.round(this.params.loopSec);
    const turns = Math.round(this.params.turns);
    const sc = this.params.sc;
    const glow = this.params.glow;
    const hue = this.params.hue;
    const beam = this.params.beam;
    const isLight = this.params.isLightMode;

    const TAU = 6.2831853;
    const lp = ((time % loopSec) / loopSec) * TAU;
    const rot = lp * turns;

    // 3D Yaw & Tilt trigonometry
    const yaw = Math.sin(lp) * 0.6;
    const cyw = Math.cos(yaw);
    const syw = Math.sin(yaw);
    const tl = 0.2;
    const ct = Math.cos(tl);
    const st = Math.sin(tl);
    const pulse = 1.0 + 0.02 * Math.sin(lp * 3.0);

    const matrixArray = this.instMesh.instanceMatrix.array;
    const colorArray = this.instMesh.instanceColor.array;

    for (let i = 0; i < this.count; i++) {
      const u = this.uArray[i];
      const a = this.aArray[i];
      const b = this.bArray[i];
      const c = this.cArray[i];

      let x = 0;
      let y = 0;
      let z = 0;
      let h = 0;
      let s = 0;
      let l = 0;

      if (u < 0.20) {
        // Outer Torus Ring
        const ang = a * TAU;
        const phi = b * TAU;
        const rad = 30 + 3.4 * Math.cos(phi);
        x = rad * Math.cos(ang);
        y = rad * Math.sin(ang);
        z = 2.8 * Math.sin(phi);
        h = 0.56; // Clean Cyber Azure/Cyan
        s = 0.25;
        l = 0.3 + 0.18 * Math.abs(Math.sin(ang * 12.0)) + 0.1 * Math.max(0, Math.cos(phi));
      } else if (u < 0.30) {
        // Mid Orbit Disc
        const ang = a * TAU;
        const r = 14 + b * 15;
        x = r * Math.cos(ang);
        y = r * Math.sin(ang);
        z = -1.8 + (c - 0.5) * 0.8;
        h = 0.58;
        s = 0.3;
        l = 0.12 + 0.08 * Math.abs(Math.sin(ang * 10.0 + rot));
      } else if (u < 0.56) {
        // 10-Spoke Spiral Coil Cores
        const k = this.kArray[i];
        const ang = (k * TAU) / 10.0 + rot + (b - 0.5) * 0.42;
        const r = 15 + a * 12;
        x = r * Math.cos(ang);
        y = r * Math.sin(ang);
        z = 0.4 + c * 3.2;
        h = hue;
        s = 0.8 - 0.3 * c;
        l = glow * (0.4 + 0.3 * Math.sin(lp * 3.0 + k * 0.6283) + 0.25 * c);
      } else if (u < 0.66) {
        // Inner Torus Ring
        const ang = a * TAU;
        const phi = b * TAU;
        const rad = 12 + 1.5 * Math.cos(phi);
        x = rad * Math.cos(ang);
        y = rad * Math.sin(ang);
        z = 1.2 + 1.5 * Math.sin(phi);
        h = hue;
        s = 0.55;
        l = glow * (0.65 + 0.2 * Math.sin(lp * 2.0 + ang * 3.0));
      } else if (u < 0.78) {
        // Central Core Spiral Disc
        const r = Math.sqrt(a) * 10.5;
        const ang = b * TAU;
        x = r * Math.cos(ang);
        y = r * Math.sin(ang);
        z = 0.8 + 0.3 * Math.sin(r * 0.8 - lp * 2.0);
        h = hue;
        s = 0.85 * (r / 10.5);
        l = Math.min(1, glow * (0.95 - (0.35 * r) / 10.5 + 0.12 * Math.sin(r * 1.2 - lp * 4.0)));
      } else if (u < 0.88) {
        // Outer Corona Energy Pulse
        const ang = a * TAU + lp * 2.0;
        const r = 36 + 10 * b;
        x = r * Math.cos(ang);
        y = r * Math.sin(ang);
        z = (c - 0.5) * 8.0 * Math.sin(a * 17.0);
        h = hue;
        s = 0.8;
        l = glow * 0.5 * Math.max(0, Math.sin(a * 60.0 + lp * 3.0));
      } else {
        // Ascending Energy Beam Column
        const t = (a + (lp / TAU) * 2.0) % 1;
        const ang = c * TAU;
        const r = (1.0 - t) * 7.0 * b;
        x = r * Math.cos(ang);
        y = r * Math.sin(ang);
        z = 2.0 + t * 45.0;
        h = hue;
        s = 0.6 + 0.4 * t;
        l = beam * glow * (1.0 - t) * 0.95;
      }

      // Rotate yaw (Y axis) & tilt (X axis)
      const px = x * cyw + z * syw;
      const pz = -x * syw + z * cyw;
      const py = y * ct - pz * st;
      const qz = y * st + pz * ct;

      const tx = px * sc * pulse;
      const ty = py * sc * pulse;
      const tz = qz * sc * pulse;

      // Smooth lerp
      this.curX[i] += (tx - this.curX[i]) * 0.12;
      this.curY[i] += (ty - this.curY[i]) * 0.12;
      this.curZ[i] += (tz - this.curZ[i]) * 0.12;

      this.dummy.position.set(this.curX[i], this.curY[i], this.curZ[i]);
      this.dummy.updateMatrix();

      const mIdx = i * 16;
      const e = this.dummy.matrix.elements;
      for (let j = 0; j < 16; j++) {
        matrixArray[mIdx + j] = e[j];
      }

      // Color mapping
      if (isLight) {
        l = Math.min(0.85, l * 0.7 + 0.2);
        s = 0.9;
      }

      this.tempColor.setHSL(h, Math.min(1, Math.max(0, s)), Math.min(1, Math.max(0, l)));
      const cIdx = i * 3;
      colorArray[cIdx] = this.tempColor.r;
      colorArray[cIdx + 1] = this.tempColor.g;
      colorArray[cIdx + 2] = this.tempColor.b;
    }

    this.instMesh.instanceMatrix.needsUpdate = true;
    if (this.instMesh.instanceColor) this.instMesh.instanceColor.needsUpdate = true;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    if (this.material && this.material.uniforms && this.material.uniforms.uTime) {
      this.material.uniforms.uTime.value = elapsedTime;
    }

    // Update mk1 energy core simulation
    this.updateEnergyCore(elapsedTime);

    if (this.params.interactiveControls) {
      this.controls.update();
    } else {
      // Background mode: smooth mouse parallax and gentle auto rotation
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

      const scrollFactor = (this.scrollY / 1500) * Math.PI * 0.5;
      const baseDist = 100 - Math.sin(scrollFactor) * 12;

      if (this.params.autoRotate) {
        this.instMesh.rotation.y = elapsedTime * 0.08 + (this.mouse.x * 0.25);
        this.instMesh.rotation.x = Math.sin(elapsedTime * 0.06) * 0.12 - (this.mouse.y * 0.2);
      } else {
        this.instMesh.rotation.y = this.mouse.x * 0.3;
        this.instMesh.rotation.x = -this.mouse.y * 0.3;
      }

      this.camera.position.x = this.mouse.x * 10;
      this.camera.position.y = -this.mouse.y * 10;
      this.camera.position.z = baseDist;
      this.camera.lookAt(0, 0, 0);
    }

    this.composer.render();
  }
}

export { EnergyCoreSwarm as ParticleVortex };
