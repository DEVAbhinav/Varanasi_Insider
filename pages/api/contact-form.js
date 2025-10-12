// pages/api/contact-form.js
import nodemailer from 'nodemailer';

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

  try {
    // Create email transporter (configure with your SMTP settings)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER, // Your email
        pass: process.env.SMTP_PASSWORD, // Your app password
      },
    });

    // Email content
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0891b2 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #0891b2; }
          .info-row { display: flex; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
          .info-row:last-child { border-bottom: none; }
          .label { font-weight: bold; min-width: 140px; color: #475569; }
          .value { color: #1e293b; }
          .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
          .badge { display: inline-block; background: #06b6d4; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: bold; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚕 New Booking Request</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Kashi Taxi - Varanasi</p>
          </div>
          
          <div class="content">
            <div class="info-box">
              <h2 style="margin-top: 0; color: #0891b2; font-size: 18px;">Customer Details</h2>
              <div class="info-row">
                <span class="label">Name:</span>
                <span class="value">${name}</span>
              </div>
              <div class="info-row">
                <span class="label">Phone:</span>
                <span class="value"><strong>${phone}</strong></span>
              </div>
              ${email ? `
              <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">${email}</span>
              </div>
              ` : ''}
            </div>

            ${pickupLocation && destination ? `
            <div class="info-box">
              <h2 style="margin-top: 0; color: #0891b2; font-size: 18px;">Trip Details</h2>
              <div class="info-row">
                <span class="label">Pickup Location:</span>
                <span class="value">${pickupLocation}</span>
              </div>
              <div class="info-row">
                <span class="label">Destination:</span>
                <span class="value">${destination}</span>
              </div>
              <div class="info-row">
                <span class="label">Travel Date:</span>
                <span class="value">${pickupDate || 'Not specified'}</span>
              </div>
              <div class="info-row">
                <span class="label">Passengers:</span>
                <span class="value">${passengers || 'Not specified'}</span>
              </div>
            </div>
            ` : ''}

            ${message ? `
            <div class="info-box">
              <h2 style="margin-top: 0; color: #0891b2; font-size: 18px;">Additional Information</h2>
              <p style="margin: 0; color: #475569;">${message}</p>
            </div>
            ` : ''}

            <div class="info-box" style="border-left-color: #8b5cf6;">
              <div class="info-row">
                <span class="label">Request Type:</span>
                <span class="value">${tripType || 'General Inquiry'}</span>
              </div>
              <div class="info-row">
                <span class="label">Source:</span>
                <span class="value">${source || 'Website'}</span>
              </div>
              <div class="info-row">
                <span class="label">Timestamp:</span>
                <span class="value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
              </div>
            </div>

            <div style="margin-top: 25px; padding: 20px; background: #eff6ff; border-radius: 8px; text-align: center;">
              <p style="margin: 0 0 15px 0; color: #1e40af; font-weight: bold; font-size: 16px;">⚡ Quick Actions</p>
              <div style="display: inline-block; margin: 5px;">
                <a href="tel:${phone}" style="display: inline-block; background: #0891b2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">📞 Call ${name}</a>
              </div>
              <div style="display: inline-block; margin: 5px;">
                <a href="https://wa.me/91${phone.replace(/[^0-9]/g, '')}" style="display: inline-block; background: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">💬 WhatsApp</a>
              </div>
              ${email ? `
              <div style="display: inline-block; margin: 5px;">
                <a href="mailto:${email}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px;">📧 Email</a>
              </div>
              ` : ''}
            </div>
          </div>
          
          <div class="footer">
            <p>This is an automated notification from Kashi Taxi booking system</p>
            <p>© ${new Date().getFullYear()} Kashi Taxi - Varanasi Insider</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Plain text version
    const emailText = `
New Booking Request - Kashi Taxi

CUSTOMER DETAILS:
Name: ${name}
Phone: ${phone}
${email ? `Email: ${email}` : ''}

${pickupLocation && destination ? `
TRIP DETAILS:
From: ${pickupLocation}
To: ${destination}
Date: ${pickupDate || 'Not specified'}
Passengers: ${passengers || 'Not specified'}
` : ''}

${message ? `
MESSAGE:
${message}
` : ''}

REQUEST INFO:
Type: ${tripType || 'General Inquiry'}
Source: ${source || 'Website'}
Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

---
Call: ${phone}
WhatsApp: https://wa.me/91${phone.replace(/[^0-9]/g, '')}
${email ? `Email: ${email}` : ''}
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"Kashi Taxi Bookings" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER, // Your notification email
      subject: `🚕 New Booking: ${name} - ${pickupLocation || 'Inquiry'} → ${destination || ''}`,
      text: emailText,
      html: emailHTML,
    });

    console.log('Email sent:', info.messageId);

    // Generate WhatsApp link
    const whatsappMessage = pickupLocation && destination
      ? `Hi! I need a taxi from ${pickupLocation} to ${destination} on ${pickupDate || 'soon'} for ${passengers || '1'} passenger(s). My name is ${name}.`
      : `Hi! I'd like to inquire about your taxi services. My name is ${name}.`;
    
    const whatsappLink = `https://wa.me/919935474730?text=${encodeURIComponent(whatsappMessage)}`;

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Booking request received successfully',
      whatsappLink,
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    // Still return success with WhatsApp link even if email fails
    const whatsappMessage = pickupLocation && destination
      ? `Hi! I need a taxi from ${pickupLocation} to ${destination} on ${pickupDate || 'soon'}. My name is ${name}.`
      : `Hi! I'd like to inquire about your taxi services. My name is ${name}.`;
    
    return res.status(200).json({
      success: true,
      message: 'Request received. Please check WhatsApp for confirmation.',
      whatsappLink: `https://wa.me/919935474730?text=${encodeURIComponent(whatsappMessage)}`,
      emailError: true,
    });
  }
}
