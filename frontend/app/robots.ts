import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/settings', '/admin/'], // Hide private areas/admin
        },
        sitemap: 'https://exam-buddy-4h5n.vercel.app/sitemap.xml',
    }
}
