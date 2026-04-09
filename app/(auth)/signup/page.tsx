import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthCard from "@/components/auth/AuthCard";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-p-surface text-p-on-surface flex flex-col">
      <Navbar />
      <AuthCard
        title="Create your Pulsr account"
        subtitle="Enter your details to start curating your time."
      >
        <SignupForm />
      </AuthCard>
      <Footer />
    </div>
  );
}
