require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const Session = require('./models/Session');
const whatsappService = require('./services/whatsappService');
const strings = require('./locales/strings');

const PORT = process.env.PORT || 3000;

// Inactivity Nudge Worker (Checks for sessions inactive > 15 mins)
function startInactivityWorker() {
  const CHECK_INTERVAL_MS = 60 * 1000; // Check every minute
  const INACTIVITY_THRESHOLD_MINUTES = parseInt(process.env.SESSION_TIMEOUT_MINUTES, 10) || 15;

  setInterval(async () => {
    try {
      const cutoffTime = new Date(Date.now() - INACTIVITY_THRESHOLD_MINUTES * 60 * 1000);

      // Find sessions that have been abandoned mid-flow
      const abandonedSessions = await Session.find({
        state: {
          $in: [
            'AWAITING_CATEGORY',
            'AWAITING_PRODUCT',
            'AWAITING_SIZE',
            'AWAITING_QUANTITY',
            'AWAITING_CUSTOMIZATION',
            'AWAITING_ORDER_CONFIRMATION',
            'AWAITING_CUSTOMER_ADDRESS',
            'AWAITING_PAYMENT_METHOD',
          ],
        },
        nudgeSent: false,
        lastInteractionAt: { $lte: cutoffTime },
      });

      for (const session of abandonedSessions) {
        const lang = session.language || 'en';
        const dict = strings[lang] || strings.en;

        const buttons = [{ id: 'RESUME_FLOW', title: dict.btnResume }];

        await whatsappService.sendQuickReplyButtons(
          session.phone,
          dict.inactivityReminder,
          buttons,
          'EG Retail Shop'
        );

        session.nudgeSent = true;
        await session.save();
        console.log(`Sent 15-minute nudge to ${session.phone}`);
      }
    } catch (error) {
      console.error('Error in Inactivity Nudge Worker:', error.message);
    }
  }, CHECK_INTERVAL_MS);
}

async function bootstrap() {
  await connectDB();

  // Auto-seed product catalog if database is empty
  try {
    const Product = require('./models/Product');
    const { sampleProducts } = require('../seeds/seedProducts');
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(sampleProducts);
      console.log(`Auto-seeded ${sampleProducts.length} T-shirt products into MongoDB!`);
    }
  } catch (seedErr) {
    console.warn('Auto-seed check warning:', seedErr.message);
  }

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` WhatsApp T-Shirt Ordering Bot Server Running       `);
    console.log(` Port: ${PORT} | Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Webhook URL: http://localhost:${PORT}/webhook      `);
    console.log(`====================================================`);

    startInactivityWorker();
  });

  // Graceful Shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
}

bootstrap();
