const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { sendContactMail, sendApplicationConfirmation, sendNewsletterConfirmation } = require('./mailer');
const app = express();
const port = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx|odt|txt/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Only documents (PDF, DOC, DOCX, ODT, TXT) are allowed!');
    }
  }
}).single('resume');

const allowedOrigins = [
  'http://127.0.0.1:5500',
  'https://aspirespectrum.pages.dev',
  'https://www.aspirespectrum.pages.dev',
  'https://aspirespectrum.ca',
  'https://www.aspirespectrum.ca'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.post('/contact', async (req, res) => {
  try {
    await sendContactMail(req.body);
    res.status(200).send('Message sent successfully');
  } catch (error) {
    res.status(500).send('Error sending message');
  }
});

// Newsletter subscription endpoint
app.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Here you would typically save the email to a database
    // For now, we'll just log it and send a confirmation email
    console.log('New newsletter subscription:', email);
    
    await sendNewsletterConfirmation(email);
    res.status(200).json({ message: 'Thank you for subscribing to our newsletter!' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ error: 'Error processing subscription' });
  }
});

// Job application endpoint
app.post('/apply', upload, async (req, res) => {
  try {
    const { fullName, email, phone, coverLetter } = req.body;
    const resumePath = req.file ? req.file.path : null;

    // Basic validation
    if (!fullName || !email || !phone) {
      // Remove uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: 'Full name, email, and phone are required' });
    }

    // Here you would typically save the application to a database
    const application = {
      fullName,
      email,
      phone,
      coverLetter: coverLetter || '',
      resumePath,
      appliedAt: new Date()
    };

    console.log('New job application:', application);
    
    // Send confirmation email to applicant
    await sendApplicationConfirmation(email, fullName);
    
    // Here you would typically send an email to HR/recruitment team
    // with the application details and resume attachment

    res.status(200).json({ 
      message: 'Thank you for your application! We will review your information and get back to you soon.'
    });
  } catch (error) {
    console.error('Job application error:', error);
    // Clean up uploaded file if there was an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Error processing your application' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File size exceeds the 5MB limit' });
  }
  if (err === 'Error: Only documents (PDF, DOC, DOCX, ODT, TXT) are allowed!') {
    return res.status(400).json({ error: 'Only documents (PDF, DOC, DOCX, ODT, TXT) are allowed' });
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('Allowed origins:', allowedOrigins);
});
