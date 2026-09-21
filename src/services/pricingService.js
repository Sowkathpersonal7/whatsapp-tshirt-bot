const CUSTOMIZATION_CHARGES = {
  NO_CUSTOMIZATION: 0,
  CUSTOM_TEXT_PRINT: 99,
  LOGO_PRINT: 149,
  COLOR_CHANGE: 120,
};

const SHIPPING_THRESHOLD = 799;
const STANDARD_SHIPPING_FEE = 60;

/**
 * Calculates complete price breakdown for a T-shirt order
 * @param {number} basePrice - Base unit price of the t-shirt
 * @param {number} quantity - Quantity of items ordered
 * @param {string} customizationType - Customization enum
 * @returns {object} Detailed price breakup
 */
function calculateOrderPrice(basePrice, quantity, customizationType) {
  const safeQty = Math.max(1, parseInt(quantity, 10) || 1);
  const unitCustomizationCharge = CUSTOMIZATION_CHARGES[customizationType] || 0;

  const productsTotal = basePrice * safeQty;
  const customizationTotal = unitCustomizationCharge * safeQty;
  const subtotal = productsTotal + customizationTotal;

  // Apparel GST in India: 5% if unit price <= 1000, 12% if > 1000
  const effectiveUnitPrice = basePrice + unitCustomizationCharge;
  const gstRate = effectiveUnitPrice > 1000 ? 0.12 : 0.05;
  const taxAmount = Math.round(subtotal * gstRate * 100) / 100;

  // Free shipping above threshold
  const shippingFee = subtotal >= SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const finalAmount = Math.round((subtotal + taxAmount + shippingFee) * 100) / 100;

  return {
    basePrice,
    quantity: safeQty,
    productsTotal,
    customizationChargePerUnit: unitCustomizationCharge,
    customizationTotal,
    subtotal,
    taxRatePercentage: gstRate * 100,
    taxAmount,
    shippingFee,
    shippingText: shippingFee === 0 ? 'FREE 🚚' : `₹${shippingFee}`,
    finalAmount,
  };
}

module.exports = {
  CUSTOMIZATION_CHARGES,
  calculateOrderPrice,
};
