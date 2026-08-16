/**
 * orderService.js
 * Looks up a mock order record by order ID or customer email.
 * In production this would call Northstar's OMS API.
 */

const orders = require("./data/orders.json");

const STATUS_MESSAGES = {
  processing:
    "Your order is still being processed. It hasn't shipped yet but we'll email you a tracking number within 24 hours.",
  shipped:
    "Great news — your order has shipped! Tracking number: {{tracking}}. Estimated delivery: {{delivery}}.",
  delivered:
    "Your order was delivered on {{delivery}}. If you didn't receive it, please check with neighbours or your building reception first.",
  cancelled:
    "Your order was cancelled. If you didn't request this, please contact our support team.",
};

/**
 * Find an order by orderId OR customerEmail.
 * @param {string} query - orderId (e.g. ORD-1001) or email
 * @returns {object|null}
 */
function findOrder(query) {
  const q = query.trim().toLowerCase();
  return (
    orders.find(
      (o) =>
        o.orderId.toLowerCase() === q ||
        o.customerEmail.toLowerCase() === q
    ) || null
  );
}

/**
 * Build a human-readable status message for an order.
 * @param {object} order
 * @returns {string}
 */
function buildStatusMessage(order) {
  const template =
    STATUS_MESSAGES[order.status] ||
    "We couldn't determine your order status. Please contact support.";

  return template
    .replace("{{tracking}}", order.trackingNumber || "N/A")
    .replace("{{delivery}}", order.estimatedDelivery || "N/A");
}

module.exports = { findOrder, buildStatusMessage };
