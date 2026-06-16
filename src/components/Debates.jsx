import React, { useState } from 'react';

const INITIAL_DEBATES = [
    {
        id: 1,
        title: "La línea temporal actual y la criminalización de la vida",
        description: "¿Es hoy más difícil que antes defender los valores esenciales y la vida humana sin ser tachados de rebeldes o sombras?",
        tag: "Sociedad",
        commentsCount: 3,
        voters: 45,
        arguments: [
            {
                id: 101,
                author: "Carlos M.",
                role: "Investigador",
                avatar: "/assets/avatar_carlos_1781465414008.png",
                roleClass: "role-investigator",
                type: "pro",
                text: "La historia demuestra que cuando los imperios se desgastan moralmente, criminalizan a quienes custodian la verdad. Hoy en día, defender la vida se empaqueta como una postura retrógrada cuando en realidad es el acto de resistencia más puro frente a un nihilismo de consumo.",
                reactions: { solido: 12, persuasivo: 8, respetuoso: 10 },
                userReactions: []
            },
            {
                id: 102,
                author: "Julián V. (Crítico)",
                role: "Invitado",
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                roleClass: "role-contributor",
                type: "contra",
                text: "No es criminalización de la vida, sino el progreso de las libertades individuales. Lo que algunos llaman 'resistencia' a veces es solo la dificultad de adaptarse a una sociedad pluralista que decide democráticamente sus propios límites éticos.",
                reactions: { solido: 4, persuasivo: 7, respetuoso: 3 },
                userReactions: []
            },
            {
                id: 103,
                author: "Ana L.",
                role: "Moderadora",
                avatar: "/assets/avatar_ana_1781465403711.png",
                roleClass: "role-mod",
                type: "pro",
                text: "Es vital matizar: no se trata de imponer un dogma, sino de recordar que hay axiomas morales objetivos. Si el derecho más fundamental (la existencia) se vuelve negociable bajo conveniencia democrática, toda la estructura de derechos humanos se desmorona.",
                reactions: { solido: 15, persuasivo: 9, respetuoso: 14 },
                userReactions: []
            }
        ]
    },
    {
        id: 2,
        title: "La fe y la razón en la apologética del siglo XXI",
        description: "¿Deben la ciencia moderna y el pensamiento racional ser vistos como adversarios de la fe, o son herramientas complementarias?",
        tag: "Apologética",
        commentsCount: 2,
        voters: 38,
        arguments: [
            {
                id: 201,
                author: "Elena R.",
                role: "Contribuidora",
                avatar: "/assets/avatar_elena_1781465424361.png",
                roleClass: "role-contributor",
                type: "pro",
                text: "La apologética moderna no debe temer a la ciencia. Cuanto más comprendemos la complejidad del cosmos y la precisión de sus constantes físicas, más fuerte es el argumento teleológico. La razón es la aliada natural de la revelación.",
                reactions: { solido: 18, persuasivo: 11, respetuoso: 10 },
                userReactions: []
            },
            {
                id: 202,
                author: "Dr. Tomás K.",
                role: "Invitado",
                avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
                roleClass: "role-investigator",
                type: "contra",
                text: "La ciencia opera bajo el naturalismo metodológico. Intentar forzar la ciencia para validar dogmas de fe suele resultar en mala ciencia o en una fe vulnerable a los constantes cambios del conocimiento empírico. Deben mantenerse en esferas separadas.",
                reactions: { solido: 8, persuasivo: 5, respetuoso: 12 },
                userReactions: []
            }
        ]
    },
    {
        id: 3,
        title: "Análisis exegético del concepto de la Gracia",
        description: "Estudio de las traducciones bíblicas y la interpretación doctrinal en las iglesias reformadas vs la exégesis católica.",
        tag: "Teología",
        commentsCount: 1,
        voters: 22,
        arguments: [
            {
                id: 301,
                author: "Ana L.",
                role: "Moderadora",
                avatar: "/assets/avatar_ana_1781465403711.png",
                roleClass: "role-mod",
                type: "pro",
                text: "El vocablo griego 'Charis' es radical. En las cartas paulinas, denota un favor inmerecido absoluto. Estudiar su raíz lingüística nos ayuda a desmantelar la idea del esfuerzo o mérito humano como moneda de cambio para la salvación divina.",
                reactions: { solido: 10, persuasivo: 6, respetuoso: 8 },
                userReactions: []
            }
        ]
    }
];

