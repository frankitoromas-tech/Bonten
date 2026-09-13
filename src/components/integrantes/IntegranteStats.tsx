import React from 'react';
import type { MemberDetails } from '@/types';

interface IntegranteStatsProps {
  details: MemberDetails;
}

export default function IntegranteStats({ details }: IntegranteStatsProps) {
  return (
    <section className="integrante-meta-grid">
      <div className="debate-detail-card" style={{ margin: 0, padding: 'clamp(1.2rem, 3vw, 2rem)' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--title-color)', marginBottom: '1.2rem', fontWeight: 800 }}>
          Métricas de Participación
        </h2>
        <div className="stats-grid" style={{ marginTop: '0.5rem' }}>
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
      </div>

      <div className="debate-detail-card" style={{ margin: 0, padding: 'clamp(1.2rem, 3vw, 2rem)' }}>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--title-color)', marginBottom: '1.2rem', fontWeight: 800 }}>
          Trayectoria y Aportes en BONTEN
        </h2>
        <div className="activity-list">
          {details.activities.map((act) => (
            <div key={act.id} className="activity-item">
              <div className="activity-dot" />
              <div className="activity-text" dangerouslySetInnerHTML={{ __html: act.text }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
