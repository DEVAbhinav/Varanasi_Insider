// pages/api/contact-form.js
// Contact form handler - logs inquiries and generates WhatsApp link
// Email notifications are sent via Resend

import { Resend } from 'resend';

const normalizePhoneNumber = (rawPhone) => {
  if (!rawPhone) {
    return null;
  }

  let digits = rawPhone.replace(/\D/g, '') || '';

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
};

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
  } = req.body;

  // Validation
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  // Phone validation
  const phoneRegex = /^[0-9+\s()-]{10,}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  const normalizedPhone = normalizePhoneNumber(phone);
  const sanitizedDial = phone ? phone.replace(/[^0-9+]/g, '') : null;
  const whatsappHref = normalizedPhone ? `https://wa.me/${normalizedPhone}` : null;
  const telHref = normalizedPhone ? `tel:+${normalizedPhone}` : sanitizedDial ? `tel:${sanitizedDial}` : null;

  // Log the inquiry (you can add database logging here)
  console.log('🚕 New booking inquiry:', {
    name,
    phone,
    email,
    pickupLocation,
    destination,
    pickupDate,
    passengers,
    tripType,
    source,
    timestamp: new Date().toISOString()
  });

  // Generate WhatsApp link for instant communication
  const whatsappMessage = pickupLocation && destination
    ? `Hi! I need a taxi from ${pickupLocation} to ${destination} on ${pickupDate || 'soon'} for ${passengers || '1'} passenger(s). My name is ${name}.`
    : `Hi! I'd like to inquire about your taxi services. My name is ${name}.`;
  
  const whatsappLink = `https://wa.me/919935474730?text=${encodeURIComponent(whatsappMessage)}`;

  // Send email notification via Resend
  try {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #FF1493; margin-bottom: 20px; border-bottom: 2px solid #FF1493; padding-bottom: 10px;">
            🚖 New Booking Inquiry - Varanasi Taxi
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
          
          <p style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
            This is an automated notification from Varanasi Taxi booking system.
          </p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'bookings@kashitaxi.in',
      to: process.env.RESEND_TO_EMAIL || 'sudhir.vinayaktravels@gmail.com',
      cc: process.env.RESEND_CC_EMAIL ? [process.env.RESEND_CC_EMAIL] : undefined,
      subject: `🚖 New Booking: ${name} - ${pickupLocation || 'Taxi Service'} to ${destination || 'Destination'}`,
      html: emailHtml,
    });

    console.log('✅ Email notification sent successfully via Resend');
  } catch (emailError) {
    console.error('❌ Failed to send email via Resend:', emailError);
    // Don't fail the request if email fails - we still have WhatsApp
  }

  // Return success with WhatsApp link
  return res.status(200).json({
    success: true,
    message: 'Booking request received successfully',
    whatsappLink,
  });
}
