const {
  findOrder,
  buildStatusMessage,
} = require("../src/orderService");

describe("Order Service", () => {
  describe("findOrder()", () => {
    test("should find an order using a valid order ID", () => {
      const order = findOrder("ORD-1001");

      expect(order).not.toBeNull();
      expect(order.orderId).toBe("ORD-1001");
      expect(order.customerEmail).toBe("alice@example.com");
    });

    test("should find an order using a customer email", () => {
      const order = findOrder("alice@example.com");

      expect(order).not.toBeNull();
      expect(order.orderId).toBe("ORD-1001");
    });

    test("should find an order regardless of letter case", () => {
      const order = findOrder("ord-1001");

      expect(order).not.toBeNull();
      expect(order.orderId).toBe("ORD-1001");
    });

    test("should return null when the order does not exist", () => {
      const order = findOrder("ORD-9999");

      expect(order).toBeNull();
    });
  });

  describe("buildStatusMessage()", () => {
    test("should return a shipped message with tracking and delivery information", () => {
      const order = {
        status: "shipped",
        trackingNumber: "TRACK-9821",
        estimatedDelivery: "2026-08-18",
      };

      const message = buildStatusMessage(order);

      expect(message).toContain("has shipped");
      expect(message).toContain("TRACK-9821");
      expect(message).toContain("2026-08-18");
    });

    test("should return a processing message", () => {
      const order = {
        status: "processing",
      };

      const message = buildStatusMessage(order);

      expect(message).toContain("still being processed");
      expect(message).toContain("hasn't shipped yet");
    });

    test("should return a delivered message", () => {
      const order = {
        status: "delivered",
        estimatedDelivery: "2026-08-14",
      };

      const message = buildStatusMessage(order);

      expect(message).toContain("was delivered");
      expect(message).toContain("2026-08-14");
    });

    test("should return a cancelled message", () => {
      const order = {
        status: "cancelled",
      };

      const message = buildStatusMessage(order);

      expect(message).toContain("order was cancelled");
    });

    test("should use N/A when tracking information is missing", () => {
      const order = {
        status: "shipped",
        trackingNumber: null,
        estimatedDelivery: "2026-08-19",
      };

      const message = buildStatusMessage(order);

      expect(message).toContain("N/A");
    });

    test("should return a fallback message for an unknown status", () => {
      const order = {
        status: "unknown",
      };

      const message = buildStatusMessage(order);

      expect(message).toContain("couldn't determine your order status");
    });
  });
});