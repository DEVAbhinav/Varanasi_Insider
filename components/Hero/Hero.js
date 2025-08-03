import Image from "next/image";
import BookingWidget from "../BookingWidget/BookingWidget";
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Background image */}
      <div className={styles.backgroundImage}>
        <Image
          src="/images/varanasi-hero.png"
          alt="Varanasi Ghats"
          fill
          style={{ objectFit: 'cover' }}
          quality={80}
          priority
          sizes="100vw"
        />
        {/* Overlay */}
        <div className={styles.overlay} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h1 className={styles.title}>
          Best Outstation Taxi & Varanasi Travel Guides - 2025
        </h1>

        {/* Trust Badges */}
        <div className={styles.trustBadges}>
          <Image src="/images/trust-badge-1.png" alt="Trust Badge" width={60} height={60} />
          <Image src="/images/trust-badge-2.png" alt="Trust Badge" width={60} height={60} />
          <Image src="/images/trust-badge-3.png" alt="Trust Badge" width={60} height={60} />
          <Image src="/images/trust-badge-4.png" alt="Trust Badge" width={60} height={60} />
        </div>

        {/* Booking Widget */}
        <BookingWidget />
      </div>
    </section>
  );
}
