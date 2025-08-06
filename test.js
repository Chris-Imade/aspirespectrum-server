const http = require('http');

const postData = JSON.stringify({
  firstName: 'John',
  lastName: 'Doe',
  email: 'jephthahimade@gmail.com',
  phone: '1234567890',
  message: 'This is a test message.',
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/contact',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
