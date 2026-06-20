import React from 'react';

export default function Members() {
    const leader = {
        name: 'Fireboy 🔥',
        handle: '@fireboyphilosophy',
        role: 'Líder Fundador',
        bio: 'El único impulso que no puede ser frenado es la curiosidad 🔥 #BontenTeam',
        avatar: '/assets/fireboy_premium_1781974414658.png',
        tiktok: 'https://www.tiktok.com/@fireboyphilosophy',
        youtube: 'https://youtube.com/@fireboyphilosophy?si=5nOPKIestJFXdJOl'
    };

    const members = [
        { name: 'Ana L.', role: 'Moderadora', roleClass: 'role-mod', bio: 'Especialista en teología sistemática y gestión de la biblioteca central.', avatar: '/assets/avatar_ana_1781465403711.png' },
        { name: 'Carlos M.', role: 'Investigador', roleClass: 'role-investigator', bio: 'Encargado de recopilar documentación histórica y análisis de textos.', avatar: '/assets/avatar_carlos_1781465414008.png' },
        { name: 'Elena R.', role: 'Contribuidora', roleClass: 'role-contributor', bio: 'Activa en los debates sobre apologética y exégesis moderna.', avatar: '/assets/avatar_elena_1781465424361.png' }
    ];

    return (
        <>
            <div className="page-header">
                <h2 className="page-title">Mesa Directiva</h2>
                <p className="page-subtitle">Conoce al fundador y a los miembros de nuestra comunidad.</p>
            </div>

            <section className="leader-section">
                <article className="leader-card">
                    <div className="leader-avatar-wrapper">
                        <div className="leader-avatar" style={{ backgroundImage: `url("${leader.avatar}")` }}></div>
                        <div className="leader-ring"></div>
                    </div>
                    <div className="leader-info">
                        <span className="leader-badge">{leader.role}</span>
                        <h3 className="leader-name">{leader.name}</h3>
                        <p className="leader-handle">{leader.handle}</p>
                        <p className="leader-bio">"{leader.bio}"</p>
                        
                        <div className="leader-actions">
                            <a href={leader.tiktok} target="_blank" rel="noopener noreferrer" className="tiktok-btn">
                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                                <span>TikTok</span>
                            </a>
                            <a href={leader.youtube} target="_blank" rel="noopener noreferrer" className="youtube-btn">
                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                                <span>YouTube</span>
                            </a>
                            <button className="btn-outline">Ver Perfil</button>
                        </div>
                    </div>
                </article>
            </section>

            <div className="divider">
                <span>Equipo BONTEN</span>
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
                                <button className="btn-outline">Ver Perfil</button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}
