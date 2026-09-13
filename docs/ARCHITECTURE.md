# 🏛️ BONTEN — Arquitectura de Software & Ciberseguridad

Manual de arquitectura técnica, separación por dominios y matriz de defensa perimetral para **BONTEN**.

---

## 📂 1. Árbol de Organización Limpia por Dominios

```
BONTEN_WEB/
├── docs/                               # Documentación de ingeniería y referencias enterprise
│   ├── security/
│   │   └── BontenSecurityConfig.java   # Referencia Spring Security 6 & Java 17
│   └── ARCHITECTURE.md                 # Este documento de arquitectura
├── src/
│   ├── app/                            # Next.js App Router (Rutas Públicas y Privadas)
│   │   ├── admin/                      # Zona Privada de Administración (Fireboy)
│   │   │   ├── login/                  # Portal de acceso seguro
│   │   │   ├── layout.tsx              # Shell de administración privada
│   │   │   └── page.tsx                # Dashboard de metadatos y biblioteca
│   │   ├── api/                        # API Routes seguras
│   │   │   ├── admin/                  # Endpoints protegidos (ROLE_SUPERADMIN)
│   │   │   │   ├── library/            # CRUD de biblioteca y manifiestos
│   │   │   │   ├── login/              # Autenticación administrativa con HttpOnly
│   │   │   │   ├── logout/             # Revocación de sesión
│   │   │   │   ├── metadata/           # Mutación de metadatos y perfil de Fireboy
│   │   │   │   └── security-stats/     # Telemetría de seguridad en tiempo real
│   │   │   ├── auth/                   # Autenticación de miembros de la comunidad
│   │   │   │   ├── forgot-password/    # Solicitud de restablecimiento (OWASP)
│   │   │   │   ├── login/              # Inicio de sesión de miembros
│   │   │   │   ├── logout/             # Cierre de sesión de miembros
│   │   │   │   ├── me/                 # Inspección de sesión activa
│   │   │   │   ├── register/           # Registro con PBKDF2
│   │   │   │   └── reset-password/     # Consumo atómico de token efímero
│   │   │   └── debates/                # API de debates
│   │   │       └── argument/           # Publicación protegida de argumentos
│   │   ├── auth/                       # Vistas públicas de autenticación comunitaria
│   │   │   ├── forgot-password/        # Interfaz de recuperación de clave
│   │   │   ├── login/                  # Interfaz de login para miembros
│   │   │   ├── register/               # Interfaz de registro
│   │   │   └── reset-password/         # Interfaz para ingresar nueva contraseña
│   │   ├── debates/                    # Módulo público de debates doctrinales
│   │   ├── integrantes/                # Fichas biográficas y ensayos de la directiva
│   │   ├── manifiestos/                # Sección doctrinal (Bloque Provida)
│   │   ├── layout.tsx                  # Layout raíz con dock de navegación
│   │   └── page.tsx                    # Landing page inmersiva 3D
│   ├── components/                     # Componentes ordenados estrictamente por dominios
│   │   ├── admin/                      # Componentes de gestión (/admin)
│   │   │   ├── AdminDashboard.tsx      # Tablero con pestañas dinámicas
│   │   │   ├── LibraryEditor.tsx       # CRUD interactivo de biblioteca
│   │   │   ├── MetadataEditor.tsx      # Formulario de branding y redes de Fireboy
│   │   │   └── SecurityMonitor.tsx     # Telemetría de bloqueos y auditoría WAF
│   │   ├── debates/                    # Componentes del foro de debates
│   │   │   ├── ArgumentBubble.tsx      # Burbuja de opinión y reacciones
│   │   │   ├── ArgumentForm.tsx        # Formulario protegido (gated para miembros)
│   │   │   ├── DebateCard.tsx          # Tarjeta de debate
│   │   │   ├── DebateDetail.tsx        # Vista detallada de argumentos
│   │   │   ├── DebateFilterBar.tsx     # Barra de filtros por temática
│   │   │   ├── Debates.tsx             # Contenedor principal de debates
│   │   │   └── useDebatesState.ts      # Hook de estado desacoplado
│   │   ├── home/                       # Componentes de la página de inicio
│   │   │   ├── CommunityBanner.tsx     # Banner de llamado a la comunidad
│   │   │   └── Hero.tsx                # Hero con 3D Tilt y quick hubs
│   │   ├── integrantes/                # Componentes de la directiva
│   │   │   ├── IntegranteHero.tsx      # Cabecera con badges y botón compartir
│   │   │   ├── IntegranteNavFooter.tsx # Navegación entre miembros
│   │   │   ├── IntegrantePublication.tsx # Lector de ensayo socrático con escalador A/A+
│   │   │   ├── IntegranteStats.tsx     # Estadísticas del perfil
│   │   │   ├── MemberCard.tsx          # Tarjeta de miembro individual
│   │   │   ├── Members.tsx             # Cuadrícula de líderes y directiva
│   │   │   ├── ProfileModal.tsx        # Modal de perfil detallado
│   │   │   └── useMembersState.ts      # Hook de integrantes
│   │   ├── layout/                     # Shell y experiencia sensorial
│   │   │   ├── AudioController.tsx     # Generador háptico con Web Audio API
│   │   │   ├── BackToTop.tsx           # Botón de retorno con anillo SVG circular
│   │   │   ├── Breadcrumbs.tsx         # Migas de pan de navegación
│   │   │   ├── CursorSpotlight.tsx     # Aura de iluminación reactiva al cursor
│   │   │   ├── DocumentReaderModal.tsx # Lector inmersivo de biblioteca
│   │   │   ├── Footer.tsx              # Pie de página (Bloque Provida)
│   │   │   ├── Interactive3DBackground.tsx # Canvas 3D de constelaciones
│   │   │   ├── Navbar.tsx              # Dock de navegación en 3 columnas
│   │   │   ├── QuickSearch.tsx         # Command Palette (Ctrl+K)
│   │   │   └── ThemeToggle.tsx         # Alternador de tema dark/light
│   │   ├── library/                    # Componentes de la biblioteca
│   │   │   ├── DocumentModal.tsx       # Visor modal de documento
│   │   │   └── Library.tsx             # Catálogo de manifiestos y tipologías
│   │   └── ui/                         # Primitivas de interfaz reutilizables
│   │       └── TiltCard3D.tsx          # Contenedor con perspectiva e inclinación 3D
│   ├── data/                           # Fixtures y datos tipados base
│   ├── lib/                            # Lógica de negocio, base de datos y seguridad
│   │   ├── auth/                       # Patrón Adapter (Edge Crypto <-> Spring Security 6)
│   │   │   └── securityAdapter.ts
│   │   ├── data/                       # Almacén de contenido en caliente
│   │   │   └── runtimeStore.ts
│   │   ├── db/                         # Base de datos y persistencia
│   │   │   ├── database.ts             # Repositorio transaccional de usuarios y tokens
│   │   │   └── migrations/
│   │   │       └── V1__init_schema.sql # Migración declarativa Flyway en 3FN
│   │   └── security/                   # Motor defensivo perimetral
│   │       ├── auth.ts                 # TimingSafeEqual, tokens HMAC y cookies HttpOnly
│   │       ├── constants.ts            # Nombres canónicos de cookies
│   │       ├── csrf.ts                 # Escudo anti-CSRF y validación de origen
│   │       ├── memberAuth.ts           # Sesiones de miembros de la comunidad
│   │       ├── rateLimiter.ts          # Limitador de tasa deslizante anti-DDoS L7
│   │       ├── routes.ts               # Matriz RBAC declarativa
│   │       └── sanitizer.ts            # Sanitizador anti-XSS y validación de URLs
│   ├── middleware.ts                   # Edge Middleware (RBAC y Hardening de headers)
│   └── types/                          # Contratos de TypeScript compartidos
└── tests/                              # Suite de pruebas de aseguramiento de calidad
    ├── admin_security_audit.test.mjs   # Auditoría de seguridad del panel /admin (5 tests)
    ├── bonten_validation.test.mjs      # Validaciones estructurales y de doctrina (7 tests)
    ├── community_and_db_audit.test.mjs # Pruebas de base de datos, tokens y RBAC (5 tests)
    └── live_server.test.mjs            # Pruebas e2e sobre el servidor en vivo (4 tests)
```

