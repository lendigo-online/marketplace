import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
    }).format(price)
}
