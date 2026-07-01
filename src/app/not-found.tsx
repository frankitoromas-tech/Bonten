import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1.25rem', minHeight: '60vh' }}>
      <h1 className="section-title" style={{ color: 'var(--title-color)', fontSize: '5rem', marginBottom: '0.5rem' }}>
        404
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2rem' }}>
        La página que buscas no existe o fue reubicada en la resistencia.
      </p>
      <Link href="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto' }}>
        Volver al Inicio
      </Link>
    </div>
  );
}
