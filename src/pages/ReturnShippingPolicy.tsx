const ReturnShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-background py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Return &amp; Shipping Policy</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We are committed to delivering safe, certified electrical products and ensuring a hassle-free resolution if something is not right.
          </p>
        </header>

        <section className="mt-16 rounded-3xl border border-border/60 bg-card/70 p-8 shadow-sm sm:p-10">
          <h2 className="text-2xl font-semibold">Electrical Wires Return Policy</h2>
          <div className="mt-6 space-y-6 text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Return Window:</span> 7 days from delivery.
            </p>
            <div>
              <h3 className="text-base font-semibold text-foreground">Acceptable with Proof</h3>
              <ul className="mt-2 list-disc space-y-2 pl-6">
                <li>Wrong item or incorrect size supplied (photo evidence required).</li>
                <li>Transit damage reported with supporting photos or videos on delivery.</li>
                <li>Verified manufacturing defects supported by clear documentation.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Non-Returnable</h3>
              <ul className="mt-2 list-disc space-y-2 pl-6">
                <li>Used, cut, or custom-length wires tailored for your project.</li>
                <li>Opened rolls or packaging that compromises insulation integrity.</li>
                <li>Packaging damaged due to improper storage after delivery.</li>
              </ul>
            </div>
            <p>
              <span className="font-medium text-foreground">Crucial Note:</span> For electrical safety, only sealed rolls are returnable.
            </p>
            <p>
              <span className="font-medium text-foreground">Resolution:</span> Full refund if the order has not shipped. For delivered goods that meet the criteria, we offer replacement or store credit after inspection.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReturnShippingPolicy;
