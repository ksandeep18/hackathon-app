import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  name: string;
  slug: string;
}

export function CategoryFilter() {
  const [location, navigate] = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  
  // Extract current category from URL
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const currentCategory = searchParams.get('category') || 'all';

  // Hard-coded categories for demo
  const defaultCategories: Category[] = [
    { name: "All Products", slug: "all" },
    { name: "Home Goods", slug: "home-goods" },
    { name: "Fashion", slug: "fashion" },
    { name: "Beauty & Health", slug: "beauty-health" },
    { name: "Food & Drink", slug: "food-drink" },
    { name: "Garden", slug: "garden" },
    { name: "Electronics", slug: "electronics" },
    { name: "Toys & Games", slug: "toys-games" },
    { name: "Books & Media", slug: "books-media" },
    { name: "Art & Crafts", slug: "art-crafts" }
  ];

  // Fetch dynamic categories from API
  const { data: apiCategories, isLoading } = useQuery<string[]>({
    queryKey: ['/api/categories'],
    enabled: false, // Disabled for now - would enable in a real app
  });

  // Combine default categories with API categories
  const categories = apiCategories 
    ? [
        ...defaultCategories.slice(0, 1), // Keep "All Products"
        ...apiCategories.map(cat => ({ name: cat, slug: cat.toLowerCase().replace(/\s+/g, '-') }))
      ]
    : defaultCategories;

  const handleCategoryClick = (categorySlug: string) => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    
    if (categorySlug === 'all') {
      params.delete('category');
    } else {
      params.set('category', categorySlug);
    }
    
    // Preserve other search parameters
    const path = location.split('?')[0];
    const queryString = params.toString();
    navigate(`${path}${queryString ? `?${queryString}` : ''}`);
  };

  // Handle horizontal scrolling
  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftScroll(scrollLeft > 0);
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 200; // pixels to scroll
    const currentScroll = scrollContainerRef.current.scrollLeft;
    const targetScroll = direction === 'right' 
      ? currentScroll + scrollAmount 
      : currentScroll - scrollAmount;
      
    scrollContainerRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      // Initial check
      checkScrollButtons();
      
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
      };
    }
  }, [categories]);

  if (isLoading) {
    return (
      <div className="bg-neutral-lightest shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4 overflow-x-auto pb-3 pt-3 -mb-3 -mt-3 px-1 sm:px-0">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-28 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-lightest shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="relative flex-1">
            {/* Left scroll button */}
            {showLeftScroll && (
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-sm rounded-full h-8 w-8"
                onClick={() => scroll('left')}
              >
                <ChevronLeft size={16} />
              </Button>
            )}
            
            {/* Categories */}
            <div 
              ref={scrollContainerRef}
              className="flex items-center space-x-4 overflow-x-auto pb-3 pt-3 -mb-3 -mt-3 px-1 sm:px-0 scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((category) => (
                <Button
                  key={category.slug}
                  variant={currentCategory === category.slug ? "default" : "outline"}
                  className={`rounded-full px-4 py-2 whitespace-nowrap ${
                    currentCategory === category.slug 
                      ? "bg-primary text-white" 
                      : "bg-white border border-neutral hover:border-primary text-neutral-darkest hover:text-primary"
                  }`}
                  onClick={() => handleCategoryClick(category.slug)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
            
            {/* Right scroll button */}
            {showRightScroll && (
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-sm rounded-full h-8 w-8"
                onClick={() => scroll('right')}
              >
                <ChevronRight size={16} />
              </Button>
            )}
          </div>
          
          {/* Sort dropdown (hidden on mobile) */}
          <div className="hidden md:flex items-center">
            <span className="text-neutral-dark mr-2">Sort by:</span>
            <select className="bg-white border border-neutral rounded-md text-neutral-darkest py-1 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm">
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Popularity</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
