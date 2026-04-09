import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/listings/create', '/api/', '/dashboard/', '/profil/', '/reservations/'],
            },
            {
                userAgent: ['GPTBot', 'ClaudeBot', 'OAI-SearchBot', 'PerplexityBot'],
                allow: '/',
            },
        ],
        sitemap: 'https://www.lendigo.online/sitemap.xml',
    }
}
