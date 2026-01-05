import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-neutral-card border-b border-neutral-border sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <MapPin className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-neutral-text leading-tight">Halal Eats</h1>
            <span className="text-xs text-neutral-secondary">Ottawa</span>
          </div>
        </Link>
        
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-neutral-text hover:text-primary transition">
            Explore
          </Link>
        </nav>
      </div>
    </header>
  );
}
