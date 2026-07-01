# BONTEN_WEB

Sitio de la comunidad **BONTEN** — *Nuestra Resistencia*. Manifiestos, biblioteca documental y foro de debates.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** (estricto)
- **Tailwind CSS 3** + sistema de tokens CSS (`src/index.css`)
- Fuentes auto-optimizadas con `next/font` (Outfit + Bangers)
- Desplegado en **Vercel**

## Arquitectura

```
src/
  app/            Rutas (App Router): home, integrantes, manifiestos/[slug], debates
                  + metadata routes: manifest, sitemap, robots
                  + estados: loading, error, not-found
  components/     Componentes de UI (client/server) en .tsx
  data/           Fuente de datos tipada (members, library, debates, manifiestos)
  types/          Modelo de datos central compartido
  index.css       Design system: tokens, tema claro/oscuro, componentes
```

Los datos viven separados de la UI en `src/data`, tipados por `src/types`, para poder
conectarlos a un backend/CMS en el futuro sin tocar los componentes.

## Comandos

```bash
npm run dev        # desarrollo
npm run build      # build de producción
npm run start      # servir el build
npm run lint       # ESLint
npm run typecheck  # comprobación de tipos (tsc --noEmit)
```

## Temas

El tema (claro/oscuro) se controla con el atributo `data-theme` en `<html>`, se
persiste en `localStorage` y se aplica antes del primer pintado para evitar parpadeo.
