import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Met — A Tiny Love Story',
    short_name: 'Met',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'landscape',
    background_color: '#161426',
    theme_color: '#161426',
    icons: [{ src: '/assets/others/rose-item.png', sizes: 'any', type: 'image/png' }],
  };
}
