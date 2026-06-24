"use client";
import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
      <h1>404 - Página No Encontrada</h1>
      <p style={{ margin: '20px 0' }}>La página que buscas no existe.</p>
      <Link href="/">Volver al Inicio</Link>
    </div>
  );
}
