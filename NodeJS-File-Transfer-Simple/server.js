const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Set up multer to save files to disk in the 'uploads' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Save files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); 
  }
});

const upload = multer({ storage: storage });

// Ensure the 'uploads' folder exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Serve static files from the 'public' folder (HTML, CSS, JS)
app.use(express.static('public'));

// Serve the index.html file explicitly
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  // Send the uploaded file info as response
  res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});

// Route to get the list of uploaded files (so the front-end can fetch them)
app.get('/uploaded-files', (req, res) => {
  const files = fs.readdirSync('uploads');
  const fileList = files.map(file => ({ filename: file }));
  res.json(fileList);
});

// Serve the uploaded file for download
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  res.download(filePath);
});

const cleanUpUploads = () => {
    const files = fs.readdirSync('uploads');
    files.forEach(file => {
      const filePath = path.join('uploads', file);
      fs.unlinkSync(filePath);  // Delete the file
    });
    console.log('Uploads folder cleaned up');
};
  
process.on('SIGINT', () => {
    cleanUpUploads(); 
    process.exit();  
}); 

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});