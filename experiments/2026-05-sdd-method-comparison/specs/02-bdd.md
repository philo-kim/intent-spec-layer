# BDD: Coupon Orders

## Scenario: Apply a valid coupon

Given an order in draft state
And the coupon is valid
When the user applies the coupon
Then the order total amount is discounted

## Scenario: Reject an already used coupon

Given an order in draft state
And the coupon has already been used
When the user applies the coupon
Then the system returns an error

## Scenario: Confirm the order

Given an order in draft state
And payment succeeds
When the user confirms the order
Then the order becomes confirmed

## Scenario: Cancel the order

Given a confirmed order with a coupon
When the user cancels the order
Then the coupon is restored to unused state

## Scenario: Prevent a cancelled order from confirmation

Given a cancelled order
When the user confirms the order
Then the system rejects the transition
