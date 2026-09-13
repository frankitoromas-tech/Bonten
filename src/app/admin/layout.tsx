import type { Metadata } from 'next';
import { AdminShell } from '@/components/admin/AdminShell';

export const metadata: Metadata = {
  title: 'BONTEN | Panel de Administración Seguro',
  description: 'Gestión de metadatos, biblioteca y telemetría de seguridad para Fireboy.',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
