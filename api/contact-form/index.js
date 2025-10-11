const { Resend } = require('resend');
const fs = require('fs').promises;
const path = require('path');

module.exports = async function (context, req) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    context.res = {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: null,
    };
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    context.res = {
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
    return;
  }

  try {
    // Parse request body
    const { name, phone, email, passengers, tripType, pickupDate, message, source } = req.body;

    // Validate required fields
    if (!name || !phone) {
      context.res = {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Name and phone are required' }),
      };
      return;
    }

    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Prepare email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #FF1493; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #555; }
          .value { color: #000; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #888; }
          .cta { background: #FF1493; color: white; padding: 12px 24px; text-decoration: none; display: inline-block; margin: 10px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚕 New Booking Inquiry</h1>
            <p>Kashi Taxi - Varanasi Insider</p>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Name:</span>
              <span class="value">${name}</span>
            </div>
            <div class="field">
              <span class="label">Phone:</span>
              <span class="value">${phone}</span>
            </div>
            ${email ? `
            <div class="field">
              <span class="label">Email:</span>
              <span class="value">${email}</span>
            </div>
            ` : ''}
            ${passengers ? `
            <div class="field">
              <span class="label">Passengers:</span>
              <span class="value">${passengers}</span>
            </div>
            ` : ''}
            ${tripType ? `
            <div class="field">
              <span class="label">Trip Type:</span>
              <span class="value">${tripType}</span>
            </div>
            ` : ''}
            ${pickupDate ? `
            <div class="field">
              <span class="label">Pickup Date:</span>
              <span class="value">${pickupDate}</span>
            </div>
            ` : ''}
            ${message ? `
            <div class="field">
              <span class="label">Message:</span>
              <div class="value" style="white-space: pre-wrap;">${message}</div>
            </div>
            ` : ''}
            <div class="field">
              <span class="label">Source:</span>
              <span class="value">${source || 'Website'}</span>
            </div>
            <div class="field">
              <span class="label">Submitted:</span>
              <span class="value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
            </div>
            <div style="margin-top: 20px; text-align: center;">
              <a href="https://wa.me/91${phone.replace(/\D/g, '')}" class="cta">WhatsApp Customer</a>
              <a href="tel:+91${phone.replace(/\D/g, '')}" class="cta">Call Now</a>
            </div>
          </div>
          <div class="footer">
            <p>Kashi Taxi - Varanasi Insider<br>
            📞 +91 99354 74730 | 🌐 kashitaxi.in</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email notification via Resend
    const emailPayload = {
      from: process.env.RESEND_FROM_EMAIL || 'bookings@kashitaxi.in',
      to: process.env.RESEND_TO_EMAIL || 'sudhir.vinayaktravels@gmail.com',
      subject: `New ${tripType || 'Contact'} Inquiry from ${name}`,
      html: emailHtml,
    };

    // Add CC if configured
    if (process.env.RESEND_CC_EMAIL) {
      emailPayload.cc = process.env.RESEND_CC_EMAIL;
    }

    const { data, error: emailError } = await resend.emails.send(emailPayload);

    if (emailError) {
      console.error('Resend email error:', emailError);
      // Continue to save lead even if email fails
    }

    // Save lead to JSON file as backup
    const lead = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      name,
      phone,
      email: email || null,
      passengers: passengers || null,
      tripType: tripType || null,
      pickupDate: pickupDate || null,
      message: message || null,
      source: source || 'Website',
      emailSent: !emailError,
      emailId: data?.id || null,
    };

    try {
      const leadsFilePath = path.join(process.cwd(), 'data', 'leads.json');
      
      // Ensure data directory exists
      const dataDir = path.dirname(leadsFilePath);
      await fs.mkdir(dataDir, { recursive: true });

      // Read existing leads or create empty array
      let leads = [];
      try {
        const fileContent = await fs.readFile(leadsFilePath, 'utf8');
        leads = JSON.parse(fileContent);
      } catch (err) {
        // File doesn't exist or is invalid, start fresh
        leads = [];
      }

      // Add new lead and save
      leads.push(lead);
      await fs.writeFile(leadsFilePath, JSON.stringify(leads, null, 2));
    } catch (fileError) {
      console.error('Error saving lead to file:', fileError);
      // Don't fail the request if file save fails
    }

    // Generate WhatsApp link
    const whatsappNumber = '919935474730';
    const whatsappText = encodeURIComponent(
      `Hi! I'm ${name}. I just submitted a booking inquiry on your website. Phone: ${phone}${pickupDate ? `. Date: ${pickupDate}` : ''}${passengers ? `. Passengers: ${passengers}` : ''}`
    );
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;

    // Return success response
    context.res = {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Thank you! We will contact you shortly.',
        whatsappLink,
        emailSent: !emailError,
      }),
    };

  } catch (error) {
    console.error('Contact form error:', error);
    
    context.res = {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Something went wrong. Please WhatsApp or call us directly.',
        whatsapp: 'https://wa.me/919935474730',
        phone: '+91 99354 74730',
      }),
    };
  }
};
