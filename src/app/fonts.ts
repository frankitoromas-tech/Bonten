import { Outfit, Bangers } from 'next/font/google';

// Fuentes auto-optimizadas por Next: se autoalojan (sin llamada a Google en
// runtime), eliminan el layout-shift y arreglan el fallo de carga de Bangers
// en móviles que provenía del @import CSS render-blocking.
export const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  variable: '--font-outfit',
  display: 'swap',
});

export const bangers = Bangers({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bangers',
  display: 'swap',
});
