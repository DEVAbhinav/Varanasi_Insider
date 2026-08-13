import * as d3 from 'd3';

export const W = 1600;
export const H = 1000;

const curve = d3.line().curve(d3.curveCatmullRom.alpha(0.6));

export function addLinear(defs, id, stops, coords = {}) {
  const gradient = defs
    .append('linearGradient')
    .attr('id', id)
    .attr('x1', coords.x1 ?? '0%')
    .attr('y1', coords.y1 ?? '0%')
    .attr('x2', coords.x2 ?? '0%')
    .attr('y2', coords.y2 ?? '100%');
  stops.forEach(([offset, color, opacity = 1]) => {
    gradient.append('stop').attr('offset', offset).attr('stop-color', color).attr('stop-opacity', opacity);
  });
}

export function addRadial(defs, id, stops, coords = {}) {
  const gradient = defs.append('radialGradient').attr('id', id);
  Object.entries(coords).forEach(([key, value]) => gradient.attr(key, value));
  stops.forEach(([offset, color, opacity = 1]) => {
    gradient.append('stop').attr('offset', offset).attr('stop-color', color).attr('stop-opacity', opacity);
  });
}

/** Half-width of a North-Indian curvilinear (Nagara) tower at height fraction t. */
const towerWidth = (t, w, tw) => tw + (w - tw) * Math.pow(1 - Math.pow(t, 1.75), 1.05);

export function towerOutline(w, h, tw) {
  const left = [];
  const right = [];
  for (let i = 0; i <= 22; i += 1) {
    const t = i / 22;
    const half = towerWidth(t, w, tw);
    left.push([-half, -h * t]);
    right.push([half, -h * t]);
  }
  return `${curve([...left, ...right.reverse()])} Z`;
}

/**
 * Nagara shikhara: curvilinear tower, horizontal band mouldings, vertical
 * lattice ribs, amalaka disc and kalash finial — the silhouette that actually
 * reads as a Varanasi temple rather than a plain triangle.
 */
