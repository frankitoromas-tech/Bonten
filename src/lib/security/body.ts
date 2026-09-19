// =======================================================================
//  LÍMITES DE CARGA ÚTIL & LECTURA SEGURA HTTP — BONTEN DEFENSE
//  Mitigación estricta de Memory Exhaustion y ataques DoS L7 por payload.
// =======================================================================

export interface LimitedJsonResult<T> {
  ok: boolean;
  value?: T;
  error?: string;
  status?: number;
}

/**
 * Lee y parsea el cuerpo JSON de una petición HTTP imponiendo un límite estricto en bytes.
 * Si la cabecera Content-Length o el tamaño real del cuerpo supera maxBytes,
 * aborta de inmediato antes de saturar la memoria o el parser JSON.
 */
export async function readLimitedJson<T>(request: Request, maxBytes: number): Promise<LimitedJsonResult<T>> {
  const lengthHeader = request.headers.get('content-length');
  if (lengthHeader) {
    const declaredLength = Number(lengthHeader);
    if (!Number.isNaN(declaredLength) && declaredLength > maxBytes) {
      return { ok: false, status: 413, error: 'Payload too large' };
    }
  }

  try {
    const text = await request.text();
    const byteLength = new TextEncoder().encode(text).byteLength;
    if (byteLength > maxBytes) {
      return { ok: false, status: 413, error: 'Payload too large' };
    }
    const parsed = JSON.parse(text) as T;
    return { ok: true, value: parsed };
  } catch (err: unknown) {
    if (err instanceof SyntaxError) {
      return { ok: false, status: 400, error: 'Invalid JSON' };
    }
    return { ok: false, status: 400, error: 'Error reading request body' };
  }
}
