import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product, SearchProductsInput } from "@shared/schema";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface ProductsGridProps {
  searchParams?: SearchProductsInput;
}

export function ProductsGrid({ searchParams = {} }: ProductsGridProps) {
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);
  const { user } = useAuth();
  
  // Fetch products based on search parameters
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products', searchParams],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Fetch user's favorites if logged in
  const { data: favoriteProducts } = useQuery<Product[]>({
    queryKey: ['/api/favorites'],
    enabled: !!user,
  });
  
  // Extract favorite product IDs when favorites are loaded
  useEffect(() => {
    if (favoriteProducts) {
      setFavorites(favoriteProducts.map(p => p.id));
    }
  }, [favoriteProducts]);
  
  // Calculate pagination
  const ITEMS_PER_PAGE = 9;
  const totalProducts = products?.length || 0;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const paginatedProducts = products?.slice(
    (page - 1) * ITEMS_PER_PAGE, 
    page * ITEMS_PER_PAGE
  );
  
  // Handle pagination
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-60 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-neutral-darkest mb-2">Error loading products</h3>
        <p className="text-neutral-dark">{error.message}</p>
      </div>
    );
  }
  
  // Empty state
  if (products?.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-neutral-darkest mb-2">No products found</h3>
        <p className="text-neutral-dark">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProducts?.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            isFavorited={favorites.includes(product.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div className="hidden md:flex">
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              // Show first page, last page, current page, and pages around current
              let pageNum: number;
              
              if (totalPages <= 5) {
                // If 5 or fewer pages, show all page numbers
                pageNum = i + 1;
              } else if (page <= 3) {
                // If near start, show first 5 pages
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                // If near end, show last 5 pages
                pageNum = totalPages - 4 + i;
              } else {
                // Show 2 before and 2 after current page
                pageNum = page - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  onClick={() => goToPage(pageNum)}
                  className="mx-1 min-w-[40px]"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="flex items-center"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
