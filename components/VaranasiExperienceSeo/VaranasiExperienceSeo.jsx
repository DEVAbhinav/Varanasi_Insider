/**
 * VaranasiExperienceSeo — the crawlable half of /ganga-aarti.
 *
 * The immersive D3 experience above this section is beautiful but thin on text.
 * This block carries the actual ranking payload: the itinerary in words, real
 * timings, an FAQ that mirrors the FAQPage schema on the page, and internal
 * links into the existing Varanasi guide cluster so the page both receives and
 * passes authority instead of sitting as an orphan.
 */

import Link from 'next/link';
import ExperienceLeadForm from './ExperienceLeadForm';
import styles from './VaranasiExperienceSeo.module.css';

export const JOURNEY_STOPS = [
  {
    time: '05:15',
    title: 'Sunrise boat ride and Subah-e-Banaras at Assi Ghat',
    copy: 'The day starts on the water. A boat pushes off in the dark and the eighty-four ghats come up one by one as the light turns copper. At Assi Ghat the Subah-e-Banaras morning aarti begins around 5:30 AM, followed by Vedic chanting and yoga on the steps.',
    links: [
      { href: '/en/assi-ghat-timings', label: 'Assi Ghat timings' },
      { href: '/en/guide-to-ghats-of-varanasi', label: 'Guide to the ghats of Varanasi' },
    ],
  },
  {
    time: '08:10',
    title: 'Kashi Vishwanath darshan through the corridor',
    copy: 'From Godowlia you walk in through security into the Kashi Vishwanath Dham corridor. Queues move fastest early; Mondays, Shravan and Mahashivratri are a different city altogether and need a separate plan.',
    links: [
      { href: '/en/kashi-vishwanath-darshan-ganga-aarti-package', label: 'Kashi Vishwanath darshan and Ganga Aarti package' },
      { href: '/en/kashi-vishwanath-shivaratri-crowd-survival-guide', label: 'Shivaratri crowd survival guide' },
    ],
  },
  {
    time: '11:45',
    title: 'Getting lost in Vishwanath Gali',
    copy: 'Lanes barely two metres wide, six metres of plaster on either side, silk shops stacked to the ceiling, a wall shrine every few steps and a cow that will not move. This is where the kachori sabzi, the kulhad chai and the Banarasi silk actually live.',
    links: [
      { href: '/en/manikarnika-ghat-sacred-cremation-grounds', label: 'Manikarnika Ghat explained' },
      { href: '/en/guide-to-10-most-important-ghats-of-varanasi', label: 'The 10 most important ghats' },
    ],
  },
  {
    time: '15:00',
    title: 'Sarnath, where the Buddha first taught',
    copy: 'Ten kilometres out of the noise, the Dhamek Stupa stands over the deer park where the Buddha gave his first sermon. The archaeological site runs roughly sunrise to sunset; the museum keeps 9 AM to 5 PM and stays closed on Fridays.',
    links: [
      { href: '/en/sarnath-complete-guide', label: 'Complete Sarnath guide' },
      { href: '/en/sarnath-timing-visit-guide', label: 'Sarnath timings and entry fees' },
    ],
  },
  {
    time: '18:30',
    title: 'Ganga Aarti at Dashashwamedh Ghat',
    copy: 'Seven priests, tiered brass lamps, conch and bell, and a river carrying a thousand diyas. The aarti starts at about 5:45 PM between October and March and about 6:45 PM between April and September, and runs roughly forty-five minutes. Come an hour early for a step, or watch it from a boat.',
    links: [
      { href: '/en/dashashwamedh-ghat-ganga-aarti-timing', label: 'Dashashwamedh Ganga Aarti timings' },
      { href: '/en/evening-boat-ride-varanasi-ganga-aarti', label: 'Evening boat ride for the aarti' },
    ],
  },
];

