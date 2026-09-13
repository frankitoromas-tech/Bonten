import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'BONTEN | Panel de Administración Seguro',
  description: 'Gestión de metadatos, biblioteca y telemetría de seguridad para Fireboy.',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060b18] text-slate-100 selection:bg-cyan-500 selection:text-black">
      <header className="sticky top-0 z-40 bg-[#060b18]/90 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🛡️</span>
            <div>
              <Link href="/admin" className="font-bold text-sm tracking-wide text-white hover:text-cyan-400 transition-colors">
                BONTEN // ADMIN PANEL
              </Link>
              <div className="text-[10px] font-mono text-cyan-400">EDGE CRYPTO GUARD // ROLE_SUPERADMIN</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-mono text-slate-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Ver Sitio Público</span>
              <span>↗</span>
            </Link>
            <form action="/api/admin/logout" method="POST">
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg text-xs font-mono bg-rose-950/40 text-rose-300 border border-rose-500/30 hover:bg-rose-900/40 transition-colors"
              >
                Cerrar Sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
