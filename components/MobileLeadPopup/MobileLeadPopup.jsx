import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import * as gtag from '../../lib/gtag';
import SidebarBookingWidget from '../BookingWidget/SidebarBookingWidget';
import styles from './MobileLeadPopup.module.css';

export default function MobileLeadPopup({ delay = 30000 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

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
    setIsClosing(true);
    sessionStorage.setItem('hasSeenLeadPopup', 'true');
    gtag.event({
      action: 'popup_dismissed',
      category: 'Engagement',
      label: 'Mobile Lead Popup',
    });
    // Wait for exit animation before unmounting
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`${styles.popupOverlay} ${isClosing ? styles.overlayExit : styles.overlayEnter}`}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className={`${styles.popupContent} ${isClosing ? styles.contentExit : styles.contentEnter}`}>
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
      </div>
    </div>
  );
}
