import { Button } from "@/components/ui/button";
import { Cable, ChevronRight, Shield, Zap, Award, UserCog, ShoppingCart, Quote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOwnerAuth } from "@/context/OwnerAuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useOwnerAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              className="gap-2 text-sm text-foreground"
              onClick={() => navigate("/orders")}
            >
              My Orders
            </Button>
            <Button
              variant="ghost"
              className="gap-2 text-sm text-foreground"
              onClick={() => navigate(isAuthenticated ? "/owner" : "/owner/login")}
            >
              <UserCog className="h-4 w-4" />
              Owner Dashboard
            </Button>
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-accent/50 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-accent-foreground/10">
              <Zap className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium text-foreground">Instant Quotes, Direct Ordering, Verified Quality</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent leading-tight">
              WireBazaar - Your Trusted Marketplace
            </h1>

            <p className="text-xl md:text-2xl text-foreground mb-10 max-w-2xl mx-auto">
              Shop directly or request custom quotes. Fast delivery, competitive pricing, and verified suppliers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate("/products")}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Shop Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate("/inquiry")}
              >
                Request Quote
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-20 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-background/50 border border-border hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl mb-4">
                <Cable className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-foreground">
                All major brands and specifications in one place
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-background/50 border border-border hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl mb-4">
                <Shield className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Rates</h3>
              <p className="text-foreground">
                Only authenticated suppliers and competitive prices
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-background/50 border border-border hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4">
                <Award className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Response</h3>
              <p className="text-foreground">
                Get quotes within minutes from multiple suppliers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-foreground">
              We are trusted by engineers, contractors, and businesses across India for reliable wiring solutions.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="group rounded-3xl border border-border/70 bg-background/80 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <Quote className="h-10 w-10 text-primary/80" />
              <p className="mt-6 text-lg font-medium">
                “Excellent quality and on-time delivery.”
              </p>
              <p className="mt-4 text-sm text-muted-foreground">R. Sharma, Pune</p>
            </div>
            <div className="group rounded-3xl border border-border/70 bg-background/80 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <Quote className="h-10 w-10 text-primary/80" />
              <p className="mt-6 text-lg font-medium">
                “The best wires for my project. Highly recommended.”
              </p>
              <p className="mt-4 text-sm text-muted-foreground">A. Patel, Mumbai</p>
            </div>
            <div className="group rounded-3xl border border-border/70 bg-background/80 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <Quote className="h-10 w-10 text-primary/80" />
              <p className="mt-6 text-lg font-medium">
                “Great customer support helped me choose the right product.”
              </p>
              <p className="mt-4 text-sm text-muted-foreground">S. Singh, Delhi</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Browse our catalog for instant ordering or request a custom quote for bulk requirements
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto shadow-lg"
                onClick={() => navigate("/products")}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Browse Products
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto shadow-lg"
                onClick={() => navigate("/inquiry")}
              >
                Get Custom Quote
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
