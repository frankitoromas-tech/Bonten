'use client';

import { useState } from 'react';
import type { SiteMetadata } from '@/lib/data/runtimeStore';
import type { LibraryDocument, Debate } from '@/types';
import { AdminCopilot } from './AdminCopilot';
import { MetadataEditor } from './MetadataEditor';
import { DebatesEditor } from './DebatesEditor';
import { LibraryEditor } from './LibraryEditor';
import { SecurityMonitor } from './SecurityMonitor';
import { AdminTeamManager } from './AdminTeamManager';

interface Props {
  initialMetadata: SiteMetadata;
  initialDocuments: LibraryDocument[];
  initialDebates: Debate[];
}

type TabKey = 'copilot' | 'metadata' | 'debates' | 'library' | 'team' | 'security';

export function AdminDashboard({ initialMetadata, initialDocuments, initialDebates }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('copilot');
  const [metadata, setMetadata] = useState<SiteMetadata>(initialMetadata);

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'copilot', label: 'Copilot IA', icon: '🤖' },
    { key: 'metadata', label: 'Contenido', icon: '🏷️' },
    { key: 'debates', label: 'Debates', icon: '💬' },
    { key: 'library', label: 'Biblioteca', icon: '📚' },
    { key: 'team', label: 'Equipo', icon: '👥' },
    { key: 'security', label: 'Seguridad', icon: '🛡️' },
  ];

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    if (typeof window !== 'undefined' && (window as unknown as { bontenAudio?: { playTactilePop: () => void } }).bontenAudio) {
      (window as unknown as { bontenAudio: { playTactilePop: () => void } }).bontenAudio.playTactilePop();
    }
  };

  return (
    <div className="space-y-6">
      {/* Segmented Dock Navigation */}
      <div className="flex justify-center sm:justify-start">
        <nav className="admin-dock" aria-label="Secciones de administración">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={`admin-dock-item ${activeTab === tab.key ? 'active' : ''}`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="transition-all duration-300">
        {activeTab === 'copilot' && (
          <AdminCopilot onMetadataUpdated={(updated) => setMetadata(updated)} />
        )}
        {activeTab === 'metadata' && (
          <MetadataEditor initialMetadata={metadata} />
        )}
        {activeTab === 'debates' && (
          <DebatesEditor initialDebates={initialDebates} />
        )}
        {activeTab === 'library' && (
          <LibraryEditor initialDocuments={initialDocuments} />
        )}
        {activeTab === 'team' && (
          <AdminTeamManager />
        )}
        {activeTab === 'security' && (
          <SecurityMonitor />
        )}
      </div>
    </div>
  );
}
