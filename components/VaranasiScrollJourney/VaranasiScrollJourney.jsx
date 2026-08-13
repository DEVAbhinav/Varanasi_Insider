import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/contact';
import { logClick } from '@/lib/logClick';
import { W, H, addLinear, addRadial } from './artPrimitives';
import { buildDawn, buildTemple, buildLanes, buildSarnath } from './scenes';
import styles from './VaranasiScrollJourney.module.css';

const chapters = [
  {
    id: 'dawn',
    number: '01',
    time: '05:12',
    place: 'Assi Ghat',
    eyebrow: 'Begin with the river',
    title: 'Wake with the Ganges.',
    copy: 'Mist lifts off the water. Oars break a sheet of copper light. From a low wooden boat the city unfolds slowly — eighty-four ghats, temple bells, and stone that has watched this same sunrise for three thousand years.',
    senses: ['Cool river air', 'Morning ragas', 'First light'],
    accent: '#f6b167',
  },
  {
    id: 'vishwanath',
    number: '02',
    time: '08:10',
    place: 'Kashi Vishwanath',
    eyebrow: 'Enter the golden light',
    title: 'Follow the bells.',
    copy: 'Past flower sellers and narrow stone corridors, the gold spire rises. Inside, devotion is not something you watch from a distance — it moves around you, in sandalwood, in mantra, in the deep tone of bells struck by a thousand hands.',
    senses: ['Temple bells', 'Marigold', 'Sandalwood'],
    accent: '#f2cd6a',
  },
  {
    id: 'lanes',
    number: '03',
    time: '11:45',
    place: 'Vishwanath Gali',
    eyebrow: 'Lose the map',
    title: 'Let the lanes lead.',
    copy: 'Indigo doors, carved balconies, silk stacked to the ceiling, a cow that will not move. The alley narrows until the sky is a bright ribbon overhead — then opens, without warning, onto the river.',
    senses: ['Kulhad chai', 'Banarasi silk', 'Hidden shrines'],
    accent: '#f2955c',
  },
  {
    id: 'sarnath',
    number: '04',
    time: '15:30',
    place: 'Sarnath',
    eyebrow: 'Eleven kilometres away',
    title: 'Arrive at stillness.',
    copy: 'Beyond the city the noise simply stops. At Dhamek Stupa — carved, weathered, immense — the Buddha gave his first sermon. Deer still cross the lawn. Silence here has a shape you can almost touch.',
    senses: ['Monastery chants', 'Deer park', 'Ancient stone'],
    accent: '#d9c07d',
  },
];

