const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const webhookRoutes = require('./routes/webhookRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

// Security and Logging Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// Capture raw body for Webhook HMAC Signature verification (Meta & Razorpay)
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/webhook', webhookRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
