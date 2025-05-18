import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function CallToAction() {
  const { user } = useAuth();

  return (
    <section className="bg-primary">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white font-heading sm:text-4xl">
          <span className="block">Ready to start selling?</span>
          <span className="block text-accent-light">Join our eco-friendly marketplace today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          {user ? (
            <div className="inline-flex rounded-md shadow">
              <Link href="/create-listing">
                <Button size="lg" className="bg-white text-primary hover:bg-neutral-light">
                  Create Listing
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="inline-flex rounded-md shadow">
                <Link href="/auth?tab=register">
                  <Button size="lg" className="bg-white text-primary hover:bg-neutral-light">
                    Create Account
                  </Button>
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link href="/about">
                  <Button size="lg" variant="outline" className="text-white bg-primary-dark hover:bg-primary-dark border-white">
                    Learn More
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
