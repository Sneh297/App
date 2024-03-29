const express = require('express');
// const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads'); // Files will be saved in the 'uploads' directory
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname); // Keep the original file name
//   },
// });

// const upload = multer({ storage: storage });

// Serve uploaded files statically
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Form for uploading file and specifying email
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle file upload and email sending
app.post('/upload', (req, res) => {
  console.log("sending mail");
  const email = req.body.email;
  // const file = req.file;

  // Validate email and file
  // if (!email || !file) {
  //   return res.status(400).send('Email and file are required');
  }

  // Send email with file attachment
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Example: 'Gmail', 'Outlook'
    auth: {
      user: 'snehdholia001@gmail.com',
      pass: 'ptda kvaj nlph atzy',
    },
  });

  const mailOptions = {
    from: 'testingqcwodn@gmail.com',
    to: email,
    subject: 'File from Web App',
    text: 'Please find the attached file',
    
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      return res.send('Email sent successfully');
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
