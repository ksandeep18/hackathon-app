import { useState } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertProductSchema } from "@shared/schema";
import { MainLayout } from "@/components/layouts/main-layout";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Info } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Extended schema for client-side validation
const extendedProductSchema = insertProductSchema.extend({
  price: z.coerce.number().min(1, "Price must be at least $1").max(10000, "Price cannot exceed $10,000"),
  tags: z.string().optional().transform(val => 
    val ? val.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : []
  ),
});

type ProductFormValues = z.infer<typeof extendedProductSchema>;

export default function CreateListingPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Prepare default form values
  const defaultValues: Partial<ProductFormValues> = {
    title: "",
    description: "",
    price: 0,
    category: "",
    condition: "",
    location: user?.location || "",
    tags: "",
    certifications: [],
  };

  // Initialize form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(extendedProductSchema),
    defaultValues,
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      // Convert any tags string to array
      const formattedData = {
        ...data,
        tags: Array.isArray(data.tags) ? data.tags : data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
      };

      const res = await apiRequest("POST", "/api/products", formattedData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Listing created",
        description: "Your product has been successfully listed!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      navigate("/my-listings");
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating listing",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: ProductFormValues) => {
    createProductMutation.mutate(data);
  };

  // Handle image upload (in a real app, this would upload to a server/cloud storage)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // In a real implementation, you would upload the file to a server and get a URL back
      // The URL would then be stored in the form data
      // form.setValue("imageUrl", uploadedUrl);
    }
  };

  // Available categories
  const categories = [
    "Home Goods",
    "Fashion",
    "Beauty & Health",
    "Food & Drink",
    "Garden",
    "Electronics",
    "Toys & Games",
    "Books & Media",
    "Art & Crafts",
    "Other"
  ];

  // Available conditions
  const conditions = [
    "New",
    "Like New",
    "Good",
    "Used",
    "Fair"
  ];

  // Available certifications
  const certifications = [
    "Organic",
    "Fair Trade",
    "Recycled",
    "Biodegradable",
    "Eco-Friendly",
    "Sustainable",
    "Handmade"
  ];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading text-neutral-darkest">Create a New Listing</h1>
          <p className="mt-2 text-neutral-dark">
            List your sustainable product on EcoFinds and connect with eco-conscious buyers.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Provide the essential details about your product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a descriptive title" {...field} />
                      </FormControl>
                      <FormDescription>
                        A clear, concise name for your product (max 100 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description field */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your product in detail" 
                          className="min-h-32" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Include condition, dimensions, materials, and why it's sustainable
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price field */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-dark">$</span>
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            placeholder="0.00" 
                            className="pl-8" 
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category field */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category*</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Condition field */}
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condition*</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {conditions.map((condition) => (
                            <SelectItem key={condition} value={condition}>
                              {condition}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>
                  Add more details to make your listing stand out
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Location field */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, State" {...field} />
                      </FormControl>
                      <FormDescription>
                        Where is the item located? (e.g. Portland, OR)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tags field */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Tags
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                                <Info className="h-3 w-3" />
                                <span className="sr-only">Tags info</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Separate tags with commas (e.g. vintage, handmade, organic)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="vintage, handmade, organic" {...field} />
                      </FormControl>
                      <FormDescription>
                        Add search terms to help buyers find your product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Certifications field */}
                <FormField
                  control={form.control}
                  name="certifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Eco Certifications</FormLabel>
                      <div className="grid grid-cols-2 gap-2">
                        {certifications.map((cert) => (
                          <div key={cert} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`cert-${cert}`}
                              value={cert}
                              checked={(field.value || []).includes(cert)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                const updatedCerts = checked
                                  ? [...(field.value || []), cert]
                                  : (field.value || []).filter(
                                      (value) => value !== cert
                                    );
                                field.onChange(updatedCerts);
                              }}
                              className="h-4 w-4 text-primary border-neutral rounded focus:ring-primary"
                            />
                            <Label htmlFor={`cert-${cert}`} className="text-sm">
                              {cert}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <FormDescription>
                        Select any applicable eco-friendly certifications
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload (not functional in this demo) */}
                <div className="space-y-3">
                  <Label htmlFor="product-image">Product Image</Label>
                  <div className="flex items-center gap-4">
                    <div className="border border-dashed border-neutral rounded-lg p-4 flex-1">
                      <Input
                        id="product-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-neutral-dark mt-2">
                        Upload a clear, well-lit photo of your product. Max size: 5MB
                      </p>
                    </div>
                    {imagePreview && (
                      <div className="h-24 w-24 rounded-md overflow-hidden border border-neutral">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-neutral-dark italic">
                    Note: Image upload is not functional in this demo. A placeholder will be used.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/products")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createProductMutation.isPending}
                >
                  {createProductMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : "Create Listing"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </MainLayout>
  );
}
