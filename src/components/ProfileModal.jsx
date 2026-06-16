import React from 'react';

const MEMBER_DETAILS = {
    'Ana L.': {
        stats: { debates: 14, library: 4, votes: 142 },
        activities: [
            { id: 1, text: "Aportó el documento <strong>Tipologías Teológicas y Exégesis Clandestina</strong> a la Biblioteca." },
            { id: 2, text: "Publicó una postura a favor en el debate <strong>La línea temporal actual y la criminalización de la vida</strong>." },
            { id: 3, text: "Moderó la discusión sobre <strong>Hermenéutica Bíblica del Antiguo Testamento</strong>." }
        ]
    },
    'Carlos M.': {
        stats: { debates: 22, library: 2, votes: 98 },
        activities: [
            { id: 1, text: "Publicó una postura en contra en el debate <strong>¿Es posible separar fe y ciencia en el ámbito académico?</strong>" },
            { id: 2, text: "Aportó el documento histórico <strong>Manifiestos y Cartas de la Reforma Temprana</strong>." },
            { id: 3, text: "Completó la transcripción de manuscritos del siglo XVI para el archivo general." }
        ]
    },
    'Elena R.': {
        stats: { debates: 8, library: 1, votes: 56 },
        activities: [
            { id: 1, text: "Publicó una postura a favor en el debate <strong>La fe y la razón en la apologética del siglo XXI</strong>." },
            { id: 2, text: "Realizó un aporte crítico a la columna exegética sobre la Gracia." },
            { id: 3, text: "Inició el debate abierto sobre <strong>El libre albedrío en la dogmática contemporánea</strong>." }
        ]
    }
};

export default function ProfileModal({ member, onClose }) {
    if (!member) return null;

    const details = MEMBER_DETAILS[member.name] || {
        stats: { debates: 0, library: 0, votes: 0 },
        activities: [{ id: 1, text: "Se unió recientemente a la red de integrantes de BONTEN." }]
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="profile-modal-banner">
                    <div className="profile-modal-avatar" style={{ backgroundImage: `url("${member.avatar}")` }}></div>
                </div>

                <div className="profile-modal-content">
                    <h2 className="profile-modal-name">{member.name}</h2>
                    <span className={`role-badge ${member.roleClass}`} style={{ display: 'inline-block' }}>{member.role}</span>
                    <p className="profile-modal-bio">{member.bio}</p>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-value">{details.stats.debates}</div>
                            <div className="stat-label">Debates</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{details.stats.library}</div>
                            <div className="stat-label">Biblioteca</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{details.stats.votes}</div>
                            <div className="stat-label">Apoyos</div>
                        </div>
                    </div>

                    <h3 className="recent-activity-title">Actividad Reciente</h3>
                    <div className="activity-list">
                        {details.activities.map(act => (
                            <div key={act.id} className="activity-item">
                                <div className="activity-dot"></div>
                                <div className="activity-text" dangerouslySetInnerHTML={{ __html: act.text }}></div>
                            </div>
                        ))}
                    </div>
                </div>

                <footer className="document-reader-footer">
                    <button className="btn-primary" onClick={onClose} style={{ width: 'auto' }}>
                        Cerrar Perfil
                    </button>
                </footer>
            </div>
        </div>
    );
}
