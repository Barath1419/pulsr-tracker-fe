import AppSidebar from "@/components/app/AppSidebar";
import AppTopBar from "@/components/app/AppTopBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-p-surface text-p-on-surface">
      <AppTopBar />
      <AppSidebar />
      {children}
    </div>
  );
}
