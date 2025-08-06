const express = require('express');
const { sendContactMail } = require('./mailer');
const app = express();
const port = 3000;

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
