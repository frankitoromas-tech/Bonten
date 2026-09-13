import React from 'react';
import Link from 'next/link';

export default function IntegranteNavFooter() {
  return (
    <div className="integrante-nav-footer">
      <Link href="/integrantes" className="btn-outline" style={{ textDecoration: 'none' }}>
        ← Volver al Directorio de Integrantes
      </Link>
      <Link href="/manifiestos" className="btn-primary" style={{ textDecoration: 'none' }}>
        Explorar Manifiestos Doctrinarios →
      </Link>
    </div>
  );
}