export function drawShikhara(parent, options) {
  const {
    x, y, w, h,
    fill,
    edge = 'rgba(0,0,0,.3)',
    highlight,
    detail = true,
    urushringa = true,
    finial = true,
    flag = false,
    flagFill = '#e2622f',
  } = options;

  const group = parent.append('g').attr('transform', `translate(${x}, ${y})`);
  const tw = w * 0.17;
  const shade = 'url(#jShade)';

  if (urushringa) {
    [-1, 1].forEach((side) => {
      const sub2 = group.append('g').attr('transform', `translate(${side * w * 1.2}, 0)`);
      sub2.append('path').attr('d', towerOutline(w * 0.25, h * 0.32, w * 0.05))
        .attr('fill', 'rgba(46,18,2,.55)').attr('transform', 'translate(0,3) scale(1.12,1.03)');
      sub2.append('path').attr('d', towerOutline(w * 0.25, h * 0.32, w * 0.05))
        .attr('fill', fill).attr('stroke', edge).attr('stroke-width', 1);
      if (detail) sub2.append('path').attr('d', towerOutline(w * 0.25, h * 0.32, w * 0.05)).attr('fill', shade);
      if (detail) sub2.append('path').attr('d', towerOutline(w * 0.25, h * 0.32, w * 0.05)).attr('fill', 'rgba(30,12,0,.28)');
      sub2.append('ellipse').attr('cy', -h * 0.32).attr('rx', w * 0.07).attr('ry', w * 0.028).attr('fill', highlight || fill);

      const sub = group.append('g').attr('transform', `translate(${side * w * 0.86}, 0)`);
      sub.append('path').attr('d', towerOutline(w * 0.34, h * 0.55, w * 0.07))
        .attr('fill', 'rgba(46,18,2,.55)').attr('transform', 'translate(0,3) scale(1.1,1.025)');
      sub.append('path').attr('d', towerOutline(w * 0.34, h * 0.55, w * 0.07))
        .attr('fill', fill).attr('stroke', edge).attr('stroke-width', 1.2);
      if (detail) sub.append('path').attr('d', towerOutline(w * 0.34, h * 0.55, w * 0.07)).attr('fill', shade);
      if (detail) sub.append('path').attr('d', towerOutline(w * 0.34, h * 0.55, w * 0.07)).attr('fill', 'rgba(30,12,0,.18)');
      if (detail) {
        [0.24, 0.46, 0.66, 0.82].forEach((t) => {
          const half = towerWidth(t, w * 0.34, w * 0.07);
          sub.append('rect').attr('x', -half * 1.04).attr('y', -h * 0.55 * t)
            .attr('width', half * 2.08).attr('height', Math.max(1.6, h * 0.011))
            .attr('fill', highlight || fill).attr('opacity', 0.45);
        });
      }
      sub.append('ellipse').attr('cy', -h * 0.55).attr('rx', w * 0.095).attr('ry', w * 0.038)
        .attr('fill', highlight || fill).attr('stroke', edge).attr('stroke-width', 0.8);
    });
  }

  group.append('path')
    .attr('d', towerOutline(w, h, tw))
    .attr('fill', fill)
    .attr('stroke', edge)
    .attr('stroke-width', 2);

  if (detail) {
    // Directional shading gives the tower volume instead of flat colour.
    group.append('path')
      .attr('d', towerOutline(w, h, tw))
      .attr('fill', shade);

    // Raised vertical bands (lata / rathas) rendered as ribbons, not hairlines.
    [[0, 0.28, 0.34], [0.6, 0.16, 0.2], [-0.6, 0.16, 0.09], [0.88, 0.1, 0.13], [-0.88, 0.1, 0.05]]
      .forEach(([centre, halfK, alpha]) => {
        const inner = [];
        const outer = [];
        for (let i = 0; i <= 24; i += 1) {
          const t = i / 24;
          const hw = towerWidth(t, w, tw);
          inner.push([hw * (centre - halfK), -h * t]);
          outer.push([hw * (centre + halfK), -h * t]);
        }
        // Recessed channel either side of the rib gives it real relief.
        group.append('path').attr('d', `${curve([...inner, ...outer.reverse()])} Z`)
          .attr('fill', 'rgba(52,22,0,.34)')
          .attr('transform', `translate(${-w * 0.022}, 0)`);
        group.append('path')
          .attr('d', `${curve([...inner, ...outer.reverse()])} Z`)
          .attr('fill', highlight || '#ffffff')
          .attr('opacity', alpha);
        [inner, outer].forEach((side, si) => {
          group.append('path')
            .attr('d', curve(side))
            .attr('fill', 'none')
            .attr('stroke', si ? 'rgba(255,226,166,.5)' : 'rgba(48,20,0,.5)')
            .attr('stroke-width', Math.max(1.2, w * 0.016));
        });
      });

    // Bhumi storey mouldings with corner amalaka discs — sparse and structural.
    [0.17, 0.4, 0.6, 0.755, 0.865].forEach((t) => {
      const half = towerWidth(t, w, tw);
      const band = h * 0.013;
      group.append('path')
        .attr('d', `M ${-half * 1.05} ${-h * t} L ${half * 1.05} ${-h * t} L ${half} ${-h * t + band} L ${-half} ${-h * t + band} Z`)
        .attr('fill', highlight || fill)
        .attr('opacity', 0.34)
        .attr('stroke', edge)
        .attr('stroke-width', 0.8);
      group.append('path')
        .attr('d', `M ${-half} ${-h * t + band} L ${half} ${-h * t + band} L ${half * 0.99} ${-h * t + band * 1.9} L ${-half * 0.99} ${-h * t + band * 1.9} Z`)
        .attr('fill', 'rgba(40,16,0,.4)');
      [-1, 1].forEach((side) => {
        group.append('ellipse')
          .attr('cx', side * half * 0.97).attr('cy', -h * t - w * 0.008)
          .attr('rx', w * 0.032).attr('ry', w * 0.018)
          .attr('fill', highlight || fill).attr('opacity', 0.55);
      });
    });

    // Shukanasa — the projecting nose above the sanctum doorway.
    const nose = `M ${-w * 0.36} 0 L ${-w * 0.36} ${-h * 0.26} Q 0 ${-h * 0.44} ${w * 0.36} ${-h * 0.26} L ${w * 0.36} 0 Z`;
    group.append('path').attr('d', nose).attr('fill', fill).attr('stroke', edge).attr('stroke-width', 1.6);
    group.append('path').attr('d', nose).attr('fill', shade);
    group.append('path')
      .attr('d', `M ${-w * 0.2} ${-h * 0.02} Q 0 ${-h * 0.32} ${w * 0.2} ${-h * 0.02} Z`)
      .attr('fill', 'rgba(0,0,0,.38)');
  }

  if (finial) {
    const aR = tw * 1.9;
    group.append('ellipse').attr('cy', -h - aR * 0.22).attr('rx', aR).attr('ry', aR * 0.44)
      .attr('fill', highlight || fill).attr('stroke', edge).attr('stroke-width', 1.3);
    if (detail) {
      for (let i = -3; i <= 3; i += 1) {
        group.append('line')
          .attr('x1', (i * aR) / 3.6).attr('x2', (i * aR) / 3.6)
          .attr('y1', -h - aR * 0.22 - aR * 0.34).attr('y2', -h - aR * 0.22 + aR * 0.34)
          .attr('stroke', 'rgba(0,0,0,.24)').attr('stroke-width', 1.1);
      }
    }
    group.append('ellipse').attr('cy', -h - aR * 0.66).attr('rx', aR * 0.5).attr('ry', aR * 0.2)
      .attr('fill', fill).attr('stroke', edge).attr('stroke-width', 0.9);
    group.append('path')
      .attr('d', `M ${-aR * 0.3} ${-h - aR * 0.72} Q ${-aR * 0.46} ${-h - aR * 1.3} 0 ${-h - aR * 1.55} Q ${aR * 0.46} ${-h - aR * 1.3} ${aR * 0.3} ${-h - aR * 0.72} Z`)
      .attr('fill', highlight || fill).attr('stroke', edge).attr('stroke-width', 0.9);
    group.append('line')
      .attr('y1', -h - aR * 1.5).attr('y2', -h - aR * 2.25)
      .attr('stroke', highlight || fill).attr('stroke-width', Math.max(2, w * 0.028));
    group.append('circle').attr('cy', -h - aR * 2.3).attr('r', Math.max(3, w * 0.045)).attr('fill', highlight || fill);
    if (flag) {
      group.append('path')
        .attr('d', `M 0 ${-h - aR * 2.2} Q ${w * 0.5} ${-h - aR * 2.4} ${w * 0.8} ${-h - aR * 1.6} Q ${w * 0.42} ${-h - aR * 1.5} 0 ${-h - aR * 1.62} Z`)
        .attr('fill', flagFill);
    }
  }

  return group;
}

