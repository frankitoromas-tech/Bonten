'use client';

import { usePathname } from 'next/navigation';
import { AdminHeader } from './AdminHeader';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="admin-shell selection:bg-sky-500 selection:text-white">
      <AdminHeader />
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
