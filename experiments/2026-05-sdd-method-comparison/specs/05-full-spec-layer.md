# Full Spec Layer: Coupon Orders

## Layer 0: Constitution

- The system must not invent local authority for payment, coupon ownership,
  account identity, or inventory state. The source of truth must be explicit.
- No speculative features are allowed without a requirement ID.
- Cross-resource mutation must define idempotency and partial failure behavior.

## Layer 1: Domain Truth

Canonical terms:

- `account_id`: central account identifier.
- `order_id`: order identifier.
- `coupon_id`: coupon identifier.
- `line_item_id`: order line item identifier.
- `total_amount`: computed payable order total.

Order states:

- `draft`
- `confirmed`
- `cancelled`

Invariants:

- An order has maximum one coupon.
- A cancelled order cannot be confirmed again.
- Coupon mutation is allowed only in draft state.
- `total_amount` must not be negative.

## Layer 2: Behavior Spec

- [REQ-COUPON-001][Ubiquitous] The system shall allow maximum one coupon on an
  `order_id`.
- [REQ-COUPON-002][Event-driven] When the user applies a `coupon_id`, the system
  shall validate expiry, used state, and minimum order amount.
- [REQ-COUPON-003][State-driven] While an order is `draft`, the system shall
  allow the user to apply coupon and remove coupon.
- [REQ-COUPON-004][Unwanted] If the user submits an already used coupon, then the
  system shall return a rejection error.
- [REQ-COUPON-005][Unwanted] If item removal makes `total_amount` fall below the
  minimum order amount after coupon application, then the system shall detach the
  coupon and notify the user.
- [REQ-COUPON-006][Unwanted] If an order is cancelled, then the system shall
  restore the coupon to unused state.
- [REQ-COUPON-007][Unwanted] If a `cancelled` order is submitted for
  confirmation, then the system shall reject the transition.
- [REQ-COUPON-008][Unwanted] If a discount would make `total_amount` negative,
  then the system shall set `total_amount` to zero and report the adjustment.
- [REQ-COUPON-009][Optional] Where a premium entitlement is present, the system
  shall apply the premium discount after coupon validation.

## Layer 3: Interface Contract

### Contract: OrderOrchestrator.confirm

Ordering:

1. Validate `account_id`, `order_id`, state, coupon, and `total_amount`.
2. Reserve inventory per `line_item_id`.
3. Track each successful reservation in `reserved_items`.
4. Charge payment.
5. Mark order confirmed.

Idempotency:

- `confirm(order_id, idempotency_key)` is idempotent.
- Repeating the same key must not double-reserve inventory or double-charge.

Partial failure:

- If partial failure occurs during inventory reservation, rollback exactly the
  successful reservations already tracked in `reserved_items`.
- If payment fails after inventory reservation, rollback only the tracked
  successful reservations and return the payment error.
- Cancellation is idempotent and must restore only a coupon that is currently
  attached to the cancelled order.