/** Domed rooftop pavilion — the signature silhouette along the ghats. */
export function drawChhatri(parent, { x, y, size, fill, edge = 'rgba(0,0,0,.3)', highlight }) {
  const group = parent.append('g').attr('transform', `translate(${x}, ${y})`);
  group.append('rect').attr('x', -size * 1.15).attr('y', -size * 0.16).attr('width', size * 2.3).attr('height', size * 0.16).attr('fill', fill);
  for (let i = -1; i <= 1; i += 1) {
    group.append('rect')
      .attr('x', i * size * 0.82 - size * 0.07)
      .attr('y', -size * 0.86)
      .attr('width', size * 0.14)
      .attr('height', size * 0.7)
      .attr('fill', fill);
  }
  group.append('path')
    .attr('d', `M ${-size} ${-size * 0.86} Q ${-size * 0.96} ${-size * 1.62} 0 ${-size * 1.72} Q ${size * 0.96} ${-size * 1.62} ${size} ${-size * 0.86} Z`)
    .attr('fill', highlight || fill)
    .attr('stroke', edge);
  group.append('rect').attr('x', -size * 1.05).attr('y', -size * 0.94).attr('width', size * 2.1).attr('height', size * 0.1).attr('fill', fill);
  group.append('line').attr('y1', -size * 1.72).attr('y2', -size * 2).attr('stroke', highlight || fill).attr('stroke-width', 2.6);
  group.append('circle').attr('cy', -size * 2.05).attr('r', size * 0.1).attr('fill', highlight || fill);
  return group;
}

