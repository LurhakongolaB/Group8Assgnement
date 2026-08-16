const {
  buildReturnMessage,
  generalRefundInfo,
} = require("../src/returnsService");

describe("Returns Service", () => {
  describe("buildReturnMessage()", () => {
    test("should tell customers to wait when an order is processing", () => {
      const order = {
        status: "processing",
      };

      const message = buildReturnMessage(order);

      expect(message).toContain("hasn't been delivered yet");
      expect(message).toContain("30 days");
    });

    test("should tell customers to wait when an order is shipped", () => {
      const order = {
        status: "shipped",
      };

      const message = buildReturnMessage(order);

      expect(message).toContain("hasn't been delivered yet");
      expect(message).toContain("30 days");
    });

    test("should provide refund information for a cancelled order", () => {
      const order = {
        status: "cancelled",
      };

      const message = buildReturnMessage(order);

      expect(message).toContain("already cancelled");
      expect(message).toContain("5–7 business days");
    });

    test("should provide return instructions for a delivered order within the return window", () => {
      const order = {
        orderId: "ORD-1003",
        status: "delivered",
        estimatedDelivery: "2026-08-14",
      };

      const message = buildReturnMessage(order);

      expect(message).toContain("30-day return window");
      expect(message).toContain("ORD-1003");
      expect(message).toContain("northstarretail.com/returns");
      expect(message).toContain("5–7 business days");
    });

    test("should reject an order delivered outside the return window", () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 40);

      const order = {
        orderId: "ORD-OLD",
        status: "delivered",
        estimatedDelivery: oldDate.toISOString().slice(0, 10),
      };

      const message = buildReturnMessage(order);

      expect(message).toContain("outside the 30-day return window");
    //   expect(message).toContain("ORD-OLD");
    });

    test("should return a fallback message for an unsupported order status", () => {
      const order = {
        status: "unknown",
      };

      const message = buildReturnMessage(order);

      expect(message).toContain("couldn't find return eligibility");
    });
  });

  describe("generalRefundInfo()", () => {
    test("should explain the refund processing timeline", () => {
      const message = generalRefundInfo();

      expect(message).toContain("5–7 business days");
      expect(message).toContain("original payment method");
      expect(message).toContain("confirmation email");
    });
  });
});