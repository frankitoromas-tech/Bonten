import { getSiteMetadata, getLibraryDocuments, getStoreDebates } from '@/lib/data/runtimeStore';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const metadata = getSiteMetadata();
  const documents = getLibraryDocuments();
  const debates = getStoreDebates();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--title-color)] tracking-tight">
            Gobernanza Doctrinal & Operativa
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Supervisión de biblioteca, manifiesto, debates en vivo y telemetría perimetral.
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
