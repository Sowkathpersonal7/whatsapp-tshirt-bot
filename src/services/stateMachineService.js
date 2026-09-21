const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Session = require('../models/Session');
const whatsappService = require('./whatsappService');
const { calculateOrderPrice } = require('./pricingService');
const { generateOrderCode, createPaymentLink } = require('./paymentService');
const strings = require('../locales/strings');

/**
 * Main State Machine Entry Point
 * @param {string} from - Customer WhatsApp phone number
 * @param {object} message - Incoming message object from Meta Webhook
 */
async function processIncomingMessage(from, message) {
  // 1. Extract message text, interactive reply ID, or media
  let text = '';
  let interactiveId = '';
  let mediaType = null;
  let mediaId = null;

  if (message.type === 'text') {
    text = (message.text.body || '').trim();
  } else if (message.type === 'interactive') {
    if (message.interactive.type === 'button_reply') {
      interactiveId = message.interactive.button_reply.id;
      text = message.interactive.button_reply.title;
    } else if (message.interactive.type === 'list_reply') {
      interactiveId = message.interactive.list_reply.id;
      text = message.interactive.list_reply.title;
    }
  } else if (message.type === 'image' || message.type === 'document') {
    mediaType = message.type;
    mediaId = message[message.type].id;
  }

  // 2. Retrieve or initialize Session and Customer
  let session = await Session.findOne({ phone: from });
  let customer = await Customer.findOne({ phone: from });

  if (!customer) {
    customer = await Customer.create({ phone: from, preferredLanguage: 'en' });
  }

  // Handle global reset / greeting triggers
  const lowerText = text.toLowerCase();
  const isGreeting =
    /^(hi|hello|hey|start|restart|vanakkam|namaste|halo)\b/i.test(lowerText) ||
    ['hi', 'hello', 'hey', 'start', 'vanakkam', 'namaste'].includes(lowerText);

  if (isGreeting || !session) {
    if (!session) {
      session = await Session.create({
        phone: from,
        state: 'AWAITING_LANGUAGE',
        language: customer.preferredLanguage || 'en',
      });
    } else {
      session.state = 'AWAITING_LANGUAGE';
      session.cart = {};
      session.nudgeSent = false;
      session.lastInteractionAt = new Date();
      await session.save();
    }
    return sendWelcomeAndLanguageSelection(from);
  }

  session.lastInteractionAt = new Date();
  const lang = session.language || 'en';
  const dict = strings[lang] || strings.en;

  // Handle 15-minute inactivity resume trigger
  if (
    interactiveId === 'RESUME_FLOW' ||
    lowerText === 'resume' ||
    lowerText === 'resume order'
  ) {
    return resumeCurrentState(from, session, dict);
  }

  // 3. Finite State Machine Router
  switch (session.state) {
    case 'AWAITING_LANGUAGE':
      return handleLanguageSelection(from, session, customer, interactiveId, text);

    case 'AWAITING_CATEGORY':
      return handleCategorySelection(from, session, interactiveId, text, dict);

    case 'AWAITING_PRODUCT':
      return handleProductSelection(from, session, interactiveId, text, dict);

    case 'AWAITING_SIZE':
      return handleSizeSelection(from, session, interactiveId, text, dict);

    case 'AWAITING_QUANTITY':
      return handleQuantitySelection(from, session, interactiveId, text, dict);

    case 'AWAITING_CUSTOMIZATION':
      return handleCustomizationSelection(from, session, interactiveId, dict);

    case 'AWAITING_CUSTOM_TEXT':
      return handleCustomTextInput(from, session, text, dict);

    case 'AWAITING_LOGO_IMAGE':
      return handleLogoImageInput(from, session, mediaType, mediaId, dict);

    case 'AWAITING_COLOR_CHOICE':
      return handleColorChoiceInput(from, session, text, dict);

    case 'AWAITING_ORDER_CONFIRMATION':
      return handleOrderConfirmation(from, session, interactiveId, text, dict);

    case 'AWAITING_CUSTOMER_NAME':
      return handleCustomerNameInput(from, session, text, dict);

    case 'AWAITING_CUSTOMER_PHONE':
      return handleCustomerPhoneInput(from, session, interactiveId, text, dict);

    case 'AWAITING_CUSTOMER_ADDRESS':
      return handleCustomerAddressInput(from, session, text, dict);

    case 'AWAITING_PAYMENT_METHOD':
      return handlePaymentMethodSelection(from, session, customer, interactiveId, text, dict);

    default:
      // Fallback reset
      session.state = 'AWAITING_LANGUAGE';
      await session.save();
      return sendWelcomeAndLanguageSelection(from);
  }
}

