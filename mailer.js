const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendMail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const sendContactMail = async (contactInfo) => {
  const { firstName, lastName, email, phone, message } = contactInfo;

  // Mail to the user
  const userMailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Thank you for contacting Aspire Spectrum',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="background-color: #25283e; padding: 20px; text-align: center;">
          <img src="https://aspirespectrum.pages.dev/assets/img/LOGO_HORIZONTALcolour2.png" alt="Aspire Spectrum Logo" style="width: 150px;">
        </div>
        <div style="padding: 20px;">
          <p>Dear ${firstName} ${lastName},</p>
          <p>Thank you for reaching out to Aspire Spectrum. We are dedicated to providing compassionate and personalized ABA therapy services to support individuals facing developmental delays and behavioral challenges.</p>
          <p>We have received your message and a member of our team will be in touch with you shortly. We are committed to improving access to evidence-based behavioral therapy and empowering individuals to reach their full potential.</p>
          <p>Thank you for your trust in us.</p>
          <p>Best regards,</p>
          <p><strong>The Aspire Spectrum Team</strong></p>
        </div>
        <div style="background-color: #25283e; color: white; padding: 10px; text-align: center;">
          <p>Aspire Spectrum | Compassion, Empathy, and Care</p>
        </div>
      </div>
    `,
  };

  // Mail to the admin
  const adminMailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    subject: 'New Contact Form Submission',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="background-color: #25283e; padding: 20px; text-align: center;">
          <img src="https://aspirespectrum.pages.dev/assets/img/LOGO_HORIZONTALcolour2.png" alt="Aspire Spectrum Logo" style="width: 150px;">
        </div>
        <div style="padding: 20px;">
          <p>You have a new contact form submission:</p>
          <ul>
            <li><strong>First Name:</strong> ${firstName}</li>
            <li><strong>Last Name:</strong> ${lastName}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Message:</strong> ${message}</li>
          </ul>
        </div>
        <div style="background-color: #25283e; color: white; padding: 10px; text-align: center;">
          <p>Aspire Spectrum | Compassion, Empathy, and Care</p>
        </div>
      </div>
    `,
  };

  await sendMail(userMailOptions);
  await sendMail(adminMailOptions);
};

module.exports = { sendContactMail };
