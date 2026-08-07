const worldMap = "/assets/world-map.jpg";

export default function WorldMapSection() {
  return (
    <section
      id="global"
      data-section="global"
      data-label="Global"
      className="py-16 sm:py-20 bg-gl-navy"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div>
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-primary-foreground/60 mb-3 sm:mb-4">
              Global delivery
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-primary-foreground mb-3 sm:mb-4">
              CRM partners on every continent your customers live on
            </h2>
            <p className="text-sm text-primary-foreground/60 mb-6 max-w-md">
              With delivery hubs across India, the UK, the US and the GCC, Graviton gives you
              follow-the-sun CRM expertise for every time zone.
            </p>
            <a href="/about" className="text-sm text-primary hover:underline">
              View locations →
            </a>
          </div>
          <div>
            <img
              src={worldMap}
              alt="Graviton worldwide locations"
              className="w-full rounded-xl"
              loading="lazy"
              width={1920}
              height={800}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
