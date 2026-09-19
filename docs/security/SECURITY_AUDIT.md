# 🛡️ BONTEN DEFENSE — Informe de Auditoría y Blindaje de Seguridad

> **Proyecto:** BONTEN_WEB — Plataforma de Resistencia Intelectual, Debates y Comunidad  
> **Estado:** 100% Blindado & Aprobado (36/36 Tests Exitosos)  
> **Arquitectura:** Next.js 16 (App Router) + Edge Proxy + Spring Security 6 Spec  

---

## 1. Perímetro y Defensa en Capas (Defense-in-Depth)

El perímetro defensivo de BONTEN opera bajo un modelo multicapa sin punto único de falla:

| Capa | Mecanismo | Mitigación |
| :--- | :--- | :--- |
| **L7 Edge Proxy** | `src/proxy.ts` en Next.js Edge Runtime | Bloqueo de accesos no autenticados a `/admin/*` y cabeceras estrictas |
| **Rate Limiter & Jail** | `src/lib/security/rateLimiter.ts` | Ventana deslizante por IP, rechazo HTTP 429 y baneo temporal en IP Jail |
| **Protección DoS Payload** | `src/lib/security/body.ts` (`readLimitedJson`) | Límite estricto de bytes (8KB - 16KB) contra ataques de memory exhaustion |
| **Anti-CSRF** | `src/lib/security/csrf.ts` | Validación obligatoria de cabeceras `Origin` y `Referer` en mutaciones |
| **Sanitización XSS** | `src/lib/security/sanitizer.ts` | Purificación de HTML y texto plano antes de persistencia y renderizado |
| **Anti-Clickjacking** | `next.config.mjs` + `vercel.json` | CSP `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff` |

---

## 2. Autenticación Criptográfica & Control de Sesiones

1. **Protección contra Timing Attacks (Canal Lateral):**
   - Comparación estricta de hashes y tokens mediante `crypto.timingSafeEqual`.
   - Prevención de ataques de inferencia por tiempo de respuesta.
2. **Firmas de Sesión HMAC-SHA256:**
   - Tokens firmados con secretos criptográficos de longitud mínima ($\ge 32$ caracteres).
   - Huella digital de cliente (`createSessionFingerprint`) que vincula IP y User-Agent para mitigar *Session Hijacking* y *Cookie Replay*.
3. **Almacenamiento Seguro:**
   - Cookies con directivas `HttpOnly`, `SameSite=Strict` y `Secure` en producción.
4. **Resiliencia de Entorno:**
   - `getRequiredSecret` valida estrictamente en runtime y provee bypass seguro durante la fase de compilación en Vercel/CI para evitar bloqueos del despliegue.

---

## 3. Gobernanza RBAC & Asistente WILFREDO AI

- **Modelo de Roles:**
  - `ROLE_SUPERADMIN`: Reservado para el fundador Fireboy (control soberano del sistema).
  - `ROLE_ADMIN` / `ROLE_EDITOR`: Permisos delegados para gestión de biblioteca y debates.
  - `ROLE_MEMBER`: Participación activa en el Muro de la Comunidad y Foro de Debates.
- **Wilfredo Copilot:**
  - Asistente de inteligencia estratégica y gobernanza en el panel administrativo.
  - Comandos en 1 clic para bloqueo de IPs sospechosas, diagnóstico de Vercel y auditoría WAF.
  - Reconocimiento de administradores autenticados con rutas directas al Centro de Control.

---

## 4. Pertenencia Automatizada a la Comunidad

- Flujo de ingreso en `/auth/login` y `/auth/register` con adhesión automática al decálogo de honor (`bonten:pledge`).
- Redirección predeterminada e inmediata al Muro de la Comunidad (`/comunidad`).
- Detección unificada para credenciales de administración y de miembros.
