import { ReactNode, useState } from "react";
import { Logo } from "@/components/ui/logo";
import { SearchInput } from "@/components/search-input";
import { MobileMenu } from "@/components/mobile-menu";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Footer } from "@/components/footer";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Package2Icon, 
  UserIcon, 
  Settings, 
  LogOut, 
  Menu
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading, logoutMutation } = useAuth();
  const [location] = useLocation();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getInitials = (name?: string): string => {
    if (!name) return "U";
    return name.split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
            {/* Logo */}
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Logo />
            </div>

            {/* Mobile menu button */}
            <div className="-mr-2 -my-2 md:hidden">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle mobile menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex space-x-10">
              <Link href="/">
                <a className={`text-base font-medium ${location === '/' ? 'text-primary' : 'text-neutral-darkest hover:text-primary'}`}>
                  Home
                </a>
              </Link>
              <Link href="/products">
                <a className={`text-base font-medium ${location === '/products' ? 'text-primary' : 'text-neutral-darkest hover:text-primary'}`}>
                  Explore
                </a>
              </Link>
              <Link href="/categories">
                <a className={`text-base font-medium ${location === '/categories' ? 'text-primary' : 'text-neutral-darkest hover:text-primary'}`}>
                  Categories
                </a>
              </Link>
              <Link href="/create-listing">
                <a className={`text-base font-medium ${location === '/create-listing' ? 'text-primary' : 'text-neutral-darkest hover:text-primary'}`}>
                  Sell
                </a>
              </Link>
              <Link href="/about">
                <a className={`text-base font-medium ${location === '/about' ? 'text-primary' : 'text-neutral-darkest hover:text-primary'}`}>
                  About
                </a>
              </Link>
            </nav>

            {/* Desktop right section */}
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              {/* Search Bar */}
              <div className="relative mx-4">
                <SearchInput />
              </div>

              {isLoading ? (
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-20" />
                  <Skeleton className="h-10 w-24" />
                </div>
              ) : user ? (
                <div className="flex items-center">
                  <Link href="/create-listing">
                    <Button variant="default" className="mr-4">
                      Create Listing
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="relative rounded-full h-8 w-8 p-0 overflow-hidden"
                      >
                        <Avatar>
                          <AvatarImage src={user.avatarUrl} alt={user.username} />
                          <AvatarFallback>{getInitials(user.fullName || user.username)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href="/profile">
                        <DropdownMenuItem className="cursor-pointer">
                          <UserIcon className="mr-2 h-4 w-4" />
                          <span>My Profile</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/my-listings">
                        <DropdownMenuItem className="cursor-pointer">
                          <Package2Icon className="mr-2 h-4 w-4" />
                          <span>My Listings</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/settings">
                        <DropdownMenuItem className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <>
                  <Link href="/auth">
                    <a className="whitespace-nowrap text-base font-medium text-neutral-darkest hover:text-primary">
                      Sign in
                    </a>
                  </Link>
                  <Link href="/auth?tab=register">
                    <Button className="ml-8">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      </header>

      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
