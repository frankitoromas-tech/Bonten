# Evolución del bot, seguridad y experiencia pública de BONTEN

**Fecha:** 2026-09-14  
**Estado:** Diseño aprobado para implementación  
**Alcance:** Bot Wilfredo, rutas públicas y administrativas relacionadas, seguridad transversal y presentación responsiva.

## 1. Objetivo

Completar el trabajo local iniciado en Antigravity y llevar BONTEN a un estado compilable, ordenado y defendible. Wilfredo seguirá siendo un bot determinista, sin llamadas a modelos externos, pero tendrá límites claros y un punto de integración para una futura API de Luyo. La interfaz pública conservará la identidad azul, magenta y editorial de BONTEN con menos ruido simultáneo, más espacio y una jerarquía consistente en móvil y escritorio.

## 2. Estado encontrado

- Hay quince archivos modificados y una ruta de ingesta nueva todavía sin integrar.
- El build falla porque la ingesta registra un tipo de evento inexistente.
- La ruta de ingesta contiene dos credenciales literales dentro del código fuente.
- Una sesión de miembro común puede autorizar ingesta doctrinal.
- El middleware decide acceso administrativo leyendo la expiración del token sin comprobar su firma.
- Los secretos de administración y comunidad tienen valores predeterminados utilizables en producción.
- El rate limiting y la auditoría viven en memoria de proceso y no son compartidos entre instancias.
- El bot concentra clasificación, corpus, respuestas, navegación y controles defensivos en una ruta de más de mil líneas.
- La experiencia pública muestra a la vez fondo ambiental, canvas 3D, spotlight, audio, inclinación 3D, brillos, badges y animaciones; la suma reduce claridad y rendimiento móvil.

## 3. Decisiones

### 3.1 Wilfredo será un bot modular

El endpoint conservará el contrato público actual, pero delegará en unidades pequeñas:

- `assistant/schema`: valida y limita el payload de entrada y el contrato de salida.
- `assistant/normalization`: normaliza Unicode, espacios, variantes acentuadas y términos equivalentes.
- `assistant/security`: detecta patrones de abuso y produce una respuesta neutra, sin revelar reglas internas.
- `assistant/intents`: define intenciones, ejemplos, prioridad y puntuación.
- `assistant/corpus`: contiene hechos y respuestas institucionales separados del enrutamiento HTTP.
- `assistant/engine`: selecciona intención por puntuación, compone la respuesta y evita cadenas de `else if`.
- `assistant/providers`: contrato desactivado para conectar más adelante `LuyoProvider` sin modificar la UI ni el endpoint.

Las respuestas serán reproducibles. Cada resultado incluirá texto, rutas y sugerencias útiles. Los pasos de “razonamiento” se reemplazarán por estados breves de procesamiento; no se expondrán reglas internas ni se simulará razonamiento privado.

### 3.2 Ingesta doctrinal controlada

La ingesta quedará limitada a administradores con sesión criptográficamente válida o a una credencial de integración obtenida exclusivamente desde variables de entorno. Los miembros no podrán escribir en el corpus.

La solicitud tendrá:

- verificación de origen y método;
- límite estricto de bytes antes de procesar JSON;
- esquema explícito para título, tesis, contenido y categoría;
- normalización y sanitización;
- detección de contenido de control o código embebido;
- comparación temporalmente segura de la credencial de integración;
- registro de autor, resultado y motivo de rechazo sin guardar secretos ni el texto completo.

Mientras no exista persistencia externa, las contribuciones en memoria se declararán temporales y no se presentarán como conocimiento durable. El adaptador dejará preparada una implementación persistente futura.

### 3.3 Defensa por capas

- Eliminar todos los secretos predeterminados de producción. El arranque o la operación sensible fallará de forma segura si faltan secretos.
- Centralizar extracción fiable de IP y no confiar ciegamente en encabezados reenviados.
- Validar firma, estructura, rol, expiración y huella de sesión en cada ruta protegida. El middleware no se tratará como prueba criptográfica suficiente.
- Aplicar autorización declarativa por rol y validación de origen a todas las mutaciones.
- Unificar eventos de auditoría en un catálogo tipado con detalles acotados.
- Añadir límites de tamaño, tiempo y frecuencia a login, registro, recuperación, debates, bot e ingesta.
- Sustituir cabeceras obsoletas y construir una CSP completa compatible con Next.js. Mantener HSTS solo en producción.
- Reducir información técnica en errores públicos y conservar detalle útil únicamente en auditoría.
- Preparar una interfaz para rate limiting distribuido; la implementación local seguirá disponible para desarrollo y se documentará como defensa de una sola instancia.

