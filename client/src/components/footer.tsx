import { Link } from "wouter";
import { Sprout, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-darkest">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Mission */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center">
              <Sprout className="text-2xl text-accent" />
              <span className="ml-2 text-xl font-bold text-white font-heading">EcoFinds</span>
            </div>
            <p className="mt-4 text-sm text-neutral-light">
              Connecting eco-conscious buyers and sellers to build a more sustainable future, one transaction at a time.
            </p>
            <div className="mt-6 flex space-x-6">
              <a href="#" className="text-neutral hover:text-accent">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-neutral hover:text-accent">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-neutral hover:text-accent">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-neutral hover:text-accent">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">Pinterest</span>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase font-heading">Shop</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/products">
                  <a className="text-neutral-light hover:text-accent text-sm">All Products</a>
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true">
                  <a className="text-neutral-light hover:text-accent text-sm">Featured Items</a>
                </Link>
              </li>
              <li>
                <Link href="/categories">
                  <a className="text-neutral-light hover:text-accent text-sm">Categories</a>
                </Link>
              </li>
              <li>
                <Link href="/search">
                  <a className="text-neutral-light hover:text-accent text-sm">Popular Searches</a>
                </Link>
              </li>
              <li>
                <Link href="/sellers">
                  <a className="text-neutral-light hover:text-accent text-sm">Seller Directory</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Sell */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase font-heading">Sell</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/create-listing">
                  <a className="text-neutral-light hover:text-accent text-sm">Start Selling</a>
                </Link>
              </li>
              <li>
                <Link href="/seller-guidelines">
                  <a className="text-neutral-light hover:text-accent text-sm">Seller Guidelines</a>
                </Link>
              </li>
              <li>
                <Link href="/eco-certification">
                  <a className="text-neutral-light hover:text-accent text-sm">Eco Certification</a>
                </Link>
              </li>
              <li>
                <Link href="/seller-resources">
                  <a className="text-neutral-light hover:text-accent text-sm">Seller Resources</a>
                </Link>
              </li>
              <li>
                <Link href="/success-stories">
                  <a className="text-neutral-light hover:text-accent text-sm">Success Stories</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase font-heading">About</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about">
                  <a className="text-neutral-light hover:text-accent text-sm">Our Mission</a>
                </Link>
              </li>
              <li>
                <Link href="/sustainability">
                  <a className="text-neutral-light hover:text-accent text-sm">Sustainability</a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-neutral-light hover:text-accent text-sm">Terms of Service</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-neutral-light hover:text-accent text-sm">Privacy Policy</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-neutral-light hover:text-accent text-sm">Contact Us</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-neutral-dark">
          <p className="text-center text-xs text-neutral-light">
            &copy; {new Date().getFullYear()} EcoFinds. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
