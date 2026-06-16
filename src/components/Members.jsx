import React, { useState } from 'react';
import ProfileModal from './ProfileModal';

export default function Members() {
    const [selectedMember, setSelectedMember] = useState(null);

    const members = [
        { name: 'Ana L.', role: 'Moderadora', roleClass: 'role-mod', bio: 'Especialista en teología sistemática y gestión de la biblioteca central.', avatar: '/assets/avatar_ana_1781465403711.png' },
        { name: 'Carlos M.', role: 'Investigador', roleClass: 'role-investigator', bio: 'Encargado de recopilar documentación histórica y análisis de textos.', avatar: '/assets/avatar_carlos_1781465414008.png' },
        { name: 'Elena R.', role: 'Contribuidora', roleClass: 'role-contributor', bio: 'Activa en los debates sobre apologética y exégesis moderna.', avatar: '/assets/avatar_elena_1781465424361.png' }
    ];

    return (
        <>
            <div className="page-header">
                <h2 className="page-title">Red de Integrantes</h2>
                <p className="page-subtitle">Conoce a los miembros y moderadores de nuestra comunidad.</p>
            </div>
            <section className="members-directory">
                <div className="members-grid-large">
                    {members.map((m, i) => (
                        <article key={i} className={`member-card ${i === 0 ? 'profile-glow' : ''}`}>
                            <div className="member-avatar" style={{ backgroundImage: `url("${m.avatar}")`, backgroundSize: 'cover', backgroundPosition: 'center', border: '3px solid var(--accent-blue)' }}></div>
                            <div className="member-info">
                                <h3 className="member-name">{m.name}</h3>
                                <span className={`role-badge ${m.roleClass}`}>{m.role}</span>
                                <p className="member-bio">{m.bio}</p>
                                <button className="btn-outline" onClick={() => setSelectedMember(m)}>Ver Perfil</button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {selectedMember && (
                <ProfileModal member={selectedMember} onClose={() => setSelectedMember(null)} />
            )}
        </>
    );
}
