import Image from 'next/image';
import styles from './HeroSection.module.css';
import FareCalculator from '@/components/FareCalculator/FareCalculator';

export default function HeroSection({ calculatorProps }) {
  return (
    <section className={styles.heroContainer} aria-label="Varanasi taxi booking hero section">
      <Image
        alt="Varanasi's ganga aarti in evening - scenic view of holy ghats"
        src="/images/varanasi-hero.png"
        fill
        style={{ objectFit: 'cover' }}
        priority
      />
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <header>
          <h1 className={styles.title}>Varanasi's Most Trusted Taxi Service</h1>
          <p className={styles.subtitle}>Reliable Airport Pickups, Local Sightseeing & Outstation Trips</p>
        </header>
        {/* Fare calculator over the hero image (replaces lead form) */}
        <div className="mt-8 mx-auto max-w-5xl">
          <FareCalculator
            showHeader
            cardClassName="bg-white/10 backdrop-blur-md border-white/20 text-white"
            contentClassName="[&_label]:text-white/80"
            {...calculatorProps}
          />
        </div>
      </div>
    </section>
  );
}