// -----------------------------------------------------------------------------
// STEP 1: WELCOME & LANGUAGE SELECTION
// -----------------------------------------------------------------------------
async function sendWelcomeAndLanguageSelection(to) {
  const bodyText =
    'Thank you for contacting EG Retail Shop! 👕\n' +
    'We offer premium everyday & custom T-Shirts.\n\n' +
    'Please select your preferred language to continue / ' +
    'தொடர உங்கள் மொழியைத் தேர்ந்தெடுக்கவும் / ' +
    'जारी रखने के लिए अपनी भाषा चुनें:';

  const buttons = [
    { id: 'LANG_EN', title: 'English' },
    { id: 'LANG_TA', title: 'தமிழ் (Tamil)' },
    { id: 'LANG_HI', title: 'हिन्दी (Hindi)' },
  ];

  return whatsappService.sendQuickReplyButtons(
    to,
    bodyText,
    buttons,
    'Welcome to EG Retail Shop'
  );
}

async function handleLanguageSelection(to, session, customer, selectedId, text) {
  let lang = 'en';
  if (selectedId === 'LANG_TA' || text.toLowerCase().includes('tamil')) lang = 'ta';
  else if (selectedId === 'LANG_HI' || text.toLowerCase().includes('hindi')) lang = 'hi';

  session.language = lang;
  session.state = 'AWAITING_CATEGORY';
  await session.save();

  customer.preferredLanguage = lang;
  await customer.save();

  const dict = strings[lang];
  return sendCategoryList(to, dict);
}

// -----------------------------------------------------------------------------
// STEP 2: PRODUCT CATEGORIES LIST
// -----------------------------------------------------------------------------
async function sendCategoryList(to, dict) {
  const sections = [
    {
      title: 'T-Shirt Collections',
      rows: [
        {
          id: 'CAT_HALF_SLEEVE',
          title: dict.categories.HALF_SLEEVE.substring(0, 24),
          description: '100% Combed Cotton Daily Wear',
        },
        {
          id: 'CAT_FULL_SLEEVE',
          title: dict.categories.FULL_SLEEVE.substring(0, 24),
          description: 'Ribbed Cuff Warm & Stylish',
        },
        {
          id: 'CAT_DROP_SHOULDER',
          title: dict.categories.DROP_SHOULDER.substring(0, 24),
          description: 'Oversized Streetwear Fit',
        },
        {
          id: 'CAT_REGULAR_FIT',
          title: dict.categories.REGULAR_FIT.substring(0, 24),
          description: 'Timeless Classic Everyday Cut',
        },
        {
          id: 'CAT_LOOSE_FIT',
          title: dict.categories.LOOSE_FIT.substring(0, 24),
          description: 'Airy, Breathable & Relaxed',
        },
      ],
    },
  ];

  return whatsappService.sendListMessage(
    to,
    dict.categoriesHeader,
    dict.categoriesBody,
    dict.categoriesButton,
    sections,
    'EG Retail Shop • Quality Guaranteed'
  );
}

async function handleCategorySelection(to, session, selectedId, text, dict) {
  const categoryMap = {
    CAT_HALF_SLEEVE: 'HALF_SLEEVE',
    CAT_FULL_SLEEVE: 'FULL_SLEEVE',
    CAT_DROP_SHOULDER: 'DROP_SHOULDER',
    CAT_REGULAR_FIT: 'REGULAR_FIT',
    CAT_LOOSE_FIT: 'LOOSE_FIT',
  };

  let categoryEnum = categoryMap[selectedId];
  if (!categoryEnum && text) {
    const upper = text.toUpperCase().replace(/[^A-Z]/g, '_');
    if (upper.includes('HALF')) categoryEnum = 'HALF_SLEEVE';
    else if (upper.includes('FULL')) categoryEnum = 'FULL_SLEEVE';
    else if (upper.includes('DROP')) categoryEnum = 'DROP_SHOULDER';
    else if (upper.includes('REGULAR')) categoryEnum = 'REGULAR_FIT';
    else if (upper.includes('LOOSE')) categoryEnum = 'LOOSE_FIT';
  }

  if (!categoryEnum) {
    await whatsappService.sendTextMessage(to, '⚠️ Please tap the button to select a category from the list.');
    return sendCategoryList(to, dict);
  }

  session.cart.category = categoryEnum;
  session.state = 'AWAITING_PRODUCT';
  await session.save();

  return sendProductList(to, categoryEnum, dict);
}

