import Link from "next/link";
import PulsrButton from "@/components/ui/PulsrButton";
import Container from "@/components/ui/Container";
import TimelinePreview from "./TimelinePreview";

export default function HeroSection() {
  return (
    <section className="pt-40 pb-20 px-6">
      <Container className="flex flex-col items-center text-center overflow-visible">
        <h1 className="block text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-[1.2] pb-[0.15em] overflow-visible bg-gradient-to-b from-p-on-surface to-p-on-surface-variant bg-clip-text text-transparent">
          See where your time <br /> actually goes
        </h1>
        <p className="text-p-on-surface-variant text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-light">
          Track your day as a timeline — from waking up to going to bed.
          Experience time tracking designed for deep work, not just databases.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-20">
          <Link href="/signup"><PulsrButton size="lg">Get Started</PulsrButton></Link>
          <PulsrButton variant="secondary" size="lg">
            Try Demo
          </PulsrButton>
        </div>

        <TimelinePreview />
      </Container>
    </section>
  );
}
