# Stripe Testing Guide

How to test Stripe payments in the Electro Store project using **Stripe test mode**.

> **Important:** Never use real card numbers. All values below only work in Stripe's test environment (`sk_test_...` keys).

---

## 1. Prerequisites

| Requirement | How to get it |
|---|---|
| **Stripe test API keys** | [Dashboard → Developers → API keys](https://dashboard.stripe.com/test/apikeys) |
| **Stripe CLI** (for webhooks) | [Install guide](https://docs.stripe.com/stripe-cli) |
| **Backend `.env` configured** | `STRIPE_SECRET_KEY=sk_test_...` and `STRIPE_WEBHOOK_SECRET=whsec_...` |

---

## 2. Test Card Numbers

### Successful Payments

| Card Number | Brand | Use Case |
|---|---|---|
| `4242 4242 4242 4242` | Visa | **Standard success** — always succeeds |
| `5555 5555 5555 4444` | Mastercard | Standard success |
| `3782 822463 10005` | Amex | Standard success |

For all of these, use:
- **Expiry:** any future date, e.g. `12/30`
- **CVC:** any 3 digits, e.g. `123` (Amex: 4 digits, e.g. `1234`)
- **ZIP:** any 5 digits, e.g. `10001`

**Expected result:**
- PaymentIntent status → `succeeded`
- Webhook event → `payment_intent.succeeded`
- Order status → `PAID`

---

### Failed Payments

| Card Number | Brand | Failure Reason |
|---|---|---|
| `4000 0000 0000 0002` | Visa | **Card declined** (generic) |
| `4000 0000 0000 9995` | Visa | Insufficient funds |
| `4000 0000 0000 9987` | Visa | Lost card |
| `4000 0000 0000 0069` | Visa | Expired card |

**Expected result:**
- PaymentIntent status → `requires_payment_method`
- Webhook event → `payment_intent.payment_failed`
- Order status → stays `PENDING`

---

### 3D Secure (3DS) Authentication

| Card Number | Behaviour |
|---|---|
| `4000 0025 0000 3155` | **Requires 3DS** — pops up an authentication modal. Always succeeds after user clicks "Complete". |
| `4000 0000 0000 3220` | **Requires 3DS** — always succeeds after authentication. |
| `4000 0084 0000 1629` | **Requires 3DS** — authentication **fails** (user cannot complete). |

**Expected result (after successful 3DS):**
- PaymentIntent status → `succeeded`
- Webhook event → `payment_intent.succeeded`
- Order status → `PAID`

**Expected result (after failed 3DS):**
- PaymentIntent status → `requires_payment_method`
- Webhook event → `payment_intent.payment_failed`
- Order status → stays `PENDING`

---

## 3. Testing with Stripe Elements (Frontend)

Stripe Elements is already integrated in the checkout flow. Here's how to test end-to-end:

### Step-by-step

1. **Start the app**
   ```bash
   docker compose up          # or start frontend + backend individually
   ```

2. **Create an order**
   - Add products to your cart and proceed to checkout.
   - This creates an order with status `PENDING`.

3. **Enter a test card**
   - On the checkout payment form, type one of the test card numbers above.
   - Use any future expiry (e.g. `12/30`), any CVC (e.g. `123`), and any ZIP (e.g. `10001`).

4. **Submit payment**
   - Click the Pay button.
   - For 3DS cards, a Stripe authentication modal will appear — click **Complete** or **Fail** depending on your test case.

5. **Check the result**
   - **Frontend:** You should be redirected to the order confirmation page. The `OrderStatusBadge` shows `Paid` (green) or stays `Pending` (yellow) on failure.
   - **Backend logs:** Look for the webhook log lines (see section 5 below).
   - **Stripe Dashboard:** Go to [Payments → Test mode](https://dashboard.stripe.com/test/payments) and find the PaymentIntent.

---

## 4. Testing Webhooks Locally

Stripe can't reach `localhost` by default. Use the Stripe CLI to forward events:

### Setup

```bash
# 1. Login (one time)
stripe login

# 2. Forward events to your local backend
stripe listen --forward-to http://localhost:3000/payments/webhook
```

The CLI will print a **webhook signing secret**:
```
> Ready! Your webhook signing secret is whsec_abc123...
```

Copy it into your backend `.env`:
```dotenv
STRIPE_WEBHOOK_SECRET=whsec_abc123...
```

Restart the backend so it picks up the new secret.

### Trigger test events manually (without the frontend)

```bash
# Successful payment
stripe trigger payment_intent.succeeded

# Failed payment
stripe trigger payment_intent.payment_failed
```

These send synthetic events directly to your webhook endpoint.

---

## 5. What to Look For in Logs

After the webhook fires, your backend logs should show three structured lines per event:

```
[PaymentsService] [Webhook Received]      eventId=evt_xxx eventType=payment_intent.succeeded paymentIntentId=pi_xxx paymentIntentStatus=succeeded orderId=abc-123
[PaymentsService] [Webhook Before Handle]  eventId=evt_xxx eventType=payment_intent.succeeded paymentIntentId=pi_xxx paymentIntentStatus=succeeded orderId=abc-123
[PaymentsService] [Webhook After Handle]   eventId=evt_xxx eventType=payment_intent.succeeded paymentIntentId=pi_xxx paymentIntentStatus=succeeded orderId=abc-123 result=success
```

| Log line | Meaning |
|---|---|
| `[Webhook Received]` | Stripe's event arrived and passed signature verification |
| `[Webhook Before Handle]` | The handler identified the event type and is about to process it |
| `[Webhook After Handle]` | Processing completed. `result=success` means the order was updated |

---

## 6. Quick-Reference: Card → Status → Event → Order

| Card | PaymentIntent Status | Webhook Event | Order Status |
|---|---|---|---|
| `4242 4242 4242 4242` | `succeeded` | `payment_intent.succeeded` | `PAID` ✅ |
| `4000 0000 0000 0002` | `requires_payment_method` | `payment_intent.payment_failed` | `PENDING` ⏳ |
| `4000 0025 0000 3155` (3DS pass) | `succeeded` | `payment_intent.succeeded` | `PAID` ✅ |
| `4000 0084 0000 1629` (3DS fail) | `requires_payment_method` | `payment_intent.payment_failed` | `PENDING` ⏳ |

---

## 7. Common Pitfalls

| Problem | Solution |
|---|---|
| Webhook returns 400 "Invalid signature" | Make sure `STRIPE_WEBHOOK_SECRET` matches the value printed by `stripe listen`. Restart backend after changing it. |
| Order stays `PENDING` after successful card | Check that `stripe listen` is running and forwarding to the correct port. Also try the `/payments/verify/:orderId` endpoint as a fallback. |
| 3DS modal doesn't appear | You're using a non-3DS test card. Switch to `4000 0025 0000 3155`. |
| "STRIPE_SECRET_KEY not set" warning | Add `STRIPE_SECRET_KEY=sk_test_...` to `backend/.env` and restart. |

---

## Further Reading

- [Stripe Testing Docs](https://docs.stripe.com/testing)
- [Full list of test cards](https://docs.stripe.com/testing#cards)
- [Stripe CLI reference](https://docs.stripe.com/cli)
- [Webhook event types](https://docs.stripe.com/api/events/types)
