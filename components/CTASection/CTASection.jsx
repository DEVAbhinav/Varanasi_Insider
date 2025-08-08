import styles from './CTASection.module.css';

export default function CTASection() {
    return (
        <section className={styles.container}>
            <div className={styles.content}>
                <h2 className={styles.title}>Ready to Explore Kashi?</h2>
                <p className={styles.subtitle}>Let us handle the driving. Book your trusted ride today!</p>
                <a href="https://www.kashitaxi.in" target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>
                    Book Now
                </a>
            </div>
        </section>
    );
}
