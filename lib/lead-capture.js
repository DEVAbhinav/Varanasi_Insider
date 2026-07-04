const { Resend } = require('resend');
const { getWhatsAppUrl } = require('./contact.cjs');

function normalizePhoneNumber(rawPhone) {
  if (!rawPhone) {
    return null;
  }

  let digits = String(rawPhone).replace(/\D/g, '') || '';

  if (!digits) {
    return null;
  }

  digits = digits.replace(/^0+/, '');

  if (!digits) {
    return null;
  }

  if (digits.startsWith('91') && digits.length >= 12) {
    return digits.slice(0, 12);
  }

  if (digits.length === 10) {
    return `91${digits}`;
  }

  return digits;
}

function validateLeadPayload(payload = {}) {
  const { name, phone } = payload;

  if (!name || !phone) {
    return 'Name and phone are required';
  }

  const phoneRegex = /^[0-9+\s()-]{10,}$/;
  if (!phoneRegex.test(phone)) {
    return 'Invalid phone number';
  }

  return null;
}

function buildWhatsAppMessage(payload) {
  const {
    name,
    pickupLocation,
    destination,
    pickupDate,
    passengers,
    message,
    tripType,
  } = payload;

  if (pickupLocation && destination) {
    return `Hi! I need a taxi from ${pickupLocation} to ${destination} on ${pickupDate || 'soon'} for ${passengers || '1'} passenger(s). My name is ${name}.`;
  }

  const summary = [
    tripType ? `Trip: ${tripType}.` : null,
    pickupDate ? `Travel date: ${pickupDate}.` : null,
    passengers ? `Passengers: ${passengers}.` : null,
    message ? `Notes: ${message}` : null,
  ].filter(Boolean).join(' ');

  return summary
    ? `Hi! I'd like a taxi quote. My name is ${name}. ${summary}`
    : `Hi! I'd like to inquire about your taxi services. My name is ${name}.`;
}

function buildEmailHtml(payload, links) {
  const {
    name,
    phone,
    email,
    passengers,
    tripType,
    pickupLocation,
    destination,
    pickupDate,
    message,
    source,
  } = payload;
  const { telHref, whatsappHref } = links;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #FF1493; margin-bottom: 20px; border-bottom: 2px solid #FF1493; padding-bottom: 10px;">
          New Booking Inquiry - Varanasi Taxi
        </h2>

        <div style="background-color: #fff5f9; padding: 15px; border-left: 4px solid #FF1493; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Customer Details</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="${telHref}" style="color: #FF1493; text-decoration: none;">${phone}</a>${whatsappHref ? ` &middot; <a href="${whatsappHref}" style="color: #FF1493; text-decoration: none;">WhatsApp</a>` : ''}</p>
          ${email ? `<p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #FF1493; text-decoration: none;">${email}</a></p>` : ''}
        </div>

        ${pickupLocation || destination ? `
        <div style="background-color: #f0f9ff; padding: 15px; border-left: 4px solid #0ea5e9; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Trip Details</h3>
          ${pickupLocation ? `<p style="margin: 5px 0;"><strong>Pickup Location:</strong> ${pickupLocation}</p>` : ''}
          ${destination ? `<p style="margin: 5px 0;"><strong>Destination:</strong> ${destination}</p>` : ''}
          ${pickupDate ? `<p style="margin: 5px 0;"><strong>Pickup Date:</strong> ${pickupDate}</p>` : ''}
          ${passengers ? `<p style="margin: 5px 0;"><strong>Passengers:</strong> ${passengers}</p>` : ''}
          ${tripType ? `<p style="margin: 5px 0;"><strong>Trip Type:</strong> ${tripType}</p>` : ''}
        </div>
        ` : ''}

        ${message ? `
        <div style="background-color: #fef9e7; padding: 15px; border-left: 4px solid #f59e0b; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Additional Message</h3>
          <p style="margin: 5px 0; white-space: pre-wrap;">${message}</p>
        </div>
        ` : ''}

        <div style="background-color: #f0fdf4; padding: 15px; border-left: 4px solid #10b981; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Source & Timestamp</h3>
          <p style="margin: 5px 0;"><strong>Form Source:</strong> ${source || 'Website'}</p>
          <p style="margin: 5px 0;"><strong>Inquiry Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        </div>

        ${(whatsappHref || telHref) ? `
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          ${whatsappHref ? `<a href="${whatsappHref}" style="display: inline-block; background-color: #25D366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">WhatsApp Customer</a>` : ''}
          ${telHref ? `<a href="${telHref}" style="display: inline-block; background-color: #FF1493; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;${whatsappHref ? ' margin-left: 10px;' : ''}">Call Now</a>` : ''}
        </div>
        ` : ''}
      </div>
    </div>
  `;
}

async function submitLeadCapture(payload = {}) {
  const validationError = validateLeadPayload(payload);
  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  const normalizedPhone = normalizePhoneNumber(payload.phone);
  const sanitizedDial = payload.phone ? String(payload.phone).replace(/[^0-9+]/g, '') : null;
  const whatsappHref = normalizedPhone ? `https://wa.me/${normalizedPhone}` : null;
  const telHref = normalizedPhone ? `tel:+${normalizedPhone}` : sanitizedDial ? `tel:${sanitizedDial}` : null;
  const whatsappLink = getWhatsAppUrl(buildWhatsAppMessage(payload));

  console.log('New booking inquiry:', {
    ...payload,
    normalizedPhone,
    timestamp: new Date().toISOString(),
  });

  let emailStatus = 'skipped';
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      // All booking emails go to Sudhir, with Abhinav and Upanday CC'd for visibility.
      const emailCc = ['abhinavpandey.1996@gmail.com', 'upanday232@gmail.com'];
      if (process.env.RESEND_CC_EMAIL) {
        emailCc.push(process.env.RESEND_CC_EMAIL);
      }

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'bookings@kashitaxi.in',
        to: 'sudhir.vinayaktravels@gmail.com',
        cc: emailCc,
        subject: `New Booking: ${payload.name} - ${payload.pickupLocation || 'Taxi Service'} to ${payload.destination || 'Destination'}`,
        html: buildEmailHtml(payload, { telHref, whatsappHref }),
      });
      emailStatus = 'sent';
    } catch (error) {
      emailStatus = 'failed';
      console.error('Failed to send email via Resend:', error);
    }
  }

  return {
    success: true,
    message: 'Booking request received successfully',
    whatsappLink,
    normalizedPhone,
    operatorNotification: emailStatus,
  };
}

module.exports = {
  normalizePhoneNumber,
  validateLeadPayload,
  submitLeadCapture,
};
