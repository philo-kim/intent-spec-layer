import { SpecError, buildInventory, sumItems } from "./shared.mjs";

export const method = "bdd";
export const notes = [
  "Implements the explicit scenarios in the BDD file.",
  "Does not add behavior for scenarios that were not written.",
];

export function createSystem() {
  const orders = new Map();
  const coupons = new Map();
  const inventory = buildInventory();

  function total(order) {
    return sumItems(order.items) - (order.coupon ? order.coupon.discount : 0);
  }

  return {
    terms: [],
    inventory: inventory.stats,
    createCoupon(coupon) {
      coupons.set(coupon.coupon_id, { ...coupon });
    },
    createOrder({ order_id, account_id }) {
      const order = { order_id, account_id, status: "draft", items: [], coupon: null };
      orders.set(order_id, order);
      return order;
    },
    addItem(orderId, item) {
      orders.get(orderId).items.push({ quantity: 1, ...item });
    },
    removeItem(orderId, lineItemId) {
      const order = orders.get(orderId);
      order.items = order.items.filter((item) => item.line_item_id !== lineItemId);
    },
    applyCoupon(orderId, couponId) {
      const coupon = coupons.get(couponId);
      if (!coupon) {
        throw new SpecError("InvalidCoupon", "Invalid coupon.");
      }
      if (coupon.used) {
        throw new SpecError("CouponUsed", "Coupon is already used.");
      }
      orders.get(orderId).coupon = coupon;
    },
    confirmOrder(orderId, options = {}) {
      const order = orders.get(orderId);
      if (order.status === "cancelled") {
        throw new SpecError("InvalidTransition", "Cancelled order cannot be confirmed.");
      }
      if (options.paymentSucceeds === false) {
        throw new SpecError("PaymentFailed", "Payment failed.");
      }
      inventory.charge(orderId);
      order.status = "confirmed";
      if (order.coupon) {
        order.coupon.used = true;
      }
      return order;
    },
    cancelOrder(orderId) {
      const order = orders.get(orderId);
      order.status = "cancelled";
      if (order.coupon) {
        order.coupon.used = false;
      }
      return order;
    },
    getOrder(orderId) {
      const order = orders.get(orderId);
      return { ...order, total_amount: total(order) };
    },
    getCoupon(couponId) {
      return coupons.get(couponId);
    },
  };
}
