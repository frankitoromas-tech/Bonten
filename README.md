# BONTEN_WEB

Plataforma oficial de la comunidad **BONTEN** — *Nuestra Resistencia*. Manifiestos doctrinales, biblioteca bioética, muro comunitario, foro de debates y asistencia cognitiva con **Wilfredo AI**.

---

## 🚀 Stack Tecnológico

- **Framework:** Next.js 16 (App Router + Turbopack) + React 19
- **Lenguaje:** TypeScript 5.x (modo estricto, cero errores de tipado)
- **Estilos & UI:** Tailwind CSS + Sistema de tokens y temas dinámicos (`src/index.css`)
- **Motor de IA:** WILFREDO AI (Copiloto Administrativo & Asistente Doctrinal Polímata)
- **Ciberseguridad:** Hardening OWASP Top 10, HMAC-SHA256, Rate Limiting y Edge Proxy
- **Despliegue:** Optimizado para **Vercel**

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

La plataforma cuenta con un perímetro de seguridad verificado contra ataques comunes en aplicaciones web:

1. **Defensa DoS L7 & Fuerza Bruta:** Ventana deslizante de 15 minutos por IP con bloqueo temporal (IP Jail).
2. **Protección de Carga Útil:** Límite estricto de bytes con `readLimitedJson` contra saturación de memoria.
3. **Firmas de Sesión HMAC-SHA256:** Huella digital de cliente (IP + User-Agent) para mitigar secuestro de sesión (*Cookie Replay*).
4. **Protección Anti-CSRF:** Validación obligatoria de cabeceras `Origin` y `Referer` en endpoints mutantes.
5. **Sanitización XSS:** Purificación rigurosa en consultas de IA, argumentos y publicaciones del Muro.
6. **Cabeceras HTTP Estrictas:** HSTS, CSP `frame-ancestors 'none'`, `X-Frame-Options: DENY` y `nosniff`.

---

## 👥 Comunidad & Asistencia Cognitiva

- **Pertenencia Automatizada:** Al registrarse o iniciar sesión en `/auth/login`, los usuarios quedan automáticamente adheridos al decálogo de honor y acreditados para intervenir en el Muro Comunitario (`/comunidad`).
- **WILFREDO AI:**
  - **Público (`/wilfredo`):** Polímata interactivo para orientación filosófica, bioética y debate.
  - **Administrativo (`/admin`):** Copiloto con comandos automatizados en 1 clic para bloqueo de amenazas, análisis de métricas y diagnóstico de producción.

---

## 💻 Comandos de Desarrollo y Validación

```bash
# Desarrollo local
npm run dev

# Compilación de producción optimizada
npm run build

# Comprobación estricta de tipos TypeScript
npm run typecheck

# Suite de pruebas automatizadas
node --test tests/*.test.mjs
```

---

## 🌐 Configuración de Entorno (Vercel)

Copie `.env.example` a `.env.local` y defina secretos de al menos 32 caracteres:

- `ADMIN_USER` / `ADMIN_PASS`: Credenciales maestras del Superadmin.
- `ADMIN_JWT_SECRET`: Llave criptográfica para firmas de sesión administrativa.
- `COMMUNITY_JWT_SECRET`: Llave criptográfica para tokens de miembros.
- `LUYO_INGEST_KEY`: Clave de integración segura para ingesta externa.

