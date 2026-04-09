import Link from "next/link";
import Container from "@/components/ui/Container";
import PulsrButton from "@/components/ui/PulsrButton";

const navLinks = [
  { label: "Product", href: "#", active: true },
  { label: "Features", href: "#" },
  { label: "Pricing", href: "#" },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-p-surface/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(231,229,229,0.06)]">
      <Container className="flex justify-between items-center h-20">
        {/* Logo */}
        <span className="text-xl font-bold tracking-tighter text-p-on-surface">
          Pulsr
        </span>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-300 active:scale-95 ${
                link.active
                  ? "text-p-primary"
                  : "text-p-on-surface-variant hover:text-p-on-surface"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <PulsrButton variant="ghost" size="sm">
              Login
            </PulsrButton>
          </Link>
          <Link href="/signup">
            <PulsrButton size="sm">Get Started</PulsrButton>
          </Link>
        </div>
      </Container>
    </nav>
  );
}
