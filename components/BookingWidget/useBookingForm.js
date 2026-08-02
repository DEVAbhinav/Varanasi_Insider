import { useRef, useState } from 'react';
import * as gtag from '../../lib/gtag';
import { CONTACT } from '@/lib/contact';

const isValidIndianPhone = (phone = '') => /^[6-9]\d{9}$/.test(phone.replace(/\D/g, '').slice(-10));

export function useBookingForm({
  initialFormData,
  widgetLabel,
  buildPayload,
  buildAnalytics,
  resetOnSuccess = true,
  clearErrorOnChange = false,
  missingContactMessage = 'Please fill in your name and phone number',
  invalidPhoneMessage = 'Please enter a valid 10-digit Indian phone number',
  submitErrorMessage = 'Something went wrong. Please call us instead.',
  networkErrorMessage = 'Network error. Please WhatsApp or call us directly.',
  onNetworkError,
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const startedRef = useRef(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => {
      if (!startedRef.current && !current[name] && value) {
        startedRef.current = true;
        gtag.event({
          action: 'form_start',
          category: 'Form',
          label: widgetLabel,
        });
        gtag.event({
          action: 'quote_started',
          category: 'Conversion',
          label: widgetLabel,
          cta_id: `${widgetLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_form`,
        });
      }

      return {
        ...current,
        [name]: value,
      };
    });

    if (clearErrorOnChange) {
      setError('');
    }
  };

  const handleSubmit = async (e, context = {}) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    gtag.event({
      action: 'quote_submitted',
      category: 'Conversion',
      label: widgetLabel,
    });

    if (!formData.name || !formData.phone) {
      setError(missingContactMessage);
      gtag.event({
        action: 'quote_error',
        category: 'Conversion',
        label: widgetLabel,
        error_type: 'missing_contact',
      });
      setLoading(false);
      return false;
    }

    if (!isValidIndianPhone(formData.phone)) {
      setError(invalidPhoneMessage);
      gtag.event({
        action: 'quote_error',
        category: 'Conversion',
        label: widgetLabel,
        error_type: 'invalid_phone',
      });
      setLoading(false);
      return false;
    }

    try {
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildPayload(formData, context)),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setWhatsappLink(data.whatsappLink || CONTACT.whatsappUrl);

        gtag.event({
          action: 'generate_lead',
          category: 'Form',
          label: widgetLabel,
          value: 1,
          ...(buildAnalytics?.(formData, context) || {}),
        });
        gtag.event({
          action: 'quote_success',
          category: 'Conversion',
          label: widgetLabel,
          value: 1,
          ...(buildAnalytics?.(formData, context) || {}),
        });

        if (resetOnSuccess) {
          setFormData(initialFormData);
        }

        return true;
      }

      setError(data.error || submitErrorMessage);
      gtag.event({
        action: 'quote_error',
        category: 'Conversion',
        label: widgetLabel,
        error_type: 'server_error',
        response_status: response.status,
      });
      return false;
    } catch (err) {
      if (onNetworkError) {
        onNetworkError(err);
      }
      setError(networkErrorMessage);
      gtag.event({
        action: 'quote_error',
        category: 'Conversion',
        label: widgetLabel,
        error_type: 'network_error',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    success,
    setSuccess,
    error,
    setError,
    whatsappLink,
    handleChange,
    handleSubmit,
  };
}
