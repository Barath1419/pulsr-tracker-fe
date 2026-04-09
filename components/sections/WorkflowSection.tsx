import Container from "@/components/ui/Container";

const steps = [
  {
    number: "1",
    title: "Capture",
    desc: "Jot down what you're doing in one sentence. We handle the timestamps and project linking.",
  },
  {
    number: "2",
    title: "Visualize",
    desc: "Watch your day transform into a colorful, structured timeline. Spot gaps and overlaps instantly.",
  },
  {
    number: "3",
    title: "Refine",
    desc: "Review weekly summaries that prioritize insights over raw data. Curate your time like a pro.",
  },
];

export default function WorkflowSection() {
  return (
    <section className="py-32 px-6">
      <Container>
        <div className="mb-20">
          <h2 className="text-4xl font-extrabold tracking-tighter mb-4 text-p-on-surface">
            The Editorial Workflow
          </h2>
          <p className="text-p-on-surface-variant max-w-md">
            Simplicity is the ultimate sophistication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <span className="text-8xl font-black text-p-surface-container-high absolute -top-10 -left-6 z-0 select-none">
                {step.number}
              </span>
              <div className="relative z-10">
                <h4 className="text-xl font-bold mb-4 text-p-on-surface">
                  {step.title}
                </h4>
                <p className="text-p-on-surface-variant font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
