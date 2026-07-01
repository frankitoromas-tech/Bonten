import type { MetadataRoute } from 'next';
import { MANIFIESTOS } from '@/data/manifiestos';

const BASE_URL = 'https://bonten-bice.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/integrantes`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/manifiestos`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/debates`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  const manifiestoRoutes: MetadataRoute.Sitemap = MANIFIESTOS.map((m) => ({
    url: `${BASE_URL}/manifiestos/${m.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...manifiestoRoutes];
}
