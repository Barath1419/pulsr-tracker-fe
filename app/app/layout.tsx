import AppSidebar from "@/components/app/AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-p-surface text-p-on-surface">
      <AppSidebar />
      {children}
    </div>
  );
}
