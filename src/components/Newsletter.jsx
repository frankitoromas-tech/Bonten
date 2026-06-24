"use client";
import React, { useState } from 'react';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success'

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) return;
        
        setStatus('loading');
        // Simular envío a API
        setTimeout(() => {
            setStatus('success');
            setEmail('');
        }, 1500);
    };

    return (
        <section className="join-section" style={{ marginTop: '2rem' }}>
            <article className="box-card join-card" style={{ padding: '2.5rem', textAlign: 'center', background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-dark)' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--title-color)' }}>Únete a la Resistencia</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    Recibe manifiestos, actualizaciones y convocatorias directamente en tu bandeja de entrada. Ningún spam, solo verdad.
                </p>
                
                {status === 'success' ? (
                    <div className="success-message" style={{ color: 'var(--accent-blue)', fontWeight: 'bold', padding: '1rem', background: 'rgba(59, 164, 230, 0.1)', borderRadius: 'var(--radius-md)' }}>
                        ¡Te has unido exitosamente! Revisa tu correo pronto.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="join-form" style={{ display: 'flex', gap: '1rem', maxWidth: '500px', margin: '0 auto', flexWrap: 'wrap' }}>
                        <input 
                            type="email" 
                            placeholder="tu@correo.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ 
                                flex: '1', 
                                padding: '0.8rem 1.2rem', 
                                borderRadius: 'var(--radius-md)', 
                                border: '1px solid var(--border-color)', 
                                outline: 'none', 
                                background: 'transparent',
                                color: 'var(--text-dark)'
                            }}
                        />
                        <button type="submit" className="primary-btn" disabled={status === 'loading'} style={{ padding: '0.8rem 2rem', borderRadius: 'var(--radius-md)', background: 'var(--gradient-hero)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            {status === 'loading' ? 'Enviando...' : 'Suscribirme'}
                        </button>
                    </form>
                )}
            </article>
        </section>
    );
}
