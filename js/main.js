// ── Night City Background ──────────────────────────
function initCityBackground() {
  const canvas = document.getElementById('city-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, scrollY = 0;
  let isMobile = false;
  let maxScroll = 1;
  let stars = [];
  let buildings = { far: [], mid: [], near: [] };
  let clouds = [];
  let nebulae = [];
  let shootingStar = null;
  let nextShootingStarTime = Date.now() + 5000 + Math.random() * 10000;
  let animFrame;
  let reducedMotion = false;

  // ── Weather state ──
  let rainDrops = [];
  let weatherState = 'clear'; // 'clear' | 'fade-in' | 'raining' | 'fade-out'
  let weatherAlpha = 0;       // overall rain opacity (0→1 during fade-in)
  let weatherStartTime = 0;
  let weatherDuration = 0;
  let nextWeatherCheck = Date.now() + 3000 + Math.random() * 8000;
  let lightningFlash = 0;     // 0→1 brightness overlay
  let nextLightningTime = 0;
  let lightningCooldown = 0;  // earliest time lightning can fire after rain starts

  // ── Resize handler ──
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    // Sync CSS display size to canvas buffer to prevent mobile stretch/distortion
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    isMobile = W < 768;
    generateScene();
  }

  // ── Scene generation ──
  function generateScene() {
    generateStars();
    generateBuildings();
    generateClouds();
    generateNebulae();
  }

  // ── Stars ──
  function generateStars() {
    stars = [];
    const divisor = isMobile ? 5500 : 3000;
    const count = Math.floor((W * H) / divisor);
    // Mixed warm/cool palette for realistic stellar color variety
    const colors = [
      '#ffffff',   // pure white (most common)
      '#f0eeff',   // cool white
      '#e2d9f3',   // lavender white
      '#c4b5fd',   // soft purple
      '#a78bfa',   // violet
      '#fff8e7',   // warm white
      '#ffe8c0',   // pale gold
      '#ffd9a0',   // warm amber
      '#d4e4ff',   // ice blue
      '#b8d0f0',   // steel blue
    ];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.65,
        size: Math.random() < 0.85 ? 1 : 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        twinkleSpeed: 0.0015 + Math.random() * 0.0025,
        twinkleOffset: Math.random() * Math.PI * 2,
        baseAlpha: 0.4 + Math.random() * 0.6,
      });
    }
  }

  // ── Buildings ──
  // Wide height variance + generous gaps for organic skyline rhythm
  function generateBuildings() {
    // On mobile, wider gaps = fewer buildings per layer for performance
    var gapScale = isMobile ? 1.6 : 1;
    buildings.far = makeLayer(0.12, 0.50, 35, 80, 15 * gapScale, 50 * gapScale, '#151222', isMobile ? 0.45 : 0.25);
    buildings.mid = makeLayer(0.15, 0.62, 40, 100, 12 * gapScale, 40 * gapScale, '#1a1530', isMobile ? 0.40 : 0.20);
    buildings.near = makeLayer(0.18, 0.75, 50, 130, 10 * gapScale, 35 * gapScale, '#201a3e', 0);
  }

  function makeLayer(minH, maxH, minW, maxW, minGap, maxGap, color, darkChance) {
    const layer = [];
    let x = -Math.random() * 60;
    while (x < W + 100) {
      const bW = minW + Math.random() * (maxW - minW);
      const bH = (minH + Math.random() * (maxH - minH)) * H;
      const bY = H - bH;
      // darkChance controls how many buildings have no windows per layer
      const isDark = Math.random() < darkChance;
      const windows = isDark ? [] : generateWindows(x, bY, bW, bH);
      layer.push({ x, y: bY, w: bW, h: bH, color, windows });
      x += bW + minGap + Math.random() * (maxGap - minGap);
    }
    return layer;
  }

  function generateWindows(bx, by, bw, bh) {
    const wins = [];
    var winSpacingX = isMobile ? 12 : 8;
    var winSpacingY = isMobile ? 15 : 10;
    const cols = Math.floor(bw / winSpacingX);
    const rows = Math.floor(bh / winSpacingY);
    const winColors = [
      'rgba(255,220,150,',
      'rgba(255,200,120,',
      'rgba(167,139,250,',
      'rgba(100,220,200,',
    ];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() > 0.40) continue;
        const color = winColors[Math.floor(Math.random() * winColors.length)];
        const baseAlpha = 0.4 + Math.random() * 0.35;
        wins.push({
          rx: c * 8 + 2,
          ry: r * 10 + 2,
          w: 4,
          h: 5,
          color,
          on: Math.random() > 0.2,
          alpha: baseAlpha,
          flickerSpeed: 0.002 + Math.random() * 0.004,
          flickerOffset: Math.random() * Math.PI * 2,
          nextFlicker: Date.now() + 2000 + Math.random() * 8000,
        });
      }
    }
    return wins;
  }

  // ── Clouds ──
  // Layered cluster clouds — each cloud is a group of overlapping ellipses
  // for an organic, voluminous silhouette with depth variation
  function generateClouds() {
    clouds = [];
    var maxClusters = isMobile ? 3 : 4;
    var clusterCount = maxClusters + Math.floor(Math.random() * maxClusters); // mobile: 3-5, desktop: 4-7
    for (var i = 0; i < clusterCount; i++) {
      var cx = Math.random() * W * 1.4 - W * 0.2;
      var cy = H * 0.06 + Math.random() * H * 0.28;
      var clusterWidth = 180 + Math.random() * 320;
      var clusterHeight = 18 + Math.random() * 28;  // much thicker than before
      var speed = 0.015 + Math.random() * 0.04;
      var baseAlpha = 0.025 + Math.random() * 0.04;
      // Purple/lavender palette with subtle variation
      var palettes = [
        [167, 139, 250],  // lavender
        [150, 130, 240],  // deeper lavender
        [140, 160, 220],  // steel blue
        [180, 150, 210],  // muted mauve
        [160, 145, 235],  // mid purple
      ];
      var baseColor = palettes[Math.floor(Math.random() * palettes.length)];
      // Build 4-7 overlapping blobs per cluster
      var blobCount = 4 + Math.floor(Math.random() * 4);
      var blobs = [];
      for (var b = 0; b < blobCount; b++) {
        // Spread blobs across the cluster width, concentrate near center
        var blobOffX = (Math.random() - 0.5) * clusterWidth * 0.8;
        var blobOffY = (Math.random() - 0.5) * clusterHeight * 0.5;
        var blobW = clusterWidth * (0.3 + Math.random() * 0.4);
        var blobH = clusterHeight * (0.5 + Math.random() * 0.5);
        // Core blobs are denser, edge blobs are softer
        var distFromCenter = Math.abs(blobOffX) / (clusterWidth * 0.5);
        var blobAlpha = baseAlpha * (1.0 - distFromCenter * 0.5) * (0.7 + Math.random() * 0.3);
        // Slight per-blob color shift for depth
        var colorShift = Math.floor(Math.random() * 20 - 10);
        blobs.push({
          offX: blobOffX,
          offY: blobOffY,
          w: blobW,
          h: blobH,
          alpha: blobAlpha,
          color: [
            Math.max(0, Math.min(255, baseColor[0] + colorShift)),
            Math.max(0, Math.min(255, baseColor[1] + colorShift)),
            Math.max(0, Math.min(255, baseColor[2] + Math.floor(colorShift * 0.5))),
          ],
        });
      }
      clouds.push({
        x: cx,
        y: cy,
        width: clusterWidth,
        speed: speed,
        blobs: blobs,
      });
    }
  }

  // ── Draw sky gradient ──
  function drawSky() {
    var grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#0a0815');
    grad.addColorStop(0.5, '#0e0b1c');
    grad.addColorStop(1, '#150a24');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  // ── Nebula / galaxy clouds ──
  function generateNebulae() {
    nebulae = [];
    var nebulaColors = [
      [90, 50, 180],   // deep purple
      [60, 40, 160],   // indigo
      [120, 60, 180],  // lavender purple
      [40, 60, 140],   // deep blue
      [140, 60, 120],  // dusty pink
    ];
    var count = 5 + Math.floor(Math.random() * 3);
    for (var i = 0; i < count; i++) {
      var col = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
      nebulae.push({
        x: Math.random() * W,
        y: H * 0.05 + Math.random() * H * 0.45,
        rx: 80 + Math.random() * 200,
        ry: 40 + Math.random() * 100,
        color: col,
        alpha: 0.025 + Math.random() * 0.035,
        rotation: Math.random() * Math.PI,
      });
    }
  }

  function drawNebulae() {
    nebulae.forEach(function(n) {
      ctx.save();
      ctx.translate(n.x, n.y);
      ctx.rotate(n.rotation);
      var grad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(n.rx, n.ry));
      grad.addColorStop(0, 'rgba(' + n.color[0] + ',' + n.color[1] + ',' + n.color[2] + ',' + n.alpha + ')');
      grad.addColorStop(0.5, 'rgba(' + n.color[0] + ',' + n.color[1] + ',' + n.color[2] + ',' + (n.alpha * 0.4) + ')');
      grad.addColorStop(1, 'rgba(' + n.color[0] + ',' + n.color[1] + ',' + n.color[2] + ',0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, n.rx, n.ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  // ── Shooting stars ──
  // Trail color palettes for variety
  var shootingStarPalettes = [
    { mid: '200,190,255', head: '#e8e0ff' },   // cool lavender
    { mid: '180,160,255', head: '#d4c4ff' },   // purple
    { mid: '160,200,255', head: '#c8e0ff' },   // ice blue
    { mid: '255,230,180', head: '#fff0d0' },   // warm gold
    { mid: '255,200,200', head: '#ffe8e8' },   // soft pink
    { mid: '255,255,255', head: '#ffffff' },   // pure white
  ];

  function updateShootingStar(t) {
    var now = Date.now();
    // Sky ceiling — shooting stars must fade out above this Y
    var skyCeiling = H * 0.45;

    // Spawn a new shooting star when it's time
    if (!shootingStar && now > nextShootingStarTime) {
      // Randomize starting position across the full sky width
      var startX = W * 0.05 + Math.random() * W * 0.9;
      var startY = H * 0.02 + Math.random() * H * 0.20;
      // Randomize angle: allow left-to-right, right-to-left, and various diagonals
      var baseAngle = Math.random() * Math.PI * 2;
      // Constrain to mostly-downward quadrants (avoid straight up)
      // Angles between PI/8 and 7PI/8 give nice variety of downward diagonals
      var angle = (Math.PI / 8) + Math.random() * (6 * Math.PI / 8);
      // Randomly flip horizontal direction
      var flipX = Math.random() < 0.5 ? -1 : 1;
      var speed = 5 + Math.random() * 5;
      var palette = shootingStarPalettes[Math.floor(Math.random() * shootingStarPalettes.length)];
      shootingStar = {
        x: startX,
        y: startY,
        dx: Math.cos(angle) * speed * flipX,
        dy: Math.sin(angle) * speed,
        life: 1.0,
        decay: 0.018 + Math.random() * 0.012,
        length: 25 + Math.random() * 45,
        palette: palette,
        skyCeiling: skyCeiling,
      };
    }

    if (!shootingStar) return;

    var s = shootingStar;
    s.x += s.dx;
    s.y += s.dy;
    s.life -= s.decay;

    // Force rapid fade if approaching the building zone
    if (s.y > s.skyCeiling) {
      s.life -= 0.08;
    }

    if (s.life <= 0 || s.x < -60 || s.x > W + 60 || s.y > H * 0.55) {
      shootingStar = null;
      nextShootingStarTime = now + 15000 + Math.random() * 15000;
      return;
    }

    // Draw the streak with color from palette
    var dir = Math.sqrt(s.dx * s.dx + s.dy * s.dy);
    var tailX = s.x - (s.dx / dir) * s.length;
    var tailY = s.y - (s.dy / dir) * s.length;
    var grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
    grad.addColorStop(0, 'rgba(' + s.palette.mid + ',0)');
    grad.addColorStop(0.6, 'rgba(' + s.palette.mid + ',' + (s.life * 0.35).toFixed(2) + ')');
    grad.addColorStop(1, 'rgba(' + s.palette.mid + ',' + (s.life * 0.8).toFixed(2) + ')');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(s.x, s.y);
    ctx.stroke();

    // Bright head in palette color
    ctx.globalAlpha = s.life * 0.8;
    ctx.fillStyle = s.palette.head;
    ctx.fillRect(Math.round(s.x), Math.round(s.y), 2, 2);
    ctx.globalAlpha = 1;
  }

  // ── Draw moon ──
  // Positioned in upper-left sky, comfortably away from edges and hero photo
  function drawMoon() {
    var mx = W * 0.12;
    // Same parallax drift as stars so the sky feels unified
    var parallaxOffset = Math.min(30, scrollY * 0.02);
    var my = H * 0.15 - parallaxOffset;
    var r = Math.min(W, H) * 0.04;

    // Outer ambient glow — warm-tinted, wide
    var glow2 = ctx.createRadialGradient(mx, my, r * 0.3, mx, my, r * 5);
    glow2.addColorStop(0, 'rgba(220,200,240,0.07)');
    glow2.addColorStop(0.3, 'rgba(190,170,230,0.04)');
    glow2.addColorStop(0.7, 'rgba(160,140,210,0.015)');
    glow2.addColorStop(1, 'rgba(140,120,200,0)');
    ctx.fillStyle = glow2;
    ctx.beginPath();
    ctx.arc(mx, my, r * 5, 0, Math.PI * 2);
    ctx.fill();

    // Inner glow — slightly warm
    var glow = ctx.createRadialGradient(mx, my, r * 0.4, mx, my, r * 2);
    glow.addColorStop(0, 'rgba(235,225,250,0.15)');
    glow.addColorStop(1, 'rgba(210,195,240,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(mx, my, r * 2, 0, Math.PI * 2);
    ctx.fill();

    // Moon body — warm cream-to-lavender gradient for character
    var bodyGrad = ctx.createRadialGradient(mx + r * 0.2, my - r * 0.15, r * 0.08, mx, my, r);
    bodyGrad.addColorStop(0, '#f5ede0');  // warm cream highlight
    bodyGrad.addColorStop(0.4, '#ece3d8'); // warm ivory
    bodyGrad.addColorStop(0.8, '#ddd0c4'); // soft tan
    bodyGrad.addColorStop(1, '#cec0b6');   // muted edge
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(mx, my, r, 0, Math.PI * 2);
    ctx.fill();

    // Surface craters — subtle darker patches on the lit portion
    ctx.fillStyle = 'rgba(160,140,130,0.2)';
    ctx.fillRect(Math.round(mx + r * 0.2), Math.round(my - r * 0.15), 2, 2);
    ctx.fillRect(Math.round(mx + r * 0.35), Math.round(my + r * 0.25), 2, 2);
    ctx.fillRect(Math.round(mx + r * 0.05), Math.round(my + r * 0.45), 2, 1);
    ctx.fillStyle = 'rgba(140,125,115,0.15)';
    ctx.fillRect(Math.round(mx + r * 0.45), Math.round(my - r * 0.3), 2, 1);
    ctx.fillRect(Math.round(mx + r * 0.25), Math.round(my + r * 0.1), 1, 2);

    // Crescent shadow — dark desaturated purple/navy that blends into the sky
    // NOT black — matches the sky gradient tone for natural blending
    ctx.fillStyle = '#0e0a1e';
    ctx.beginPath();
    ctx.arc(mx - r * 0.3, my, r * 0.85, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Draw stars ──
  function drawStars(t) {
    var parallaxOffset = Math.min(30, scrollY * 0.02);
    stars.forEach(function(s) {
      var alpha = s.baseAlpha *
        (0.7 + 0.3 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.color;
      ctx.fillRect(
        Math.round(s.x),
        Math.round(s.y - parallaxOffset),
        s.size,
        s.size
      );
    });
    ctx.globalAlpha = 1;
  }

  // ── Draw clouds ──
  // Each cloud cluster is drawn as layered overlapping ellipses
  // with radial gradients for soft, voluminous shapes
  function drawClouds() {
    // Same parallax drift as stars so the sky feels unified
    var parallaxOffset = Math.min(30, scrollY * 0.02);
    clouds.forEach(function(c) {
      c.x -= c.speed;
      if (c.x + c.width < -100) c.x = W + 120;

      c.blobs.forEach(function(blob) {
        var bx = c.x + c.width / 2 + blob.offX;
        var by = c.y + blob.offY - parallaxOffset;
        var col = blob.color;

        // Radial gradient: denser center, transparent edges
        var grad = ctx.createRadialGradient(bx, by, 0, bx, by, Math.max(blob.w, blob.h) / 2);
        grad.addColorStop(0, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + blob.alpha + ')');
        grad.addColorStop(0.4, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (blob.alpha * 0.7) + ')');
        grad.addColorStop(0.7, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (blob.alpha * 0.3) + ')');
        grad.addColorStop(1, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',0)');

        ctx.globalAlpha = 1;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(bx, by, blob.w / 2, blob.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    });
    ctx.globalAlpha = 1;
  }

  // ── Draw building layer ──
  // revealFrac: 0 = buildings hidden below viewport, 1 = fully visible
  // distanceDim: alpha multiplier for depth (far=dim, near=bright)
  function drawLayer(layer, revealFrac, distanceDim) {
    if (revealFrac <= 0) return;
    if (distanceDim === undefined) distanceDim = 1;
    const now = Date.now();
    // How much of each building's height to show (0→1)
    const visibleFrac = Math.min(1, revealFrac);
    // Window brightness ramps up with reveal
    const winBrightness = Math.pow(revealFrac, 1.5) * distanceDim;

    layer.forEach(function(b) {
      // Only draw the top portion of each building based on revealFrac
      const visH = b.h * visibleFrac;
      const drawY = H - visH;

      // Building body
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, drawY, b.w, visH);

      // Windows — only draw those within the visible portion
      b.windows.forEach(function(w) {
        // Window y relative to building top
        var wy = drawY + w.ry;
        if (wy + w.h < drawY || wy > H) return;

        if (!w.on) {
          if (now > w.nextFlicker) {
            w.on = true;
            w.nextFlicker = now + 3000 + Math.random() * 12000;
          }
          return;
        }
        if (now > w.nextFlicker) {
          if (Math.random() < 0.3) {
            w.on = false;
            w.nextFlicker = now + 5000 + Math.random() * 20000;
          } else {
            w.nextFlicker = now + 2000 + Math.random() * 10000;
          }
        }
        ctx.globalAlpha = w.alpha * winBrightness;
        ctx.fillStyle = w.color + (w.alpha * winBrightness).toFixed(2) + ')';
        ctx.fillRect(b.x + w.rx, wy, w.w, w.h);
      });
    });
    ctx.globalAlpha = 1;
  }

  // ── Rain generation ──
  function generateRainDrops() {
    rainDrops = [];
    var divisor = isMobile ? 7000 : 4000; // fewer drops on mobile
    var count = Math.floor((W * H) / divisor);
    for (var i = 0; i < count; i++) {
      rainDrops.push({
        x: Math.random() * (W + 100) - 50,
        y: Math.random() * H,
        length: 6 + Math.random() * 10,  // pixel-art short streaks
        speed: 4 + Math.random() * 6,
        drift: -0.8 - Math.random() * 1.2, // slight diagonal wind
        alpha: 0.15 + Math.random() * 0.25,
      });
    }
  }

  // ── Start a rain event (reusable) ──
  function startRain() {
    var now = Date.now();
    weatherState = 'fade-in';
    weatherStartTime = now;
    weatherDuration = Infinity; // Permanent rain
    weatherAlpha = 0;
    generateRainDrops();
    lightningCooldown = now + 6000; // no lightning in first 6s
    nextLightningTime = now + 8000 + Math.random() * 12000;
  }

  // ── Weather state machine ──
  function updateWeather() {
    var now = Date.now();

    switch (weatherState) {
      case 'clear':
        // Random auto-trigger skipped if reduced motion is on
        if (!reducedMotion && now > nextWeatherCheck) {
          // ~30% chance each check cycle; checks every 10-20s
          if (Math.random() < 0.3) {
            startRain();
          }
          nextWeatherCheck = now + 10000 + Math.random() * 10000;
        }
        break;

      case 'fade-in':
        weatherAlpha = Math.min(1, weatherAlpha + 0.015); // ~1s fade-in
        if (weatherAlpha >= 1) {
          weatherState = 'raining';
          weatherAlpha = 1;
        }
        break;

      case 'raining':
        // Rain is permanent, so we never transition to fade-out
        break;

      case 'fade-out':
        weatherAlpha = Math.max(0, weatherAlpha - 0.006); // ~2.5s fade-out
        if (weatherAlpha <= 0) {
          weatherState = 'clear';
          weatherAlpha = 0;
          rainDrops = [];
          lightningFlash = 0;
          // Gap before rain can start again: ~30s
          nextWeatherCheck = now + 20000 + Math.random() * 20000;
          // If reducedMotion is on, stop the animation loop again — it was
          // only restarted temporarily for the manual rain trigger.
          if (reducedMotion) {
            cancelAnimationFrame(animFrame);
            animFrame = 0;
            console.log('[Rain Debug] Rain ended, animation loop stopped (reducedMotion)');
          }
        }
        break;
    }

    // Lightning during active rain
    if ((weatherState === 'raining' || weatherState === 'fade-in') && weatherAlpha > 0.5) {
      if (now > nextLightningTime && now > lightningCooldown) {
        lightningFlash = 0.08 + Math.random() * 0.07; // subtle sky glow (0.08-0.15)
        nextLightningTime = now + 12000 + Math.random() * 25000; // 12-37s between flashes
      }
    }

    // Decay lightning flash quickly
    if (lightningFlash > 0) {
      lightningFlash *= 0.88; // rapid exponential decay
      if (lightningFlash < 0.005) lightningFlash = 0;
    }
  }

  // ── Draw rain ──
  function drawRain() {
    if (weatherAlpha <= 0 || rainDrops.length === 0) return;

    ctx.strokeStyle = 'rgba(180, 175, 220, ' + (weatherAlpha * 0.35).toFixed(3) + ')';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var i = 0; i < rainDrops.length; i++) {
      var d = rainDrops[i];
      d.y += d.speed;
      d.x += d.drift;

      // Wrap drops that go off screen
      if (d.y > H + 20) {
        d.y = -d.length - Math.random() * 40;
        d.x = Math.random() * (W + 100) - 50;
      }
      if (d.x < -60) d.x = W + 30;

      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.drift * 1.5, d.y + d.length);
    }
    ctx.stroke();
  }

  // ── Draw lightning flash ──
  // Atmospheric sky-localized glow — NOT a full-screen white overlay.
  // Brightens upper sky region only, fading out before the building zone.
  function drawLightning() {
    if (lightningFlash <= 0) return;
    var skyBottom = H * 0.45; // stop flash above building line
    var grad = ctx.createLinearGradient(0, 0, 0, skyBottom);
    grad.addColorStop(0, 'rgba(210, 205, 240, ' + lightningFlash.toFixed(3) + ')');
    grad.addColorStop(0.5, 'rgba(195, 190, 230, ' + (lightningFlash * 0.6).toFixed(3) + ')');
    grad.addColorStop(1, 'rgba(180, 175, 220, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, skyBottom);
  }

  // ── Make rain permanent ──
  function initWeather() {
    if (reducedMotion) return;
    weatherState = 'raining';
    weatherAlpha = 1;
    weatherStartTime = Date.now();
    weatherDuration = Infinity; // Permanent rain
    generateRainDrops();
    lightningCooldown = Date.now() + 8000;
    nextLightningTime = Date.now() + 10000 + Math.random() * 15000;
  }

  // ── Main render loop ──
  function render(t) {
    ctx.clearRect(0, 0, W, H);

    // scrollProgress: 0 at top of page, 1 at bottom
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var scrollProgress = Math.min(1, scrollY / maxScroll);

    // Buildings reveal based on scroll:
    // far starts earliest (slight peek even at top), near reveals later
    var farReveal = 0.08 + scrollProgress * 0.92;
    var midReveal = Math.max(0, scrollProgress * 1.1 - 0.05);
    var nearReveal = Math.max(0, scrollProgress * 1.2 - 0.15);

    drawSky();
    drawNebulae();
    drawStars(t);
    updateShootingStar(t);
    drawMoon();
    drawClouds();
    drawLayer(buildings.far, farReveal, 0.4);
    drawLayer(buildings.mid, midReveal, 0.65);
    drawLayer(buildings.near, nearReveal, 1);

    // Weather effects (rain + lightning) drawn on top of everything
    updateWeather();
    drawRain();
    drawLightning();

    animFrame = requestAnimationFrame(render);
  }

  // ── Scroll listener ──
  window.addEventListener('scroll', function() {
    scrollY = window.scrollY;
  }, { passive: true });

  // ── Performance safeguards ──
  // Pause animation when tab is hidden
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      cancelAnimationFrame(animFrame);
    } else {
      animFrame = requestAnimationFrame(render);
    }
  });

  // Respect reduced motion preference
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    resize();
    render(0);
    return;
  }

  // ── Init ──
  window.addEventListener('resize', resize);
  resize();
  initWeather();
  animFrame = requestAnimationFrame(render);
}

// ── Launch city background ──────────────────────────
initCityBackground();

function handleNavbarScroll() {
  const navToggle = document.getElementById("navToggle");
  const navList = document.getElementById("navList");
  const navWrap = document.querySelector(".nav-wrap");

  if (!navToggle || !navList || !navWrap) {
    return;
  }

  navToggle.addEventListener("click", function () {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navList.classList.toggle("open");
  });

  document.querySelectorAll(".nav-list a").forEach(function (link) {
    link.addEventListener("click", function () {
      navList.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", function (event) {
    if (!navWrap.contains(event.target)) {
      navList.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 740) {
      navList.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

let navClickLockSectionId = null;
let navClickLockUntil = 0;

function handleSmoothScroll() {
  function getHeaderOffset(extra) {
    const siteHeader = document.querySelector(".site-header");
    return (siteHeader ? siteHeader.offsetHeight : 0) + extra;
  }

  document.querySelectorAll('a[href^="#"]:not([href="#!"])').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");
      if (!targetId || !targetId.startsWith("#")) {
        return;
      }

      event.preventDefault();
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const absoluteTop = targetSection.getBoundingClientRect().top + window.scrollY;
        const headerOffset = getHeaderOffset(12);
        const centeredTop = absoluteTop - (window.innerHeight - targetSection.offsetHeight) / 2;
        const preferredTop = targetId === "#links" ? centeredTop : absoluteTop - headerOffset;
        const maxScrollTop = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        const targetTop = Math.min(maxScrollTop, Math.max(0, preferredTop));

        navClickLockSectionId = targetSection.id;
        navClickLockUntil = Date.now() + 1200;

        window.scrollTo({
          top: targetTop,
          behavior: "smooth",
        });
      }
    });
  });

  document.querySelectorAll('a[href="#!"]').forEach(function (placeholderLink) {
    placeholderLink.addEventListener("click", function (event) {
      event.preventDefault();
    });
  });
}

function handleActiveSectionHighlight() {
  const navLinks = Array.from(document.querySelectorAll(".nav-list a"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  let hoveredSectionId = null;

  if (!navLinks.length || !sections.length) {
    return;
  }

  function setActiveById(sectionId) {
    navLinks.forEach(function (link) {
      const isActive = link.getAttribute("href") === "#" + sectionId;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function setHoveredSection(sectionId) {
    sections.forEach(function (section) {
      const isHovered = section.id === sectionId;
      section.classList.toggle("section-hover-active", isHovered);
    });
  }

  function updateActiveSection() {
    if (hoveredSectionId) {
      return;
    }

    if (navClickLockSectionId && Date.now() < navClickLockUntil) {
      setActiveById(navClickLockSectionId);
      return;
    }

    navClickLockSectionId = null;

    const siteHeader = document.querySelector(".site-header");
    const headerOffset = (siteHeader ? siteHeader.offsetHeight : 0) + 20;
    const scrollMarker = window.scrollY + headerOffset;
    const docHeight = document.documentElement.scrollHeight;
    const viewportBottom = window.scrollY + window.innerHeight;

    if (viewportBottom >= docHeight - 2) {
      setActiveById(sections[sections.length - 1].id);
      return;
    }

    let activeSectionId = sections[0].id;

    for (let index = 0; index < sections.length; index += 1) {
      const currentSection = sections[index];
      const currentTop = currentSection.offsetTop;
      const nextSection = sections[index + 1];

      if (!nextSection) {
        if (scrollMarker >= currentTop) {
          activeSectionId = currentSection.id;
        }
        break;
      }

      const nextTop = nextSection.offsetTop;

      if (scrollMarker >= currentTop && scrollMarker < nextTop) {
        activeSectionId = currentSection.id;
        break;
      }
    }

    setActiveById(activeSectionId);
  }

  sections.forEach(function (section) {
    section.addEventListener("mouseenter", function () {
      hoveredSectionId = section.id;
      setHoveredSection(hoveredSectionId);
      setActiveById(hoveredSectionId);
    });

    section.addEventListener("mouseleave", function () {
      hoveredSectionId = null;
      setHoveredSection(null);
      updateActiveSection();
    });
  });

  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("resize", updateActiveSection);
  updateActiveSection();
}

function createModalController(config) {
  const modalOverlay = document.getElementById(config.overlayId);
  const modalClose = document.getElementById(config.closeId);
  const trigger = document.getElementById(config.triggerId);

  if (!modalOverlay || !modalClose || !trigger) {
    return null;
  }

  let lastFocusedElement = null;

  function openModal() {
    lastFocusedElement = document.activeElement;
    modalOverlay.classList.add("open");
    modalOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    if (typeof config.onOpen === "function") {
      config.onOpen();
    }

    modalClose.focus();
  }

  function closeModal() {
    if (!modalOverlay.classList.contains("open")) {
      return;
    }

    modalOverlay.classList.remove("open");
    modalOverlay.setAttribute("aria-hidden", "true");

    if (!document.querySelector(".modal-overlay.open")) {
      document.body.classList.remove("modal-open");
    }

    if (typeof config.onClose === "function") {
      config.onClose();
    }

    const fallbackFocus = lastFocusedElement || trigger;
    if (fallbackFocus && typeof fallbackFocus.focus === "function") {
      fallbackFocus.focus();
    }
  }

  trigger.addEventListener("click", openModal);
  modalClose.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", function (event) {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modalOverlay.classList.contains("open")) {
      closeModal();
    }
  });

  return {
    isOpen: function () {
      return modalOverlay.classList.contains("open");
    },
    open: openModal,
    close: closeModal,
  };
}

function handleProjectModal() {
  createModalController({
    overlayId: "aboutProjectModal",
    closeId: "modalClose",
    triggerId: "aboutProjectTrigger",
  });
}

function handleSneakPeekModal() {
  const worldGeneratorFiles = [
    "Noise_Terrain.mp4",
    "Noise_Terrain_2.mp4"
  ];
  for (let i = 1; i <= 35; i++) {
    worldGeneratorFiles.push("worldgen-sneakpeek-" + String(i).padStart(2, "0") + ".png");
  }

  const previewImages = worldGeneratorFiles.map(function (fileName, index) {
    const isVideo = fileName.endsWith(".mp4");
    const basePath = isVideo ? "assets/videos/world-generator/" : "assets/images/world-generator/";
    
    // Preload image to fix flickering
    if (!isVideo) {
      const img = new Image();
      img.src = basePath + encodeURIComponent(fileName);
    }
    
    return {
      src: basePath + encodeURIComponent(fileName),
      alt: "World generator sneak peek " + (index + 1),
      isVideo: isVideo
    };
  });

  const sneakPeekImage = document.getElementById("worldSneakPeekImage");
  const sneakPeekVideo = document.getElementById("worldSneakPeekVideo");
  const prevButton = document.getElementById("worldSneakPeekPrev");
  const nextButton = document.getElementById("worldSneakPeekNext");
  const dotsContainer = document.getElementById("worldSneakPeekDots");

  if (!sneakPeekImage || !sneakPeekVideo || !prevButton || !nextButton || !dotsContainer || !previewImages.length) {
    return;
  }

  let currentIndex = 0;
  let slideSwapTimer = null;
  let slideCleanupTimer = null;

  function clearSlideTimers() {
    if (slideSwapTimer) {
      window.clearTimeout(slideSwapTimer);
      slideSwapTimer = null;
    }

    if (slideCleanupTimer) {
      window.clearTimeout(slideCleanupTimer);
      slideCleanupTimer = null;
    }
  }

  function normalizeIndex(index) {
    return (index + previewImages.length) % previewImages.length;
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll(".carousel-dot");
    dots.forEach(function (dot, dotIndex) {
      const isActive = dotIndex === currentIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function setSlide(nextIndex, direction, animate) {
    const normalizedIndex = normalizeIndex(nextIndex);
    const slide = previewImages[normalizedIndex];
    const shouldAnimate = animate !== false;

    currentIndex = normalizedIndex;

    clearSlideTimers();

    const mediaElements = [sneakPeekImage, sneakPeekVideo];

    function getActiveMedia() {
      return slide.isVideo ? sneakPeekVideo : sneakPeekImage;
    }

    function commitSlide() {
      if (slide.isVideo) {
        sneakPeekVideo.src = slide.src;
        sneakPeekImage.style.display = "none";
        sneakPeekVideo.style.display = "";
      } else {
        sneakPeekImage.src = slide.src;
        sneakPeekImage.alt = slide.alt;
        sneakPeekVideo.style.display = "none";
        sneakPeekVideo.pause();
        sneakPeekImage.style.display = "";
      }

      mediaElements.forEach(function (el) { el.classList.remove("is-changing"); });

      if (shouldAnimate) {
        const activeMedia = getActiveMedia();
        activeMedia.classList.add("is-entering");
        void activeMedia.offsetWidth;
        activeMedia.classList.remove("is-entering");

        slideCleanupTimer = window.setTimeout(function () {
          mediaElements.forEach(function (el) { el.removeAttribute("data-direction"); });
        }, 320);
      } else {
        mediaElements.forEach(function (el) { el.removeAttribute("data-direction"); });
      }
    }

    if (shouldAnimate) {
      mediaElements.forEach(function (el) {
        el.setAttribute("data-direction", direction === "prev" ? "prev" : "next");
        el.classList.remove("is-entering");
        el.classList.add("is-changing");
      });
      slideSwapTimer = window.setTimeout(commitSlide, 170);
    } else {
      mediaElements.forEach(function (el) { el.classList.remove("is-entering", "is-changing"); });
      commitSlide();
    }

    updateDots();
  }

  function renderDots() {
    dotsContainer.innerHTML = "";
    previewImages.forEach(function (_, index) {
      const dotButton = document.createElement("button");
      dotButton.type = "button";
      dotButton.className = "carousel-dot";
      dotButton.setAttribute("aria-label", "View screenshot " + (index + 1));

      dotButton.addEventListener("click", function () {
        const direction = index >= currentIndex ? "next" : "prev";
        setSlide(index, direction, true);
      });

      dotsContainer.appendChild(dotButton);
    });
  }

  function showNextSlide() {
    setSlide(currentIndex + 1, "next", true);
  }

  function showPreviousSlide() {
    setSlide(currentIndex - 1, "prev", true);
  }

  prevButton.addEventListener("click", showPreviousSlide);
  nextButton.addEventListener("click", showNextSlide);

  const modalController = createModalController({
    overlayId: "worldSneakPeekModal",
    closeId: "worldSneakPeekClose",
    triggerId: "worldSneakPeekTrigger",
    onOpen: function () {
      setSlide(currentIndex, "next", false);
    },
    onClose: function () {
      if (sneakPeekVideo) {
        sneakPeekVideo.pause();
      }
    }
  });

  if (!modalController) {
    return;
  }

  document.addEventListener("keydown", function (event) {
    if (!modalController.isOpen()) {
      return;
    }

    if (event.key === "ArrowRight") {
      showNextSlide();
    }

    if (event.key === "ArrowLeft") {
      showPreviousSlide();
    }
  });

  renderDots();
  setSlide(0, "next", false);
}

function handleAnimations() {
  const reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    reveals.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    reveals.forEach(function (item) {
      item.classList.add("show");
    });
  }

  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  handleNavbarScroll();
  handleSmoothScroll();
  handleActiveSectionHighlight();
  handleProjectModal();
  handleSneakPeekModal();
  handleAnimations();
});
