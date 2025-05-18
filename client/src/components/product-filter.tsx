import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";

interface FilterState {
  minPrice: string;
  maxPrice: string;
  condition: string[];
  certifications: string[];
  rating: string;
}

export function ProductFilter({ onFilterChange }: { onFilterChange?: (filters: any) => void }) {
  const [location, setLocation] = useLocation();
  const [filters, setFilters] = useState<FilterState>({
    minPrice: "",
    maxPrice: "",
    condition: [],
    certifications: [],
    rating: "any",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: keyof FilterState, value: string, checked: boolean) => {
    setFilters((prev) => {
      const currentValues = prev[name] as string[];
      if (checked) {
        return { ...prev, [name]: [...currentValues, value] };
      } else {
        return { ...prev, [name]: currentValues.filter(v => v !== value) };
      }
    });
  };

  const handleRadioChange = (value: string) => {
    setFilters((prev) => ({ ...prev, rating: value }));
  };

  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
    
    // Create query string from filters
    const params = new URLSearchParams(window.location.search);
    
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    else params.delete('minPrice');
    
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    else params.delete('maxPrice');
    
    if (filters.condition.length > 0) params.set('condition', filters.condition.join(','));
    else params.delete('condition');
    
    if (filters.certifications.length > 0) params.set('certifications', filters.certifications.join(','));
    else params.delete('certifications');
    
    if (filters.rating !== 'any') params.set('rating', filters.rating);
    else params.delete('rating');
    
    // Update URL with filters
    const path = location.split('?')[0];
    const queryString = params.toString();
    setLocation(`${path}${queryString ? `?${queryString}` : ''}`);
  };

  const clearFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      condition: [],
      certifications: [],
      rating: "any",
    });
    
    // Clear query params but keep search term if any
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');
    
    const path = location.split('?')[0];
    setLocation(query ? `${path}?query=${query}` : path);
    
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  return (
    <div className="sticky top-24">
      <h2 className="text-lg font-medium text-neutral-darkest font-heading">Filters</h2>
      
      {/* Price Range */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-neutral-darkest">Price Range</h3>
        <div className="mt-2 space-y-4">
          <div className="flex items-center justify-between">
            <Input
              type="number"
              name="minPrice"
              placeholder="Min"
              className="w-20 py-1 px-2"
              value={filters.minPrice}
              onChange={handleInputChange}
            />
            <span className="text-neutral-dark mx-2">-</span>
            <Input
              type="number"
              name="maxPrice"
              placeholder="Max"
              className="w-20 py-1 px-2"
              value={filters.maxPrice}
              onChange={handleInputChange}
            />
          </div>
          <Button className="w-full" size="sm" onClick={applyFilters}>Apply</Button>
        </div>
      </div>
      
      {/* Condition */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-neutral-darkest">Condition</h3>
        <div className="mt-2 space-y-2">
          {['New', 'Like New', 'Good', 'Used'].map((condition) => (
            <div className="flex items-center space-x-2" key={condition}>
              <Checkbox 
                id={`condition-${condition}`}
                checked={filters.condition.includes(condition)}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('condition', condition, checked as boolean)
                }
              />
              <Label 
                htmlFor={`condition-${condition}`}
                className="text-sm text-neutral-darkest"
              >
                {condition}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Eco Certifications */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-neutral-darkest">Eco Certifications</h3>
        <div className="mt-2 space-y-2">
          {['Organic', 'Fair Trade', 'Recycled', 'Biodegradable'].map((cert) => (
            <div className="flex items-center space-x-2" key={cert}>
              <Checkbox 
                id={`cert-${cert}`}
                checked={filters.certifications.includes(cert)}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('certifications', cert, checked as boolean)
                }
              />
              <Label 
                htmlFor={`cert-${cert}`}
                className="text-sm text-neutral-darkest"
              >
                {cert}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Seller Rating */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-neutral-darkest">Seller Rating</h3>
        <RadioGroup 
          value={filters.rating} 
          onValueChange={handleRadioChange}
          className="mt-2 space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4+" id="r4" />
            <Label htmlFor="r4" className="text-sm text-neutral-darkest flex items-center">
              4+ <span className="text-warning ml-1">★</span> & up
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3+" id="r3" />
            <Label htmlFor="r3" className="text-sm text-neutral-darkest flex items-center">
              3+ <span className="text-warning ml-1">★</span> & up
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="any" id="rany" />
            <Label htmlFor="rany" className="text-sm text-neutral-darkest">
              Any rating
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Clear Filters */}
      <div className="mt-8">
        <Button 
          variant="ghost" 
          className="text-primary hover:text-primary-dark text-sm font-medium flex items-center p-0"
          onClick={clearFilters}
        >
          <RefreshCw className="mr-1 h-4 w-4" />
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}
