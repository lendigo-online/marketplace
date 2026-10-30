import { z } from "zod"
import { MAX_DISCOUNT_PERCENT } from "@/lib/pricing"

// Same shape as DiscountRule in types/index.ts — the create page, DiscountRulesEditor and ReservationSidebar all use discountPercent.
export const discountRuleSchema = z.object({
    minDays: z.number().int().min(1).max(365),
    discountPercent: z.number().min(0).max(MAX_DISCOUNT_PERCENT),
})

export const discountRulesSchema = z.array(discountRuleSchema).max(10)
