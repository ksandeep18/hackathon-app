import { Sprout } from "lucide-react";
import { Link } from "wouter";

export function Logo() {
  return (
    <Link href="/">
      <a className="flex items-center">
        <Sprout className="text-3xl text-primary" />
        <span className="ml-2 text-2xl font-bold text-primary font-heading">EcoFinds</span>
      </a>
    </Link>
  );
}
