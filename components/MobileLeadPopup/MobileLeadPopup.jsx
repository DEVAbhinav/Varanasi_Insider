import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import * as gtag from '../../lib/gtag';
import SidebarBookingWidget from '../BookingWidget/SidebarBookingWidget';
import styles from './MobileLeadPopup.module.css';

export default function MobileLeadPopup({ delay = 30000 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if already dismissed or submitted in this session
    const hasSeenPopup = sessionStorage.getItem('hasSeenLeadPopup');
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        gtag.event({
          action: 'popup_shown',
          category: 'Engagement',
          label: 'Mobile Lead Popup',
        });
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('hasSeenLeadPopup', 'true');
    gtag.event({
      action: 'popup_dismissed',
      category: 'Engagement',
      label: 'Mobile Lead Popup',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className={styles.popupOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div 
            className={styles.popupContent}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className={styles.closeLabel}>Close</div>
            <button 
              onClick={handleClose} 
              className={styles.closeButton}
              aria-label="Close popup"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
            
            {/* Reusing the existing SidebarBookingWidget */}
            <div className={styles.widgetWrapper}>
              <SidebarBookingWidget />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
