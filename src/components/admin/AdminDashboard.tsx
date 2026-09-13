'use client';

import { useState } from 'react';
import type { SiteMetadata } from '@/lib/data/runtimeStore';
import type { LibraryDocument } from '@/types';
import { MetadataEditor } from './MetadataEditor';
import { LibraryEditor } from './LibraryEditor';
import { SecurityMonitor } from './SecurityMonitor';
import { AdminTeamManager } from './AdminTeamManager';

interface Props {
  initialMetadata: SiteMetadata;
  initialDocuments: LibraryDocument[];
}

type TabKey = 'metadata' | 'library' | 'team' | 'security';

export function AdminDashboard({ initialMetadata, initialDocuments }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('metadata');

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'metadata', label: 'Metadatos & Fireboy', icon: '🔥' },
    { key: 'library', label: 'Biblioteca & Ensayos', icon: '📚' },
    { key: 'team', label: 'Equipo & Roles (RBAC)', icon: '👥' },
    { key: 'security', label: 'Seguridad & Telemetría', icon: '🛡️' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-900/40 text-slate-400 border border-transparent hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="transition-all duration-300">
        {activeTab === 'metadata' && <MetadataEditor initialMetadata={initialMetadata} />}
        {activeTab === 'library' && <LibraryEditor initialDocuments={initialDocuments} />}
        {activeTab === 'team' && <AdminTeamManager />}
        {activeTab === 'security' && <SecurityMonitor />}
      </div>
    </div>
  );
}