/** Cusped (multifoil) arch used across temple corridors and old-city doorways. */
export function cuspedArch(w, h, cusps = 5) {
  const r = w / cusps;
  let path = `M ${-w} 0 L ${-w} ${-h + r}`;
  for (let i = 0; i < cusps; i += 1) {
    const x0 = -w + i * 2 * r;
    const x1 = x0 + 2 * r;
    const lift = i === Math.floor(cusps / 2) ? r * 1.5 : r * 0.92;
    path += ` Q ${x0 + r} ${-h - lift} ${x1} ${-h + r}`;
  }
  return `${path} L ${w} 0 Z`;
}

/** Standing human silhouette with believable shoulders, garment flare and arms. */
export function drawPerson(parent, options) {
  const {
    x, y, height, fill, arms = 'down', opacity = 1, flip = false,
    rim, head = 'plain', stance = 'stand', hem = 0.30,
  } = options;
  const h = height;
  const group = parent
    .append('g')
    .attr('transform', `translate(${x}, ${y}) scale(${flip ? -1 : 1}, 1)`)
    .attr('fill', fill)
    .attr('opacity', opacity);

  // Proportions: shoulders wider than waist, robe flaring to the hem, then legs.
  const sh = -h * 0.795;          // shoulder line
  const wa = -h * 0.545;          // waist
  const hy = -h * hem;            // robe hem
  const shW = h * 0.128;
  const waW = h * 0.098;
  const hemW = h * 0.132;
  const legIn = h * 0.022;
  const legOut = h * 0.084;

  // Legs (drawn first so the robe overlaps them cleanly).
  const stride = stance === 'walk' ? h * 0.05 : 0;
  [-1, 1].forEach((side) => {
    const off = side * stride;
    group.append('path').attr('d', `M ${side * legIn} ${hy + h * 0.02}
      L ${side * legOut} ${hy + h * 0.02}
      Q ${side * (legOut - h * 0.012) + off} ${-h * 0.12} ${side * (legOut - h * 0.02) + off} ${-h * 0.014}
      L ${side * legIn + off - side * h * 0.008} ${-h * 0.014}
      Q ${side * legIn + off} ${-h * 0.12} ${side * legIn} ${hy + h * 0.02} Z`);
    // Foot.
    group.append('path')
      .attr('d', `M ${side * legIn + off - side * h * 0.01} ${-h * 0.018}
        L ${side * legOut + off - side * h * 0.014} ${-h * 0.018}
        Q ${side * (legOut + h * 0.024) + off} ${-h * 0.002} ${side * (legOut + h * 0.02) + off} 0
        L ${side * legIn + off - side * h * 0.016} 0 Z`);
  });

  const body = `M ${-shW * 0.62} ${sh - h * 0.048}
      Q ${-shW} ${sh - h * 0.018} ${-shW} ${sh + h * 0.012}
      Q ${-waW * 1.04} ${wa} ${-waW} ${wa + h * 0.02}
      Q ${-hemW} ${hy - h * 0.05} ${-hemW} ${hy}
      Q ${-hemW * 0.5} ${hy + h * 0.022} 0 ${hy + h * 0.018}
      Q ${hemW * 0.5} ${hy + h * 0.022} ${hemW} ${hy}
      Q ${hemW} ${hy - h * 0.05} ${waW} ${wa + h * 0.02}
      Q ${waW * 1.04} ${wa} ${shW} ${sh + h * 0.012}
      Q ${shW} ${sh - h * 0.018} ${shW * 0.62} ${sh - h * 0.048}
      Q 0 ${sh - h * 0.086} ${-shW * 0.62} ${sh - h * 0.048} Z`;

  const bodyPath = group.append('path').attr('d', body);
  if (rim) {
    bodyPath.attr('stroke', rim).attr('stroke-width', Math.max(0.6, h * 0.009)).attr('stroke-opacity', 0.7).attr('stroke-linejoin', 'round');
  }

  // Neck.
  group.append('path').attr('d', `M ${-h * 0.026} ${-h * 0.88} h ${h * 0.052} v ${h * 0.05} h ${-h * 0.052} Z`);
  const headShape = group.append('ellipse')
    .attr('cy', -h * 0.918).attr('rx', h * 0.052).attr('ry', h * 0.058);
  if (rim) headShape.attr('stroke', rim).attr('stroke-width', Math.max(0.7, h * 0.01)).attr('stroke-opacity', 0.55);

  if (head === 'bun') {
    group.append('circle').attr('cx', -h * 0.05).attr('cy', -h * 0.952).attr('r', h * 0.026);
  } else if (head === 'veil') {
    group.append('path')
      .attr('d', `M ${-h * 0.076} ${-h * 0.928} Q 0 ${-h * 1.0} ${h * 0.076} ${-h * 0.928}
        Q ${h * 0.094} ${-h * 0.83} ${h * 0.108} ${-h * 0.7}
        Q 0 ${-h * 0.74} ${-h * 0.108} ${-h * 0.7}
        Q ${-h * 0.094} ${-h * 0.83} ${-h * 0.076} ${-h * 0.928} Z`);
  } else if (head === 'turban') {
    group.append('ellipse').attr('cy', -h * 0.955).attr('rx', h * 0.068).attr('ry', h * 0.04);
  } else if (head === 'shaved') {
    group.append('path').attr('d', `M ${-h * 0.052} ${-h * 0.93} q ${h * 0.052} ${-h * 0.036} ${h * 0.104} 0 Z`)
      .attr('opacity', 0.45);
  }

  if (arms === 'namaste') {
    group.append('path')
      .attr('d', `M ${-shW * 0.92} ${sh + h * 0.02} Q ${-shW * 1.6} ${-h * 0.66} ${-h * 0.042} ${-h * 0.615}
        L ${h * 0.042} ${-h * 0.615} Q ${shW * 1.6} ${-h * 0.66} ${shW * 0.92} ${sh + h * 0.02}
        L ${shW * 0.5} ${sh + h * 0.03} Q ${shW * 1.1} ${-h * 0.68} 0 ${-h * 0.652}
        Q ${-shW * 1.1} ${-h * 0.68} ${-shW * 0.5} ${sh + h * 0.03} Z`);
    group.append('path').attr('d', `M ${-h * 0.03} ${-h * 0.66} q ${h * 0.03} ${-h * 0.04} ${h * 0.06} 0 l ${-h * 0.03} ${h * 0.05} Z`)
      .attr('fill', rim || '#ffd9a0').attr('opacity', 0.5);
  } else if (arms === 'raised') {
    [-1, 1].forEach((side) => {
      group.append('path')
        .attr('d', `M ${side * shW * 0.9} ${sh + h * 0.02} Q ${side * h * 0.23} ${-h * 0.88} ${side * h * 0.14} ${-h * 1.04}
          L ${side * h * 0.082} ${-h * 1.02} Q ${side * h * 0.14} ${-h * 0.88} ${side * shW * 0.42} ${sh + h * 0.03} Z`);
    });
  } else if (arms === 'none') {
    // Caller draws bespoke arms (e.g. a priest holding an aarti lamp aloft).
  } else if (arms === 'carry') {
    group.append('path')
      .attr('d', `M ${-shW * 0.9} ${sh + h * 0.02} Q ${-h * 0.2} ${-h * 0.64} ${-h * 0.155} ${-h * 0.5}
        L ${-h * 0.095} ${-h * 0.51} Q ${-h * 0.125} ${-h * 0.64} ${-shW * 0.42} ${sh + h * 0.03} Z`);
    group.append('path')
      .attr('d', `M ${shW * 0.9} ${sh + h * 0.02} Q ${h * 0.24} ${-h * 0.82} ${h * 0.185} ${-h * 0.915}
        L ${h * 0.125} ${-h * 0.895} Q ${h * 0.145} ${-h * 0.82} ${shW * 0.42} ${sh + h * 0.03} Z`);
  } else {
    [-1, 1].forEach((side, i) => {
      const swing = stance === 'walk' ? (i === 0 ? -h * 0.03 : h * 0.03) : 0;
      group.append('path')
        .attr('d', `M ${side * shW * 0.92} ${sh + h * 0.015}
          Q ${side * h * 0.15} ${-h * 0.63} ${side * h * 0.118 + swing} ${-h * 0.44}
          L ${side * h * 0.062 + swing} ${-h * 0.45}
          Q ${side * h * 0.092} ${-h * 0.63} ${side * shW * 0.44} ${sh + h * 0.03} Z`);
    });
  }
  return group;
}

