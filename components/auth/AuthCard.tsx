interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <main className="flex-grow flex items-center justify-center px-6 pt-24 pb-12 relative overflow-hidden">
      {/* Atmospheric glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-p-secondary/5 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-[440px] glass-panel rounded-xl p-8 md:p-12 shadow-[0_24px_48px_rgba(231,229,229,0.04)] animate-in fade-in zoom-in duration-500">
        <header className="mb-10 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-p-on-surface mb-2">
            {title}
          </h1>
          <p className="text-p-on-surface-variant text-sm">{subtitle}</p>
        </header>
        {children}
      </div>
    </main>
  );
}
