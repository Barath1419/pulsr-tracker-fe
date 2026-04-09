type Day = "yesterday" | "today" | "tomorrow";

interface Props {
  selected: Day;
  onChange: (day: Day) => void;
}

const tabs: { key: Day; label: string }[] = [
  { key: "yesterday", label: "Yesterday" },
  { key: "today", label: "Today" },
  { key: "tomorrow", label: "Tomorrow" },
];

export default function DayTabs({ selected, onChange }: Props) {
  return (
    <nav className="hidden md:flex gap-6 items-center h-full">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`text-sm tracking-tight transition-colors ${
            selected === tab.key
              ? "text-p-primary font-bold border-b-2 border-p-primary pb-1"
              : "text-p-on-surface-variant hover:text-p-on-surface font-normal"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
