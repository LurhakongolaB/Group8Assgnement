# Northstar Retail Co. — Support Deflection MVP
## Go-Live Readiness Note

**Date:** 2026-08-16  
**Team:** Group 8  
**Sprint:** Northstar Sprint (Week 1)

---

### What Works ✅
| Feature | Status |
|---|---|
| Order status lookup by Order ID | Working |
| Order status lookup by customer email | Working |
| Return eligibility check (30-day window rule) | Working |
| Refund timeline FAQ | Working |
| Human-agent escalation path | Working |
| Decision-tree navigation (numbered menus) | Working |

**Demo path (end-to-end):**
```
node src/chatbot.js
→ [1] Check order status → enter ORD-1001
→ [2] Returns & refunds  → [1] Start a return → enter ORD-1003
→ [2] Returns & refunds  → [2] Refund timeline
→ [3] Talk to a human agent
```

---

### Known Issues / Limitations ⚠️
| Issue | Impact | Suggested Fix Before GA |
|---|---|---|
| Order data is hard-coded JSON (`src/data/orders.json`) | Cannot look up real orders | Replace `findOrder()` with a call to Northstar's OMS REST API |
| No authentication — anyone can look up any order by ID | Privacy risk | Add email + order-ID pair validation before revealing order details |
| Return window is calculated from `estimatedDelivery`, not actual delivery scan | May be inaccurate by 1–2 days | Use a `actualDeliveryDate` field from the OMS API |
| No session logging | No deflection metrics | Add a lightweight log (append-only JSON or DB row) per conversation |
| CLI-only — runs in a terminal | Customers need terminal access | Wrap in an HTTP server (e.g. Express + WebSocket) or embed in Zendesk/Intercom |

---

### What Northstar's Team Needs to Pick This Up 🔧

1. **Install Node.js ≥ 18** on the host machine.
2. **Wire up the real OMS API:**  
   - Edit `src/orderService.js` — replace the JSON require with an `axios.get()` call to your orders endpoint.  
   - Add your API key to an `.env` file (never commit it).
3. **Deploy surface:** Decide whether to expose via HTTP (add `express`) or integrate into your existing support platform.
4. **Set `RETURN_WINDOW_DAYS`** in `src/returnsService.js` to match your actual policy.
5. **Run:** `node src/chatbot.js`

---

### Deflection Potential (estimate)
Based on Northstar's stated ticket mix:
- **Order Status** tickets → ~100% self-serve once OMS API is connected.
- **Returns & Refunds** FAQ → ~60–70% deflectable (edge cases still need human).

**Minimum 2 ticket categories covered** ✅ (Sprint requirement met)
