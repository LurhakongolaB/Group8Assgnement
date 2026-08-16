/**
 * returnsService.js
 * Provides decision-tree answers for returns and refund questions.
 * No external API needed for MVP — all logic is rule-based.
 */

const RETURN_WINDOW_DAYS = 30;

/**
 * Determine if a delivered order is still within the return window.
 * @param {string} deliveryDateStr - ISO date string e.g. "2026-08-14"
 * @returns {boolean}
 */
function isWithinReturnWindow(deliveryDateStr) {
  if (!deliveryDateStr) return false;
  const deliveredOn = new Date(deliveryDateStr);
  const today = new Date();
  const diffDays = Math.floor(
    (today - deliveredOn) / (1000 * 60 * 60 * 24)
  );
  return diffDays <= RETURN_WINDOW_DAYS;
}

/**
 * Build a return eligibility message for an order.
 * @param {object} order
 * @returns {string}
 */
function buildReturnMessage(order) {
  if (order.status === "processing" || order.status === "shipped") {
    return (
      "Your order hasn't been delivered yet. You can request a return once it arrives. " +
      `Our return window is ${RETURN_WINDOW_DAYS} days from delivery.`
    );
  }

  if (order.status === "cancelled") {
    return "Your order was already cancelled. If a charge was made, a refund should appear within 5–7 business days.";
  }

  if (order.status === "delivered") {
    if (isWithinReturnWindow(order.estimatedDelivery)) {
      return (
        `Your order is within our ${RETURN_WINDOW_DAYS}-day return window. ` +
        "To start your return:\n" +
        "  1. Visit northstarretail.com/returns\n" +
        "  2. Enter your order ID: " +
        order.orderId +
        "\n" +
        "  3. Select the items you want to return and print the prepaid label.\n" +
        "Refunds are processed within 5–7 business days once we receive the item."
      );
    } else {
      return (
        `Sorry, your order is outside the ${RETURN_WINDOW_DAYS}-day return window ` +
        `(delivered on ${order.estimatedDelivery}). ` +
        "If you believe there's an exception, please contact support@northstarretail.com."
      );
    }
  }

  return "We couldn't find return eligibility for your order. Please contact support.";
}

/**
 * Answer a general refund timeline question (no order lookup needed).
 * @returns {string}
 */
function generalRefundInfo() {
  return (
    "Once Northstar receives your returned item, refunds are processed in 5–7 business days.\n" +
    "The refund goes back to your original payment method.\n" +
    "You'll receive a confirmation email when the refund is issued."
  );
}

module.exports = { buildReturnMessage, generalRefundInfo };
