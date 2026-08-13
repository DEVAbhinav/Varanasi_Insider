import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { drawPerson, drawShikhara, cuspedArch } from '../VaranasiScrollJourney/artPrimitives';
import styles from './GangaAartiScene.module.css';

const WIDTH = 1600;
const HEIGHT = 1000;
const WATERLINE = 684;

function addLinearGradient(defs, id, stops, attrs = {}) {
  const gradient = defs.append('linearGradient').attr('id', id);
  Object.entries(attrs).forEach(([key, value]) => gradient.attr(key, value));
  stops.forEach(([offset, color, opacity = 1]) => {
    gradient.append('stop').attr('offset', offset).attr('stop-color', color).attr('stop-opacity', opacity);
  });
}

function addRadialGradient(defs, id, stops) {
  const gradient = defs.append('radialGradient').attr('id', id);
  stops.forEach(([offset, color, opacity = 1]) => {
    gradient.append('stop').attr('offset', offset).attr('stop-color', color).attr('stop-opacity', opacity);
  });
}

/** Tall arched opening — the window shape that reads as riverfront Varanasi. */
function archWindow(parent, x, y, w, h, fill, opacity = 1) {
  const r = w / 2;
  return parent
    .append('path')
    .attr('d', `M ${x} ${y} L ${x} ${y - h + r} Q ${x} ${y - h} ${x + r} ${y - h} Q ${x + w} ${y - h} ${x + w} ${y - h + r} L ${x + w} ${y} Z`)
    .attr('fill', fill)
    .attr('opacity', opacity);
}

/**
 * A riverfront ghat haveli: arcaded water storey, stacked floors of arched
 * windows, string courses, parapet merlons and the occasional balcony.
 */
function ghatPalace(parent, o) {
  const {
    x, base, w, h, body, trim, glowFill, rnd,
    floors = 3, arcade = true, parapet = true, jharokha = false, light = 1,
  } = o;
  const g = parent.append('g');
  const top = base - h;
  const arcH = arcade ? h * 0.3 : 0;
  const parH = parapet ? h * 0.11 : 0;

  g.append('rect').attr('x', x).attr('y', top).attr('width', w).attr('height', h).attr('fill', body);
  g.append('rect').attr('x', x + w * 0.66).attr('y', top).attr('width', w * 0.34).attr('height', h)
    .attr('fill', '#100819').attr('opacity', 0.36);
  g.append('rect').attr('x', x).attr('y', top).attr('width', w * 0.09).attr('height', h)
    .attr('fill', '#ffb066').attr('opacity', 0.06 * light);

  if (arcade) {
    const n = Math.max(2, Math.round(w / 66));
    const aw = w / n;
    for (let i = 0; i < n; i += 1) {
      const cx = x + aw * (i + 0.5);
      const lit = rnd() > 0.52;
      if (lit) {
        g.append('path').attr('d', cuspedArch(aw * 0.38, arcH * 0.76, 3))
          .attr('transform', `translate(${cx}, ${base - h * 0.03})`)
          .attr('fill', glowFill).attr('opacity', 0.24 * light).attr('filter', 'url(#softBlur)');
      }
      g.append('path').attr('d', cuspedArch(aw * 0.3, arcH * 0.7, 3))
        .attr('transform', `translate(${cx}, ${base - h * 0.03})`)
        .attr('fill', '#0b0613').attr('opacity', 0.88);
      if (lit) {
        g.append('path').attr('d', cuspedArch(aw * 0.3, arcH * 0.24, 3))
          .attr('transform', `translate(${cx}, ${base - h * 0.03})`)
          .attr('fill', glowFill).attr('opacity', 0.4 * light);
      }
    }
    g.append('rect').attr('x', x - 3).attr('y', base - h * 0.03 - arcH * 0.7 - 9)
      .attr('width', w + 6).attr('height', 7).attr('fill', trim).attr('opacity', 0.7);
  }

  const bandH = (h - arcH - parH) / floors;
  for (let f = 0; f < floors; f += 1) {
    const fy = top + parH + bandH * (f + 1);
    const n = Math.max(2, Math.round(w / 46));
    const cw = w / n;
    for (let i = 0; i < n; i += 1) {
      const wx = x + cw * i + cw * 0.3;
      const ww = cw * 0.4;
      const wh = bandH * 0.56;
      const lit = rnd() > 0.44;
      if (lit) {
        archWindow(g, wx - 5, fy - bandH * 0.16 + 4, ww + 10, wh + 8, glowFill, 0.16 * light)
          .attr('filter', 'url(#softBlur)');
      }
      archWindow(g, wx, fy - bandH * 0.16, ww, wh, lit ? glowFill : '#0a0512', lit ? 0.42 + 0.34 * light * rnd() : 0.86);
      if (lit) {
        archWindow(g, wx + ww * 0.18, fy - bandH * 0.16, ww * 0.64, wh * 0.5, '#fff0c0', 0.3 * light);
      }
    }
    g.append('rect').attr('x', x - 4).attr('y', fy - 2).attr('width', w + 8).attr('height', 4)
      .attr('fill', trim).attr('opacity', 0.4);
  }

  if (jharokha) {
    const bx = x + w * 0.5;
    const by = top + parH + bandH * 1.06;
    g.append('path')
      .attr('d', `M ${bx - w * 0.21} ${by} L ${bx + w * 0.21} ${by} L ${bx + w * 0.16} ${by + 19} L ${bx - w * 0.16} ${by + 19} Z`)
      .attr('fill', '#150c20');
    g.append('rect').attr('x', bx - w * 0.23).attr('y', by - 6).attr('width', w * 0.46).attr('height', 7)
      .attr('fill', trim).attr('opacity', 0.85);
    for (let i = 0; i < 5; i += 1) {
      g.append('rect').attr('x', bx - w * 0.19 + (w * 0.38 * i) / 4).attr('y', by).attr('width', 2.4).attr('height', 15)
        .attr('fill', trim).attr('opacity', 0.5);
    }
    g.append('path')
      .attr('d', `M ${bx - w * 0.24} ${by - 6} Q ${bx} ${by - 34} ${bx + w * 0.24} ${by - 6} Z`)
      .attr('fill', trim).attr('opacity', 0.55);
  }

  if (parapet) {
    g.append('rect').attr('x', x - 7).attr('y', top).attr('width', w + 14).attr('height', parH * 0.46)
      .attr('fill', trim).attr('opacity', 0.9);
    const m = Math.max(3, Math.round(w / 27));
    for (let i = 0; i < m; i += 1) {
      g.append('path')
        .attr('d', `M ${x - 5 + ((w + 10) * (i + 0.16)) / m} ${top} l 0 -7 q ${((w + 10) / m) * 0.24} -7 ${((w + 10) / m) * 0.48} 0 l 0 7 Z`)
        .attr('fill', trim).attr('opacity', 0.82);
    }
  }
  return g;
}

