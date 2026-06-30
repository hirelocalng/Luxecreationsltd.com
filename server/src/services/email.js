const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/** Send admin notification email when a new inquiry is received */
async function sendInquiryNotification(inquiry) {
  const { name, phone, email, service, preferred_date, message } = inquiry;

  await transporter.sendMail({
    from: `"Luxe Creations Website" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Inquiry: ${service} — ${name}`,
    html: `
      <div style="font-family: Georgia, serif; color: #0B2B22; max-width: 600px; margin: 0 auto;">
        <div style="background: #0B2B22; padding: 24px; text-align: center;">
          <h1 style="color: #D9A521; margin: 0; font-size: 24px;">New Inquiry Received</h1>
        </div>
        <div style="padding: 32px; background: #F7F3E8;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.08); font-weight: bold; width: 140px;">Name</td><td style="padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.08);">${name}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.08); font-weight: bold;">Phone</td><td style="padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.08);">${phone}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.08); font-weight: bold;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.08);">${email}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.08); font-weight: bold;">Service</td><td style="padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.08);">${service}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.08); font-weight: bold;">Preferred Date</td><td style="padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.08);">${preferred_date || 'Not specified'}</td></tr>
          </table>
          <div style="margin-top: 24px;">
            <p style="font-weight: bold; margin-bottom: 8px;">Message:</p>
            <p style="background: white; padding: 16px; border-left: 3px solid #D9A521; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
        <div style="background: #0B2B22; padding: 16px; text-align: center;">
          <p style="color: rgba(247,243,232,0.5); font-size: 12px; margin: 0;">Luxe Creations Ltd · Awka Road, Onitsha, Anambra State</p>
        </div>
      </div>
    `,
  });
}

/** Send auto-reply confirmation to the client */
async function sendInquiryConfirmation(inquiry) {
  const { name, email, service } = inquiry;

  await transporter.sendMail({
    from: `"Luxe Creations Ltd" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Thank You for Reaching Out — Luxe Creations Ltd',
    html: `
      <div style="font-family: Georgia, serif; color: #0B2B22; max-width: 600px; margin: 0 auto;">
        <div style="background: #0B2B22; padding: 32px; text-align: center;">
          <h1 style="color: #D9A521; margin: 0; font-size: 28px; font-style: italic;">Luxe Creations Ltd</h1>
          <p style="color: rgba(247,243,232,0.6); font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; margin: 8px 0 0;">Creating Memorable Experiences</p>
        </div>
        <div style="padding: 40px 32px; background: #F7F3E8;">
          <p style="font-size: 18px; margin: 0 0 16px;">Dear ${name},</p>
          <p style="line-height: 1.8; color: rgba(11,43,34,0.8); margin: 0 0 16px;">
            Thank you for getting in touch with us. We have received your enquiry regarding <strong>${service}</strong> and we're delighted you're considering Luxe Creations Ltd for your project.
          </p>
          <p style="line-height: 1.8; color: rgba(11,43,34,0.8); margin: 0 0 24px;">
            A member of our team will review your details and reach out to you within <strong>24 hours</strong> to discuss your vision and how we can bring it to life.
          </p>
          <div style="background: #0B2B22; padding: 24px; border-radius: 4px; margin: 32px 0;">
            <p style="color: rgba(247,243,232,0.6); font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; margin: 0 0 16px;">Can't Wait? Reach Us Directly</p>
            <p style="color: #D9A521; margin: 0 0 8px;">📞 09063930552</p>
            <p style="color: #D9A521; margin: 0 0 8px;">💬 WhatsApp: +234 906 393 0552</p>
            <p style="color: rgba(247,243,232,0.7); margin: 0; font-size: 13px;">Awka Road, Onitsha, Anambra State</p>
          </div>
          <p style="line-height: 1.8; color: rgba(11,43,34,0.7); margin: 0;">
            We look forward to creating something extraordinary with you.
          </p>
          <p style="margin: 16px 0 0; font-style: italic; color: #0B2B22;">Warm regards,<br/><strong>The Luxe Creations Team</strong></p>
        </div>
        <div style="background: #0B2B22; padding: 16px; text-align: center;">
          <p style="color: rgba(247,243,232,0.35); font-size: 11px; margin: 0;">© ${new Date().getFullYear()} Luxe Creations Ltd · Events · Confectioneries · Designs</p>
        </div>
      </div>
    `,
  });
}

/** Newsletter welcome email */
async function sendNewsletterWelcome(email, name) {
  await transporter.sendMail({
    from: `"Luxe Creations Ltd" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Welcome to the Luxe Community',
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0B2B22; padding: 32px; text-align: center;">
          <h1 style="color: #D9A521; margin: 0; font-size: 28px; font-style: italic;">Luxe Creations Ltd</h1>
        </div>
        <div style="padding: 40px 32px; background: #F7F3E8; color: #0B2B22;">
          <p style="font-size: 18px;">Dear ${name || 'Friend'},</p>
          <p style="line-height: 1.8; color: rgba(11,43,34,0.8);">Welcome to the Luxe community! You're now subscribed to our newsletter where we share event inspiration, confectionery showcases, design insights, and exclusive behind-the-scenes content.</p>
          <p style="line-height: 1.8; color: rgba(11,43,34,0.8);">We're honoured to have you with us.</p>
          <p style="margin-top: 24px; font-style: italic;">The Luxe Creations Team</p>
        </div>
        <div style="background: #0B2B22; padding: 16px; text-align: center;">
          <p style="color: rgba(247,243,232,0.35); font-size: 11px; margin: 0;">© ${new Date().getFullYear()} Luxe Creations Ltd</p>
        </div>
      </div>
    `,
  });
}

module.exports = { sendInquiryNotification, sendInquiryConfirmation, sendNewsletterWelcome };
