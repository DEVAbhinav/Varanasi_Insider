import * as d3 from 'd3';
import {
  W, H, addLinear, addRadial, cuspedArch,
  drawShikhara, drawChhatri, drawPerson, drawTree, drawGhatBlock,
} from './artPrimitives';

/* ------------------------------------------------------------------ *
 * 01 — Dawn on the Ganges (Assi Ghat)
 * Deep recession: hazy far bank, three receding ghat layers separated
 * by mist, a low sun laying a shimmering path across the water.
 * ------------------------------------------------------------------ */
export function buildDawn(root, defs, rnd, cls) {
  const WATER = 652;
  const SUN = { x: 1168, y: 556 };

  addLinear(defs, 'dawnSky', [
    ['0%', '#131634'], ['22%', '#33234f'], ['46%', '#78355c'],
    ['66%', '#c55f5c'], ['84%', '#ee9257'], ['100%', '#fbc978'],
  ]);
  addLinear(defs, 'dawnWater', [
    ['0%', '#e8a765'], ['9%', '#a9695f'], ['30%', '#4a3a58'],
    ['65%', '#25243f'], ['100%', '#141428'],
  ]);
  addRadial(defs, 'dawnHalo', [['0%', '#fff1c4', 0.95], ['26%', '#ffb15f', 0.42], ['62%', '#e8615c', 0.12], ['100%', '#8c3a5e', 0]]);

  const scene = root.append('g').attr('data-scene', 'dawn');
  scene.append('rect').attr('width', W).attr('height', H).attr('fill', 'url(#dawnSky)');

  for (let i = 0; i < 60; i += 1) {
    const y = rnd(10, 330);
    scene.append('circle')
      .attr('class', cls.star)
      .datum({ phase: rnd(0, 6.3) })
      .attr('cx', rnd(10, W - 10)).attr('cy', y).attr('r', rnd(0.5, 1.7))
      .attr('fill', '#ffeccd')
      .attr('opacity', (1 - y / 380) * rnd(0.25, 0.8));
  }

  // Long horizontal cloud bands catching the first light.
  [[190, 0.55, '#7c3f68'], [270, 0.7, '#a4506a'], [352, 0.85, '#cf6d63'],
    [424, 1, '#e88a63'], [486, 1.1, '#f4a76b']].forEach(([y, s, color], i) => {
    scene.append('ellipse')
      .attr('class', cls.cloud)
      .datum({ phase: i * 1.4, drift: 6 + i * 3 })
      .attr('cx', rnd(400, 1200)).attr('cy', y)
      .attr('rx', rnd(300, 560) * s).attr('ry', rnd(9, 20))
      .attr('fill', color).attr('opacity', rnd(0.3, 0.55))
      .attr('filter', 'url(#jSoft)');
  });

  scene.append('circle').attr('cx', SUN.x).attr('cy', SUN.y).attr('r', 420).attr('fill', 'url(#dawnHalo)');
  scene.append('circle').attr('class', cls.sun).attr('cx', SUN.x).attr('cy', SUN.y).attr('r', 62).attr('fill', '#fff0bd');
  scene.append('circle').attr('cx', SUN.x).attr('cy', SUN.y).attr('r', 62).attr('fill', '#ffdd93').attr('opacity', 0.55).attr('filter', 'url(#jSoft)');

  // Waning moon and the morning star, high in the last of the night.
  scene.append('circle').attr('cx', 318).attr('cy', 132).attr('r', 46).attr('fill', '#ffeecb').attr('opacity', 0.16).attr('filter', 'url(#jSoft)');
  scene.append('path')
    .attr('d', 'M 318 106 a 26 26 0 1 0 0 52 a 20 26 0 1 1 0 -52 Z')
    .attr('fill', '#ffeecb').attr('opacity', 0.5);
  scene.append('circle').attr('class', cls.star).datum({ phase: 1.2 })
    .attr('cx', 520).attr('cy', 208).attr('r', 3).attr('fill', '#fff6dd').attr('opacity', 0.9).attr('filter', 'url(#jGlow)');

  // High cirrus catching the very first light.
  [[64, 0.5, '#4d2a57'], [110, 0.66, '#63305c'], [148, 0.8, '#7b3a5f']].forEach(([y, sc, color], i) => {
    scene.append('ellipse')
      .attr('class', cls.cloud).datum({ phase: i * 2.1, drift: 4 + i * 2 })
      .attr('cx', rnd(300, 1300)).attr('cy', y)
      .attr('rx', rnd(280, 520) * sc).attr('ry', rnd(6, 13))
      .attr('fill', color).attr('opacity', rnd(0.3, 0.5)).attr('filter', 'url(#jSoft)');
  });

  // Far bank — a low sandbar with a whisper of structures on it.
  const far = scene.append('g').attr('opacity', 0.46);
  far.append('path')
    .attr('d', `M 620 ${WATER} Q 900 ${WATER - 20} 1180 ${WATER - 14} T ${W} ${WATER - 18} V ${WATER} Z`)
    .attr('fill', '#dda289');
  for (let i = 0; i < 16; i += 1) {
    const x = 660 + i * 62 + rnd(-14, 14);
    if (rnd(0, 1) > 0.62) {
      drawShikhara(far, { x, y: WATER - 13, w: rnd(6, 10), h: rnd(24, 46), fill: '#dda289', detail: false, urushringa: false, finial: false });
    } else {
      far.append('rect').attr('x', x - rnd(9, 20)).attr('y', WATER - 13 - rnd(10, 26))
        .attr('width', rnd(18, 40)).attr('height', rnd(10, 26)).attr('fill', '#dda289');
    }
  }
  for (let i = 0; i < 7; i += 1) {
    far.append('path')
      .attr('d', `M ${740 + i * 118} ${WATER - 4} q 20 8 44 0 q -8 10 -22 10 q -16 0 -22 -10 Z`)
      .attr('fill', '#c78d7c');
  }

  const mist = (y, height, color, opacity) => scene.append('rect')
    .attr('class', cls.mist).datum({ phase: rnd(0, 6) })
    .attr('x', -120).attr('y', y).attr('width', W + 240).attr('height', height)
    .attr('fill', color).attr('opacity', opacity).attr('filter', 'url(#jSoft)');

  // Layer 3 — distant ghats dissolved in haze.
  const l3 = scene.append('g').attr('opacity', 0.72);
  for (let i = 0; i < 9; i += 1) {
    const x = 250 + i * 96;
    drawGhatBlock(l3, { x, y: WATER - 6, w: rnd(74, 104), h: rnd(72, 132), fill: '#b57d84', trim: '#c58e8c', rnd });
    if (i % 3 === 1) drawChhatri(l3, { x, y: WATER - rnd(80, 130), size: 13, fill: '#bd868a' });
  }
  drawShikhara(l3, { x: 470, y: WATER - 8, w: 26, h: 128, fill: '#b57d84', highlight: '#cd9490', detail: false, urushringa: false });
  mist(WATER - 96, 74, '#e8a98a', 0.3);

  // Layer 2 — mid ghats, more structure and lit windows.
  const l2 = scene.append('g');
  for (let i = 0; i < 7; i += 1) {
    const x = 60 + i * 118;
    drawGhatBlock(l2, { x, y: WATER + 2, w: rnd(96, 132), h: rnd(122, 208), fill: '#7c4a66', trim: '#8e5871', rnd, lit: true, litColor: '#f2b070' });
    if (i % 2 === 0) drawChhatri(l2, { x: x + rnd(-24, 24), y: WATER - rnd(126, 200), size: 17, fill: '#84506b', highlight: '#935973' });
  }
  drawShikhara(l2, { x: 236, y: WATER, w: 38, h: 214, fill: '#74445f', highlight: '#9b6076', flag: true, flagFill: '#c9564a' });
  drawShikhara(l2, { x: 612, y: WATER, w: 30, h: 168, fill: '#74445f', highlight: '#9b6076' });
  mist(WATER - 60, 66, '#e4977f', 0.26);

  // Layer 1 — near ghats in deep silhouette, with the stepped bank.
  const l1 = scene.append('g');
  for (let i = 0; i < 4; i += 1) {
    const x = -60 + i * 152;
    drawGhatBlock(l1, { x, y: WATER + 16, w: rnd(126, 168), h: rnd(196, 286), fill: '#3b2244', trim: '#4a2b4e', rnd, lit: true, litColor: '#e79a55' });
  }
  drawShikhara(l1, { x: 92, y: WATER + 14, w: 46, h: 268, fill: '#341e3e', highlight: '#553257', flag: true, flagFill: '#a8433f' });
  drawChhatri(l1, { x: 372, y: WATER - 190, size: 22, fill: '#3b2244', highlight: '#4e2c50' });
  for (let s = 0; s < 8; s += 1) {
    l1.append('path')
      .attr('d', `M -80 ${WATER - 52 + s * 9} H ${470 - s * 26} V ${WATER - 44 + s * 9} H -80 Z`)
      .attr('fill', s % 2 ? '#42264a' : '#341d3c');
  }
  for (let i = 0; i < 26; i += 1) {
    const t = rnd(0, 1);
    drawPerson(l1, {
      x: rnd(-40, 440 - t * 200), y: WATER - 50 + t * 62, height: rnd(28, 44),
      fill: '#241429', arms: rnd(0, 1) > 0.72 ? 'namaste' : 'down', opacity: 0.9,
    });
  }

  // Water, sun path and reflections.
  scene.append('rect').attr('y', WATER).attr('width', W).attr('height', H - WATER).attr('fill', 'url(#dawnWater)');
  for (let i = 0; i < 46; i += 1) {
    const t = i / 46;
    const y = WATER + 6 + Math.pow(t, 1.5) * 350;
    const spread = 26 + Math.pow(t, 1.6) * 260;
    scene.append('line')
      .attr('class', cls.water).datum({ phase: rnd(0, 6.3), amp: 6 + t * 26 })
      .attr('x1', SUN.x - spread * rnd(0.3, 1)).attr('x2', SUN.x + spread * rnd(0.3, 1))
      .attr('y1', y).attr('y2', y)
      .attr('stroke', t < 0.4 ? '#ffe6ae' : '#f0a862')
      .attr('stroke-width', rnd(2, 7)).attr('stroke-linecap', 'round')
      .attr('opacity', (1 - t) * rnd(0.35, 0.75));
  }
  // Architecture reflected as broken vertical smears.
  for (let i = 0; i < 34; i += 1) {
    const x = rnd(-40, 700);
    scene.append('rect')
      .attr('class', cls.water).datum({ phase: rnd(0, 6.3), amp: 4 })
      .attr('x', x).attr('y', WATER).attr('width', rnd(14, 54)).attr('height', rnd(40, 150))
      .attr('fill', '#2a1836').attr('opacity', rnd(0.18, 0.45)).attr('filter', 'url(#jRipple)');
  }
  for (let i = 0; i < 60; i += 1) {
    const y = WATER + rnd(8, 344);
    scene.append('line')
      .attr('class', cls.water).datum({ phase: rnd(0, 6.3), amp: rnd(5, 20) })
      .attr('x1', rnd(-60, W)).attr('y1', y).attr('y2', y).attr('x2', rnd(-60, W) + rnd(40, 190))
      .attr('stroke', rnd(0, 1) > 0.6 ? '#c98c6f' : '#5d5a80')
      .attr('stroke-width', rnd(0.8, 2.4)).attr('opacity', rnd(0.08, 0.3));
  }

  // Boats at three depths.
  const boat = (x, y, scale, dark) => {
    const g = scene.append('g').attr('class', cls.boat).datum({ phase: rnd(0, 6.3) })
      .attr('transform', `translate(${x}, ${y}) scale(${scale})`);
    g.append('path').attr('d', 'M -118 0 Q 0 40 132 -6 Q 96 54 -6 56 Q -86 46 -118 0 Z').attr('fill', dark);
    g.append('path').attr('d', 'M -118 0 Q 0 26 132 -6').attr('fill', 'none').attr('stroke', '#e0a05f').attr('stroke-width', 5).attr('stroke-opacity', 0.5);
    drawPerson(g, { x: 22, y: 8, height: 78, fill: dark });
    g.append('line').attr('x1', 30).attr('y1', -22).attr('x2', -66).attr('y2', 40).attr('stroke', dark).attr('stroke-width', 6).attr('stroke-linecap', 'round');
    return g;
  };
  boat(1058, 726, 0.42, '#3d2842');
  boat(742, 806, 0.66, '#2a1a30');
  boat(1235, 872, 0.9, '#1c1226');

  // Foreground prow framing the shot.
  const fg = scene.append('g');
  fg.append('path').attr('d', `M -60 ${H} L -60 862 Q 150 792 372 872 Q 470 912 540 ${H} Z`).attr('fill', '#120b1a');
  fg.append('path').attr('d', 'M -60 872 Q 150 806 366 880').attr('fill', 'none').attr('stroke', '#8a5330').attr('stroke-width', 7).attr('stroke-opacity', 0.6);
  for (let i = 0; i < 5; i += 1) {
    fg.append('circle').attr('cx', -10 + i * 84).attr('cy', 900 + i * 12).attr('r', 15).attr('fill', '#1d1226');
  }

  // Floating diyas drifting downstream.
  for (let i = 0; i < 16; i += 1) {
    const dx = rnd(560, W - 40);
    const dy = WATER + 40 + Math.pow(rnd(0, 1), 1.4) * 300;
    const ds = 0.5 + (dy - WATER) / 340;
    const d = scene.append('g').attr('class', cls.boat).datum({ phase: rnd(0, 6.3) })
      .attr('transform', `translate(${dx}, ${dy}) scale(${ds})`);
    d.append('ellipse').attr('rx', 11).attr('ry', 4).attr('fill', '#7a4a34');
    d.append('circle').attr('cy', -5).attr('r', 3.4).attr('fill', '#ffdc94').attr('filter', 'url(#jGlow)');
    d.append('ellipse').attr('cy', 12).attr('rx', 9).attr('ry', 5).attr('fill', '#ffcb80')
      .attr('opacity', 0.4).attr('filter', 'url(#jRipple)');
  }

  [[352, 176, 0.8], [418, 214, 0.58], [1246, 158, 0.7], [1330, 206, 0.5], [1180, 232, 0.42],
    [286, 250, 0.44], [1042, 190, 0.36], [660, 142, 0.5]].forEach(([x, y, s], i) => {
    scene.append('path')
      .attr('class', cls.bird).datum({ phase: i * 1.1, drift: 10 + i * 4 })
      .attr('d', 'M -20 0 Q -9 -11 0 -1 Q 9 -11 20 0')
      .attr('transform', `translate(${x}, ${y}) scale(${s})`)
      .attr('fill', 'none').attr('stroke', '#40243c').attr('stroke-width', 2.6).attr('stroke-linecap', 'round');
  });
}

/* ------------------------------------------------------------------ *
 * 02 — Kashi Vishwanath
 * Receding cusped arcade, a fully detailed gold shikhara, god-rays,
 * garlands, bells and backlit devotees.
 * ------------------------------------------------------------------ */
