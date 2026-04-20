export { default } from "next-auth/middleware"

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/listings/create",
        "/reservations/:path*",
        "/admin/:path*",
    ]
}