/** Tiered brass aarti lamp (panchpradip) — the true silhouette of the rite. */
function aartiLamp(parent, tiers, flamePathFn, pushFlame, seedPhase) {
  const g = parent.append('g');
  const stemTop = -tiers[tiers.length - 1].y;
  g.append('rect').attr('x', -4.5).attr('y', stemTop).attr('width', 9).attr('height', 74 - stemTop)
    .attr('rx', 3).attr('fill', 'url(#brassGradient)');
  g.append('ellipse').attr('cy', 74).attr('rx', 17).attr('ry', 5.5).attr('fill', 'url(#brassGradient)');
  g.append('ellipse').attr('cy', 68).attr('rx', 11).attr('ry', 4).attr('fill', '#8d5a24');

  tiers.forEach((tier, ti) => {
    const { r, y, n } = tier;
    const ry = r * 0.3;
    // Back rim wicks read behind the bowl and sell the roundness.
    for (let i = 0; i < n - 1; i += 1) {
      const a = Math.PI + (Math.PI * (i + 0.5)) / (n - 1);
      const fx = Math.cos(a) * r * 0.92;
      const fy = -y + Math.sin(a) * ry;
      const back = g.append('g').datum({ x: fx, y: fy, scale: 0.2, phase: seedPhase + ti * 1.7 + i * 0.83 })
        .attr('class', styles.ceremonyFlame).attr('opacity', 0.62);
      back.append('path').attr('d', flamePathFn()).attr('fill', 'url(#flameGradient)');
      pushFlame(back);
    }
    // The bowl itself.
    g.append('path')
      .attr('d', `M ${-r} ${-y} A ${r} ${ry} 0 0 0 ${r} ${-y} L ${r * 0.7} ${-y + r * 0.34} Q 0 ${-y + r * 0.52} ${-r * 0.7} ${-y + r * 0.34} Z`)
      .attr('fill', 'url(#brassGradient)');
    g.append('path')
      .attr('d', `M ${-r} ${-y} A ${r} ${ry} 0 0 0 ${r} ${-y} A ${r} ${ry} 0 0 0 ${-r} ${-y} Z`)
      .attr('fill', '#5f3413').attr('opacity', 0.65);
    g.append('path')
      .attr('d', `M ${-r} ${-y} A ${r} ${ry} 0 0 0 ${r} ${-y}`)
      .attr('fill', 'none').attr('stroke', '#ffc978').attr('stroke-width', 2).attr('stroke-opacity', 0.85);
    g.append('path')
      .attr('d', `M ${-r * 0.86} ${-y + r * 0.1} Q 0 ${-y + r * 0.44} ${r * 0.86} ${-y + r * 0.1}`)
      .attr('fill', 'none').attr('stroke', '#ffcf86').attr('stroke-width', 1.4).attr('stroke-opacity', 0.4);
    // Front rim wicks.
    for (let i = 0; i < n; i += 1) {
      const a = (Math.PI * i) / (n - 1);
      const fx = Math.cos(a) * r * 0.94;
      const fy = -y + Math.sin(a) * ry;
      const fl = g.append('g').datum({ x: fx, y: fy, scale: 0.26, phase: seedPhase + ti * 2.3 + i * 1.11 })
        .attr('class', styles.ceremonyFlame);
      fl.append('path').attr('class', styles.flameAura).attr('d', flamePathFn())
        .attr('fill', '#ff7a2a').attr('opacity', 0.3).attr('filter', 'url(#fireGlow)');
      fl.append('path').attr('class', styles.flameBody).attr('d', flamePathFn()).attr('fill', 'url(#flameGradient)');
      fl.append('path').attr('d', 'M 0 0 C -7 -18 -4 -36 3 -49 C 9 -28 11 -17 8 0 Z').attr('fill', '#fffbd7');
      pushFlame(fl);
    }
  });

  const crown = g.append('g').datum({ x: 0, y: stemTop - 10, scale: 0.42, phase: seedPhase + 5.1 })
    .attr('class', styles.ceremonyFlame);
  crown.append('path').attr('class', styles.flameAura).attr('d', flamePathFn())
    .attr('fill', '#ff9433').attr('opacity', 0.34).attr('filter', 'url(#fireGlow)');
  crown.append('path').attr('class', styles.flameBody).attr('d', flamePathFn()).attr('fill', 'url(#flameGradient)');
  crown.append('path').attr('d', 'M 0 0 C -7 -18 -4 -36 3 -49 C 9 -28 11 -17 8 0 Z').attr('fill', '#fffbd7');
  pushFlame(crown);
  return g;
}

function flamePath(lean = 0) {
  return `M 0 0 C ${-17 + lean} -27, ${-12 + lean} -59, ${2 + lean} -83 C ${9 + lean} -56, ${27 + lean} -39, 16 0 Z`;
}

function drawDiya(layer, datum, interactive = false) {
  const diya = layer
    .append('g')
    .datum(datum)
    .attr('class', `${styles.diya} ${interactive ? styles.offeredDiya : ''}`);

  diya
    .append('ellipse')
    .attr('cx', 0)
    .attr('cy', 9)
    .attr('rx', 24)
    .attr('ry', 7)
    .attr('fill', '#080d2a')
    .attr('opacity', 0.38);
  diya
    .append('path')
    .attr('d', 'M -18 0 Q 0 18 18 0 Q 0 7 -18 0')
    .attr('fill', 'url(#clayGradient)')
    .attr('stroke', '#ffc15c')
    .attr('stroke-width', 1);
  diya
    .append('path')
    .attr('class', styles.diyaFlame)
    .attr('d', flamePath())
    .attr('transform', 'translate(0, 1) scale(.17)')
    .attr('fill', 'url(#flameGradient)')
    .attr('filter', 'url(#fireGlow)');
  diya
    .append('ellipse')
    .attr('cy', 3)
    .attr('rx', 34)
    .attr('ry', 5)
    .attr('fill', '#ff8a22')
    .attr('opacity', 0.1)
    .attr('filter', 'url(#softBlur)');

  return diya;
}

