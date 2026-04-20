/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'res.cloudinary.com' },
            { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
            { protocol: 'http', hostname: 'localhost' },
            { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
            { protocol: 'https', hostname: '*.private.blob.vercel-storage.com' },
        ],
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' js.stripe.com",
                            "style-src 'self' 'unsafe-inline'",
                            "img-src 'self' data: blob: https:",
                            "font-src 'self' data:",
                            "connect-src 'self' nominatim.openstreetmap.org api.stripe.com *.supabase.co",
                            "frame-src js.stripe.com hooks.stripe.com",
                            "worker-src blob:",
                            "frame-ancestors 'none'",
                            "base-uri 'self'",
                            "form-action 'self'",
                            "object-src 'none'",
                        ].join('; '),
                    },
                ],
            },
        ]
    },
}

export default nextConfig
