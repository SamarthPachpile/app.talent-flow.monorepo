const STATS = [
  { value: "26", label: "Countries" },
  { value: "32,000+", label: "People worldwide" },
  { value: "67", label: "Offices globally" },
];

export default function CareersStats() {
  return (
    <section
      id="stats"
      data-section="stats"
      data-label="Stats"
      className="bg-[#ff5f2e] text-primary-foreground py-12 sm:py-16"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 grid grid-cols-3 gap-6 text-center">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="text-4xl sm:text-6xl md:text-7xl">{s.value}</div>
            <div className="text-xs sm:text-sm uppercase tracking-[0.18em] mt-2 opacity-90">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
