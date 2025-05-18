import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, isLoading, logoutMutation } = useAuth();
  const [location] = useLocation();
  
  const handleLogout = () => {
    logoutMutation.mutate();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="pt-2 pb-3 space-y-1">
        <Link href="/">
          <a 
            className={`block pl-3 pr-4 py-2 border-l-4 ${
              location === '/' 
                ? 'border-primary text-primary bg-neutral-lightest' 
                : 'border-transparent text-neutral-darkest hover:bg-neutral-lightest hover:border-accent hover:text-accent'
            } text-base font-medium`}
            onClick={onClose}
          >
            Home
          </a>
        </Link>
        <Link href="/products">
          <a 
            className={`block pl-3 pr-4 py-2 border-l-4 ${
              location === '/products' 
                ? 'border-primary text-primary bg-neutral-lightest' 
                : 'border-transparent text-neutral-darkest hover:bg-neutral-lightest hover:border-accent hover:text-accent'
            } text-base font-medium`}
            onClick={onClose}
          >
            Explore
          </a>
        </Link>
        <Link href="/categories">
          <a 
            className={`block pl-3 pr-4 py-2 border-l-4 ${
              location === '/categories' 
                ? 'border-primary text-primary bg-neutral-lightest' 
                : 'border-transparent text-neutral-darkest hover:bg-neutral-lightest hover:border-accent hover:text-accent'
            } text-base font-medium`}
            onClick={onClose}
          >
            Categories
          </a>
        </Link>
        <Link href="/create-listing">
          <a 
            className={`block pl-3 pr-4 py-2 border-l-4 ${
              location === '/create-listing' 
                ? 'border-primary text-primary bg-neutral-lightest' 
                : 'border-transparent text-neutral-darkest hover:bg-neutral-lightest hover:border-accent hover:text-accent'
            } text-base font-medium`}
            onClick={onClose}
          >
            Sell
          </a>
        </Link>
        <Link href="/about">
          <a 
            className={`block pl-3 pr-4 py-2 border-l-4 ${
              location === '/about' 
                ? 'border-primary text-primary bg-neutral-lightest' 
                : 'border-transparent text-neutral-darkest hover:bg-neutral-lightest hover:border-accent hover:text-accent'
            } text-base font-medium`}
            onClick={onClose}
          >
            About
          </a>
        </Link>
      </div>
      <div className="pt-4 pb-3 border-t border-neutral">
        <div className="px-4 flex items-center">
          {isLoading ? (
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="ml-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-1 h-3 w-32" />
              </div>
            </div>
          ) : user ? (
            <>
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatarUrl} alt={user.username} />
                  <AvatarFallback>
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-neutral-darkest">{user.fullName || user.username}</div>
                <div className="text-sm font-medium text-neutral-dark">{user.email}</div>
              </div>
            </>
          ) : (
            <div className="text-base font-medium text-neutral-darkest">Guest User</div>
          )}
        </div>
        <div className="mt-3 space-y-1">
          {user ? (
            <div>
              <Link href="/profile">
                <a 
                  className="block px-4 py-2 text-base font-medium text-neutral-darkest hover:bg-neutral-lightest hover:text-primary"
                  onClick={onClose}
                >
                  Your Profile
                </a>
              </Link>
              <Link href="/my-listings">
                <a 
                  className="block px-4 py-2 text-base font-medium text-neutral-darkest hover:bg-neutral-lightest hover:text-primary"
                  onClick={onClose}
                >
                  Your Listings
                </a>
              </Link>
              <Link href="/settings">
                <a 
                  className="block px-4 py-2 text-base font-medium text-neutral-darkest hover:bg-neutral-lightest hover:text-primary"
                  onClick={onClose}
                >
                  Settings
                </a>
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-base font-medium text-neutral-darkest hover:bg-neutral-lightest hover:text-primary"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div>
              <Link href="/auth">
                <a 
                  className="block px-4 py-2 text-base font-medium text-neutral-darkest hover:bg-neutral-lightest hover:text-primary"
                  onClick={onClose}
                >
                  Sign in
                </a>
              </Link>
              <Link href="/auth?tab=register">
                <a 
                  className="block px-4 py-2 text-base font-medium text-neutral-darkest hover:bg-neutral-lightest hover:text-primary"
                  onClick={onClose}
                >
                  Sign up
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
