import { Earth, Users, Recycle } from "lucide-react";

export function FeatureSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-darkest font-heading">Why Choose EcoFinds?</h2>
          <p className="mt-4 text-xl text-neutral-dark max-w-3xl mx-auto">Join our community of eco-conscious buyers and sellers making a difference.</p>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-light bg-opacity-10 text-primary">
              <Earth className="h-8 w-8" />
            </div>
            <h3 className="mt-6 text-xl font-medium text-neutral-darkest font-heading">Sustainable Shopping</h3>
            <p className="mt-2 text-base text-neutral-dark">Browse eco-friendly products that are good for you and the planet. Reduce waste and support sustainable practices.</p>
          </div>
          
          {/* Feature 2 */}
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-light bg-opacity-10 text-primary">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="mt-6 text-xl font-medium text-neutral-darkest font-heading">Support Local Sellers</h3>
            <p className="mt-2 text-base text-neutral-dark">Connect with local businesses and artisans in your community. Build relationships with sustainable sellers.</p>
          </div>
          
          {/* Feature 3 */}
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-light bg-opacity-10 text-primary">
              <Recycle className="h-8 w-8" />
            </div>
            <h3 className="mt-6 text-xl font-medium text-neutral-darkest font-heading">Reduce & Reuse</h3>
            <p className="mt-2 text-base text-neutral-dark">Find second-hand treasures and give items a new life. Extend product lifecycles and minimize environmental impact.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
