import React from 'react';
import Link from 'next/link';

export const metadata = {
    title: 'BONTEN | Manifiestos',
    description: 'Nuestra doctrina, nuestros principios y nuestra resistencia documentada.'
};

export default function ManifiestosPage() {
    return (
        <section className="layout-container" style={{ minHeight: '80vh', paddingTop: '4rem' }}>
            <h1 className="section-title" style={{ color: 'var(--title-color)', marginBottom: '1rem' }}>Manifiestos y Doctrina</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
                Aquí se documenta el conocimiento fundamental de la resistencia.
            </p>

            <div className="cards-grid">
                <article className="box-card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Fundamentos del Bloque Protestante</h3>
                    <p style={{ opacity: 0.8, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                        Una exégesis sobre por qué la resistencia contemporánea requiere una base sólida en principios inmutables.
                    </p>
                    <Link href="/manifiestos/fundamentos" className="primary-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>Leer Manifiesto</Link>
                </article>

                <article className="box-card" style={{ padding: '2rem', background: 'var(--surface-color)', color: 'var(--text-dark)', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--title-color)' }}>La Ética en la Era de la Desinformación</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                        Cómo mantener el criterio de verdad cuando las estructuras mediáticas dictan lo contrario.
                    </p>
                    <Link href="/manifiestos/etica" className="secondary-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>Leer Manifiesto</Link>
                </article>
            </div>
        </section>
    );
}
