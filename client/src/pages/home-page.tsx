import { useLocation } from "wouter";
import { MainLayout } from "@/components/layouts/main-layout";
import { HeroSection } from "@/components/hero-section";
import { CategoryFilter } from "@/components/category-filter";
import { ProductsGrid } from "@/components/products-grid";
import { ProductFilter } from "@/components/product-filter";
import { FeatureSection } from "@/components/feature-section";
import { CallToAction } from "@/components/call-to-action";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function HomePage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  
  // Check if we're on products page or homepage
  const isShowingProducts = location.startsWith('/products') || searchParams.toString() !== '';
  
  // Parse search parameters
  const searchFilters = {
    query: searchParams.get('query') || undefined,
    category: searchParams.get('category') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    condition: searchParams.get('condition') ? searchParams.get('condition')!.split(',') : undefined,
    certifications: searchParams.get('certifications') ? searchParams.get('certifications')!.split(',') : undefined,
  };

  return (
    <MainLayout>
      {/* Show Hero section only on homepage */}
      {!isShowingProducts && <HeroSection />}
      
      {/* Category Filter only when showing products */}
      {isShowingProducts && <CategoryFilter />}
      
      {/* Product Listings */}
      <section className="py-12 bg-neutral-lightest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isShowingProducts ? (
            <div className="flex flex-col md:flex-row gap-8">
              {/* Mobile Filter Toggle Button */}
              <div className="md:hidden mb-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex items-center text-neutral-darkest"
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      <span>Filter Products</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filter Products</SheetTitle>
                    </SheetHeader>
                    <div className="py-4">
                      <ProductFilter />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              
              {/* Filters Sidebar (Desktop) */}
              <div className="hidden md:block w-64 flex-shrink-0">
                <ProductFilter />
              </div>
              
              {/* Product Grid */}
              <div className="flex-1">
                <ProductsGrid searchParams={searchFilters} />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-neutral-darkest mb-6 font-heading">
                  Featured Products
                </h2>
                <ProductsGrid />
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Additional sections for homepage */}
      {!isShowingProducts && (
        <>
          <FeatureSection />
          <CallToAction />
        </>
      )}
    </MainLayout>
  );
}