export default function Debates() {
    const [debates, setDebates] = useState(INITIAL_DEBATES);
    const [selectedDebateId, setSelectedDebateId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState("Todos");
    
    // Formulario de opinión
    const [newAuthor, setNewAuthor] = useState("");
    const [newType, setNewType] = useState("pro");
    const [newText, setNewText] = useState("");

    const tags = ["Todos", "Sociedad", "Apologética", "Teología"];

    const activeDebate = debates.find(d => d.id === selectedDebateId);

    // Filtrar debates
    const filteredDebates = debates.filter(d => {
        const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              d.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = selectedTag === "Todos" || d.tag === selectedTag;
        return matchesSearch && matchesTag;
    });

    const handleReaction = (argId, reactionType) => {
        setDebates(prevDebates => 
            prevDebates.map(d => {
                if (d.id !== selectedDebateId) return d;
                
                return {
                    ...d,
                    arguments: d.arguments.map(arg => {
                        if (arg.id !== argId) return arg;
                        
                        const hasReacted = arg.userReactions?.includes(reactionType);
                        let updatedUserReactions = [...(arg.userReactions || [])];
                        let updatedReactions = { ...arg.reactions };
                        
                        if (hasReacted) {
                            updatedUserReactions = updatedUserReactions.filter(r => r !== reactionType);
                            updatedReactions[reactionType] = Math.max(0, updatedReactions[reactionType] - 1);
                        } else {
                            updatedUserReactions.push(reactionType);
                            updatedReactions[reactionType] = (updatedReactions[reactionType] || 0) + 1;
                        }

                        return {
                            ...arg,
                            reactions: updatedReactions,
                            userReactions: updatedUserReactions
                        };
                    })
                };
            })
        );
    };

    const handleAddOpinion = (e) => {
        e.preventDefault();
        if (!newAuthor.trim() || !newText.trim()) return;

        const newArgument = {
            id: Date.now(),
            author: newAuthor,
            role: "Invitado",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            roleClass: "role-contributor",
            type: newType,
            text: newText,
            reactions: { solido: 0, persuasivo: 0, respetuoso: 0 },
            userReactions: []
        };

        setDebates(prevDebates => 
            prevDebates.map(d => {
                if (d.id !== selectedDebateId) return d;
                return {
                    ...d,
                    commentsCount: d.commentsCount + 1,
                    arguments: [...d.arguments, newArgument]
                };
            })
        );

        setNewAuthor("");
        setNewText("");
    };

    if (activeDebate) {
        const proArguments = activeDebate.arguments.filter(a => a.type === 'pro');
        const contraArguments = activeDebate.arguments.filter(a => a.type === 'contra');

        return (
            <div className="debates-section">
                <button className="back-btn" onClick={() => setSelectedDebateId(null)}>
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span>Volver a la lista de debates</span>
                </button>

                <article className="debate-detail-card">
                    <span className="debate-tag">{activeDebate.tag}</span>
                    <h2 className="debate-card-title" style={{ marginTop: '0.8rem' }}>{activeDebate.title}</h2>
                    <p className="debate-card-description">{activeDebate.description}</p>
                    <div className="debate-stats">
                        <div className="debate-stat-item">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            <span>{activeDebate.arguments.length} opiniones en total</span>
                        </div>
                        <div className="debate-stat-item">
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            <span>{activeDebate.voters} participantes</span>
                        </div>
                    </div>
                </article>

                <h3 className="arguments-title">Posturas de la Comunidad</h3>

                <div className="arguments-grid">
                    {/* Columna A Favor */}
                    <div className="argument-column">
                        <div className="column-header pro">A Favor / Apoyo</div>
                        {proArguments.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No hay posturas registradas a favor todavía.</p>
                        ) : (
                            proArguments.map(arg => (
                                <div key={arg.id} className="argument-bubble">
                                    <div className="argument-author-bar">
                                        <div className="argument-author-avatar" style={{ backgroundImage: `url(${arg.avatar})` }}></div>
                                        <div>
                                            <h4 className="argument-author-name">{arg.author}</h4>
                                            <span className={`role-badge ${arg.roleClass}`} style={{ margin: 0, fontSize: '0.7rem', padding: '0.1rem 0.5rem' }}>{arg.role}</span>
                                        </div>
                                    </div>
                                    <p className="argument-text">{arg.text}</p>
                                    <div className="argument-reactions">
                                        <button 
                                            className={`reaction-btn ${(arg.userReactions || []).includes('solido') ? 'voted' : ''}`}
                                            onClick={() => handleReaction(arg.id, 'solido')}
                                        >
                                            <span>💪 Sólido</span>
                                            <strong>{arg.reactions.solido}</strong>
                                        </button>
                                        <button 
                                            className={`reaction-btn ${(arg.userReactions || []).includes('persuasivo') ? 'voted' : ''}`}
                                            onClick={() => handleReaction(arg.id, 'persuasivo')}
                                        >
                                            <span>💡 Persuasivo</span>
                                            <strong>{arg.reactions.persuasivo}</strong>
                                        </button>
                                        <button 
                                            className={`reaction-btn ${(arg.userReactions || []).includes('respetuoso') ? 'voted' : ''}`}
                                            onClick={() => handleReaction(arg.id, 'respetuoso')}
                                        >
                                            <span>🤝 Respetuoso</span>
                                            <strong>{arg.reactions.respetuoso}</strong>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Columna En Contra */}
                    <div className="argument-column">
                        <div className="column-header contra">En Contra / Crítica</div>
                        {contraArguments.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No hay posturas registradas en contra todavía.</p>
                        ) : (
                            contraArguments.map(arg => (
                                <div key={arg.id} className="argument-bubble">
                                    <div className="argument-author-bar">
                                        <div className="argument-author-avatar" style={{ backgroundImage: `url(${arg.avatar})` }}></div>
                                        <div>
                                            <h4 className="argument-author-name">{arg.author}</h4>
                                            <span className={`role-badge ${arg.roleClass}`} style={{ margin: 0, fontSize: '0.7rem', padding: '0.1rem 0.5rem' }}>{arg.role}</span>
                                        </div>
                                    </div>
                                    <p className="argument-text">{arg.text}</p>
                                    <div className="argument-reactions">
                                        <button 
                                            className={`reaction-btn ${(arg.userReactions || []).includes('solido') ? 'voted' : ''}`}
                                            onClick={() => handleReaction(arg.id, 'solido')}
                                        >
                                            <span>💪 Sólido</span>
                                            <strong>{arg.reactions.solido}</strong>
                                        </button>
                                        <button 
                                            className={`reaction-btn ${(arg.userReactions || []).includes('persuasivo') ? 'voted' : ''}`}
                                            onClick={() => handleReaction(arg.id, 'persuasivo')}
                                        >
                                            <span>💡 Persuasivo</span>
                                            <strong>{arg.reactions.persuasivo}</strong>
                                        </button>
                                        <button 
                                            className={`reaction-btn ${(arg.userReactions || []).includes('respetuoso') ? 'voted' : ''}`}
                                            onClick={() => handleReaction(arg.id, 'respetuoso')}
                                        >
                                            <span>🤝 Respetuoso</span>
                                            <strong>{arg.reactions.respetuoso}</strong>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Formulario para aportar opinion */}
                <section className="opinion-form-section">
                    <h3 className="opinion-form-title">Aportar mi Opinión a la Resistencia</h3>
                    <form onSubmit={handleAddOpinion}>
                        <div className="form-group">
                            <label htmlFor="opinion-author">Tu Nombre / Pseudónimo</label>
                            <input 
                                id="opinion-author"
                                type="text" 
                                placeholder="Ej. LectorResistente"
                                value={newAuthor}
                                onChange={(e) => setNewAuthor(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="opinion-type">Tu Postura</label>
                            <select 
                                id="opinion-type"
                                value={newType} 
                                onChange={(e) => setNewType(e.target.value)}
                            >
                                <option value="pro">A Favor / Apoyo al Manifiesto</option>
                                <option value="contra">En Contra / Crítica Constructiva</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="opinion-text">Argumento (Sé claro y respetuoso)</label>
                            <textarea 
                                id="opinion-text"
                                rows="5" 
                                placeholder="Escribe aquí tu análisis apologético o sociológico..."
                                value={newText}
                                onChange={(e) => setNewText(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn-primary">Enviar Postura</button>
                    </form>
                </section>
            </div>
        );
    }

    return (
        <div className="debates-section">
            <div className="page-header">
                <h2 className="page-title">Foro de Debates</h2>
                <p className="page-subtitle">Espacio para dialogar sobre la verdad, la teología y nuestra postura ante el mundo moderno.</p>
            </div>

            <div className="search-filter-bar">
                <div className="search-input-wrapper">
                    <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input 
                        type="text" 
                        placeholder="Buscar debate..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Buscar debates"
                    />
                </div>

                <div className="tags-filter">
                    {tags.map((tag) => (
                        <button 
                            key={tag} 
                            onClick={() => setSelectedTag(tag)}
                            className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            <div className="debates-list">
                {filteredDebates.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>No se encontraron debates que coincidan con la búsqueda.</p>
                ) : (
                    filteredDebates.map(debate => (
                        <article 
                            key={debate.id} 
                            className="debate-card" 
                            onClick={() => setSelectedDebateId(debate.id)}
                        >
                            <div className="debate-card-header">
                                <span className="debate-tag">{debate.tag}</span>
                                <div className="debate-stats">
                                    <div className="debate-stat-item">
                                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                        <span>{debate.arguments.length}</span>
                                    </div>
                                    <div className="debate-stat-item">
                                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                                        <span>{debate.voters}</span>
                                    </div>
                                </div>
                            </div>
                            <h3 className="debate-card-title">{debate.title}</h3>
                            <p className="debate-card-description">{debate.description}</p>
                            <span className="btn-outline" style={{ display: 'inline-block', width: 'auto' }}>Entrar al Debate</span>
                        </article>
                    ))
                )}
            </div>
        </div>
    );
}
