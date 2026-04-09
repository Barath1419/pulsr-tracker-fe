import Container from "@/components/ui/Container";

const footerLinks = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "Support", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-p-surface w-full py-12 border-t border-p-outline-variant/15">
      <Container className="flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="text-[0.6875rem] uppercase tracking-[0.05em] text-p-on-surface-variant">
          © {new Date().getFullYear()} Pulsr. The Digital Curator.
        </span>
        <div className="flex gap-8">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[0.6875rem] uppercase tracking-[0.05em] text-p-on-surface-variant hover:text-p-primary transition-colors opacity-80 hover:opacity-100"
            >
              {link.label}
            </a>
          ))}
        </div>
      </Container>
    </footer>
  );
}
