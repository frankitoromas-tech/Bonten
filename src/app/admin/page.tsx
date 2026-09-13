import { getSiteMetadata, getLibraryDocuments } from '@/lib/data/runtimeStore';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const metadata = getSiteMetadata();
  const documents = getLibraryDocuments();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>Panel de Control</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
            PRODUCCIÓN SECTOR BONTEN
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Bienvenido, Fireboy. Gestiona metadatos del sitio, publicaciones y monitorea la seguridad perimetral.
        </p>
      </div>

      <AdminDashboard initialMetadata={metadata} initialDocuments={documents} />
    </div>
  );
}
