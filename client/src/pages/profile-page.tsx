import { useState } from "react";
import { MainLayout } from "@/components/layouts/main-layout";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@shared/schema";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  Package2Icon, 
  Heart, 
  Settings, 
  MapPin, 
  Mail, 
  User,
  Calendar,
  Loader2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("listings");
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    location: user?.location || "",
    bio: user?.bio || ""
  });
  
  // Fetch user's listings
  const { data: userListings, isLoading: isLoadingListings } = useQuery<Product[]>({
    queryKey: ['/api/user/products'],
    enabled: !!user,
  });
  
  // Fetch user's favorites
  const { data: userFavorites, isLoading: isLoadingFavorites } = useQuery<Product[]>({
    queryKey: ['/api/favorites'],
    enabled: !!user,
  });
  
  if (!user) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }
  
  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const getInitials = (name?: string): string => {
    if (!name) return user.username.charAt(0).toUpperCase();
    return name.split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback className="text-2xl">{getInitials(user.fullName)}</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl font-heading">{user.fullName || user.username}</CardTitle>
                <CardDescription>EcoFinds Member</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-neutral-dark">
                  <User className="mr-2 h-4 w-4" />
                  <span>{user.username}</span>
                </div>
                {user.email && (
                  <div className="flex items-center text-neutral-dark">
                    <Mail className="mr-2 h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center text-neutral-dark">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="flex items-center text-neutral-dark">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Member since {formatDate(user.createdAt)}</span>
                </div>
                {user.bio && (
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium text-neutral-darkest mb-2">About</h3>
                    <p className="text-neutral-dark text-sm">{user.bio}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Main Content Area */}
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8">
                <TabsTrigger value="listings" className="flex items-center">
                  <Package2Icon className="mr-2 h-4 w-4" />
                  My Listings
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex items-center">
                  <Heart className="mr-2 h-4 w-4" />
                  Favorites
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
              
              {/* My Listings Tab */}
              <TabsContent value="listings">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold font-heading text-neutral-darkest">My Listings</h2>
                    <Button onClick={() => window.location.href = "/create-listing"}>
                      Add New Listing
                    </Button>
                  </div>
                  
                  {isLoadingListings ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex flex-col space-y-3">
                          <Skeleton className="h-60 w-full rounded-lg" />
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-4/5" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : userListings && userListings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {userListings.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Package2Icon className="h-12 w-12 text-neutral mb-4" />
                        <h3 className="text-xl font-medium text-neutral-darkest mb-2">No listings yet</h3>
                        <p className="text-neutral-dark text-center mb-6">
                          Start selling your sustainable products on EcoFinds today!
                        </p>
                        <Button onClick={() => window.location.href = "/create-listing"}>
                          Create Your First Listing
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              {/* Favorites Tab */}
              <TabsContent value="favorites">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold font-heading text-neutral-darkest">Saved Items</h2>
                  
                  {isLoadingFavorites ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex flex-col space-y-3">
                          <Skeleton className="h-60 w-full rounded-lg" />
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-4/5" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : userFavorites && userFavorites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {userFavorites.map((product) => (
                        <ProductCard key={product.id} product={product} isFavorited={true} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Heart className="h-12 w-12 text-neutral mb-4" />
                        <h3 className="text-xl font-medium text-neutral-darkest mb-2">No favorites yet</h3>
                        <p className="text-neutral-dark text-center mb-6">
                          Browse products and save your favorites for later!
                        </p>
                        <Button onClick={() => window.location.href = "/products"}>
                          Explore Products
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                      Update your profile information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Image */}
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={user.avatarUrl} alt={user.username} />
                        <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-neutral-darkest mb-2">Profile Picture</h3>
                        <Button variant="outline" size="sm">
                          Change Photo
                        </Button>
                      </div>
                    </div>
                    
                    {/* Profile Form */}
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="fullName" className="text-sm font-medium text-neutral-darkest">Full Name</label>
                        <Input id="fullName" defaultValue={user.fullName || ""} placeholder="Your full name" />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-neutral-darkest">Email</label>
                        <Input id="email" defaultValue={user.email || ""} placeholder="Your email address" />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="location" className="text-sm font-medium text-neutral-darkest">Location</label>
                        <Input id="location" defaultValue={user.location || ""} placeholder="City, State" />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="bio" className="text-sm font-medium text-neutral-darkest">About Me</label>
                        <Textarea 
                          id="bio" 
                          defaultValue={user.bio || ""} 
                          placeholder="Tell others about yourself and your interest in sustainable products"
                          rows={4}
                        />
                      </div>
                    </div>
                    
                    {/* Password Change */}
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium text-neutral-darkest mb-4">Change Password</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="currentPassword" className="text-sm font-medium text-neutral-darkest">Current Password</label>
                          <Input id="currentPassword" type="password" placeholder="Enter your current password" />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="newPassword" className="text-sm font-medium text-neutral-darkest">New Password</label>
                          <Input id="newPassword" type="password" placeholder="Enter your new password" />
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-darkest">Confirm New Password</label>
                          <Input id="confirmPassword" type="password" placeholder="Confirm your new password" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
