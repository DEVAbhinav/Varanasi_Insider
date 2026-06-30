import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import * as gtag from '../../lib/gtag';
import { CONTACT, getCallTelHref, getWhatsAppUrl } from '../../lib/contact';
import TrustBadge from '../TrustBadge/TrustBadge';
import { logClick } from '../../lib/logClick';
import styles from './ExitIntentPopup.module.css';

const WA_TEXT = "Hi! I was browsing Varanasi Insider and could use some help planning my trip 🙏";

function WhatsAppIcon({ className = '' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const isMobileRef = useRef(false);
  // When shown via back-button, dismissing should complete the navigation
  const navigateBackOnDismiss = useRef(false);

  const triggerPopup = useCallback((source = 'desktop') => {
    setIsVisible(true);
    gtag.event({
      action: 'exit_intent_shown',
      category: 'Engagement',
      label: source === 'mobile' ? 'Exit Intent — Back Button' : 'Exit Intent — Mouse',
    });
  }, []);

  // ── Desktop: mouse approaching top chrome ────────────
  useEffect(() => {
    if (window.innerWidth >= 768) {
      isMobileRef.current = false;
      let triggered = false;
      const onMouseMove = (e) => {
        if (!triggered && e.clientY < 20) {
          triggered = true;
          triggerPopup('desktop');
        }
      };
      document.addEventListener('mousemove', onMouseMove);
      return () => document.removeEventListener('mousemove', onMouseMove);
    }
  }, [triggerPopup]);

  // ── Mobile: back-button via History API ──────────────
  useEffect(() => {
    if (window.innerWidth >= 768) return;
    isMobileRef.current = true;

    // Push a sentinel so the back button has somewhere to "pop" to
    history.pushState({ exitIntentSentinel: true }, '');

    let triggered = false;
    const onPopState = (e) => {
      // Only fire once; ignore if it's not our sentinel being popped
      if (triggered) return;
      triggered = true;
      navigateBackOnDismiss.current = true; // will need to actually go back on dismiss
      triggerPopup('mobile');
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [triggerPopup]);

  const handleClose = (converted = false) => {
    setIsVisible(false);
    gtag.event({
      action: converted ? 'exit_intent_converted' : 'exit_intent_dismissed',
      category: 'Engagement',
      label: 'Exit Intent Popup',
    });
    // If triggered by back-button and user didn't convert, honour their intent and go back
    if (!converted && navigateBackOnDismiss.current) {
      navigateBackOnDismiss.current = false;
      history.back();
    }
  };

  const trackWhatsApp = () => {
    gtag.event({ action: 'exit_intent_whatsapp_click', category: 'Conversion', label: 'Exit Intent Popup' });
    logClick('EXIT_INTENT_WHATSAPP');
  };

  const trackCall = () => {
    gtag.event({ action: 'exit_intent_call_click', category: 'Conversion', label: 'Exit Intent Popup' });
    logClick('EXIT_INTENT_CALL');
  };

  const isMobile = isMobileRef.current;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && handleClose(false)}
        >
          <motion.div
            className={`${styles.modal} ${isMobile ? styles.modalMobile : ''}`}
            // Desktop: scale up from centre. Mobile: slide up from bottom.
            initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.88, y: 24 }}
            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-popup-heading"
          >
            <button onClick={() => handleClose(false)} className={styles.closeBtn} aria-label="Close">
              <X size={18} strokeWidth={2.5} />
            </button>

            <div className={styles.accentBar} />

            <h2 id="exit-popup-heading" className={styles.heading}>
              Need help with your Varanasi trip?
            </h2>

            <p className={styles.body}>
              We reply in minutes. No pressure, just honest help.
            </p>

            <a
              href={getWhatsAppUrl(WA_TEXT)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { trackWhatsApp(); handleClose(true); }}
              className={styles.whatsappBtn}
            >
              <WhatsAppIcon className={styles.whatsappIcon} />
              Chat on WhatsApp
            </a>

            <a
              href={getCallTelHref()}
              onClick={() => { trackCall(); handleClose(true); }}
              className={styles.callBtn}
            >
              <svg className={styles.callIcon} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Call {CONTACT.phoneDisplay}
            </a>

            <TrustBadge variant="compact" className={styles.trust} />

            <button onClick={() => handleClose(false)} className={styles.dismissLink}>
              I&apos;m still exploring — thanks!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
