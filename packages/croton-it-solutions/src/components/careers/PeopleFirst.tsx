export default function PeopleFirst() {
  return (
    <section
      id="culture"
      data-section="culture"
      data-label="Culture"
      className="max-w-[1600px] mx-auto px-4 sm:px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
    >
      <div className="aspect-[4/3] clip-path-card bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop')] bg-cover bg-center" />

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Our culture</p>

        <h2 className="text-3xl sm:text-7xl mb-5">
          At Croton, we put <span className="text-primary">people first.</span>
        </h2>

        <p className="text-muted-foreground mb-4">
          Senior teams. Outcome-led work. A real investment in your craft. We hire smart, curious
          humans and give them the trust, mentorship and projects to do the best work of their
          careers.
        </p>

        <ul className="space-y-2 text-sm">
          <li>• Learning budget for certifications and conferences</li>
          <li>• Mentorship from CRM & AI architects with 15+ years of experience</li>
          <li>• Flexible, remote-friendly work across India and APAC</li>
          <li>• Health, wellness and family support that actually shows up</li>
        </ul>
      </div>
    </section>
  );
}
