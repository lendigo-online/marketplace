export const PROMOTION_TIERS = [
    { days: 7,  pricePLN: 9.99,  label: "7 dni",  amountGrosze: 999 },
    { days: 14, pricePLN: 16.99, label: "14 dni", amountGrosze: 1699 },
    { days: 30, pricePLN: 29.99, label: "30 dni", amountGrosze: 2999 },
] as const

export type PromotionTier = typeof PROMOTION_TIERS[number]
