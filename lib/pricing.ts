import type { DiscountRule } from "@/types"

// Shared by ReservationSidebar and the API routes so the price shown is the price stored. Keep it free of server-only imports.
export const MAX_DISCOUNT_PERCENT = 90
const DAY_MS = 1000 * 60 * 60 * 24

// Rounded, not ceiled: dates are local midnights, so a DST change makes the gap 23h or 25h.
export function countRentalDays(start: Date, end: Date) {
    return Math.max(1, Math.round((end.getTime() - start.getTime()) / DAY_MS))
}

// Rule with the highest minDays the stay qualifies for. discountRules is stored as Json, so malformed entries are skipped.
export function getActiveDiscount(rules: unknown, days: number): DiscountRule | null {
    if (!Array.isArray(rules)) return null
    let best: DiscountRule | null = null
    for (const rule of rules) {
        const minDays = rule?.minDays
        const discountPercent = rule?.discountPercent
        // No Number() coercion: NaN inputs were saved as null, and Number(null) is 0, which would discount every stay.
        if (typeof minDays !== "number" || typeof discountPercent !== "number") continue
        if (!(minDays >= 1) || !(discountPercent > 0 && discountPercent <= MAX_DISCOUNT_PERCENT)) continue
        if (days >= minDays && (!best || minDays > best.minDays)) best = { minDays, discountPercent }
    }
    return best
}

export function calculateTotalPrice(pricePerDay: number, days: number, rules: unknown) {
    const base = pricePerDay * days
    const discount = getActiveDiscount(rules, days)
    const total = discount ? base * (1 - discount.discountPercent / 100) : base
    return Math.round(total * 100) / 100
}
