#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const implementationsDir = path.join(here, "implementations");
const resultsJson = path.join(here, "results.json");
const resultsMd = path.join(here, "results.md");

function seed(system, options = {}) {
  system.createCoupon({
    coupon_id: "coupon-10",
    discount: 10,
    min_amount: 50,
    expires_at: "2026-12-31T00:00:00Z",
    used: false,
  });
  system.createCoupon({
    coupon_id: "coupon-used",
    discount: 10,
    min_amount: 50,
    expires_at: "2026-12-31T00:00:00Z",
    used: true,
  });
  system.createCoupon({
    coupon_id: "coupon-expired",
    discount: 10,
    min_amount: 50,
    expires_at: "2020-01-01T00:00:00Z",
    used: false,
  });
  system.createCoupon({
    coupon_id: "coupon-big",
    discount: 100,
    min_amount: 1,
    expires_at: "2026-12-31T00:00:00Z",
    used: false,
  });
  system.createOrder({ order_id: options.order_id ?? "order-1", account_id: "account-1" });
  system.addItem(options.order_id ?? "order-1", {
    line_item_id: "line-a",
    price: 60,
    quantity: 1,
  });
}

function expectThrows(fn) {
  try {
    fn();
  } catch {
    return;
  }
  throw new Error("Expected operation to throw.");
}

const tests = [
  {
    id: "T01",
    name: "valid coupon discounts total",
    run(system) {
      seed(system);
      system.applyCoupon("order-1", "coupon-10");
      assert.equal(system.getOrder("order-1").total_amount, 50);
    },
  },
  {
    id: "T02",
    name: "already-used coupon is rejected",
    run(system) {
      seed(system);
      expectThrows(() => system.applyCoupon("order-1", "coupon-used"));
    },
  },
  {
    id: "T03",
    name: "only one coupon can be applied",
    run(system) {
      seed(system);
      system.applyCoupon("order-1", "coupon-10");
      system.createCoupon({
        coupon_id: "coupon-20",
        discount: 20,
        min_amount: 50,
        expires_at: "2026-12-31T00:00:00Z",
        used: false,
      });
      expectThrows(() => system.applyCoupon("order-1", "coupon-20"));
    },
  },
  {
    id: "T04",
    name: "item removal below minimum detaches coupon",
    run(system) {
      seed(system);
      system.addItem("order-1", { line_item_id: "line-b", price: 10, quantity: 1 });
      system.applyCoupon("order-1", "coupon-10");
      system.removeItem("order-1", "line-a");
      assert.equal(system.getOrder("order-1").coupon, null);
    },
  },
  {
    id: "T05",
    name: "cancel restores coupon to unused",
    run(system) {
      seed(system);
      system.applyCoupon("order-1", "coupon-10");
      system.confirmOrder("order-1", { paymentSucceeds: true });
      assert.equal(system.getCoupon("coupon-10").used, true);
      system.cancelOrder("order-1");
      assert.equal(system.getCoupon("coupon-10").used, false);
    },
  },
  {
    id: "T06",
    name: "cancelled order cannot be confirmed",
    run(system) {
      seed(system);
      system.cancelOrder("order-1");
      expectThrows(() => system.confirmOrder("order-1", { paymentSucceeds: true }));
    },
  },
  {
    id: "T07",
    name: "discount cannot make total negative",
    run(system) {
      seed(system);
      system.applyCoupon("order-1", "coupon-big");
      assert.equal(system.getOrder("order-1").total_amount, 0);
    },
  },
  {
    id: "T08",
    name: "coupon mutation only while draft",
    run(system) {
      seed(system);
      system.confirmOrder("order-1", { paymentSucceeds: true });
      expectThrows(() => system.applyCoupon("order-1", "coupon-10"));
    },
  },
  {
    id: "T09",
    name: "expired coupon is rejected",
    run(system) {
      seed(system);
      expectThrows(() => system.applyCoupon("order-1", "coupon-expired"));
    },
  },
  {
    id: "T10",
    name: "minimum order amount is enforced on apply",
    run(system) {
      system.createCoupon({
        coupon_id: "coupon-10",
        discount: 10,
        min_amount: 50,
        expires_at: "2026-12-31T00:00:00Z",
        used: false,
      });
      system.createOrder({ order_id: "order-1", account_id: "account-1" });
      system.addItem("order-1", { line_item_id: "line-a", price: 20, quantity: 1 });
      expectThrows(() => system.applyCoupon("order-1", "coupon-10"));
    },
  },
  {
    id: "T11",
    name: "successful payment confirms order",
    run(system) {
      seed(system);
      system.confirmOrder("order-1", { paymentSucceeds: true });
      assert.equal(system.getOrder("order-1").status, "confirmed");
    },
  },
  {
    id: "T12",
    name: "partial inventory failure rolls back successful reservations",
    run(system) {
      seed(system);
      system.addItem("order-1", { line_item_id: "line-b", price: 20, quantity: 1 });
      expectThrows(() =>
        system.confirmOrder("order-1", {
          paymentSucceeds: true,
          inventoryPlan: { failOn: "line-b" },
        }),
      );
      assert.deepEqual(system.inventory.reservations, ["line-a"]);
      assert.deepEqual(system.inventory.releases, ["line-a"]);
      assert.equal(system.getOrder("order-1").status, "draft");
    },
  },
  {
    id: "T13",
    name: "payment failure rolls back reservations",
    run(system) {
      seed(system);
      expectThrows(() =>
        system.confirmOrder("order-1", {
          paymentSucceeds: false,
          inventoryPlan: {},
        }),
      );
      assert.deepEqual(system.inventory.reservations, ["line-a"]);
      assert.deepEqual(system.inventory.releases, ["line-a"]);
      assert.equal(system.inventory.charges.length, 0);
    },
  },
  {
    id: "T14",
    name: "confirm idempotency prevents double charge and reservation",
    run(system) {
      seed(system);
      system.confirmOrder("order-1", { paymentSucceeds: true, idempotency_key: "idem-1" });
      system.confirmOrder("order-1", { paymentSucceeds: true, idempotency_key: "idem-1" });
      assert.deepEqual(system.inventory.reservations, ["line-a"]);
      assert.deepEqual(system.inventory.charges, ["order-1"]);
    },
  },
  {
    id: "T15",
    name: "canonical terms are represented",
    run(system) {
      const requiredTerms = ["account_id", "order_id", "coupon_id", "line_item_id", "total_amount"];
      assert.deepEqual(system.terms, requiredTerms);
    },
  },
];

