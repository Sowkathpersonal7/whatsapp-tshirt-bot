# 👕 WhatsApp T-Shirt Retail Ordering Bot

Automated conversational commerce chatbot for a T-shirt retail store built with **Node.js (Express)**, **WhatsApp Business Cloud API (Graph API v20.0)**, **MongoDB Atlas**, and **Razorpay**.

---

## 🌟 Key Features

* **Multilingual Support**: Real-time localization in **English**, **Tamil (தமிழ்)**, and **Hindi (हिन्दी)**.
* **Interactive WhatsApp Messages**:
  * Quick Reply Buttons (Language, Sizes, Quantities, Confirmations).
  * Interactive List Messages (5 T-shirt Categories & Product Catalog).
  * High-resolution Product Preview Images.
  * Interactive CTA URL Buttons for direct online payments.
* **Dynamic Customization Engine**:
  * Plain T-Shirts (+₹0).
  * Custom Text Printing (+₹99/unit).
  * Logo Printing (+₹149/unit).
  * Color Changes (+₹120/unit).
* **Automated Pricing & Taxation**:
  * Indian Apparel GST computation (5% for $\le ₹1000$; 12% for $> ₹1000$).
  * Free shipping threshold ($\ge ₹799$ subtotal).
* **Flexible Payments**:
  * Cash on Delivery (COD).
  * Online Payment via Razorpay (UPI, Credit/Debit Cards, Net Banking).
* **15-Minute Abandonment Nudge**:
  * Proactive reminder with `[▶️ Resume Order]` button so customers can resume dropped checkouts without losing state.
* **Security**:
  * Meta `X-Hub-Signature-256` HMAC validation on webhooks.
  * Razorpay HMAC-SHA256 signature verification.

---

## 📁 Project Structure

```
├── Dockerfile
├── docker-compose.yml
├── package.json
├── seeds/
│   └── seedProducts.js           # 5 categories catalog seeder
└── src/
    ├── app.js                    # Express app & HMAC buffer capture
    ├── server.js                 # HTTP listener & 15-min nudge worker
    ├── config/
    │   └── db.js                 # MongoDB connection
    ├── controllers/
    │   ├── webhookController.js  # Meta Webhook verification & handler
    │   ├── orderController.js    # Order fulfillment APIs
    │   ├── paymentController.js  # Razorpay webhook listener
    │   └── productController.js  # Catalog CRUD APIs
    ├── locales/
    │   └── strings.js            # Multilingual copy (EN, TA, HI)
    ├── middlewares/
    │   ├── errorHandler.js       # Global error handler
    │   └── verifySignature.js    # Meta HMAC SHA-256 validator
    ├── models/
    │   ├── Customer.js
    │   ├── Order.js
    │   ├── Payment.js
    │   ├── Product.js
    │   └── Session.js            # FSM state & cart (24h TTL)
    ├── routes/
    └── services/
        ├── paymentService.js     # Razorpay API & links
        ├── pricingService.js     # Centralized price & GST engine
        ├── stateMachineService.js# 14-state conversation router
        └── whatsappService.js    # WhatsApp Graph API wrappers
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in:
* `MONGODB_URI`
* `WHATSAPP_TOKEN`
* `WHATSAPP_PHONE_NUMBER_ID`
* `WHATSAPP_VERIFY_TOKEN`
* `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`

### 3. Seed Database
```bash
npm run seed
```

### 4. Run Locally
```bash
npm run dev
```

---

## ☁️ Deployment

Deployable directly to **Render.com**, **Railway.app**, or **AWS/Docker**.
1. Connect GitHub repository.
2. Build command: `npm install`
3. Start command: `npm start`
4. Set Environment Variables.
5. Set Webhook URL in Meta App Dashboard: `https://your-domain.com/webhook`
