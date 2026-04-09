import Container from "@/components/ui/Container";
import PulsrButton from "@/components/ui/PulsrButton";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-32 px-6">
      <Container>
        <div className="bg-p-surface-container-high rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden border border-p-outline-variant/10">
          {/* Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-p-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6 text-p-on-surface">
              Start tracking your day
            </h2>
            <p className="text-p-on-surface-variant text-lg mb-10 max-w-lg mx-auto">
              Join thousands of curators who treat their time with the respect
              it deserves.
            </p>
            <Link href="/signup">
              <PulsrButton size="lg">Create Account</PulsrButton>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
