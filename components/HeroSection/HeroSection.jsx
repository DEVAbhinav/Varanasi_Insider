import { useState } from 'react';
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
    <div className={styles.heroContainer}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.title}>Varanasi's Most Trusted Taxi Service</h1>
        <p className={styles.subtitle}>Reliable Airport Pickups, Local Sightseeing & Outstation Trips</p>
        <form onSubmit={handleSubmit} className={styles.bookingForm}>
          <input
            type="text"
            placeholder="Your Name"
            className={styles.inputField}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Pickup Location"
            className={styles.inputField}
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Drop-off Location"
            className={styles.inputField}
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            required
          />
          <button type="submit" className={styles.submitButton}>Request a Call Back</button>
        </form>
        {message && <p className={styles.successMessage}>{message}</p>}
      </div>
    </div>
  );
}