// -----------------------------------------------------------------------------
// STEP 3: PRODUCT SELECTION
// -----------------------------------------------------------------------------
async function sendProductList(to, categoryEnum, dict) {
  const products = await Product.find({ category: categoryEnum, isActive: true }).limit(8);

  if (!products.length) {
    // Fallback if no products in DB
    await whatsappService.sendTextMessage(to, 'No products currently active in this category.');
    return sendCategoryList(to, dict);
  }

  const rows = products.map((prod) => ({
    id: `PROD_${prod._id}`,
    title: prod.name.substring(0, 24),
    description: `Base Price: ₹${prod.basePrice} | Sizes: ${prod.availableSizes.join(', ')}`,
  }));

  const sections = [{ title: 'Available Designs', rows }];

  return whatsappService.sendListMessage(
    to,
    dict.selectProductHeader,
    dict.selectProductBody,
    dict.selectProductButton,
    sections
  );
}

async function handleProductSelection(to, session, selectedId, text, dict) {
  let product = null;

  if (selectedId && selectedId.startsWith('PROD_')) {
    const productId = selectedId.replace('PROD_', '');
    product = await Product.findById(productId);
  } else if (text) {
    product = await Product.findOne({
      category: session.cart.category,
      isActive: true,
      name: { $regex: text.trim(), $options: 'i' },
    });
  }

  if (!product) {
    await whatsappService.sendTextMessage(to, '⚠️ Please select a product from the list.');
    return sendProductList(to, session.cart.category, dict);
  }

  session.cart.productId = product._id;
  session.cart.productName = product.name;
  session.cart.basePrice = product.basePrice;
  session.state = 'AWAITING_SIZE';
  await session.save();

  // Send product image preview with description & price
  if (product.imageUrl) {
    try {
      await whatsappService.sendImageMessage(
        to,
        product.imageUrl,
        `*${product.name}*\n${product.description}\nBase Price: ₹${product.basePrice}`
      );
    } catch (imgErr) {
      console.warn(`Could not send product preview image: ${imgErr.message}`);
    }
  }

  return sendSizeSelection(to, product, dict);
}

// -----------------------------------------------------------------------------
// STEP 4: SIZE SELECTION
// -----------------------------------------------------------------------------
async function sendSizeSelection(to, product, dict) {
  const sections = [
    {
      title: 'Standard Sizes',
      rows: [
        { id: 'SIZE_S', title: 'S - Small', description: 'Chest 38" | Length 27"' },
        { id: 'SIZE_M', title: 'M - Medium', description: 'Chest 40" | Length 28"' },
        { id: 'SIZE_L', title: 'L - Large', description: 'Chest 42" | Length 29"' },
        { id: 'SIZE_XL', title: 'XL - Extra Large', description: 'Chest 44" | Length 30"' },
        { id: 'SIZE_XXL', title: 'XXL - Double XL', description: 'Chest 46" | Length 31"' },
      ],
    },
  ];

  return whatsappService.sendListMessage(
    to,
    `${product.name} (₹${product.basePrice})`,
    dict.sizePrompt,
    dict.chooseSizeButton,
    sections
  );
}

async function handleSizeSelection(to, session, selectedId, text, dict) {
  const sizeMap = {
    SIZE_S: 'S',
    SIZE_M: 'M',
    SIZE_L: 'L',
    SIZE_XL: 'XL',
    SIZE_XXL: 'XXL',
  };

  let chosenSize = sizeMap[selectedId];
  if (!chosenSize) {
    const upperText = text.trim().toUpperCase();
    if (['S', 'M', 'L', 'XL', 'XXL'].includes(upperText)) {
      chosenSize = upperText;
    }
  }

  if (!chosenSize) {
    const product = await Product.findById(session.cart.productId);
    return sendSizeSelection(to, product, dict);
  }

  session.cart.size = chosenSize;
  session.state = 'AWAITING_QUANTITY';
  await session.save();

  return sendQuantityPrompt(to, dict);
}

