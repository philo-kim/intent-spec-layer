# LLM Codegen Simulation Results

| Method | Passed | Failed tests |
|---|---:|---|
| prd | 2/15 | T02, T03, T04, T05, T06, T07, T08, T09, T10, T12, T13, T14, T15 |
| bdd | 5/15 | T03, T04, T07, T08, T09, T10, T12, T13, T14, T15 |
| ears-only | 11/15 | T12, T13, T14, T15 |
| domain-ears | 12/15 | T12, T13, T14 |
| full-spec-layer | 15/15 | - |

## Details

### prd

- Implements the happy-path PRD: create order, apply coupon before checkout, confirm on payment, cancel by status.
- Leaves unspecified behavior to simple defaults.

- PASS T01: valid coupon discounts total
- FAIL T02: already-used coupon is rejected - Expected operation to throw.
- FAIL T03: only one coupon can be applied - Expected operation to throw.
- FAIL T04: item removal below minimum detaches coupon - Expected values to be strictly equal:
+ actual - expected

+ {
+   coupon_id: 'coupon-10',
+   discount: 10,
+   expires_at: '2026-12-31T00:00:00Z',
+   min_amount: 50,
+   used: false
+ }
- null

- FAIL T05: cancel restores coupon to unused - Expected values to be strictly equal:

true !== false

- FAIL T06: cancelled order cannot be confirmed - Expected operation to throw.
- FAIL T07: discount cannot make total negative - Expected values to be strictly equal:

-40 !== 0

- FAIL T08: coupon mutation only while draft - Expected operation to throw.
- FAIL T09: expired coupon is rejected - Expected operation to throw.
- FAIL T10: minimum order amount is enforced on apply - Expected operation to throw.
- PASS T11: successful payment confirms order
- FAIL T12: partial inventory failure rolls back successful reservations - Expected operation to throw.
- FAIL T13: payment failure rolls back reservations - Expected values to be strictly deep-equal:
+ actual - expected

+ []
- [
-   'line-a'
- ]

- FAIL T14: confirm idempotency prevents double charge and reservation - Expected values to be strictly deep-equal:
+ actual - expected

+ []
- [
-   'line-a'
- ]

- FAIL T15: canonical terms are represented - Expected values to be strictly deep-equal:
+ actual - expected

+ []
- [
-   'account_id',
-   'order_id',
-   'coupon_id',
-   'line_item_id',
-   'total_amount'
- ]


### bdd

- Implements the explicit scenarios in the BDD file.
- Does not add behavior for scenarios that were not written.

- PASS T01: valid coupon discounts total
- PASS T02: already-used coupon is rejected
- FAIL T03: only one coupon can be applied - Expected operation to throw.
- FAIL T04: item removal below minimum detaches coupon - Expected values to be strictly equal:
+ actual - expected

+ {
+   coupon_id: 'coupon-10',
+   discount: 10,
+   expires_at: '2026-12-31T00:00:00Z',
+   min_amount: 50,
+   used: false
+ }
- null

- PASS T05: cancel restores coupon to unused
- PASS T06: cancelled order cannot be confirmed
- FAIL T07: discount cannot make total negative - Expected values to be strictly equal:

-40 !== 0

- FAIL T08: coupon mutation only while draft - Expected operation to throw.
- FAIL T09: expired coupon is rejected - Expected operation to throw.
- FAIL T10: minimum order amount is enforced on apply - Expected operation to throw.
- PASS T11: successful payment confirms order
- FAIL T12: partial inventory failure rolls back successful reservations - Expected operation to throw.
- FAIL T13: payment failure rolls back reservations - Expected values to be strictly deep-equal:
+ actual - expected

+ []
- [
-   'line-a'
- ]

- FAIL T14: confirm idempotency prevents double charge and reservation - Expected values to be strictly deep-equal:
+ actual - expected

+ []
- [
-   'line-a'
- ]

- FAIL T15: canonical terms are represented - Expected values to be strictly deep-equal:
+ actual - expected

+ []
- [
-   'account_id',
-   'order_id',
-   'coupon_id',
-   'line_item_id',
-   'total_amount'
- ]


### ears-only

- Implements explicit EARS behavior requirements.
- No domain vocabulary map or interface rollback contract is present.

- PASS T01: valid coupon discounts total
- PASS T02: already-used coupon is rejected
- PASS T03: only one coupon can be applied
- PASS T04: item removal below minimum detaches coupon
- PASS T05: cancel restores coupon to unused
- PASS T06: cancelled order cannot be confirmed
- PASS T07: discount cannot make total negative
- PASS T08: coupon mutation only while draft
- PASS T09: expired coupon is rejected
- PASS T10: minimum order amount is enforced on apply
- PASS T11: successful payment confirms order
- FAIL T12: partial inventory failure rolls back successful reservations - Expected operation to throw.
- FAIL T13: payment failure rolls back reservations - Expected values to be strictly deep-equal:
+ actual - expected

+ []
- [
-   'line-a'
- ]

- FAIL T14: confirm idempotency prevents double charge and reservation - Expected values to be strictly deep-equal:
+ actual - expected

+ []
- [
-   'line-a'
- ]

- FAIL T15: canonical terms are represented - Expected values to be strictly deep-equal:
+ actual - expected

+ []
- [
-   'account_id',
-   'order_id',
-   'coupon_id',
-   'line_item_id',
-   'total_amount'
- ]


### domain-ears

- Implements domain vocabulary and EARS behavior.
- Does not include the Layer 3 interface contract for rollback/idempotency.

- PASS T01: valid coupon discounts total
- PASS T02: already-used coupon is rejected
- PASS T03: only one coupon can be applied
- PASS T04: item removal below minimum detaches coupon
- PASS T05: cancel restores coupon to unused
- PASS T06: cancelled order cannot be confirmed
- PASS T07: discount cannot make total negative
- PASS T08: coupon mutation only while draft
- PASS T09: expired coupon is rejected
- PASS T10: minimum order amount is enforced on apply
- PASS T11: successful payment confirms order
- FAIL T12: partial inventory failure rolls back successful reservations - Expected values to be strictly deep-equal:
+ actual - expected

+ []
- [
-   'line-a'
- ]

- FAIL T13: payment failure rolls back reservations - Expected values to be strictly deep-equal:
+ actual - expected

+ []
- [
-   'line-a'
- ]

- FAIL T14: confirm idempotency prevents double charge and reservation - Expected values to be strictly deep-equal:
+ actual - expected

  [
    'line-a',
+   'line-a'
  ]

- PASS T15: canonical terms are represented

### full-spec-layer

- Implements the full spec layer: constitution, domain truth, EARS behavior, and Layer 3 contract.
- Tracks successful reservations for exact rollback and uses idempotency keys.

- PASS T01: valid coupon discounts total
- PASS T02: already-used coupon is rejected
- PASS T03: only one coupon can be applied
- PASS T04: item removal below minimum detaches coupon
- PASS T05: cancel restores coupon to unused
- PASS T06: cancelled order cannot be confirmed
- PASS T07: discount cannot make total negative
- PASS T08: coupon mutation only while draft
- PASS T09: expired coupon is rejected
- PASS T10: minimum order amount is enforced on apply
- PASS T11: successful payment confirms order
- PASS T12: partial inventory failure rolls back successful reservations
- PASS T13: payment failure rolls back reservations
- PASS T14: confirm idempotency prevents double charge and reservation
- PASS T15: canonical terms are represented
