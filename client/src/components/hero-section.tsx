import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative bg-primary-dark">
      {/* Hero background image */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=600" 
          alt="Eco-friendly marketplace" 
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white font-heading sm:text-5xl lg:text-6xl">
          Shop Sustainably. Live Responsibly.
        </h1>
        <p className="mt-6 max-w-3xl text-xl text-neutral-lightest">
          Find eco-friendly products from local sellers or list your own sustainable items on EcoFinds - the marketplace for environmentally conscious shopping.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link href="/products">
            <Button size="lg" className="bg-accent hover:bg-accent-dark">
              Browse Products
            </Button>
          </Link>
          <Link href="/create-listing">
            <Button size="lg" variant="outline" className="text-primary bg-white hover:bg-neutral-light">
              Start Selling
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
