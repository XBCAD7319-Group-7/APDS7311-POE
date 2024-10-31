require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const https = require('https');
const fs = require('fs');

const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payments');

const app = express();

// Middleware
app.use(express.json());  // For parsing JSON requests

// Secure CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT,DELETE', // Only allow these HTTP methods
  allowedHeaders: 'Content-Type,Authorization', // Only allow necessary headers
  credentials: false  // Set to true only if cross-origin requests require credentials
}));

app.use(helmet());  // Secure headers

// MongoDB connection with increased timeout
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 45000 // Increase inactivity timeout to 45 seconds
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

// SSL Certificate (Self-signed for development)
const privateKey = fs.readFileSync('./keys/privatekey.pem', 'utf8');
const certificate = fs.readFileSync('./keys/certificate.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Create both HTTP and HTTPS servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

// Listen on HTTP and HTTPS
const PORT = process.env.PORT || 5000;   // HTTP port
const SSL_PORT = process.env.SSL_PORT || 3000;  // HTTPS port

httpServer.listen(PORT, () => {
  console.log(`HTTP server running on port ${PORT}`);
});

httpsServer.listen(SSL_PORT, () => {
  console.log(`HTTPS server running on port ${SSL_PORT}`);
});
