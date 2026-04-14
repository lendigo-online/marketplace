import { Listing, Reservation, User, Review } from "@prisma/client"

export type DiscountRule = { minDays: number; discountPercent: number }

export type SafeListing = Omit<Listing, "createdAt" | "updatedAt" | "promotedUntil"> & {
    createdAt: string
    updatedAt: string
    promotedUntil: string | null
}

export type SafeReservation = Omit<
    Reservation,
    "createdAt" | "startDate" | "endDate"
> & {
    createdAt: string
    startDate: string
    endDate: string
    listing: SafeListing
}

export type SafeUser = Omit<
    User,
    "createdAt" | "updatedAt" | "emailVerified"
> & {
    createdAt: string
    updatedAt: string
    emailVerified: string | null
}

export type IncomingReservation = Omit<
    Reservation,
    "createdAt" | "startDate" | "endDate"
> & {
    createdAt: string
    startDate: string
    endDate: string
    listing: SafeListing
    user: {
        id: string
        name: string | null
        email: string | null
        image: string | null
    }
}