export default function GangaAartiScene() {
  const svgRef = useRef(null);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
      .attr('preserveAspectRatio', 'xMidYMid slice');

    svg.selectAll('*').remove();

    svg.append('title').attr('id', 'aarti-scene-title').text('Ganga Aarti at Dashashwamedh Ghat');
    svg
      .append('desc')
      .attr('id', 'aarti-scene-description')
      .text('An animated twilight ceremony with priests, sacred lamps, old Varanasi ghats, and diyas floating on the Ganges.');

    const random = d3.randomLcg(0.387);
    const between = (min, max) => min + random() * (max - min);
    const defs = svg.append('defs');

    addLinearGradient(defs, 'skyGradient', [
      ['0%', '#05071a'],
      ['30%', '#15103d'],
      ['62%', '#5f2149'],
      ['82%', '#c14a3c'],
      ['100%', '#f29b52'],
    ], { x1: '0%', y1: '0%', x2: '0%', y2: '100%' });
    addLinearGradient(defs, 'waterGradient', [
      ['0%', '#2f1735'],
      ['18%', '#101330'],
      ['64%', '#07152b'],
      ['100%', '#020714'],
    ], { x1: '0%', y1: '0%', x2: '0%', y2: '100%' });
    addLinearGradient(defs, 'stepGradient', [
      ['0%', '#5c2630'],
      ['42%', '#2c1728'],
      ['100%', '#0d0d1c'],
    ], { x1: '0%', y1: '0%', x2: '0%', y2: '100%' });
    addLinearGradient(defs, 'platformGradient', [
      ['0%', '#bb692f'],
      ['26%', '#6f321f'],
      ['100%', '#25101a'],
    ], { x1: '0%', y1: '0%', x2: '0%', y2: '100%' });
    addLinearGradient(defs, 'priestGradient', [
      ['0%', '#fff0c5'],
      ['58%', '#dfb06e'],
      ['100%', '#9c4f2b'],
    ], { x1: '0%', y1: '0%', x2: '100%', y2: '100%' });
    addLinearGradient(defs, 'saffronGradient', [
      ['0%', '#ffb13b'],
      ['55%', '#d54c1b'],
      ['100%', '#7a1c20'],
    ], { x1: '0%', y1: '0%', x2: '0%', y2: '100%' });
    addLinearGradient(defs, 'flameGradient', [
      ['0%', '#fffbd6'],
      ['28%', '#fff078'],
      ['62%', '#ff7b19'],
      ['100%', '#d31816', 0.15],
    ], { x1: '0%', y1: '100%', x2: '0%', y2: '0%' });
    addLinearGradient(defs, 'clayGradient', [
      ['0%', '#ffb044'],
      ['45%', '#b94a28'],
      ['100%', '#5d1d22'],
    ], { x1: '0%', y1: '0%', x2: '0%', y2: '100%' });
    addLinearGradient(defs, 'brassGradient', [
      ['0%', '#ffdf9d'],
      ['34%', '#e0a56b'],
      ['100%', '#6d3a15'],
    ], { x1: '0%', y1: '0%', x2: '100%', y2: '0%' });
    addRadialGradient(defs, 'sunsetHalo', [
      ['0%', '#ffd890', 0.75],
      ['32%', '#ff934d', 0.27],
      ['100%', '#ee4e55', 0],
    ]);
    addLinearGradient(defs, 'canopyGradient', [
      ['0%', '#7d2b36'],
      ['52%', '#571d2c'],
      ['100%', '#33101f'],
    ], { x1: '0%', y1: '0%', x2: '0%', y2: '100%' });
    addRadialGradient(defs, 'lampGlow', [
      ['0%', '#ffd98a', 0.44],
      ['38%', '#ff8f34', 0.17],
      ['100%', '#c62d3a', 0],
    ]);
    addLinearGradient(defs, 'leftScrim', [
      ['0%', '#08040f', 0.62],
      ['46%', '#0b0514', 0.32],
      ['100%', '#0b0514', 0],
    ], { x1: '0%', y1: '0%', x2: '100%', y2: '0%' });
    addRadialGradient(defs, 'ceremonyGlow', [
      ['0%', '#ffcb67', 0.38],
      ['45%', '#ee632f', 0.13],
      ['100%', '#c52c40', 0],
    ]);

    const glow = defs.append('filter').attr('id', 'fireGlow').attr('x', '-200%').attr('y', '-200%').attr('width', '400%').attr('height', '400%');
    glow.append('feGaussianBlur').attr('stdDeviation', 8).attr('result', 'blur');
    const glowMerge = glow.append('feMerge');
    glowMerge.append('feMergeNode').attr('in', 'blur');
    glowMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const softBlur = defs.append('filter').attr('id', 'softBlur').attr('x', '-100%').attr('y', '-100%').attr('width', '300%').attr('height', '300%');
    softBlur.append('feGaussianBlur').attr('stdDeviation', 16);

    const reflectionBlur = defs.append('filter').attr('id', 'reflectionBlur');
    reflectionBlur.append('feGaussianBlur').attr('stdDeviation', 2.5);

    const vignette = defs.append('radialGradient').attr('id', 'vignette');
    vignette.append('stop').attr('offset', '46%').attr('stop-color', '#000').attr('stop-opacity', 0);
    vignette.append('stop').attr('offset', '100%').attr('stop-color', '#000').attr('stop-opacity', 0.74);

    const sky = svg.append('g').attr('class', styles.skyLayer);
    sky.append('rect').attr('width', WIDTH).attr('height', HEIGHT).attr('fill', 'url(#skyGradient)');
    sky.append('ellipse').attr('cx', 1090).attr('cy', 380).attr('rx', 440).attr('ry', 350).attr('fill', 'url(#sunsetHalo)');
    sky.append('circle').attr('cx', 1418).attr('cy', 178).attr('r', 46).attr('fill', '#ffd18b').attr('opacity', 0.5).attr('filter', 'url(#softBlur)');
    sky.append('circle').attr('cx', 1418).attr('cy', 178).attr('r', 21).attr('fill', '#ffeec4').attr('opacity', 0.85);
    sky.append('circle').attr('cx', 1424).attr('cy', 172).attr('r', 18).attr('fill', '#f6dfae').attr('opacity', 0.25);
    // High cirrus catching the last of the sun.
    [[210, 236, 340, 9], [520, 190, 250, 6], [980, 250, 420, 11], [1240, 316, 300, 8]].forEach(([cx, cy, cw, ch]) => {
      sky.append('path')
        .attr('d', `M ${cx - cw / 2} ${cy} Q ${cx - cw * 0.2} ${cy - ch} ${cx + cw * 0.12} ${cy - ch * 0.4} Q ${cx + cw * 0.36} ${cy + ch * 0.5} ${cx + cw / 2} ${cy} Q ${cx} ${cy + ch * 1.4} ${cx - cw / 2} ${cy} Z`)
        .attr('fill', '#f0a06b')
        .attr('opacity', 0.11);
    });

    const stars = d3.range(78).map(() => ({
      x: between(20, WIDTH - 20),
      y: between(24, 390),
      r: between(0.45, 1.7),
      opacity: between(0.14, 0.75),
      phase: between(0, Math.PI * 2),
    }));
    sky
      .selectAll(`.${styles.star}`)
      .data(stars)
      .join('circle')
      .attr('class', styles.star)
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('r', (d) => d.r)
      .attr('fill', '#ffe9c8')
      .attr('opacity', (d) => d.opacity);

    // ================= Layered ghat architecture ==========================
    const city = svg.append('g').attr('class', styles.cityLayer);

    // Farthest ridge of the old city: no detail, just a hazy sawtooth of roofs.
    const farLayer = city.append('g').attr('opacity', 0.9);
    let fx = -60;
    let farPath = 'M -60 560 L -60 470';
    while (fx < WIDTH + 60) {
      const bw = between(44, 128);
      const by = between(388, 462);
      farPath += ` L ${fx} ${by} L ${fx + bw} ${by}`;
      fx += bw;
    }
    farPath += ` L ${fx} 560 Z`;
    farLayer.append('path').attr('d', farPath).attr('fill', '#241534');
    farLayer.append('path').attr('d', farPath).attr('fill', '#7a4a86').attr('opacity', 0.16);
    [[128, 404, 40, 96], [612, 396, 34, 82], [1088, 386, 44, 104], [1470, 410, 32, 74]].forEach(([tx, ty, tw, th]) => {
      drawShikhara(farLayer, {
        x: tx, y: ty, w: tw, h: th, fill: '#291838', highlight: '#3d2049', edge: 'rgba(0,0,0,.35)',
        detail: false, urushringa: false, finial: true,
      });
    });
    farLayer.append('rect').attr('x', 0).attr('y', 360).attr('width', WIDTH).attr('height', 200)
      .attr('fill', 'url(#sunsetHalo)').attr('opacity', 0.28);

    // Mid layer: the riverfront havelis that actually make it Varanasi.
    const midLayer = city.append('g');
    const palettes = [
      { body: '#472038', trim: '#8d4b45', glow: '#ffb861' },
      { body: '#3a1a30', trim: '#7d423f', glow: '#ffc477' },
      { body: '#52243a', trim: '#9c5748', glow: '#ffae55' },
      { body: '#331629', trim: '#6f3a3a', glow: '#ffbc6b' },
    ];
    const palaces = [
      { x: -40, w: 196, h: 240, floors: 3, jharokha: true },
      { x: 152, w: 128, h: 188, floors: 2 },
      { x: 276, w: 172, h: 272, floors: 3, jharokha: true },
      { x: 444, w: 116, h: 202, floors: 2 },
      { x: 556, w: 190, h: 252, floors: 3 },
      { x: 742, w: 134, h: 192, floors: 2, jharokha: true },
      { x: 872, w: 178, h: 268, floors: 3 },
      { x: 1046, w: 124, h: 198, floors: 2 },
      { x: 1166, w: 188, h: 246, floors: 3, jharokha: true },
      { x: 1350, w: 146, h: 206, floors: 2 },
      { x: 1492, w: 156, h: 258, floors: 3 },
    ];
    // Dark slots between blocks so the row never reads as one continuous wall.
    [148, 440, 738, 1042, 1346].forEach((sx) => {
      midLayer.append('rect').attr('x', sx - 4).attr('y', 300).attr('width', 16).attr('height', 258)
        .attr('fill', '#0d0714').attr('opacity', 0.72);
    });
    palaces.forEach((palace, index) => {
      const pal = palettes[index % palettes.length];
      ghatPalace(midLayer, {
        ...palace,
        base: 558,
        body: pal.body,
        trim: pal.trim,
        glowFill: pal.glow,
        rnd: random,
        light: 0.55 + (palace.x + palace.w / 2) / WIDTH * 0.75,
      });
    });

    // Temple spires rising out of the roofline.
    [
      { x: 362, y: 288, w: 62, h: 158, flag: true },
      { x: 962, y: 292, w: 70, h: 176, flag: true },
      { x: 1258, y: 314, w: 52, h: 126, flag: false },
      { x: 60, y: 320, w: 48, h: 118, flag: false },
    ].forEach((spire) => {
      drawShikhara(midLayer, {
        x: spire.x, y: spire.y, w: spire.w, h: spire.h,
        fill: '#3d1c33', highlight: '#6d3444', edge: 'rgba(0,0,0,.4)',
        detail: true, urushringa: true, finial: true, flag: spire.flag, flagFill: '#e2622f',
      });
    });

    // Warm bounce from the ceremony washing up the façades.
    city.append('rect').attr('x', 0).attr('y', 300).attr('width', WIDTH).attr('height', 260)
      .attr('fill', 'url(#ceremonyGlow)').attr('opacity', 0.5);

    // ================= Ghat steps =========================================
    const steps = svg.append('g').attr('class', styles.stepsLayer);
    steps.append('rect').attr('x', 0).attr('y', 546).attr('width', WIDTH).attr('height', HEIGHT - 546)
      .attr('fill', 'url(#stepGradient)');
    const STEP_COUNT = 10;
    for (let i = 0; i < STEP_COUNT; i += 1) {
      const t = i / (STEP_COUNT - 1);
      const y = 550 + t * 126;
      const th = 11 + t * 5;
      const sag = 6 + t * 12;
      steps.append('path')
        .attr('d', `M -20 ${y} Q 800 ${y + sag} 1620 ${y} L 1620 ${y + th} Q 800 ${y + th + sag} -20 ${y + th} Z`)
        .attr('fill', i % 2 ? '#2f1726' : '#3b1f2d')
        .attr('opacity', 0.95);
      steps.append('path')
        .attr('d', `M -20 ${y} Q 800 ${y + sag} 1620 ${y}`)
        .attr('fill', 'none')
        .attr('stroke', '#e6954f')
        .attr('stroke-width', 1 + t * 1.4)
        .attr('stroke-opacity', 0.07 + t * 0.15);
      for (let j = 0; j < 22; j += 1) {
        const jx = -10 + (j + (i % 2) * 0.5) * 74;
        const jy = y + sag * 4 * (jx / WIDTH) * (1 - jx / WIDTH);
        steps.append('line')
          .attr('x1', jx).attr('x2', jx).attr('y1', jy + 1).attr('y2', jy + th - 1)
          .attr('stroke', '#150b18').attr('stroke-opacity', 0.4).attr('stroke-width', 1.4);
      }
    }
    // Damp band where the river laps the lowest steps.
    steps.append('path')
      .attr('d', `M -20 664 Q 800 686 1620 664 L 1620 690 Q 800 712 -20 690 Z`)
      .attr('fill', '#0f0a1c').attr('opacity', 0.55);

    // ================= Crowd on the steps =================================
    const crowd = svg.append('g').attr('class', styles.crowdLayer);
    const seated = (parent, cx, cy, ch, fill, rim) => {
      const s = parent.append('g').attr('transform', `translate(${cx}, ${cy})`).attr('fill', fill);
      s.append('path')
        .attr('d', `M ${-ch * 0.44} 0 Q ${-ch * 0.4} ${-ch * 0.34} ${-ch * 0.2} ${-ch * 0.52}
          Q ${-ch * 0.06} ${-ch * 0.62} ${ch * 0.1} ${-ch * 0.56}
          Q ${ch * 0.36} ${-ch * 0.42} ${ch * 0.42} 0 Z`);
      s.append('ellipse').attr('cx', -ch * 0.04).attr('cy', -ch * 0.68).attr('rx', ch * 0.14).attr('ry', ch * 0.155);
      if (rim) {
        s.append('path')
          .attr('d', `M ${ch * 0.3} ${-ch * 0.16} Q ${ch * 0.3} ${-ch * 0.45} ${ch * 0.1} ${-ch * 0.56}`)
          .attr('fill', 'none').attr('stroke', rim).attr('stroke-width', ch * 0.055).attr('stroke-opacity', 0.55);
      }
      return s;
    };

    const crowdRows = [
      { y: 562, h: 30, n: 62, seatRatio: 0.16, opacity: 0.88 },
      { y: 586, h: 35, n: 54, seatRatio: 0.42, opacity: 0.93 },
      { y: 612, h: 41, n: 46, seatRatio: 0.62, opacity: 0.97 },
      { y: 642, h: 48, n: 36, seatRatio: 0.74, opacity: 1 },
      { y: 676, h: 56, n: 22, seatRatio: 0.82, opacity: 1 },
    ];
    crowdRows.forEach((row) => {
      for (let i = 0; i < row.n; i += 1) {
        const cx = between(-20, WIDTH + 20);
        const cy = row.y + between(-4, 4);
        const ch = row.h * between(0.82, 1.16);
        const warm = random() > 0.82;
        const fill = warm ? '#3a1520' : '#100a17';
        const rim = between(0, 1) > 0.45 ? '#c9713a' : null;
        if (random() < row.seatRatio) {
          seated(crowd, cx, cy, ch, fill, rim).attr('opacity', row.opacity);
        } else {
          drawPerson(crowd, {
            x: cx,
            y: cy,
            height: ch * 1.45,
            fill,
            rim,
            opacity: row.opacity,
            head: random() > 0.55 ? 'veil' : 'bun',
            arms: random() > 0.7 ? 'namaste' : 'down',
            hem: 0.3,
            flip: random() > 0.5,
          });
        }
      }
    });

    // ================= Ceremony platforms, canopies and priests ===========
    const ceremonyGlow = svg.append('g').attr('class', styles.glowLayer);
    const priestXs = [400, 645, 890, 1135, 1380];
    priestXs.forEach((x) => {
      ceremonyGlow.append('ellipse').attr('cx', x).attr('cy', 520).attr('rx', 210).attr('ry', 230).attr('fill', 'url(#ceremonyGlow)');
    });

    const platforms = svg.append('g').attr('class', styles.platformLayer);
    priestXs.forEach((x, index) => {
      const depth = 0.5 + index * 0.125;
      const g = platforms.append('g');

      // Bamboo canopy posts, lit down one edge by the lamps.
      [-100, 100].forEach((side) => {
        g.append('rect').attr('x', x + side - 4.5).attr('y', 372).attr('width', 9).attr('height', 268).attr('fill', '#2d1a16');
        g.append('rect').attr('x', x + side - 4.5).attr('y', 372).attr('width', 3).attr('height', 268)
          .attr('fill', '#e09a52').attr('opacity', 0.34 * depth);
        for (let k = 0; k < 5; k += 1) {
          g.append('rect').attr('x', x + side - 6).attr('y', 400 + k * 52).attr('width', 12).attr('height', 3.4)
            .attr('fill', '#4a2a1f');
        }
      });

      // Shallow ribbed parasol — the canopy that defines Dashashwamedh.
      const canopy = g.append('g');
      canopy.append('path')
        .attr('d', `M ${x - 118} 374 Q ${x - 104} 322 ${x} 306 Q ${x + 104} 322 ${x + 118} 374 Z`)
        .attr('fill', 'url(#canopyGradient)');
      for (let k = -3; k <= 3; k += 1) {
        canopy.append('path')
          .attr('d', `M ${x} 308 Q ${x + k * 17} 336 ${x + k * 37.5} 374`)
          .attr('fill', 'none').attr('stroke', '#2c0d18').attr('stroke-width', 1.5).attr('stroke-opacity', 0.5);
      }
      canopy.append('path')
        .attr('d', `M ${x - 118} 374 Q ${x - 104} 322 ${x} 306 Q ${x - 34} 316 ${x - 62} 374 Z`)
        .attr('fill', '#ffb268').attr('opacity', 0.14 * depth);
      canopy.append('path')
        .attr('d', `M ${x - 118} 374 Q ${x} 396 ${x + 118} 374 L ${x + 118} 368 Q ${x} 390 ${x - 118} 368 Z`)
        .attr('fill', '#2a0d18').attr('opacity', 0.6);
      let scallop = `M ${x - 118} 372`;
      for (let s = 0; s < 8; s += 1) {
        scallop += ` q ${29.5 / 2} 16 ${29.5} 0`;
      }
      canopy.append('path').attr('d', `${scallop} L ${x + 118} 364 L ${x - 118} 364 Z`).attr('fill', '#6b2130');
      canopy.append('path').attr('d', scallop).attr('fill', 'none')
        .attr('stroke', '#f2b96a').attr('stroke-width', 1.5).attr('stroke-opacity', 0.45 * depth);
      canopy.append('rect').attr('x', x - 120).attr('y', 360).attr('width', 240).attr('height', 8)
        .attr('rx', 3).attr('fill', '#7a2f36');
      canopy.append('line').attr('x1', x).attr('x2', x).attr('y1', 306).attr('y2', 282)
        .attr('stroke', '#c98a45').attr('stroke-width', 3);
      canopy.append('circle').attr('cx', x).attr('cy', 278).attr('r', 6).attr('fill', '#e8ac5c');
      canopy.append('path').attr('d', `M ${x} 272 l 4 -13 l -4 4 l -4 -4 Z`).attr('fill', '#e8ac5c');

      // Marigold swag slung beneath the canopy edge.
      for (let s = 0; s < 24; s += 1) {
        const sx = x - 114 + s * 9.9;
        const sy = 380 + Math.sin((s / 23) * Math.PI) * 17;
        platforms.append('circle').attr('cx', sx).attr('cy', sy).attr('r', 3.2)
          .attr('fill', s % 3 === 0 ? '#e8b33d' : '#e2712a').attr('opacity', 0.88);
      }

      // The platform itself.
      g.append('ellipse').attr('cx', x).attr('cy', 690).attr('rx', 108).attr('ry', 16).attr('fill', '#0b0714').attr('opacity', 0.7);
      g.append('path').attr('d', `M ${x - 92} 636 L ${x + 92} 636 L ${x + 74} 692 L ${x - 74} 692 Z`)
        .attr('fill', 'url(#platformGradient)');
      for (let s = 0; s < 6; s += 1) {
        g.append('line')
          .attr('x1', x - 88 + s * 35.2).attr('y1', 640)
          .attr('x2', x - 72 + s * 28.8).attr('y2', 690)
          .attr('stroke', '#2a0f16').attr('stroke-opacity', 0.4);
      }
      g.append('rect').attr('x', x - 98).attr('y', 626).attr('width', 196).attr('height', 13).attr('rx', 3).attr('fill', '#c47c3d');
      g.append('rect').attr('x', x - 98).attr('y', 626).attr('width', 196).attr('height', 4).attr('rx', 2).attr('fill', '#f4bf72').attr('opacity', 0.7);
      [-78, 78].forEach((side) => {
        g.append('circle').attr('cx', x + side).attr('cy', 632).attr('r', 5).attr('fill', '#f8c96f');
      });
    });

    const priestsLayer = svg.append('g').attr('class', styles.priestsLayer);
    const flameData = [];
    const smokeData = [];
    const LAMP_TIERS = [
      { r: 44, y: 34, n: 7 },
      { r: 34, y: 72, n: 6 },
      { r: 25, y: 104, n: 5 },
      { r: 16, y: 130, n: 4 },
    ];
    priestXs.forEach((x, index) => {
      const priest = priestsLayer.append('g').attr('transform', `translate(${x}, 0)`);
      const figure = priest.append('g').attr('class', styles.priestFigure).datum({ x, phase: index * 0.82 });
      const PH = 178;
      const FEET = 632;

      figure.append('ellipse').attr('cy', 634).attr('rx', 44).attr('ry', 9).attr('fill', '#080611').attr('opacity', 0.62);
      drawPerson(figure, {
        x: 0, y: FEET, height: PH, fill: 'url(#priestGradient)', arms: 'none',
        head: 'bun', hem: 0.31, rim: '#ffd9a0',
      });

      const body = figure.append('g').attr('transform', `translate(0, ${FEET})`);
      // Saffron angavastram falling from the left shoulder across the chest.
      body.append('path')
        .attr('d', 'M -24 -144 Q 2 -130 24 -142 L 32 -90 Q 2 -75 -29 -92 Z')
        .attr('fill', 'url(#saffronGradient)');
      body.append('path')
        .attr('d', 'M 24 -142 Q 40 -117 35 -64 L 23 -66 Q 31 -110 17 -137 Z')
        .attr('fill', '#b8431c').attr('opacity', 0.85);
      // Dhoti folds.
      body.append('path').attr('d', 'M -21 -59 Q 0 -66 21 -59 L 20 -54 Q 0 -47 -20 -54 Z')
        .attr('fill', '#8f5a2a').attr('opacity', 0.42);
      body.append('path').attr('d', 'M -5 -74 L 4 -74 L 8 -54 L -9 -54 Z').attr('fill', '#c98f4d').attr('opacity', 0.32);
      // Skin: face, tilak, arms.
      body.append('ellipse').attr('cy', -163.4).attr('rx', 9.4).attr('ry', 10.4).attr('fill', '#c07f4f');
      body.append('path').attr('d', 'M -9.4 -169 Q 0 -178 9.4 -169 Q 4 -173 -9.4 -165 Z').attr('fill', '#241318');
      body.append('circle').attr('cx', -8.6).attr('cy', -168).attr('r', 4.7).attr('fill', '#241318');
      body.append('path').attr('d', 'M 4 -166 q 4.6 -1 5.6 4.6 q -4.6 3.4 -6.6 -1 Z').attr('fill', '#ffd9a0').attr('opacity', 0.42);
      body.append('path').attr('d', 'M -3.5 -159 l 7 0 l -1.8 7 l -3.6 0 Z').attr('fill', '#f4d59d').attr('opacity', 0.78);
      // Right arm raising the lamp.
      body.append('path')
        .attr('d', 'M 18 -144 Q 46 -144 64 -134 L 59 -123 Q 42 -132 15 -132 Z')
        .attr('fill', '#c07f4f');
      body.append('ellipse').attr('cx', 63).attr('cy', -130).attr('rx', 7.4).attr('ry', 6.4).attr('fill', '#cd8b56');
      // Left arm raised, ringing the bell.
      body.append('path')
        .attr('d', 'M -18 -144 Q -44 -160 -52 -184 L -42 -188 Q -32 -164 -14 -132 Z')
        .attr('fill', '#c07f4f');
      const bell = body.append('g').attr('transform', 'translate(-49, -192)');
      bell.append('path').attr('d', 'M -9 0 Q -9 -16 0 -20 Q 9 -16 9 0 Z').attr('fill', 'url(#brassGradient)');
      bell.append('rect').attr('x', -10.5).attr('y', -1).attr('width', 21).attr('height', 3.4).attr('rx', 1.7).attr('fill', '#f0bd6e');
      bell.append('line').attr('y1', -20).attr('y2', -27).attr('stroke', '#e0a95e').attr('stroke-width', 2.6);
      bell.append('circle').attr('cy', 3.8).attr('r', 2.2).attr('fill', '#f6cd80');

      const lampSwing = figure.append('g').attr('class', styles.aartiLamp).datum({ phase: index * 0.74 });
      const lampGlow = lampSwing.append('g').attr('transform', 'translate(64, 502)');
      lampGlow.append('ellipse').attr('cy', -40).attr('rx', 118).attr('ry', 134)
        .attr('fill', 'url(#lampGlow)');
      const lamp = lampSwing.append('g').attr('transform', 'translate(64, 502) scale(.66)');
      aartiLamp(lamp, LAMP_TIERS, flamePath, (f) => flameData.push(f), index * 1.3);

      d3.range(3).forEach((smokeIndex) => {
        const smoke = priestsLayer
          .append('path')
          .datum({ x: x + between(20, 100), y: 404, phase: index * 1.1 + smokeIndex * 2.2, drift: between(-20, 20) })
          .attr('class', styles.smoke)
          .attr('d', `M 0 0 C ${between(-22, 22)} -40, ${between(-34, 34)} -66, ${between(-20, 20)} -112 S ${between(-30, 30)} -170, ${between(-12, 12)} -206`)
          .attr('fill', 'none')
          .attr('stroke', '#f6cfb1')
          .attr('stroke-width', between(5, 11))
          .attr('stroke-linecap', 'round')
          .attr('filter', 'url(#softBlur)');
        smokeData.push(smoke);
      });
    });

    // Atmospheric shading so the left of the frame reads as depth behind the type.
    svg.append('rect').attr('width', 900).attr('height', HEIGHT)
      .attr('fill', 'url(#leftScrim)').attr('pointer-events', 'none');

    const river = svg.append('g').attr('class', styles.riverLayer);
    river.append('rect').attr('x', 0).attr('y', WATERLINE).attr('width', WIDTH).attr('height', HEIGHT - WATERLINE).attr('fill', 'url(#waterGradient)');
    river.append('path').attr('d', `M0 ${WATERLINE} Q 210 674 430 686 T 850 683 T 1260 680 T 1600 684 L1600 702 Q1400 694 1190 706 T760 700 T350 704 T0 698 Z`).attr('fill', '#f59b58').attr('opacity', 0.14);

    const reflections = svg.append('g').attr('class', styles.reflectionsLayer).attr('filter', 'url(#reflectionBlur)');
    const reflectionData = d3.range(145).map(() => {
      const focus = priestXs[Math.floor(random() * priestXs.length)];
      const y = between(706, 988);
      return {
        x: focus + between(-115, 115) * ((y - WATERLINE) / 310),
        y,
        width: between(8, 58) * ((y - WATERLINE) / 200 + 0.35),
        color: random() > 0.42 ? '#ff8b36' : '#efc26b',
        opacity: between(0.05, 0.28),
        phase: between(0, Math.PI * 2),
      };
    });
    reflections
      .selectAll('.reflection')
      .data(reflectionData)
      .join('line')
      .attr('class', styles.reflection)
      .attr('x1', (d) => d.x - d.width / 2)
      .attr('x2', (d) => d.x + d.width / 2)
      .attr('y1', (d) => d.y)
      .attr('y2', (d) => d.y)
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', (d) => between(1, 5))
      .attr('stroke-linecap', 'round')
      .attr('opacity', (d) => d.opacity);

    const rippleData = d3.range(72).map(() => ({
      x: between(-80, WIDTH),
      y: between(WATERLINE + 8, HEIGHT),
      width: between(18, 126),
      opacity: between(0.035, 0.18),
      speed: between(3, 13),
      phase: between(0, Math.PI * 2),
    }));
    river
      .selectAll('.ripple')
      .data(rippleData)
      .join('line')
      .attr('class', styles.ripple)
      .attr('stroke', (d) => (random() > 0.75 ? '#e99858' : '#6f799f'))
      .attr('stroke-width', (d) => between(0.7, 2.2))
      .attr('stroke-linecap', 'round')
      .attr('opacity', (d) => d.opacity);

    const diyaLayer = svg.append('g').attr('class', styles.diyaLayer);
    const diyas = d3.range(31).map((index) => ({
      x: between(30, WIDTH - 30),
      y: between(713, 975),
      scale: between(0.42, 1.05),
      phase: between(0, Math.PI * 2),
      drift: between(2, 8),
      born: 0,
      index,
    }));
    diyas.sort((a, b) => a.y - b.y).forEach((diya) => drawDiya(diyaLayer, diya));

    const foreground = svg.append('g').attr('class', styles.foregroundLayer);
    foreground.append('path').attr('d', 'M -80 1000 L -80 916 Q 35 852 173 904 Q 238 928 321 1000 Z').attr('fill', '#02040b');
    foreground.append('path').attr('d', 'M 1270 1000 Q 1385 866 1516 914 Q 1580 937 1675 884 L 1675 1000 Z').attr('fill', '#02040b');
    const boat = foreground.append('g').attr('transform', 'translate(121, 855) rotate(3)');
    boat.append('path').attr('d', 'M -28 65 Q 112 118 292 63 Q 254 132 103 135 Q 6 126 -28 65 Z').attr('fill', '#080712');
    boat.append('path').attr('d', 'M -28 65 Q 112 96 292 63').attr('fill', 'none').attr('stroke', '#6c3828').attr('stroke-width', 8);
    boat.append('line').attr('x1', 56).attr('y1', 63).attr('x2', 23).attr('y2', -18).attr('stroke', '#120d13').attr('stroke-width', 9);
    boat.append('circle').attr('cx', 25).attr('cy', -26).attr('r', 13).attr('fill', '#05040a');
    boat.append('path').attr('d', 'M 5 -10 Q 26 -19 47 -8 L 53 54 L 8 54 Z').attr('fill', '#06050b');

    const embersLayer = svg.append('g').attr('class', styles.embersLayer);
    const embers = d3.range(88).map(() => ({
      x: between(270, 1330),
      y: between(410, 670),
      r: between(0.7, 3.2),
      speed: between(8, 32),
      phase: between(0, 12),
      sway: between(5, 24),
      opacity: between(0.18, 0.88),
    }));
    embersLayer
      .selectAll('.ember')
      .data(embers)
      .join('circle')
      .attr('class', styles.ember)
      .attr('r', (d) => d.r)
      .attr('fill', (d) => (d.r > 2.4 ? '#fff4b1' : '#ff9e3d'))
      .attr('filter', 'url(#fireGlow)');

    svg.append('rect').attr('width', WIDTH).attr('height', HEIGHT).attr('fill', 'url(#vignette)').attr('pointer-events', 'none');
    svg.append('rect').attr('width', WIDTH).attr('height', HEIGHT).attr('fill', '#e0633f').attr('opacity', 0.035).attr('class', styles.filmWash).attr('pointer-events', 'none');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      pausedRef.current = true;
      setPaused(true);
    }

    const animationStartedAt = performance.now();
    const timer = d3.timer((elapsed) => {
      if (pausedRef.current) return;
      const time = elapsed / 1000;

      sky.selectAll(`.${styles.star}`).attr('opacity', (d) => d.opacity * (0.62 + Math.sin(time * 0.8 + d.phase) * 0.38));
      priestsLayer
        .selectAll(`.${styles.priestFigure}`)
        .attr('transform', (d) => `rotate(${Math.sin(time * 0.62 + d.phase) * 1.1}, 0, 630)`);
      priestsLayer
        .selectAll(`.${styles.aartiLamp}`)
        .attr('transform', (d) => `rotate(${Math.sin(time * 0.9 + d.phase) * 5.6}, 64, 502)`);

      flameData.forEach((flame) => {
        const datum = flame.datum();
        const pulse = 0.86 + Math.sin(time * 7.5 + datum.phase) * 0.11 + Math.sin(time * 13 + datum.phase) * 0.05;
        flame.attr('transform', `translate(${datum.x}, ${datum.y}) scale(${datum.scale * (0.93 + Math.sin(time * 5 + datum.phase) * 0.08)}, ${datum.scale * pulse}) rotate(${Math.sin(time * 4.2 + datum.phase) * 4})`);
      });
      smokeData.forEach((smoke) => {
        const datum = smoke.datum();
        const cycle = (time * 0.14 + datum.phase / 7) % 1;
        smoke
          .attr('transform', `translate(${datum.x + Math.sin(time * 0.34 + datum.phase) * datum.drift}, ${datum.y - cycle * 36}) scale(${0.85 + cycle * 0.34})`)
          .attr('opacity', Math.sin(cycle * Math.PI) * 0.13);
      });

      river
        .selectAll(`.${styles.ripple}`)
        .attr('x1', (d) => d.x + Math.sin(time * 0.42 + d.phase) * d.speed)
        .attr('x2', (d) => d.x + d.width + Math.sin(time * 0.42 + d.phase) * d.speed)
        .attr('y1', (d) => d.y + Math.sin(time * 0.65 + d.phase) * 2.2)
        .attr('y2', (d) => d.y + Math.sin(time * 0.65 + d.phase) * 2.2);
      reflections
        .selectAll(`.${styles.reflection}`)
        .attr('transform', (d) => `translate(${Math.sin(time * 0.8 + d.phase) * 8}, 0) scale(${0.8 + Math.sin(time * 1.1 + d.phase) * 0.18}, 1)`);
      diyaLayer
        .selectAll(`.${styles.diya}`)
        .attr('transform', (d) => {
          const ageScale = d.born ? Math.min(1, (elapsed - d.born) / 600) : 1;
          return `translate(${d.x + Math.sin(time * 0.42 + d.phase) * d.drift}, ${d.y + Math.sin(time * 0.75 + d.phase) * 3}) scale(${d.scale * ageScale})`;
        });
      diyaLayer
        .selectAll(`.${styles.diyaFlame}`)
        .attr('transform', (d) => `translate(0, 1) scale(.17, ${0.16 + Math.sin(time * 7 + (d?.phase || 0)) * 0.018})`);
      embersLayer
        .selectAll(`.${styles.ember}`)
        .attr('cx', (d) => d.x + Math.sin(time * 0.9 + d.phase) * d.sway)
        .attr('cy', (d) => 675 - ((time * d.speed + d.y) % 290))
        .attr('opacity', (d) => d.opacity * (0.45 + Math.sin(time * 2.2 + d.phase) * 0.4));
    });

    svg.on('click.offer-diya', (event) => {
      const [x, y] = d3.pointer(event, svg.node());
      if (y < WATERLINE + 12) return;
      const offered = {
        x: Math.max(35, Math.min(WIDTH - 35, x)),
        y: Math.max(WATERLINE + 25, Math.min(HEIGHT - 25, y)),
        scale: 0.88,
        phase: between(0, Math.PI * 2),
        drift: between(3, 7),
        born: performance.now() - animationStartedAt,
      };
      drawDiya(diyaLayer, offered, true);
    });

    return () => {
      timer.stop();
      svg.on('.offer-diya', null);
    };
  }, []);

  return (
    <section className={styles.scene} aria-label="Cinematic Ganga Aarti experience">
      <svg
        ref={svgRef}
        className={styles.canvas}
        role="img"
        aria-labelledby="aarti-scene-title aarti-scene-description"
      />

      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.topBar}>
        <Link href="/" className={styles.brand} aria-label="Return to Kashi Taxi homepage">
          <span className={styles.brandMark}>क</span>
          <span>Kashi Taxi</span>
        </Link>
        <button
          type="button"
          className={styles.motionButton}
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
        >
          <span className={styles.motionIcon} aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>
          {paused ? 'Play motion' : 'Pause motion'}
        </button>
      </div>

      <div className={styles.copy}>
        <p className={styles.eyebrow}><span /> Dashashwamedh Ghat · Varanasi</p>
        <h1>Ganga Aarti,<br /><em>where the river meets the divine.</em></h1>
        <p className={styles.intro}>Every flame is a prayer. Every bell, a heartbeat. Every evening, Kashi remembers eternity.</p>
        <div className={styles.ceremonyMeta}>
          <div><strong>संध्या</strong><span>Sandhya</span></div>
          <div><strong>आरती</strong><span>Sacred light</span></div>
          <div><strong>गंगा</strong><span>Mother Ganges</span></div>
        </div>
      </div>

      <div className={styles.riverPrompt}>
        <span className={styles.promptDot} aria-hidden="true" />
        Tap the river to offer a diya
      </div>
      <div className={styles.scrollCue} aria-hidden="true">
        <small>Enter Kashi</small>
        <span />
      </div>
    </section>
  );
}
