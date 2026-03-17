import { Listing, Reservation, User, Review } from "@prisma/client"

export type SafeListing = Omit<Listing, "createdAt" | "updatedAt"> & {
    createdAt: string
    updatedAt: string
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
