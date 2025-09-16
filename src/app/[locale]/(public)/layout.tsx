import Navigation from '@/components/locale/Navigation';
import { auth } from '@/lib/auth';
import { Role } from '@/store/userDataStore';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = session?.user?.role as Role | null || null;

  return (
    <div className="flex h-full flex-col">
      <Navigation clientRole={role} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 