// -----------------------------------------------------------------------------
// STEP 5: QUANTITY SELECTION
// -----------------------------------------------------------------------------
async function sendQuantityPrompt(to, dict) {
  const buttons = [
    { id: 'QTY_1', title: '1 Piece' },
    { id: 'QTY_2', title: '2 Pieces' },
    { id: 'QTY_3', title: '3 Pieces' },
  ];

  return whatsappService.sendQuickReplyButtons(
    to,
    dict.quantityPrompt,
    buttons,
    'Quantity'
  );
}

async function handleQuantitySelection(to, session, selectedId, text, dict) {
  let qty = 0;
  if (selectedId === 'QTY_1') qty = 1;
  else if (selectedId === 'QTY_2') qty = 2;
  else if (selectedId === 'QTY_3') qty = 3;
  else {
    const parsed = parseInt(text.trim(), 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 50) {
      qty = parsed;
    }
  }

  if (qty < 1 || qty > 50) {
    await whatsappService.sendTextMessage(to, dict.invalidQuantity);
    return sendQuantityPrompt(to, dict);
  }

  // Stock inventory validation
  if (session.cart.productId && session.cart.size) {
    const product = await Product.findById(session.cart.productId);
    if (product && product.stock) {
      const availableStock =
        product.stock instanceof Map
          ? product.stock.get(session.cart.size)
          : product.stock[session.cart.size];
      if (typeof availableStock === 'number' && qty > availableStock) {
        await whatsappService.sendTextMessage(
          to,
          `⚠️ Only ${availableStock} pieces available in size ${session.cart.size}. Please select up to ${availableStock} pieces.`
        );
        return sendQuantityPrompt(to, dict);
      }
    }
  }

  session.cart.quantity = qty;
  session.state = 'AWAITING_CUSTOMIZATION';
  await session.save();

  return sendCustomizationMenu(to, dict);
}

// -----------------------------------------------------------------------------
// STEP 6: CUSTOMIZATION SELECTION
// -----------------------------------------------------------------------------
async function sendCustomizationMenu(to, dict) {
  const sections = [
    {
      title: 'Customization Options',
      rows: [
        {
          id: 'CUST_NONE',
          title: dict.customizations.NO_CUSTOMIZATION.substring(0, 24),
          description: 'Standard retail t-shirt without changes (+₹0)',
        },
        {
          id: 'CUST_TEXT',
          title: dict.customizations.CUSTOM_TEXT_PRINT.substring(0, 24),
          description: 'Print your name, quote, or slogan (+₹99/pc)',
        },
        {
          id: 'CUST_LOGO',
          title: dict.customizations.LOGO_PRINT.substring(0, 24),
          description: 'Print your custom business/personal logo (+₹149/pc)',
        },
        {
          id: 'CUST_COLOR',
          title: dict.customizations.COLOR_CHANGE.substring(0, 24),
          description: 'Choose bespoke shades from our color card (+₹120/pc)',
        },
      ],
    },
  ];

  return whatsappService.sendListMessage(
    to,
    dict.customizationHeader,
    dict.customizationBody,
    dict.customizationButton,
    sections
  );
}

async function handleCustomizationSelection(to, session, selectedId, dict) {
  switch (selectedId) {
    case 'CUST_NONE':
      session.cart.customizationType = 'NO_CUSTOMIZATION';
      session.cart.customizationDetails = 'None';
      session.state = 'AWAITING_ORDER_CONFIRMATION';
      await session.save();
      return renderOrderSummary(to, session, dict);

    case 'CUST_TEXT':
      session.cart.customizationType = 'CUSTOM_TEXT_PRINT';
      session.state = 'AWAITING_CUSTOM_TEXT';
      await session.save();
      return whatsappService.sendTextMessage(to, dict.enterCustomText);

    case 'CUST_LOGO':
      session.cart.customizationType = 'LOGO_PRINT';
      session.state = 'AWAITING_LOGO_IMAGE';
      await session.save();
      return whatsappService.sendTextMessage(to, dict.sendLogoImage);

    case 'CUST_COLOR':
      session.cart.customizationType = 'COLOR_CHANGE';
      session.state = 'AWAITING_COLOR_CHOICE';
      await session.save();
      return whatsappService.sendTextMessage(to, dict.selectColorPrompt);

    default:
      await whatsappService.sendTextMessage(to, '⚠️ Please pick an option from the menu.');
      return sendCustomizationMenu(to, dict);
  }
}

