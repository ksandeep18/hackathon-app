import { useLocation } from "wouter";
import { MainLayout } from "@/components/layouts/main-layout";
import { ProductsGrid } from "@/components/products-grid";
import { ProductFilter } from "@/components/product-filter";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const [showFilters, setShowFilters] = useState(false);
  
  // Check if we're on products page or homepage
  const isShowingProducts = location.startsWith('/products') || searchParams.toString() !== '';
  
  // Parse search parameters
  const searchFilters = {
    query: searchParams.get('query') || undefined,
    category: searchParams.get('category') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    condition: searchParams.get('condition') || undefined,
    certifications: searchParams.get('certifications') || undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
    location: searchParams.get('location') || undefined,
    seller_id: searchParams.get('seller_id') ? Number(searchParams.get('seller_id')) : undefined,
    tags: searchParams.get('tags') || undefined,
    sort_by: searchParams.get('sort_by') as any || undefined
  };

  return (
    <MainLayout>
      {!isShowingProducts && (
        <div className="bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">
                Buy and Sell Eco-Friendly Products
              </h1>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                Join our community of eco-conscious buyers and sellers. Find unique, sustainable items or list your own.
              </p>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => window.location.href = '/products'}
              >
                Browse Products
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {isShowingProducts && (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <div className="md:hidden">
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="w-full mb-4"
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
              {showFilters && (
                <div className="mb-4">
                  <ProductFilter />
                </div>
              )}
            </div>
            
            {/* Desktop Filters */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <ProductFilter />
            </div>
            
            {/* Product Grid */}
            <div className="flex-1">
              <ProductsGrid searchParams={searchFilters} />
            </div>
          </div>
        )}
        
        {!isShowingProducts && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Featured Products
            </h2>
            <ProductsGrid />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
