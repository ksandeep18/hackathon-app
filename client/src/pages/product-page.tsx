import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { MainLayout } from "@/components/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  MapPin, 
  CalendarDays, 
  Heart, 
  MessageCircle, 
  ArrowLeft, 
  Star, 
  StarHalf, 
  Edit, 
  Trash2,
  AlertCircle
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [favorite, setFavorite] = useState(false);
  
  // Fetch product data
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
  });

  // Check if product is in user's favorites
  const { data: favorites } = useQuery<Product[]>({
    queryKey: ['/api/favorites'],
    enabled: !!user,
  });

  // Check if product is in favorites when data is loaded
  useEffect(() => {
    if (favorites && product) {
      const isFavorited = favorites.some(fav => fav.id === product.id);
      setFavorite(isFavorited);
    }
  }, [favorites, product]);

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async () => {
      if (!product) return;
      await apiRequest("DELETE", `/api/products/${product.id}`);
    },
    onSuccess: () => {
      toast({ 
        title: "Product deleted",
        description: "Your listing has been removed successfully" 
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      navigate("/products");
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error deleting product",
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  // Toggle favorite status
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!user || !product) {
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

  // Format price from cents to dollars
  const formatCurrency = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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

  // Generate random review count and stars for demo purposes
  const getReviewDetails = (productId: number) => {
    // Use product ID to generate consistent values
    const reviewCount = (productId * 7) % 100 + 5;
    const starRating = 3 + ((productId % 10) / 5); // Between 3 and 5 stars
    
    return { count: reviewCount, rating: starRating };
  };
  
  // Render star rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex text-warning">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="fill-current" size={18} />
        ))}
        {hasHalfStar && <StarHalf className="fill-current" size={18} />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} size={18} />
        ))}
      </div>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              <Skeleton className="h-96 w-full rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-4/5" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-32 w-full" />
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-neutral-darkest mb-4">Product Not Found</h1>
          <p className="text-neutral-dark mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/products")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Get review details for the product
  const reviews = getReviewDetails(product.id);
  const isOwner = user && user.id === product.sellerId;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/products?category=${product.category.toLowerCase().replace(/\s+/g, '-')}`}>
                {product.category}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{product.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Product Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <img 
              src={getProductImage(product)} 
              alt={product.title} 
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Title and Badges */}
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-neutral-darkest font-heading">{product.title}</h1>
                {isOwner && (
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => navigate(`/edit-listing/${product.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your listing.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteProductMutation.mutate()}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            {deleteProductMutation.isPending ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
              
              <div className="flex items-center mt-2 space-x-2">
                <Badge 
                  variant={product.condition === "New" ? "default" : "secondary"}
                  className={product.condition === "New" ? "bg-accent" : ""}
                >
                  {product.condition}
                </Badge>
                {product.certifications && product.certifications.map((cert, index) => (
                  <Badge key={index} variant="secondary">{cert}</Badge>
                ))}
              </div>
            </div>
            
            {/* Price */}
            <div className="text-3xl font-semibold text-primary-dark">
              {formatCurrency(product.price)}
            </div>
            
            {/* Seller and Location */}
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center text-neutral-dark">
                <MapPin className="mr-1 h-4 w-4" />
                <span>{product.location || "Location not specified"}</span>
              </div>
              <div className="flex items-center text-neutral-dark">
                <CalendarDays className="mr-1 h-4 w-4" />
                <span>Listed on {formatDate(product.createdAt)}</span>
              </div>
            </div>
            
            {/* Rating */}
            <div className="flex items-center">
              {renderStars(reviews.rating)}
              <span className="ml-2 text-sm text-neutral-dark">{reviews.count} reviews</span>
            </div>
            
            {/* Description */}
            <div>
              <h3 className="text-lg font-medium text-neutral-darkest mb-2">Description</h3>
              <p className="text-neutral-dark whitespace-pre-line">{product.description}</p>
            </div>
            
            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, i) => (
                  <Badge key={i} variant="outline">{tag}</Badge>
                ))}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex items-center gap-4 pt-4">
              <Button className="flex-1" disabled={isOwner}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Seller
              </Button>
              
              {!isOwner && (
                <Button 
                  variant={favorite ? "default" : "outline"} 
                  className={favorite ? "bg-primary text-white" : ""}
                  size="icon"
                  onClick={() => toggleFavoriteMutation.mutate()}
                  disabled={toggleFavoriteMutation.isPending || !user}
                >
                  <Heart className={favorite ? "fill-current" : ""} />
                </Button>
              )}
            </div>
            
            {/* Not logged in message */}
            {!user && (
              <p className="text-sm text-neutral-dark">
                Please <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/auth")}>sign in</Button> to contact the seller or add to favorites.
              </p>
            )}
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-neutral-darkest font-heading mb-8">Similar Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* This would be a component that fetches similar products */}
            <div className="flex justify-center items-center p-12 border border-dashed rounded-lg border-neutral text-neutral-dark">
              Similar products would appear here
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