async function handleCustomTextInput(to, session, text, dict) {
  if (!text || text.length > 50) {
    return whatsappService.sendTextMessage(to, 'Please enter text up to 50 characters:');
  }
  session.cart.customizationDetails = text;
  session.state = 'AWAITING_ORDER_CONFIRMATION';
  await session.save();
  return renderOrderSummary(to, session, dict);
}

async function handleLogoImageInput(to, session, mediaType, mediaId, dict) {
  if (!mediaId) {
    return whatsappService.sendTextMessage(to, '⚠️ Please attach a photo/image of your logo.');
  }
  session.cart.customizationDetails = `WhatsApp Media ID: ${mediaId}`;
  session.state = 'AWAITING_ORDER_CONFIRMATION';
  await session.save();
  return renderOrderSummary(to, session, dict);
}

async function handleColorChoiceInput(to, session, text, dict) {
  if (!text) {
    return whatsappService.sendTextMessage(to, dict.selectColorPrompt);
  }
  session.cart.customizationDetails = text;
  session.state = 'AWAITING_ORDER_CONFIRMATION';
  await session.save();
  return renderOrderSummary(to, session, dict);
}

// -----------------------------------------------------------------------------
// STEP 7: ORDER SUMMARY & CONFIRMATION
// -----------------------------------------------------------------------------
async function renderOrderSummary(to, session, dict) {
  const { basePrice, quantity, customizationType } = session.cart;
  const pricing = calculateOrderPrice(basePrice, quantity, customizationType);

  session.cart.priceBreakup = pricing;
  await session.save();

  const custLabel = dict.customizations[customizationType] || customizationType;
  const custSummary =
    customizationType === 'NO_CUSTOMIZATION'
      ? custLabel
      : `${custLabel} ("${session.cart.customizationDetails}")`;

  const summaryMessage = dict.orderSummaryPrompt
    .replace('{productName}', session.cart.productName)
    .replace('{size}', session.cart.size)
    .replaceAll('{quantity}', session.cart.quantity)
    .replace('{customization}', custSummary)
    .replace('{basePrice}', pricing.basePrice)
    .replace('{productsTotal}', pricing.productsTotal)
    .replace('{customizationTotal}', pricing.customizationTotal)
    .replace('{taxAmount}', pricing.taxAmount)
    .replace('{shippingText}', pricing.shippingText)
    .replace('{finalAmount}', pricing.finalAmount);

  const buttons = [
    { id: 'ORDER_CONFIRM', title: dict.btnConfirm },
    { id: 'ORDER_MODIFY', title: dict.btnModify },
    { id: 'ORDER_CANCEL', title: dict.btnCancel },
  ];

  return whatsappService.sendQuickReplyButtons(
    to,
    summaryMessage,
    buttons,
    dict.orderSummaryHeader
  );
}

async function handleOrderConfirmation(to, session, selectedId, text, dict) {
  const clean = (text || '').toLowerCase().trim();

  if (selectedId === 'ORDER_CANCEL' || clean === 'cancel' || clean.includes('cancel')) {
    session.state = 'AWAITING_LANGUAGE';
    session.cart = {};
    await session.save();
    return whatsappService.sendTextMessage(to, dict.orderCancelled);
  }

  if (selectedId === 'ORDER_MODIFY' || clean === 'modify' || clean.includes('modify') || clean.includes('edit')) {
    session.state = 'AWAITING_CATEGORY';
    await session.save();
    return sendCategoryList(to, dict);
  }

  if (selectedId === 'ORDER_CONFIRM' || clean === 'confirm' || clean === 'yes' || clean === 'ok') {
    session.state = 'AWAITING_CUSTOMER_NAME';
    await session.save();
    return whatsappService.sendTextMessage(to, dict.askCustomerName);
  }

  return renderOrderSummary(to, session, dict);
}

// -----------------------------------------------------------------------------
// STEP 8: CUSTOMER DETAILS (NAME, PHONE, ADDRESS)
// -----------------------------------------------------------------------------
async function handleCustomerNameInput(to, session, text, dict) {
  if (!text || text.length < 2) {
    return whatsappService.sendTextMessage(to, 'Please enter a valid full name:');
  }

  session.customerDetails.name = text;
  session.state = 'AWAITING_CUSTOMER_PHONE';
  await session.save();

  const buttons = [
    { id: 'PHONE_USE_CURRENT', title: 'Yes, Use WhatsApp No' },
    { id: 'PHONE_ENTER_NEW', title: 'Enter Another No' },
  ];

  return whatsappService.sendQuickReplyButtons(
    to,
    `Thank you, ${text}! Is ${to} the best contact number for courier delivery updates?`,
    buttons,
    'Contact Number'
  );
}

