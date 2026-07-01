import type { MetadataRoute } from 'next';

// Genera /manifest.webmanifest (antes referenciado pero inexistente → 404).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BONTEN | Nuestra Resistencia',
    short_name: 'BONTEN',
    description: 'Nuestra Resistencia - manifiestos, biblioteca y debates de la comunidad BONTEN.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f4f6f9',
    theme_color: '#033266',
    lang: 'es',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/LOGO_BONTEN_V2.jpeg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'any',
      },
    ],
  };
}
