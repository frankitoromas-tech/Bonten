'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes/dist/index.js';

export function ThemeProvider({ children, ...props }: any) {
  return <NextThemesProvider attribute="data-theme" defaultTheme="system" enableSystem {...props}>{children}</NextThemesProvider>;
}
