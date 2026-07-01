'use client';
import React, { useState, useEffect } from 'react';
import { INITIAL_DEBATES, DEBATE_TAGS } from '@/data/debates';
import type { Debate, DebateArgument, ReactionType, ArgumentStance } from '@/types';

const STORAGE_KEY = 'bonten:debates';

const REACTIONS: { key: ReactionType; label: string }[] = [
  { key: 'solido', label: '💪 Sólido' },
  { key: 'persuasivo', label: '💡 Persuasivo' },
  { key: 'respetuoso', label: '🤝 Respetuoso' },
];

// -----------------------------------------------------------------------------
// Subcomponente: burbuja de argumento (antes duplicado para pro y contra).
// -----------------------------------------------------------------------------
interface ArgumentBubbleProps {
  arg: DebateArgument;
  onReact: (argId: number, reaction: ReactionType) => void;
}

function ArgumentBubble({ arg, onReact }: ArgumentBubbleProps) {
  return (
    <div className="argument-bubble">
      <div className="argument-author-bar">
        <div className="argument-author-avatar" style={{ backgroundImage: `url(${arg.avatar})` }} />
        <div>
          <h4 className="argument-author-name">{arg.author}</h4>
          <span className={`role-badge ${arg.roleClass}`} style={{ margin: 0, fontSize: '0.7rem', padding: '0.1rem 0.5rem' }}>
            {arg.role}
          </span>
        </div>
      </div>
      <p className="argument-text">{arg.text}</p>
      <div className="argument-reactions">
        {REACTIONS.map((r) => (
          <button
            key={r.key}
            className={`reaction-btn ${arg.userReactions.includes(r.key) ? 'voted' : ''}`}
            onClick={() => onReact(arg.id, r.key)}
            aria-pressed={arg.userReactions.includes(r.key)}
          >
            <span>{r.label}</span>
            <strong>{arg.reactions[r.key]}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Componente principal
// -----------------------------------------------------------------------------
export default function Debates() {
  const [debates, setDebates] = useState<Debate[]>(INITIAL_DEBATES);
  const [hydrated, setHydrated] = useState(false);
  const [selectedDebateId, setSelectedDebateId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('Todos');

  // Formulario de opinión
  const [newAuthor, setNewAuthor] = useState('');
  const [newType, setNewType] = useState<ArgumentStance>('pro');
  const [newText, setNewText] = useState('');

  // Carga el estado persistido tras el montaje (evita desajuste de hidratación).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setDebates(JSON.parse(saved) as Debate[]);
    } catch {
      /* almacenamiento no disponible: se usan los datos por defecto */
    }
    setHydrated(true);
  }, []);

  // Persiste los cambios (reacciones y nuevas opiniones) del usuario.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(debates));
    } catch {
      /* sin persistencia disponible */
    }
  }, [debates, hydrated]);

  const activeDebate = debates.find((d) => d.id === selectedDebateId);

  const filteredDebates = debates.filter((d) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
    const matchesTag = selectedTag === 'Todos' || d.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  const handleReaction = (argId: number, reactionType: ReactionType) => {
    setDebates((prev) =>
      prev.map((d) => {
        if (d.id !== selectedDebateId) return d;
        return {
          ...d,
          arguments: d.arguments.map((arg) => {
            if (arg.id !== argId) return arg;
            const hasReacted = arg.userReactions.includes(reactionType);
            const userReactions = hasReacted
              ? arg.userReactions.filter((r) => r !== reactionType)
              : [...arg.userReactions, reactionType];
            const reactions = {
              ...arg.reactions,
              [reactionType]: Math.max(0, arg.reactions[reactionType] + (hasReacted ? -1 : 1)),
            };
            return { ...arg, reactions, userReactions };
          }),
        };
      })
    );
  };

  const handleAddOpinion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newText.trim()) return;

    const newArgument: DebateArgument = {
      id: Date.now(),
      author: newAuthor,
      role: 'Invitado',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      roleClass: 'role-contributor',
      type: newType,
      text: newText,
      reactions: { solido: 0, persuasivo: 0, respetuoso: 0 },
      userReactions: [],
    };

    setDebates((prev) =>
      prev.map((d) =>
        d.id !== selectedDebateId
          ? d
          : { ...d, commentsCount: d.commentsCount + 1, arguments: [...d.arguments, newArgument] }
      )
    );

    setNewAuthor('');
    setNewText('');
  };

  // ---------------------------------------------------------------------------
  // Vista de detalle de un debate
  // ---------------------------------------------------------------------------
  if (activeDebate) {
    const proArguments = activeDebate.arguments.filter((a) => a.type === 'pro');
    const contraArguments = activeDebate.arguments.filter((a) => a.type === 'contra');

    return (
      <div className="debates-section">
        <button className="back-btn" onClick={() => setSelectedDebateId(null)}>
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Volver a la lista de debates</span>
        </button>

        <article className="debate-detail-card">
          <span className="debate-tag">{activeDebate.tag}</span>
          <h2 className="debate-card-title" style={{ marginTop: '0.8rem' }}>
            {activeDebate.title}
          </h2>
          <p className="debate-card-description">{activeDebate.description}</p>
          <div className="debate-stats">
            <div className="debate-stat-item">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>{activeDebate.arguments.length} opiniones en total</span>
            </div>
            <div className="debate-stat-item">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>{activeDebate.voters} participantes</span>
            </div>
          </div>
        </article>

        <h3 className="arguments-title">Posturas de la Comunidad</h3>

        <div className="arguments-grid">
          <div className="argument-column">
            <div className="column-header pro">A Favor / Apoyo</div>
            {proArguments.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                No hay posturas registradas a favor todavía.
              </p>
            ) : (
              proArguments.map((arg) => <ArgumentBubble key={arg.id} arg={arg} onReact={handleReaction} />)
            )}
          </div>

          <div className="argument-column">
            <div className="column-header contra">En Contra / Crítica</div>
            {contraArguments.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                No hay posturas registradas en contra todavía.
              </p>
            ) : (
              contraArguments.map((arg) => <ArgumentBubble key={arg.id} arg={arg} onReact={handleReaction} />)
            )}
          </div>
        </div>

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
              <select id="opinion-type" value={newType} onChange={(e) => setNewType(e.target.value as ArgumentStance)}>
                <option value="pro">A Favor / Apoyo al Manifiesto</option>
                <option value="contra">En Contra / Crítica Constructiva</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="opinion-text">Argumento (Sé claro y respetuoso)</label>
              <textarea
                id="opinion-text"
                rows={5}
                placeholder="Escribe aquí tu análisis apologético o sociológico..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Enviar Postura
            </button>
          </form>
        </section>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Vista de lista de debates
  // ---------------------------------------------------------------------------
  return (
    <div className="debates-section">
      <div className="page-header">
        <h2 className="page-title">Foro de Debates</h2>
        <p className="page-subtitle">
          Espacio para dialogar sobre la verdad, la teología y nuestra postura ante el mundo moderno.
        </p>
      </div>

      <div className="search-filter-bar">
        <div className="search-input-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
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
          {DEBATE_TAGS.map((tag) => (
            <button key={tag} onClick={() => setSelectedTag(tag)} className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="debates-list">
        {filteredDebates.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
            No se encontraron debates que coincidan con la búsqueda.
          </p>
        ) : (
          filteredDebates.map((debate) => (
            <article
              key={debate.id}
              className="debate-card"
              onClick={() => setSelectedDebateId(debate.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedDebateId(debate.id);
                }
              }}
            >
              <div className="debate-card-header">
                <span className="debate-tag">{debate.tag}</span>
                <div className="debate-stats">
                  <div className="debate-stat-item">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>{debate.arguments.length}</span>
                  </div>
                  <div className="debate-stat-item">
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                    <span>{debate.voters}</span>
                  </div>
                </div>
              </div>
              <h3 className="debate-card-title">{debate.title}</h3>
              <p className="debate-card-description">{debate.description}</p>
              <span className="btn-outline" style={{ display: 'inline-block', width: 'auto' }}>
                Entrar al Debate
              </span>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
