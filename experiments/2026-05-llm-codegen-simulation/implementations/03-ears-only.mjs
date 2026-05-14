import { SpecError, assertDraft, buildInventory, sumItems } from "./shared.mjs";

export const method = "ears-only";
export const notes = [
  "Implements explicit EARS behavior requirements.",
  "No domain vocabulary map or interface rollback contract is present.",
];

export function createSystem() {
  const orders = new Map();
  const coupons = new Map();
  const inventory = buildInventory();

  function rawTotal(order) {
    return sumItems(order.items);
  }

  function total(order) {
    return Math.max(0, rawTotal(order) - (order.coupon ? order.coupon.discount : 0));
  }

  function validateCoupon(order, coupon) {
    if (coupon.used) {
      throw new SpecError("CouponUsed", "Coupon is already used.");
    }
    if (coupon.expires_at && Date.parse(coupon.expires_at) < Date.parse("2026-05-15T00:00:00Z")) {
      throw new SpecError("CouponExpired", "Coupon is expired.");
    }
    if (rawTotal(order) < coupon.min_amount) {
      throw new SpecError("MinimumOrderAmount", "Order does not meet minimum amount.");
    }
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
      if (order.coupon && rawTotal(order) < order.coupon.min_amount) {
        order.coupon = null;
        order.last_notice = "Coupon removed because the minimum order amount is no longer met.";
      }
    },
    applyCoupon(orderId, couponId) {
      const order = orders.get(orderId);
      assertDraft(order);
      if (order.coupon) {
        throw new SpecError("CouponAlreadyApplied", "Only one coupon can be applied.");
      }
      const coupon = coupons.get(couponId);
      if (!coupon) {
        throw new SpecError("InvalidCoupon", "Invalid coupon.");
      }
      validateCoupon(order, coupon);
      order.coupon = coupon;
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