---

## 🛡️ 2. Matriz de Control de Acceso (RBAC)

| Ruta / Recurso | Tipo | Rol Mínimo Requerido | Mecanismo de Validación |
| :--- | :--- | :--- | :--- |
| `/` (Landing 3D) | Pública | Ninguno (`ANONYMOUS`) | Acceso libre |
| `/integrantes`, `/integrantes/*` | Pública | Ninguno (`ANONYMOUS`) | Acceso libre |
| `/manifiestos`, `/manifiestos/*` | Pública | Ninguno (`ANONYMOUS`) | Acceso libre |
| `/debates` (Lectura) | Pública | Ninguno (`ANONYMOUS`) | Acceso libre |
| `/debates` (Publicar argumentos) | Protegida | `ROLE_MEMBER` | Cookie `bonten_user_session` |
| `/api/debates/argument` | Protegida | `ROLE_MEMBER` | Cookie `bonten_user_session` + Anti-CSRF |
| `/auth/login`, `/auth/register` | Pública | Ninguno (`ANONYMOUS`) | Rate limiting por IP |
| `/auth/forgot-password` | Pública | Ninguno (`ANONYMOUS`) | Rate limit 3/15m + Anti-Enumeración |
| `/auth/reset-password` | Pública | Token válido | Hash SHA-256 en DB + TTL 15m (un solo uso) |
| `/admin/login` | Pública | Ninguno (`ANONYMOUS`) | Rate limit 5/15m + `timingSafeEqual` |
| `/admin`, `/admin/*` | Privada | `ROLE_SUPERADMIN` | Cookie `bonten_admin_session` en Edge |
| `/api/admin/*` | Privada | `ROLE_SUPERADMIN` | Validación criptográfica HMAC + Anti-CSRF |

---

## ⚡ 3. Comandos de Verificación Automatizada

```bash
# Ejecutar todas las 21 pruebas automatizadas
npm run test:all

# Ejecutar auditoría de seguridad perimetral
npm run test:security

# Ejecutar pruebas de base de datos y recuperación de claves
npm run test:community

# Chequeo estricto de tipos TypeScript
npm run typecheck

# Generación del bundle de producción optimizado (34 rutas)
npm run build
```
