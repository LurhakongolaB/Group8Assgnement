/**
 * chatbot.js
 * Northstar Retail Co. — Support Deflection MVP
 * Decision-tree chatbot covering:
 *   - Order Status ("Where is my order?" / "Has this shipped?")
 *   - Returns & Refunds ("How do I return this?" / "When will I get my refund?")
 *
 * Run: node src/chatbot.js
 */

const readline = require("readline");
const { findOrder, buildStatusMessage } = require("./orderService");
const { buildReturnMessage, generalRefundInfo } = require("./returnsService");

// ─── State ────────────────────────────────────────────────────────────────────
const STATE = {
  MAIN_MENU: "MAIN_MENU",
  ORDER_STATUS_ASK_ID: "ORDER_STATUS_ASK_ID",
  RETURNS_MENU: "RETURNS_MENU",
  RETURNS_ASK_ID: "RETURNS_ASK_ID",
  ANYTHING_ELSE: "ANYTHING_ELSE",
  DONE: "DONE",
};

let currentState = STATE.MAIN_MENU;
let currentOrder = null; // holds the looked-up order during a session turn

// ─── UI helpers ───────────────────────────────────────────────────────────────
const DIVIDER = "─".repeat(60);

function print(msg) {
  console.log(msg);
}

function bot(msg) {
  console.log(`\n🤖  ${msg}\n`);
}

function printMainMenu() {
  print(DIVIDER);
  bot(
    "Hi! I'm Northstar's support assistant. How can I help you today?\n\n" +
      "  [1] Check my order status\n" +
      "  [2] Returns & refunds\n" +
      "  [3] Talk to a human agent\n" +
      "  [0] Exit"
  );
}

function printReturnsMenu() {
  bot(
    "What would you like help with?\n\n" +
      "  [1] Start a return for a specific order\n" +
      "  [2] Ask about refund timelines\n" +
      "  [3] Back to main menu"
  );
}

// ─── State machine ────────────────────────────────────────────────────────────
function handleInput(input) {
  const trimmed = input.trim();

  switch (currentState) {
    // ── Main menu ─────────────────────────────────────────────────────────────
    case STATE.MAIN_MENU: {
      if (trimmed === "1") {
        bot("Please enter your Order ID (e.g. ORD-1001) or the email address you used when ordering:");
        currentState = STATE.ORDER_STATUS_ASK_ID;
      } else if (trimmed === "2") {
        printReturnsMenu();
        currentState = STATE.RETURNS_MENU;
      } else if (trimmed === "3") {
        bot(
          "Connecting you to the support team…\n" +
            "  📧 support@northstarretail.com\n" +
            "  📞 0800 123 456 (Mon–Fri 08:00–18:00)\n\n" +
            "Goodbye! 👋"
        );
        currentState = STATE.DONE;
      } else if (trimmed === "0") {
        bot("Thanks for visiting Northstar. Goodbye! 👋");
        currentState = STATE.DONE;
      } else {
        bot("Sorry, I didn't understand that. Please enter 1, 2, 3 or 0.");
      }
      break;
    }

    // ── Order status lookup ───────────────────────────────────────────────────
    case STATE.ORDER_STATUS_ASK_ID: {
      const order = findOrder(trimmed);
      if (!order) {
        bot(
          `I couldn't find an order matching "${trimmed}".\n` +
            "Double-check the ID or email and try again, or press [0] to exit."
        );
        // Stay in this state so the customer can retry
      } else {
        bot(
          `Order found: ${order.orderId}\n` +
            `Items: ${order.items.join(", ")}\n\n` +
            buildStatusMessage(order)
        );
        askAnythingElse();
      }
      break;
    }

    // ── Returns sub-menu ──────────────────────────────────────────────────────
    case STATE.RETURNS_MENU: {
      if (trimmed === "1") {
        bot("Please enter your Order ID (e.g. ORD-1001) to check return eligibility:");
        currentState = STATE.RETURNS_ASK_ID;
      } else if (trimmed === "2") {
        bot(generalRefundInfo());
        askAnythingElse();
      } else if (trimmed === "3") {
        printMainMenu();
        currentState = STATE.MAIN_MENU;
      } else {
        bot("Please enter 1, 2 or 3.");
      }
      break;
    }

    // ── Return eligibility lookup ─────────────────────────────────────────────
    case STATE.RETURNS_ASK_ID: {
      const order = findOrder(trimmed);
      if (!order) {
        bot(
          `I couldn't find an order matching "${trimmed}".\n` +
            "Please check the ID and try again."
        );
      } else {
        bot(
          `Order found: ${order.orderId}\n` +
            `Items: ${order.items.join(", ")}\n\n` +
            buildReturnMessage(order)
        );
        askAnythingElse();
      }
      break;
    }

    default:
      break;
  }
}

// Handled as its own named case to keep the switch readable
function handleAnythingElse(input) {
  if (input.trim() === "1") {
    printMainMenu();
    currentState = STATE.MAIN_MENU;
  } else {
    bot("Thanks for contacting Northstar support. Goodbye! 👋");
    currentState = STATE.DONE;
  }
}

function askAnythingElse() {
  bot("Is there anything else I can help you with? [1] Yes  [0] No");
  currentState = STATE.ANYTHING_ELSE;
}

// ─── Main dispatcher ──────────────────────────────────────────────────────────
function dispatch(input) {
  if (currentState === STATE.ANYTHING_ELSE) {
    handleAnythingElse(input);
  } else {
    handleInput(input);
  }
}

// ─── Entry point ──────────────────────────────────────────────────────────────
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "  You: ",
});

print("\n" + DIVIDER);
print("  NORTHSTAR RETAIL CO. — SUPPORT DEFLECTION MVP");
print("  Ticket categories: Order Status | Returns & Refunds");
print(DIVIDER);
printMainMenu();
rl.prompt();

rl.on("line", (line) => {
  dispatch(line);
  if (currentState === STATE.DONE) {
    rl.close();
  } else {
    rl.prompt();
  }
});

rl.on("close", () => {
  process.exit(0);
});
