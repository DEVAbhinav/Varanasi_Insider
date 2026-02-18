const { Resend } = require('resend');
const fs = require('fs').promises;
const path = require('path');

const CONTACT = {
  callNumberE164: '+918062182380',
  callNumberDisplay: '+91 80621 82380',
  whatsappNumberRaw: '919935474730',
};

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
    const { name, phone, email, passengers, tripType, pickupDate, message, source, parentPageTitle, parentPageUrl } = req.body;

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

    const normalizedPhone = normalizePhoneNumber(phone);
    const whatsappHref = normalizedPhone ? `https://wa.me/${normalizedPhone}` : null;
    const telHref = normalizedPhone ? `tel:+${normalizedPhone}` : null;

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
            <p>Kashi Taxi - Travel Agent Varanasi</p>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Name:</span>
              <span class="value">${name}</span>
            </div>
            <div class="field">
              <span class="label">Phone:</span>
              <span class="value">
                ${phone}
                ${whatsappHref ? ` &middot; <a href="${whatsappHref}" style="color: #FF1493; text-decoration: none;">WhatsApp</a>` : ''}
              </span>
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
            ${(parentPageTitle || parentPageUrl) ? `
            <div class="field">
              <span class="label">Widget Location:</span>
              <div class="value">
                ${parentPageTitle ? `<div><strong>Page:</strong> ${parentPageTitle}</div>` : ''}
                ${parentPageUrl ? `<div><strong>URL:</strong> <a href="${parentPageUrl}" target="_blank" rel="noopener">${parentPageUrl}</a></div>` : ''}
              </div>
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
            ${whatsappHref || telHref ? `
            <div style="margin-top: 20px; text-align: center;">
              ${whatsappHref ? `<a href="${whatsappHref}" class="cta">WhatsApp Customer</a>` : ''}
              ${telHref ? `<a href="${telHref}" class="cta">Call Now</a>` : ''}
            </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>Kashi Taxi - Travel Agent Varanasi<br>
            📞 ${CONTACT.callNumberDisplay} | 🌐 kashitaxi.in</p>
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

    const { data: adminEmailData, error: adminEmailError } = await resend.emails.send(emailPayload);

    if (adminEmailError) {
      console.error('Resend email error:', adminEmailError);
      // Continue to save lead even if email fails
    }

    let customerEmailData = null;
    let customerEmailError = null;

    if (email) {
      const safeCustomerName = name?.trim() || 'Guest';
      const customerEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1f2937; background: #f8fafc; }
            .container { max-width: 620px; margin: 0 auto; padding: 24px; }
            .card { background: #ffffff; border-radius: 18px; padding: 28px; box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08); }
            .badge { display: inline-block; padding: 6px 14px; border-radius: 999px; background: #ecfeff; color: #0891b2; font-weight: 600; font-size: 12px; letter-spacing: 0.4px; text-transform: uppercase; }
            h1 { margin: 18px 0 12px; color: #0f172a; font-size: 28px; }
            h2 { margin: 28px 0 12px; color: #0369a1; font-size: 18px; }
            p { margin: 0 0 16px; }
            ul { padding-left: 20px; margin: 0 0 18px; }
            li { margin-bottom: 10px; }
            .cta-group { margin: 28px 0; display: flex; gap: 12px; flex-wrap: wrap; }
            .cta { background: linear-gradient(135deg, #0ea5e9, #22d3ee); color: #ffffff; padding: 14px 22px; border-radius: 999px; text-decoration: none; font-weight: 600; box-shadow: 0 10px 25px rgba(14, 165, 233, 0.35); }
            .cta-secondary { background: #ecfeff; color: #0369a1; padding: 14px 22px; border-radius: 999px; text-decoration: none; font-weight: 600; box-shadow: 0 10px 25px rgba(8, 145, 178, 0.15); }
            .highlight { background: #eef2ff; padding: 16px; border-radius: 14px; margin: 20px 0; }
            .footer { margin-top: 36px; font-size: 13px; color: #475569; text-align: center; }
            @media (max-width: 480px) {
              .cta-group { flex-direction: column; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <span class="badge">Thank you for reaching out</span>
              <h1>Hi ${safeCustomerName}, your Varanasi trip is now on our priority list ✅</h1>
              <p>Thanks for sharing your travel details with <strong>Kashi Taxi | Travel Agent Varanasi</strong>. Our concierge will call you shortly from <strong>${CONTACT.callNumberDisplay}</strong> to lock in cars, timings, and best-value routes.</p>

              <div class="highlight">
                <h2>What happens next (within 30 minutes)</h2>
                <ul>
                  <li>We confirm your pick-up time, crew details, and any add-ons like guide support or airport meet-and-greet.</li>
                  <li>We send a quick WhatsApp intro with your driver photo, vehicle number, and live location tracking once assigned.</li>
                  <li>You receive our <strong>local festival and traffic playbook</strong> so you can glide past crowds and checkpoints.</li>
                </ul>
              </div>

              <h2>Premium fleet ready when you are</h2>
              <ul>
                <li><strong>Dzire &amp; Etios Sedans</strong> – Perfect for 1-3 guests with airport assistance and luggage support.</li>
                <li><strong>Innova Crysta &amp; Hycross</strong> – Captain seats, chilled water, experienced pilgrimage pilots.</li>
                <li><strong>Tempo Travellers (9/12/17 Seater)</strong> – Recliner seats, luggage racks, festival buffer kits for big crews.</li>
              </ul>

              <h2>Guest-favorite Varanasi packages</h2>
              <ul>
                <li><strong>Sunrise Dashashwamedh + Sarnath Circuit</strong> – 6 hour spiritual immersion with vetted guides.</li>
                <li><strong>Prayagraj &amp; Ayodhya Day Dash</strong> – 14 hour express with curated darshan slots and meal stops.</li>
                <li><strong>Dev Deepawali Crowd Shield</strong> – Festival escort with crowd-flow maps, rooftop access, and medical standby.</li>
              </ul>

              <div class="cta-group">
                <a href="https://wa.me/${CONTACT.whatsappNumberRaw}?text=Hi%20team%20Kashi%20Taxi!%20I%20just%20sent%20an%20inquiry." class="cta">📲 WhatsApp Concierge</a>
                <a href="tel:${CONTACT.callNumberE164}" class="cta-secondary">📞 Call ${CONTACT.callNumberDisplay}</a>
              </div>

              <p>Save our contact, reply with any must-see spots or timing constraints, and we will personalise the itinerary before we loop in your driver.</p>

              <p>If you need immediate support, call <a href="tel:${CONTACT.callNumberE164}" style="color: #0369a1; font-weight: 600; text-decoration: none;">${CONTACT.callNumberDisplay}</a>. We are live from <strong>5:30 AM to midnight</strong>.</p>

              <p>🙏 We’re excited to host you in Kashi.<br><strong>Team Kashi Taxi | Travel Agent Varanasi</strong></p>

              <div class="footer">
                <p>Rated 4.9★ by 700+ pilgrims • Sanitised vehicles • Festival crowd intelligence on-call</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      try {
        const { data: customerData, error: customerError } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'bookings@kashitaxi.in',
          to: email,
          subject: 'We received your Kashi Taxi request – let’s plan your ride',
          html: customerEmailHtml,
        });

        customerEmailData = customerData;

        if (customerError) {
          customerEmailError = customerError;
          console.error('Resend customer email error:', customerError);
        }
      } catch (customerSendError) {
        customerEmailError = customerSendError;
        console.error('Resend customer email exception:', customerSendError);
      }
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
      parentPageTitle: parentPageTitle || null,
      parentPageUrl: parentPageUrl || null,
      emailSent: !adminEmailError,
      emailId: adminEmailData?.id || null,
      customerEmailSent: !!customerEmailData?.id && !customerEmailError,
      customerEmailId: customerEmailData?.id || null,
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
    const whatsappNumber = CONTACT.whatsappNumberRaw;
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
        emailSent: !adminEmailError,
        customerEmailSent: !!customerEmailData?.id && !customerEmailError,
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
        whatsapp: `https://wa.me/${CONTACT.whatsappNumberRaw}`,
        phone: CONTACT.callNumberDisplay,
      }),
    };
  }
};
