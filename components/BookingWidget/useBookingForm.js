import { useState } from 'react';
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => {
      if (!current[name] && value) {
        gtag.event({
          action: 'form_start',
          category: 'Form',
          label: widgetLabel,
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

    if (!formData.name || !formData.phone) {
      setError(missingContactMessage);
      setLoading(false);
      return false;
    }

    if (!isValidIndianPhone(formData.phone)) {
      setError(invalidPhoneMessage);
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
          ...buildAnalytics(formData, context),
        });

        if (resetOnSuccess) {
          setFormData(initialFormData);
        }

        return true;
      }

      setError(data.error || submitErrorMessage);
      return false;
    } catch (err) {
      if (onNetworkError) {
        onNetworkError(err);
      }
      setError(networkErrorMessage);
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
