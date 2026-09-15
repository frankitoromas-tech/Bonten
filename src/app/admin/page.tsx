import { getSiteMetadata, getLibraryDocuments, getStoreDebates } from '@/lib/data/runtimeStore';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const metadata = getSiteMetadata();
  const documents = getLibraryDocuments();
  const debates = getStoreDebates();

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Cabecera Minimalista de Gobernanza & Fireboy Superadmin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Perímetro Seguro Activo
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10">
              👑 Superadmin: <strong className="text-amber-500 dark:text-amber-400 ml-1">Fireboy</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--title-color)] tracking-tight">
            Centro de Control & Gobernanza
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">
            Consola administrativa unificada y minimalista de BONTEN: biblioteca doctrinal, debates, gestión de miembros y telemetría de ciberseguridad.
          </p>
        </div>
      </div>

      <AdminDashboard
        initialMetadata={metadata}
        initialDocuments={documents}
        initialDebates={debates}
      />
    </div>
  );
}