export default function VaranasiScrollJourney() {
  const svgRef = useRef(null);
  const chapterRefs = useRef([]);
  const storyRef = useRef(null);
  const stageRef = useRef(null);
  const [activeScene, setActiveScene] = useState(0);
  const [stageMode, setStageMode] = useState('before');

  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', `0 0 ${W} ${H}`)
      .attr('preserveAspectRatio', 'xMidYMid slice');
    svg.selectAll('*').remove();
    svg.append('title').text('A scroll-driven visual journey through Varanasi');
    svg.append('desc').text('Sunrise on the Ganges, Kashi Vishwanath Temple, the old lanes of Varanasi, and the Dhamek Stupa at Sarnath.');

    const rng = d3.randomLcg(0.618);
    const rnd = (a, b) => a + rng() * (b - a);
    const defs = svg.append('defs');

    const soft = defs.append('filter').attr('id', 'jSoft').attr('x', '-120%').attr('y', '-120%').attr('width', '340%').attr('height', '340%');
    soft.append('feGaussianBlur').attr('stdDeviation', 26);
    const ripple = defs.append('filter').attr('id', 'jRipple').attr('x', '-40%').attr('y', '-40%').attr('width', '180%').attr('height', '180%');
    ripple.append('feGaussianBlur').attr('stdDeviation', 5);
    const glow = defs.append('filter').attr('id', 'jGlow').attr('x', '-260%').attr('y', '-260%').attr('width', '620%').attr('height', '620%');
    glow.append('feGaussianBlur').attr('stdDeviation', 7).attr('result', 'b');
    const merge = glow.append('feMerge');
    merge.append('feMergeNode').attr('in', 'b');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    addLinear(defs, 'jShade', [
      ['0%', '#000', 0.42], ['26%', '#000', 0.1], ['48%', '#fff', 0.12],
      ['70%', '#000', 0.06], ['100%', '#000', 0.34],
    ], { x1: '0%', y1: '0%', x2: '100%', y2: '0%' });
    addRadial(defs, 'jVignette', [['62%', '#000', 0], ['88%', '#000', 0.07], ['100%', '#000', 0.22]]);

    const cls = {
      star: styles.aStar, cloud: styles.aCloud, sun: styles.aSun, mist: styles.aMist,
      water: styles.aWater, boat: styles.aBoat, bird: styles.aBird, petal: styles.aPetal,
      bell: styles.aBell, ray: styles.aRay, lantern: styles.aLantern, dust: styles.aDust,
      steam: styles.aSteam, flag: styles.aFlag, leaf: styles.aLeaf, smoke: styles.aSmoke,
    };

    buildDawn(svg, defs, rnd, cls);
    buildTemple(svg, defs, rnd, cls);
    buildLanes(svg, defs, rnd, cls);
    buildSarnath(svg, defs, rnd, cls);

    svg.append('rect').attr('width', W).attr('height', H).attr('fill', 'url(#jVignette)').attr('pointer-events', 'none');

    // `slice` always crops around the canvas centre. On narrow screens that
    // pushes each scene's subject off frame and hides it behind the story card,
    // so pan and punch in on a per-scene focal point, clamped so the canvas
    // edges never show. Wide viewports resolve to an identity transform.
    const SCENE_FRAME = [
      { x: 1046, y: 700, zoom: 1.5 },
      { x: 800, y: 430, zoom: 1.3 },
      { x: 918, y: 566, zoom: 1.32 },
      { x: 596, y: 500, zoom: 1 },
    ];
    const applyFraming = () => {
      const node = svgRef.current;
      if (!node) return;
      const box = node.getBoundingClientRect();
      if (!box.width || !box.height) return;
      const aspect = box.width / box.height;
      const half = Math.min(W, aspect * H) / 2;
      const narrow = Math.max(0, Math.min(1, (1.15 - aspect) / 0.6));
      svg.selectAll('[data-scene]').each(function (unused, i) {
        const frame = SCENE_FRAME[i] || { x: W / 2, y: H / 2, zoom: 1 };
        const s = 1 + (frame.zoom - 1) * narrow;
        const dx = Math.max(W / 2 + half - W * s, Math.min(W / 2 - half, W / 2 - s * frame.x));
        const dy = Math.max(H * (1 - s), Math.min(0, H / 2 - s * frame.y));
        this.setAttribute('transform', `translate(${dx.toFixed(1)}, ${dy.toFixed(1)}) scale(${s.toFixed(4)})`);
      });
    };
    applyFraming();
    window.addEventListener('resize', applyFraming, { passive: true });

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sel = (name) => svg.selectAll(`.${name}`);

    // Cache static values so the animation loop can compose without losing them.
    svg.selectAll(`.${styles.aBoat}, .${styles.aBird}`).each(function () {
      this.setAttribute('data-base', this.getAttribute('transform') || '');
    });
    svg.selectAll(`.${styles.aStar}`).each(function () {
      this.setAttribute('data-base', this.getAttribute('opacity') || '1');
    });
    svg.selectAll(`.${styles.aSun}`).each(function () {
      this.setAttribute('data-base', this.getAttribute('r') || '60');
    });

    const timer = d3.timer((elapsed) => {
      if (reduced) return;
      const t = elapsed / 1000;

      sel(styles.aStar).attr('opacity', function (d) {
        return Number(this.getAttribute('data-base') || this.getAttribute('opacity')) * (0.55 + Math.sin(t * 0.9 + d.phase) * 0.45);
      });
      sel(styles.aCloud).attr('transform', (d) => `translate(${Math.sin(t * 0.06 + d.phase) * d.drift * 6}, ${Math.sin(t * 0.2 + d.phase) * 3})`);
      sel(styles.aSun).attr('r', function () {
        const base = Number(this.getAttribute('data-base')) || 60;
        return base * (1 + Math.sin(t * 0.7) * 0.018);
      });
      sel(styles.aMist).attr('transform', (d) => `translate(${Math.sin(t * 0.12 + d.phase) * 34}, ${Math.sin(t * 0.2 + d.phase) * 5})`);
      sel(styles.aWater).attr('transform', (d) => `translate(${Math.sin(t * 0.7 + d.phase) * d.amp}, ${Math.sin(t * 0.5 + d.phase) * 2})`);
      sel(styles.aBoat).attr('transform', function (d) {
        const base = this.getAttribute('data-base');
        return `${base} rotate(${Math.sin(t * 0.8 + d.phase) * 1.4}) translate(0, ${Math.sin(t * 0.9 + d.phase) * 4})`;
      });
      sel(styles.aBird).attr('transform', function (d) {
        const base = this.getAttribute('data-base');
        return `${base} translate(${Math.sin(t * 0.25 + d.phase) * d.drift}, ${Math.sin(t * 0.6 + d.phase) * 7})`;
      });
      sel(styles.aPetal)
        .attr('cx', (d) => d.baseX + Math.sin(t * 0.7 + d.phase) * 46)
        .attr('cy', (d) => ((t * d.speed + d.phase * 140) % (H + 120)) - 60)
        .attr('transform', function (d) {
          return `rotate(${(t * d.spin) % 360}, ${this.getAttribute('cx')}, ${this.getAttribute('cy')})`;
        });
      sel(styles.aLeaf)
        .attr('cx', (d) => d.baseX + Math.sin(t * 0.5 + d.phase) * 60)
        .attr('cy', (d) => ((t * d.speed + d.phase * 150) % (H + 120)) - 60)
        .attr('transform', function (d) {
          return `rotate(${(t * d.spin) % 360}, ${this.getAttribute('cx')}, ${this.getAttribute('cy')})`;
        });
      sel(styles.aBell).attr('transform', (d) => `translate(${d.x}, ${d.y}) rotate(${Math.sin(t * 1.35 + d.phase) * 2.6})`);
      sel(styles.aRay).attr('opacity', (d) => 0.05 + Math.sin(t * 0.5 + d.phase) * 0.03);
      sel(styles.aLantern).attr('opacity', (d) => 0.72 + Math.sin(t * 3.4 + d.phase) * 0.24);
      sel(styles.aDust)
        .attr('cx', (d) => d.baseX + Math.sin(t * 0.4 + d.phase) * 40)
        .attr('cy', (d) => d.baseY - ((t * d.speed + d.phase * 60) % 320));
      sel(styles.aSteam)
        .attr('transform', (d) => `translate(${Math.sin(t * 0.6 + d.phase) * 10}, ${-((t * 6 + d.phase * 14) % 26)})`)
        .attr('opacity', (d) => 0.14 + Math.sin(t + d.phase) * 0.08);
      sel(styles.aSmoke).attr('transform', (d) => {
        const cycle = (t * 0.12 + d.phase / 7) % 1;
        return `translate(${d.x + Math.sin(t * 0.3 + d.phase) * d.drift}, ${560 - cycle * 90}) scale(${0.8 + cycle * 0.5})`;
      }).attr('opacity', (d) => Math.sin(((t * 0.12 + d.phase / 7) % 1) * Math.PI) * 0.1);
      sel(styles.aFlag).attr('transform', function (d) {
        const box = this.getAttribute('data-anchor');
        return box ? `rotate(${Math.sin(t * 2.2 + d.phase) * 5}, ${box})` : `rotate(${Math.sin(t * 2.2 + d.phase) * 2})`;
      });
    });

    const handlePointer = (event) => {
      if (reduced) return;
      const bounds = stageRef.current?.getBoundingClientRect();
      if (!bounds) return;
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 18;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 11;
      svg.selectAll('[data-scene]').attr('transform', `translate(${x}, ${y}) scale(1.022)`);
    };
    const stage = stageRef.current;
    stage?.addEventListener('pointermove', handlePointer, { passive: true });

    return () => {
      timer.stop();
      stage?.removeEventListener('pointermove', handlePointer);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveScene(Number(entry.target.dataset.index));
        });
      },
      { rootMargin: '-38% 0px -38% 0px', threshold: 0 },
    );
    chapterRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame;
    const update = () => {
      frame = null;
      const bounds = storyRef.current?.getBoundingClientRect();
      if (!bounds) return;
      const next = bounds.top > 0 ? 'before' : bounds.bottom <= window.innerHeight ? 'after' : 'fixed';
      setStageMode((current) => (current === next ? current : next));
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('resize', applyFraming);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    d3.select(svgRef.current)
      .selectAll('[data-scene]')
      .interrupt()
      .transition()
      .duration(1000)
      .ease(d3.easeCubicInOut)
      .attr('opacity', (_, index) => (index === activeScene ? 1 : 0));
  }, [activeScene]);

  const current = chapters[activeScene];

  return (
    <section className={styles.journey} aria-labelledby="journey-title">
      <header className={styles.journeyIntro}>
        <p className={styles.preTitle}>One city · One unforgettable day</p>
        <h2 id="journey-title">Enter the many worlds<br />of <em>Varanasi.</em></h2>
        <p className={styles.introCopy}>Scroll slowly. Kashi has never revealed itself in a hurry.</p>
        <div className={styles.introLine} aria-hidden="true"><span /></div>
      </header>

      <div ref={storyRef} className={styles.story}>
        <div
          ref={stageRef}
          className={`${styles.stage} ${stageMode === 'fixed' ? styles.stageFixed : ''} ${stageMode === 'after' ? styles.stageAfter : ''}`}
        >
          <svg ref={svgRef} className={styles.journeyCanvas} role="img" />
          <div className={styles.stageWash} aria-hidden="true" />
          <div className={styles.stageHeader}>
            <div className={styles.liveLocation}>
              <MapPin size={13} aria-hidden="true" />
              <span>{current.place}</span>
            </div>
            <div className={styles.clock}>{current.time}<small>IST</small></div>
          </div>
          <nav className={styles.progressRail} aria-label="Varanasi journey chapters">
            {chapters.map((chapter, index) => (
              <button
                key={chapter.id}
                type="button"
                className={index === activeScene ? styles.activeProgress : ''}
                onClick={() => chapterRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                aria-label={`Go to ${chapter.place}: ${chapter.title}`}
                aria-current={index === activeScene ? 'step' : undefined}
              >
                <span className={styles.progressNumber}>{chapter.number}</span>
                <span className={styles.progressTrack}><i /></span>
                <span className={styles.progressPlace}>{chapter.place}</span>
              </button>
            ))}
          </nav>
          <div className={styles.sceneCount}><strong>{current.number}</strong><span>/ 04</span></div>
        </div>

        <div className={styles.chapters}>
          {chapters.map((chapter, index) => (
            <article
              key={chapter.id}
              ref={(node) => { chapterRefs.current[index] = node; }}
              data-index={index}
              className={`${styles.chapter} ${index % 2 ? styles.chapterRight : ''}`}
            >
              <div
                className={`${styles.storyCard} ${index === activeScene ? styles.activeCard : ''}`}
                style={{ '--accent': chapter.accent }}
              >
                <div className={styles.cardTop}>
                  <span className={styles.cardNumber}>{chapter.number}</span>
                  <span className={styles.cardRule} aria-hidden="true" />
                  <span className={styles.cardTime}>{chapter.time}</span>
                </div>
                <p className={styles.chapterEyebrow}>{chapter.eyebrow}</p>
                <h3>{chapter.title}</h3>
                <p className={styles.chapterCopy}>{chapter.copy}</p>
                <div className={styles.senses}>
                  {chapter.senses.map((sense) => <span key={sense}>{sense}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <footer className={styles.finale}>
        <div className={styles.finaleRings} aria-hidden="true">
          <span /><span /><span /><i>ॐ</i>
        </div>
        <div className={styles.finaleContent}>
          <p className={styles.finaleTime}>18:30 · Back at the river</p>
          <h2>A day in Kashi<br />becomes a story <em>for life.</em></h2>
          <p className={styles.finaleCopy}>
            From the first oar at sunrise to the first flame of the evening Aarti — travel it with someone
            who knows the city&apos;s rhythm, its shortcuts and its silences.
          </p>
          <a
            href={getWhatsAppUrl('Namaste, I want to plan an immersive Varanasi day with Ganges sunrise, Kashi Vishwanath, Sarnath and Ganga Aarti.')}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.planButton}
            onClick={() => logClick('WHATSAPP')}
            data-cta-id="immersive-varanasi-plan"
            data-cta-location="scroll-journey-finale"
            data-page-type="experience"
            data-intent-cluster="varanasi-sightseeing"
            data-service-type="tour"
          >
            Plan my Varanasi day
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        <p className={styles.finaleHindi}>हर हर महादेव</p>
      </footer>
    </section>
  );
}
