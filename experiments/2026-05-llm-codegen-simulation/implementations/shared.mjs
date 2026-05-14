export class SpecError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "SpecError";
    this.code = code;
  }
}

export function assertDraft(order) {
  if (order.status !== "draft") {
    throw new SpecError("InvalidState", "Order is not draft.");
  }
}

export function sumItems(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function buildInventory(plan = {}) {
  const stats = {
    reservations: [],
    releases: [],
    charges: [],
  };

  return {
    stats,
    reserve(lineItemId) {
      if (plan.failOn === lineItemId) {
        throw new SpecError("InventoryFailed", `Inventory failed for ${lineItemId}`);
      }
      stats.reservations.push(lineItemId);
    },
    release(lineItemId) {
      stats.releases.push(lineItemId);
    },
    charge(orderId) {
      if (plan.paymentFails) {
        throw new SpecError("PaymentFailed", `Payment failed for ${orderId}`);
      }
      stats.charges.push(orderId);
    },
  };
}