export const JOURNEY_FAQS = [
  {
    q: 'What time is the Ganga Aarti in Varanasi?',
    a: 'The main Ganga Aarti at Dashashwamedh Ghat begins around 5:45 PM from October to March and around 6:45 PM from April to September, every single evening. It lasts about forty-five minutes. Assi Ghat holds a smaller evening aarti slightly earlier, and the Subah-e-Banaras morning aarti there starts around 5:30 AM.',
  },
  {
    q: 'Where is the best place to watch the Ganga Aarti?',
    a: 'From the ghat steps directly in front of the aarti platforms if you arrive at least an hour early, or from a boat moored a few metres off the ghat if you want the whole row of platforms in one frame. The steps give you the sound and the crowd; the boat gives you the picture and an easier exit.',
  },
  {
    q: 'Can you really see all of this in one day?',
    a: 'Yes, and the order is what makes it work: sunrise boat first, Kashi Vishwanath darshan while the queues are short, the lanes and lunch in the late morning, Sarnath in the afternoon lull, then back to Dashashwamedh well before the evening aarti. Doing it in any other order means fighting the crowd twice.',
  },
  {
    q: 'How far is Sarnath from Varanasi?',
    a: 'Sarnath is about 10 kilometres from the Varanasi ghats and roughly 30 to 40 minutes by car, depending on traffic through the Cantt side. It is comfortably a half-day trip and pairs naturally with an afternoon between the temple and the evening aarti.',
  },
  {
    q: 'Do I need a car for the day?',
    a: 'For the ghats and the lanes, no — the old city is walked, not driven. For the airport or station transfer, for Sarnath, and for getting back across the city before the aarti closes the roads around Godowlia, a car with a driver who knows the barricade points saves the whole evening.',
  },
];

const RELATED = [
  { href: '/en/dashashwamedh-ghat-ganga-aarti-timing', label: 'Dashashwamedh Ghat Ganga Aarti timing 2026' },
  { href: '/en/guide-to-ghats-of-varanasi', label: 'A guide to the ghats of Varanasi' },
  { href: '/en/kashi-vishwanath-darshan-ganga-aarti-package', label: 'Kashi Vishwanath darshan and Ganga Aarti package' },
  { href: '/en/sarnath-complete-guide', label: 'Sarnath: the complete visitor guide' },
  { href: '/en/evening-boat-ride-varanasi-ganga-aarti', label: 'Evening boat ride for the Ganga Aarti' },
  { href: '/kasi-tour-package', label: 'Kashi tour packages with a local driver' },
];

export default function VaranasiExperienceSeo() {
  return (
    <section className={styles.wrap} aria-labelledby="varanasi-day-guide">
      <div className={styles.inner}>
        <header className={styles.head}>
          <p className={styles.eyebrow}>The real itinerary behind the experience</p>
          <h2 id="varanasi-day-guide">
            One day in Varanasi: sunrise boat, Kashi Vishwanath, Sarnath and the Ganga Aarti
          </h2>
          <p className={styles.lede}>
            Everything you just scrolled through is a real, walkable day in Kashi. Here is the same
            journey written down — with the timings, the distances and the order that actually works
            once you are standing at Godowlia with an hour to spare.
          </p>
        </header>

        <ol className={styles.stops}>
          {JOURNEY_STOPS.map((stop) => (
            <li key={stop.time} className={styles.stop}>
              <span className={styles.stopTime}>{stop.time}</span>
              <div className={styles.stopBody}>
                <h3>{stop.title}</h3>
                <p>{stop.copy}</p>
                <p className={styles.stopLinks}>
                  {stop.links.map((link) => (
                    <Link key={link.href} href={link.href}>{link.label}</Link>
                  ))}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className={styles.faq}>
          <h3 className={styles.faqTitle}>Questions travellers ask before this day</h3>
          <dl>
            {JOURNEY_FAQS.map((faq) => (
              <div key={faq.q} className={styles.faqItem}>
                <dt>{faq.q}</dt>
                <dd>{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={styles.cta}>
          <div className={styles.ctaCopy}>
            <h3>Want this exact day, without the guesswork?</h3>
            <p>
              We are a Varanasi-based taxi and tour operator. We will time the darshan, keep a car on
              the right side of the aarti barricades, and put you on the river before sunrise.
            </p>
          </div>
          <ExperienceLeadForm />
        </div>

        <nav className={styles.related} aria-label="Related Varanasi guides">
          <h3>Keep reading</h3>
          <ul>
            {RELATED.map((item) => (
              <li key={item.href}><Link href={item.href}>{item.label}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