export function buildTemple(root, defs, rnd, cls) {
  addLinear(defs, 'tmplBg', [['0%', '#1c0916'], ['30%', '#571426'], ['58%', '#8e2a26'], ['80%', '#6a1c1f'], ['100%', '#2c0a12']]);
  addLinear(defs, 'tmplGold', [
    ['0%', '#fff6c2'], ['16%', '#ffd970'], ['40%', '#e0a233'],
    ['62%', '#a9661f'], ['80%', '#e5b449'], ['100%', '#f6dc86'],
  ], { x1: '0%', y1: '0%', x2: '100%', y2: '0%' });
  addLinear(defs, 'tmplFloor', [['0%', '#7a3320'], ['100%', '#210a12']]);
  addRadial(defs, 'tmplHalo', [['0%', '#ffe9a8', 0.72], ['30%', '#f7a844', 0.3], ['66%', '#d4552a', 0.1], ['100%', '#b8321f', 0]]);
  addLinear(defs, 'tmplAmbient', [['0%', '#ffb35f', 0], ['62%', '#ff9d4a', 0.1], ['100%', '#ffcb7a', 0.26]]);

  const scene = root.append('g').attr('data-scene', 'vishwanath').attr('opacity', 0);
  scene.append('rect').attr('width', W).attr('height', H).attr('fill', 'url(#tmplBg)');

  const VPX = 800;
  const FLOOR = 812;

  // Receding arcade on both sides.
  for (let i = 4; i >= 0; i -= 1) {
    const k = i / 4;
    const top = 60 + k * 150;
    const shade = d3.interpolateRgb('#9a3821', '#2d0e18')(k);
    const lit = d3.interpolateRgb('#e0a049', '#5c2320')(k);
    [-1, 1].forEach((side) => {
      const g = scene.append('g').attr('transform', `translate(${VPX + side * (720 - k * 300)}, ${FLOOR})`);
      g.append('rect').attr('x', -74).attr('y', -(FLOOR - top)).attr('width', 148).attr('height', FLOOR - top).attr('fill', shade);
      // Pilaster relief so the wall is not a flat slab.
      [-52, 52].forEach((px) => {
        g.append('rect').attr('x', px - 9).attr('y', -(FLOOR - top)).attr('width', 18).attr('height', FLOOR - top)
          .attr('fill', lit).attr('opacity', 0.35);
      });
      g.append('path')
        .attr('d', cuspedArch(52, 190 - k * 60, 5))
        .attr('transform', `translate(0, ${-90 - k * 30})`)
        .attr('fill', lit).attr('opacity', 0.5);
      g.append('path')
        .attr('d', cuspedArch(44, 178 - k * 58, 5))
        .attr('transform', `translate(0, ${-90 - k * 30})`)
        .attr('fill', '#1d060d').attr('opacity', 0.95);
      g.append('rect').attr('x', -82).attr('y', -(FLOOR - top)).attr('width', 164).attr('height', 20)
        .attr('fill', d3.interpolateRgb('#d38b34', '#4a1a1c')(k));
      g.append('rect').attr('x', -78).attr('y', -(FLOOR - top) + 20).attr('width', 156).attr('height', 7)
        .attr('fill', '#2a0c12').attr('opacity', 0.5);
      g.append('circle').attr('class', cls.lantern).datum({ phase: i + (side + 1) })
        .attr('cy', -(FLOOR - top) + 74).attr('r', 9).attr('fill', '#ffcb63').attr('filter', 'url(#jGlow)');
    });
  }

  scene.append('path').attr('d', `M 0 ${H} L 420 ${FLOOR} H 1180 L ${W} ${H} Z`).attr('fill', 'url(#tmplFloor)');
  for (let i = 0; i < 9; i += 1) {
    scene.append('path')
      .attr('d', `M ${VPX + (i - 4) * 26} ${FLOOR} L ${VPX + (i - 4) * 190} ${H}`)
      .attr('stroke', '#c07a34').attr('stroke-width', 2).attr('opacity', 0.16).attr('fill', 'none');
  }

  scene.append('rect').attr('y', 420).attr('width', W).attr('height', H - 420).attr('fill', 'url(#tmplAmbient)');
  scene.append('ellipse').attr('cx', VPX).attr('cy', 430).attr('rx', 540).attr('ry', 470).attr('fill', 'url(#tmplHalo)');

  // God-rays from above.
  for (let i = 0; i < 9; i += 1) {
    const spread = -260 + i * 65;
    scene.append('path')
      .attr('class', cls.ray).datum({ phase: i * 0.8 })
      .attr('d', `M ${VPX + spread * 0.24} 0 L ${VPX + spread * 0.1} 0 L ${VPX + spread * 1.5} ${H} L ${VPX + spread * 1.9} ${H} Z`)
      .attr('fill', '#ffd98d').attr('opacity', rnd(0.03, 0.09));
  }

  // Temple: plinth, sanctum with glowing doorway, full shikhara.
  const temple = scene.append('g');
  temple.append('ellipse').attr('cx', VPX).attr('cy', FLOOR + 6).attr('rx', 330).attr('ry', 46).attr('fill', '#1a060d').attr('opacity', 0.7).attr('filter', 'url(#jSoft)');
  [[300, 56], [268, 30], [240, 22]].forEach(([hw, h], i) => {
    temple.append('rect').attr('x', VPX - hw).attr('y', FLOOR - 56 - i * 26).attr('width', hw * 2).attr('height', h)
      .attr('fill', i % 2 ? '#8a5220' : '#a9682a');
  });
  // Sanctum wall: base mouldings, pilasters, carved niches, glowing doorway.
  temple.append('rect').attr('x', VPX - 168).attr('y', 592).attr('width', 336).attr('height', 172).attr('fill', '#b8791f');
  temple.append('rect').attr('x', VPX - 168).attr('y', 592).attr('width', 336).attr('height', 172).attr('fill', 'url(#jShade)');
  temple.append('rect').attr('x', VPX - 182).attr('y', 578).attr('width', 364).attr('height', 22).attr('fill', '#e8b451');
  temple.append('rect').attr('x', VPX - 176).attr('y', 600).attr('width', 352).attr('height', 7).attr('fill', '#5d3510').attr('opacity', 0.55);
  temple.append('rect').attr('x', VPX - 174).attr('y', 748).attr('width', 348).attr('height', 16).attr('fill', '#e0a63f');
  [-118, 118].forEach((dx) => {
    temple.append('rect').attr('x', VPX + dx - 19).attr('y', 600).attr('width', 38).attr('height', 164).attr('fill', '#d9a03e');
    temple.append('rect').attr('x', VPX + dx - 19).attr('y', 600).attr('width', 11).attr('height', 164).attr('fill', '#fbe0a0').attr('opacity', 0.5);
    temple.append('rect').attr('x', VPX + dx - 25).attr('y', 606).attr('width', 50).attr('height', 13).attr('rx', 3).attr('fill', '#f2cc76');
    temple.append('rect').attr('x', VPX + dx - 25).attr('y', 736).attr('width', 50).attr('height', 13).attr('rx', 3).attr('fill', '#f2cc76');
  });
  // Devakoshta niches flanking the door.
  [-62, 62].forEach((dx) => {
    temple.append('path').attr('d', cuspedArch(23, 74, 5)).attr('transform', `translate(${VPX + dx}, 742)`)
      .attr('fill', '#7d4d15');
    temple.append('path').attr('d', cuspedArch(17, 64, 5)).attr('transform', `translate(${VPX + dx}, 740)`)
      .attr('fill', '#33170a').attr('opacity', 0.9);
    drawPerson(temple, { x: VPX + dx, y: 738, height: 42, fill: '#c79544', arms: 'namaste', opacity: 0.75 });
  });

  // Torana over the doorway.
  temple.append('path')
    .attr('d', `M ${VPX - 96} 640 Q ${VPX} 592 ${VPX + 96} 640 L ${VPX + 96} 660 Q ${VPX} 616 ${VPX - 96} 660 Z`)
    .attr('fill', '#f5d383');
  for (let i = 0; i <= 12; i += 1) {
    const t = i / 12;
    const bx = VPX - 96 + t * 192;
    const by = 660 - Math.sin(Math.PI * t) * 40;
    temple.append('circle').attr('cx', bx).attr('cy', by + 12).attr('r', 5)
      .attr('fill', i % 2 ? '#ef8f2b' : '#e2542a');
  }

  temple.append('path').attr('d', cuspedArch(66, 132, 5)).attr('transform', `translate(${VPX}, 766)`).attr('fill', '#8a5a17');
  temple.append('path').attr('d', cuspedArch(58, 122, 5)).attr('transform', `translate(${VPX}, 766)`).attr('fill', '#fff0b4').attr('opacity', 0.92);
  temple.append('path').attr('d', cuspedArch(58, 122, 5)).attr('transform', `translate(${VPX}, 766)`).attr('fill', 'url(#tmplHalo)');
  drawPerson(temple, { x: VPX, y: 764, height: 96, fill: '#5a2a12', arms: 'namaste', opacity: 0.5 });

  // Deepmala lamp pillars: tiered rings of oil flames on a stone shaft.
  [VPX - 318, VPX + 318].forEach((lx, li) => {
    const lamp = temple.append('g').attr('transform', `translate(${lx}, ${FLOOR + 4})`);
    lamp.append('ellipse').attr('cy', 4).attr('rx', 34).attr('ry', 9).attr('fill', '#12040a').attr('opacity', 0.55);
    [[30, 16], [24, 13], [19, 11]].forEach(([hw, hh], i) => {
      lamp.append('rect').attr('x', -hw).attr('y', -16 - i * 12).attr('width', hw * 2).attr('height', hh)
        .attr('fill', i % 2 ? '#7b4718' : '#96601f');
    });
    lamp.append('path').attr('d', 'M -12 -52 L -8 -256 H 8 L 12 -52 Z').attr('fill', '#9c6420');
    lamp.append('path').attr('d', 'M -12 -52 L -8 -256 H -3 L -6 -52 Z').attr('fill', '#e6b355').attr('opacity', 0.55);
    [-104, -152, -200].forEach((ry, ti) => {
      const rx = 26 - ti * 5;
      lamp.append('path').attr('d', `M ${-rx} ${ry} H ${rx} L ${rx - 5} ${ry + 9} H ${-rx + 5} Z`).attr('fill', '#a86f24');
      lamp.append('ellipse').attr('cy', ry).attr('rx', rx).attr('ry', 4.5).attr('fill', '#d8a044');
      for (let f = 0; f < 5 - ti; f += 1) {
        const fx = -rx + 5 + f * ((rx * 2 - 10) / Math.max(1, 4 - ti));
        lamp.append('circle').attr('class', cls.lantern).datum({ phase: f + ti * 1.7 + li })
          .attr('cx', fx).attr('cy', ry - 8).attr('r', 4.5).attr('fill', '#ffd489').attr('filter', 'url(#jGlow)');
      }
    });
    lamp.append('path').attr('d', 'M -16 -256 H 16 L 11 -272 H -11 Z').attr('fill', '#d8a044');
    lamp.append('circle').attr('class', cls.lantern).datum({ phase: li * 2 })
      .attr('cy', -286).attr('r', 12).attr('fill', '#ffe4ab').attr('filter', 'url(#jGlow)');
  });

  drawShikhara(temple, {
    x: VPX, y: 600, w: 152, h: 424, fill: 'url(#tmplGold)',
    highlight: '#ffeaa0', edge: 'rgba(70,30,0,.45)', flag: true, flagFill: '#e4552c',
  });

  // Garlands strung across the courtyard.
  [[96, 250], [176, 190]].forEach(([y, sag]) => {
    const path = `M -40 ${y} Q ${VPX} ${y + sag} ${W + 40} ${y}`;
    scene.append('path').attr('d', path).attr('fill', 'none').attr('stroke', '#5d2417').attr('stroke-width', 3);
    for (let i = 0; i <= 46; i += 1) {
      const t = i / 46;
      const x = -40 + t * (W + 80);
      const yy = y + Math.sin(Math.PI * t) * sag;
      scene.append('circle').attr('cx', x).attr('cy', yy).attr('r', rnd(5, 9))
        .attr('fill', i % 3 === 0 ? '#f6d95f' : i % 3 === 1 ? '#ef8f2b' : '#e2542a');
    }
  });

  // Bells.
  [212, 388, 1212, 1388].forEach((x, i) => {
    const bell = scene.append('g').attr('class', cls.bell).datum({ phase: i * 1.3, x, y: 232 });
    bell.append('line').attr('y1', -232).attr('y2', 0).attr('stroke', '#8d5a25').attr('stroke-width', 5);
    bell.append('path').attr('d', 'M -32 0 Q -30 56 -50 74 H 50 Q 30 56 32 0 Q 0 -22 -32 0 Z').attr('fill', 'url(#tmplGold)');
    bell.append('rect').attr('x', -52).attr('y', 70).attr('width', 104).attr('height', 9).attr('rx', 4).attr('fill', '#e9bc57');
    bell.append('circle').attr('cy', 92).attr('r', 8).attr('fill', '#f3ca6a');
    bell.attr('transform', `translate(${x}, 232)`);
  });

  // Backlit devotees in three depth rows so the crowd has real recession.
  const heads = ['plain', 'veil', 'bun', 'turban'];
  const rows = [
    { n: 20, y0: FLOOR + 12, y1: FLOOR + 44, h0: 96, h1: 116, tone: '#2c0d16', rim: 0.5, blur: true },
    { n: 16, y0: FLOOR + 58, y1: FLOOR + 104, h0: 132, h1: 162, tone: '#20080f', rim: 0.72, blur: false },
    { n: 11, y0: FLOOR + 126, y1: FLOOR + 178, h0: 186, h1: 232, tone: '#150409', rim: 0.9, blur: false },
  ];
  rows.forEach((row, ri) => {
    const g = scene.append('g');
    if (row.blur) g.attr('filter', 'url(#jSoft)').attr('opacity', 0.88);
    for (let i = 0; i < row.n; i += 1) {
      const x = 120 + (i + rnd(-0.32, 0.32)) * ((W - 240) / (row.n - 1));
      const near = 1 - Math.abs(x - VPX) / 900;
      const pose = rnd(0, 1);
      drawPerson(g, {
        x,
        y: rnd(row.y0, row.y1),
        height: rnd(row.h0, row.h1),
        fill: row.tone,
        rim: `rgba(255,186,102,${(row.rim * (0.55 + near * 0.45)).toFixed(2)})`,
        head: heads[Math.floor(rnd(0, 3.99))],
        arms: pose > 0.74 ? 'raised' : pose > 0.44 ? 'namaste' : pose > 0.24 ? 'carry' : 'down',
        flip: rnd(0, 1) > 0.5,
        opacity: 0.96,
      });
      if (ri === 2 && rnd(0, 1) > 0.72) {
        scene.append('ellipse').attr('cx', x).attr('cy', row.y1 - 4).attr('rx', 30).attr('ry', 8)
          .attr('fill', '#000').attr('opacity', 0.3).attr('filter', 'url(#jSoft)');
      }
    }
  });

  // Marigold sellers at the courtyard edges.
  [[288, 0.8], [1372, 0.76]].forEach(([bx, bs], bi) => {
    const b = scene.append('g').attr('transform', `translate(${bx}, ${FLOOR + 96}) scale(${bs})`);
    b.append('ellipse').attr('cy', 6).attr('rx', 92).attr('ry', 17).attr('fill', '#12040a').attr('opacity', 0.55);
    b.append('path').attr('d', 'M -84 -8 H 84 L 66 -74 H -66 Z').attr('fill', '#6a3b18');
    b.append('path').attr('d', 'M -70 -74 H 70 L 62 -84 H -62 Z').attr('fill', '#8d5222');
    for (let i = 0; i < 44; i += 1) {
      b.append('circle')
        .attr('cx', rnd(-62, 62)).attr('cy', -78 - Math.abs(rnd(-20, 20)))
        .attr('r', rnd(6, 11))
        .attr('fill', i % 3 === 0 ? '#f6c23f' : i % 3 === 1 ? '#ef8f2b' : '#e0602a');
    }
    for (let k = 0; k < 3; k += 1) {
      const gy = -60 + k * 22;
      for (let i = 0; i <= 16; i += 1) {
        const t = i / 16;
        b.append('circle')
          .attr('cx', -80 + t * 160)
          .attr('cy', gy + Math.sin(Math.PI * t) * 26)
          .attr('r', 5.5).attr('fill', k % 2 ? '#f2b03a' : '#e8752c');
      }
    }
    drawPerson(scene, {
      x: bx + (bi ? 84 : -84), y: FLOOR + 104, height: 158,
      fill: '#180510', rim: 'rgba(255,186,102,.7)', head: bi ? 'veil' : 'turban', arms: 'carry',
      flip: bi === 1,
    });
  });

  for (let i = 0; i < 60; i += 1) {
    scene.append('ellipse')
      .attr('class', cls.petal)
      .datum({ baseX: rnd(0, W), speed: rnd(28, 78), phase: rnd(0, 6.3), spin: rnd(40, 140) })
      .attr('rx', rnd(4, 9)).attr('ry', rnd(2, 4.5))
      .attr('fill', i % 3 === 0 ? '#f8d55a' : i % 3 === 1 ? '#ef8a2c' : '#e0532c')
      .attr('opacity', rnd(0.5, 0.95));
  }
  for (let i = 0; i < 7; i += 1) {
    scene.append('path')
      .attr('class', cls.smoke).datum({ x: rnd(320, 1280), phase: rnd(0, 7), drift: rnd(-26, 26) })
      .attr('d', `M 0 0 C ${rnd(-30, 30)} -70, ${rnd(-46, 46)} -130, ${rnd(-24, 24)} -210 S ${rnd(-40, 40)} -300, ${rnd(-16, 16)} -380`)
      .attr('fill', 'none').attr('stroke', '#ffd9ad').attr('stroke-width', rnd(9, 20))
      .attr('stroke-linecap', 'round').attr('filter', 'url(#jSoft)');
  }

  // Foreground arch — we are standing inside the corridor.
  const frame = scene.append('g').attr('fill', '#12050b');
  frame.append('path').attr('d', `M 0 0 H ${W} V 20 Q ${VPX} 86 0 20 Z`);
  frame.append('path').attr('d', `M 0 0 V ${H} H 104 Q 150 340 118 0 Z`);
  frame.append('path').attr('d', `M ${W} 0 V ${H} H ${W - 104} Q ${W - 150} 340 ${W - 118} 0 Z`);
}

