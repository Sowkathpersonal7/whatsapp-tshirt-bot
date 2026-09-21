module.exports = {
  en: {
    welcome: 'Thank you for contacting EG Retail Shop! 👕\nWe offer premium custom and everyday t-shirts.\n\nPlease select your preferred language to continue:',
    languageSelected: 'You have selected English.',
    categoriesHeader: 'EG T-Shirt Collections 🏷️',
    categoriesBody: 'Please choose a category from the list below to explore our styles:',
    categoriesButton: 'Browse Categories ▾',
    categories: {
      HALF_SLEEVE: 'Half Sleeve T-Shirts',
      FULL_SLEEVE: 'Full Sleeve T-Shirts',
      DROP_SHOULDER: 'Drop Shoulder T-Shirts',
      REGULAR_FIT: 'Regular Fit T-Shirts',
      LOOSE_FIT: 'Loose Fit T-Shirts',
    },
    selectProductHeader: 'Available Products 🛍️',
    selectProductBody: 'Tap below to select your t-shirt:',
    selectProductButton: 'Select T-Shirt ▾',
    sizePrompt: 'Please select your desired size:\n• S (38")\n• M (40")\n• L (42")\n• XL (44")\n• XXL (46")',
    chooseSizeButton: 'Choose Size ▾',
    quantityPrompt: 'How many pieces would you like to order? (Reply with a number between 1 and 50, or tap below):',
    customizationHeader: 'T-Shirt Customization 🎨',
    customizationBody: 'Would you like to add custom printing or color changes?',
    customizationButton: 'View Options ▾',
    customizations: {
      NO_CUSTOMIZATION: 'No Customization (Plain)',
      CUSTOM_TEXT_PRINT: 'Custom Text Printing (+₹99/pc)',
      LOGO_PRINT: 'Logo Printing (+₹149/pc)',
      COLOR_CHANGE: 'Color Change (+₹120/pc)',
    },
    enterCustomText: 'Please type the exact text you want printed on your T-shirt (Max 30 characters):',
    sendLogoImage: 'Please upload your high-resolution logo image right here in this chat (PNG or JPG):',
    selectColorPrompt: 'Please select or type your desired color (e.g. Lavender, Sage Green, Charcoal Slate, Mustard):',
    orderSummaryHeader: '🧾 Order Review & Price Breakup',
    orderSummaryPrompt: 'Please review your order details below:\n\n' +
      '👕 Product: {productName}\n' +
      '📏 Size: {size}\n' +
      '🔢 Quantity: {quantity}\n' +
      '🎨 Customization: {customization}\n' +
      '────────────────────\n' +
      '• Base Price: ₹{basePrice} × {quantity} = ₹{productsTotal}\n' +
      '• Customization: ₹{customizationTotal}\n' +
      '• Tax (GST 5%): ₹{taxAmount}\n' +
      '• Shipping: {shippingText}\n' +
      '────────────────────\n' +
      '💰 Total Payable: ₹{finalAmount}\n\n' +
      'Would you like to confirm this order?',
    btnConfirm: '✅ Confirm Order',
    btnModify: '✏️ Modify Order',
    btnCancel: '❌ Cancel Order',
    orderCancelled: 'Your order configuration has been cancelled. Send "Hi" anytime to start a fresh order!',
    askCustomerName: 'Great! Please enter your Full Name for delivery:',
    askCustomerPhone: 'Please confirm your 10-digit delivery contact number:',
    askCustomerAddress: 'Please provide your complete Delivery Address along with City and 6-digit PIN code:',
    paymentMethodPrompt: 'Please select your preferred payment mode for ₹{amount}:',
    btnCOD: '💵 Cash on Delivery',
    btnOnline: '⚡ Pay Online (UPI/Card)',
    codConfirmed: '🎉 Order Placed Successfully!\n\n' +
      '📋 Order ID: #{orderId}\n' +
      '👕 Item: {productName} ({size}) × {quantity}\n' +
      '💰 Amount to pay on delivery: ₹{amount}\n' +
      '📍 Delivering to: {address}\n' +
      '🚚 Estimated Delivery: 3-5 Business Days\n\n' +
      'Thank you for shopping with EG Retail Shop! We will send updates as your order is dispatched.',
    onlinePaymentPrompt: 'Please click the link below to complete your payment of ₹{amount}:\n\n' +
      '👉 {paymentUrl}\n\n' +
      '⚠️ This link expires in 15 minutes. Once payment is completed, your order will be automatically confirmed.',
    orderPaidConfirmed: '🎉 Payment Received & Order Confirmed!\n\n' +
      '📋 Order ID: #{orderId}\n' +
      '👕 Item: {productName} ({size}) × {quantity}\n' +
      '💳 Paid: ₹{amount} (Transaction ID: {paymentId})\n' +
      '📍 Delivering to: {address}\n' +
      '🚚 Estimated Delivery: 3-5 Business Days\n\n' +
      'We are now preparing your order for production!',
    invalidQuantity: '⚠️ Please enter a valid quantity between 1 and 50.',
    invalidPincode: '⚠️ Please provide a valid address with a 6-digit postal PIN code (e.g. 560038).',
    genericError: 'Something went wrong while processing your request. Please send "Hi" to restart.',
    inactivityReminder: 'Hi! We noticed your T-Shirt order is still in progress. Tap below to resume your order where you left off:',
    btnResume: '▶️ Resume Order',
  },
  ta: {
    welcome: 'EG ரீடெய்ல் ஷாப்பைத் தொடர்பு கொண்டதற்கு நன்றி! 👕\nநாங்கள் தரமான டி-ஷர்ட்களை வழங்குகிறோம்.\n\nதொடர உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்:',
    languageSelected: 'நீங்கள் தமிழ் மொழியைத் தேர்ந்தெடுத்துள்ளீர்கள்.',
    categoriesHeader: 'எங்கள் டி-ஷர்ட் வகைகள் 🏷️',
    categoriesBody: 'வகையைத் தேர்ந்தெடுக்க கீழே உள்ள பொத்தானைத் தொடவும்:',
    categoriesButton: 'வகைகள் ▾',
    categories: {
      HALF_SLEEVE: 'ஹாஃப் ஸ்லீவ் (Half Sleeve)',
      FULL_SLEEVE: 'ஃபுல் ஸ்லீவ் (Full Sleeve)',
      DROP_SHOULDER: 'டிராப் ஷோல்டர் (Drop Shoulder)',
      REGULAR_FIT: 'ரெகுலர் ஃபிட் (Regular Fit)',
      LOOSE_FIT: 'லூஸ் ஃபிட் (Loose Fit)',
    },
    selectProductHeader: 'தயாரிப்புகள் 🛍️',
    selectProductBody: 'டி-ஷர்ட்டைத் தேர்ந்தெடுக்க கீழே அழுத்தவும்:',
    selectProductButton: 'தேர்ந்தெடு ▾',
    sizePrompt: 'தயவுசெய்து அளவைத் தேர்ந்தெடுக்கவும்:\n• S (38")\n• M (40")\n• L (42")\n• XL (44")\n• XXL (46")',
    chooseSizeButton: 'அளவு ▾',
    quantityPrompt: 'எத்தனை எண்ணிக்கையில் வேண்டும்? (1 முதல் 50 வரை உள்ளிடவும்):',
    customizationHeader: 'தனிப்பயனாக்கம் 🎨',
    customizationBody: 'டி-ஷர்ட்டில் பிரிண்ட் அல்லது கலர் மாற்றம் செய்ய வேண்டுமா?',
    customizationButton: 'விருப்பங்கள் ▾',
    customizations: {
      NO_CUSTOMIZATION: 'தனிப்பயனாக்கம் வேண்டாம் (Plain)',
      CUSTOM_TEXT_PRINT: 'உரை அச்சிடுதல் (+₹99/pc)',
      LOGO_PRINT: 'லோகோ அச்சிடுதல் (+₹149/pc)',
      COLOR_CHANGE: 'நிற மாற்றம் (+₹120/pc)',
    },
    enterCustomText: 'பிரிண்ட் செய்ய வேண்டிய உரையை தட்டச்சு செய்து அனுப்பவும் (அதிகபட்சம் 30 எழுத்துக்கள்):',
    sendLogoImage: 'உங்கள் லோகோ படத்தை இங்கே பதிவேற்றவும் (PNG அல்லது JPG):',
    selectColorPrompt: 'விருப்பமான நிறத்தைத் தட்டச்சு செய்யவும் (எ.கா: லாவெண்டர், சேஜ் கிரீன், சாம்பல்):',
    orderSummaryHeader: '🧾 ஆர்டர் விவரங்கள் & விலை பட்டியல்',
    orderSummaryPrompt: 'உங்கள் ஆர்டர் விவரங்களைச் சரிபார்க்கவும்:\n\n' +
      '👕 தயாரிப்பு: {productName}\n' +
      '📏 அளவு: {size}\n' +
      '🔢 எண்ணிக்கை: {quantity}\n' +
      '🎨 தனிப்பயனாக்கம்: {customization}\n' +
      '────────────────────\n' +
      '• அடிப்படை விலை: ₹{basePrice} × {quantity} = ₹{productsTotal}\n' +
      '• தனிப்பயனாக்கம்: ₹{customizationTotal}\n' +
      '• வரி (GST 5%): ₹{taxAmount}\n' +
      '• டெலிவரி கட்டணம்: {shippingText}\n' +
      '────────────────────\n' +
      '💰 மொத்த தொகை: ₹{finalAmount}\n\n' +
      'இந்த ஆர்டரை உறுதிப்படுத்த விரும்புகிறீர்களா?',
    btnConfirm: '✅ ஆர்டரை உறுதிசெய்',
    btnModify: '✏️ மாற்று',
    btnCancel: '❌ ரத்துசெய்',
    orderCancelled: 'உங்கள் ஆர்டர் ரத்து செய்யப்பட்டது. புதிதாக ஆர்டர் செய்ய "Hi" என அனுப்பவும்.',
    askCustomerName: 'சிறப்பு! டெலிவரிக்காக உங்கள் முழுப் பெயரை உள்ளிடவும்:',
    askCustomerPhone: 'உங்கள் 10 இலக்க தொலைபேசி எண்ணை உறுதிப்படுத்தவும்:',
    askCustomerAddress: 'உங்கள் முழுமையான முகவரியை பின்கோடுடன் அனுப்பவும்:',
    paymentMethodPrompt: '₹{amount}-க்கான கட்டண முறையைத் தேர்ந்தெடுக்கவும்:',
    btnCOD: '💵 கேஷ் ஆன் டெலிவரி',
    btnOnline: '⚡ ஆன்லைன் பேமெண்ட்',
    codConfirmed: '🎉 ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டது!\n\n' +
      '📋 ஆர்டர் எண்: #{orderId}\n' +
      '👕 பொருள்: {productName} ({size}) × {quantity}\n' +
      '💰 டெலிவரியின் போது செலுத்த வேண்டியது: ₹{amount}\n' +
      '📍 முகவரி: {address}\n' +
      '🚚 டெலிவரி காலம்: 3-5 வேலை நாட்கள்\n\n' +
      'EG ரீடெய்ல் ஷாப்பில் வாங்கியதற்கு நன்றி!',
    onlinePaymentPrompt: 'கட்டணம் செலுத்த இந்த இணைப்பைப் பயன்படுத்தவும் (₹{amount}):\n\n' +
      '👉 {paymentUrl}\n\n' +
      '⚠️ இணைப்பு 15 நிமிடங்கள் மட்டுமே செயல்படும்.',
    orderPaidConfirmed: '🎉 கட்டணம் பெறப்பட்டு ஆர்டர் உறுதி செய்யப்பட்டது!\n\n' +
      '📋 ஆர்டர் எண்: #{orderId}\n' +
      '💳 தொகை: ₹{amount}\n' +
      'டெலிவரிக்கு தயாராகி வருகிறது!',
    invalidQuantity: '⚠️ தயவுசெய்து 1 முதல் 50 வரை செல்லுபடியாகும் எண்ணிக்கையை உள்ளிடவும்.',
    invalidPincode: '⚠️ 6 இலக்க பின்கோடுடன் சரியான முகவரியை உள்ளிடவும்.',
    genericError: 'பிழை ஏற்பட்டது. மீண்டும் தொடங்க "Hi" என அனுப்பவும்.',
    inactivityReminder: 'வணக்கம்! உங்கள் டி-ஷர்ட் ஆர்டர் பாதியில் உள்ளது. தொடர கீழே உள்ள பொத்தானைத் தொடவும்:',
    btnResume: '▶️ தொடரவும்',
  },
  hi: {
    welcome: 'EG रिटेल शॉप से संपर्क करने के लिए धन्यवाद! 👕\nहम प्रीमियम कस्टम और दैनिक टी-शर्ट प्रदान करते हैं।\n\nजारी रखने के लिए कृपया अपनी पसंदीदा भाषा चुनें:',
    languageSelected: 'आपने हिन्दी भाषा चुनी है।',
    categoriesHeader: 'टी-शर्ट श्रेणियां 🏷️',
    categoriesBody: 'हमारे कलेक्शन देखने के लिए नीचे दिए गए बटन पर टैप करें:',
    categoriesButton: 'श्रेणियां देखें ▾',
    categories: {
      HALF_SLEEVE: 'हाफ स्लीव (Half Sleeve)',
      FULL_SLEEVE: 'फुल स्लीव (Full Sleeve)',
      DROP_SHOULDER: 'ड्रॉप शोल्डर (Drop Shoulder)',
      REGULAR_FIT: 'रेगुलर फिट (Regular Fit)',
      LOOSE_FIT: 'लूज फिट (Loose Fit)',
    },
    selectProductHeader: 'उपलब्ध उत्पाद 🛍️',
    selectProductBody: 'टी-शर्ट चुनने के लिए नीचे टैप करें:',
    selectProductButton: 'चुनें ▾',
    sizePrompt: 'कृपया अपना साइज़ चुनें:\n• S (38")\n• M (40")\n• L (42")\n• XL (44")\n• XXL (46")',
    chooseSizeButton: 'साइज़ चुनें ▾',
    quantityPrompt: 'आप कितने पीस ऑर्डर करना चाहते हैं? (1 से 50 के बीच संख्या दर्ज करें):',
    customizationHeader: 'टी-शर्ट कस्टमाइज़ेशन 🎨',
    customizationBody: 'क्या आप प्रिंटिंग या रंग बदलना चाहते हैं?',
    customizationButton: 'विकल्प देखें ▾',
    customizations: {
      NO_CUSTOMIZATION: 'कोई कस्टमाइज़ेशन नहीं (सादा)',
      CUSTOM_TEXT_PRINT: 'कस्टम टेक्स्ट प्रिंटिंग (+₹99/pc)',
      LOGO_PRINT: 'लोगो प्रिंटिंग (+₹149/pc)',
      COLOR_CHANGE: 'रंग परिवर्तन (+₹120/pc)',
    },
    enterCustomText: 'कृपया वह टेक्स्ट टाइप करें जिसे आप टी-शर्ट पर प्रिंट करवाना चाहते हैं (अधिकतम 30 अक्षर):',
    sendLogoImage: 'कृपया अपने लोगो की उच्च गुणवत्ता वाली तस्वीर यहाँ चैट में भेजें (PNG या JPG):',
    selectColorPrompt: 'कृपया अपना पसंदीदा रंग टाइप करें (उदा: लैवेंडर, सेज ग्रीन, ग्रे):',
    orderSummaryHeader: '🧾 ऑर्डर समीक्षा एवं मूल्य विवरण',
    orderSummaryPrompt: 'कृपया अपने ऑर्डर विवरण की जाँच करें:\n\n' +
      '👕 उत्पाद: {productName}\n' +
      '📏 साइज़: {size}\n' +
      '🔢 मात्रा: {quantity}\n' +
      '🎨 कस्टमाइज़ेशन: {customization}\n' +
      '────────────────────\n' +
      '• मूल मूल्य: ₹{basePrice} × {quantity} = ₹{productsTotal}\n' +
      '• कस्टमाइज़ेशन: ₹{customizationTotal}\n' +
      '• टैक्स (GST 5%): ₹{taxAmount}\n' +
      '• शिपिंग: {shippingText}\n' +
      '────────────────────\n' +
      '💰 कुल राशि: ₹{finalAmount}\n\n' +
      'क्या आप यह ऑर्डर कन्फर्म करना चाहते हैं?',
    btnConfirm: '✅ ऑर्डर कन्फर्म करें',
    btnModify: '✏️ बदलें',
    btnCancel: '❌ रद्द करें',
    orderCancelled: 'आपका ऑर्डर रद्द कर दिया गया है। नया ऑर्डर शुरू करने के लिए कभी भी "Hi" भेजें।',
    askCustomerName: 'शानदार! डिलीवरी के लिए कृपया अपना पूरा नाम दर्ज करें:',
    askCustomerPhone: 'कृपया अपने 10 अंकों के मोबाइल नंबर की पुष्टि करें:',
    askCustomerAddress: 'कृपया पिन कोड सहित अपना पूरा डिलीवरी पता भेजें:',
    paymentMethodPrompt: '₹{amount} के भुगतान के लिए विधि चुनें:',
    btnCOD: '💵 कैश ऑन डिलीवरी',
    btnOnline: '⚡ ऑनलाइन पेमेंट (UPI/कार्ड)',
    codConfirmed: '🎉 ऑर्डर सफलतापूर्वक दर्ज हुआ!\n\n' +
      '📋 ऑर्डर आईडी: #{orderId}\n' +
      '👕 आइटम: {productName} ({size}) × {quantity}\n' +
      '💰 डिलीवरी पर देय राशि: ₹{amount}\n' +
      '📍 डिलीवरी पता: {address}\n' +
      '🚚 अनुमानित डिलीवरी: 3-5 कार्य दिवस\n\n' +
      'EG रिटेल शॉप से खरीदारी के लिए धन्यवाद!',
    onlinePaymentPrompt: 'कृपया ₹{amount} का भुगतान करने के लिए नीचे दिए गए लिंक पर क्लिक करें:\n\n' +
      '👉 {paymentUrl}\n\n' +
      '⚠️ यह लिंक 15 मिनट के लिए वैध है।',
    orderPaidConfirmed: '🎉 भुगतान प्राप्त हुआ और ऑर्डर कन्फर्म हुआ!\n\n' +
      '📋 ऑर्डर आईडी: #{orderId}\n' +
      '💳 राशि: ₹{amount}\n' +
      'आपका ऑर्डर तैयार किया जा रहा है!',
    invalidQuantity: '⚠️ कृपया 1 से 50 के बीच एक मान्य संख्या दर्ज करें।',
    invalidPincode: '⚠️ कृपया 6 अंकों के पिन कोड के साथ मान्य पता दर्ज करें।',
    genericError: 'कुछ गड़बड़ हो गई। पुनः आरंभ करने के लिए "Hi" भेजें।',
    inactivityReminder: 'नमस्ते! आपका टी-शर्ट ऑर्डर अधूरा है। जारी रखने के लिए नीचे दिए गए बटन पर टैप करें:',
    btnResume: '▶️ जारी रखें',
  },
};
