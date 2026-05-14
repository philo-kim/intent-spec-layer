# SDD Method Comparison Results

Case: `coupon-order-transaction`

| Method | Weighted score | Behavior | Unwanted | Vocabulary | Interface | Constitution | Traceability | Missing controls |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| prd | 0 | 0/4 | 0/4 | 0/1 | 0/3 | 0/1 | 0/1 | C01, C02, C03, C04, C05, C06, C07, C08, C09, C10, C11, C12, C13, C14 |
| bdd | 0.1 | 0/4 | 2/4 | 0/1 | 0/3 | 0/1 | 0/1 | C01, C02, C03, C05, C07, C08, C09, C10, C11, C12, C13, C14 |
| ears-only | 0.513 | 3/4 | 4/4 | 0/1 | 0/3 | 0/1 | 1/1 | C07, C09, C10, C11, C12, C13 |
| domain-ears | 0.75 | 4/4 | 4/4 | 1/1 | 0/3 | 0/1 | 1/1 | C10, C11, C12, C13 |
| full-spec-layer | 1 | 4/4 | 4/4 | 1/1 | 3/3 | 1/1 | 1/1 | - |

## Interpretation

- PRD-style prose leaves too many decisions implicit.
- BDD improves concrete scenarios but does not force systematic unwanted-behavior exploration.
- EARS improves edge-case coverage, especially when unwanted behavior is explicit.
- Domain Truth adds vocabulary stability and source-of-truth clarity.
- Interface Contracts are the decisive layer for idempotency and partial rollback.
- Layer 0 blocks convenient but invalid local shortcuts.

## Method Details

### prd

- File: `01-prd.md`
- Score: 0
- EARS patterns: -
- Layer markers: -
- Expected terms present: -
- Banned aliases present: -
- Missing controls: C01 (behavior), C02 (behavior), C03 (behavior), C04 (unwanted), C05 (unwanted), C06 (unwanted), C07 (behavior), C08 (unwanted), C09 (vocabulary), C10 (interface), C11 (interface), C12 (interface), C13 (constitution), C14 (traceability)

### bdd

- File: `02-bdd.md`
- Score: 0.1
- EARS patterns: -
- Layer markers: -
- Expected terms present: -
- Banned aliases present: -
- Missing controls: C01 (behavior), C02 (behavior), C03 (behavior), C05 (unwanted), C07 (behavior), C08 (unwanted), C09 (vocabulary), C10 (interface), C11 (interface), C12 (interface), C13 (constitution), C14 (traceability)

### ears-only

- File: `03-ears-only.md`
- Score: 0.513
- EARS patterns: [ubiquitous], [event-driven], [state-driven], [unwanted]
- Layer markers: -
- Expected terms present: -
- Banned aliases present: -
- Missing controls: C07 (behavior), C09 (vocabulary), C10 (interface), C11 (interface), C12 (interface), C13 (constitution)

### domain-ears

- File: `04-domain-ears.md`
- Score: 0.75
- EARS patterns: [ubiquitous], [event-driven], [state-driven], [unwanted]
- Layer markers: -
- Expected terms present: order_id, coupon_id, line_item_id, total_amount, account_id
- Banned aliases present: -
- Missing controls: C10 (interface), C11 (interface), C12 (interface), C13 (constitution)

### full-spec-layer

- File: `05-full-spec-layer.md`
- Score: 1
- EARS patterns: [ubiquitous], [event-driven], [state-driven], [unwanted], [optional]
- Layer markers: layer 0, layer 1, layer 2, layer 3
- Expected terms present: order_id, coupon_id, line_item_id, total_amount, account_id
- Banned aliases present: -
- Missing controls: -
