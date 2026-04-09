import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const listings = await prisma.listing.findMany({
        where: { status: 'APPROVED' },
        select: { id: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
    })

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: 'https://www.lendigo.online/',
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 1,
        },
        {
            url: 'https://www.lendigo.online/jak-to-dziala',
            lastModified: new Date('2026-04-09'),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://www.lendigo.online/o-nas',
            lastModified: new Date('2026-04-09'),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: 'https://www.lendigo.online/faq',
            lastModified: new Date('2026-04-09'),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://www.lendigo.online/warunki',
            lastModified: new Date('2026-03-25'),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: 'https://www.lendigo.online/polityka',
            lastModified: new Date('2026-03-25'),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ]

    const listingPages: MetadataRoute.Sitemap = listings.map((listing) => ({
        url: `https://www.lendigo.online/listings/${listing.id}`,
        lastModified: listing.updatedAt,
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }))

    return [...staticPages, ...listingPages]
}