### 3.4 Interfaz con menos ruido

La dirección visual será “archivo contemporáneo”:

- un solo fondo ambiental estático o de bajo movimiento;
- canvas 3D y spotlight desactivados en pantallas táctiles, movimiento reducido y equipos de baja capacidad;
- eliminación de badges, brillos y animaciones que repiten información;
- contenedor público fluido mediante `clamp()` y ancho editorial máximo;
- escala compartida de espacios, radios, bordes y elevaciones;
- encabezados con una etiqueta, un título y una descripción como máximo;
- tarjetas con acciones claras, alturas estables y densidad adaptada al contenido;
- Wilfredo con encabezado simple, cuatro accesos frecuentes como máximo y sugerencias posteriores contextuales;
- controles flotantes agrupados para evitar solapamiento entre asistente y botón de retorno.

No se cambiarán la paleta, el logotipo, los nombres del contenido ni el tono institucional.

## 4. Responsividad

Se validarán cinco anchos de referencia: 320, 375, 768, 1024 y 1440 px.

- A 320–480 px: una columna, márgenes fluidos, controles táctiles de al menos 44 px, panel del bot ajustado al viewport y sin scroll horizontal.
- A 768 px: navegación compacta, grids de una o dos columnas según contenido y modales sin dimensiones fijas.
- A 1024 px: composición editorial con columnas equilibradas y anchura de lectura limitada.
- A 1440 px: mayor espacio exterior sin estirar párrafos ni tarjetas por encima de su medida útil.

Se verificará zoom al 200 %, navegación por teclado, `prefers-reduced-motion`, contraste, foco visible y cierre accesible de paneles.

## 5. Pruebas de seguridad

La suite cubrirá:

- tokens truncados, manipulados, expirados y con rol insuficiente;
- ausencia de secretos en producción;
- CSRF y orígenes falsificados;
- payloads vacíos, enormes, JSON inválido y tipos incorrectos;
- XSS, URLs peligrosas y contenido HTML inesperado;
- prompt injection, Unicode confusable y cadenas de evasión comunes;
- abuso de rate limit y cabeceras de IP manipuladas;
- acceso no autorizado a ingesta y rutas administrativas;
- ausencia de secretos y datos sensibles en respuestas y logs;
- cabeceras de seguridad en rutas públicas, API y administración.

Las pruebas serán defensivas y se ejecutarán únicamente contra el servidor local del proyecto.

## 6. Secuencia de implementación

1. Preservar y estabilizar los cambios de Antigravity; corregir build y contratos rotos.
2. Extraer el motor modular de Wilfredo manteniendo compatible la UI.
3. Cerrar la ingesta y endurecer autenticación, autorización, orígenes, payloads y eventos.
4. Añadir pruebas de abuso y regresión; corregir hallazgos.
5. Consolidar tokens de diseño y espaciado; simplificar layout, bot y componentes públicos.
6. Verificar rutas y estados interactivos en los cinco anchos definidos.
7. Ejecutar typecheck, pruebas, build de producción y comprobación local final.

## 7. Criterios de aceptación

- `npm run typecheck`, `npm run test:all` y `npm run build` terminan correctamente.
- Ninguna credencial funcional queda escrita en el repositorio.
- Un miembro normal no puede alimentar el corpus ni acceder a administración.
- Un token manipulado no permite entrar a una ruta o API protegida.
- El bot responde a navegación, integrantes, biblioteca, debates, doctrina y consultas fuera de alcance sin depender de una API externa.
- El motor puede incorporar posteriormente un proveedor Luyo mediante su interfaz, sin cambiar el endpoint público.
- No existe scroll horizontal ni solapamiento de controles en los anchos de referencia.
- La experiencia pública conserva identidad y contenido con menor densidad visual y márgenes consistentes.
- Los cambios locales de Antigravity quedan integrados o reemplazados conscientemente; no se descartan silenciosamente.

## 8. Límites actuales

No se conectará una API externa ni se prometerá persistencia distribuida sin credenciales e infraestructura. El diseño deja ambos puntos preparados. El pentesting automatizado será local y defensivo; no incluye ataques contra el despliegue público ni servicios de terceros.