async function handleCustomerPhoneInput(to, session, selectedId, text, dict) {
  if (selectedId === 'PHONE_USE_CURRENT') {
    session.customerDetails.phone = to;
    session.state = 'AWAITING_CUSTOMER_ADDRESS';
    await session.save();
    return whatsappService.sendTextMessage(to, dict.askCustomerAddress);
  }

  if (selectedId === 'PHONE_ENTER_NEW') {
    return whatsappService.sendTextMessage(to, 'Please type your 10-digit mobile number:');
  }

  // Regex validate phone number (10 digits)
  const phoneDigits = text.replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    return whatsappService.sendTextMessage(to, '⚠️ Please enter a valid 10-digit mobile number:');
  }

  session.customerDetails.phone = phoneDigits;
  session.state = 'AWAITING_CUSTOMER_ADDRESS';
  await session.save();
  return whatsappService.sendTextMessage(to, dict.askCustomerAddress);
}

async function handleCustomerAddressInput(to, session, text, dict) {
  // Regex check for 6-digit PIN code
  const pincodeMatch = text.match(/\b[1-9][0-9]{5}\b/);
  if (!pincodeMatch || text.length < 15) {
    return whatsappService.sendTextMessage(to, dict.invalidPincode);
  }

  session.customerDetails.street = text;
  session.customerDetails.city = 'Delivery Destination';
  session.customerDetails.pincode = pincodeMatch[0];
  session.state = 'AWAITING_PAYMENT_METHOD';
  await session.save();

  const amount = session.cart.priceBreakup.finalAmount;
  const prompt = dict.paymentMethodPrompt.replace('{amount}', amount);

  const buttons = [
    { id: 'PAY_COD', title: dict.btnCOD },
    { id: 'PAY_ONLINE', title: dict.btnOnline },
  ];

  return whatsappService.sendQuickReplyButtons(
    to,
    prompt,
    buttons,
    'Payment Mode'
  );
}

// -----------------------------------------------------------------------------
// STEP 9: PAYMENT METHOD & FINAL ORDER PLACEMENT
// -----------------------------------------------------------------------------
async function handlePaymentMethodSelection(to, session, customer, selectedId, text, dict) {
  const clean = (text || '').toLowerCase().trim();
  const isCOD = selectedId === 'PAY_COD' || clean === 'cod' || clean.includes('cash');
  const isOnline = selectedId === 'PAY_ONLINE' || clean === 'online' || clean.includes('pay') || clean.includes('upi');

  const orderCode = generateOrderCode();
  const estimatedDelivery = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000); // +4 days

  const orderItem = {
    productId: session.cart.productId,
    productName: session.cart.productName,
    category: session.cart.category,
    size: session.cart.size,
    quantity: session.cart.quantity,
    basePrice: session.cart.basePrice,
    customization: {
      type: session.cart.customizationType,
      details: session.cart.customizationDetails,
      chargePerUnit: session.cart.priceBreakup.customizationChargePerUnit,
    },
    itemSubtotal: session.cart.priceBreakup.subtotal,
  };

  if (isCOD) {
    // Save COD Order
    const order = await Order.create({
      orderId: orderCode,
      customerId: customer._id,
      customerPhone: to,
      customerName: session.customerDetails.name,
      deliveryAddress: {
        street: session.customerDetails.street,
        city: session.customerDetails.city,
        pincode: session.customerDetails.pincode,
      },
      items: [orderItem],
      priceBreakup: session.cart.priceBreakup,
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      orderStatus: 'CONFIRMED',
      estimatedDeliveryDate: estimatedDelivery,
    });

    // Decrement inventory stock
    if (orderItem.productId && orderItem.size) {
      await Product.updateOne(
        { _id: orderItem.productId },
        { $inc: { [`stock.${orderItem.size}`]: -orderItem.quantity } }
      );
    }

    await Customer.updateOne(
      { _id: customer._id },
      {
        name: session.customerDetails.name,
        $inc: { totalOrdersPlaced: 1 },
        $push: {
          addresses: {
            street: session.customerDetails.street,
            city: session.customerDetails.city,
            pincode: session.customerDetails.pincode,
            isDefault: true,
          },
        },
      }
    );

    // Reset session
    session.state = 'AWAITING_LANGUAGE';
    session.cart = {};
    await session.save();

    const confirmation = dict.codConfirmed
      .replace('{orderId}', order.orderId)
      .replace('{productName}', orderItem.productName)
      .replace('{size}', orderItem.size)
      .replace('{quantity}', orderItem.quantity)
      .replace('{amount}', order.priceBreakup.finalAmount)
      .replace('{address}', order.deliveryAddress.street);

    return whatsappService.sendTextMessage(to, confirmation);
  }

  if (isOnline) {
    // Create Pending Order
    const order = await Order.create({
      orderId: orderCode,
      customerId: customer._id,
      customerPhone: to,
      customerName: session.customerDetails.name,
      deliveryAddress: {
        street: session.customerDetails.street,
        city: session.customerDetails.city,
        pincode: session.customerDetails.pincode,
      },
      items: [orderItem],
      priceBreakup: session.cart.priceBreakup,
      paymentMethod: 'ONLINE',
      paymentStatus: 'PENDING',
      orderStatus: 'PLACED',
      estimatedDeliveryDate: estimatedDelivery,
    });

    session.pendingOrderId = order._id;
    await session.save();

    // Generate Payment Link
    const paymentLink = await createPaymentLink(
      order,
      to,
      session.customerDetails.name
    );

    const paymentUrl = paymentLink.short_url || `https://rzp.io/i/${order.orderId}`;
    const amount = order.priceBreakup.finalAmount;

    // Send CTA URL button
    return whatsappService.sendCtaUrlButton(
      to,
      'Complete Your Payment 🔐',
      `Tap the button below to pay ₹${amount} via UPI, Cards, or Net Banking.\nOrder ID: #${order.orderId}`,
      `Pay ₹${amount}`,
      paymentUrl,
      'Valid for 15 minutes'
    );
  }

  await whatsappService.sendTextMessage(to, '⚠️ Please tap either Cash on Delivery or Pay Online.');
}