async function loadImplementations() {
  const files = fs
    .readdirSync(implementationsDir)
    .filter((file) => /^\d+-.+\.mjs$/.test(file))
    .sort();
  const modules = [];
  for (const file of files) {
    modules.push({
      file,
      ...(await import(pathToFileURL(path.join(implementationsDir, file)).href)),
    });
  }
  return modules;
}

function runTest(module, test) {
  const system = module.createSystem();
  try {
    test.run(system);
    return { id: test.id, name: test.name, passed: true };
  } catch (error) {
    return {
      id: test.id,
      name: test.name,
      passed: false,
      error: error.message,
    };
  }
}

function markdownReport(results) {
  const lines = [];
  lines.push("# LLM Codegen Simulation Results");
  lines.push("");
  lines.push("| Method | Passed | Failed tests |");
  lines.push("|---|---:|---|");
  for (const result of results) {
    const failed = result.tests.filter((test) => !test.passed);
    lines.push(
      `| ${result.method} | ${result.passed}/${result.total} | ${failed.map((test) => test.id).join(", ") || "-"} |`,
    );
  }
  lines.push("");
  lines.push("## Details");
  lines.push("");
  for (const result of results) {
    lines.push(`### ${result.method}`);
    lines.push("");
    for (const note of result.notes) {
      lines.push(`- ${note}`);
    }
    lines.push("");
    for (const test of result.tests) {
      lines.push(
        `- ${test.passed ? "PASS" : "FAIL"} ${test.id}: ${test.name}${test.passed ? "" : ` - ${test.error}`}`,
      );
    }
    lines.push("");
  }
  return `${lines.join("\n").replace(/\n+$/u, "")}\n`;
}

const modules = await loadImplementations();
const results = modules.map((module) => {
  const testResults = tests.map((test) => runTest(module, test));
  return {
    method: module.method,
    file: module.file,
    notes: module.notes,
    passed: testResults.filter((test) => test.passed).length,
    total: testResults.length,
    tests: testResults,
  };
});

fs.writeFileSync(
  resultsJson,
  JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2),
);
fs.writeFileSync(resultsMd, markdownReport(results));

console.log(markdownReport(results));

const fullSpec = results.find((result) => result.method === "full-spec-layer");
if (!fullSpec || fullSpec.passed !== fullSpec.total) {
  console.error("Full Spec Layer implementation did not pass the simulation.");
  process.exit(1);
}
