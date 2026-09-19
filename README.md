# ⚡ BONTEN Web Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16%20App%20Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/Tests-36%20Passed-success?style=for-the-badge&logo=node.js&logoColor=white)](#comandos-de-desarrollo-y-validación)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel%20Edge-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

Plataforma comunitaria oficial **BONTEN** — *Nuestra Resistencia*. Portal interactivo de alto rendimiento que integra biblioteca bioética, foros de debates, muro comunitario y asistencia cognitiva autónoma mediante el motor de IA **Wilfredo AI**.

---

## 🚀 Stack Tecnológico

- **Framework:** Next.js 16 (App Router + Turbopack) + React 19
- **Lenguaje:** TypeScript 5.x (modo estricto, tipado estricto extremo)
- **Estilos & UI:** Tailwind CSS + Sistema de tokens y temas dinámicos (`src/index.css`) + Framer Motion
- **Motor de IA:** WILFREDO AI (Copiloto Administrativo & Asistente Doctrinal Polímata)
- **Ciberseguridad:** Hardening OWASP Top 10, HMAC-SHA256, Rate Limiting y Edge Proxy
- **Despliegue:** Optimizado para **Vercel Edge**

---

## 🏛️ Arquitectura del Proyecto

```
BONTEN_WEB/
├── docs/                   # Documentación técnica, académica y auditorías
│   ├── ARCHITECTURE.md     # Especificación de arquitectura general
│   ├── academic/           # Ensayos y tratados académicos preservados
│   └── security/           # Informes de auditoría y hardening
├── public/                 # Assets estáticos, logos y recursos multimedia
├── src/
│   ├── app/                # Rutas Next.js (Home, Integrantes, Debates, Comunidad, Admin, Wilfredo)
│   ├── components/         # Componentes organizados por dominio (debates, home, layout, ui)
│   ├── data/               # Modelos de datos y registros tipados
│   ├── lib/
│   │   ├── ai/             # Motor heurístico y semántico de Wilfredo AI
│   │   ├── auth/           # Adaptadores de seguridad y autenticación
│   │   ├── db/             # Almacenamiento transaccional de usuarios y debates
│   │   └── security/       # Módulos de ciberdefensa (WAF, rate limiter, sanitizers, CSRF)
│   ├── proxy.ts            # Edge Middleware perimetral de Next.js
│   └── types/              # Definiciones de tipos TypeScript compartidos
├── tests/                  # Suite de 36 pruebas automatizadas de seguridad y lógica
├── .env.example            # Plantilla de variables de entorno requeridas
├── next.config.mjs         # Configuración y cabeceras de producción OWASP
├── vercel.json             # Directivas perimetrales alineadas para Vercel
└── package.json            # Dependencias y scripts del proyecto
```

---

## 🛡️ Ciberdefensa & Gobernanza (BONTEN Defense)

La plataforma cuenta con un perímetro de seguridad verificado contra vectores de ataque web:

1. **Defensa DoS L7 & Fuerza Bruta:** Ventana deslizante de 15 minutos por IP con bloqueo temporal (IP Jail).
2. **Protección de Carga Útil:** Límite estricto de bytes con `readLimitedJson` contra ataques de consumo de memoria.
3. **Firmas de Sesión HMAC-SHA256:** Huella digital criptográfica de cliente (IP + User-Agent) para erradicar secuestro de sesión (*Cookie Replay*).
4. **Protección Anti-CSRF:** Validación obligatoria de cabeceras `Origin` y `Referer` en endpoints mutantes.
5. **Sanitización XSS:** Purificación rigurosa en consultas de IA, argumentos y publicaciones del Muro.
6. **Cabeceras HTTP Estrictas:** HSTS, CSP `frame-ancestors 'none'`, `X-Frame-Options: DENY` y `X-Content-Type-Options: nosniff`.

---

## 👥 Comunidad & Asistencia Cognitiva

- **Pertenencia Automatizada:** Al registrarse o iniciar sesión en `/auth/login`, los usuarios quedan acreditados para intervenir en el Muro Comunitario (`/comunidad`).
- **WILFREDO AI:**
  - **Público (`/wilfredo`):** Polímata interactivo para orientación filosófica, bioética y debate argumentativo.
  - **Administrativo (`/admin`):** Copiloto con comandos automatizados en 1 clic para bloqueo de amenazas, análisis de métricas y diagnóstico de producción.

---

## 💻 Comandos de Desarrollo y Validación

```bash
# Desarrollo local con Turbopack
npm run dev

# Compilación de producción optimizada
npm run build

# Comprobación estricta de tipos TypeScript (cero errores)
npm run typecheck

# Suite completa de pruebas automatizadas (36 pruebas)
npm run test:all

# Pruebas de seguridad perimetral
npm run test:security

# Pruebas de base de datos y comunidad
npm run test:community
```

---

## 🌐 Configuración de Entorno

Copie `.env.example` a `.env.local` y defina los secretos criptográficos:

- `ADMIN_USER` / `ADMIN_PASS`: Credenciales de acceso para consola Superadmin.
- `ADMIN_JWT_SECRET`: Firma criptográfica para tokens de administración.
- `COMMUNITY_JWT_SECRET`: Llave simétrica para autenticación de miembros comunitarios.
- `LUYO_INGEST_KEY`: Token de autenticación para microservicios de ingesta externa.

---

## 👨‍💻 Autor & Créditos
- **Desarrollador:** **Φραγκοσύνη / francus 🐦‍🔥** (Frank Emiliano Vargas Huamán)
- **GitHub:** [@frankitoromas-tech](https://github.com/frankitoromas-tech)
- **LinkedIn:** [Frank Emiliano Vargas](https://www.linkedin.com/in/frank-emiliano-vargas-huam%C3%A1n-6a010a378/)
