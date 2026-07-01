import React from 'react';

export default function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
      <div className="bonten-spinner" role="status" aria-label="Cargando" />
    </div>
  );
}
