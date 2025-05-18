import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Star, StarHalf } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

interface ProductCardProps {
  product: Product;
  isFavorited?: boolean;
}

export function ProductCard({ product, isFavorited = false }: ProductCardProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [favorite, setFavorite] = useState(isFavorited);

  // Format price from cents to dollars
  const formatCurrency = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  // Generate placeholder product image if none exists
  const getProductImage = (product: Product) => {
    if (product.imageUrl) {
      return product.imageUrl;
    }
    
    const placeholders = [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8",
      "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec",
      "https://pixabay.com/get/ge272bb69aa9238288d54ddb1ba37228c7038c59161501e8b4d285b34c1163baa216b8114633075de8a0fac0dbcb25c6ea288eae5dd99776c9350e2c67769fddc_1280.png",
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
      "https://pixabay.com/get/g4b2f45b23c5a830e3f197563ac752acd4ebfec9bb3639633d0a86c65e2102d31fdf890a2d8ef156abbd32f314f7d7821e5b96e70613e5fcad37489d047e499d1_1280.jpg"
    ];
    
    // Use consistent image based on product id
    const index = product.id % placeholders.length;
    return placeholders[index];
  };

  // Get badge type based on product condition or certifications
  const getBadgeType = (product: Product) => {
    if (product.certifications && product.certifications.includes("Eco-Friendly")) {
      return { text: "Eco-Friendly", variant: "accent" as const };
    }
    
    if (product.condition === "New") {
      return { text: "New", variant: "secondary" as const };
    }
    
    if (product.condition === "Like New") {
      return { text: "Like New", variant: "secondary" as const };
    }
    
    return { text: "Second-hand", variant: "secondary" as const };
  };

  // Generate random review count and stars for demo purposes
  const getReviewDetails = (productId: number) => {
    // Use product ID to generate consistent values
    const reviewCount = (productId * 7) % 100 + 5;
    const starRating = 3 + ((productId % 10) / 5); // Between 3 and 5 stars
    
    return { count: reviewCount, rating: starRating };
  };

  const reviews = getReviewDetails(product.id);
  const badge = getBadgeType(product);

  // Toggle favorite status
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("You must be logged in to favorite items");
      }
      
      if (favorite) {
        await apiRequest("DELETE", `/api/favorites/${product.id}`);
      } else {
        await apiRequest("POST", `/api/favorites/${product.id}`);
      }
      return !favorite;
    },
    onSuccess: (newFavoriteState) => {
      setFavorite(newFavoriteState);
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      toast({
        description: newFavoriteState 
          ? "Product added to favorites" 
          : "Product removed from favorites",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        description: error.message,
      });
    }
  });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteMutation.mutate();
  };

  // Render star rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex text-warning">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="fill-current" size={14} />
        ))}
        {hasHalfStar && <StarHalf className="fill-current" size={14} />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} size={14} />
        ))}
      </div>
    );
  };

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="overflow-hidden card-hover">
        <div className="relative pb-2/3 h-60">
          <img 
            src={getProductImage(product)} 
            alt={product.title} 
            className="absolute h-full w-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge 
              variant={badge.variant === "accent" ? "default" : "secondary"}
              className={badge.variant === "accent" ? "bg-accent" : ""}
            >
              {badge.text}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-neutral-darkest font-heading truncate">
              {product.title}
            </h3>
            <span className="text-primary-dark font-semibold">
              {formatCurrency(product.price)}
            </span>
          </div>
          <div className="mt-1 flex items-center">
            {renderStars(reviews.rating)}
            <span className="ml-1 text-xs text-neutral-dark">
              {reviews.count} reviews
            </span>
          </div>
          <p className="mt-2 text-sm text-neutral-dark line-clamp-2">
            {product.description}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-neutral-dark flex items-center">
              <MapPin className="mr-1" size={12} />
              <span>{product.location || "Portland, OR"}</span>
            </span>
            <button 
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                favorite 
                  ? "bg-primary text-white" 
                  : "bg-neutral-lightest hover:bg-primary hover:text-white"
              } transition-colors`}
              onClick={handleFavoriteClick}
              disabled={toggleFavoriteMutation.isPending}
            >
              <Heart className={favorite ? "fill-current" : ""} size={16} />
            </button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
