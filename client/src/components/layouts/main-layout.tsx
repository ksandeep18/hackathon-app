import { ReactNode, useState } from "react";
import { Logo } from "@/components/ui/logo";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Footer } from "@/components/footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, User } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading, logoutMutation } = useAuth();
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <Logo />
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/">
                <a className={`text-sm font-medium ${location === '/' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
                  Home
                </a>
              </Link>
              <Link href="/products">
                <a className={`text-sm font-medium ${location === '/products' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
                  Products
                </a>
              </Link>
              <Link href="/categories">
                <a className={`text-sm font-medium ${location === '/categories' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
                  Categories
                </a>
              </Link>
              <Link href="/about">
                <a className={`text-sm font-medium ${location === '/about' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
                  About
                </a>
              </Link>
            </nav>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <SearchInput />
            </div>

            {/* User Menu */}
            <div className="flex items-center">
              {isLoading ? (
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/create-listing">
                    <Button size="sm">Sell Item</Button>
                  </Link>
                  <Link href="/profile">
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback>
                        {user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/auth">
                    <Button variant="ghost" size="sm">Sign in</Button>
                  </Link>
                  <Link href="/auth?tab=register">
                    <Button size="sm">Sign up</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-primary"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/">
                <a className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary">
                  Home
                </a>
              </Link>
              <Link href="/products">
                <a className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary">
                  Products
                </a>
              </Link>
              <Link href="/categories">
                <a className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary">
                  Categories
                </a>
              </Link>
              <Link href="/about">
                <a className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary">
                  About
                </a>
              </Link>
              <div className="px-3 py-2">
                <SearchInput />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-grow bg-gray-50">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
