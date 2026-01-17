import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/settings', '/admin/'], // Hide private areas/admin
        },
        sitemap: 'https://exambuddy-ymor.onrender.com/sitemap.xml',
    }
}
