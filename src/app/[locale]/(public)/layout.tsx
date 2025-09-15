import Navigation from '@/components/locale/Navigation';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 