/* ------------------------------------------------------------------ *
 * 03 — Vishwanath Gali
 * A real Varanasi lane: barely two metres wide, walls three storeys
 * high squeezing the frame, a thin ribbon of sky, painted lime plaster
 * over exposed brick, wall shrines, hand-painted Devanagari boards,
 * knots of cable, and a cow that will not move.
 * ------------------------------------------------------------------ */
export function buildLanes(root, defs, rnd, cls) {
  addRadial(defs, 'laneEnd', [['0%', '#fff8dd', 1], ['26%', '#ffd489', 0.9], ['62%', '#e08a42', 0.34], ['100%', '#6d2a22', 0]]);
  addLinear(defs, 'laneSkySlot', [['0%', '#cfe2f2'], ['52%', '#f2e3c2'], ['100%', '#f8c27c']]);

  const scene = root.append('g').attr('data-scene', 'lanes').attr('opacity', 0);
  scene.append('rect').attr('width', W).attr('height', H).attr('fill', '#150c14');

  /* ---- Perspective cage -------------------------------------------------
     Half-width is only 0.34 of the gate scale against a wall height of
     1.9 — a slot roughly a third as wide as it is tall, which is what
     actually makes a gali feel like a gali. */
  const VP = { x: 900, y: 448 };
  const hs = [3200, 2000, 1250, 780, 490, 305, 190, 118, 74, 46];
  const gates = hs.map((h) => ({
    xl: VP.x - h * 0.34, xr: VP.x + h * 0.34,
    yt: VP.y - h * 1.5, yb: VP.y + h * 0.4, h,
  }));

  const lerp = (a, b, t) => a + (b - a) * t;
  const sample = (edge, u, v) => {
    const i = Math.max(0, Math.min(gates.length - 2, Math.floor(u)));
    const t = Math.max(0, Math.min(1, u - i));
    const g0 = gates[i];
    const g1 = gates[i + 1];
    const x = lerp(edge === 'l' ? g0.xl : g0.xr, edge === 'l' ? g1.xl : g1.xr, t);
    const yt = lerp(g0.yt, g1.yt, t);
    const yb = lerp(g0.yb, g1.yb, t);
    return [x, yt + (yb - yt) * v, yb - yt];
  };
  const quad = (edge, u0, u1, v0, v1) => {
    const a = sample(edge, u0, v0);
    const b = sample(edge, u1, v0);
    const c = sample(edge, u1, v1);
    const d = sample(edge, u0, v1);
    return `M ${a[0].toFixed(1)} ${a[1].toFixed(1)} L ${b[0].toFixed(1)} ${b[1].toFixed(1)} L ${c[0].toFixed(1)} ${c[1].toFixed(1)} L ${d[0].toFixed(1)} ${d[1].toFixed(1)} Z`;
  };
  const span = (u, v) => [sample('l', u, v), sample('r', u, v)];

  scene.append('circle').attr('cx', VP.x).attr('cy', VP.y + 10).attr('r', 300).attr('fill', 'url(#laneEnd)');

  /* ---- Raw shells: floor, sky ribbon, wall planes ---------------------- */
  const floorScale = d3.interpolateRgb('#1a1219', '#dda168');
  for (let i = gates.length - 2; i >= 0; i -= 1) {
    const g0 = gates[i];
    const g1 = gates[i + 1];
    const k = 1 - i / (gates.length - 2);

    scene.append('path')
      .attr('d', `M ${g0.xl} ${g0.yb} L ${g1.xl} ${g1.yb} L ${g1.xr} ${g1.yb} L ${g0.xr} ${g0.yb} Z`)
      .attr('fill', floorScale(Math.pow(k, 0.75)));
    scene.append('path')
      .attr('d', `M ${g0.xl} ${g0.yt} L ${g1.xl} ${g1.yt} L ${g1.xr} ${g1.yt} L ${g0.xr} ${g0.yt} Z`)
      .attr('fill', 'url(#laneSkySlot)').attr('opacity', 0.2 + k * 0.75);

    ['l', 'r'].forEach((edge) => {
      const x0 = edge === 'l' ? g0.xl : g0.xr;
      const x1 = edge === 'l' ? g1.xl : g1.xr;
      scene.append('path')
        .attr('d', `M ${x0} ${g0.yt} L ${x1} ${g1.yt} L ${x1} ${g1.yb} L ${x0} ${g0.yb} Z`)
        .attr('fill', d3.interpolateRgb(edge === 'l' ? '#2a1a22' : '#241a26', edge === 'l' ? '#d9a06a' : '#cf9a72')(Math.pow(k, 0.8)));
    });
  }

  /* ---- Paving: uneven stone flags, a wet channel, two worn steps ------- */
  const paving = scene.append('g');
  let pu = 0.2;
  while (pu < 9) {
    const [a, b] = span(pu, 1);
    const k = Math.min(1, pu / 9);
    paving.append('line')
      .attr('x1', a[0]).attr('y1', a[1]).attr('x2', b[0]).attr('y2', b[1])
      .attr('stroke', '#0e090f').attr('stroke-width', Math.max(0.5, 6 - k * 5.4))
      .attr('opacity', 0.3 - k * 0.16);
    pu += 0.16 + rnd(0, 0.16);
  }
  [0.14, 0.33, 0.52, 0.71, 0.88].forEach((f, fi) => {
    const pts = [];
    for (let u = 0.2; u < 9; u += 0.35) {
      const [a, b] = span(u, 1);
      const jitter = Math.sin(u * 3.1 + fi * 2.2) * 0.018;
      pts.push(`${(a[0] + (b[0] - a[0]) * (f + jitter)).toFixed(1)} ${((a[1] + b[1]) / 2).toFixed(1)}`);
    }
    paving.append('path').attr('d', `M ${pts.join(' L ')}`)
      .attr('fill', 'none').attr('stroke', '#0e090f').attr('stroke-width', 2).attr('opacity', 0.14);
  });
  // Two shallow steps — galis are never level.
  [3.05, 5.15].forEach((su) => {
    const [a, b] = span(su, 1);
    const [a2, b2] = span(su + 0.16, 1);
    paving.append('path')
      .attr('d', `M ${a[0]} ${a[1]} L ${b[0]} ${b[1]} L ${b2[0]} ${b2[1]} L ${a2[0]} ${a2[1]} Z`)
      .attr('fill', '#100a12').attr('opacity', 0.6);
    paving.append('line')
      .attr('x1', a2[0]).attr('y1', a2[1]).attr('x2', b2[0]).attr('y2', b2[1])
      .attr('stroke', '#ffcf8e').attr('stroke-width', 2.4).attr('stroke-opacity', 0.4);
  });
  // Damp centre channel and a puddle holding the far light.
  const drain = [];
  for (let u = 0.2; u < 9; u += 0.3) {
    const [a, b] = span(u, 1);
    drain.push([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (b[0] - a[0]) * 0.03]);
  }
  paving.append('path')
    .attr('d', `M ${drain.map(([x, y, w]) => `${(x - w).toFixed(1)} ${y.toFixed(1)}`).join(' L ')} L ${drain.slice().reverse().map(([x, y, w]) => `${(x + w).toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z`)
    .attr('fill', '#ffd190').attr('opacity', 0.18).attr('filter', 'url(#jSoft)');
  [[2.35, -0.24, 0.2], [4.05, 0.3, 0.13]].forEach(([u, off, size]) => {
    const [a, b] = span(u, 1);
    const cx = (a[0] + b[0]) / 2 + off * (b[0] - a[0]);
    paving.append('ellipse')
      .attr('cx', cx).attr('cy', (a[1] + b[1]) / 2)
      .attr('rx', (b[0] - a[0]) * size).attr('ry', (b[0] - a[0]) * size * 0.16)
      .attr('fill', '#ffce8a').attr('opacity', 0.24).attr('filter', 'url(#jSoft)');
  });

  /* ---- Façade vocabulary ---------------------------------------------- */
  // Lime-washed plaster in the colours the old city is actually painted.
  const plasters = ['#9c7742', '#8a544a', '#556274', '#836639', '#6c714b', '#9c8b76', '#7d525a']
    .map((c) => d3.interpolateRgb(c, '#7d6a56')(0.34));
  const shutterTones = ['#1d4d55', '#5f2330', '#26456a', '#7a3d17', '#2c5a49'];
  const boardTones = ['#1f5f63', '#8a2f26', '#20406e', '#7d5a17', '#4a2a5e'];

  /* Hand-painted Devanagari: a shirorekha with glyph strokes hung beneath
     it. At sign scale this reads unmistakably as Hindi lettering. */
  const devanagari = (edge, u0, u1, v0, v1, fill, opacity) => {
    const hgt = v1 - v0;
    const bar = v0 + hgt * 0.2;
    scene.append('path').attr('d', quad(edge, u0, u1, bar, bar + hgt * 0.1))
      .attr('fill', fill).attr('opacity', opacity);
    const glyphs = 7;
    for (let g = 0; g < glyphs; g += 1) {
      const s0 = u0 + ((u1 - u0) * (g + 0.12)) / glyphs;
      const s1 = u0 + ((u1 - u0) * (g + 0.82)) / glyphs;
      const mid = (s0 + s1) / 2;
      scene.append('path').attr('d', quad(edge, mid - (s1 - s0) * 0.14, mid + (s1 - s0) * 0.14, bar + hgt * 0.1, v1 - hgt * 0.06))
        .attr('fill', fill).attr('opacity', opacity);
      if (g % 3 !== 1) {
        scene.append('path').attr('d', quad(edge, s0, mid, v1 - hgt * 0.4, v1 - hgt * 0.28))
          .attr('fill', fill).attr('opacity', opacity * 0.9);
      }
      if (g % 2 === 0) {
        scene.append('path').attr('d', quad(edge, mid, s1, bar + hgt * 0.34, bar + hgt * 0.46))
          .attr('fill', fill).attr('opacity', opacity * 0.9);
      }
    }
  };

  const bays = [];
  for (let u = 0; u < 7.6; u += 0.5) bays.push(u);

  ['l', 'r'].forEach((edge, side) => {
    bays.forEach((u, bi) => {
      const uEnd = u + 0.5;
      const k = Math.min(1, (u + 0.25) / 7.6);
      const light = Math.pow(k, 0.62);
      const warm = (dark, bright) => d3.interpolateRgb(dark, bright)(light);
      const a = u + 0.03;
      const b = uEnd - 0.03;
      const type = (bi * 2 + side) % 5;
      const plaster = plasters[(bi * 3 + side * 2) % plasters.length];
      // One real metre at this depth. Props sized off the wall span blow up
      // absurdly on the near bays, so everything physical uses this instead.
      const metre = (sample('r', (u + uEnd) / 2, 1)[0] - sample('l', (u + uEnd) / 2, 1)[0]) / 2.2;
      const clamp = (lo, v, hi) => Math.max(lo, Math.min(hi, v));
      const nearBay = u < 1.1;

      /* Wall plane: painted plaster, sun-bleached toward the far end. */
      scene.append('path').attr('d', quad(edge, u, uEnd, -0.02, 1))
        .attr('fill', d3.interpolateRgb(d3.interpolateRgb('#1a1018', plaster)(0.25 + light * 0.75), '#f6dcae')(light * 0.3));
      // Peeling plaster patches showing the brick beneath.
      if (type !== 2) {
        const px = a + (b - a) * (0.16 + (bi % 3) * 0.24);
        scene.append('path').attr('d', quad(edge, px, px + (b - a) * 0.3, 0.36 + (bi % 2) * 0.16, 0.52 + (bi % 2) * 0.16))
          .attr('fill', warm('#2b1a1c', '#a6644a')).attr('opacity', 0.55);
        scene.append('path').attr('d', quad(edge, px + (b - a) * 0.05, px + (b - a) * 0.22, 0.4 + (bi % 2) * 0.16, 0.47 + (bi % 2) * 0.16))
          .attr('fill', warm('#3a2018', '#8f4f38')).attr('opacity', 0.5);
      }
      // Rising damp and paan-stained base.
      scene.append('path').attr('d', quad(edge, u, uEnd, 0.8, 1))
        .attr('fill', '#241419').attr('opacity', 0.46 - light * 0.2);
      scene.append('path').attr('d', quad(edge, a + (b - a) * 0.6, a + (b - a) * 0.72, 0.66, 0.94))
        .attr('fill', '#6b1f1c').attr('opacity', 0.22);

      /* Parapet, roof overhang and its cast shadow. */
      scene.append('path').attr('d', quad(edge, u - 0.02, uEnd + 0.02, -0.03, 0.012))
        .attr('fill', warm('#2a1720', '#e0aa74'));
      scene.append('path').attr('d', quad(edge, u, uEnd, 0.012, 0.05))
        .attr('fill', '#120b14').attr('opacity', 0.55 - light * 0.24);

      /* ---------- top storey: small deep windows and drying laundry ------ */
      scene.append('path').attr('d', quad(edge, a + (b - a) * 0.24, a + (b - a) * 0.6, 0.1, 0.24))
        .attr('fill', '#0f0912').attr('opacity', 0.85);
      scene.append('path').attr('d', quad(edge, a + (b - a) * 0.27, a + (b - a) * 0.57, 0.115, 0.225))
        .attr('fill', '#ffb257').attr('opacity', 0.12 + light * 0.24);
      if (bi % 2 === 0) {
        const clothTones = ['#c4483a', '#2f7f86', '#e0a52c', '#e9e0cc'];
        for (let c = 0; c < 3; c += 1) {
          const c0 = a + (b - a) * (0.08 + c * 0.3);
          scene.append('path').attr('d', quad(edge, c0, c0 + (b - a) * 0.2, 0.045, 0.045 + 0.11 + (c % 2) * 0.04))
            .attr('fill', d3.interpolateRgb('#221520', clothTones[(bi + c) % 4])(0.2 + light * 0.8))
            .attr('opacity', 0.9);
        }
      }

      /* ---------- cornice ------------------------------------------------ */
      scene.append('path').attr('d', quad(edge, u - 0.015, uEnd + 0.015, 0.3, 0.332))
        .attr('fill', warm('#452838', '#f7d3a0'));
      scene.append('path').attr('d', quad(edge, u, uEnd, 0.332, 0.36))
        .attr('fill', '#150d18').attr('opacity', 0.5 - light * 0.22);

      /* ---------- middle storey: the wall the camera actually sees ------- */
      if (type === 0) {
        // A shrine set into the wall: vermilion smear, lamp, bell, garland.
        scene.append('path').attr('d', quad(edge, a + (b - a) * 0.12, a + (b - a) * 0.62, 0.37, 0.6))
          .attr('fill', warm('#4a2016', '#c85f2c')).attr('opacity', 0.85);
        scene.append('path').attr('d', quad(edge, a + (b - a) * 0.18, a + (b - a) * 0.56, 0.4, 0.575))
          .attr('fill', '#0d0710').attr('opacity', 0.94);
        scene.append('path').attr('d', quad(edge, a + (b - a) * 0.22, a + (b - a) * 0.52, 0.43, 0.565))
          .attr('fill', warm('#3d0f12', '#c9302c')).attr('opacity', 0.9);
        const [ix, iy] = sample(edge, a + (b - a) * 0.37, 0.53);
        scene.append('ellipse').attr('cx', ix).attr('cy', iy)
          .attr('rx', clamp(1.4, metre * 0.05, 9)).attr('ry', clamp(2, metre * 0.1, 18))
          .attr('fill', '#120a10');
        const [gx, gy] = sample(edge, a + (b - a) * 0.37, 0.42);
        const gr = clamp(0.9, metre * 0.03, 5);
        for (let mg = 0; mg < 7; mg += 1) {
          scene.append('circle')
            .attr('cx', gx + (mg - 3) * gr * 1.9).attr('cy', gy + Math.abs(mg - 3) * gr * 0.5)
            .attr('r', gr)
            .attr('fill', mg % 2 ? '#f0b93c' : '#e2712a').attr('opacity', 0.7 + light * 0.3);
        }
        if (!nearBay) {
          const [lx0, ly0] = sample(edge, a + (b - a) * 0.5, 0.555);
          scene.append('circle').attr('class', cls.lantern).datum({ phase: bi + side * 1.3 })
            .attr('cx', lx0).attr('cy', ly0).attr('r', clamp(1.5, metre * 0.045, 7))
            .attr('fill', '#ffc266').attr('filter', 'url(#jGlow)');
        }
        // Painted trishul beside the niche.
        scene.append('path').attr('d', quad(edge, a + (b - a) * 0.72, a + (b - a) * 0.75, 0.39, 0.6))
          .attr('fill', '#d9622a').attr('opacity', 0.5);
        scene.append('path').attr('d', quad(edge, a + (b - a) * 0.66, a + (b - a) * 0.81, 0.39, 0.415))
          .attr('fill', '#d9622a').attr('opacity', 0.5);
      } else if (type === 1) {
        // Shuttered window with a stone surround and a projecting sill.
        scene.append('path').attr('d', quad(edge, a + (b - a) * 0.14, a + (b - a) * 0.72, 0.365, 0.585))
          .attr('fill', warm('#3d2431', '#e9c295'));
        scene.append('path').attr('d', quad(edge, a + (b - a) * 0.19, a + (b - a) * 0.67, 0.385, 0.565))
          .attr('fill', '#0f0912').attr('opacity', 0.92);
        const mid = (a + (b - a) * 0.19 + (a + (b - a) * 0.67)) / 2;
        [[a + (b - a) * 0.2, mid - (b - a) * 0.006], [mid + (b - a) * 0.006, a + (b - a) * 0.66]].forEach(([s0, s1], si) => {
          scene.append('path').attr('d', quad(edge, s0, s1, 0.39, 0.56))
            .attr('fill', d3.interpolateRgb(shutterTones[(bi + si) % 5], '#e9b477')(light * 0.55));
          for (let r = 0; r < 5; r += 1) {
            scene.append('path').attr('d', quad(edge, s0 + (b - a) * 0.008, s1 - (b - a) * 0.008, 0.4 + r * 0.032, 0.415 + r * 0.032))
              .attr('fill', '#0c0710').attr('opacity', 0.34);
          }
        });
        scene.append('path').attr('d', quad(edge, a + (b - a) * 0.1, a + (b - a) * 0.76, 0.585, 0.61))
          .attr('fill', warm('#4a3040', '#efc99b'));
      } else if (type === 2) {
        // Projecting jharokha with a warm room and someone leaning out.
        scene.append('path').attr('d', quad(edge, a + 0.02, b - 0.02, 0.37, 0.53))
          .attr('fill', '#0e0812').attr('opacity', 0.9);
        scene.append('path').attr('d', quad(edge, a + 0.05, b - 0.05, 0.39, 0.51))
          .attr('fill', '#ffb257').attr('opacity', 0.24 + light * 0.4);
        if (u > 1.6 && u < 6.6) {
          const [jx, jy, jh] = sample(edge, (a + b) / 2, 0.51);
          drawPerson(scene, {
            x: jx, y: jy, height: jh * 0.24, fill: '#190e17',
            opacity: 0.6 + light * 0.25, head: bi % 2 ? 'veil' : 'bun',
          });
        }
        scene.append('path').attr('d', quad(edge, a - 0.025, b + 0.025, 0.5, 0.56))
          .attr('fill', warm('#3f2534', '#e6ae7c'));
        for (let s = 0; s < 7; s += 1) {
          const t0 = a + (b - a) * ((s + 0.22) / 7);
          scene.append('path').attr('d', quad(edge, t0, t0 + (b - a) * 0.07, 0.505, 0.555))
            .attr('fill', '#110a13').attr('opacity', 0.55);
        }
        scene.append('path').attr('d', quad(edge, a + 0.04, b - 0.04, 0.56, 0.592))
          .attr('fill', warm('#2c1a27', '#c78f5f'));
      } else if (type === 3) {
        // Bare plaster: hand-painted advert, meter box, knot of cable.
        devanagari(edge, a + (b - a) * 0.1, a + (b - a) * 0.78, 0.4, 0.51,
          warm('#3a1c1c', '#7a2a22'), 0.62);
        scene.append('path').attr('d', quad(edge, a + (b - a) * 0.7, a + (b - a) * 0.88, 0.53, 0.62))
          .attr('fill', warm('#221a20', '#5c5b52'));
        scene.append('path').attr('d', quad(edge, a + (b - a) * 0.73, a + (b - a) * 0.85, 0.545, 0.585))
          .attr('fill', '#0e0910').attr('opacity', 0.8);
        for (let c = 0; c < 5; c += 1) {
          const pts = [];
          for (let t0 = 0; t0 <= 1.0001; t0 += 0.25) {
            const [px, py] = sample(edge, a + (b - a) * t0, 0.55 + Math.sin(t0 * 4 + c * 1.4) * 0.035 + c * 0.006);
            pts.push(`${px.toFixed(1)} ${py.toFixed(1)}`);
          }
          scene.append('path').attr('d', `M ${pts.join(' L ')}`)
            .attr('fill', 'none').attr('stroke', '#130c15')
            .attr('stroke-width', Math.max(0.8, 3 - c * 0.4)).attr('opacity', 0.6);
        }
      } else {
        // Barred window over a glowing interior, cloth pinned across it.
        scene.append('path').attr('d', quad(edge, a + (b - a) * 0.16, a + (b - a) * 0.7, 0.375, 0.575))
          .attr('fill', warm('#3a2231', '#e3bb8d'));
        scene.append('path').attr('d', quad(edge, a + (b - a) * 0.2, a + (b - a) * 0.66, 0.395, 0.555))
          .attr('fill', '#ffb45c').attr('opacity', 0.2 + light * 0.4);
        for (let r = 0; r < 6; r += 1) {
          const t0 = a + (b - a) * (0.2 + (0.46 * (r + 0.4)) / 6);
          scene.append('path').attr('d', quad(edge, t0, t0 + (b - a) * 0.014, 0.395, 0.555))
            .attr('fill', '#0d0810').attr('opacity', 0.85);
        }
        scene.append('path').attr('d', quad(edge, a + (b - a) * 0.2, a + (b - a) * 0.66, 0.395, 0.44))
          .attr('fill', d3.interpolateRgb('#2a1420', '#c4483a')(0.3 + light * 0.7)).attr('opacity', 0.85);
      }

      /* ---------- shop lintel: awning or painted signboard --------------- */
      const shopBay = type !== 1 && type !== 4;
      if (shopBay) {
        // Corrugated tin or cloth awning, sagging on its poles.
        scene.append('path').attr('d', quad(edge, u - 0.012, uEnd + 0.012, 0.6, 0.665))
          .attr('fill', d3.interpolateRgb('#3d1712', '#c96f45')(0.22 + light * 0.78));
        for (let s = 0; s < 6; s += 1) {
          const t0 = u + (uEnd - u) * ((s + 0.12) / 6);
          scene.append('path').attr('d', quad(edge, t0, t0 + (uEnd - u) * 0.075, 0.6, 0.665))
            .attr('fill', d3.interpolateRgb('#5e4420', '#f2dcac')(0.2 + light * 0.8)).attr('opacity', 0.8);
        }
        scene.append('path').attr('d', quad(edge, u, uEnd, 0.665, 0.69))
          .attr('fill', '#0d0810').attr('opacity', 0.55);
      } else {
        scene.append('path').attr('d', quad(edge, a + (b - a) * 0.06, b - (b - a) * 0.06, 0.605, 0.675))
          .attr('fill', d3.interpolateRgb('#14232c', boardTones[(bi + side) % 5])(0.3 + light * 0.7));
        devanagari(edge, a + (b - a) * 0.12, b - (b - a) * 0.12, 0.612, 0.668, '#f6e2b4', 0.55 + light * 0.4);
      }

      /* ---------- ground floor ------------------------------------------ */
      if (shopBay) {
        // Open shop: deep dark recess with a lit back wall and goods.
        scene.append('path').attr('d', quad(edge, a, b, 0.68, 1))
          .attr('fill', '#0b0610').attr('opacity', 0.96);
        scene.append('path').attr('d', quad(edge, a + 0.04, b - 0.04, 0.71, 0.96))
          .attr('fill', '#ffb45c').attr('opacity', 0.14 + light * 0.24);

        if (type === 0) {
          // Silk: a few lengths hanging, not a wall of colour swatches.
          for (let c = 0; c < 4; c += 1) {
            const s0 = a + 0.02 + ((b - a - 0.06) * c) / 4;
            const tone = ['#a8323f', '#c08a1e', '#1f6f79', '#7a3a8c'][(bi + c) % 4];
            scene.append('path').attr('d', quad(edge, s0, s0 + (b - a) * 0.14, 0.71, 0.93))
              .attr('fill', d3.interpolateRgb(d3.interpolateRgb('#1c1119', tone)(0.3 + light * 0.7), '#f0d3a4')(light * 0.3))
              .attr('opacity', 0.9);
            scene.append('path').attr('d', quad(edge, s0, s0 + (b - a) * 0.045, 0.71, 0.93))
              .attr('fill', '#ffe0ae').attr('opacity', 0.07 + light * 0.16);
          }
          // Two stacked bolts on the counter.
          scene.append('path').attr('d', quad(edge, a + (b - a) * 0.2, b - (b - a) * 0.2, 0.9, 0.95))
            .attr('fill', warm('#2a1a20', '#c08a5c'));
        } else if (type === 2) {
          // Brass vessels on shelves, catching the lane light.
          for (let r = 0; r < 3; r += 1) {
            scene.append('path').attr('d', quad(edge, a + 0.025, b - 0.025, 0.76 + r * 0.07, 0.775 + r * 0.07))
              .attr('fill', '#33200f');
            for (let c = 0; c < 4; c += 1) {
              const [px, py] = sample(edge, a + 0.035 + ((b - a - 0.07) * c) / 3.4, 0.745 + r * 0.07);
              scene.append('ellipse').attr('cx', px).attr('cy', py)
                .attr('rx', clamp(1.2, metre * 0.05, 8)).attr('ry', clamp(1.6, metre * 0.065, 11))
                .attr('fill', d3.interpolateRgb('#7d5720', '#ffd98d')(0.28 + light * 0.62));
            }
          }
        } else {
          // Marigold garlands hung in loops across the shopfront.
          for (let c = 0; c < 4; c += 1) {
            const s0 = a + 0.025 + ((b - a - 0.06) * c) / 3.6;
            for (let r = 0; r < 8; r += 1) {
              const [px, py] = sample(edge, s0, 0.7 + r * 0.028);
              scene.append('circle').attr('cx', px).attr('cy', py)
                .attr('r', clamp(1, metre * 0.032, 5.5))
                .attr('fill', d3.interpolateRgb('#2a1418', (r + c) % 3 === 0 ? '#f4c542' : (r + c) % 3 === 1 ? '#ef8a2b' : '#e2582b')(0.24 + light * 0.76))
                .attr('opacity', 0.66 + light * 0.32);
            }
          }
        }
        // Shopkeeper sitting in the mouth of the shop.
        if (bi % 2 === 0 && u > 1.6 && u < 6.6) {
          const [kx, ky, kh] = sample(edge, (a + b) / 2 + (b - a) * 0.28, 0.99);
          drawPerson(scene, {
            x: kx, y: ky, height: kh * 0.2, fill: '#140c14', opacity: 0.9,
            head: 'plain', arms: 'down', hem: 0.42, rim: `rgba(255,196,120,${(0.1 + light * 0.3).toFixed(2)})`,
          });
        }
        // Goods and a low step spilling into the lane.
        scene.append('path').attr('d', quad(edge, a - 0.02, b + 0.02, 0.96, 1))
          .attr('fill', warm('#33222c', '#c79f76'));
      } else {
        // Low timber door with a raised stone threshold.
        scene.append('path').attr('d', quad(edge, a - 0.01, b + 0.01, 0.675, 0.715))
          .attr('fill', warm('#42283a', '#e6bd92'));
        scene.append('path').attr('d', quad(edge, a + (b - a) * 0.12, b - (b - a) * 0.12, 0.715, 0.96))
          .attr('fill', d3.interpolateRgb(d3.interpolateRgb('#150b17', shutterTones[bi % 5])(0.3 + light * 0.7), '#e6b072')(light * 0.4));
        for (let r = 0; r < 3; r += 1) {
          [[a + (b - a) * 0.16, (a + b) / 2 - (b - a) * 0.01], [(a + b) / 2 + (b - a) * 0.01, b - (b - a) * 0.16]].forEach(([s0, s1]) => {
            scene.append('path').attr('d', quad(edge, s0, s1, 0.735 + r * 0.075, 0.79 + r * 0.075))
              .attr('fill', '#0c0710').attr('opacity', 0.36);
          });
        }
        // Stone step, worn hollow in the middle.
        scene.append('path').attr('d', quad(edge, a - 0.03, b + 0.03, 0.96, 1))
          .attr('fill', warm('#463042', '#dcb98f'));
        if (bi % 3 === 1 && u > 1.6 && u < 6.6) {
          const [sx2, sy2, sh2] = sample(edge, (a + b) / 2, 0.96);
          drawPerson(scene, {
            x: sx2, y: sy2, height: sh2 * 0.19, fill: '#150d16', opacity: 0.92,
            head: 'plain', arms: 'down', hem: 0.5,
          });
        }
      }

      /* Depth falloff: near bays sink into shadow so the eye is pulled in. */
      scene.append('path').attr('d', quad(edge, u - 0.03, uEnd + 0.03, -0.05, 1))
        .attr('fill', '#0f0812').attr('opacity', 0.9 * Math.pow(1 - light, 1.25));
      scene.append('path').attr('d', quad(edge, u - 0.03, uEnd + 0.03, -0.05, 1))
        .attr('fill', '#3a1d2c').attr('opacity', 0.22 * (1 - light));
      // Horizontal grime bands stop the near wall reading as a flat stripe.
      for (let gb = 0; gb < 3; gb += 1) {
        scene.append('path')
          .attr('d', quad(edge, u - 0.03, uEnd + 0.03, 0.62 + gb * 0.13, 0.68 + gb * 0.13))
          .attr('fill', '#100913').attr('opacity', 0.16 * (1 - light));
      }

      /* Bracket lamp burning through the shadow, and its pool on the stone. */
      if (!nearBay) {
        const [lx, ly] = sample(edge, u + 0.09, 0.6);
        scene.append('circle').attr('class', cls.lantern).datum({ phase: bi * 0.9 + side * 1.7 })
          .attr('cx', lx).attr('cy', ly).attr('r', clamp(1.8, metre * 0.055, 9))
          .attr('fill', '#ffcd74').attr('filter', 'url(#jGlow)');
        const [fx, fy] = sample(edge, u + 0.09, 1);
        scene.append('ellipse').attr('cx', fx).attr('cy', fy)
          .attr('rx', clamp(3, metre * 0.5, 60)).attr('ry', clamp(1.2, metre * 0.12, 15))
          .attr('fill', '#ffc271').attr('opacity', 0.15).attr('filter', 'url(#jSoft)');
      }
    });
  });

  /* ---- Cable runs clinging to both walls ------------------------------- */
  ['l', 'r'].forEach((edge) => {
    for (let c = 0; c < 5; c += 1) {
      const pts = [];
      for (let u = 0.1; u < 8.4; u += 0.4) {
        const [px, py] = sample(edge, u, 0.29 + c * 0.009 + Math.sin(u * 1.9 + c) * 0.014);
        pts.push(`${px.toFixed(1)} ${py.toFixed(1)}`);
      }
      scene.append('path').attr('d', `M ${pts.join(' L ')}`)
        .attr('fill', 'none').attr('stroke', '#130c15')
        .attr('stroke-width', 2.8 - c * 0.35).attr('opacity', 0.6);
    }
  });

  /* ---- Everything strung across the slot of sky ------------------------ */
  const wires = [];
  [[4.5, 0.06], [5.3, 0.02], [6.1, -0.02], [6.9, -0.05]].forEach(([u, v], i) => {
    const p0 = sample('l', u, v);
    const p1 = sample('r', u, v);
    const sag = (p0[1] + p1[1]) / 2 + 34 - i * 6;
    wires.push({ a: p0, b: p1, c: [VP.x, sag] });
    scene.append('path')
      .attr('d', `M ${p0[0]} ${p0[1]} Q ${VP.x} ${sag} ${p1[0]} ${p1[1]}`)
      .attr('fill', 'none').attr('stroke', '#160e18').attr('stroke-width', 2.6 - i * 0.5).attr('opacity', 0.85);
  });
  const onWire = ({ a, b, c }, t) => {
    const k = 1 - t;
    return [k * k * a[0] + 2 * k * t * c[0] + t * t * b[0], k * k * a[1] + 2 * k * t * c[1] + t * t * b[1]];
  };
  // Washing pegged out over the lane — the most Varanasi thing there is.
  const clothTones = ['#c9503c', '#2f8b93', '#efbe45', '#e9e0cc', '#7a3a8c'];
  for (let i = 1; i < 7; i += 1) {
    const t = i / 7;
    const [cx, cy] = onWire(wires[0], t);
    const wide = 20 - Math.abs(t - 0.5) * 12;
    scene.append('path')
      .attr('class', cls.flag).datum({ phase: i * 0.7 })
      .attr('data-anchor', `${cx.toFixed(1)},${cy.toFixed(1)}`)
      .attr('d', `M ${cx - wide / 2} ${cy} L ${cx + wide / 2} ${cy} L ${cx + wide / 2} ${cy + wide * 1.5} Q ${cx} ${cy + wide * 1.2} ${cx - wide / 2} ${cy + wide * 1.5} Z`)
      .attr('fill', clothTones[i % 5]).attr('opacity', 0.9);
  }
  // A short run of festival bunting deeper in.
  for (let i = 1; i < 11; i += 1) {
    const t = i / 11;
    const [bx, by] = onWire(wires[2], t);
    const size = 7 - Math.abs(t - 0.5) * 4;
    scene.append('path')
      .attr('class', cls.flag).datum({ phase: i * 0.5 })
      .attr('data-anchor', `${bx.toFixed(1)},${by.toFixed(1)}`)
      .attr('d', `M ${bx - size * 0.5} ${by} L ${bx + size * 0.5} ${by} L ${bx} ${by + size * 1.7} Z`)
      .attr('fill', clothTones[i % 5]).attr('opacity', 0.9);
  }
  // Bare bulbs on the nearest crossing.
  for (let i = 1; i < 9; i += 1) {
    const t = i / 9;
    const [bx, by] = onWire(wires[1], t);
    const size = 3.6 - Math.abs(t - 0.5) * 1.8;
    scene.append('circle').attr('class', cls.lantern).datum({ phase: i * 0.7 })
      .attr('cx', bx).attr('cy', by + size * 1.6).attr('r', size)
      .attr('fill', i % 2 ? '#ffd487' : '#ffb35f').attr('filter', 'url(#jGlow)');
  }

  /* ---- The lane's population ------------------------------------------- */
  const laneHeads = ['plain', 'veil', 'bun', 'turban'];
  // A person is 1.7m against a 6.2m wall, so height is 0.276 of the wall span.
  [[2.62, 0.48, 'carry', 1.02], [3.45, -0.42, 'down', 0.98], [4.2, 0.36, 'down', 1],
    [4.85, -0.3, 'carry', 0.96], [5.4, 0.26, 'down', 1.02], [5.95, -0.2, 'down', 0.98],
    [6.5, 0.17, 'namaste', 1], [7.05, -0.13, 'down', 0.96], [7.5, 0.1, 'down', 1]]
    .forEach(([u, off, arms, hFrac], i) => {
      const [xl, yb, hSpan] = sample('l', u, 1);
      const [xr] = sample('r', u, 1);
      const cx = (xl + xr) / 2 + off * (xr - xl) * 0.5;
      const glow = Math.min(0.5, 0.08 + u * 0.055);
      drawPerson(scene, {
        x: cx, y: yb, height: hSpan * 0.276 * hFrac, fill: '#150c15', opacity: 0.97,
        arms, head: laneHeads[i % 4], flip: i % 3 === 0, stance: i % 2 ? 'walk' : 'stand',
        rim: `rgba(255,198,124,${glow.toFixed(2)})`,
      });
    });

  /* ---- A cow that will not move ---------------------------------------- */
  // Placed close and to the right so you are squeezing past her, and so the
  // bright slot at the end of the lane stays open.
  const COW_U = 2.58;
  const [cowXl, cowY] = sample('l', COW_U, 1);
  const [cowXr] = sample('r', COW_U, 1);
  const laneW = cowXr - cowXl;
  const cowScale = (laneW * 0.66) / 339;
  const cow = scene.append('g')
    .attr('transform', `translate(${(cowXl + cowXr) / 2 + laneW * 0.33}, ${cowY}) scale(${cowScale.toFixed(4)})`);
  cow.append('ellipse').attr('cx', 10).attr('cy', 4).attr('rx', 150).attr('ry', 17)
    .attr('fill', '#0b060b').attr('opacity', 0.6).attr('filter', 'url(#jSoft)');

  const hide = '#3b2b2c';
  const hideDark = '#241719';
  const hidePale = '#9c8261';
  cow.append('path').attr('d', 'M -92 -88 v 88 M -60 -86 v 86 M 60 -92 v 92 M 90 -90 v 90')
    .attr('fill', 'none').attr('stroke', hide).attr('stroke-width', 17).attr('stroke-linecap', 'round');
  cow.append('path').attr('d', 'M -92 -16 v 16 M -60 -14 v 14 M 60 -18 v 18 M 90 -16 v 16')
    .attr('fill', 'none').attr('stroke', hideDark).attr('stroke-width', 18).attr('stroke-linecap', 'round');
  cow.append('path').attr('d', 'M -112 -162 q -26 46 -18 96')
    .attr('fill', 'none').attr('stroke', hide).attr('stroke-width', 7).attr('stroke-linecap', 'round');
  cow.append('ellipse').attr('cx', -129).attr('cy', -62).attr('rx', 8).attr('ry', 15).attr('fill', hideDark);
  cow.append('path')
    .attr('d', 'M -116 -130 C -116 -172 -80 -190 -20 -192 C 30 -194 74 -186 96 -166 C 112 -150 110 -110 92 -94 C 60 -74 -80 -76 -108 -96 C -116 -104 -116 -118 -116 -130 Z')
    .attr('fill', hide);
  cow.append('path').attr('d', 'M 18 -186 C 28 -218 60 -226 80 -210 C 94 -198 100 -178 100 -162 C 80 -180 48 -188 18 -186 Z')
    .attr('fill', hide);
  cow.append('path').attr('d', 'M 86 -178 C 112 -180 140 -172 154 -158 L 160 -118 C 136 -106 106 -110 86 -118 Z')
    .attr('fill', hide);
  cow.append('path').attr('d', 'M 96 -132 C 104 -100 130 -92 152 -100 C 130 -104 112 -116 108 -136 Z')
    .attr('fill', hide);
  cow.append('path').attr('d', 'M 144 -174 C 176 -184 206 -172 216 -148 C 224 -128 216 -108 196 -102 L 166 -98 C 144 -114 134 -152 144 -174 Z')
    .attr('fill', hide);
  cow.append('path').attr('d', 'M -112 -104 C -70 -78 58 -78 94 -100 C 76 -70 -84 -70 -112 -104 Z')
    .attr('fill', hideDark).attr('opacity', 0.85);
  cow.append('ellipse').attr('cx', -10).attr('cy', -150).attr('rx', 86).attr('ry', 30)
    .attr('fill', '#54403c').attr('opacity', 0.35).attr('filter', 'url(#jSoft)');
  // Ear laid back against the skull.
  cow.append('path').attr('d', 'M 148 -156 C 118 -172 96 -166 92 -150 C 104 -134 130 -134 150 -142 Z').attr('fill', hideDark);
  // Long muzzle with a nostril — this is what stops her reading as a dog.
  cow.append('path').attr('d', 'M 190 -104 C 210 -104 224 -114 222 -128 C 220 -140 204 -144 190 -138 Z')
    .attr('fill', '#4d3a35');
  cow.append('ellipse').attr('cx', 210).attr('cy', -124).attr('rx', 4).attr('ry', 5.5).attr('fill', '#160e10');
  cow.append('path').attr('d', 'M 192 -108 C 206 -106 216 -110 220 -118')
    .attr('fill', 'none').attr('stroke', '#160e10').attr('stroke-width', 2.6).attr('stroke-opacity', 0.6);
  cow.append('ellipse').attr('cx', 188).attr('cy', -150).attr('rx', 6).attr('ry', 5).attr('fill', '#0b0709');
  cow.append('circle').attr('cx', 190).attr('cy', -152).attr('r', 1.8).attr('fill', '#e8d3ae').attr('opacity', 0.6);
  // Short, thick zebu horns curving out and back.
  cow.append('path').attr('d', 'M 156 -176 C 146 -196 152 -214 168 -220')
    .attr('fill', 'none').attr('stroke', hidePale).attr('stroke-width', 9).attr('stroke-linecap', 'round');
  cow.append('path').attr('d', 'M 190 -172 C 196 -192 210 -202 224 -202')
    .attr('fill', 'none').attr('stroke', hidePale).attr('stroke-width', 8).attr('stroke-linecap', 'round');
  cow.append('path').attr('d', 'M 150 -178 C 172 -188 186 -186 196 -174 C 178 -180 164 -182 150 -178 Z')
    .attr('fill', hideDark).attr('opacity', 0.7);
  cow.append('path').attr('d', 'M 98 -172 q 16 26 8 52').attr('fill', 'none')
    .attr('stroke', '#8a4028').attr('stroke-width', 9).attr('stroke-linecap', 'round').attr('opacity', 0.9);
  cow.append('circle').attr('cx', 106).attr('cy', -114).attr('r', 8).attr('fill', '#d9a24a').attr('opacity', 0.9);
  cow.append('path')
    .attr('d', 'M -114 -140 C -112 -176 -76 -188 -20 -190 C 20 -192 6 -186 18 -186 C 28 -218 60 -226 80 -210 C 94 -198 100 -178 100 -162')
    .attr('fill', 'none').attr('stroke', 'rgba(255,220,166,.5)').attr('stroke-width', 4.6).attr('stroke-linecap', 'round');
  cow.append('path').attr('d', 'M 100 -168 C 122 -176 142 -174 152 -166')
    .attr('fill', 'none').attr('stroke', 'rgba(255,220,166,.24)').attr('stroke-width', 3.4).attr('stroke-linecap', 'round');
  cow.append('path').attr('d', 'M 148 -176 C 178 -186 206 -174 216 -150')
    .attr('fill', 'none').attr('stroke', 'rgba(255,220,166,.3)').attr('stroke-width', 3.4).attr('stroke-linecap', 'round');

  /* ---- Foreground: a chai stall wedged against the near right wall ----- */
  const stall = scene.append('g').attr('transform', 'translate(524, 1058) scale(0.9)');
  stall.append('rect').attr('x', -128).attr('y', -268).attr('width', 10).attr('height', 268).attr('fill', '#5c3a22');
  stall.append('rect').attr('x', -128).attr('y', -268).attr('width', 3).attr('height', 268).attr('fill', '#c79a5f');
  stall.append('rect').attr('x', 118).attr('y', -268).attr('width', 10).attr('height', 268).attr('fill', '#5c3a22');
  stall.append('path').attr('d', 'M -160 -268 H 160 L 138 -224 H -138 Z').attr('fill', '#8a3524');
  for (let i = 0; i < 7; i += 1) {
    stall.append('path')
      .attr('d', `M ${-160 + i * 45.7} -268 h 22 l -19 44 h -22 Z`)
      .attr('fill', i % 2 ? '#e8c163' : '#c94f2c').attr('opacity', 0.85);
  }
  stall.append('circle').attr('class', cls.lantern).datum({ phase: 2.4 })
    .attr('cy', -206).attr('r', 11).attr('fill', '#ffd58a').attr('filter', 'url(#jGlow)');
  stall.append('line').attr('y1', -224).attr('y2', -212).attr('stroke', '#2b1a1a').attr('stroke-width', 2);
  stall.append('rect').attr('x', -112).attr('y', -96).attr('width', 224).attr('height', 96).attr('fill', '#331c17');
  for (let i = 0; i < 7; i += 1) {
    stall.append('rect').attr('x', -108 + i * 32).attr('y', -92).attr('width', 13).attr('height', 88)
      .attr('fill', '#6b2f22').attr('opacity', 0.6);
  }
  stall.append('rect').attr('x', -122).attr('y', -110).attr('width', 244).attr('height', 16).attr('rx', 3).attr('fill', '#6b3a20');
  stall.append('rect').attr('x', -122).attr('y', -96).attr('width', 244).attr('height', 5).attr('fill', '#000').attr('opacity', 0.35);

  const urn = stall.append('g').attr('transform', 'translate(-34, 0)');
  urn.append('path').attr('d', 'M -50 -110 C -62 -158 -58 -208 -34 -228 L 34 -228 C 58 -208 62 -158 50 -110 Z').attr('fill', '#c8862f');
  urn.append('path').attr('d', 'M -50 -110 C -62 -158 -58 -208 -34 -228 L -8 -228 C -26 -206 -30 -158 -20 -110 Z').attr('fill', '#eec06a').attr('opacity', 0.6);
  urn.append('ellipse').attr('cy', -228).attr('rx', 40).attr('ry', 11).attr('fill', '#e0a949');
  urn.append('ellipse').attr('cy', -236).attr('rx', 30).attr('ry', 9).attr('fill', '#a86c22');
  urn.append('rect').attr('x', -7).attr('y', -256).attr('width', 14).attr('height', 22).attr('rx', 5).attr('fill', '#e8b757');
  urn.append('rect').attr('x', -54).attr('y', -186).attr('width', 108).attr('height', 12).attr('rx', 4).attr('fill', '#f0c368').attr('opacity', 0.75);
  urn.append('path').attr('d', 'M -50 -168 q -22 -8 -24 -28').attr('fill', 'none').attr('stroke', '#a86c22').attr('stroke-width', 8).attr('stroke-linecap', 'round');
  urn.append('path').attr('d', 'M 50 -168 q 22 -8 24 -28').attr('fill', 'none').attr('stroke', '#a86c22').attr('stroke-width', 8).attr('stroke-linecap', 'round');
  urn.append('rect').attr('x', -4).attr('y', -146).attr('width', 34).attr('height', 9).attr('rx', 3).attr('fill', '#8f5a1c');

  for (let r = 0; r < 3; r += 1) {
    for (let i = 0; i < 4; i += 1) {
      stall.append('path')
        .attr('d', `M ${58 + i * 22} ${-116 - r * 24} h 17 l -3 21 h -11 Z`)
        .attr('fill', r % 2 ? '#b06336' : '#96502a');
    }
  }
  [-72, -34, 4].forEach((x, i) => {
    stall.append('path')
      .attr('class', cls.steam).datum({ phase: i * 1.2 })
      .attr('d', `M ${x} -244 C ${x - 34} -256 ${x + 30} -290 ${x} -338 C ${x - 22} -378 ${x + 24} -404 ${x + 4} -444`)
      .attr('fill', 'none').attr('stroke', '#ffe9c6').attr('stroke-width', 13)
      .attr('stroke-linecap', 'round').attr('opacity', 0.22).attr('filter', 'url(#jSoft)');
  });

  /* ---- The far mouth of the lane, and the light pouring back up it ----- */
  const mouth = scene.append('g');
  const [ml, mt] = sample('l', 8.1, 0.1);
  const [mr] = sample('r', 8.1, 0.1);
  const [, mb] = sample('l', 8.1, 1);
  mouth.append('path')
    .attr('d', `M ${ml - 12} ${mt - 14} H ${mr + 12} V ${mb + 6} H ${mr} V ${mt + 5} Q ${(ml + mr) / 2} ${mt - 8} ${ml} ${mt + 5} V ${mb + 6} H ${ml - 12} Z`)
    .attr('fill', '#2a181b').attr('opacity', 0.9);
  [[0.32, 0.62], [0.66, 0.5]].forEach(([f, s], i) => {
    drawPerson(mouth, {
      x: ml + (mr - ml) * f, y: mb, height: (mb - mt) * s,
      fill: '#22141a', opacity: 0.8, head: i ? 'veil' : 'plain', flip: i === 1,
    });
  });

  scene.append('path')
    .attr('d', `M ${VP.x - 46} ${VP.y - 30} L ${VP.x + 46} ${VP.y - 30} L ${VP.x + 520} ${H} L ${VP.x - 540} ${H} Z`)
    .attr('fill', '#ffca7c').attr('opacity', 0.13).attr('filter', 'url(#jSoft)');
  for (let i = 0; i < 60; i += 1) {
    scene.append('circle')
      .attr('class', cls.dust)
      .datum({ baseX: rnd(VP.x - 340, VP.x + 340), baseY: rnd(VP.y - 20, H), phase: rnd(0, 6.3), speed: rnd(4, 16) })
      .attr('r', rnd(1, 3.2)).attr('fill', '#ffe6b4').attr('opacity', rnd(0.2, 0.7));
  }

  // Corner falloff only — the walls already do the framing.
  const frame = scene.append('g').attr('fill', '#0d070e');
  frame.append('path').attr('d', `M 0 0 H ${W} V 14 Q ${VP.x} 96 0 14 Z`);
  frame.append('path').attr('d', `M 0 0 V ${H} H 30 Q 8 500 34 0 Z`);
  frame.append('path').attr('d', `M ${W} 0 V ${H} H ${W - 30} Q ${W - 8} 500 ${W - 34} 0 Z`);
}

/* ------------------------------------------------------------------ *
 * 04 — Sarnath
 * The Dhamek Stupa built as a real cylinder: carved band, eight
 * niches, brick drum, volumetric shading and long afternoon shadows.
 * ------------------------------------------------------------------ */
export function buildSarnath(root, defs, rnd, cls) {
  addLinear(defs, 'sarSky', [
    ['0%', '#3e7bab'], ['20%', '#71a4c4'], ['42%', '#a8c2c4'],
    ['62%', '#e3cfa4'], ['82%', '#fadfa6'], ['100%', '#fff3d2'],
  ]);
  addLinear(defs, 'sarStone', [
    ['0%', '#3d2e21'], ['10%', '#7a5f42'], ['32%', '#caa972'],
    ['52%', '#efd6a0'], ['74%', '#a98a5e'], ['100%', '#463323'],
  ], { x1: '0%', y1: '0%', x2: '100%', y2: '0%' });
  addLinear(defs, 'sarBrick', [
    ['0%', '#3a2b1f'], ['12%', '#75593e'], ['36%', '#c09c6d'],
    ['56%', '#e4c690'], ['78%', '#977a52'], ['100%', '#3f2e20'],
  ], { x1: '0%', y1: '0%', x2: '100%', y2: '0%' });
  addRadial(defs, 'sarSun', [['0%', '#fff8e0', 0.95], ['32%', '#ffd894', 0.42], ['100%', '#e79f52', 0]]);
  ['#c9542f', '#e2872f', '#a83f27', '#d4712c'].forEach((c, i) => {
    addLinear(defs, `sarRobe${i}`, [
      ['0%', '#2c1208', 0.85], ['22%', c, 1], ['58%', c, 1], ['100%', '#ffdca8', 0.55],
    ], { x1: '0%', y1: '0%', x2: '100%', y2: '0%' });
  });
  addLinear(defs, 'sarLawn', [['0%', '#b6c886'], ['38%', '#8fac60'], ['100%', '#4e6f3d']]);
  addLinear(defs, 'sarGrade', [['0%', '#2c4a74', 0.14], ['40%', '#ffe6b4', 0.03], ['100%', '#7a4a1c', 0.2]]);

  const scene = root.append('g').attr('data-scene', 'sarnath').attr('opacity', 0);
  scene.append('rect').attr('width', W).attr('height', H).attr('fill', 'url(#sarSky)');
  scene.append('circle').attr('cx', 1298).attr('cy', 292).attr('r', 400).attr('fill', 'url(#sarSun)');
  scene.append('circle').attr('class', cls.sun).attr('cx', 1298).attr('cy', 292).attr('r', 52).attr('fill', '#fffbe9');

  for (let i = 0; i < 7; i += 1) {
    scene.append('ellipse')
      .attr('class', cls.cloud).datum({ phase: i * 1.7, drift: 5 + i * 4 })
      .attr('cx', rnd(150, 1450)).attr('cy', 110 + i * 58)
      .attr('rx', rnd(200, 430)).attr('ry', rnd(10, 26))
      .attr('fill', i % 2 ? '#fff0cd' : '#ffd7a4')
      .attr('opacity', rnd(0.22, 0.46)).attr('filter', 'url(#jSoft)');
  }

  // Hazy far treeline, then progressively saturated lawn bands.
  scene.append('path').attr('d', `M 0 624 Q 300 596 640 620 T 1240 606 T ${W} 620 V 700 H 0 Z`)
    .attr('fill', '#9db089').attr('opacity', 0.55).attr('filter', 'url(#jRipple)');
  for (let i = 0; i < 26; i += 1) {
    const tx = rnd(0, W);
    scene.append('ellipse').attr('cx', tx).attr('cy', rnd(600, 622))
      .attr('rx', rnd(26, 68)).attr('ry', rnd(16, 34))
      .attr('fill', '#a3b489').attr('opacity', 0.6);
  }
  scene.append('path').attr('d', `M 0 656 Q 380 628 760 652 T ${W} 644 V ${H} H 0 Z`).attr('fill', 'url(#sarLawn)');
  // Mown stripes fanning towards the viewer.
  for (let i = 0; i < 11; i += 1) {
    const t0 = i / 11;
    scene.append('path')
      .attr('d', `M ${250 + t0 * 880} 650 L ${-620 + t0 * 2700} ${H} L ${-500 + t0 * 2700} ${H} L ${286 + t0 * 880} 650 Z`)
      .attr('fill', i % 2 ? '#b3c684' : '#8fa963').attr('opacity', 0.28);
  }
  scene.append('path').attr('d', `M 0 742 Q 420 706 860 742 T ${W} 730 V ${H} H 0 Z`).attr('fill', '#9ab173').attr('opacity', 0.62);
  scene.append('path').attr('d', `M 0 862 Q 500 818 1020 864 T ${W} 854 V ${H} H 0 Z`).attr('fill', '#82a05c').attr('opacity', 0.72);
  // Worn earth path leading to the stupa.
  scene.append('path')
    .attr('d', `M 542 698 C 498 788 356 872 74 ${H} L 566 ${H} C 646 880 626 768 604 698 Z`)
    .attr('fill', '#c2ac7f').attr('opacity', 0.5).attr('filter', 'url(#jSoft)');
  // Grass tufts and wildflowers.
  for (let i = 0; i < 170; i += 1) {
    const gy = rnd(668, H - 4);
    const k = (gy - 668) / (H - 668);
    const gx = rnd(-20, W + 20);
    const s = 0.4 + k * 1.5;
    scene.append('path')
      .attr('d', `M ${gx} ${gy} q ${-4 * s} ${-7 * s} ${-2 * s} ${-13 * s} M ${gx} ${gy} q ${1 * s} ${-8 * s} ${4 * s} ${-12 * s} M ${gx} ${gy} q ${5 * s} ${-6 * s} ${9 * s} ${-8 * s}`)
      .attr('fill', 'none')
      .attr('stroke', k > 0.5 ? '#5f7b41' : '#7d9556')
      .attr('stroke-width', 1.1 * s).attr('stroke-linecap', 'round')
      .attr('opacity', rnd(0.4, 0.85));
    if (i % 9 === 0) {
      scene.append('circle').attr('cx', gx + rnd(-6, 6)).attr('cy', gy - 10 * s).attr('r', 1.9 * s)
        .attr('fill', i % 18 === 0 ? '#f4e9b6' : '#e8c85c').attr('opacity', 0.8);
    }
  }

  // Excavated monastery foundations: low brick cells in loose axonometry.
  const ruinCell = (x, y, wid, dep, hgt) => {
    const g = scene.append('g');
    g.append('ellipse').attr('cx', x + wid * 0.5 - dep * 0.4).attr('cy', y + 6)
      .attr('rx', wid * 0.72).attr('ry', hgt * 0.42)
      .attr('fill', '#4a6040').attr('opacity', 0.3).attr('filter', 'url(#jSoft)');
    // Front face with brick courses.
    g.append('rect').attr('x', x).attr('y', y - hgt).attr('width', wid).attr('height', hgt).attr('fill', '#a2865f');
    const courses = Math.max(2, Math.round(hgt / 9));
    for (let c = 0; c < courses; c += 1) {
      const cy = y - hgt + (c + 1) * (hgt / courses);
      g.append('line').attr('x1', x).attr('x2', x + wid).attr('y1', cy).attr('y2', cy)
        .attr('stroke', '#8d7452').attr('stroke-width', 1).attr('opacity', 0.5);
      for (let b = 0; b < 5; b += 1) {
        const bx = x + ((b + (c % 2) * 0.5) / 5) * wid;
        g.append('line').attr('x1', bx).attr('x2', bx).attr('y1', cy).attr('y2', cy - hgt / courses)
          .attr('stroke', '#8d7452').attr('stroke-width', 0.9).attr('opacity', 0.34);
      }
    }
    // Top face.
    g.append('path').attr('d', `M ${x} ${y - hgt} h ${wid} l ${-dep} ${-dep * 0.5} h ${-wid} Z`).attr('fill', '#c6ac7c');
    // Right return wall.
    g.append('path').attr('d', `M ${x + wid} ${y - hgt} l ${-dep} ${-dep * 0.5} v ${hgt} l ${dep} ${dep * 0.5} Z`)
      .attr('fill', '#7f6746').attr('opacity', 0.92);
    // Crumbled top edge.
    for (let i = 0; i < 6; i += 1) {
      const bx = x + rnd(0, wid - 10);
      g.append('rect').attr('x', bx).attr('y', y - hgt - rnd(2, 7)).attr('width', rnd(7, 15)).attr('height', rnd(3, 6))
        .attr('fill', '#b59a70').attr('opacity', 0.9);
    }
    // Grass creeping over the footing so the cell sits in the ground.
    const tufts = Math.max(4, Math.round(wid / 16));
    for (let i = 0; i < tufts; i += 1) {
      const gx = x - 4 + rnd(0, wid + 8);
      const gh = rnd(5, 13) * (hgt / 26);
      g.append('path')
        .attr('d', `M ${gx} ${y + 2} q ${-gh * 0.4} ${-gh * 0.7} ${-gh * 0.2} ${-gh} M ${gx} ${y + 2} q ${gh * 0.5} ${-gh * 0.6} ${gh * 0.8} ${-gh * 0.9}`)
        .attr('fill', 'none').attr('stroke', '#5f7b41').attr('stroke-width', 1.3).attr('stroke-linecap', 'round')
        .attr('opacity', rnd(0.5, 0.9));
    }
  };
  [
    [56, 706, 0.62], [214, 700, 0.6], [1002, 708, 0.62], [1188, 702, 0.6], [1386, 712, 0.64],
    [30, 788, 0.9], [196, 798, 0.92], [1064, 790, 0.92], [1420, 798, 0.88],
    [-34, 920, 1.3], [1332, 936, 1.2],
  ].forEach(([x, y, s]) => {
    ruinCell(x, y, 126 * s, 22 * s, 26 * s);
    ruinCell(x + 130 * s, y - 3 * s, 20 * s, 22 * s, 26 * s);
  });

  const SX = 596;
  const BASE = 902;
  const TOP = 214;
  const DRUM = 502;
  const PLINTH_TOP = 824;
  const HZ = 648;             // eye level: everything above it is seen from below
  const pw = 240;
  const dw = 211;
  const ub = 208;
  const ut = 198;
  const stupa = scene.append('g');

  // How much a horizontal circle on the cylinder bows on screen at this height.
  // Positive = the near edge sits above the far edge (we are looking up).
  const bow = (y) => (HZ - y) * 0.076;
  // Curved course/moulding line honouring that perspective.
  const arc = (y, r, dy = 0) => `M ${SX - r} ${y + dy} Q ${SX} ${y + dy - bow(y) * 2} ${SX + r} ${y + dy}`;
  // Vertical offset for an ornament sitting at x on a course at height y.
  const lift = (x, y, r) => bow(y) * Math.sqrt(Math.max(0, 1 - ((x - SX) / r) ** 2));

  // Long low-sun shadow thrown across the lawn.
  stupa.append('path')
    .attr('d', `M ${SX - pw} ${BASE - 10} L ${SX - 760} ${BASE + 132} L ${SX + 40} ${BASE + 124} L ${SX + pw} ${BASE - 10} Z`)
    .attr('fill', '#3b5138').attr('opacity', 0.4).attr('filter', 'url(#jSoft)');

  // --- Splayed stone plinth (below eye level, so we see its top face) ---
  stupa.append('ellipse').attr('cx', SX).attr('cy', BASE).attr('rx', pw + 24).attr('ry', 40).attr('fill', '#7c8b5c');
  stupa.append('ellipse').attr('cx', SX).attr('cy', BASE).attr('rx', pw).attr('ry', 36).attr('fill', '#87704f');
  stupa.append('rect').attr('x', SX - pw).attr('y', PLINTH_TOP).attr('width', pw * 2).attr('height', BASE - PLINTH_TOP).attr('fill', 'url(#sarStone)');
  stupa.append('ellipse').attr('cx', SX).attr('cy', PLINTH_TOP).attr('rx', pw).attr('ry', 20).attr('fill', '#d3b689');
  stupa.append('ellipse').attr('cx', SX).attr('cy', PLINTH_TOP + 7).attr('rx', pw).attr('ry', 19).attr('fill', '#5f4c34').attr('opacity', 0.3);
  // Worn steps up the near face of the plinth.
  [0, 1, 2].forEach((i) => {
    stupa.append('path')
      .attr('d', `M ${SX - 96 - i * 14} ${BASE - 6 - i * 22} h ${192 + i * 28} v 8 h ${-192 - i * 28} Z`)
      .attr('fill', '#c6aa7c').attr('opacity', 0.75 - i * 0.12);
  });

  // --- Carved stone drum, flush with the brick core above it ---
  stupa.append('rect').attr('x', SX - dw).attr('y', DRUM).attr('width', dw * 2).attr('height', PLINTH_TOP - 4 - DRUM).attr('fill', 'url(#sarStone)');

  // Deep cusped niches, small against the mass, set into the lower drum.
  for (let i = 0; i < 5; i += 1) {
    const tt = (i + 0.5) / 5;
    const x = SX - dw + tt * dw * 2;
    const f = Math.sin(tt * Math.PI);
    if (f < 0.3) continue;
    const nw = 42 * f + 4;
    const ny = 790 - lift(x, 772, dw);
    // Carved surround with a pilaster either side.
    stupa.append('path').attr('d', cuspedArch(nw * 1.24, 92, 3)).attr('transform', `translate(${x}, ${ny})`)
      .attr('fill', '#a3855b');
    stupa.append('path').attr('d', cuspedArch(nw * 1.24, 92, 3)).attr('transform', `translate(${x - nw * 0.1}, ${ny - 3})`)
      .attr('fill', '#efd7a8').attr('opacity', 0.3);
    stupa.append('path').attr('d', cuspedArch(nw, 74, 3)).attr('transform', `translate(${x}, ${ny - 8})`)
      .attr('fill', '#2b2015').attr('opacity', 0.9);
    stupa.append('path').attr('d', cuspedArch(nw * 0.44, 60, 3)).attr('transform', `translate(${x + nw * 0.4}, ${ny - 14})`)
      .attr('fill', '#7a6141').attr('opacity', 0.42);
    [-1, 1].forEach((side) => {
      stupa.append('rect').attr('x', x + side * nw * 1.16 - 4).attr('y', ny - 84).attr('width', 8).attr('height', 80)
        .attr('fill', side > 0 ? '#e6cd9c' : '#7d6544').attr('opacity', 0.7);
    });
    stupa.append('rect').attr('x', x - nw * 1.3).attr('y', ny - 4).attr('width', nw * 2.6).attr('height', 9)
      .attr('fill', '#c9ad7d').attr('opacity', 0.85);
    stupa.append('rect').attr('x', x - nw * 1.34).attr('y', ny - 94).attr('width', nw * 2.68).attr('height', 11)
      .attr('fill', '#b6996c').attr('opacity', 0.8);
  }

  // The stupa's defining carved geometric band, wrapping with the curve.
  stupa.append('rect').attr('x', SX - dw).attr('y', 588).attr('width', dw * 2).attr('height', 120).attr('fill', '#cdae7d');
  stupa.append('rect').attr('x', SX - dw).attr('y', 588).attr('width', dw * 2).attr('height', 120).attr('fill', 'url(#sarStone)').attr('opacity', 0.42);
  for (let i = 0; i < 28; i += 1) {
    const tt = (i + 0.5) / 28;
    const x = SX - dw + tt * dw * 2;
    const f = Math.sin(tt * Math.PI);
    if (f < 0.1) continue;
    const s = 11 * f + 1.8;
    const d1 = 618 - lift(x, 618, dw);
    const d2 = 662 - lift(x, 662, dw);
    const d3 = 690 - lift(x, 690, dw);
    stupa.append('path').attr('d', `M ${x} ${d1 - s} l ${s} ${s} l ${-s} ${s} l ${-s} ${-s} Z`)
      .attr('fill', '#5c4630').attr('opacity', 0.44 * f + 0.2);
    stupa.append('path').attr('d', `M ${x} ${d1 - s * 0.5} l ${s * 0.5} ${s * 0.5} l ${-s * 0.5} ${s * 0.5} l ${-s * 0.5} ${-s * 0.5} Z`)
      .attr('fill', '#f0dcae').attr('opacity', 0.3 * f);
    stupa.append('path').attr('d', `M ${x - s} ${d2} q ${s} ${-s * 1.1} ${s * 2} 0 q ${-s} ${s * 1.6} ${-s * 2} 0 Z`)
      .attr('fill', '#503c29').attr('opacity', 0.36 * f + 0.15);
    stupa.append('circle').attr('cx', x).attr('cy', d3).attr('r', s * 0.32)
      .attr('fill', '#48351f').attr('opacity', 0.36 * f + 0.14);
  }
  // Mouldings framing the carved band.
  [580, 704].forEach((y) => {
    stupa.append('path')
      .attr('d', `M ${SX - dw - 11} ${y} Q ${SX} ${y - bow(y) * 2} ${SX + dw + 11} ${y} L ${SX + dw + 11} ${y + 16} Q ${SX} ${y + 16 - bow(y) * 2} ${SX - dw - 11} ${y + 16} Z`)
      .attr('fill', '#b39468');
    stupa.append('path')
      .attr('d', `M ${SX - dw - 11} ${y + 16} Q ${SX} ${y + 16 - bow(y) * 2} ${SX + dw + 11} ${y + 16} L ${SX + dw + 11} ${y + 22} Q ${SX} ${y + 22 - bow(y) * 2} ${SX - dw - 11} ${y + 22} Z`)
      .attr('fill', '#4d3a29').attr('opacity', 0.45);
  });

  // Slim moulding where the brick core meets the stone facing.
  stupa.append('path')
    .attr('d', `M ${SX - dw} ${DRUM} Q ${SX} ${DRUM - bow(DRUM) * 2} ${SX + dw} ${DRUM} L ${SX + dw} ${DRUM + 10} Q ${SX} ${DRUM + 10 - bow(DRUM) * 2} ${SX - dw} ${DRUM + 10} Z`)
    .attr('fill', '#c0a478').attr('opacity', 0.8);
  stupa.append('path')
    .attr('d', `M ${SX - dw} ${DRUM + 10} Q ${SX} ${DRUM + 10 - bow(DRUM) * 2} ${SX + dw} ${DRUM + 10} L ${SX + dw} ${DRUM + 15} Q ${SX} ${DRUM + 15 - bow(DRUM) * 2} ${SX - dw} ${DRUM + 15} Z`)
    .attr('fill', '#5f4c34').attr('opacity', 0.34);

  // --- Brick core: near cylindrical, courses bowing with the perspective ---
  stupa.append('path')
    .attr('d', `M ${SX - ub} ${DRUM} L ${SX - ut} ${TOP} L ${SX + ut} ${TOP} L ${SX + ub} ${DRUM} Z`)
    .attr('fill', 'url(#sarBrick)');
  const courseN = 26;
  for (let i = 0; i < courseN; i += 1) {
    const tt = i / courseN;
    const y = DRUM - tt * (DRUM - TOP);
    const halfW = ub + (ut - ub) * tt;
    stupa.append('path').attr('d', arc(y, halfW))
      .attr('fill', 'none').attr('stroke', '#6b543d').attr('stroke-width', 1.4).attr('opacity', 0.24);
    for (let bk = 0; bk < 11; bk += 1) {
      const bx = SX - halfW + ((bk + (i % 2) * 0.5) / 11) * halfW * 2;
      const ly = y - lift(bx, y, halfW);
      stupa.append('line').attr('x1', bx).attr('x2', bx)
        .attr('y1', ly).attr('y2', ly - (DRUM - TOP) / courseN)
        .attr('stroke', '#6b543d').attr('stroke-width', 1).attr('opacity', 0.14);
    }
  }
  // Surviving patches of stone facing clinging to the brick.
  [[0.16, 0.34, 0.11, 0.16], [0.54, 0.16, 0.15, 0.1], [0.74, 0.52, 0.1, 0.2], [0.34, 0.68, 0.13, 0.12]].forEach(([fx, fy, fw, fh]) => {
    stupa.append('rect')
      .attr('x', SX - ut + fx * ut * 2).attr('y', TOP + fy * (DRUM - TOP))
      .attr('width', fw * ut * 2).attr('height', fh * (DRUM - TOP))
      .attr('rx', 6).attr('fill', '#e0c795').attr('opacity', 0.2);
  });

  // --- Eroded crown. Seen from below, so the rim arcs UPWARD and stays solid ---
  const rise = bow(TOP);
  const rimPts = [];
  for (let i = 0; i <= 34; i += 1) {
    const u = i / 34;
    const rx = SX - ut + u * ut * 2;
    const k = Math.sqrt(Math.max(0, 1 - ((rx - SX) / ut) ** 2));
    const notch = i % 8 === 3 ? rnd(6, 16) : 0;
    rimPts.push(`${rx.toFixed(1)} ${(TOP - k * rise - rnd(2, 14) + notch).toFixed(1)}`);
  }
  const crownBase = TOP + 26;
  stupa.append('path')
    .attr('d', `M ${SX - ut} ${crownBase} L ${rimPts.join(' L ')} L ${SX + ut} ${crownBase} Z`)
    .attr('fill', '#b19878');
  // Volume across the crown: shaded left, sunlit right.
  stupa.append('path')
    .attr('d', `M ${SX - ut} ${crownBase} L ${SX - ut} ${TOP - rise * 0.1} Q ${SX - ut * 0.5} ${TOP - rise * 0.94} ${SX - ut * 0.06} ${TOP - rise} L ${SX - ut * 0.06} ${crownBase} Z`)
    .attr('fill', '#4b3a26').attr('opacity', 0.34);
  stupa.append('path')
    .attr('d', `M ${SX + ut * 0.34} ${crownBase} Q ${SX + ut * 0.72} ${TOP - rise * 0.72} ${SX + ut} ${TOP - rise * 0.08} L ${SX + ut} ${crownBase} Z`)
    .attr('fill', '#ffe6b0').attr('opacity', 0.3);
  // Broken brick teeth along the eroded lip.
  for (let i = 0; i < 17; i += 1) {
    const tt = (i + 0.5) / 17;
    const bx = SX - ut + tt * ut * 2;
    const k = Math.sqrt(Math.max(0, 1 - ((bx - SX) / ut) ** 2));
    if (k < 0.24) continue;
    const by = TOP - k * rise - rnd(2, 10);
    stupa.append('rect')
      .attr('x', bx - 7).attr('y', by).attr('width', 15).attr('height', rnd(10, 20))
      .attr('fill', i % 2 ? '#c8ac7f' : '#93794f').attr('opacity', 0.92);
  }
  // Scrub rooted in the broken masonry along the lip.
  for (let i = 0; i < 24; i += 1) {
    const f = -0.94 + (i / 23) * 1.88;
    const bx = SX + f * ut + rnd(-6, 6);
    const by = TOP - Math.sqrt(Math.max(0, 1 - f * f)) * rise - rnd(0, 5);
    const gh = rnd(9, 24);
    stupa.append('path')
      .attr('d', `M ${bx} ${by} q ${-gh * 0.45} ${-gh * 0.6} ${-gh * 0.3} ${-gh} M ${bx} ${by} q ${gh * 0.2} ${-gh * 0.7} ${gh * 0.55} ${-gh * 0.92} M ${bx} ${by} q ${gh * 0.6} ${-gh * 0.4} ${gh * 0.9} ${-gh * 0.6}`)
      .attr('fill', 'none').attr('stroke', i % 3 ? '#5d7c44' : '#84994f')
      .attr('stroke-width', rnd(1.6, 3)).attr('stroke-linecap', 'round').attr('opacity', rnd(0.5, 0.9));
  }
  [-0.4, 0.32].forEach((f, i) => {
    const bx = SX + f * ut;
    const by = TOP - Math.sqrt(Math.max(0, 1 - f * f)) * rise - 2;
    stupa.append('path')
      .attr('d', `M ${bx} ${by} q ${-5 + i * 8} -20 ${1 + i * 5} -36`)
      .attr('fill', 'none').attr('stroke', '#4a5f37').attr('stroke-width', 2.4).attr('stroke-linecap', 'round');
    [0, 1, 2].forEach((k) => {
      stupa.append('ellipse').attr('cx', bx + (i ? 3 : -1) * (k + 1) * 2 + rnd(-5, 5)).attr('cy', by - 20 - k * 10)
        .attr('rx', 10 - k * 1.6).attr('ry', 5.5 - k * 0.8)
        .attr('fill', '#57733f').attr('opacity', 0.85);
    });
  });

  // Volumetric shading down the whole mass.
  stupa.append('path')
    .attr('d', `M ${SX - ub} ${DRUM} L ${SX - ut} ${TOP} L ${SX - ut * 0.44} ${TOP} L ${SX - ub * 0.48} ${DRUM} Z`)
    .attr('fill', '#2b2118').attr('opacity', 0.3);
  stupa.append('rect').attr('x', SX - dw).attr('y', DRUM).attr('width', dw * 0.48).attr('height', PLINTH_TOP - 4 - DRUM)
    .attr('fill', '#2b2118').attr('opacity', 0.24);
  stupa.append('rect').attr('x', SX - pw).attr('y', PLINTH_TOP).attr('width', pw * 0.48).attr('height', BASE - PLINTH_TOP)
    .attr('fill', '#2b2118').attr('opacity', 0.22);
  stupa.append('path')
    .attr('d', `M ${SX + ub} ${DRUM} L ${SX + ut} ${TOP} L ${SX + ut * 0.82} ${TOP} L ${SX + ub * 0.84} ${DRUM} Z`)
    .attr('fill', '#ffe6b0').attr('opacity', 0.32);
  stupa.append('rect').attr('x', SX + dw * 0.85).attr('y', DRUM).attr('width', dw * 0.15).attr('height', PLINTH_TOP - 4 - DRUM)
    .attr('fill', '#ffe6b0').attr('opacity', 0.26);
  stupa.append('rect').attr('x', SX + pw * 0.87).attr('y', PLINTH_TOP).attr('width', pw * 0.13).attr('height', BASE - PLINTH_TOP)
    .attr('fill', '#ffe6b0').attr('opacity', 0.24);

  // Rubble and grass gathering at the foot.
  for (let i = 0; i < 30; i += 1) {
    const rx2 = SX - pw - 30 + rnd(0, (pw + 30) * 2);
    stupa.append('ellipse').attr('cx', rx2).attr('cy', BASE + rnd(8, 34))
      .attr('rx', rnd(7, 22)).attr('ry', rnd(3, 8))
      .attr('fill', '#a08761').attr('opacity', rnd(0.28, 0.62));
  }
  // Framing trees: heavy bodhi on the right, lighter counterweight left.
  drawTree(scene, { x: 1548, y: 942, height: 640, trunk: '#463a2a', canopy: '#4f6b3a', highlight: '#9fbc61', rnd, lean: -0.34, light: -1 });
  drawTree(scene, { x: 44, y: 918, height: 470, trunk: '#4a3d2c', canopy: '#5b7544', highlight: '#a3bb66', rnd, lean: 0.32, light: 1 });
  drawTree(scene, { x: 1292, y: 706, height: 206, trunk: '#5b4c37', canopy: '#728653', highlight: '#aebe78', rnd, lean: -0.12, light: 1 });
  drawTree(scene, { x: 972, y: 690, height: 158, trunk: '#5b4c37', canopy: '#728653', highlight: '#aebe78', rnd, lean: 0.16, light: 1 });
  drawTree(scene, { x: 236, y: 698, height: 172, trunk: '#5b4c37', canopy: '#6d8250', highlight: '#a8b873', rnd, lean: -0.2, light: 1 });

  // Prayer-flag line, strung between two bamboo poles so both ends are anchored.
  const poles = [[132, 890, 372], [872, 902, 390]];
  poles.forEach(([px, py, pt]) => {
    scene.append('ellipse').attr('cx', px).attr('cy', py + 2).attr('rx', 22).attr('ry', 6)
      .attr('fill', '#3d5239').attr('opacity', 0.35).attr('filter', 'url(#jSoft)');
    scene.append('path').attr('d', `M ${px - 4} ${py} L ${px - 2.4} ${pt} L ${px + 2.4} ${pt} L ${px + 4} ${py} Z`)
      .attr('fill', '#8a7345');
    scene.append('path').attr('d', `M ${px + 1} ${py} L ${px + 1.6} ${pt} L ${px + 4} ${pt} L ${px + 4} ${py} Z`)
      .attr('fill', '#ffe2ae').attr('opacity', 0.35);
    [0.24, 0.46, 0.7].forEach((k) => {
      const ky = pt + (py - pt) * k;
      scene.append('line').attr('x1', px - 4.4).attr('x2', px + 4.4).attr('y1', ky).attr('y2', ky)
        .attr('stroke', '#5d4a2b').attr('stroke-width', 1.6).attr('opacity', 0.6);
    });
  });
  const flagPath = `M ${poles[0][0]} ${poles[0][2] + 4} Q ${(poles[0][0] + poles[1][0]) / 2} 540 ${poles[1][0]} ${poles[1][2] + 4}`;
  scene.append('path').attr('d', flagPath).attr('fill', 'none').attr('stroke', '#4a4436').attr('stroke-width', 2.5).attr('opacity', 0.75);
  const flagNode = scene.append('path').attr('d', flagPath).attr('fill', 'none').attr('stroke', 'none').node();
  const flagLen = flagNode.getTotalLength ? flagNode.getTotalLength() : 0;
  for (let i = 1; i < 20 && flagLen; i += 1) {
    const p = flagNode.getPointAtLength((i / 20) * flagLen);
    scene.append('path')
      .attr('class', cls.flag).datum({ phase: i * 0.4 })
      .attr('data-anchor', `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .attr('d', `M ${p.x} ${p.y} l 20 30 l 19 -24 Z`)
      .attr('fill', ['#d9483a', '#e8b23f', '#3f8fa0', '#f0ead7', '#5b8f4c'][i % 5])
      .attr('opacity', 0.95);
  }

  // Monks and pilgrims with long low-sun shadows, kept clear of the story card.
  [[286, 900, 172, 'url(#sarRobe0)', 'shaved', 'walk'],
    [372, 872, 146, 'url(#sarRobe1)', 'bun', 'stand'],
    [1006, 918, 160, 'url(#sarRobe2)', 'shaved', 'stand'],
    [1092, 886, 134, 'url(#sarRobe3)', 'veil', 'walk'],
    [806, 792, 92, 'url(#sarRobe0)', 'shaved', 'walk'],
    [452, 776, 82, 'url(#sarRobe1)', 'veil', 'stand']].forEach(([x, y, h, robe, head, stance]) => {
    scene.append('ellipse').attr('cx', x - h * 0.55).attr('cy', y + 5).attr('rx', h * 0.7).attr('ry', h * 0.085)
      .attr('fill', '#33452f').attr('opacity', 0.38).attr('filter', 'url(#jSoft)');
    drawPerson(scene, {
      x, y, height: h, fill: robe, rim: 'rgba(255,231,178,.8)', head, stance, hem: stance === 'walk' ? 0.3 : 0.26, arms: stance === 'walk' ? 'down' : 'namaste',
    });
  });

  // Deer in the park — warm coats, lit backs, so they read against the lawn.
  const drawDeer = (dx, dy, s, tone, lit, opacity = 1) => {
    scene.append('ellipse').attr('cx', dx - 14 * s).attr('cy', dy + 3 * s).attr('rx', 92 * s).attr('ry', 11 * s)
      .attr('fill', '#3d5239').attr('opacity', 0.32 * opacity).attr('filter', 'url(#jSoft)');
    const g = scene.append('g').attr('transform', `translate(${dx}, ${dy}) scale(${s})`)
      .attr('fill', tone).attr('opacity', opacity);
    // Legs.
    g.append('path').attr('d', 'M -44 -66 v 66 M -24 -64 v 64 M 40 -66 v 66 M 60 -64 v 64')
      .attr('fill', 'none').attr('stroke', tone).attr('stroke-width', 8).attr('stroke-linecap', 'round');
    g.append('path').attr('d', 'M -44 -14 v 14 M 40 -14 v 14')
      .attr('fill', 'none').attr('stroke', '#3a2c1e').attr('stroke-width', 8.4).attr('stroke-linecap', 'round').attr('opacity', 0.55);
    // Barrel body.
    g.append('path').attr('d', 'M -62 -78 C -70 -110 -42 -126 -2 -128 C 42 -130 70 -117 78 -95 C 84 -77 72 -60 50 -58 L -38 -58 C -56 -60 -60 -68 -62 -78 Z');
    // Pale belly and rump patch.
    g.append('path').attr('d', 'M -50 -68 C -30 -60 20 -60 60 -66 C 46 -56 -30 -55 -50 -68 Z')
      .attr('fill', '#f0dcb8').attr('opacity', 0.35);
    g.append('path').attr('d', 'M -60 -100 C -40 -122 20 -128 66 -110 C 30 -122 -30 -118 -60 -100 Z')
      .attr('fill', lit).attr('opacity', 0.75);
    // Neck and head.
    g.append('path').attr('d', 'M 54 -104 C 70 -132 82 -152 92 -170 L 122 -164 C 116 -140 104 -114 84 -86 Z');
    g.append('path').attr('d', 'M 90 -174 C 108 -186 132 -181 136 -166 C 140 -151 128 -142 112 -138 L 94 -134 C 83 -147 80 -163 90 -174 Z');
    g.append('circle').attr('cx', 133).attr('cy', -163).attr('r', 3.6).attr('fill', '#241a10');
    // Antlers and ear.
    g.append('path').attr('d', 'M 100 -180 q -8 -28 2 -44 M 102 -204 l -17 -13 M 106 -197 l 15 -14 M 126 -176 q 13 -21 9 -42 M 135 -205 l 15 -13')
      .attr('fill', 'none').attr('stroke', '#efd7a6').attr('stroke-width', 4.4).attr('stroke-linecap', 'round').attr('opacity', 0.9);
    g.append('path').attr('d', 'M 98 -164 q -22 -9 -32 2 q 15 13 32 5 Z');
    // Tail.
    g.append('path').attr('d', 'M -62 -106 q -17 13 -13 32 q 11 6 17 -7 Z');
    // Sunlit rim along the back.
    g.append('path').attr('d', 'M -60 -96 C -38 -122 24 -130 70 -108 M 56 -104 C 70 -132 84 -152 94 -170')
      .attr('fill', 'none').attr('stroke', '#ffe7b6').attr('stroke-width', 4).attr('stroke-linecap', 'round').attr('opacity', 0.55);
  };
  drawDeer(1194, 930, 0.6, '#7b6142', '#a2835a');
  drawDeer(1372, 852, 0.4, '#82684a', '#a8895f', 0.9);
  drawDeer(258, 792, 0.32, '#836a4c', '#a98b60', 0.78);
  drawDeer(468, 748, 0.24, '#8a7254', '#ad9066', 0.6);

  [[420, 190, 0.62], [500, 232, 0.44], [1140, 168, 0.55], [1216, 214, 0.4], [640, 158, 0.5]].forEach(([x, y, s], i) => {
    scene.append('path')
      .attr('class', cls.bird).datum({ phase: i * 1.3, drift: 12 + i * 5 })
      .attr('d', 'M -20 0 Q -9 -11 0 -1 Q 9 -11 20 0')
      .attr('transform', `translate(${x}, ${y}) scale(${s})`)
      .attr('fill', 'none').attr('stroke', '#42506a').attr('stroke-width', 2.6).attr('stroke-linecap', 'round');
  });

  for (let i = 0; i < 46; i += 1) {
    scene.append('ellipse')
      .attr('class', cls.leaf)
      .datum({ baseX: rnd(0, W), speed: rnd(14, 46), phase: rnd(0, 6.3), spin: rnd(30, 110) })
      .attr('rx', rnd(5, 10)).attr('ry', rnd(2, 4))
      .attr('fill', i % 3 === 0 ? '#e0bd5e' : i % 3 === 1 ? '#93a85c' : '#c09447')
      .attr('opacity', rnd(0.3, 0.8));
  }

  // Foreground depth: an out-of-focus branch overhead and dark grass underfoot.
  const fg = scene.append('g').attr('filter', 'url(#jSoft)');
  fg.append('path')
    .attr('d', `M ${W + 40} 30 C 1330 84 1140 46 990 116 C 1110 70 1300 118 ${W + 40} 84 Z`)
    .attr('fill', '#20361f').attr('opacity', 0.8);
  [[1440, 64], [1310, 84], [1180, 84], [1080, 106]].forEach(([lx, ly], i) => {
    fg.append('ellipse').attr('cx', lx).attr('cy', ly - 6 - (i % 2) * 16)
      .attr('rx', 62).attr('ry', 30).attr('fill', '#25401f').attr('opacity', 0.78);
  });
  fg.append('path')
    .attr('d', `M 0 ${H} V 950 Q 260 912 520 954 T 1040 946 T ${W} 960 V ${H} Z`)
    .attr('fill', '#2f4a2c').attr('opacity', 0.6);
  for (let i = 0; i < 60; i += 1) {
    const gx = rnd(-20, W + 20);
    fg.append('path')
      .attr('d', `M ${gx} ${H} q ${rnd(-16, -6)} ${rnd(-46, -26)} ${rnd(-22, -8)} ${rnd(-76, -46)} M ${gx} ${H} q ${rnd(6, 16)} ${rnd(-46, -26)} ${rnd(10, 26)} ${rnd(-72, -44)}`)
      .attr('fill', 'none').attr('stroke', '#25401f').attr('stroke-width', rnd(3, 7))
      .attr('stroke-linecap', 'round').attr('opacity', 0.7);
  }

  scene.append('rect').attr('width', W).attr('height', H).attr('fill', 'url(#sarGrade)');
}
