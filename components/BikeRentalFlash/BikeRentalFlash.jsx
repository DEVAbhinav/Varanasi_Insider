import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bike, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import styles from './BikeRentalFlash.module.css';

export default function BikeRentalFlash() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={styles.flashSection}
    >
      <div className={styles.container}>
        <motion.div 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={styles.contentWrapper}
        >
          <Image 
            src="/images/scooty-activa.jpeg" 
            alt="Scooty rental in Varanasi"
            width={40}
            height={30}
            className={styles.scootyImage}
          />
          <Bike className={styles.bikeIcon} />
          <p className={styles.description}>
            <span className={styles.hiddenText}>Explore the city on your own terms! </span>
            We now offer <strong className={styles.strong}>Bike & Scooty Rentals</strong>
          </p>
          <Link href="/bike-rentals-varanasi" className={styles.ctaLink}>
            <motion.span 
              className={styles.ctaText}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Book Now <ArrowRight className={styles.arrowIcon} />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
