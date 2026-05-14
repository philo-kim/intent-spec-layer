# EARS Only: Coupon Orders

- [REQ-COUPON-001][Ubiquitous] The system shall allow at most one coupon on an
  order.
- [REQ-COUPON-002][Event-driven] When the user applies a coupon, the system
  shall validate expiry, used state, and minimum order amount.
- [REQ-COUPON-003][State-driven] While an order is draft, the system shall allow
  the user to apply coupon and remove coupon.
- [REQ-COUPON-004][Unwanted] If the user submits an already used coupon, then the
  system shall return a rejection error.
- [REQ-COUPON-005][Unwanted] If item removal makes the order below the minimum
  amount after coupon application, then the system shall detach the coupon and
  notify the user.
- [REQ-COUPON-006][Unwanted] If an order is cancelled, then the system shall
  restore the coupon to unused state.
- [REQ-COUPON-007][Unwanted] If a cancelled order is submitted for confirmation,
  then the system shall reject the transition.
- [REQ-COUPON-008][Unwanted] If a discount would make total amount negative, then
  the system shall set the payable total amount to zero and report the adjustment.
