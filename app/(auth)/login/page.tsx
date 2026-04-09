import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-p-surface text-p-on-surface flex flex-col">
      <Navbar />
      <AuthCard
        title="Welcome back"
        subtitle="Continue your curated work session."
      >
        <LoginForm />
      </AuthCard>
      <Footer />
    </div>
  );
}
