import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchInput() {
  const [location, navigate] = useLocation();
  const searchParams = useSearch();
  const currentQuery = new URLSearchParams(searchParams).get("query") || "";
  const [query, setQuery] = useState(currentQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?query=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search products..."
          className="w-full pl-10 pr-4 py-2 rounded-full border border-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-dark">
          <Search className="h-4 w-4" />
        </div>
      </div>
    </form>
  );
}
