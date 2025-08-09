import styles from './CTASection.module.css';

export default function CTASection() {
    return (
        <section className={styles.container} aria-label="Book taxi call-to-action">
            <div className={styles.content}>
                <header>
                    <h2 className={styles.title}>Ready to Explore Kashi?</h2>
                    <p className={styles.subtitle}>Let us handle the driving. Book your trusted ride today!</p>
                </header>
                <a 
                    href="https://www.kashitaxi.in" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.ctaButton}
                    aria-label="Book taxi now - opens in new window"
                >
                    Book Now
                </a>
            </div>
        </section>
    );
}
