const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { Readable } = require('stream');
const cors = require('cors');

const app = express();

app.use(express.json()); // Add middleware to parse JSON bodies
app.use(cors()); // Enable CORS for all routes

// MongoDB connection
mongoose.connect(  	'mongodb+srv://snehdholia:<qa44b6VPf66oT4Mo>@cluster0.18ax1oy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const conn = mongoose.connection;

// Initialize GridFS
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Set up storage for multer
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Form for uploading file and specifying email
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle file upload and email sending
app.post('/upload', upload.single('file'), (req, res) => {
  const email = req.body.email;
  const file = req.file;
  const userInput = req.body.userInput; // Assuming there's some user input data

  // Validate email and file
  if (!email || !file || !userInput) {
    return res.status(400).send('Email, file, and user input are required');
  }

  // Create a readable stream from the uploaded file
  const readableStream = new Readable();
  readableStream.push(file.buffer);
  readableStream.push(null);

  // Create write stream to GridFS
  const writeStream = gfs.createWriteStream({
    filename: file.originalname,
    metadata: { userInput: userInput }, // Store user input as metadata
  });

  // Pipe the file data to GridFS
  readableStream.pipe(writeStream);

  // Send email with file attachment
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Example: 'Gmail', 'Outlook'
    auth: {
      user: 'testingqcwodn@gmail.com',
      pass: 'kisr pdii hpbw kmwr',
    },
  });

  const mailOptions = {
    from: 'testingqcwodn@gmail.com',
    to: email,
    subject: 'File from Web App',
    text: `User Input: ${userInput}`, // Include user input in the email body
    attachments: [
      {
        filename: file.originalname,
        content: file.buffer, // Attach file directly from memory buffer
      },
    ],
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