/**
 * Re-prompts the active state when an inactive user taps 'Resume Order'
 */
async function resumeCurrentState(to, session, dict) {
  switch (session.state) {
    case 'AWAITING_LANGUAGE':
      return sendWelcomeAndLanguageSelection(to);
    case 'AWAITING_CATEGORY':
      return sendCategoryList(to, dict);
    case 'AWAITING_PRODUCT':
      return sendProductList(to, session.cart.category || 'HALF_SLEEVE', dict);
    case 'AWAITING_SIZE': {
      const product = await Product.findById(session.cart.productId);
      return product ? sendSizeSelection(to, product, dict) : sendCategoryList(to, dict);
    }
    case 'AWAITING_QUANTITY':
      return sendQuantityPrompt(to, dict);
    case 'AWAITING_CUSTOMIZATION':
      return sendCustomizationMenu(to, dict);
    case 'AWAITING_CUSTOM_TEXT':
      return whatsappService.sendTextMessage(to, dict.enterCustomText);
    case 'AWAITING_LOGO_IMAGE':
      return whatsappService.sendTextMessage(to, dict.sendLogoImage);
    case 'AWAITING_COLOR_CHOICE':
      return whatsappService.sendTextMessage(to, dict.selectColorPrompt);
    case 'AWAITING_ORDER_CONFIRMATION':
      return renderOrderSummary(to, session, dict);
    case 'AWAITING_CUSTOMER_NAME':
      return whatsappService.sendTextMessage(to, dict.askCustomerName);
    case 'AWAITING_CUSTOMER_PHONE':
      return whatsappService.sendTextMessage(to, dict.askCustomerPhone);
    case 'AWAITING_CUSTOMER_ADDRESS':
      return whatsappService.sendTextMessage(to, dict.askCustomerAddress);
    case 'AWAITING_PAYMENT_METHOD': {
      const amount = session.cart.priceBreakup?.finalAmount || 0;
      const prompt = dict.paymentMethodPrompt.replace('{amount}', amount);
      const buttons = [
        { id: 'PAY_COD', title: dict.btnCOD },
        { id: 'PAY_ONLINE', title: dict.btnOnline },
      ];
      return whatsappService.sendQuickReplyButtons(to, prompt, buttons, 'Payment Mode');
    }
    default:
      return sendWelcomeAndLanguageSelection(to);
  }
}

module.exports = {
  processIncomingMessage,
  sendWelcomeAndLanguageSelection,
  resumeCurrentState,
};
