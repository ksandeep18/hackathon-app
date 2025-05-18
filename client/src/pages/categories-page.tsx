import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { MainLayout } from "@/components/layouts/main-layout";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ProductsGrid } from "@/components/products-grid";

// Category icons mapping
const categoryIcons: Record<string, JSX.Element> = {
  "Electronics": <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  "Clothing": <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 2L1 7m5-5v16m12 0V7m-5-5h5l-5 5m5-5H7" /></svg>,
  "Home & Garden": <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  "Sports & Outdoors": <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>,
  "Books & Media": <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  "Toys & Games": <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  "Health & Beauty": <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  "Furniture": <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  "Other": <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
};

export default function CategoriesPage() {
  const [location, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Fetch categories from the backend
  const { data: categories, isLoading } = useQuery<string[]>({
    queryKey: ['/api/categories'],
  });
  
  // If we navigate here with a query param, set the selected category
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const category = params.get('category');
    if (category) setSelectedCategory(category);
  }, [location]);
  
  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    navigate(`/categories?category=${encodeURIComponent(category)}`);
  };
  
  // Default categories to use if API fetch fails
  const defaultCategories = [
    "Electronics", "Clothing", "Home & Garden", "Sports & Outdoors", 
    "Books & Media", "Toys & Games", "Health & Beauty", "Furniture", "Other"
  ];
  
  // Use either API categories or defaults
  const displayCategories = categories || defaultCategories;
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold font-heading text-neutral-darkest mb-8">
          Browse Categories
        </h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {!selectedCategory ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayCategories.map((category) => (
                  <Card 
                    key={category}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleCategorySelect(category)}
                  >
                    <CardContent className="p-6 flex flex-col items-center justify-center">
                      <div className="mb-4">
                        {categoryIcons[category] || (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        )}
                      </div>
                      <h2 className="text-lg font-medium text-center">{category}</h2>
                      <p className="text-sm text-neutral-dark text-center mt-2">
                        Browse {category.toLowerCase()} items
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold font-heading text-neutral-darkest">
                    {selectedCategory}
                  </h2>
                  <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                    View All Categories
                  </Button>
                </div>
                
                <ProductsGrid searchParams={{ category: selectedCategory }} />
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}