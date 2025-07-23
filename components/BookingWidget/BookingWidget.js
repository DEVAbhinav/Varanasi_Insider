import styles from './BookingWidget.module.css';

export default function BookingWidget() {
  return (
    <div className={styles.bookingWidget}>
      <h2 className={styles.title}>Booking Wuber</h2>

      {/* From */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>From</label>
        <input
          type="text"
          placeholder="Enter starting point"
          className={styles.input}
        />
      </div>

      {/* To */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>To</label>
        <input
          type="text"
          placeholder="Enter destination"
          className={styles.input}
        />
      </div>

      {/* Date */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>Date</label>
        <input
          type="date"
          className={styles.input}
        />
      </div>

      {/* CTA Button */}
      <button className={styles.ctaButton}>
        Get Instant Fare
      </button>
    </div>
  );
}
