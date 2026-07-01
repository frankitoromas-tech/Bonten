'use client';
import React, { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ textAlign: 'center', padding: '5rem 1.25rem', minHeight: '60vh' }}>
      <h1 className="section-title" style={{ color: 'var(--title-color)', marginBottom: '0.5rem' }}>
        Algo salió mal
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>
        Ocurrió un error inesperado. Puedes intentar recargar esta sección.
      </p>
      <button className="btn-primary" style={{ width: 'auto' }} onClick={() => reset()}>
        Reintentar
      </button>
    </div>
  );
}
