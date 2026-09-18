'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/Toast';

type Status = 'idle' | 'loading' | 'success';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      showToast('Suscripción confirmada. ¡Bienvenido a BONTEN!', 'success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <motion.section 
      className="join-section" 
      style={{ marginTop: '2rem' }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <article
        className="box-card join-card"
        style={{
          padding: '2.8rem',
          textAlign: 'center',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-dark)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-soft)'
        }}
      >
        <h3 style={{ fontSize: '2rem', marginBottom: '0.8rem', color: 'var(--title-color)', fontWeight: 800 }}>
          Únete a la Resistencia
        </h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.8rem', maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Recibe manifiestos, actualizaciones y convocatorias directamente en tu bandeja de entrada. Ningún spam, solo verdad.
        </p>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              className="success-message"
              role="status"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              style={{
                color: '#38bdf8',
                fontWeight: 'bold',
                padding: '1.2rem',
                background: 'rgba(56, 189, 248, 0.12)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                maxWidth: '500px',
                margin: '0 auto'
              }}
            >
              ✨ ¡Te has unido exitosamente! Revisa tu correo pronto.
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="join-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', gap: '1rem', maxWidth: '500px', margin: '0 auto', flexWrap: 'wrap' }}
            >
              <input
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Correo electrónico"
                style={{
                  flex: '1',
                  padding: '0.9rem 1.4rem',
                  borderRadius: '30px',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                  background: 'var(--bg-base)',
                  color: 'var(--text-dark)',
                  fontSize: '1rem'
                }}
              />
              <motion.button
                type="submit"
                className="btn-primary"
                disabled={status === 'loading'}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  padding: '0.9rem 2.2rem',
                  borderRadius: '30px',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                {status === 'loading' ? 'Enviando...' : 'Suscribirme'}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </article>
    </motion.section>
  );
}
