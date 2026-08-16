# Northstar Retail Co. — Support Deflection MVP

A Node.js-based CLI chatbot designed to handle customer support inquiries about order status, returns, and refunds. This MVP deflects common support tickets by providing automated, self-service information.

## Features

- ✅ **Order Status Lookup** — Check order status by Order ID
- ✅ **Email-based Lookup** — Find orders using customer email
- ✅ **Returns & Refunds** — Check return eligibility and refund timelines
- ✅ **FAQ Support** — Answer common questions about refund timelines
- ✅ **Human Escalation** — Seamless handoff to support agents
- ✅ **Decision-Tree Navigation** — Intuitive numbered menu system

## Quick Start

### Prerequisites
- Node.js ≥ 18
- npm

### Installation

```bash
npm install
```

### Running the Chatbot

```bash
npm start
```

This launches an interactive CLI session. Follow the numbered menu prompts to navigate the chatbot.

### Running Tests

```bash
npm test
```

Runs basic validation checks on order and returns services.

## Project Structure

```
.
├── README.md                      # This file
├── GO_LIVE_READINESS.md          # Deployment readiness checklist
├── package.json                   # Project dependencies & scripts
└── src/
    ├── chatbot.js                # Main entry point & decision-tree logic
    ├── orderService.js           # Order lookup and status building
    ├── returnsService.js         # Return eligibility & refund info
    └── data/
        └── orders.json           # Sample order data
```

## Usage Example

```
$ npm start

Welcome to Northstar Support
─────────────────────────────────

Main Menu
[1] Check order status
[2] Returns & refunds
[3] Talk to a human agent
[0] Exit

Enter choice: 1

Enter order ID (e.g., ORD-1001): ORD-1001

Order: ORD-1001
Status: shipped
Tracking: TRACK-123456
Estimated Delivery: 2026-08-20
```

## Known Limitations & Next Steps

| Issue | Workaround |
|-------|-----------|
| Order data is hard-coded JSON | Replace with real OMS API integration |
| No authentication/privacy checks | Add email + order ID validation |
| CLI-only interface | Wrap in HTTP server (Express) or integrate into Zendesk/Intercom |
| No session logging | Add lightweight logging for deflection metrics |
| Delivery date based on estimate | Use actual delivery scan data from OMS |

## Deployment Checklist

Before going live, complete the following:

1. **Replace hard-coded data** — Connect to Northstar's OMS REST API
   - Edit `src/orderService.js` to call your API endpoint
   - Store API credentials in `.env` file

2. **Add authentication** — Implement email + order ID pair validation

3. **Set return policy** — Update `RETURN_WINDOW_DAYS` in `src/returnsService.js`

4. **Choose deployment surface:**
   - Standalone CLI (current)
   - HTTP server with Express
   - Integration with Zendesk/Intercom

5. **Enable logging** — Add conversation tracking for metrics

6. **Test thoroughly** — Run `npm test` and verify all paths

## File Descriptions

- **chatbot.js** — Main CLI loop with state machine for decision-tree navigation
- **orderService.js** — Functions to find orders and build status messages
- **returnsService.js** — Return eligibility checking and refund timeline info
- **orders.json** — Sample order database (replace with API)

## License

ISC

## Author

Group 8 (LurhakongolaB)

## Repository

https://github.com/LurhakongolaB/Group8Assgnement

## Support

For issues or questions, please visit: https://github.com/LurhakongolaB/Group8Assgnement/issues
