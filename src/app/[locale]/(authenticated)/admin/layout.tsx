import { AdminGuard } from '@/components/admin/admin-guard';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { requireAdmin } from '@/lib/admin-auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificar se o usuário é admin (já está autenticado pelo layout pai)
  await requireAdmin();

  return (
    <AdminGuard>
      <SidebarProvider>
        <div className="flex h-full">
          <AdminSidebar />
          <SidebarInset className="flex-1">
            <div className="flex flex-1 flex-col">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AdminGuard>
  );
} 