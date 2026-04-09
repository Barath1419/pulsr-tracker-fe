import Container from "@/components/ui/Container";

const features = [
  {
    icon: "mic",
    iconColor: "text-p-secondary",
    title: "Log your day in seconds",
    desc: "Use natural language or voice to describe your activity. Pulsr categorizes it instantly using AI context awareness.",
    span: "md:col-span-8",
    bg: "bg-p-surface-container-low",
    preview: (
      <div className="mt-12 bg-p-surface-container-lowest p-4 rounded-xl border border-p-outline-variant/15 flex items-center gap-4">
        <div className="w-2 h-2 rounded-full bg-p-secondary animate-pulse" />
        <span className="text-p-on-surface-variant italic text-sm">
          &quot;Spent two hours on the brand deck...&quot;
        </span>
      </div>
    ),
  },
  {
    icon: "view_timeline",
    iconColor: "text-p-tertiary",
    title: "Your day as a timeline",
    desc: "A beautiful, editorial view of your hours. See the flow of your energy through visual blocks.",
    span: "md:col-span-4",
    bg: "bg-p-surface-container-high",
  },
  {
    icon: "query_stats",
    iconColor: "text-p-error-dim",
    title: "Find your patterns",
    desc: "Deep analytics that reveal where you're losing focus and when you're most productive.",
    span: "md:col-span-4",
    bg: "bg-p-surface-container-high",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="py-24 px-6 bg-p-surface-container-lowest/30">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Top 3 features */}
          {features.map((f) => (
            <div
              key={f.title}
              className={`${f.span} ${f.bg} rounded-[1.5rem] p-10 flex flex-col justify-between border border-p-outline-variant/10`}
            >
              <div>
                <span className={`material-symbols-outlined text-4xl mb-6 ${f.iconColor}`}>
                  {f.icon}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-p-on-surface">
                  {f.title}
                </h3>
                <p className="text-p-on-surface-variant leading-relaxed max-w-md">
                  {f.desc}
                </p>
              </div>
              {f.preview}
            </div>
          ))}

          {/* Quote card */}
          <div className="md:col-span-8 bg-p-surface-container-low rounded-[1.5rem] p-10 flex flex-col justify-center items-center text-center border border-p-outline-variant/10 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-4xl font-bold tracking-tighter mb-4 italic text-p-on-surface">
                No friction, just flow.
              </h3>
              <p className="text-p-on-surface-variant max-w-sm mx-auto">
                Designed to be invisible. Pulsr stays out of your way so you
                can stay in the zone.
              </p>
            </div>
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-p-primary via-transparent to-transparent" />
          </div>
        </div>
      </Container>
    </section>
  );
}