/** Scalloped foliage mass — reads as leaves, not a circle. */
function leafBlob(cx, cy, r, lobes, rnd) {
  const pts = [];
  for (let i = 0; i < lobes; i += 1) {
    const a = (i / lobes) * Math.PI * 2;
    const rr = r * (0.76 + rnd(0, 0.36));
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.84]);
  }
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < lobes; i += 1) {
    const p = pts[i];
    const q = pts[(i + 1) % lobes];
    const mx = (p[0] + q[0]) / 2;
    const my = (p[1] + q[1]) / 2;
    const nx = mx - cx;
    const ny = my - cy;
    const len = Math.hypot(nx, ny) || 1;
    const bulge = r * 0.36;
    d += ` Q ${(mx + (nx / len) * bulge).toFixed(1)} ${(my + (ny / len) * bulge).toFixed(1)} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
  }
  return `${d} Z`;
}

/** Branching tree with lit and shaded canopy layers. */
export function drawTree(parent, options) {
  const { x, y, height, trunk, canopy, rnd, lean = 0, light = 1, highlight } = options;
  const group = parent.append('g').attr('transform', `translate(${x}, ${y})`);
  const h = height;
  const base = d3.color(canopy);
  const dark = String(base.darker(0.9));
  const hi = highlight || String(base.brighter(0.65));
  const forkX = lean * h * 0.1;

  group.append('path')
    .attr('d', `M ${-h * 0.068} 0 Q ${-h * 0.04} ${-h * 0.16} ${-h * 0.03} ${-h * 0.36}
      Q ${-h * 0.024} ${-h * 0.5} ${forkX - h * 0.018} ${-h * 0.6}
      L ${forkX + h * 0.018} ${-h * 0.6}
      Q ${h * 0.024} ${-h * 0.5} ${h * 0.03} ${-h * 0.36}
      Q ${h * 0.04} ${-h * 0.16} ${h * 0.068} 0 Z`)
    .attr('fill', trunk);

  const branch = (px, py, angle, len, width, depth) => {
    const ex = px + Math.cos(angle) * len;
    const ey = py + Math.sin(angle) * len;
    const cx = px + Math.cos(angle - 0.24) * len * 0.55;
    const cy = py + Math.sin(angle - 0.24) * len * 0.55;
    group.append('path')
      .attr('d', `M ${px.toFixed(1)} ${py.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`)
      .attr('fill', 'none').attr('stroke', trunk)
      .attr('stroke-width', Math.max(1, width)).attr('stroke-linecap', 'round');
    if (depth > 0) {
      branch(ex, ey, angle - rnd(0.3, 0.62), len * rnd(0.54, 0.72), width * 0.58, depth - 1);
      branch(ex, ey, angle + rnd(0.3, 0.62), len * rnd(0.54, 0.72), width * 0.58, depth - 1);
    }
  };
  branch(forkX, -h * 0.58, -Math.PI / 2 - 0.46, h * 0.18, h * 0.028, 2);
  branch(forkX, -h * 0.58, -Math.PI / 2 + 0.44, h * 0.18, h * 0.028, 2);
  branch(forkX, -h * 0.61, -Math.PI / 2 + lean * 0.2, h * 0.2, h * 0.03, 2);

  // Canopy: an irregular, lopsided mass rather than a tidy ball of broccoli.
  const mid = String(base.darker(0.34));
  const clusters = [];
  const lobes = 13;
  for (let i = 0; i < lobes; i += 1) {
    const a = (i / lobes) * Math.PI * 2 + rnd(-0.2, 0.2);
    const rad = 0.3 + rnd(0, 0.16);
    clusters.push([
      Math.cos(a) * rad * (1.18 + lean * 0.4) + lean * 0.1,
      -0.8 + Math.sin(a) * rad * 0.72,
      0.1 + rnd(0, 0.11),
    ]);
  }
  clusters.push([lean * 0.1, -0.82, 0.29], [lean * 0.1 - 0.2, -0.72, 0.22], [lean * 0.1 + 0.22, -0.76, 0.21]);
  // Sort back-to-front so the lit lobes stack on the sun side.
  clusters.sort((a, b) => (a[0] * light) - (b[0] * light));

  // Soft under-shadow anchoring the whole mass.
  group.append('path')
    .attr('d', leafBlob(lean * h * 0.1, -h * 0.74, h * 0.46, 11, rnd))
    .attr('fill', dark).attr('opacity', 0.9);

  clusters.forEach(([cx, cy, cr]) => {
    group.append('path').attr('d', leafBlob(h * cx, h * cy, h * cr * 1.06, 9, rnd)).attr('fill', dark);
    group.append('path').attr('d', leafBlob(h * cx - light * h * cr * 0.14, h * cy + h * cr * 0.1, h * cr * 0.88, 8, rnd)).attr('fill', mid);
    group.append('path').attr('d', leafBlob(h * cx + light * h * cr * 0.1, h * cy - h * cr * 0.04, h * cr * 0.66, 8, rnd)).attr('fill', canopy);
    group.append('path').attr('d', leafBlob(h * cx + light * h * cr * 0.3, h * cy - h * cr * 0.26, h * cr * 0.36, 7, rnd)).attr('fill', hi).attr('opacity', 0.8);
  });

  // Individual leaf sprigs breaking the silhouette so the edge is not a smooth arc.
  for (let i = 0; i < 26; i += 1) {
    const a = rnd(0, Math.PI * 2);
    const rad = h * (0.4 + rnd(0, 0.1));
    const sx = lean * h * 0.1 + Math.cos(a) * rad * 1.16;
    const sy = -h * 0.8 + Math.sin(a) * rad * 0.78;
    const s = h * rnd(0.016, 0.03);
    group.append('path')
      .attr('d', `M ${sx.toFixed(1)} ${sy.toFixed(1)} q ${s * 1.6} ${-s * 1.2} ${s * 2.6} ${-s * 0.2} q ${-s * 1.2} ${s * 1.4} ${-s * 2.6} ${s * 0.2} Z`)
      .attr('transform', `rotate(${(a * 180) / Math.PI}, ${sx.toFixed(1)}, ${sy.toFixed(1)})`)
      .attr('fill', Math.cos(a) * light > 0 ? hi : dark)
      .attr('opacity', rnd(0.55, 0.95));
  }
  return group;
}

/** Multi-storey ghat facade: cornices, arcades, jharokha balconies, parapets. */
export function drawGhatBlock(parent, options) {
  const {
    x, y, w, h, fill, trim, rnd, lit = false, litColor = '#ffce7d',
    shadeSide = -1, detail = true,
  } = options;
  const group = parent.append('g').attr('transform', `translate(${x}, ${y})`);
  const half = w / 2;

  group.append('rect').attr('x', -half).attr('y', -h).attr('width', w).attr('height', h).attr('fill', fill);
  // Shaded flank so the facade has a light direction.
  group.append('rect')
    .attr('x', shadeSide < 0 ? -half : half - w * 0.26)
    .attr('y', -h).attr('width', w * 0.26).attr('height', h)
    .attr('fill', '#000').attr('opacity', 0.16);

  const floors = Math.max(2, Math.round(h / 62));
  const fh = h / floors;
  for (let f = 0; f < floors; f += 1) {
    const fy = -h + f * fh;
    // Cornice slab with a shadow lip.
    group.append('rect').attr('x', -half - 5).attr('y', fy + fh - 13).attr('width', w + 10).attr('height', 7).attr('fill', trim);
    group.append('rect').attr('x', -half - 5).attr('y', fy + fh - 6).attr('width', w + 10).attr('height', 4)
      .attr('fill', '#000').attr('opacity', 0.24);

    const bays = Math.max(2, Math.floor(w / 42));
    for (let b = 0; b < bays; b += 1) {
      const bx = -half + (w / bays) * (b + 0.5);
      const isLit = lit && rnd(0, 1) > 0.45;
      group.append('path')
        .attr('d', cuspedArch((w / bays) * 0.28, fh * 0.46, 3))
        .attr('transform', `translate(${bx}, ${fy + fh - 15})`)
        .attr('fill', isLit ? litColor : 'rgba(0,0,0,.5)')
        .attr('opacity', isLit ? 0.9 : 0.55);
      if (detail && isLit) {
        group.append('rect')
          .attr('x', bx - (w / bays) * 0.3).attr('y', fy + fh - 15).attr('width', (w / bays) * 0.6).attr('height', 4)
          .attr('fill', litColor).attr('opacity', 0.5);
      }
    }

    // Occasional projecting jharokha balcony with support brackets.
    if (detail && f > 0 && rnd(0, 1) > 0.55) {
      const bw = w * rnd(0.3, 0.5);
      const bx = rnd(-half + bw / 2, half - bw / 2);
      const by = fy + fh - 16;
      group.append('rect').attr('x', bx - bw / 2).attr('y', by).attr('width', bw).attr('height', 6).attr('fill', trim);
      group.append('rect').attr('x', bx - bw / 2).attr('y', by - 15).attr('width', bw).attr('height', 15)
        .attr('fill', '#000').attr('opacity', 0.22);
      for (let k = 0; k < 5; k += 1) {
        group.append('rect')
          .attr('x', bx - bw / 2 + (bw / 5) * k + 2).attr('y', by - 14).attr('width', 2).attr('height', 14)
          .attr('fill', trim).attr('opacity', 0.8);
      }
      [-1, 1].forEach((s) => {
        group.append('path')
          .attr('d', `M ${bx + (s * bw) / 2} ${by + 6} q ${-s * 6} 8 ${-s * 14} 10 L ${bx + (s * bw) / 2} ${by + 6} Z`)
          .attr('fill', trim).attr('opacity', 0.7);
      });
    }
  }

  // Roofline: cornice, parapet with merlons.
  group.append('rect').attr('x', -half - 7).attr('y', -h - 8).attr('width', w + 14).attr('height', 10).attr('fill', trim);
  if (detail) {
    const merlons = Math.max(3, Math.floor(w / 17));
    for (let m = 0; m < merlons; m += 1) {
      const mx = -half - 4 + ((w + 8) / merlons) * m;
      group.append('path')
        .attr('d', `M ${mx} ${-h - 8} L ${mx} ${-h - 15} Q ${mx + (w + 8) / merlons / 2} ${-h - 24} ${mx + (w + 8) / merlons - 2} ${-h - 15} L ${mx + (w + 8) / merlons - 2} ${-h - 8} Z`)
        .attr('fill', trim);
    }
  }
  return group;
}
