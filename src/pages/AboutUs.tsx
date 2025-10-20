const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background py-16">
      <div className="container mx-auto px-4">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">About Us</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            To provide top-quality electrical wiring solutions with an unwavering commitment to safety, reliability, and customer satisfaction.
          </p>
        </section>

        <section className="mt-16 grid gap-10 md:grid-cols-[1.2fr_1fr] items-start">
          <div className="space-y-6 rounded-3xl border border-border/60 bg-card/70 p-8 shadow-sm sm:p-10">
            <h2 className="text-2xl font-semibold">Our Mission and Expertise</h2>
            <p className="text-muted-foreground">
              Founded by engineers who witnessed first-hand the risk of inferior cabling, WireBazaar was created to raise the standard for electrical safety across residential, commercial, and industrial projects. Our team brings decades of manufacturing partnerships, installation experience, and compliance knowledge to help every customer select the right product with confidence.
            </p>
            <p className="text-muted-foreground">
              From the first enquiry to final delivery, we ensure every order is vetted for authenticity, backed by robust technical support, and monitored through audited logistics networks that keep your projects on schedule.
            </p>
            <div>
              <h3 className="text-xl font-semibold">Why Choose Us?</h3>
              <ul className="mt-4 list-disc space-y-3 pl-6 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Quality Assurance:</span> Multistage inspections, BIS-certified partners, and traceable batches for every reel.
                </li>
                <li>
                  <span className="font-medium text-foreground">Expert Support:</span> Application specialists who translate your load calculations and compliance needs into precise recommendations.
                </li>
                <li>
                  <span className="font-medium text-foreground">Fast Shipping:</span> Priority dispatch from regional hubs with proactive delivery alerts for time-critical projects.
                </li>
              </ul>
            </div>
          </div>

          <aside className="rounded-3xl border border-border/40 bg-background/70 p-8 shadow-sm">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">Founding Principles</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Safety-first, transparency in sourcing, and relentless customer advocacy guide every decision we make.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Core Expertise</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Power distribution, fire-survivable cabling, automation wiring, and smart infrastructure retrofits for modern facilities.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
