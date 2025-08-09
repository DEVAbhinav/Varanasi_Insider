import { useState } from 'react';
import Image from 'next/image';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  const [name, setName] = useState('');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd handle the form submission here (e.g., send to an API route)
    setMessage(`Thank you, ${name}! We will call you back shortly to confirm your trip.`);
    // Clear form after submission
    setName('');
    setPickup('');
    setDropoff('');
  };

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
        <form onSubmit={handleSubmit} className={styles.bookingForm} aria-label="Quick taxi booking form">
          <input
            type="text"
            placeholder="Your Name"
            className={styles.inputField}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-label="Enter your full name"
          />
          <input
            type="text"
            placeholder="Pickup Location"
            className={styles.inputField}
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            required
            aria-label="Enter pickup location in Varanasi"
          />
          <input
            type="text"
            placeholder="Drop-off Location"
            className={styles.inputField}
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            required
            aria-label="Enter destination location"
          />
          <button type="submit" className={styles.submitButton} aria-label="Submit booking request">Request a Call Back</button>
        </form>
        {message && <p className={styles.successMessage} role="status" aria-live="polite">{message}</p>}
      </div>
    </section>
  );
}
