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

const path = require('path');

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

const sendNewsletterConfirmation = async (email) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Welcome to Aspire Spectrum Newsletter!',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="background-color: #25283e; padding: 20px; text-align: center;">
          <img src="https://aspirespectrum.pages.dev/assets/img/LOGO_HORIZONTALcolour2.png" alt="Aspire Spectrum Logo" style="width: 150px;">
        </div>
        <div style="padding: 20px;">
          <h2>Thank You for Subscribing!</h2>
          <p>Dear Subscriber,</p>
          <p>Welcome to the Aspire Spectrum community! You've successfully subscribed to our newsletter.</p>
          <p>You'll now receive updates on our latest services, success stories, and valuable resources related to ABA therapy and developmental support.</p>
          <p>If you have any questions or need assistance, feel free to reply to this email.</p>
          <p>Best regards,</p>
          <p><strong>The Aspire Spectrum Team</strong></p>
        </div>
        <div style="background-color: #25283e; color: white; padding: 10px; text-align: center;">
          <p>Aspire Spectrum | Compassion, Empathy, and Care</p>
          <p><small>If you did not subscribe to our newsletter, please ignore this email or contact us.</small></p>
        </div>
      </div>
    `,
  };

  await sendMail(mailOptions);
};

const sendApplicationConfirmation = async (email, fullName, resumePath = null) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Thank You for Your Application - Aspire Spectrum',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="background-color: #25283e; padding: 20px; text-align: center;">
          <img src="https://aspirespectrum.pages.dev/assets/img/LOGO_HORIZONTALcolour2.png" alt="Aspire Spectrum Logo" style="width: 150px;">
        </div>
        <div style="padding: 20px;">
          <h2>Application Received</h2>
          <p>Dear ${fullName || 'Applicant'},</p>
          <p>Thank you for your interest in joining the Aspire Spectrum team. We've received your application and are excited to review your qualifications.</p>
          <p>Our hiring team will carefully review your application and will be in touch if your skills and experience match our current needs. Due to the volume of applications we receive, we may not be able to respond to each applicant individually.</p>
          <p>We appreciate your patience during this process and will contact you if we need any additional information.</p>
          <p>Best regards,</p>
          <p><strong>HR Team</strong><br>Aspire Spectrum</p>
        </div>
        <div style="background-color: #25283e; color: white; padding: 10px; text-align: center;">
          <p>Aspire Spectrum | Building Brighter Futures Through Compassionate Care</p>
        </div>
      </div>
    `,
  };

  await sendMail(mailOptions);

  // Send notification to HR/Admin
  const hrMailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER, // Or your HR email
    subject: `New Job Application Received from ${fullName}`,
    text: `A new job application has been submitted through the careers page.`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h3>New Job Application Received</h3>
        <p>You have received a new job application from ${fullName}.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>Please find the applicant's resume attached to this email.</p>
        <p>You can also log in to the admin panel to review all application details.</p>
      </div>
    `,
    attachments: resumePath ? [{
      filename: `resume_${fullName.replace(/\s+/g, '_')}${path.extname(resumePath)}`,
      path: resumePath
    }] : []
  };

  await sendMail(hrMailOptions);
};

module.exports = { 
  sendContactMail, 
  sendNewsletterConfirmation, 
  sendApplicationConfirmation 
};
