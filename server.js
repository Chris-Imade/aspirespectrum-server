const express = require('express');
const cors = require('cors');
const { sendContactMail } = require('./mailer');
const app = express();
const port = 3000;

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

app.post('/contact', async (req, res) => {
  try {
    await sendContactMail(req.body);
    res.status(200).send('Message sent successfully');
  } catch (error) {
    res.status(500).send('Error sending message');
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
