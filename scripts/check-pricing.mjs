// node scripts/check-pricing.mjs — asserts for lib/pricing.ts and lib/discounts.ts (jiti comes with tailwindcss).
import assert from "node:assert/strict"
import { fileURLToPath } from "node:url"
import createJiti from "jiti"

const root = fileURLToPath(new URL("..", import.meta.url))
const load = createJiti(import.meta.url, { alias: { "@": root } })
const { countRentalDays, getActiveDiscount, calculateTotalPrice } = load("../lib/pricing.ts")
const { discountRulesSchema } = load("../lib/discounts.ts")

// The shape every client sends must validate; the old { percent } shape must not.
assert.ok(discountRulesSchema.safeParse([{ minDays: 7, discountPercent: 20 }]).success)
assert.ok(!discountRulesSchema.safeParse([{ minDays: 7, percent: 20 }]).success)
assert.ok(!discountRulesSchema.safeParse([{ minDays: 7, discountPercent: 95 }]).success)
assert.ok(!discountRulesSchema.safeParse("nope").success)

// Local midnights across both DST switches in Poland still count whole days.
assert.equal(countRentalDays(new Date("2026-10-24T00:00:00+02:00"), new Date("2026-10-26T00:00:00+01:00")), 2)
assert.equal(countRentalDays(new Date("2026-03-28T00:00:00+01:00"), new Date("2026-03-30T00:00:00+02:00")), 2)

const rules = [{ minDays: 3, discountPercent: 10 }, { minDays: 7, discountPercent: 20 }]
assert.deepEqual(getActiveDiscount(rules, 7), { minDays: 7, discountPercent: 20 })
assert.deepEqual(getActiveDiscount(rules, 5), { minDays: 3, discountPercent: 10 })
assert.equal(getActiveDiscount(rules, 2), null)
assert.equal(getActiveDiscount(null, 7), null)
assert.equal(getActiveDiscount([{ minDays: 1, discountPercent: 150 }, { foo: 1 }], 7), null)
// Old editor saved NaN as null; it must not become a 0-day rule that discounts every stay.
assert.equal(getActiveDiscount([{ minDays: null, discountPercent: 30 }], 1), null)
assert.deepEqual(getActiveDiscount([{ minDays: 3, discountPercent: 10 }, { minDays: 7, discountPercent: null }], 7), { minDays: 3, discountPercent: 10 })

assert.equal(calculateTotalPrice(100, 7, rules), 560)
assert.equal(calculateTotalPrice(99.99, 3, rules), 269.97)
assert.equal(calculateTotalPrice(100, 2, rules), 200)
assert.equal(calculateTotalPrice(100, 2, []), 200)

console.log("pricing ok")
