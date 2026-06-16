import React, { useState } from 'react';

export default function DocumentReader({ document, onClose }) {
    const [fontSize, setFontSize] = useState(1.1); // in rem

    if (!document) return null;

    const increaseFont = () => setFontSize(prev => Math.min(prev + 0.1, 1.6));
    const decreaseFont = () => setFontSize(prev => Math.max(prev - 0.1, 0.8));

    const handleCopy = () => {
        const fullText = `${document.title}\n\n${document.content.map(p => p.replace(/<[^>]*>/g, '')).join('\n\n')}`;
        navigator.clipboard.writeText(fullText)
            .then(() => {
                alert("Documento copiado al portapapeles");
            })
            .catch(err => {
                console.error("Error al copiar: ", err);
            });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <header className="document-reader-header">
                    <div className="document-reader-meta">
                        <span className="debate-tag">{document.category}</span>
                        <span>Por: <strong>{document.author}</strong></span>
                        <span>• {document.readTime}</span>
                    </div>
                    <h2 className="document-reader-title">{document.title}</h2>
                    
                    <div className="document-reader-controls">
                        <span className="font-size-label">Tamaño de letra:</span>
                        <button className="font-btn" onClick={decreaseFont} title="Disminuir letra" disabled={fontSize <= 0.8}>A-</button>
                        <button className="font-btn" onClick={increaseFont} title="Aumentar letra" disabled={fontSize >= 1.6}>A+</button>
                    </div>
                </header>

                <main className="document-reader-body" style={{ fontSize: `${fontSize}rem` }}>
                    {document.content.map((p, index) => {
                        if (p.startsWith('<blockquote>')) {
                            const cleanText = p.replace('<blockquote>', '').replace('</blockquote>', '');
                            return <blockquote key={index} dangerouslySetInnerHTML={{ __html: cleanText }} />;
                        }
                        return <p key={index} dangerouslySetInnerHTML={{ __html: p }} />;
                    })}
                </main>

                <footer className="document-reader-footer">
                    <button className="btn-outline" style={{ width: 'auto' }} onClick={handleCopy}>
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" style={{ marginRight: '0.4rem', verticalAlign: 'middle' }}>
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                        </svg>
                        Copiar Cita
                    </button>
                    <button className="btn-primary" style={{ width: 'auto' }} onClick={onClose}>
                        Cerrar Lectura
                    </button>
                </footer>
            </div>
        </div>
    );
}
