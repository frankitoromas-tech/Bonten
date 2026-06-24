import React, { useState } from 'react';
import DocumentReader from './DocumentReader';

const DOCUMENTS = [
    {
        id: 1,
        title: "Manifiesto de Resistencia NG: Nuestra Postura",
        category: "Manifiesto",
        author: "Comunidad BONTEN",
        readTime: "4 min",
        image: "/assets/lib_docs_1781465368328.webp",
        content: [
            "En un mundo contemporáneo donde defender los derechos más elementales y la existencia humana es catalogado como una insurrección, nosotros elegimos alzarnos. <strong>BONTEN no es una organización común; es un refugio de la verdad.</strong>",
            "<blockquote>La batalla moral y apologética por el futuro de la sociedad se libra hoy, alterando nuestras prioridades en el presente.</blockquote>",
            "Nuestra visión es simple: no deseamos provocar violencia, sino edificar una fraternidad sólida, basada en el estudio, la exégesis rigurosa de las escrituras y el análisis de la cultura. Invitamos a cada integrante a ser parte de esta resistencia intelectual.",
            "Nos mantenemos firmes en un entorno adverso. Al igual que el concepto de resistencia histórica, nuestro llamado es defender lo esencial frente a los vientos de cambio moral del siglo actual."
        ]
    },
    {
        id: 2,
        title: "Tipologías Teológicas y Exégesis Clandestina",
        category: "Teología",
        author: "Ana L.",
        readTime: "6 min",
        image: "/assets/lib_types_1781465379712.webp",
        content: [
            "El estudio sistemático de las doctrinas cristianas a menudo se ve amenazado por el relativismo cultural. En esta tipología analizamos cómo la hermenéutica bíblica mantiene su consistencia histórica.",
            "Detallamos el método de estudio gramático-histórico frente a las corrientes existenciales modernas que diluyen el texto sagrado. La gracia no es un concepto moldeable por las modas filosóficas, sino una roca inamovible.",
            "<blockquote>La sana exégesis no busca acomodar el texto al lector, sino elevar al lector a la verdad del texto.</blockquote>",
            "A través de esta tipología, proporcionamos las claves para comprender los debates teológicos fundamentales entre las corrientes reformadas y las posturas contemporáneas."
        ]
    }
];

export default function Library() {
    const [selectedDoc, setSelectedDoc] = useState(null);

    return (
        <section className="library-section">
            <h2 className="section-title" style={{ color: 'var(--title-color)' }}>BIBLIOTECA</h2>
            <div className="carousel-layout">
                <div className="cards-grid">
                    {DOCUMENTS.map((doc) => (
                        <article key={doc.id} className="library-card" onClick={() => setSelectedDoc(doc)}>
                            <div className="card-image-wrapper" style={{ height: '140px', backgroundImage: `url("${doc.image}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                            <div className="card-header" style={{ height: '60px', padding: '0 1rem', fontSize: '1rem', textAlign: 'center', lineHeight: '1.2' }}>
                                {doc.title.length > 40 ? doc.title.substring(0, 38) + "..." : doc.title}
                            </div>
                            <div className="card-body">
                                <span className="debate-tag" style={{ alignSelf: 'flex-start' }}>{doc.category}</span>
                                <div className="mock-line" style={{ marginTop: '0.5rem' }}></div>
                                <div className="mock-line short"></div>
                            </div>
                        </article>
                    ))}
                </div>
                
                <button className="action-arrow" aria-label="Buscar documento" onClick={() => setSelectedDoc(DOCUMENTS[0])}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>
            </div>

            {selectedDoc && (
                <DocumentReader document={selectedDoc} onClose={() => setSelectedDoc(null)} />
            )}
        </section>
    );
}
