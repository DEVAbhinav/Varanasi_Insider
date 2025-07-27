import Link from 'next/link';
import styles from './BikeRentalFlash.module.css';

export default function BikeRentalFlash() {
  return (
    <section className={styles.flashSection}>
      <div className={styles.container}>
        <p className={styles.description}>
          Explore the city on your own terms! We now offer <strong className={styles.strong}>Bike & Scooty Rentals</strong>.
          <Link href="/bike-rentals" className={styles.ctaLink}>
            Book Now &rarr;
          </Link>
        </p>
      </div>
    </section>
  );
}
